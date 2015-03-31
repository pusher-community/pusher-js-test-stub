var gulp = require('gulp');
var webpack = require('gulp-webpack');
var server = require('gulp-server-livereload');

var dir = __dirname;

gulp.task('build', function() {
    return gulp.src(dir + '/src/PusherTestStub.js')
        .pipe(webpack({
          output: {
            library: 'PusherTestStub',
            filename: 'pusher-test-stub.js'
          }
        }))
        .pipe(gulp.dest(dir + '/dist/'));
});

gulp.task('serve', ['build'], function() {
  gulp.src(dir)
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});
