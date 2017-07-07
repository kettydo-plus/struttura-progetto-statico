/**
 * Created by mgobbi on 02/10/2015.
 */
const configuration=require("../resources/configuration-factory");
module.exports = {
    options: {
        shorthandCompacting: false,
        roundingPrecision: -1
    },
    dist: {
        files: [
            // includes files within path
            {
                expand: true
                , cwd: configuration.getSrcFolder()
                , src: ['css/*.css' ]
                , dest: configuration.getDistFolder()
            }
        ]
    }
};
