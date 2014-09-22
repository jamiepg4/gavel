var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var jsonminify = require('gulp-jsonminify');

gulp.task('dist', ['build'], function() {
    gulp
        .src('./build/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/'));

    gulp.src('./build/app.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./build/'));

    gulp.src(['./build/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('./build/'));
});