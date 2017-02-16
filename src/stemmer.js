/**
 * String stemmer module.
 * @exports Stemmer
 */

var natural = require('natural');
var salient = require('salient');
var path = require('path')

function Stemmer() {
	var tokenizer = new natural.WordPunctTokenizer();
	var tagger = new salient.tagging.HmmTagger({
		model: '../../../bin/es.hmm.json'
	});
	var irrelevantTags = ['ADV', 'PRON'];

	/**
	 * Returns a string without whitespaces between non-word symbols
	 * (characters not in the alphabet, such as parenthesis, brackets or commas).
	 *
	 * @param {string} string - String to clean.
	 */
	this.stem = function(string) {
		var strings = split(string);

		var tags = tagger.tag(strings);
		console.log(join(tags));

		var stemmedStrings = [];
		for (var i = 0; i < strings.length; i++) {
			if (isRelevant(tags[i])) {
				// stemmedStrings.push(stemWord(strings[i]));
				stemmedStrings.push(strings[i]);
			}
		}

		return join(stemmedStrings);
	}

	/*
	 * Returns a tokenized (split) array of strings from the original string.
	 *
	 * @private
	 * @param {string} string - String to split.
	 */
	function split(string) {
		return tokenizer.tokenize(string);
	}

	/*
	 * Returns a single string formed by the strings in the array.
	 *
	 * @private
	 * @param {array} strings - Array to join.
	 */
	function join(strings) {
		return strings.join(' ');
	}

	/*
	 * Returns the stemmed word if possible, or the original word.
	 *
	 * @private
	 * @param {string} word - Word to stem.
	 */
	function stemWord(word) {
		var stemAttempt = natural.PorterStemmerEs.stem(word);
		// if (stemAttempt == '') {
		// 	return word;
		// }
		return stemAttempt;
	}

	/*
	 * Returns whether the word tag is relevant or not.
	 *
	 * @private
	 * @param {string} tag - Tag to check.
	 */
	function isRelevant(tag) {
		return !irrelevantTags.contains(tag);
	}

}

module.exports = Stemmer;