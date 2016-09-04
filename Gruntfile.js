module.exports = function(grunt) {

  // Project configuration.
 grunt.initConfig({
  watch: {
    all: {
      options: { livereload: true },
      files: ['**/*'],
    },
  },
});

  // Load the plugin that provides thewatchuglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};