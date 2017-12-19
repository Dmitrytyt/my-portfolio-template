'use strict';

const $       = require('gulp-load-plugins')(),
      gulp    = require('gulp'),
      combine = require('stream-combiner2').obj,
      dirSep  = require('path').sep;
var filename  = [];

module.exports = function(options){
    return function(){
        return combine(
            gulp.src(options.src),
            $.rename(function(path) {
                // Переменная dirSep содержит разделитель директорий для
                // текущей ОС. Этот хак позволяет проводить сборку как в
                // Linux так и в Windows системах.
                var dirs = path.dirname.split(dirSep);
                dirs.splice(1, 1);
                path.dirname = (dirs.length > 1)? dirs[1]: '';
            }),
            $.debug({title: 'Path:'}),
            gulp.dest(options.dest)
        );
    };
};