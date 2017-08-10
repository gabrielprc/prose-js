var Cleaner = require("./src/cleaner");
var Classifier = require("./src/classifier");
var Stemmer = require("./src/stemmer");
var Translator = require("./src/translator");
var LangDetector = require("./src/language-detector");
var Formatter = require("./src/formatter");
var printSteps = process && process.env.NODE_ENV === "development";
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

			if (printSteps) {
				print("Leyendo parte #" + (i + 1));
				print("Texto original", p);
			}

			// var lang = detectLanguage(parsable);
			var lang = "spa";
			if (printSteps) {
				print("Lenguaje detectado", lang);
			}

			p = classify(p);
			if (printSteps) {
				print("Texto clasificado", p);
			}

			p = clean(p, lang);
			if (printSteps) {
				print("Texto limpio", p);
			}

			p = stem(p, lang);
			if (printSteps) {
				print("Texto stemmed", p);
			}

			p = translate(p);
			if (printSteps) {
				print("Texto traducido", p);
			}

			p = format(p);
			print("Pseudocódigo", p);

			if (printSteps) {
				printSeparator(true);
			}

			parsed.push(p);
		}

		return parsed.length === 1 ? parsed[0] : parsed.join('\n\n----------\n\n');
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
	console.log("\n" + title);
	printSeparator();
	if (string) {
		console.log(string);
	}
}

function printSeparator(large) {
	if (large) {
		var separator = "\n\n\n\n\n================================================================================\n\n\n\n";
	} else {
		var separator = "==========";
	}
	console.log(separator);
}

if (printSteps) {
	console.log("Leyendo el texto natural desde input.txt...\n...\n...");
	var fs = require("fs");
	fs.readFile("input.txt", "utf8", function(err, data) {
		if (err) throw err;
		console.log("Procesando el texto natural...\n...\n...");
		fs.writeFile("output.txt", prose.compileToPseudocode(data), function(err, data) {
			if (err) throw err;
			console.log("Proceso completo! Los resultados se guardaron en output.txt");
		});
	});
}

module.exports = prose;
