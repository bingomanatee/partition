module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'src/index.js',
                    'src/Dimension.js',

                    'src/blend.js',
                    'src/browserDetect.js',
                    'src/Rect.js',
                    'src/Slice.js',
                    'src/points.js',

                    'src/renderGrid.js',
                    'src/renderPath.js',

                    'src/graphs/index.js',
                    'src/graphs/bar_vertical.js',

                    'src/engines/index.js',
                    'src/engines/Raphael/renderCircle.js',
                    'src/engines/Raphael/renderPath.js',
                    'src/engines/Raphael/renderRect.js',
                    'src/engines/Raphael/renderText.js',
                    'src/engines/Raphael/renderWedge.js',
                    'src/engines/Raphael/undraw.js',
                    'src/engines/Raphael/setElement.js',
                    'src/engines/Raphael/clear.js'
                ],
                dest: 'build/Partition.js'
            }
        },
        uglify: {
            options: {
                mangle: false,
                compress: false,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: [
                    {    src: 'build/Partition.js',
                        dest: 'index.js'},
                    {
                        src: 'build/Partition.js',
                        dest: 'testServer/public/js/Partition.js'
                    }
                ]

            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};