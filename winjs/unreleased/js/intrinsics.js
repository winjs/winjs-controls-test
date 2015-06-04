
/*! Copyright (c) Microsoft Corporation.  All Rights Reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
(function () {

    var globalObject = 
        typeof window !== 'undefined' ? window :
        typeof self !== 'undefined' ? self :
        typeof global !== 'undefined' ? global :
        {};
    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // amd
            define([], factory);
        } else {
            globalObject.msWriteProfilerMark && msWriteProfilerMark('WinJS.4.0 4.0.0.winjs.2015.6.4 intrinsics.js,StartTM');
            if (typeof module !== 'undefined') {
                // CommonJS
                factory();
            } else {
                // No module system
                factory(globalObject.WinJS);
            }
            globalObject.msWriteProfilerMark && msWriteProfilerMark('WinJS.4.0 4.0.0.winjs.2015.6.4 intrinsics.js,StopTM');
        }
    }(function (WinJS) {

// Copyright (c) Microsoft Corporation.  All Rights Reserved. Licensed under the MIT License. See License.txt in the project root for license information.
/*jshint ignore:start */
var require;
var define;
/*jshint ignore:end */

(function () {
    "use strict";

    var defined = {};
    define = function (id, dependencies, factory) {
        if (!Array.isArray(dependencies)) {
            factory = dependencies;
            dependencies = [];
        }

        var mod = {
            dependencies: normalize(id, dependencies),
            factory: factory
        };

        if (dependencies.indexOf('exports') !== -1) {
            mod.exports = {};
        }

        defined[id] = mod;
    };

    // WinJS/Core depends on ./Core/_Base
    // should return WinJS/Core/_Base
    function normalize(id, dependencies) {
        id = id || "";
        var parent = id.split('/');
        parent.pop();
        return dependencies.map(function (dep) {
            if (dep[0] === '.') {
                var parts = dep.split('/');
                var current = parent.slice(0);
                parts.forEach(function (part) {
                    if (part === '..') {
                        current.pop();
                    } else if (part !== '.') {
                        current.push(part);
                    }
                });
                return current.join('/');
            } else {
                return dep;
            }
        });
    }

    function resolve(dependencies, parent, exports) {
        return dependencies.map(function (depName) {
            if (depName === 'exports') {
                return exports;
            }

            if (depName === 'require') {
                return function (dependencies, factory) {
                    require(normalize(parent, dependencies), factory);
                };
            }

            var dep = defined[depName];
            if (!dep) {
                throw new Error("Undefined dependency: " + depName);
            }

            if (!dep.resolved) {
                dep.resolved = load(dep.dependencies, dep.factory, depName, dep.exports);
                if (typeof dep.resolved === "undefined") {
                    dep.resolved = dep.exports;
                }
            }

            return dep.resolved;
        });
    }

    function load(dependencies, factory, parent, exports) {
        var deps = resolve(dependencies, parent, exports);
        if (factory && factory.apply) {
            return factory.apply(null, deps);
        } else {
            return factory;
        }
    }
    require = function (dependencies, factory) { //jshint ignore:line
        if (!Array.isArray(dependencies)) {
            dependencies = [dependencies];
        }
        load(dependencies, factory);
    };


})();
define("amd", function(){});

define('require-style',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('require-style!less/styles-globalIntrinsics',[],function(){});

define('require-style!less/colors-globalIntrinsics',[],function(){});
// Copyright (c) Microsoft Corporation.  All Rights Reserved. Licensed under the MIT License. See License.txt in the project root for license information.
define('intrinsics',[
    'require-style!less/styles-globalIntrinsics',
    'require-style!less/colors-globalIntrinsics'
], function () {
    "use strict";

    // Suppressing jslint error here - This is usually done by requiring _Global and accessing
    // members on 'window' off the import which would cause this file to be dependent on 'base.js'.
    /* global window */
    var WinJS = window.WinJS;

    // Shared color rule 
    WinJS.UI._Accents.createAccentRule(
        "a,\
         progress",
        [{ name: "color", value: WinJS.UI._Accents.ColorTypes.accent }]);

    // Shared background-color rule
    WinJS.UI._Accents.createAccentRule(
        "button[type=submit],\
         input[type=submit],\
         option:checked,\
         select[multiple] option:checked",
        [{ name: "background-color", value: WinJS.UI._Accents.ColorTypes.accent }]);

    // Shared border-color rule
    WinJS.UI._Accents.createAccentRule(
        "input:not([type]):focus,\
         input[type='']:focus,\
         input[type=text]:focus,\
         input[type=password]:focus,\
         input[type=email]:focus,\
         input[type=number]:focus,\
         input[type=tel]:focus,\
         input[type=url]:focus,\
         input[type=search]:focus,\
         textarea:focus",
        [{ name: "border-color", value: WinJS.UI._Accents.ColorTypes.accent }]);

    // Edge-specific color rule
    WinJS.UI._Accents.createAccentRule(
        "input::-ms-clear:hover:not(:active),\
         input::-ms-reveal:hover:not(:active)",
        [{ name: "color", value: WinJS.UI._Accents.ColorTypes.accent }]);

    // Edge-specific background-color rule
    WinJS.UI._Accents.createAccentRule(
        "input[type=checkbox]:checked::-ms-check,\
         input::-ms-clear:active,\
         input::-ms-reveal:active",
        [{ name: "background-color", value: WinJS.UI._Accents.ColorTypes.accent }]);

    // Webkit-specific background-color rule
    WinJS.UI._Accents.createAccentRule(
        "progress::-webkit-progress-value,\
         .win-ring::-webkit-progress-value",
        [{ name: "background-color", value: WinJS.UI._Accents.ColorTypes.accent }]);

    // Mozilla-specific background-color rule
    WinJS.UI._Accents.createAccentRule(
        "progress:not(:indeterminate)::-moz-progress-bar,\
         .win-ring:not(:indeterminate)::-moz-progress-bar",
        [{ name: "background-color", value: WinJS.UI._Accents.ColorTypes.accent }]);

    // Edge-specific border-color rule
    WinJS.UI._Accents.createAccentRule(
        "input[type=checkbox]:indeterminate::-ms-check,\
         input[type=checkbox]:hover:indeterminate::-ms-check,\
         input[type=radio]:checked::-ms-check",
        [{ name: "border-color", value: WinJS.UI._Accents.ColorTypes.accent }]);


    // Note the use of background instead of background-color
    // FF slider styling doesn't work with background-color
    // so using background for everything here for consistency

    // Edge-specific background rule
    WinJS.UI._Accents.createAccentRule(
        "input[type=range]::-ms-thumb,\
         input[type=range]::-ms-fill-lower", /* Fill-Lower only supported in IE */
        [{ name: "background", value: WinJS.UI._Accents.ColorTypes.accent }]);

    // Webkit-specific background rule
    WinJS.UI._Accents.createAccentRule(
        "input[type=range]::-webkit-slider-thumb",
        [{ name: "background", value: WinJS.UI._Accents.ColorTypes.accent }]);

    // Mozilla-specific background rule
    WinJS.UI._Accents.createAccentRule(
        "input[type=range]::-moz-range-thumb",
        [{ name: "background", value: WinJS.UI._Accents.ColorTypes.accent }]);
});

        require(['intrinsics'], function () {
        });
    }));
}());

