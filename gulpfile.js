const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano')({ calc: { precision: 2 },zindex: false });
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const minifyjs = require('gulp-js-minify');
const imagemin = require('gulp-imagemin');


gulp.task('sass', () => gulp
    .src(['./src/css/bootstrap.min.css', './src/css/bootstrap-theme.min.css', './src/css/nivo-lightbox/default.css', './src/css/nivo-lightbox/nivo-lightbox.css', './src/scss/style.scss' ])
    .pipe(concat('style.css'))
    .pipe(sass({ outputStyle: 'expanded', errLogToConsole: true }).on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream())
);

gulp.task('babel', () => gulp
// .src(['./src/js/jquery.js', './src/js/bootstrap.min.js',  './src/js/SmoothScroll.js','./src/js/nivo-lightbox.js' ,'./src/js/jquery.isotope.js', './src/js/jqBootstrapValidation.js','./src/js/contact_me.js', './src/js/main.js'])
    .src(['./src/js/jquery.js', './src/js/bootstrap.min.js','./src/js/SmoothScroll.js','./src/js/nivo-lightbox.js' ,'./src/js/jquery.isotope.js','./src/js/main.js'])
    .pipe(concat('main.js'))
    .pipe(babel({
        presets: ['es2015'],
    }))
    // .pipe(minifyjs())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream())
);

gulp.task('imagemin', () =>
    gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'))
);

gulp.task('fontawesome', () => gulp
    .src(['./src/fontawesome/**/**/**'])
    .pipe(gulp.dest('./dist/fontawesome/'))
    .pipe(browserSync.stream())
);

gulp.task('serve', () => {
    browserSync.init({
    server: {
        baseDir: './',
    },
});
gulp.watch(['./src/scss/*.scss', './src/scss/*.scss'], ['sass']);
gulp.watch('./src/js/main.js', ['babel'])
gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', ['sass','serve', 'babel']);
gulp.task('build', ['sass', 'babel', 'fontawesome', 'imagemin']);
