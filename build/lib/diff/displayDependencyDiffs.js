"use strict";
exports.__esModule = true;
exports.MISSING_MODULE = void 0;
var tslib_1 = require("tslib");
require("colors");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var suggestVersionUpgrade_1 = require("../helpers/suggestVersionUpgrade");
exports.MISSING_MODULE = 'Not present on existing package.json, please add.';
exports["default"] = (function (targetDir, templatesDir) {
    var packagJsonStr = 'package.json';
    var existing = JSON.parse(fs_extra_1["default"].readFileSync(path_1["default"].join(targetDir, packagJsonStr), { encoding: 'utf8' }));
    var newJson = JSON.parse(fs_extra_1["default"].readFileSync(path_1["default"].join(templatesDir, packagJsonStr + '.njk'), 'utf8'));
    var scriptsChanged = {};
    var dependenciesChanged = {};
    var devDependenciesChanged = {};
    var buildDiff = function (changed, from) {
        this['Changed To'] = changed;
        this.from = from || exports.MISSING_MODULE;
    };
    if (newJson.scripts) {
        Object.keys(newJson.scripts).forEach(function (key) {
            if (!existing.scripts[key] || existing.scripts[key] !== newJson.scripts[key]) {
                // @ts-ignore
                scriptsChanged[key] = new buildDiff(newJson.scripts[key], existing.scripts[key]);
            }
        });
    }
    if (newJson.dependencies) {
        Object.keys(newJson.dependencies).forEach(function (key) {
            if (!existing.dependencies[key] || existing.dependencies[key] !== newJson.dependencies[key]) {
                // @ts-ignore
                dependenciesChanged[key] = new buildDiff(newJson.dependencies[key], existing.dependencies[key]);
            }
        });
    }
    if (newJson.devDependencies) {
        Object.keys(newJson.devDependencies).forEach(function (key) {
            if (!existing.devDependencies[key] || existing.devDependencies[key] !== newJson.devDependencies[key]) {
                // @ts-ignore
                devDependenciesChanged[key] = new buildDiff(newJson.devDependencies[key], existing.devDependencies[key]);
            }
        });
    }
    if (Object.keys(scriptsChanged).length > 1) {
        console.log('Please check your package json scripts are up to date, the tpl and local scripts differ:'.green);
        console.table(scriptsChanged);
    }
    if (Object.keys(dependenciesChanged).length > 1) {
        console.log('Please check your package json PROD dependencies are up to date, the tpl and local scripts differ:'.green);
        console.table(dependenciesChanged);
        var quickFix = suggestVersionUpgrade_1.suggestVersionUpgrade(dependenciesChanged, 'npm install');
        if (quickFix !== 'npm install') {
            console.log("Quick fix: \n" + quickFix + "\n");
        }
    }
    if (Object.keys(devDependenciesChanged).length > 1) {
        console.log('Please check your package json DEV dependencies are up to date, the tpl and local scripts differ:'.green);
        console.table(devDependenciesChanged);
        var quickFix = suggestVersionUpgrade_1.suggestVersionUpgrade(devDependenciesChanged, 'npm install --save-dev');
        if (quickFix !== 'npm install --save-dev') {
            console.log("Quick fix: \n" + quickFix + "\n");
        }
    }
});
