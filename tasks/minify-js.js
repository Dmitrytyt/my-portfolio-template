'use strict';

const $       = require('gulp-load-plugins')(),
      gulp    = require('gulp'),
      combine = require('stream-combiner2').obj;

module.exports = function(options){
    return function(){
        return combine(
            gulp.src(options.src, {base: 'dist'}),
            $.debug({title: 'Minify-js:'}),
            $.if('*.js', $.uglify()),
            gulp.dest(options.dest)
        );
    };
};