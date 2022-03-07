const gulp = require('gulp');
const rollup = require('rollup');
const ts = require('rollup-plugin-ts');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

const output = {
  dir: 'dist',
  format: 'umd',
  name: 'Seatchart',
};
const input = 'src/seatchart.ts';
const plugins = [ts()];

gulp.task('watch', function () {
  const watcher = rollup.watch({
    input,
    output,
    plugins,
    watch: ['src'],
  });

  console.log('\n' + '\x1b[32m' + 'Watching files...' + '\x1b[0m', '\n');

  watcher.on('event', (event) => {
    if (event.code === 'BUNDLE_START') {
      console.log(
        '\x1b[36m' + 'File changed' + '\x1b[0m' + ', bundling',
        '\x1b[35m' + event.input + '\x1b[0m'
      );
    } else if (event.code === 'BUNDLE_END') {
      console.log(
        '\x1b[36m' + 'Project bundled' + '\x1b[0m',
        'in',
        event.duration,
        'ms to',
        '\x1b[35m' + 'dist/seatchart.js' + '\x1b[0m' + '\n'
      );
    } else if (event.code === 'ERROR') {
      console.log(event.error + '\n');
    } else if (event.code === 'FATAL') {
      console.log(event.error + '\n');
    }
  });

  return watcher;
});

gulp.task('javascript', async () => {
  await rollup
    .rollup({
      input,
      plugins,
    })
    .then((bundle) => bundle.write(output));

  return gulp
    .src('dist/seatchart.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('style', () => {
  return gulp
    .src('src/seatchart.css')
    .pipe(gulp.dest('dist'))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.parallel('javascript', 'style'));
