/**
 * String cleaner module.
 * @exports Cleaner
 */
function Cleaner(language) {
	var unwantedWords = [];

	if (language == 'spa') {
		unwantedWords = [
			'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'al', 'del'
		];
	} else if (language == 'eng') {
		unwantedWords = [
			'a', 'an', 'the'
		];
	}
	/**
	 * Returns a string without whitespaces between non-word symbols
	 * (characters not in the alphabet, such as parenthesis, brackets or commas).
	 *
	 * @param {string} string - String to clean.
	 */
	this.clean = function(string) {
		string = removePunctuation(string);
		string = removeWords(string);
		return string;
	}

	/*
	 * Returns the string without unwanted punctuation characters.
	 *
	 * @private
	 * @param {string} string - String to clean.
	 */
	function removePunctuation(string) {
		return string
			.replace(/[,|;|:|\!|¡|\?|¿|]/g, '')				//	Remove these characters
			.replace(/ +/g, ' ').replace(/\n+/g, '\n');		//	Replace multiple spaces for one
	}

	/*
	 * Returns the string without unwanted words.
	 *
	 * @private
	 * @param {string} string - String to clean.
	 */
	function removeWords(string) {
		var regex = '';
		for (var i = 0; i < unwantedWords.length; i++) {
			if (i > 0 != '') {
				regex += '|';
			}
			regex += unwantedWords[i];
		}

		regex = '(?:\\b|\\W)(' + regex + ')(?:\\W|\\b)';

		return string.replace(new RegExp(regex, 'ig'), ' ');
	}
}

module.exports = Cleaner;