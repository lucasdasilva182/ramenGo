'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass'); // Necessário para funcionar gulp-sass

gulp.task('default', gulp.series(compilaSass, scriptsMethod, watch));

function compilaSass() {
  return gulp
    .src('src/scss/master.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) // Converte Sass para CSS minimizado com gulp-sass
    .pipe(concat('../css/master.min.css'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}

function scriptsMethod() {
  return gulp
    .src(['src/js/app.js'])
    .pipe(uglify())
    .pipe(concat('master.min.js'))
    .pipe(gulp.dest('src/js/dist'))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './',
    },
    // browser: 'iexplore', //Using Windows
    browser: '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', //Using WSL2
  });
  gulp.watch('src/scss/**/*.scss', compilaSass);
  gulp.watch('src/js/vendor/*.js', scriptsMethod);
  gulp.watch('src/js/*.js', scriptsMethod);
  gulp.watch('src/*').on('change', browserSync.reload);
}

exports.sass = compilaSass;
exports.scripts = scriptsMethod;
exports.watch = watch;
