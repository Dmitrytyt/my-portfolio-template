'use strict';

const browserSync = require('browser-sync').create(),
      gulp        = require('gulp');

module.exports = function(options) {
    return function() {
        browserSync.init({
            server: {
                baseDir: options.baseDir
            },
            port: options.port
        });
        gulp.watch(options.paths).on('change', browserSync.reload);
    };
};