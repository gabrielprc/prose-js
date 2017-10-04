/**
 * String utils module.
 * @exports StringUtils
 */
var RegexpTokenizer = require('natural/lib/natural/tokenizers/regexp_tokenizer').RegexpTokenizer;
var BayesClassifier = require('bayes-classifier');
var HmmTagger = require('salient/lib/salient/tagging/hmm_tagger');

function StringUtils() {
	var STRING_LITERAL_PATTERN = /(".*"|'.*')/g;
	var tagger = new HmmTagger({
		model: '../../../bin/es.hmm.json'
	});
	var tokenizer = new RegexpTokenizer({pattern: /((?:["'])[^"']*(?:["'])|[^"'\.,;:\s]+)/ig});
	var classifier = new BayesClassifier();

	/*
	 * Returns Part-of-Speech tagger.
	 */
	this.getTagger = function() {
		return tagger;
	}

	/*
	 * Returns word tokenizer.
	 */
	this.getWordTokenizer = function() {
		return tokenizer;
	}

	/*
	 * Returns classifier.
	 */
	this.getClassifier = function() {
		return classifier;
	}

	/*
	 * Returns a tokenized (split) array of strings from the original string.
	 *
	 * @param {string} string - String to split.
	 */
	this.split = function(string) {
		var strings = tokenizer.tokenize(string);
		for (var i = 0; i < strings.length; i++) {
			if (!STRING_LITERAL_PATTERN.test(strings[i])) {
				strings[i] = strings[i].replace(/ +/, '');	
			}
		}
		return strings.filter(function(string){
		  return string !== '';
		});
	}

	/*
	 * Returns a single string formed by the strings in the array.
	 *
	 * @param {array} strings - Array to join.
	 */
	this.join = function(strings) {
		return strings.join(' ');
	}

	/*
	 * Returns a camel-cased string (without whitespaced) formed by the separated words in the original string.
	 *
	 * @param {string} string - String to join.
	 */
	this.toCamelCase = function(string) {
		var camelCased = '';
		var words = string.split(/\s+/);
		for (var i = 0; i < words.length; i++) {
			var w = words[i].toLowerCase();
			if (i > 0) {
				w = w.substring(0, 1).toUpperCase() + w.substr(1);
			}
			camelCased += w;
		}
		return camelCased;
	}

	/*
	 * Returns a boolean value of wether the string of the given index
	 * within an array of strings is actually part of a comment line.
	 *
	 * @param {array} strings - Array of strings (tokenized code).
	 * @param {number} index - Index of the word to look out for in the array.
	 */
	 this.isComment = function(strings, index) {
	 	var string = strings[index];

	 	if (string.indexOf('\n') > -1) {
	 		return false;
	 	}

	 	if (string.indexOf('//') > -1) {
	 		return true;
	 	}

	 	if (index === 0) {
	 		return false;	
	 	}

	 	var lineStart = index;
	 	for (var i = index; i >= 0; i--) {
	 		if (strings[i].indexOf('\n') > -1) {
	 			lineStart = i + 1;
	 			break;
	 		} else {
	 			lineStart = i;
	 		}
	 	}

	 	if (strings[lineStart].indexOf('//') > -1) {
	 		return true;
	 	}

	 	return false;
	 }

}

module.exports = StringUtils;