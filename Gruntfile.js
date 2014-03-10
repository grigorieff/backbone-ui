module.exports = function(grunt) {
  grunt.initConfig({
    qunit: {
      files: ['test/test.html']
    },

    browserify: {
      basic: {
        src: ['index.js'],
        dest: 'dist/backbone-ui.js',
        options: {
          external: ['underscore', 'backbone'],
          alias: ['./index.js:backbone-ui']
        }
      }
    },

    umd: {
      default: {
        src: 'dist/backbone-ui.js',
        template: './umd-template.hbs',
        objectToExport: "require('backbone-ui')",
        globalAlias: 'Backbone.UI',
        deps: {
          'default': ['_', 'Backbone'],
          amd: ['underscore', 'backbone'],
          cjs: ['underscore', 'backbone'],
          global: ['_', 'Backbone']
        },
        browserifyMapping: '{"backbone":Backbone,"underscore":_}'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('build', ['browserify', 'umd']);
  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.registerTask('test', ['build', 'qunit']);
};
