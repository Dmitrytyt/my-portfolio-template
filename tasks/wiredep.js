'use strict';

const wiredep = require('wiredep').stream,
      gulp    = require('gulp'),
      combine = require('stream-combiner2').obj;

module.exports = function(options){
    return function(){
        return combine(
            gulp.src(options.src),
            gulp.dest('app'),
            wiredep({
                directory: options.dir
            }),
            gulp.dest(options.dest)
        );
    };
};