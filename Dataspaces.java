// Author: Scott Vang
// Problem 29.1 and 29.2: Dataspaces Style

import java.io.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.concurrent.*;

import com.google.common.io.Files;
import com.google.common.base.Charsets;

public class Ch29 {
	
	public static ConcurrentLinkedQueue<String> word_space = new ConcurrentLinkedQueue<String>();
	public static BlockingQueue<Map<String, Integer>> freq_space = new ArrayBlockingQueue<Map<String, Integer>>(100);
	public static Map<String, Integer> word_freqs = Collections.synchronizedMap(new HashMap<String, Integer>());
	public static Set<String> stopwords;
	
	public static void getStopWord(){
		File inputStream = new File("../stop_words.txt");
	    String[] stopWordsData = null;
	    try {
			stopWordsData = Files.toString(inputStream, Charsets.UTF_8).toLowerCase().split(",");
		} catch (IOException e) {
			e.printStackTrace();
		}
	    stopwords = new HashSet<String>(Arrays.asList(stopWordsData)); 
	}
    
	public static void fillWordSpace(String path_to_file){
        File inputStream = new File(path_to_file);
        String data = "";
        String[] dataTokens = null;
        try {
			data = Files.toString(inputStream, Charsets.UTF_8);
		} catch (IOException e) {
			e.printStackTrace();
		}
        dataTokens = data.replaceAll("[^A-Za-z0-9]", " ").toLowerCase().split("\\s+");
        for (String word : dataTokens){
        	if (word.length() > 1) {
				word_space.add(word);
        	}
        }
	}
    
	public static void process_words(){
		Map<String, Integer> word_freqs = new HashMap<String, Integer>();
		String word = "";
		while (true){
			if (word_space.isEmpty()){
				break;
			} 
			word = word_space.poll();
			if(!stopwords.contains(word)){
				if (word_freqs.containsKey(word)){
					word_freqs.put(word, word_freqs.get(word)+1);
				} else {
					word_freqs.put(word, 1);
				}
			}
		}
		try {
			freq_space.put(word_freqs);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	public static void merge_Freqs() throws InterruptedException{
		Map<String, Integer> freqs;
		while (true){
			if (freq_space.isEmpty()){
				break;
			} 
			freqs = freq_space.take();
			for(Map.Entry<String, Integer> entry : freqs.entrySet()){
				int count = 0;
				if (word_freqs.containsKey(entry.getKey())){
					count = freqs.get(entry.getKey()) + word_freqs.get(entry.getKey());
				} else {
					count = freqs.get(entry.getKey());
				}
				word_freqs.put(entry.getKey(), count);
			}
		}
	}
	
	
	public static class ProcessWordThreadedObject extends Thread{
		ProcessWordThreadedObject(){
			start();
		}
		
		public void run(){
			process_words();
		}
	}	
	
	
	public static class FreqMergingThreadedObject extends Thread{
		FreqMergingThreadedObject(){
			start();
		}
		
		public void run(){
			try {
				merge_Freqs();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}	
	
	// Auxiliary method
	public static class MapSorter implements Comparator<String> {

	    Map<String, Integer> pair;
	    public MapSorter(Map<String, Integer> unsortedMap) {
	        this.pair = unsortedMap;
	    }
	  
	    public int compare(String a, String b) {
	        if (pair.get(a) >= pair.get(b)) {
	            return -1;
	        } else {
	            return 1;
	        } 
	    }
	}
	
	
	public static void main(String args[]) throws InterruptedException{
		getStopWord(); // fill up stop word Set
		fillWordSpace(args[0]); // fill up word_space
		
		// Create 5 threads to fill up freq_space concurrently
		ProcessWordThreadedObject threads[] = new ProcessWordThreadedObject[5];
		for (int i = 0; i < threads.length; i++){
			threads[i] = new ProcessWordThreadedObject();
		}
		// wait for those 5 threads to complete
		for (int i = 0; i < threads.length; i++){
			threads[i].join();
		}
        // Create 5 threads to fill up word_freqs map concurrently
		FreqMergingThreadedObject mergeThreads[] = new FreqMergingThreadedObject[5];
		for (int i = 0; i < mergeThreads.length; i++){
			mergeThreads[i] = new FreqMergingThreadedObject();
		}
		// wait for those 5 threads to complete
		for (int i = 0; i < mergeThreads.length; i++){
			mergeThreads[i].join();
		}
		// sort the map by value (frequency)
		MapSorter mapComparator =  new MapSorter(word_freqs);
        TreeMap<String,Integer> freqs_sorted = new TreeMap<String,Integer>(mapComparator);
        freqs_sorted.putAll(word_freqs);
        
		int k = 0;
        for (Map.Entry<String, Integer> entry : freqs_sorted.entrySet()){
            System.out.println(entry.getKey() + "  -  " + entry.getValue());
            k++;
            if (k > 24){
            	break;
            }
        }
	}
}
	
	
