/**
 * String cleaner module.
 * @exports Cleaner
 */

var StringUtils = require('./string-utils');

function Cleaner(language) {
	var stringUtils = new StringUtils();
	var tagger = stringUtils.getTagger();

	var irrelevantTags = ['ADV', 'PRON', 'DELETE'];
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

		string = string.replace(new RegExp(regex, 'ig'), ' ');

		var strings = stringUtils.split(string);
		var tags = tagger.tag(strings);

		translateWords(strings, tags);

		strings = removeIrrelevantWords(strings, tags);

		return stringUtils.join(strings);
	}

	/*
	 * Translates relevant words to more useful synonims.
	 *
	 * @private
	 * @param {array} strings - Words to translate.
	 * @param {array} tags - Word tags.
	 */
	function translateWords(strings, tags) {
		for (var i = 0; i < strings.length; i++) {
			if (tags[i] == 'ADV') {
				if (strings[i].toLowerCase() == 'más') {
					strings[i] = '+';
					tags[i] = 'KEEP';
				} else if (strings[i].toLowerCase() == 'menos') {
					strings[i] = '-';
					tags[i] = 'KEEP';
				} else if (strings[i].toLowerCase() == 'igual') {
					if (strings.length >= (i + 1) && strings[i + 1].toLowerCase() == 'a') {
						strings[i] = '=';
						tags[i] = 'KEEP';
						tags[i + 1] = 'DELETE';

						if (i > 0 && strings[i - 1].toLowerCase() == 'es') {
							tags[i - 1] = 'DELETE';							
						}
					}
				}
			}
		}
	}

	/*
	 * Removes words tagged as irrelevant. Returns resulting array.
	 *
	 * @private
	 * @param {array} strings - Words to check.
	 * @param {array} tags - Word tags.
	 */
	function removeIrrelevantWords(strings, tags) {
		var relevantStrings = [];

		for (var i = 0; i < strings.length; i++) {
			if (isRelevant(tags[i])) {
				relevantStrings.push(strings[i]);
			}
		}

		return relevantStrings;
	}

	/*
	 * Returns whether the word tag is relevant or not.
	 *
	 * @private
	 * @param {string} tag - Tag to check.
	 */
	function isRelevant(tag) {
		return !irrelevantTags.contains(tag);
	}

}

module.exports = Cleaner;