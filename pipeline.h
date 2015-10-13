/* Author: Scott Vang
 * Problem 5.1 and 5.2: Pipeline style 
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


// Function Prototypes
string read_file(char* file);
string filter_chars_and_normalize(string textFileData);
vector<string> scan(string textFileData);
vector<string> remove_stop_words(vector<string> words, char* file);
map<string, int> frequencies(vector<string> words);
map<int, vector<string> > sort(map<string, int> words_freqs);
void print_out(map<int, vector<string> > word_freqs_flipped);

// Main Program
int main(int argc, char* argv[]){

	print_out(sort(frequencies(remove_stop_words(scan(filter_chars_and_normalize(read_file(argv[1]))), argv[2]))));

	return 0;
}

/* takes a path to a file and assigns the entire contents of the file
   to a variable textFileData */
string read_file(char* file){
	string textFileData;
	string textLine;
	ifstream infile;
    infile.open(file);
	while (getline(infile, textLine)) {
		textFileData += (textLine + " ");
	}
	return textFileData;
}

/* change the case of characters to lowercase and replace all nonalphanumeric 
   chars in data with white space */
string filter_chars_and_normalize(string textFileData) {
	transform(textFileData.begin(), textFileData.end(), textFileData.begin(), ::tolower);
	for (string::size_type i = 0; i < textFileData.size(); i++) {
		if (!isalnum(textFileData[i])) {
			textFileData.replace(i, 1, " ");
		}
	}
	return textFileData;
}

// parse the textFileData data string into individual words, filling the variable words
vector<string> scan(string textFileData){
	vector<string> words; // vector containing parsed words of input file
	typedef boost::tokenizer<boost::char_separator<char> > tokenizer;
	boost::char_separator<char> sep(" ");
	tokenizer tokens(textFileData, sep);
	for (tokenizer::iterator tok_iter = tokens.begin(); tok_iter != tokens.end(); ++tok_iter) {
		words.push_back(*tok_iter);
	}
	return words;
}

// remove stop words from data in words
vector<string> remove_stop_words(vector<string> words, char* file) {
	ifstream stopWordFile;
	set<string> stopWords;
	char currentChar;
	string stopWord = "";
	stopWordFile.open(file);
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
	// find the indexes of stop words in the variable words
	vector<int> indexes;
	for(unsigned int i = 0; i < words.size(); i++) {
		if ((words[i].length() < 2) || (stopWords.find(words[i]) != stopWords.end())){
			indexes.push_back(i);
		}
	}
	// delete stop words from variable words
	for (int j = indexes.size() - 1; j >= 0; j--){
		words.erase(words.begin()+indexes[j]);
	}
	return words;
}

// builds a (word, freq) map of the data in the variable words
map<string, int> frequencies(vector<string> words) {
	map<string, int> word_freqs;
	for (unsigned int i = 0; i < words.size(); i++) {
		if (word_freqs.find(words[i]) == word_freqs.end()) {
			// Add new entry if word doesn't exist in map
			word_freqs[words[i]] = 1;
		} else {
			word_freqs[words[i]]++;
		}
	}
	return word_freqs;
}

// builds a reversed (freq, vector of words) map to sort the most frequent words
map<int, vector<string> > sort(map<string, int> word_freqs) {
	map<int, vector<string> > word_freqs_flipped;  
	for(map<string, int>::iterator it = word_freqs.begin(); it != word_freqs.end(); ++it) {
		if (word_freqs_flipped.find(it->second) == word_freqs_flipped.end()) {
			vector<string> vectorOfTerms;
			vectorOfTerms.push_back(it->first);
			word_freqs_flipped[it->second] = vectorOfTerms;
		} else {
			vector<string> vectorOfTerms = word_freqs_flipped[it->second];
			vectorOfTerms.push_back(it->first);
			word_freqs_flipped[it->second] = vectorOfTerms;
		}
	}
	return word_freqs_flipped;
}

// print out the 25 most frequent words and their frequency counts
void print_out(map<int, vector<string> > word_freqs_flipped) {
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