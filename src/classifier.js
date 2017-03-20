/**
 * Classifier module.
 * @exports Classifier
 */

var StringUtils = require('./string-utils');

function Classifier() {
	var _self = this;
	var wordDistanceTolerance = 3;
	var minimumClassificationValue = 0.3;

	var documents = [
		{
			docs: [
				'si qqq es mayor a qqq',
				'si qqq es mayor que qqq',
				'se tiene que x es mayor a x',
				'se tiene que x es mayor que x',
				'se sabe que x es mayor a x',
				'se sabe que x es mayor que x',
				'es mayor a',
				'es mayor que'
			],
			meaning: '>'
		},
		{
			docs: ['es mayor o igual a', 'es mayor o igual que'],
			meaning: '>='
		},
		{
			docs: ['es menor a', 'es menor que'],
			meaning: '<'
		},
		{
			docs: ['es menor o igual a', 'es menor o igual que'],
			meaning: '<='
		},
		{
			docs: ['es igual a', 'es igual que', 'equivale a'],
			meaning: '=='
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

}

module.exports = Classifier;