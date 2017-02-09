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
		print('Original text', parsable);

		parsable = clean(parsable);
		print('Clean text', parsable);

		parsable = stem(parsable);
		print('Stemmed text', parsable);

		parsable = classify(parsable);
		print('Classified text', parsable);

		parsable = translate(parsable);
		print('Translated text', parsable);
		
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

function print(title, string) {
	console.log('\n' + title);
	console.log('==========');
	console.log(string);
}

fs.readFile('input.txt', 'utf8', function(err, data) {
  if (err) throw err;
  prose.compileToPseudocode(data);
});

module.exports = prose;