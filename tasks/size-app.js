'use strict';

const $       = require('gulp-load-plugins')(),
      gulp    = require('gulp'),
      combine = require('stream-combiner2').obj;

module.exports = function(options){
    return function(){
        return combine(
            gulp.src(options.src),
            $.size({title: options.title})
        );
    };
};