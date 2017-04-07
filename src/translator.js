/**
 * Text-to-pseudocode translator module.
 * @exports Translator
 */


function Translator() {
	var END_OF_STATEMENT = {
		text: [/\s*\.+\s*/g],
		code: '\n'
	};
	var BLOCK = {
		text: [/:\s*(?!(?:\n|$))(.+)\s*\s*(?=(?:\n|$))/g, /,\s*([^,\.]+)\s*(?=[,\.])/g],
		code: '{\n\t$1\n}'
	};

	/*
	 * Returns the text translated to pseudocode.
	 *
	 * @param {string} text - Text to translate.
	 */
	this.translate = function(text) {
		text = replace(text, BLOCK);
		text = replace(text, END_OF_STATEMENT);
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

}

module.exports = Translator;