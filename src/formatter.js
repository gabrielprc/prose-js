/**
 * Formatter module.
 * @exports Formatter
 */
 
var beautifier = require('js-beautify');

function Formatter() {
	/**
	 * Returns a correctly formatted (beautified) string of pseudocode.
	 *
	 * @param {string} string - Piece of pseudocode to format.
	 */
	this.format = function(string) {
		return beautifier.js_beautify(string);
	}
}

module.exports = Formatter;