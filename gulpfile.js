var gulp = require('gulp');

var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

//concatate css or js files 
var useref = require('gulp-useref');

var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

//minify css
var cssnano = require('gulp-cssnano');

var imagemin = require('gulp-imagemin');

var cache = require('gulp-cache');

//deleted files that are no longer useed
var del = require('del');

//help run gulp tasks in sequence
var runSequence = require('run-sequence');

var autoprefixer = require('gulp-autoprefixer');

var babel = require('gulp-babel');

var concat = require('gulp-concat');


gulp.task('toES6', function() {
	gulp.src('js/*.js')
	.pipe(babel({
		presets:['env']
	}))
	.pipe(gulp.dest('js'))
});

gulp.task('prefix',function() {
	gulp.src('css/*.css')
	.pipe(autoprefixer({
		browsers: ['last 5 version'],
		cascade: false
	}))
	.pipe(gulp.dest('css'))
})

gulp.task('clean:dist', function() {
	return del.sync('dist');
});

gulp.task('fonts', function() {
	return gulp.task('fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});

gulp.task('images', function() {
	return gulp.src('images/**/*.+(png|jpg|gif|svg)')
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest('dist/images'))
});

gulp.task('useref', function() {
	return gulp.src('*.html')
	.pipe(useref())
	.pipe(gulpIf('js/*.js', uglify()))
	.pipe(gulpIf('css/*.css', cssnano()))
	.pipe(gulp.dest('dist'))
});

gulp.task('html', function() {
   return gulp.src('index.html').pipe(gulp.dest('dist'))
})

gulp.task('uglify', function(){
  return gulp.src('js/*.js')
         .pipe(uglify())
         .pipe(gulp.dest('dist/js'))
});

gulp.task('concat', function(){
  return gulp.src(['js/Swipe.js', 'js/slider.js', 'js/index.js'])
         .pipe(concat('all.js'))
         .pipe(gulp.dest('dist/js'));
});

gulp.task('minifycss', function(){
  return gulp.src('css/*.css').
         pipe(cssnano())
         .pipe(gulp.dest('dist/css'))
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: '../van-web'
		},
	})
});


gulp.task('sass', function() {
	return gulp.src('sass/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('watch',['browserSync', 'sass'], function() {
	gulp.watch('sass/**/*.scss', ['sass']);
	gulp.watch('*.html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('build', function(callback) {
  runSequence('clean:dist', ['sass', 'prefix', 'minifycss', 'uglify','concat', 'images', 'html'], callback)
});

gulp.task('default', function(callback) {
	runSequence(['sass', 'browserSync', 'watch'],
		callback)
});

