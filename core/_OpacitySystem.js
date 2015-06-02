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

/**
 * The opacity class is responsible for calculating the opacity of a particular
 * node from the data on the node and its parent
 *
 * @constructor {OpacitySystem}
 */
function OpacitySystem () {
    this._requestingUpdate = false;
    this._opacities = [];
    this._paths = [];
}

/**
 * Internal method to request an update for the opacity system.
 *
 * @method _requestUpdate
 * @protected
 */
OpacitySystem.prototype._requestUpdate = function _requestUpdate () {
    if (!this._requestingUpdate) {
        this._requestingUpdate = true;
    }
};

/**
 * registers a new Opacity for the given path. This opacity will be updated
 * when the OpacitySystem updates.
 *
 * @method registerOpacityAtPath
 * @return {void}
 *
 * @param {String} path for the opacity to be registered to.
 */
OpacitySystem.prototype.registerOpacityAtPath = function registerOpacityAtPath (path) {
    var paths = this._paths;
    var index = paths.indexOf(path);
    if (index !== -1) return;

    var i = 0;
    var targetDepth = PathUtils.depth(path);
    var targetIndex = PathUtils.index(path);

    while (
            paths[i] &&
            targetDepth >= PathUtils.depth(paths[i])
    ) i++;
    paths.splice(i, 0, path);
    var newOpacity = new Opacity();
    newOpacity.setParent(this._opacities[paths.indexOf(PathUtils.parent(path))]);
    this._opacities.splice(i, 0, newOpacity);
    if (!this._requestingUpdate) this._requestUpdate();
};

/**
 * deregisters an opacity registered at the given path.
 *
 * @method deregisterOpacityAtPath
 * @return {void}
 *
 * @param {String} path at which to register the opacity
 */
OpacitySystem.prototype.deregisterOpacityAtPath = function deregisterOpacityAtPath (path) {
    var paths = this._paths;
    var index = paths.indexOf(path);
    if (index === -1) throw new Error('No opacity Registered at path: ' + path);

    this._opacities.splice(index, 1)[0].reset();
    this._paths.splice(index, 1);
};


OpacitySystem.prototype.makeBreakPointAt = function makeBreakPointAt (path) {
    var paths = this._paths;
    var index = paths.indexOf(path);
    if (index === -1) throw new Error('No opacity Registered at path: ' + path);

    var opacity = this._opacities[index];
    opacity.setBreakPoint();
};



OpacitySystem.prototype.get = function get (path) {
    return this._opacities[this._paths.indexOf(path)];
};

/**
 * Notifies the opacity system that the a node's information has changed.
 *
 * @method update
 * @return {void}
 */
OpacitySystem.prototype.update = function update () {
    if (!this._requestingUpdate) this._requestUpdate();
};

/**
 * onUpdate is called when the opacity system requires an update.
 * It traverses the opacity array and evaluates the necessary opacities
 * in the scene graph with the information from the corresponding node
 * in the scene graph
 *
 * @method onUpdate
 */
OpacitySystem.prototype.onUpdate = function onUpdate () {
    var opacities = this._opacities;
    var paths = this._paths;
    var opacity;
    var changed;
    var node;

    for (var i = 0, len = opacities.length ; i < len ; i++) {
        node = Dispatch.getNode(paths[i]);
        if (!node) continue;
        opacity = opacities[i];
        if ((changed = opacity.from(node))) {
            if (node.transformChange) node.transformChange(opacity);
            if (
                (changed & Opacity.LOCAL_CHANGED)
                && node.localOpacityChange
            ) node.localOpacityChange(opacity.getLocalOpacity());
            if (
                (changed & Opacity.WORLD_CHANGED)
                && node.onWorldOpacityChange
            ) node.worldOpacityChange(opacity.getWorldOpacity());
        }
    }
};

module.exports = new OpacitySystem();
