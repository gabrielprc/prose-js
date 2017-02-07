var Cleaner = require('./src/cleaner.js');
var fs = require('fs');
/**
 * Natural language-to-pseudocode compiler.
 * @exports prose-js
 */
var prose = {
	/*
	 * Returns the pseudocode for the given text.
	 *
	 * @param {string} string - Text to parse.
	 */
	
	compileToPseudocode: function(parsable) {
		parsable = clean(parsable);
		parsable = stem(parsable);
		parsable = classify(parsable);
		parsable = translate(parsable);
		return parsable;
	}
};

function clean(string) {
	var cleaner = new Cleaner();
	return cleaner.clean(string);
}

function stem(string) {
	//	TODO
	return string;
}

function classify(string) {
	//	TODO
	return string;
}

function translate(string) {
	//	TODO
	return string;
}

fs.readFile('input.txt', 'utf8', function(err, data) {
  if (err) throw err;
  console.log(prose.compileToPseudocode(data));
});

module.exports = prose;