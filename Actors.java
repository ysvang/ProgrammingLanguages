// Author: Scott Vang
// Problem 28.1 and 28.2: Actors Style

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.concurrent.*;

import com.google.common.io.Files;
import com.google.common.base.Charsets;

public class Ch28 {

    public static void main(String[] args) throws IOException {

        WordFrequencyManager word_freq_manager = new WordFrequencyManager();
            
        DataStorageManager storage_manager = new DataStorageManager();
        List<Object> init_wordFreqManager = new ArrayList<Object>();
        init_wordFreqManager.add("init");
        init_wordFreqManager.add(args[0]);
        init_wordFreqManager.add(word_freq_manager);
        storage_manager.send(init_wordFreqManager);

        WordFrequencyController wfcontroller = new WordFrequencyController();
        List<Object> run_storageManager = new ArrayList<Object>();
        run_storageManager.add("run");
        run_storageManager.add(storage_manager);
        wfcontroller.send(run_storageManager);
        
        try{
    		word_freq_manager.join(); 
    		storage_manager.join();
    		wfcontroller.join();
    	} catch (InterruptedException e){
    		System.out.println("got interrupted");
    	}
    }
}

abstract class ActiveWFObject extends Thread {
	public String name;
    public BlockingQueue<List<Object>> queue;
    public boolean _stop;
    ActiveWFObject(){
        this.queue = new ArrayBlockingQueue<List<Object>>(100);
        this._stop = false;
        start();
    }
    
    public abstract void _dispatch(List<Object> message);
    
    public void send(List<Object> message){
    	try{
    		this.queue.put(message);
    	} catch (InterruptedException e){
    		System.out.println("interrupted");
    	}
    }
    
    public void run() {
        while (!this._stop){
            List<Object> message = null;
			try {
				message = this.queue.take();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
            this._dispatch(message);
            String message_0 = (String) message.get(0);
            if (message_0.equals("die")){
                this._stop = true;
            }
        }
    }
}

class DataStorageManager extends ActiveWFObject{
    public String _data = "";
    public Set<String> _stop_words;
    public WordFrequencyManager _word_freqs_manager;
    
    public void _dispatch(List<Object> message){
    	String message_0 = (String) message.get(0);
        if (message_0.equals("init")){
            this._init(message.subList(1, message.size()));
        } else if (message_0.equals("send_word_freqs")){
        	this._process_words(message.subList(1, message.size()));
        }else{
        	this._word_freqs_manager.send(message);
        }
    }
    
    public void _init(List<Object> message){
        String path_to_file = (String)message.get(0);
        File inputStream = new File(path_to_file);
        try {
			this._data = Files.toString(inputStream, Charsets.UTF_8);
		} catch (IOException e) {
			e.printStackTrace();
		}
        this._data = this._data.replaceAll("[^A-Za-z0-9]", " ").toLowerCase();

        inputStream = new File("../stop_words.txt");
        String[] stopWordsData = null;
        try {
			stopWordsData = Files.toString(inputStream, Charsets.UTF_8).toLowerCase().split(",");
		} catch (IOException e) {
			e.printStackTrace();
		}
        this._stop_words = new HashSet<String>(Arrays.asList(stopWordsData)); 
        this._word_freqs_manager = (WordFrequencyManager) message.get(1);
    }
    
    public void _process_words(List<Object> message){
        WordFrequencyController recipient = (WordFrequencyController)message.get(0);
        String data_str = this._data;
        String[] words = data_str.split("\\s+");
        for (String word : words){
        	List<Object> filterWordMsg = new ArrayList<Object>();
        	filterWordMsg.add(word);
        	this._filter(filterWordMsg);
        }
        List<Object> top25RecipientMsg = new ArrayList<Object>();
        top25RecipientMsg.add("top25");
        top25RecipientMsg.add(recipient);
        this._word_freqs_manager.send(top25RecipientMsg);
    }  
    
	public void _filter(List<Object> message){
		String word = (String) message.get(0);
		if (!this._stop_words.contains(word) && (word.length() > 1)){
			List<Object> word_Word_Msg = new ArrayList<Object>();
			word_Word_Msg.add("word");
			word_Word_Msg.add(word);
			//System.out.println(word);
			this._word_freqs_manager.send(word_Word_Msg);
		}
	}
      
}



class WordFrequencyManager extends ActiveWFObject{
	Map<String, Integer> _word_freqs = new HashMap<String, Integer>();
	
	public void _dispatch(List<Object> message){
		if (message.get(0).equals("word")){
			this._increment_count(message.subList(1, message.size()));
		} else if (message.get(0).equals("top25")){
			this._top25(message.subList(1, message.size()));
		}
	}
	
	public void _increment_count(List<Object> message){
		String word = (String) message.get(0);
		if (this._word_freqs.containsKey(word)){
			this._word_freqs.put(word, this._word_freqs.get(word)+1);
		} else {
			this._word_freqs.put(word, 1);
		}
	}
	
	public void _top25(List<Object> message){
		
		WordFrequencyController recipient = (WordFrequencyController) message.get(0);
		MapSorter mapComparator =  new MapSorter(this._word_freqs);
        TreeMap<String,Integer> freqs_sorted = new TreeMap<String,Integer>(mapComparator);
        freqs_sorted.putAll(this._word_freqs);
        List<Object> top25_freqs_sorted = new ArrayList<Object>();
        top25_freqs_sorted.add("top25");
        top25_freqs_sorted.add(freqs_sorted);
        recipient.send(top25_freqs_sorted);
	}
}

class WordFrequencyController extends ActiveWFObject{
	public DataStorageManager _storage_manager;
	
	public void _dispatch(List<Object> message){
		String message_0 = (String) message.get(0);
		if (message_0.equals("run")){
			this._run(message.subList(1, message.size()));
		} else if (message_0.equals("top25")){
			this._display(message.subList(1, message.size()));
		} else {
			System.out.println("Message not understood " + message_0); //
		}
	}
	
	public void _run(List<Object> message){
		this._storage_manager = (DataStorageManager) message.get(0);
		List<Object> sendWordFreqThis = new ArrayList<Object>();
		sendWordFreqThis.add("send_word_freqs");
		sendWordFreqThis.add(this);
		this._storage_manager.send(sendWordFreqThis);
	}
	
	public void _display(List<Object> message){
		@SuppressWarnings("unchecked")
		Map<String,Integer> word_freqs = (TreeMap<String,Integer>) message.get(0);
		int k = 0;
        for (Map.Entry<String, Integer> entry : word_freqs.entrySet()){
            System.out.println(entry.getKey() + "  -  " + entry.getValue());
            k++;
            if (k > 24){
            	break;
            }
        }
        List<Object> storageManagerDie = new ArrayList<Object>();
        storageManagerDie.add("die");
        this._storage_manager.send(storageManagerDie);
        this._stop = true;	
	}
}

class MapSorter implements Comparator<String> {

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