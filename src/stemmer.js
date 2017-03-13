/**
 * String stemmer module.
 * @exports Stemmer
 */

var natural = require('natural');

function Stemmer() {

	/*
	 * Returns the stemmed string if possible, or the original string.
	 *
	 * @param {string} string - String to stem.
	 */
	this.stem = function(string) {
		return natural.PorterStemmerEs.stem(string);
	}

}

module.exports = Stemmer;