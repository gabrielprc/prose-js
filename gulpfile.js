var gulp = require('gulp');
var pegjs = require('gulp-pegjs');
var jasmine = require('gulp-jasmine');
var jsdoc = require('gulp-jsdoc3');
var istanbul = require('gulp-istanbul');
var defineModule = require('gulp-define-module');

gulp.task('doc', function (cb) {
    var config = require('./documentation.json');
    gulp.src(['README.md', 'prose.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('pre-test', function () {
  return gulp.src(['prose.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function() {
 	gulp.src('test/**/*.js')
    	.pipe(jasmine())
    	.pipe(istanbul.writeReports());
    	// .pipe(istanbul.enforceThresholds({
    	// 	thresholds: {
    	// 		global: 90
    	// 	} 
    	// }));
});

gulp.task('watch', function() {
	gulp.watch('prose.js', ['test']);
});

gulp.task('build', ['doc', 'test', 'watch']);