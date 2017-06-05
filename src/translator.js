/**
 * Text-to-pseudocode translator module.
 * @exports Translator
 */

var StringUtils = require('./string-utils');


function Translator() {
	var STATEMENT_SEPARATOR = '\n';
	var TAB = '\t';
	var END_OF_STATEMENT = {
		text: [/\s*\.+\s*/g],
		code: STATEMENT_SEPARATOR
	};
	var BLOCK = {
		text: [/:\s*(?!(?:\n|$))(.+)\s*\s*(?=(?:\n|$))/g, /,\s*([^,\.]+)\s*(?=[,\.])/g],
		code: '{' + STATEMENT_SEPARATOR + TAB + '$1' + STATEMENT_SEPARATOR +'}'
	};
	var JOINED_BLOCKS = {
		text: [/\s*}\s*{\s*/g],
		code: STATEMENT_SEPARATOR
	};
	var FOR_EACH_PATTERN = /(?!(?:\s+|}|$))por +cada +(.+) +en +(.+)(?=(?:\s+|{|^))/;

	/*
	 * Returns the text translated to pseudocode.
	 *
	 * @param {string} text - Text to translate.
	 */
	this.translate = function(text) {
		text = replace(text, BLOCK);
		text = replace(text, JOINED_BLOCKS);
		text = replace(text, END_OF_STATEMENT);
		text = translateStatements(text);
		return text;
	}

	function replace(string, replaceParams) {
		for (var i = 0; i < replaceParams.text.length; i++) {
			while (replaceParams.text[i].test(string)) {
				string = string.replace(replaceParams.text[i], replaceParams.code);
			}
		}
		return string;
	}

	function translateStatements(block) {
		var translated = '';
		var statements = block.split(STATEMENT_SEPARATOR);

		for (var i = 0; i < statements.length; i++) {
			if (i > 0) {
				translated += STATEMENT_SEPARATOR;	
			}
			translated += translateStatement(statements[i]);
		}

		return translated;
	}

	function translateStatement(statement) {
		var stringUtils	= new StringUtils();

		if (FOR_EACH_PATTERN.test(statement)) {
			var matches = FOR_EACH_PATTERN.exec(statement);

			statement = statement
				.replace(new RegExp(matches[1], 'g'), stringUtils.toCamelCase(matches[1]))
				.replace(new RegExp(matches[2], 'g'), stringUtils.toCamelCase(matches[2]));
		}

		return statement;
	}

}

module.exports = Translator;