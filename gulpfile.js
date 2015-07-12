var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var es = require('event-stream');
var bowerFiles = require('main-bower-files');
var print = require('gulp-print');
var Q = require('q');
var filter = require('gulp-filter');

// == PATH STRINGS ========

var paths = {
    scripts: 'app/**/*.js',
    styles: ['./app/**/*.css', './app/**/*.scss', './bower_components/bootstrap/dist/css/bootstrap.css', './bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css'],
    images: './images/**/*',
    fonts: './bower_components/bootstrap/dist/fonts/**/*',
    index: './app/index.html',
    partials: ['app/**/*.html', '!app/index.html'],
    distDev: './dist.dev',
    distProd: './dist.prod',
    distScriptsProd: './dist.prod/scripts',
    scriptsDevServer: 'dev.server/**/*.js'
};

// == PIPE SEGMENTS ========

var pipes = {};

pipes.orderedVendorScripts = function() {
    return plugins.order(['jquery.js', 'angular.js']);
};

pipes.orderedAppScripts = function() {
    return plugins.angularFilesort();
};

pipes.minifiedFileName = function() {
    return plugins.rename(function (path) {
        path.extname = '.min' + path.extname;
    });
};

pipes.validatedAppScripts = function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.buildAppScriptsDev = function() {
    return pipes.validatedAppScripts()
        .pipe(plugins.ngAnnotate())
        .pipe(gulp.dest(paths.distDev));
};

pipes.buildAppScriptsProd = function() {
    var scriptedPartials = pipes.scriptedPartials();
    var validatedAppScripts = pipes.validatedAppScripts();

    return es.merge(scriptedPartials, validatedAppScripts)
        .pipe(pipes.orderedAppScripts())
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.concat('app.min.js'))
            .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.distScriptsProd));
};

pipes.buildVendorScriptsDev = function() {
    return gulp.src(bowerFiles())
        .pipe(gulp.dest('dist.dev/bower_components'));
};

pipes.buildVendorScriptsProd = function() {
    var jsFilter = filter('**/*.js');
    return gulp.src(bowerFiles())
        .pipe(jsFilter)
        .pipe(pipes.orderedVendorScripts())
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify())
        .on('error', function(error) {
            console.log(error);
        })
        .pipe(gulp.dest(paths.distScriptsProd));
};

pipes.validatedDevServerScripts = function() {
    return gulp.src(paths.scriptsDevServer)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.validatedPartials = function() {
    return gulp.src(paths.partials)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter());
};

pipes.buildPartialsDev = function() {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.distDev));
};

pipes.buildPartialsProd = function() {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.distProd));
};

pipes.scriptedPartials = function() {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(plugins.ngHtml2js({
            moduleName: "fritzapp"
        }));
};

pipes.buildStylesDev = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sass())
        .pipe(gulp.dest(paths.distDev));
};

pipes.buildStylesProd = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass())
            .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(pipes.minifiedFileName())
        .pipe(gulp.dest(paths.distProd));
};

pipes.processedImagesDev = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distDev + '/images/'));
};

pipes.processedImagesProd = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distProd + '/images/'));
};

pipes.processedFontsDev = function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.distDev + '/fonts/'));
};

pipes.processedFontsProd = function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.distProd + '/fonts/'));
};

pipes.validatedIndex = function() {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

pipes.buildIndexDev = function() {

    var orderedVendorScripts = pipes.buildVendorScriptsDev()
        .pipe(pipes.orderedVendorScripts());

    var orderedAppScripts = pipes.buildAppScriptsDev()
        .pipe(pipes.orderedAppScripts());

    var appStyles = pipes.buildStylesDev();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distDev)) // write first to get relative path for inject
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(gulp.dest(paths.distDev));
};

pipes.buildIndexProd = function() {

    var vendorScripts = pipes.buildVendorScriptsProd();
    var appScripts = pipes.buildAppScriptsProd();
    var appStyles = pipes.buildStylesProd();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distProd)) // write first to get relative path for inject
        .pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(appScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.distProd));
};

pipes.buildAppDev = function() {
    return es.merge(pipes.buildIndexDev(), pipes.buildPartialsDev(), pipes.processedImagesDev(), pipes.processedFontsDev());
};

