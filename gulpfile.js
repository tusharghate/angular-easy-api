var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    pump = require('pump');
    rename = require('gulp-rename'),
    sequence = require('gulp-sequence'),
    beautify = require('gulp-jsbeautifier');

gulp.task('beautify', function(cb) {
    pump([
        gulp.src('./dist/angular-easy-api.js'),
        beautify(),
        gulp.dest('./dist')
    ], cb);
});

gulp.task('build', function(cb) {
    pump([
        gulp.src('./dist/angular-easy-api.js'),
        uglify({
            mangle: false
        }),
        rename({
            suffix: ".min"
        }),
        gulp.dest('./dist')
    ], cb);
});

gulp.task('default', sequence('beautify', 'build'));
