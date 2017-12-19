'use strict';

const gulp = require('gulp');

module.exports = function(options) {
    return function() {
        gulp.watch(options.path_scss,   gulp.series('sass'));
        gulp.watch(options.path_jade,   gulp.series('jade'));
        gulp.watch(options.path_wp,     gulp.series('wiredep', 'jade'));
        gulp.watch(options.path_sprite, gulp.series('sprite'));
    };
};