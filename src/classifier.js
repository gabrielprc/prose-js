/**
 * Classifier module.
 * @exports Classifier
 */

var StringUtils = require('./string-utils');

function Classifier() {
	var wordDistanceTolerance = 3;
	var minimumClassificationValue = 0.9;

	var documents = [
		{
			docs: ['es mayor a', 'es mayor que'],
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
	var classifier = new natural.BayesClassifier();
	var stringUtils = new StringUtils();
	var tagger = stringUtils.getTagger();
	var tokenizer = stringUtils.getWordTokenizer();

	for (var i = 0; i < documents.length; i++) {
		classifier.addDocument(documents[i].docs, documents[i].meaning);
	}

	/*
	 * Returns the text with matching expressions replaced
	 * by relevant equivalents after proper classification
	 *
	 * @private
	 * @param {string} text - Text to classify.
	 */
	this.classify = function(text) {
		for (var i = 0; i < documents.length; i++) {
			var strings = tokenizer.tokenize(text);
			var tags = tagger.tag(strings);
			text = classifyExpression
		}
		return text;
	}

	function classifyExpression(strings, tags, expression) {
		var expressionTags = tagger.tag(expression);
		if (expressionTags.length <= tags.length) {
			for (var i = 0; i < tags.length - expressionTags.length; i++) {
				for (var j = i; j < expressionTags.length + wordDistanceTolerance; j++) {
					if (tags[i] == expressionTags[0] && tags[j] == expressionTags[expressionTags.length - 1]) {
						var matchingExpression = stringUtils.join(strings.slice(i, j));

						var classifications = classifier.classify(matchingExpression);
						if (classifications.length > 0 && classifications[0].value >= minimumClassificationValue) {
							var text = 
								stringUtils.join(strings.slice(0, i)
								+ classifications[0].label
								+ strings.slice(j, strings.length - 1));
							return classify(text);
						}
					}
				}
			}
		}
		return stringUtils.join(strings);
	}



}

module.exports = Classifier;