module.exports = function (grunt) {

    grunt.initConfig({
        nwjs: {
            options: {
                version: '0.12.3',
                mac_icns: 'btclip.icns',
                build_dir: './builds', // Where the build version of my node-webkit app is saved
                mac: true, // We want to build it for mac
                win: true, // We want to build it for win
                linux32: true, // We don't need linux32
                linux64: true // We don't need linux64
            },
            src: ['src/**'] // Your node-webkit app
        },
        bower: {
            install: {}
        }
    });

    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.loadNpmTasks('grunt-bower-task');

    // Default task(s).
    grunt.registerTask('default', ['bower', 'nwjs']);

};
