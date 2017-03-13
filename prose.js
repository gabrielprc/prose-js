var Cleaner = require('./src/cleaner');
var Classifier = require('./src/classifier');
var Stemmer = require('./src/stemmer');
var LangDetector = require('./src/language-detector');
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

		var lang = detectLanguage(parsable);
		print('Language detected', lang);

		parsable = classify(parsable);
		print('Classified text', parsable);

		parsable = clean(parsable, lang);
		print('Clean text', parsable);

		parsable = stem(parsable, lang);
		print('Stemmed text', parsable);		

		parsable = translate(parsable);
		print('Translated text', parsable);
		
		return parsable;
	}
};

function detectLanguage(string) {
	var langDetector = new LangDetector();
	return langDetector.detect(string);
}

function clean(string, lang) {
	var cleaner = new Cleaner(lang);
	return cleaner.clean(string);
}

function stem(string, lang) {
	var stemmer = new Stemmer(lang);
	return stemmer.stem(string);
}

function classify(string) {
	var classifier =  new Classifier();
	return classifier.classify(string);
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