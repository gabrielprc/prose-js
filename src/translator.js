/**
 * Text-to-pseudocode translator module.
 * @exports Translator
 */

var StringUtils = require('./string-utils');


function Translator() {
	var STATEMENT_SEPARATOR = '\n';
	var TAB = '\t';
	var END_OF_STATEMENT = {
		// text: [/\s*[\.,;]+\s*/g],
		text: [/(?:[^\\])(\s*[\.,;]+\s*)/g],
		code: STATEMENT_SEPARATOR
	};
	var BLOCK = {
		text: [
			// /(?:mientras|por|para|si|sino)(?:[^,]+)\s*,\s*(.+)\s*(?=[,\.])/g,
			/:\s*(?!(?:\n|$))(.+)\s*\s*(?=(?:\n|$))/g
		],
		code: 
			'{'
				+ STATEMENT_SEPARATOR
					+ TAB + '$1'
				+ STATEMENT_SEPARATOR
			+'}'
	};
	var IF_ELSE_BLOCK = {
		text: [
			/((?:si)(?:[^,:]+))\s*(?:,|:)\s*([^\.]+)(?:[\.,])\s*(sino)(?:[:,]*)([^\.]+)(?=\.|$)/g
		],
		code:
			'$1 {'
				+ STATEMENT_SEPARATOR
					+ TAB + '$2'
				+ STATEMENT_SEPARATOR
			+ '} $3 {'
				+ STATEMENT_SEPARATOR
					+ TAB + '$4'
				+ STATEMENT_SEPARATOR
			+ '}'
	};
	var CONDITIONAL_BLOCK = {
		text: [
			/((?:mientras|por|para|si|sino)(?:[^,:]+))\s*(?:,|:)\s*(.+)\s*(?=[,\.])/g
			],
		code:
			'$1 {'
				+ STATEMENT_SEPARATOR
					+ TAB + '$2'
				+ STATEMENT_SEPARATOR
			+ '}'
	};
	var JOINED_BLOCKS = {
		text: [
			/\s*}\s*{\s*/g
		],
		code: STATEMENT_SEPARATOR
	};
	var ESCAPED_CHARACTERS = {
		text: [
			/(?:\\)([\.,;])/g
		],
		code: '$1'
	};
	var END_OF_STATEMENT_PATTERN = /(?:[^\\])(\s*[\.,;]+\s*)/;
	var FOR_EACH_PATTERN = /(?!(?:\s+|}|$))por +cada +(.+) +en +(.+)(?=(?:\s+|{|^))/;
	var LIST_PATTERN = /(?!(?:\s+|}|$))([\w ]+) +contiene +(?:a +)?([^\.\n]+)(?=\.|$)/;

	/*
	 * Returns the text translated to pseudocode.
	 *
	 * @param {string} text - Text to translate.
	 */
	this.translate = function(text) {
		text = replace(text, BLOCK);
		text = replace(text, IF_ELSE_BLOCK);
		text = replace(text, CONDITIONAL_BLOCK);
		text = replace(text, JOINED_BLOCKS);
		text = translateStatements(text);
		text = replace(text, END_OF_STATEMENT, true);
		text = replace(text, ESCAPED_CHARACTERS);
		return text;
	}

	function replace(string, replaceParams, isGrouped) {
		for (var i = 0; i < replaceParams.text.length; i++) {
			while (replaceParams.text[i].test(string)) {
				if (isGrouped) {
					var matches = null;
					while (!matches) {
						matches = replaceParams.text[i].exec(string);	//	Special thanks to the masterminds behind JS regular expressions
					}
					string = string.replace(new RegExp(escapeRegExp(matches[1]), 'g'), replaceParams.code);
				} else {
					string = string.replace(replaceParams.text[i], replaceParams.code);
				}
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
				.replace(new RegExp(escapeRegExp(matches[1]), 'g'), stringUtils.toCamelCase(matches[1]))
				.replace(new RegExp(escapeRegExp(matches[2]), 'g'), stringUtils.toCamelCase(matches[2]));
		}

		if (LIST_PATTERN.test(statement)) {
			var matches = LIST_PATTERN.exec(statement);

			var listName = stringUtils.toCamelCase(matches[1]);
			var listElements = matches[2]
				.replace(/ +[ye] +/g, ', ')		//	Replace ' y ' with a separation comma.
				.replace(/,/g, '\\,');			//	Escape commas to prevent them from being detected as END OF STATEMENT.

			statement = listName + ' = [' + listElements + ']';
		}

		// while (END_OF_STATEMENT_PATTERN.test(statement)) {
		// 	var matches = END_OF_STATEMENT_PATTERN.exec(statement);

		// 	statement = statement.replace(new RegExp(matches[1], 'g'), STATEMENT_SEPARATOR);
		// }

		return statement;
	}

	function escapeRegExp(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

}

module.exports = Translator;