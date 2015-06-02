/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var PathUtils = require('./Path');
var Opacity = require('./Opacity');
var Dispatch = require('./Dispatch');
var PathStore = require('./PathStore');

function OpacitySystem () {
    this.pathStore = new PathStore();
}

OpacitySystem.prototype.registerOpacityAtPath = function registerOpacityAtPath (path) {
    if (!PathUtils.depth(path)) return this.pathStore.insert(path, new Opacity());

    var parent = this.pathStore.get(PathUtils.parent(path));

    if (!parent) throw new Error(
            'No parent transform registered at expected path: ' + PathUtils.parent(path)
    );
    this.pathStore.insert(path, new Opacity(parent));
};

OpacitySystem.prototype.deregisterOpacityAtPath = function deregisterOpacityAtPath (path) {
    this.pathStore.remove(path);
};

OpacitySystem.prototype.makeBreakPointAt = function makeBreakPointAt (path) {
    var transform = this.pathStore.get(path);
    if (!transform) throw new Error('No transform Registered at path: ' + path);
    transform.setBreakPoint();
};

OpacitySystem.prototype.get = function get (path) {
    return this.pathStore.get(path);
};

OpacitySystem.prototype.onUpdate = function onUpdate () {
    var transforms = this.pathStore.getItems();
    var paths = this.pathStore.getPaths();
    var transform;
    var changed;
    var node;
    var vectors;
    var offsets;
    var components;

    for (var i = 0, len = transforms.length ; i < len ; i++) {
        node = Dispatch.getNode(paths[i]);
        if (!node) continue;
        components = node.getComponents();
        // transform = transforms[i];
        // vectors = transform.vectors;
        // offsets = transform.offsets;
        // if (offsets.alignChanged) alignChanged(node, components, offsets);
        // if (offsets.mountPointChanged) mountPointChanged(node, components, offsets);
        // if (offsets.originChanged) originChanged(node, components, offsets);
        // if (vectors.positionChanged) positionChanged(node, components, vectors);
        // if (vectors.rotationChanged) rotationChanged(node, components, vectors);
        // if (vectors.scaleChanged) scaleChanged(node, components, vectors);
        if ((changed = transform.from(node))) {
            transformChanged(node, components, transform);
            if (changed & Opacity.LOCAL_CHANGED) localOpacityChanged(node, components, transform.getLocalOpacity());
            if (changed & Opacity.WORLD_CHANGED) worldOpacityChanged(node, components, transform.getWorldOpacity());
        }
    }
};

function transformChanged (node, components, transform) {
    if (node.onOpacityChange) node.onOpacityChange();
    for (var i = 0, len = components.length ; i < len ; i++)
        if (components[i] && components[i].onOpacityChange)
            components[i].onOpacityChange(transform);
}

function localOpacityChanged (node, components, transform) {
    if (node.onLocalOpacityChange) node.onLocalOpacityChange(transform);
    for (var i = 0, len = components.length ; i < len ; i++)
        if (components[i] && components[i].onLocalOpacityChange)
            components[i].onLocalOpacityChange(transform);
}

function worldOpacityChanged (node, components, transform) {
    if (node.onWorldOpacityChange) node.onWorldOpacityChange(transform);
    for (var i = 0, len = components.length ; i < len ; i++)
        if (components[i] && components[i].onWorldOpacityChange)
            components[i].onWorldOpacityChange(transform);
}

module.exports = new OpacitySystem();
