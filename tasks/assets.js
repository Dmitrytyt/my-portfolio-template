'use strict';

const gulp    = require('gulp'),
      combine = require('stream-combiner2').obj;

module.exports = function(options){
    return function(){
        return combine(
            gulp.src(options.src[0]),
            gulp.dest(options.dest[0])
        );
    };
};