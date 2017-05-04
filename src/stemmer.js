/**
 * String stemmer module.
 * @exports Stemmer
 */

var PorterStemmerEs = require('natural/lib/natural/stemmers/porter_stemmer_es');

function Stemmer() {

	/*
	 * Returns the stemmed string if possible, or the original string.
	 *
	 * @param {string} string - String to stem.
	 */
	this.stem = function(string) {
		return PorterStemmerEs.stem(string);
	}

}

module.exports = Stemmer;