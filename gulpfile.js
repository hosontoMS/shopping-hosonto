
const gulp = require('gulp'),
    gutil = require('gulp-util'),
//    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync');

var config ={
    host: 'localhost',
    port: 8080,
    otherPort: 3000,
    server: './cart_server.js',
    jsSources: ['./js/*.js', './models/*.js', './static/js/*.js'],

    htmlSources: ['./views/*.html', './static/*.html'],
    cssSources: [
        './static/css/**/*.css',
    ],
    tempDir: './temp',
    targetDir: './build/'

    };


function startBrowserSync() {
    if (browserSync.active) {
        return;
    }
    gulp.watch([config.htmlSources, config.jsSources, config.jsSources], ['build']);

    const options = {
        proxy: config.host + ':' + config.port,
        port: config.otherPort,
        files: [config.targetDir],
        injectChanges: true,
        reloadDelay: 1000,
    };
    browserSync(options);
}


gulp.task('default', ['serve']);

gulp.task('serve', ['build'], () => {
    const options = {
        script: config.server,
        delayTime: 1,
        env: {
            PORT: config.port,
            NODE_ENV: 'dev',
        },
        watch: [config.serverSource],
    };
    return nodemon(options)
        .on('restart', ['build'])
        .on('start', startBrowserSync);
});


gulp.task('log', function() {
    gutil.log('== Hosonto Shopping Cart ==')
});

gulp.task('copy', function() {
    gulp.src(config.htmlSources)
        .pipe(gulp.dest(config.targetDir));
    gulp.src(config.cssSources)
        .pipe(gulp.dest(config.targetDir+'/css'));

});


//gulp.task('coffee', function() {
//    gulp.src(coffeeSources)
//        .pipe(coffee({bare: true})
//            .on('error', gutil.log))
//        .pipe(gulp.dest('scripts'))
//});

gulp.task('js', function() {
    gulp.src(config.jsSources)
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest(config.targetDir))
        //.pipe(connect.reload())
});

gulp.task('watch', function() {
    gulp.watch(config.jsSources, ['js']);
    gulp.watch(config.cssSources, ['css']);
    gulp.watch(config.htmlSources, ['html']);
});

/*
gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: true
    })
});
*/

/*
gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});
*/

gulp.task('build', ['copy', 'js',  'watch']);
