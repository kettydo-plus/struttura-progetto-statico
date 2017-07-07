const configuration = require("../resources/configuration-factory");

module.exports = {
    dist: {
        files: [
            // includes files within path
            {
                expand: true
                , cwd: configuration.SRC_FOLDER
                , src: [
                'css/font/*.*'
                ,'img/**/*.*'


            ]
                , dest: configuration.DIST_FOLDER
            }
            , {
                [`${configuration.dist(configuration.JS)}/libs/require.js`]: ["./node_modules/requirejs/require.js"]
            }


        ]
    }
    , dev: {
        files: [
            // includes files within path
            {
                expand: true
                , cwd: configuration.SRC_FOLDER
                , src: [
                'css/**/*.*'
                ,'img/**/*.*'
                , "img/favicon.ico"
                , "js/**/*.js"

            ]
                , dest: configuration.DIST_FOLDER
            }
            , {
                [`${configuration.dist(configuration.JS)}/libs/require.js`]: ["./node_modules/requirejs/require.js"]
            }
        ]
    }
};