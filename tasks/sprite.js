'use strict';

const gulp         = require('gulp'),
      spriteSmith  = require('gulp.spritesmith'),
      buffer       = require('vinyl-buffer'),
      imagemin     = require('gulp-imagemin'),
      merge        = require('merge-stream');

module.exports = function (options) {
    return function(){
        // Generate our sprite-sheet
        var spriteData = gulp.src(options.src)
            .pipe(spriteSmith({
                imgName: options.url,
                cssName: options.cssName,
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                padding:   10,
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }));

        // Pipe image stream through image optimizer and onto disk
        var imgStream = spriteData.img
            // DEV: We must buffer our stream into a Buffer for `imagemin`
            .pipe(buffer())
            .pipe(imagemin())
            .pipe(gulp.dest(options.destImg));

        // Pipe CSS stream through CSS optimizer and onto disk
        var cssStream = spriteData.css
            .pipe(gulp.dest(options.destScss));

        // Return a merged stream to handle both `end` events
        return merge(imgStream, cssStream);
    };
};