'use strict';

const $       = require('gulp-load-plugins')(),
      gulp    = require('gulp'),
      combine = require('stream-combiner2').obj;

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
    return function(){
        if(isDevelopment){
            return combine(
                gulp.src(options.src),
                $.sourcemaps.init(),
                $.sass(),
                $.autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }),
                $.sourcemaps.write(),
                gulp.dest(options.dest)
            ).on( 'error', $.notify.onError({
                title: 'Sass Compilation Failed',
                message: '<%= error.message %>'
            }));
        } else {
            return combine(
                // вырезать стили, которые не используются
                gulp.src(options.src),
                $.sass(),
                $.autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }),
                gulp.dest(options.dest)
            ).on( 'error', $.notify.onError({
                title: 'Sass Compilation Failed',
                message: '<%= error.message %>'
            }));
        }
    };
};
