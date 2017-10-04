/**
 * String stemmer module.
 * @exports Stemmer
 */

var StringUtils = require('./string-utils');
var PorterStemmerEs = require('natural/lib/natural/stemmers/porter_stemmer_es');

function Stemmer() {

	var stringUtils = new StringUtils();
	var tagger = stringUtils.getTagger();

	/*
	 * Returns the stemmed string if possible, or the original string.
	 *
	 * @param {string} string - String to stem.
	 */
	this.stem = function(string) {
		var strings = stringUtils.split(string);
		var tags = tagger.tag(strings);

		for (var i = 0; i < strings.length; i++) {
			if (tags[i] === 'VERB') {
				var stem = PorterStemmerEs.stem(strings[i]);

				//	Check the stems for relevant verbs and replace for its appropiate expression
				if (stem === 'ser' || stem === 'se' || stem === 'estar' || stem === 'est' || stem === 'esta') {	//	Replace infinitive of the verb 'to be' with the relevant translation for pseudocode
					strings[i] = 'es';
				} else if (stem === 'mostr' || stem === 'muestr') {
					strings[i] = 'mostrar';
				} else if (stem === 'evalu') {
					strings[i] = 'evaluar';
				}
			}
		}

		return stringUtils.join(strings);
	}

}

module.exports = Stemmer;