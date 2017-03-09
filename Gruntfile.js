module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    _test_runner: '_mocha',
    _unit_args: '-A -u exports -t 10000 ./test/unit/test*.js',

    unit: '<%= _test_runner %> <%= _unit_args %>',
    unit_cover: 'istanbul cover --dir cov-unit <%= _test_runner %> -- <%= _unit_args %>'
  });

  grunt.loadNpmTasks('grunt-fh-build');
  grunt.registerTask('default', ['fh-default']);
};
