/**
 * String cleaner module.
 * @exports Cleaner
 */

var StringUtils = require('./string-utils');

function Cleaner(language) {
	var stringUtils = new StringUtils();
	var tagger = stringUtils.getTagger();

	var irrelevantTags = ['ADV', 'PRON', 'DELETE'];
	var unwantedStructures = [['VERB', 'CONJ'], ['CONJ', 'VERB']];
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
		string = removeStructures(string);
		string = removeWords(string);
		string = removePunctuation(string);
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
			.replace(/\s+(\W)/g, '$1').replace(/\n+/g, '\n')
			.replace(/ +/g, ' ').replace(/\n+/g, '\n')		//	Replace multiple spaces with one
			.replace(/[\!|¡|\?|¿|]/g, '')				//	Remove these punctuation characters
			.replace(/{\s*,\s*}+/g, ',')					//	Remove multiple commas
			.replace(/(\.\s*,|,\s*\.)/g, '.')				//	Remove ill-located commas
			.replace(/\.+/g, '.');							//	Remove multiple periods
	}

	/*
	 * Returns the string without unwanted word structures.
	 *
	 * @private
	 * @param {string} string - String to clean.
	 */
	function removeStructures(string) {
		if (typeof string == 'string') {
			var strings = stringUtils.split(string);
		} else {
			var strings = string;
		}
		var tags = tagger.tag(strings);

		for (var i = 0; i < tags.length; i++) {
			for (var j = 0; j < unwantedStructures.length; j++) {
				if (tags[i] == unwantedStructures[j][0] && i + j <= tags.length) {
					var isUnwantedStructure = true;

					for (var k = 1; k < unwantedStructures[j].length; k++) {
						if (tags[i + k] !== unwantedStructures[j][k]) {
							isUnwantedStructure = false;
							break;
						}
					}

					if (isUnwantedStructure) {
						strings.splice(i, unwantedStructures[j].length);
						return removeStructures(strings);
					}
				}
			}
		}

		return stringUtils.join(strings);
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