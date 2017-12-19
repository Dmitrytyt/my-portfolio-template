'use strict';

const $       = require('gulp-load-plugins')(),
      gulp    = require('gulp'),
      combine = require('stream-combiner2').obj;

module.exports = function(options){
    return function(){
        return combine(
            gulp.src(options.src, {base: 'dist'}),
            $.cssUrlAdjuster({
                replace:  ['../','/']
            }),
            $.if('**/vendors.css', $.cssUrlAdjuster({
                prepend: '/bower_components/'
            })),
            $.debug({title: 'Rebase-url-css:'}),
            $.if('*.css', $.cssmin({
                compatibility: 'ie8'
            })),
            gulp.dest(options.dest)
        );
    };
};