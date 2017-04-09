var Cleaner = require('./src/cleaner');
var Classifier = require('./src/classifier');
var Stemmer = require('./src/stemmer');
var Translator = require('./src/translator');
var LangDetector = require('./src/language-detector');
var Formatter = require('./src/formatter');
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
		var parsed = [];
		var parsables = parsable.split(/\n+-+\n+/);

		for (var i = 0; i < parsables.length; i++) {
			var p = parsables[i].trim();

			print('Parsing piece #' + (i + 1));

			print('Original text', p);

			// var lang = detectLanguage(parsable);
			var lang = 'spa';
			print('Language detected', lang);

			p = classify(p);
			print('Classified text', p);

			p = clean(p, lang);
			print('Clean text', p);

			p = stem(p, lang);
			print('Stemmed text', p);		

			p = translate(p);
			print('Translated text', p);

			p = format(p);
			print('Formatted text', p);

			parsed.push(p);
		}
		
		return parsed.length === 1 ? parsed[0] : parsed;
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
	var classifier = new Classifier();
	return classifier.classify(string);
}

function translate(string) {
	var translator = new Translator();
	return translator.translate(string);
}

function format(string) {
	var formatter = new Formatter();
	return formatter.format(string);
}

function print(title, string) {
	console.log('\n' + title);
	console.log('==========');
	if (string) {
		console.log(string);
	}
}

fs.readFile('input.txt', 'utf8', function(err, data) {
  if (err) throw err;
  prose.compileToPseudocode(data);
});

module.exports = prose;