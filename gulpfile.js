'use strict';

const
    gulp      = require('gulp'),
    location  = 'app';

/* --------- paths --------- */
const paths = require('./tasks/config/paths').call(this);


function lazyRequireTask(taskName, path, options){
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback){
        const task = require(path).call(this, options);
        return task(callback);
    });
}

/* --------- 1. Clean --------- */
lazyRequireTask('clean', './tasks/clean', {
    dest: [
        location + '/css/*.css',
        location + '/css/*.json',
        location + '/img/main-sprite.png',
        location + '/*.html',
        location + '/scss/_misc/_sprite.scss'
    ]
});

/* --------- 2. Sass --------- */
lazyRequireTask('sass', './tasks/sass', {
     src:  paths.scss.location,
    dest: paths.scss.entryPoint
});

/* --------- 3. Sprite --------- */
lazyRequireTask('sprite', './tasks/sprite', {
    src:      paths.sprite.srcFolder,
    url:      paths.sprite.urlSprite,
    cssName:  paths.sprite.cssName,
    destImg:  paths.sprite.destImg,
    destScss: paths.sprite.destScss
});

/* --------- 4. Jade --------- */
lazyRequireTask('jade', './tasks/jade', {
     src: paths.jade.compiled,
    dest: paths.jade.destination
});

/* --------- 5. Wiredep Bower --------- */
lazyRequireTask('wiredep', './tasks/wiredep', {
    dir:  paths.wiredep.dir,
    src:  paths.wiredep.location,
    dest: paths.wiredep.entryPoint
});

/* --------- 6. Sync --------- */
lazyRequireTask('sync', './tasks/sync', {
    paths: paths.browserSync.watchPaths,
    baseDir: paths.browserSync.baseDir,
    port: 1000
});

/* --------- 7. Watches --------- */
lazyRequireTask('watch', './tasks/watch', {
    path_scss  : location + '/scss/**/*.scss',
    path_jade  : location + '/markups/**/*.jade',
    path_wp    : 'bower.json',
    path_sprite: location + '/sprite-icons/**/*.{svg,png,jpg}'
});

lazyRequireTask('clean-jade', './tasks/clean', {
    dest: [location + '/*.jade']
});
/* --------- 8. Build --------- */
gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('sprite', 'wiredep'),
    gulp.parallel('clean-jade', 'sass', 'jade')
));

/* --------- 9. Development --------- */
gulp.task('default', gulp.series('build', gulp.parallel('sync','watch')));



// NODE_ENV=production gulp dist
/*******************************************
 * DIST
 ******************************************/
/* --------- 1. Clean --------- */
lazyRequireTask('clean-dist', './tasks/clean', {
    dest: ["./dist/**", "!./dist/"]
});

/* --------- 2. Bower resource components --------- */
lazyRequireTask('bower-dist', './tasks/bower', {
    src:  'app/bower_components/**/*.{png,jpg,eot,svg,ttf,woff}',
    dest: 'dist/bower_components'
});

/* --------- 2. Sass --------- */
lazyRequireTask('sass-dist', './tasks/sass', {
    src:  paths.scss.location,
    dest: 'dist/css'
});

/* --------- 3. Script --------- */
lazyRequireTask('script', './tasks/script', {
    src:  [
        'app/js/configs/ya/data/**',
        'app/js/json/**'
    ],
    dest: [
        'dist/js/configs/ya/data/',
        'dist/js/json/'
    ]
});

/* --------- 4. Assets --------- */
lazyRequireTask('assets', './tasks/assets', {
    src:  ['app/fonts/**'],
    dest: ['dist/fonts/']
});

/* --------- 5. Image --------- */
lazyRequireTask('image', './tasks/image', {
    src:  'app/img/**/*',
    dest: 'dist/img'
});

/* --------- 6. Jade --------- */
lazyRequireTask('jade-dist', './tasks/jade', {
    src: paths.jade.compiled,
    dest: 'dist'
});

/* --------- 7. Wiredep Bower --------- */
lazyRequireTask('wiredep-dist', './tasks/wiredep', {
    dir:  paths.wiredep.dir,
    src:  'dist/*.html',
    dest: 'dist'
});

/* --------- 8. Useref --------- */
lazyRequireTask('useref', './tasks/useref', {
    src:  'dist/*.html',
    dest: 'dist'
});

/* --------- 9. Rebase css url and minify  --------- */
lazyRequireTask('url-rebase', './tasks/url-rebase', {
    src:  'dist/css/*.css',
    dest: 'dist'
});

/* --------- 10. Minify js --------- */
lazyRequireTask('minify-js', './tasks/minify-js', {
    src:  'dist/js/*.js',
    dest: 'dist'
});

/* --------- 11. Rev --------- */
lazyRequireTask('rev', './tasks/rev', {
    src:  ['dist/css/*.css', 'dist/js/*.js'],
    dest: 'dist'
});

/* --------- 12. Rev-replace --------- */
lazyRequireTask('rev-replace', './tasks/rev-replace', {
    src:  'dist/*.html',
    dest: 'dist'
});

/* --------- 13. Serve --------- */
lazyRequireTask('serve', './tasks/serve', {
    baseDir: paths.serve.baseDir,
    port: 2000
});

/* --------- 14. App size --------- */
lazyRequireTask('size-app', './tasks/size-app', {
    src: ["app/**/*", "!app/bower_components/**"],
    title: "APP size: "
});

/* --------- 15. Dist size --------- */
lazyRequireTask('size-dist', './tasks/size-app', {
    src: "dist/**/*",
    title: "Dist size: "
});


gulp.task('dist', gulp.series(
    'clean-dist',
    'bower-dist',
    'sprite',
    gulp.parallel('sass-dist', 'jade-dist', 'script', 'assets', 'image'),
    'wiredep-dist',
    'useref',
    'url-rebase',
    'minify-js',
    'rev',
    'rev-replace',
    'size-app',
    'size-dist'
));
