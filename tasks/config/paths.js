'use strict';

const location  = 'app';
/* --------- paths --------- */
module.exports = function(){
    return {
        jade : {
            compiled    : location + '/markups/_pages/*.jade',
            destination : location
        },

        scss : {
            location    : location + '/scss/main.scss',
            entryPoint  : location + '/css'
        },

        wiredep : {
            dir         : location + '/bower_components',
            location    : location + '/markups/_main.jade',
            entryPoint  : location + '/markups/'
        },

        sprite : {
            srcFolder   : location + '/sprite-icons/*.{png,jpg}',
            urlSprite   : '../img/main-sprite.png',
            cssName     : '_sprite.scss',
            destImg     : location + '/img/',
            destScss    : location + '/scss/_misc/'
        },

        browserSync : {
            baseDir : './app',
            watchPaths : ['app/*.html', 'app/css/*.css', 'app/js/*.js', 'app/fonts/*']
        },

        serve : {
            baseDir : './dist',
            port: 2000
        }
    };
};