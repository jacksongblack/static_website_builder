module.exports = function (grunt) {
    "use strict";
    var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
    grunt.initConfig({
        appConfig: grunt.file.readJSON("config.json"),
        cssmin:{
            add_banner:{
                options:{
                    banner:"/* 压缩所有样式 */"
                },
                files:{
                    "build/css/" :["static/css/*css","static/css/!*.min.css"]
                }
            }
        },
        shell: {
            init: {
                command: [
                    "mkdir _site",
                    "mkdir _site/css",
                    "mkdir _site/javascript",
                    "mkdir _site/images",
                    "grunt"
                ].join("&&")
            },
            removeBuild :{
                command:[
                    "rm -rf build"
                ].join("&&")
            }
        },

        watch: {
            liveload: {
                options: {
                    livereload: 35737,
                    debounceDelay: "<%= appConfig.debounceDelay %>"
                },
                files: [
                    "./templates/*.html",
                    "./static/js/*.js",
                    "./static/css/*.css"
                ]
            }

        },

        connect: {
            server:{
                options:{
                    port: "<%= appConfig.serverPort %>",
                    hostname: "0.0.0.0",
                    base: 'build/index.html'
                },
                livereload: {
                    options: {
                        middleware: function(connect, options) {
                            return [
                                require("connect-livereload")({port: 35737}),
                                connect.static(options.base),
                                connect.directory(options.base)
                            ];

                        }

                    }

                }
            }
        }

    });

    [
        'grunt-shell',
        'grunt-connect-rewrite',
        'grunt-contrib-watch',
        'grunt-contrib-connect',
        'grunt-contrib-copy',
        'grunt-contrib-clean',
        'grunt-contrib-cssmin'
    ].forEach(function(plugin){
        grunt.loadNpmTasks(plugin);
    });

    grunt.registerTask('init',['shell:init','watch']);
    grunt.registerTask('default',['connect','watch']);
    grunt.registerTask('rebuild', ['shell:removeBuild',"cssmin","connect", "watch"]);

};
