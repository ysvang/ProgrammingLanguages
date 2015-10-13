/* Author: Scott Vang
 * Problem 4.1 and 4.4: Cookbook style 
 */

#include <iostream>
#include <fstream>
#include <map>
#include <string>
#include <cctype>
#include <vector>
#include <set>
#include <boost/tokenizer.hpp>
using namespace std;

// The shared mutable data
string textFileData;  // string consisting of data from input file
map<string, int> word_freqs;  // (term, freq) pair map
map<int, vector<string> > word_freqs_flipped;  // (freq, vector of terms) pair map
vector<string> words; // vector containing words of input file

// Function Prototypes
void read_file(char* file);
void filter_chars_and_normalize();
void scan();
void remove_stop_words();
void frequencies();
void sort();
void print_out();

// Main Program
int main(int argc, char* argv[]){

	read_file(argv[1]);
	filter_chars_and_normalize();
	scan();
	remove_stop_words();
	frequencies();
	sort();
	print_out();

	return 0;
}

/* takes a path to a file and assigns the entire contents of the file
   to a global variable textFileData */
void read_file(char* file){
	string infileData;
	string textLine;
	ifstream infile;
    infile.open(file);
	while (getline(infile, textLine)) {
		infileData += (textLine + " ");
	}
	textFileData = infileData;
}

/* change the case of characters to lowercase and replace all nonalphanumeric 
   chars in data with white space */
void filter_chars_and_normalize() {
	transform(textFileData.begin(), textFileData.end(), textFileData.begin(), ::tolower);
	for (string::size_type i = 0; i < textFileData.size(); i++) {
		if (!isalnum(textFileData[i])) {
			textFileData.replace(i, 1, " ");
		}
	}
}

// parse the textFileData data string into individual words, filling the global variable words
void scan(){
	vector<string> parsedWords; // vector containing parsed words of input file
	typedef boost::tokenizer<boost::char_separator<char> > tokenizer;
	boost::char_separator<char> sep(" ");
	tokenizer tokens(textFileData, sep);
	for (tokenizer::iterator tok_iter = tokens.begin(); tok_iter != tokens.end(); ++tok_iter) {
		parsedWords.push_back(*tok_iter);
	}
	words = parsedWords;
}

// remove stop words from data in words
void remove_stop_words() {
	ifstream stopWordFile;
	set<string> stopWords;
	char currentChar;
	string stopWord = "";
	stopWordFile.open("../stop_words.txt");
	// parse the words from the stop_words file and store in a set
	while (stopWordFile.get(currentChar)) {
		if (isalnum(currentChar)) {
			stopWord += currentChar;
		} else {
			if (stopWord.length() > 0) {
				stopWords.insert(stopWord);
				stopWord = "";
			}
		}
	}
	// add single character to the set of stop words
	string alphabet = "abcdefghijklmnopqrstuvwxyz";
	for (unsigned int i = 0; i <alphabet.length(); i++) {
		stopWords.insert(string(1,alphabet[i]));
	}
	// find the indexes of stop words in the global variable words
	vector<int> indexes;
	for(unsigned int i = 0; i < words.size(); i++) {
		if (stopWords.find(words[i]) != stopWords.end()){
			indexes.push_back(i);
		}
	}
	// delete stop words from global variable words
	for (int j = indexes.size() - 1; j >= 0; j--){
		words.erase(words.begin()+indexes[j]);
	}
}

// builds a (word, freq) map of the data in the global variable words
void frequencies() {
	map<string, int> doc_word_freqs;
	for (unsigned int i = 0; i < words.size(); i++) {
		if (doc_word_freqs.find(words[i]) == doc_word_freqs.end()) {
			// Add new entry if word doesn't exist in map
			doc_word_freqs[words[i]] = 1;
		} else {
			doc_word_freqs[words[i]]++;
		}
	}
	word_freqs = doc_word_freqs;
}

// builds a reversed (freq, vector of words) map to sort the most frequent words
void sort() {
	map<int, vector<string> > doc_word_freqs_flipped;  
	for(map<string, int>::iterator it = word_freqs.begin(); it != word_freqs.end(); ++it) {
		if (doc_word_freqs_flipped.find(it->second) == doc_word_freqs_flipped.end()) {
			vector<string> vectorOfTerms;
			vectorOfTerms.push_back(it->first);
			doc_word_freqs_flipped[it->second] = vectorOfTerms;
		} else {
			vector<string> vectorOfTerms = doc_word_freqs_flipped[it->second];
			vectorOfTerms.push_back(it->first);
			doc_word_freqs_flipped[it->second] = vectorOfTerms;
		}
	}
	word_freqs_flipped = doc_word_freqs_flipped;
}

// print out the 25 most frequent words and their frequency counts
void print_out() {
	unsigned int k = 1; // number of output terms counter
	// iterate through the map starting from the bottom up
	for(map<int, vector<string> >::reverse_iterator it = word_freqs_flipped.rbegin(); it != word_freqs_flipped.rend(); ++it) {
		
		vector<string> vectorOfTerms = it->second;
		for(vector<string>::iterator vecIT = vectorOfTerms.begin(); vecIT != vectorOfTerms.end(); ++vecIT){
			cout << *vecIT << "  -  " << it->first << "\n";
			
			if (k == 25) return;
			k++;
		}
	}
}