var glslify = require('glslify');
var after = require('after');
var fs = require('fs');
var path = require('path');

var next = after(2, write);

var shaders = {
    vertex: null,
    fragment: null
};

function write() {
    var src = '\'use strict\'; module.exports = ' + JSON.stringify(shaders) + ';';
    fs.writeFile(path.resolve(__dirname, '..', 'webgl-shaders', 'index.js'), src, function(err) {
        if (err) throw err;
    });
    fs.writeFile(path.resolve(__dirname, '..', 'webgl-shaders', 'vs.glsl'), shaders.vertex, function(err) {
        if (err) throw err;
    });
    fs.writeFile(path.resolve(__dirname, '..', 'webgl-shaders', 'fs.glsl'), shaders.fragment, function(err) {
        if (err) throw err;
    });
}

glslify.bundle(path.resolve(__dirname, '..', 'webgl-shaders', 'FragmentShader.glsl'), null, function(err, source, files) {
    if (err) throw err;
    shaders.fragment = source;
    next();
});

glslify.bundle(path.resolve(__dirname, '..', 'webgl-shaders', 'VertexShader.glsl'), null, function(err, source, files) {
    if (err) throw err;
    shaders.vertex = source;
    next();
});
