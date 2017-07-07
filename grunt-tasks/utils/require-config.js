const NODE_MODULES="../../node_modules";
module.exports = {
    options: {
        paths: {
            angular:`${NODE_MODULES}/angular/angular`

        },

        shim: {
            'angular': {
                exports: 'angular'
            }
        }


    }

    , libraries: function () {
        return Object.keys(this.options.paths);
    },
    empty: function () {
        return Object.keys(this.options.paths).reduce(function (prev, curr) {
            prev[curr] = "empty:";
            return prev;
        }, {requireLib: `${NODE_MODULES}/requirejs/require`})
    }

};