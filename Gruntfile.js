
module.exports = function(grunt) {


 grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/*.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
     clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            'dist/**/*.*'
                        ]
                    }
                ]
            }
        },
     jshint: {
       options: {
                jshintrc: '.jshintrc',
                force: true,
                reporter: 'checkstyle',
                reporterOutput: 'test-results/checkstyle.xml'
            },  
    all: ['Gruntfile.js', 'src/*.js']
  }
  });

grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-clean');

grunt.registerTask('default',[

  'clean',
  'jshint'

  ]);



};



