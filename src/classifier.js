/**
 * Classifier module.
 * @exports Classifier
 */

var StringUtils = require('./string-utils');

function Classifier() {
	var _self = this;
	var wordDistanceTolerance = 2;
	var minimumClassificationValue = 0.41;	//	42 is indeed the answer for everything.

	var documents = [
		{
			docs: [
				'es igual a',
				'es igual a',
				'es igual a',
				'es igual a',
				'es igual a',
				'es igual que',
				'es igual que',
				'es igual que',
				'es igual que',
				'es igual que',
				'equivale a',
				'equivale a',
				'equivale a',
				'equivale a',
				'si q es igual a q',
				'si qq es igual a qq',
				'si qqq es igual a qqq',
				'si qqqq es igual a qqqq',
				'si qqqqq es igual a qqqqq',
				'si q es igual que q',
				'si qq es igual que qq',
				'si qqq es igual que qqq',
				'si qqqq es igual que qqqq',
				'se tiene que x es igual a x',
				'se tiene que x es igual que x',
				'se sabe que x es igual a x',
				'se sabe que x es igual que x'
			],
			meaning: '=='
		},
		{
			docs: [
				'es mayor a',
				'es mayor a',
				'es mayor a',
				'es mayor a',
				'es mayor a',
				'es mayor que',
				'es mayor que',
				'es mayor que',
				'es mayor que',
				'es mayor que',
				'si q es mayor a q',
				'si qq es mayor a qq',
				'si qqq es mayor a qqq',
				'si qqqq es mayor a qqqq',
				'si qqqqq es mayor a qqqqq',
				'si q es mayor que q',
				'si qq es mayor que qq',
				'si qqq es mayor que qqq',
				'si qqqq es mayor que qqqq',
				'se tiene que x es mayor a x',
				'se tiene que x es mayor que x',
				'se sabe que x es mayor a x',
				'se sabe que x es mayor que x'
			],
			meaning: '>'
		},
		{
			docs: [
				'es mayor o igual a',
				'es mayor o igual a',
				'es mayor o igual a',
				'es mayor o igual a',
				'es mayor o igual a',
				'es mayor o igual que',
				'es mayor o igual que',
				'es mayor o igual que',
				'es mayor o igual que',
				'es mayor o igual que',
				'si q es mayor o igual a q',
				'si qq es mayor o igual a qq',
				'si qqq es mayor o igual a qqq',
				'si qqqq es mayor o igual a qqqq',
				'si qqqqq es mayor o igual a qqqqq',
				'si q es mayor o igual que q',
				'si qq es mayor o igual que qq',
				'si qqq es mayor o igual que qqq',
				'si qqqq es mayor o igual que qqqq',
				'se tiene que x es mayor o igual a x',
				'se tiene que x es mayor o igual que x',
				'se sabe que x es mayor o igual a x',
				'se sabe que x es mayor o igual que x'
			],
			meaning: '>='
		},
		{
			docs: [
				'es menor a',
				'es menor a',
				'es menor a',
				'es menor a',
				'es menor a',
				'es menor que',
				'es menor que',
				'es menor que',
				'es menor que',
				'es menor que',
				'si q es menor a q',
				'si qq es menor a qq',
				'si qqq es menor a qqq',
				'si qqqq es menor a qqqq',
				'si qqqqq es menor a qqqqq',
				'si q es menor que q',
				'si qq es menor que qq',
				'si qqq es menor que qqq',
				'si qqqq es menor que qqqq',
				'se tiene que x es menor a x',
				'se tiene que x es menor que x',
				'se sabe que x es menor a x',
				'se sabe que x es menor que x'
			],
			meaning: '<'
		},
		{
			docs: [
				'es menor o igual a',
				'es menor o igual a',
				'es menor o igual a',
				'es menor o igual a',
				'es menor o igual a',
				'es menor o igual que',
				'es menor o igual que',
				'es menor o igual que',
				'es menor o igual que',
				'es menor o igual que',
				'si q es menor o igual a q',
				'si qq es menor o igual a qq',
				'si qqq es menor o igual a qqq',
				'si qqqq es menor o igual a qqqq',
				'si qqqqq es menor o igual a qqqqq',
				'si q es menor o igual que q',
				'si qq es menor o igual que qq',
				'si qqq es menor o igual que qqq',
				'si qqqq es menor o igual que qqqq',
				'se tiene que x es menor o igual a x',
				'se tiene que x es menor o igual que x',
				'se sabe que x es menor o igual a x',
				'se sabe que x es menor o igual que x'
			],
			meaning: '<='
		}
	];
	var stringUtils = new StringUtils();
	var classifier = stringUtils.getClassifier();
	var tagger = stringUtils.getTagger();

	for (var i = 0; i < documents.length; i++) {
		for (var j = 0; j < documents[i].docs.length; j++) {
			classifier.addDocument(documents[i].docs[j], documents[i].meaning);
		}
	}
	classifier.train();

	/*
	 * Returns the text with matching expressions replaced
	 * by relevant equivalents after proper classification
	 *
	 * @private
	 * @param {string} text - Text to classify.
	 */
	this.classify = function(text) {
		for (var i = 0; i < documents.length; i++) {
			var strings = stringUtils.split(text);
			var tags = tag(strings);

			for (var j = 0; j < documents[i].docs.length; j++) {
				text = classifyExpression(strings, tags, documents[i].docs[j]);
			}
		}
		return text.replace(/\ +/g, ' ');
	}

	function classifyExpression(strings, tags, expression) {
		var expressionTags = tag(stringUtils.split(expression));

		if (expressionTags.length <= tags.length) {
			for (var i = 0; i < tags.length - expressionTags.length; i++) {
				if (tags[i] == expressionTags[0]) {
					for (var j = expressionTags.length - 1; j < expressionTags.length + wordDistanceTolerance; j++) {
						if (tags[i + j] == '.') {
							i += j;
							break;
						} else if (tags[i + j] == expressionTags[expressionTags.length - 1]) {
							var matchingExpression = stringUtils.join(strings.slice(i, i + j + 1));

							if (!(containsPunctuation(matchingExpression) && !containsPunctuation(expression))) {
								var classifications = classifier.getClassifications(matchingExpression);
								if (classifications.length > 0 && classifications[0].value >= minimumClassificationValue) {
									var text = 
										stringUtils.join(
											strings.slice(0, i)
											.concat(classifications[0].label)
											.concat(strings.slice(i + j + 1, strings.length))
										);
									return _self.classify(text);
								}
							}
						}
					}
				}
			}
		}
		return stringUtils.join(strings);
	}

	function tag(text) {
		var tags = tagger.tag(text);
		for (var i = 0; i < tags.length; i++) {
			if (tags[i] == 'NUM') {
				tags[i] = 'NOUN';
			}
		}
		return tags;
	}

	function containsPunctuation(string) {
		return string.indexOf('.') > -1;
	}

}

module.exports = Classifier;