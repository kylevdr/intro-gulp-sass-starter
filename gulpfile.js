var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    babel = require('gulp-babel');


var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

gulp.task('build-css', function(){
    return gulp.src('./styles/*')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cachebust.resources())
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/'));
})

gulp.task('clean', function (cb) {
    del([
        'dist'
    ], cb);
});

gulp.task('js', function() {
  return gulp.src('js/**/*.js')               
      .pipe(sourcemaps.init())
      .pipe(print())                        
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(concat('bundle.js'))
      .pipe(sourcemaps.write('./')) 
      .pipe(gulp.dest('./dist/js'));          
});

gulp.task('build', [ 'clean', 'build-css', 'js'], function() {
    return gulp.src('index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    return gulp.watch(['./index.html', './styles/*.*css', './js/**/*.js'],['build']);
});


gulp.task('webserver', ['watch','build'], function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: false,
            directoryListing: true,
            open: "http://localhost:8000/index.html"
        }));
});

gulp.task('dev', ['watch', 'webserver']);