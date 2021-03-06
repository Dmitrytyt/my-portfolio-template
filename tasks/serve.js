'use strict';

const browserSync = require('browser-sync').create();

module.exports = function(options) {
    return function() {
        browserSync.init({
            notify: false,
            server: {
                baseDir: options.baseDir
            },
            port: options.port
        });
    };
};