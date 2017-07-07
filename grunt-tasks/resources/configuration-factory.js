 function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

  function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}


const fs = require("fs");
const props_path = `${process.cwd()}/grunt-tasks/resources/properties.json`;
let properties = {name: "common"};
if (fs.existsSync(props_path)) {
    properties = require("./properties.json");
}

const path = `${process.cwd()}/grunt-tasks/resources/${properties.name}`;
const defaultConfiguration = require("./common/configuration");
let configuration = {};

if (fs.existsSync(path)) {
    configuration = require(`${path}/configuration`);

}

module.exports = mergeDeep(  defaultConfiguration, configuration);
