/**
 * Basic Gulp Server
 */
var gulp = require('gulp'),
	less = require('gulp-less'),
	plumber = require('gulp-plumber'),
	filelog = require('gulp-filelog'),
	changed = require('gulp-changed'),
	connect = require('gulp-connect'),
	cssmin = require('gulp-cssmin'),
	notify = require("gulp-notify"),
	prefix = require('gulp-autoprefixer'),
	gulpif = require('gulp-if'),
	inject = require("gulp-inject"),
	preprocess = require('gulp-preprocess'),
	gutil = require('gulp-util'),
	es = require('event-stream'),
	deploy = require('gulp-gh-pages');

var config = require('./config.json');

// ---------- Default ----------
gulp.task('default', ['less', 'js-inject', 'copy-js', 'copy-html', 'server', 'watch'], function () {});

// ---------- Watch for changes ----------
gulp.task('watch', function () {
	// Watch for all changes
	gulp.watch([config.paths.src + config.paths.assets + config.styles.lessFolderToCompile + config.styles.lessFilePatternToWatch], ['less']);
	gulp.watch([config.paths.src + '**/*.html'], ['copy-html']);
	gulp.watch([config.paths.src + '**/*.js'], ['copy-js']);
});

/* ------------------------------------------------------
 Styles
 ----------------------------------------------------- */

// ---------- Compile LESS ----------
gulp.task('less', function () {
	gutil.log(gutil.colors.black.bgGreen('Compiling LESS'));

	// Only compile files in a certain folderToCompile
	gulp.src(config.paths.src + config.paths.assets + config.styles.lessFolderToCompile + config.styles.lessFilePatternToCompile)
		.pipe(gutil.log('Folder: ', gutil.colors.blue(config.paths.src + config.paths.assets + config.styles.lessFolderToCompile)).noop())
		.pipe(filelog()) // Prints out the LESS file to be compiled
		.pipe(changed(config.paths.dist + config.paths.assets + config.styles.cssOutputFolder)) // Only compile changes
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(less({ strictImports: true, syncImport: true }))
		.pipe(prefix({
			browsers: ['last 15 versions'],
			cascade: true
		}))
		.pipe(gulpif(config.styles.minifyCss, cssmin())) // Minify if config set
		.pipe(gulp.dest(config.paths.dist + config.paths.assets + config.styles.cssOutputFolder)); // Copy to destination folder
});

/* ------------------------------------------------------
 Scripts
 ----------------------------------------------------- */
var appScripts = [
	'!' + config.paths.src + '**/*.spec.js',
	config.paths.src + config.paths.modules + 'app.js',
	config.paths.src + config.paths.modules + '**/*.module.js',
	config.paths.src + config.paths.modules + '**/*.model.js',
	config.paths.src + config.paths.modules + '**/*.service.js',
	config.paths.src + config.paths.modules + '**/*.js'
];

// Vendorscript read from config.json
var vendorConfig = config.vendors;
var vendorScripts = [];

for ( var vendor in vendorConfig ) {
	var path = config.paths.src + config.paths.assets + config.paths.vendors + vendorConfig[vendor];
	vendorScripts.push(path);
}

// ---------- Inject ----------1
gulp.task('js-inject', function () {
	gutil.log(gutil.colors.black.bgGreen('Injecting file references into template'));

	return gulp.src(config.paths.src + 'index.html')
		.pipe(inject(gulp.src(vendorScripts, { read: false }), {
			addRootSlash: false,
			ignorePath: 'app/',
			starttag: '<!-- inject:vendorjs -->'
		}))
		.pipe(inject(gulp.src(appScripts, { read: false }), {
			addRootSlash: false,
			ignorePath: 'app/',
			starttag: '<!-- inject:appjs -->'
		}))
		.pipe(preprocess())
		.pipe(gulp.dest(config.paths.dist));
});

// ---------- Inject ----------
// TODO: Maybe not have all vendors copied for every change
gulp.task('copy-js', function () {
	var vendorStream = gulp.src(config.paths.src + config.paths.assets + config.paths.vendors + '**/*.js')
		.pipe(gulp.dest(config.paths.dist + config.paths.assets + config.paths.vendors));

	var jsStream = gulp.src(config.paths.src + config.paths.modules + '**/*.js')
		.pipe(gulp.dest(config.paths.dist + config.paths.modules));

	return es.concat(jsStream, vendorStream);
});

gulp.task('copy-html', function () {
	var htmlStream = gulp.src(config.paths.src + config.paths.modules + '**/*.html')
		.pipe(gulp.dest(config.paths.dist + config.paths.modules));

	var templateStream = gulp.src(config.paths.src + config.paths.templates + '**/*.html')
		.pipe(gulp.dest(config.paths.dist + config.paths.templates));

	return es.concat(htmlStream, templateStream);
});

// ---------- Server ----------
gulp.task('server', function () {
	connect.server({
		root: config.paths.dist,
		port: config.server.port,
		livereload: config.server.livereload
	});
});

// ---------- Deploy to gh pages ----------
var deployOptions = {};
gulp.task('deploy', function () {
	return gulp.src('./dist/**/*')
		.pipe(deploy(deployOptions));
});