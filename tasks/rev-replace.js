'use strict';

const $       = require('gulp-load-plugins')(),
      gulp    = require('gulp'),
      combine = require('stream-combiner2').obj;

module.exports = function(options){
    var manifest = gulp.src('dist/rev-manifest.json');
    return function(){
        return combine(
            gulp.src(options.src),
            $.revReplace({manifest: manifest}),
            gulp.dest(options.dest)
        );
    };
};