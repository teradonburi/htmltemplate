var gulp = require('gulp');
var webserver = require('gulp-webserver');
var execSync = require('child_process').execSync;


// NodeJS Server
var spawn = require('child_process').spawn;
var node;

// Browser livereload Server
var stream;


// NodeJS Server restart
gulp.task('server', function () {
    if (node) node.kill();
    node = spawn('node', ['--debug', 'app.js'], {
        stdio: 'inherit'
    });
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});


// クライアント起動（ブラウザ,electron）
gulp.task('init', ['server'], function () {
    var result = "" + execSync('/usr/local/bin/brackets .');

    // Browser livereload
    stream = gulp.src('./')
        .pipe(webserver({
            host: '0.0.0.0',
            https: false,
            livereload: {
                enable: true,
                filter: function (fileName) {
                    return true;
                }
            },
            proxies: [
                {
                    source: '/api',
                    target: 'http://localhost:3000'
            }
        ],
            open: true
        }));
});

// clean up process when gulp end
process.on('exit', function () {
    console.log("exit gulp");
    // stop gulp-webserver
    if (stream) stream.emit('kill');
    // stop NodeJS Server
    if (node) node.kill();
});

gulp.task('default', ['init'], function () {
    gulp.watch(['./app.js'], ['server']);
});