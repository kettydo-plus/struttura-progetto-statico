const configuration = require("./grunt-tasks/resources/configuration-factory");
module.exports = function (grunt) {
    var path = require('path');
    grunt.loadTasks('./grunt-tasks/tasks');

    require('load-grunt-config')(grunt, {
        // path to task.js files, defaults to grunt dir
        configPath: path.join(process.cwd(), 'grunt-tasks/config'),

        loadGruntTasks: {
            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        }
    });

// crea e sostituisce i files revisionati con HASH
    grunt.registerTask('ac-file-revision', [
        "ac-filerev:dist",
        "ac-filerev_replace:dist"
    ]);

    if (configuration.data.production) {
        grunt.registerTask('build',
            ['less:dist'
                , 'requirejs:libraries'
                , 'requirejs:dist'
                , 'copy:dist'
                , 'cssmin:dist'
                , 'ac-file-revision'

            ]);
    } else {
        grunt.registerTask('build',
            ['less:dist'
                , 'requirejs:libraries'
                , 'copy:dev'
            ]);
    }


};
