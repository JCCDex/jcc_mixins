const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');

gulp.task('eslint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', function() {
  return gulp.src(['src/**/*.js', "src/**/*.json"])
    .pipe(babel({
      presets: [
        ["@babel/preset-env", {
          "targets": {
            "browsers": ["last 2 versions"],
            "node": "8.11.3"
          }
        }]
      ],
      plugins: [
        "@babel/plugin-transform-runtime"
      ]
    }))
    .pipe(gulp.dest('lib/'))
})

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['eslint']);
})

gulp.task('default', gulp.parallel('eslint'));
gulp.task('dev', gulp.parallel('eslint', 'watch'));