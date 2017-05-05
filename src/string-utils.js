/**
 * String utils module.
 * @exports StringUtils
 */
var RegexpTokenizer = require('natural/lib/natural/tokenizers/regexp_tokenizer').RegexpTokenizer;
var BayesClassifier = require('natural/lib/natural/classifiers/bayes_classifier');
var HmmTagger = require('salient/lib/salient/tagging/hmm_tagger');

function StringUtils() {
	var tagger = new HmmTagger({
		model: '../../../bin/es.hmm.json'
	});
	var tokenizer = new RegexpTokenizer({pattern: /([\wáéíóú]+|\!|\'|\"")/i});
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

}

module.exports = StringUtils;