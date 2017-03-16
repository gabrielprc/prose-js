/**
 * String utils module.
 * @exports StringUtils
 */

var natural = require('natural');
var salient = require('salient');

function StringUtils() {
	var tagger = new salient.tagging.HmmTagger({
		model: '../../../bin/es.hmm.json'
	});
	var tokenizer = new natural.RegexpTokenizer({pattern: /([\wáéíóú]+|\!|\'|\"")/i});
	var classifier = new natural.BayesClassifier();

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
			strings[i] = strings[i].trim();
		}
		return strings;
	}

	/*
	 * Returns a single string formed by the strings in the array.
	 *
	 * @param {array} strings - Array to join.
	 */
	this.join = function(strings) {
		return strings.join(' ');
	}

}

module.exports = StringUtils;