/**
 * Created by mgobbi on 04/07/2017.
 */
require("../resources/configuration-factory");
var Handlebars = require("handlebars");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");
var fs = require("fs");
var path = require("path");
var glob = require("glob");

Handlebars.setDelimiter = function (start, end) {
    //save a reference to the original compile function
    if (!Handlebars.original_compile) Handlebars.original_compile = Handlebars.compile;

    Handlebars.compile = function (source) {
        var s = "\\" + start,
            e = "\\" + end,
            RE = new RegExp('(' + s + '{2,3})(.*?)(' + e + '{2,3})', 'ig');
        var original_RE = new RegExp('(\\{{2,3})(.*?)(\\}{2,3})', 'ig');

        var replacedSource = source.replace(original_RE, function (match, startTags, text, endTags, offset, string) {
            var startRE = new RegExp('{', 'ig');
            var endRE = new RegExp("}", 'ig');

            startTags = startTags.replace(/{/, '\\{');
            endTags = endTags.replace(/}/, '}');

            return startTags + text + endTags;
        });
        replacedSource = replacedSource.replace(RE, function (match, startTags, text, endTags, offset, string) {
            var startRE = new RegExp(s, 'ig'), endRE = new RegExp(e, 'ig');

            startTags = startTags.replace(startRE, '\{');
            endTags = endTags.replace(endRE, '\}');

            return startTags + text + endTags;
        });

        return Handlebars.original_compile(replacedSource);
    };
};

//EXAMPLE to change the delimiters to [:
Handlebars.setDelimiter('[', ']');


var configuration = require("../resources/common/configuration");

const {DIST_FOLDER, DATA_DIR, BODY_DIR, LAYOUT_DIR, INCLUDE_DIR, pages} = configuration;

function deleteDistFolder() {
    return new Promise(resolve => {
        rimraf(DIST_FOLDER, function () {
            console.log('clean');
            resolve();

        });
    })
}
function createDistFolder() {
    return new Promise(resolve => {
        mkdirp(DIST_FOLDER, function () {
            resolve();
        });
    })
}
function registerIncludes() {
    return new Promise(resolve => {
        // options is optional
        var options = {};
        glob(INCLUDE_DIR + "**/*.html", options, function (er, files) {
            // files is an array of filenames.
            // If the `nonull` option is set, and nothing
            // was found, then files is ["**/*.js"]
            // er is an error object or null.
            resolve(files);
        })
    }).then(filenames => {
        filenames.forEach(function (filename) {

            var nameParsed = path.parse(filename);
            var name = path.normalize(nameParsed.name);


            if (name.match(/{scripts|stylesheet}/gim)) {
                return;
            }
            var include = fs.readFileSync(filename, 'utf8');
            Handlebars.registerPartial(name, include);
        });
        return true;
    });

}


function createPages() {

    var _pages = Object.keys(pages).map(key => {
        var page = pages[key] === true ? {} : pages[key];
        const {layout = "index", body = key, scripts = "scripts", stylesheet = "stylesheet", data = key} = page;
        var layoutHTML = fs.readFileSync(`${LAYOUT_DIR}${layout}.html`, {}).toString();
        var bodyHTML = fs.readFileSync(`${BODY_DIR}${body}.html`).toString();
        var scriptsHTML = fs.readFileSync(`${INCLUDE_DIR}${scripts}.html`).toString();
        var stylesheetHTML = fs.readFileSync(`${INCLUDE_DIR}${stylesheet}.html`).toString();

        Handlebars.registerPartial('body', bodyHTML);
        Handlebars.registerPartial('scripts', scriptsHTML);
        Handlebars.registerPartial('stylesheet', stylesheetHTML);
        var dataJS = {};
        if (fs.existsSync(`${DATA_DIR}${data}.js`)) {
            dataJS = require(`${DATA_DIR}${data}`);
        }


        var template = Handlebars.compile(layoutHTML);

        var result = {
            page: key
            , html: template(Object.assign(dataJS, {__pageName__: key}))
        };
        return result;

    });
    _pages.forEach(item => {
        fs.writeFileSync(`${DIST_FOLDER}${item.page}.html`, item.html, 'utf8');
    });
}

function exit() {
    if (arguments.length && arguments[0] !== undefined) {
        console.log(arguments[0]);
        process.exit(1);
    } else {
        process.exit(0);
    }

}
if (fs.existsSync(DIST_FOLDER)) {
    deleteDistFolder()
        .then(createDistFolder)
        .then(registerIncludes)
        .then(createPages)
        .then(exit)
        .catch(exit)
} else {
    createDistFolder()
        .then(registerIncludes)
        .then(createPages)
        .then(exit)
        .catch(exit)
}