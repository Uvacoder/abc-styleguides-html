const babelify = require('babelify');
const browserify = require('browserify');
const gulp = require('gulp');
const gulpCleanCss = require('gulp-clean-css');
const gulpHtmlmin = require('gulp-htmlmin');
const gulpImagemin = require('gulp-imagemin');
const gulpJsonminify = require('gulp-jsonminify');
const gulpPostcss = require('gulp-postcss');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpSvgmin = require('gulp-svgmin');
const gulpUglify = require('gulp-uglify');
const postcssCssnext = require('postcss-cssnext');
const postcssImport = require('postcss-import');
const stylelint = require('stylelint');
const vinylBuffer = require('vinyl-buffer');
const vinylSourceStream = require('vinyl-source-stream');

const dirs = {
  source: './source',
  dest: './dist',
};

gulp.task('css', () => gulp.src(`${dirs.source}/assets/css/style.css`)
  .pipe(gulpSourcemaps.init())
  .pipe(gulpPostcss([
    postcssImport(),
    postcssCssnext({
      features: {
        rem: false,
      },
    }),
  ]))
  .pipe(gulpCleanCss())
  .pipe(gulpSourcemaps.write('.'))
  .pipe(gulp.dest(`${dirs.dest}/assets/css`)));

gulp.task('copy', () => gulp.src(`${dirs.source}/**/*.txt`)
  .pipe(gulp.dest(`${dirs.dest}`)));

gulp.task('html', () => gulp.src(`${dirs.source}/**/*.html`)
  .pipe(gulpHtmlmin({
    caseSensitive: false,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: false,
    collapseWhitespace: true,
    conservativeCollapse: false,
    decodeEntities: false,
    html5: true,
    includeAutoGeneratedTags: false,
    keepClosingSlash: false,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    preserveLineBreaks: false,
    preventAttributesEscaping: false,
    processConditionalComments: false,
    processScripts: false,
    quoteCharacter: false,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeEmptyElements: false,
    removeOptionalTags: true,
    removeRedundantAttributes: false,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    sortAttributes: true,
    sortClassName: true,
    trimCustomFragments: true,
    useShortDoctype: true,
  }))
  .pipe(gulp.dest(`${dirs.dest}`)));

gulp.task('images', () => gulp.src(`${dirs.source}/**/*.{gif,ico,jpg,jpeg,png}`)
  .pipe(gulpImagemin())
  .pipe(gulp.dest(`${dirs.dest}`)));

gulp.task('js', () => {
  const b = browserify({
    debug: true,
    entries: `${dirs.source}/assets/js/script.js`,
    transform: [
      babelify,
    ],
  });

  return b.bundle()
    .pipe(vinylSourceStream('script.js'))
    .pipe(vinylBuffer())
    .pipe(gulpSourcemaps.init({
      loadMaps: true,
    }))
    .pipe(gulpUglify())
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest(`${dirs.dest}/assets/js`));
});

gulp.task('json', () => gulp.src(`${dirs.source}/**/*.json`)
  .pipe(gulpJsonminify())
  .pipe(gulp.dest(`${dirs.dest}`)));

gulp.task('lint:css', () => gulp.src(`${dirs.source}/assets/css/**/*.css`)
  .pipe(gulpPostcss([
    stylelint(),
  ])));

gulp.task('svg', () => gulp.src(`${dirs.source}/**/*.svg`)
  .pipe(gulpSvgmin())
  .pipe(gulp.dest(`${dirs.dest}`)));

gulp.task('watch', () => {
  gulp.watch(`${dirs.source}/**/*.html`, ['html']);
  gulp.watch(`${dirs.source}/assets/css/**/*.css`, ['lint:css', 'css']);
  gulp.watch(`${dirs.source}/assets/js/**/*.js`, ['js']);
  gulp.watch(`${dirs.source}/**/*.json`, ['json']);
  gulp.watch(`${dirs.source}/**/*.{gif,ico,jpg,jpeg,png}`, ['images']);
  gulp.watch(`${dirs.source}/**/*.svg`, ['svg']);
  gulp.watch(`${dirs.source}/**/*.txt`, ['copy']);
});

gulp.task('default', [
  'lint',
  'css',
  'html',
  'js',
  'json',
  'images',
  'svg',
  'copy',
  'watch',
]);

gulp.task('lint', [
  'lint:css',
]);

gulp.task('build', [
  'lint',
  'css',
  'html',
  'js',
  'json',
  'images',
  'svg',
  'copy',
]);
