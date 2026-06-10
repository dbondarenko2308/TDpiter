const { src, dest, watch, parallel, series } = require('gulp');
const del = require('del');
const groupCssMediaQueries = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const gap = require('gulp-append-prepend');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const fs = require('fs');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const imagemin = require('gulp-imagemin');
const htmlbeautify = require('gulp-html-beautify');

const options = { indentSize: 1 };

// --- Удаление release ---
function reset() {
	return del('./release');
}
exports.reset = reset;

// --- SCSS в CSS ---
// все стили кроме квиза
function styleConcat() {
	return src([
		'dev/style/scss/common.scss',
		'dev/components/elements/**/*.scss',
		'dev/components/**/**/*.scss',
		'!dev/components/quiz/**/*.scss'
	])
	.pipe(scss())
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'], cascade: true }))
	.pipe(concat('all-style.css'))
	.pipe(groupCssMediaQueries())
	.pipe(replace(/[^-_"'][(./)\w]*\/images/g, '../images'))
	.pipe(dest('release/css'))
	.pipe(browserSync.stream());
}

// только квиз
function styleQuiz() {
	return src('dev/components/quiz/**/*.scss')
	.pipe(scss())
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'], cascade: true }))
	.pipe(concat('quiz.css'))
	.pipe(groupCssMediaQueries())
	.pipe(replace(/[^-_"'][(./)\w]*\/images/g, '../images'))
	.pipe(dest('release/css'))
	.pipe(browserSync.stream());
}

// общий файл стилей для build
function styleConcatCommon() {
	return src([
		'dev/style/scss/common.scss',
		'dev/components/header/*.scss',
		'dev/components/footer/*.scss'
	])
	.pipe(scss())
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'], cascade: true }))
	.pipe(concat('common.css'))
	.pipe(groupCssMediaQueries())
	.pipe(replace(/[^-_"'][(./)\w]*\/images/g, '../images'))
	.pipe(dest('release/css'))
	.pipe(browserSync.stream());
}

// scss в css для компонентов кроме header/footer
function scss2cssComponent() {
	return src(['dev/components/**/*.scss', '!dev/components/{header,footer}/*.scss'])
	.pipe(scss())
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'], cascade: true }))
	.pipe(replace(/[./A-Z0-9]*\/images/g, '../images'))
	.pipe(dest('release/components/'))
	.pipe(browserSync.stream());
}

// scss в css для main
function scss2cssMain() {
	return src(['dev/style/scss/*[!common].scss'])
	.pipe(scss())
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'], cascade: true }))
	.pipe(replace(/[./A-Z0-9]*\/images/g, '../images'))
	.pipe(groupCssMediaQueries())
	.pipe(dest('release/css'))
	.pipe(browserSync.stream());
}

// копирование готовых CSS
function cssCopy() {
	return src('dev/style/**/*.css')
	.pipe(dest('release/css'))
	.pipe(browserSync.stream());
}

// --- JS ---
// все JS кроме квиза
function scriptsConcat() {
	return src([
		'dev/js/*.js',
		'dev/components/elements/*.js',
		'dev/components/**/*.js',

		// исключения
		'!dev/components/quiz/**/*.js',
		'!dev/quiz/**/*.js',
		'!dev/js/quiz.js'
	])
	.pipe(concat('all-scripts.js'))
	.pipe(gap.prependText('$(document).ready(function () {'))
	.pipe(gap.appendText('});'))
	.pipe(dest('release/js'))
	.pipe(browserSync.stream());
}

// JS только для квиза
function scriptsQuiz() {
	return src('dev/components/quiz/**/*.js')
	.pipe(concat('quiz.js'))
	.pipe(gap.prependText('$(document).ready(function () {'))
	.pipe(gap.appendText('});'))
	.pipe(dest('release/js'))
	.pipe(browserSync.stream());
}

// общий JS для build (header/footer)
function scriptsConcatCommon() {
	return src([
		'dev/js/common.js',
		'dev/components/header/*.js',
		'dev/components/footer/*.js'
	])
	.pipe(concat('common.js'))
	.pipe(gap.prependText('$(document).ready(function () {'))
	.pipe(gap.appendText('});'))
	.pipe(dest('release/js'))
	.pipe(browserSync.stream());
}

// копирование JS без объединения
function scriptsCopy() {
	return src(['dev/js/**/*[!common, all-scripts].js'])
	.pipe(gap.prependText('$(document).ready(function () {'))
	.pipe(gap.appendText('});'))
	.pipe(dest('release/js'))
	.pipe(browserSync.stream());
}

// копирование JS компонентов кроме header/footer
function scriptsComponent() {
	return src(['dev/components/**/*.js', '!dev/components/{header,footer}/*.js'])
	.pipe(dest('release/components/'))
	.pipe(browserSync.stream());
}

// --- Live Server ---
function browserSyncFunction() {
	browserSync.init({
		server: { baseDir: 'release/' }
	});
}

// --- Watch ---
function watching() {
	watch(['dev/style/**/*.scss'], styleConcat, scss2cssMain);
	watch(['dev/components/**/*.scss'], styleConcat);
	watch(['dev/components/quiz/**/*.scss'], styleQuiz);
	watch(['dev/style/**/*.css'], cssCopy);
	watch(['dev/components/**/*.js'], scriptsConcat);
	watch(['dev/components/quiz/**/*.js'], scriptsQuiz);
	watch(['dev/js/**/*.js'], scriptsConcat);
	watch(['dev/images/**/*.{jpg,jpeg,png,gif,webp,mp4,svg}'], imageCopy);
	watch(['dev/**/*.html'], fileincludeDev);
	watch(['dev/**/*.html']).on('change', browserSync.reload);
}

// --- HTML сборка ---
function building() {
	return src(['dev/**/*.html'])
	.pipe(replace(/[./A-Z0-9]*\/images/g, 'images'))
	.pipe(dest('./release'));
}

function fileincludeDev() {
	return src(['dev/*.html'])
	.pipe(fileinclude())
	.pipe(replace(/[./A-Z0-9]*\/images/g, 'images'))
	.pipe(dest('release/'));
}

function fileincludeBuild() {
	return src(['dev/*.html'])
	.pipe(fileinclude())
	.pipe(replace(/[./A-Z0-9]*\/images/g, 'images'))
	.pipe(replace(/[./A-Z0-9]*\/all-style/g, '/common'))
	.pipe(replace(/[./A-Z0-9]*\/all-scripts/g, '/common'))
	.pipe(htmlbeautify(options))
	.pipe(dest('release/'));
}

// --- Fonts ---
const outToTtf = () => {
	return src(`dev/fonts/*.{eot,otf}`, {})
	.pipe(fonter({ formats: ['ttf'] }))
	.pipe(dest(`dev/fonts/`))
	.pipe(src(`dev/fonts/*.ttf`))
	.pipe(fonter({ formats: ['woff'] }))
	.pipe(dest(`dev/fonts/`))
	.pipe(src(`dev/fonts/*.ttf`))
	.pipe(ttf2woff2())
	.pipe(dest(`dev/fonts/`))
	.pipe(src(`dev/fonts/*.{woff,woff2}`))
	.pipe(dest(`dev/fonts/`));
};

const fontsStyle = () => {
	let fontsFile = `dev/style/scss/fonts.scss`;
	fs.readdir('dev/fonts/', function (err, fontsFiles) {
		if (fontsFiles) {
			if (!fs.existsSync(fontsFile)) {
				fs.writeFile(fontsFile, '', cb);
				let newFileOnly;
				for (var i = 0; i < fontsFiles.length; i++) {
					let fontFileName = fontsFiles[i].split('.')[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
						let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
						switch (fontWeight.toLowerCase()) {
							case 'thin': fontWeight = 100; break;
							case 'extralight': fontWeight = 200; break;
							case 'light': fontWeight = 300; break;
							case 'medium': fontWeight = 500; break;
							case 'semibold': fontWeight = 600; break;
							case 'bold': fontWeight = 700; break;
							case 'extrabold': case 'heavy': fontWeight = 800; break;
							case 'black': fontWeight = 900; break;
							default: fontWeight = 400;
						}
						fs.appendFile(fontsFile,
							`@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
						newFileOnly = fontFileName;
					}
				}
			} else {
				console.log('Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить');
			}
		}
	});
	return src(`./dev`);
	function cb() {}
};

// --- Images ---
function imageCompress() {
	return src('dev/images/**/*.{jpg,jpeg,png}')
	.pipe(imagemin([imagemin.optipng({ optimizationLevel: 7 })]))
	.pipe(dest('release/images'));
}

function imageCopy() {
	return src(['dev/images/**/*'])
	.pipe(dest('release/images'))
	.pipe(browserSync.stream());
}

// --- Libraries ---
function libraries() {
	return src(['dev/libraries/**/*'])
	.pipe(dest('release/libraries'))
	.pipe(browserSync.stream());
}

// --- Fonts copy ---
function copyfonts() {
	return src([`dev/fonts/*.{woff,woff2}`])
	.pipe(dest('release/fonts'));
}

// --- Основные таски ---
const mainTasks = series(reset, copyfonts, parallel(scriptsCopy, cssCopy, imageCopy, scss2cssMain, libraries));
const addfonts = series(outToTtf, fontsStyle);
const dev = series(mainTasks, fileincludeDev, parallel(scriptsConcat, scriptsQuiz, styleConcat, styleQuiz), parallel(watching, browserSyncFunction));
const build = series(mainTasks, building, fileincludeBuild, parallel(scriptsComponent, scriptsQuiz, scss2cssComponent, styleConcatCommon, scriptsConcatCommon, styleQuiz));

exports.default = dev;
exports.build = build;
exports.addfonts = addfonts;
exports.styleQuiz = styleQuiz;
exports.scriptsQuiz = scriptsQuiz;