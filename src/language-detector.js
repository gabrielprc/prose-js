/**
 * Language detector module.
 * @exports LangDetector
 */
 
var franc = require('franc');

function LangDetector() {
	/**
	 * Returns a string representation of the language detected.
	 *
	 * @param {string} string - String from which language is to be detected.
	 */
	this.detect = function(string) {
		return franc(string);
	}
}

module.exports = LangDetector;