pipes.buildAppProd = function() {
    return es.merge(pipes.buildIndexProd(), pipes.buildPartialsProd(), pipes.processedImagesProd(), pipes.processedFontsProd());
};

// == TASKS ========

// removes all compiled dev files
gulp.task('clean-dev', function() {
    var deferred = Q.defer();
    del(paths.distDev, function() {
        deferred.resolve();
    });
    return deferred.promise;
});

// removes all compiled production files
gulp.task('clean-prod', function() {
    var deferred = Q.defer();
    del(paths.distProd, function() {
        deferred.resolve();
    });
    return deferred.promise;
});

// checks html source files for syntax errors
gulp.task('validate-partials', pipes.validatedPartials);

// checks index.html for syntax errors
gulp.task('validate-index', pipes.validatedIndex);

// moves html source files into the dev environment
gulp.task('build-partials-dev', pipes.buildPartialsDev);

// converts partials to javascript using html2js
gulp.task('convert-partials-to-js', pipes.scriptedPartials);

// runs jshint on the dev server scripts
gulp.task('validate-devserver-scripts', pipes.validatedDevServerScripts);

// runs jshint on the app scripts
gulp.task('validate-app-scripts', pipes.validatedAppScripts);

// moves app scripts into the dev environment
gulp.task('build-app-scripts-dev', pipes.buildAppScriptsDev);

// concatenates, uglifies, and moves app scripts and partials into the prod environment
gulp.task('build-app-scripts-prod', pipes.buildAppScriptsProd);

// compiles app sass and moves to the dev environment
gulp.task('build-styles-dev', pipes.buildStylesDev);

// compiles and minifies app sass to css and moves to the prod environment
gulp.task('build-styles-prod', pipes.buildStylesProd);

// moves vendor scripts into the dev environment
gulp.task('build-vendor-scripts-dev', pipes.buildVendorScriptsDev);

// concatenates, uglifies, and moves vendor scripts into the prod environment
gulp.task('build-vendor-scripts-prod', pipes.buildVendorScriptsProd);

// validates and injects sources into index.html and moves it to the dev environment
gulp.task('build-index-dev', pipes.buildIndexDev);

// validates and injects sources into index.html, minifies and moves it to the dev environment
gulp.task('build-index-prod', pipes.buildIndexProd);

// builds a complete dev environment
gulp.task('build-app-dev', pipes.buildAppDev);

// builds a complete prod environment
gulp.task('build-app-prod', pipes.buildAppProd);

// cleans and builds a complete dev environment
gulp.task('clean-build-app-dev', ['clean-dev'], pipes.buildAppDev);

// cleans and builds a complete prod environment
gulp.task('clean-build-app-prod', ['clean-prod'], pipes.buildAppProd);

// clean, build, and watch live changes to the dev environment
gulp.task('watch-dev', ['clean-build-app-dev', 'validate-devserver-scripts'], function() {

    // start nodemon to auto-reload the dev server
    plugins.nodemon({ script: 'server.js', ext: 'js', watch: ['dev.server/'], env: {NODE_ENV : 'development'} })
        .on('change', ['validate-devserver-scripts'])
        .on('restart', function () {
            console.log('[nodemon] restarted dev server');
        });

    // start live-reload server
    plugins.livereload.listen({ start: true });

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.buildIndexDev()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.buildAppScriptsDev()
            .pipe(plugins.livereload());
    });

    // watch html partials
    gulp.watch(paths.partials, function() {
        return pipes.buildPartialsDev()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.buildStylesDev()
            .pipe(plugins.livereload());
    });

});

// clean, build, and watch live changes to the prod environment
gulp.task('watch-prod', ['clean-build-app-prod', 'validate-devserver-scripts'], function() {

    // start nodemon to auto-reload the dev server
    plugins.nodemon({ script: 'server.js', ext: 'js', watch: ['dev.server/'], env: {NODE_ENV : 'production'} })
        .on('change', ['validate-devserver-scripts'])
        .on('restart', function () {
            console.log('[nodemon] restarted dev server');
        });

    // start live-reload server
    plugins.livereload.listen({start: true});

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.buildIndexProd()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.buildAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch hhtml partials
    gulp.watch(paths.partials, function() {
        return pipes.buildAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.buildStylesProd()
            .pipe(plugins.livereload());
    });

});

// default task builds for prod
gulp.task('default', ['clean-build-app-prod']);