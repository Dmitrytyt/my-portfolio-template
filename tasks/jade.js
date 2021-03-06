'use strict';

const $       = require('gulp-load-plugins')(),
      gulp    = require('gulp'),
      combine = require('stream-combiner2').obj;

module.exports = function (options) {
    return function(){
        return combine(
            gulp.src(options.src),
            $.jade({
                pretty: '\t',
            }),
            gulp.dest(options.dest)
        ).on( 'error', $.notify.onError({
            title: 'Jade Compilation Failed',
            message: '<%= error.message %>'
        }));
    };
};