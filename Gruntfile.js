/**
 * A lot of directories are verbose without wildcards, largely a result of having a shared codebase with the backend code.
 *
 *  TODO: Separate tasks for backend app!
 */
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /**
         * Converts our Sass files to CSS.
         */
        sass: {
            compile: {
                options: {
                    style: 'nested'
                },
                files: {
                    'public/css/style.css': 'style.scss'
                }
            }
        },


        /**
         * Watches for changes on all JS and CSS files.
         *
         * Live reload is working (servers running on localhost 35729 and 35728).
         * You'll need a Live-reload plugin installed (https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
         *
         * Changes to grunt file will rerun the grunt script.
         */
        watch: {
            css: {
                files: ['style.scss'],
                tasks: ['sass:compile']
            },
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        },

        /**
         * Converts all ES6 Javascript into ES5 Javascript.
         *
         * .babelrc full configures Babel.
         */
        babel: {
            /**
             * Transform ES6 JS files into ES5.
             */
            es6: {
                options: {
                    sourceMap: true,
                    presets: ['es2015'],
                },
                files: {
                    // "client.js": "public/js/prod.js"
                    "public/js/prod.js": "client.js",
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('development', ['sass:compile', 'watch']);
    grunt.registerTask('production',  ['sass:compile', 'babel:es6']);
};
