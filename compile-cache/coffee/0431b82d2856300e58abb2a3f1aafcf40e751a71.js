(function() {
  'use strict';
  module.exports = function() {
    this.initConfig({
      coffeelint: {
        grunt: {
          src: ['Gruntfile.coffee']
        },
        lib: {
          src: ['lib/**/*.coffee']
        },
        spec: {
          src: ['spec/**/*.coffee']
        }
      },
      lesslint: {
        src: ['stylesheets/**/*.less']
      },
      watch: {
        options: {
          interrupt: true
        },
        grunt: {
          files: ['Gruntfile.coffee'],
          tasks: ['coffeelint:grunt']
        },
        lib: {
          files: ['lib/**/*.coffee'],
          tasks: ['coffeelint:lib']
        },
        spec: {
          files: ['spec/**/*.coffee'],
          tasks: ['coffeelint:spec']
        },
        stylesheets: {
          files: ['stylesheets/**/*.less'],
          tasks: ['lesslint']
        }
      }
    });
    this.loadNpmTasks('grunt-coffeelint');
    this.loadNpmTasks('grunt-lesslint');
    this.loadNpmTasks('grunt-apm');
    this.loadNpmTasks('grunt-contrib-watch');
    this.registerTask('lint', ['lesslint', 'coffeelint']);
    this.registerTask('link', ['apm-link']);
    this.registerTask('unlink', ['apm-unlink']);
    this.registerTask('test', ['apm-test']);
    this.registerTask('dev', ['apm-link', 'watch']);
    return this.registerTask('default', ['lint', 'test']);
  };

}).call(this);
