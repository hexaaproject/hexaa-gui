// Generated on 2014-04-04 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

    
  grunt.loadNpmTasks('grunt-string-replace');  
  grunt.loadNpmTasks("grunt-remove-logging");

  // Define the configuration for all the tasks
  grunt.initConfig({

    removelogging: {
      dist: {
        src: "dist/**/**/**/*.js" 
      }
    },

     php: {
        serve: {
            options: {
                hostname: 'bkotyik.hbit.sztaki.hu',
                port: 9000,
                base: '<%= yeoman.app %>', // Project root                
                open: true
            }
        },
        dist: {
            options: {
                hostname: 'bkotyik.hbit.sztaki.hu',
                port: 9000,
                base: '<%= yeoman.dist %>', // Project root                
                open: true
            }
        }
    },

    'string-replace': {
        version: {
          files: {
            '<%= yeoman.dist %>/index.html': '<%= yeoman.dist %>/index.html'
          },
          options: {
            replacements: [{
              pattern: /FRONTEND_VERSION_PLACEHOLDER/g,
              replacement: '<%= pkg.version %> #'+grunt.template.today('yyyy.mm.dd HH:MM:ss') 
            }]
          }
        }
      },
      pkg: grunt.file.readJSON('package.json'),

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}{,*/}{,*/}*.js'],
        tasks: ['sftp:scripts','newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer','sftp:styles']
      },
      views: {
        files: ['<%= yeoman.app %>/views/{,*/}*.html'],
        tasks: ['sftp:views']
      },
      lang: {
        files: ['<%= yeoman.app %>/lang/{,*/}*.*'],
        tasks: ['sftp:lang']
      },
      index: {
        files: ['<%= yeoman.app %>/index.html'],
        tasks: ['sftp:index']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}{,*/}{,*/}{,*/}*.html',
          '<%= yeoman.app %>/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.app %>/scripts/{,*/}{,*/}{,*/}{,*/}{,*/}*.js'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'bkotyik.hbit.sztaki.hu',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        //'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },      
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: '<%= yeoman.app %>/',
        exclude: ['bower_components/bootstrap/dist/css/bootstrap.css']
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.app %>/index.html'],
      js: ['<%= yeoman.dist %>/scripts/themeService.js','<%= yeoman.dist %>/scripts/imageFormatter.js'],      
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs' ],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html','<%= yeoman.dist %>/php/templates/{,*/}*.php'],
      css: ['<%= yeoman.dist %>/styles/*.css'],
      js: ['<%= yeoman.dist %>/scripts/{,*/}{,*/}{,*/}*.js'],
        options: {
          assetsDirs: ['<%= yeoman.dist %>'],
          patterns: {
                  js: [
                      [ /((styles|bower_components)\/.*?\.(?:css))/gm, 'Update the JS to reference our revved styles'],
                      [/((images)\/.*?\.(?:png))/gm, 'Update the JS to reference our revved images']
                  ]
              }
        }     
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}{,*/}{,*/}*.html',
            'styles/skins/*.css',
            'images/{,*/}*.{webp,png,jpg,gif}',
            'lang/{,*/}{,*/}{,*/}{,*/}*.*',
            'config.php',
            'connect.php',
            'php/{,*/}{,*/}{,*/}*.php',
            'index.php',
            'log.php',
            'logout.php',
            'favicon.ico',
            'robots.txt',
            'invitation.php',
            'config.php.dist',
            'styles/fonts/*'
          ]
        }, 
        {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        },
        {
          expand: true,          
          cwd: 'bower_components/font-awesome',
          src: ['fonts/*.*'],
          dest: '<%= yeoman.dist %>'
        }]      
      },
      
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles/',
        dest: '.tmp/styles/',
        src: '*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles'//,
        //'imagemin',
        //'svgmin'
      ]
    },

    
    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }    
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'php:serve',      
      'watch:livereload'
    ]);
  });

  grunt.registerTask('production', function (target) {
 
    grunt.task.run([
      'build',      
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',      
      'php:dist',      
      'watch:livereload'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);    
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin',
    'string-replace'    
  ]);


  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  //Added by Marton Balint (bkotyik)  
};
