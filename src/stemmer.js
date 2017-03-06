/**
 * String stemmer module.
 * @exports Stemmer
 */

var natural = require('natural');
var path = require('path');

function Stemmer() {

	/*
	 * Returns the stemmed string if possible, or the original string.
	 *
	 * @private
	 * @param {string} string - String to stem.
	 */
	this.stem = function(string) {
		return natural.PorterStemmerEs.stem(string);
	}

}

module.exports = Stemmer;