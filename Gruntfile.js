module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.task.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', 'Log some stuff.', function() {
        grunt.log.write('Logging some stuff...').ok();
    });
}