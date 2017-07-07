/**
 * Created by mgobbi on 25/09/2015.
 */
var req_config = require("../utils/require-config");
var configuration = require("../resources/configuration-factory");
module.exports = {
    libraries: {
        options: {
            baseUrl: configuration.src(configuration.JS),
            paths: req_config.options.paths,
            shim: req_config.options.shim,
            map: req_config.options.map,
            // name: utils.getSourcePath(utils.JS) + "libs/libraries",
            include: req_config.libraries(),
            optimize: "uglify2",
            out: configuration.src(configuration.JS) + "libs/libraries.js"
        }
    },
    dist: {
        options: {
            preserveLicenseComments: false,
            findNestedDependencies: true,
            paths: req_config.empty(),
            shim: req_config.options.shim,
            map: req_config.options.map,
            baseUrl: configuration.src(configuration.JS),
            mainConfigFile: configuration.src(configuration.JS) + "/config.js",
            name: "config",
            optimize: "uglify2",
            include: ["requireLib"],
            out: configuration.dist(configuration.JS) + "/optimized.js"
        }
    }
};
