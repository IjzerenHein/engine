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

var Node = require('../core/Node');
var DOMElement = require('../dom-renderables/DOMElement');

/**
 * @class DOMNode
 * @constructor
 *
 * @param {Object} options Options object used for instantiating the underlying
 *                         DOMElement.
 */
function DOMNode(options) {
    Node.call(this);

    /** @protected */
    this._element = new DOMElement(this, options);
}

DOMNode.prototype = Object.create(Node.prototype);
DOMNode.prototype.constructor = DOMNode;

/**
 * Enables or disables WebGL 'cutout' for this element, which affects
 * how the element is layered with WebGL objects in the scene.
 *
 * @method
 *
 * @param {Boolean} usesCutout  The presence of a WebGL 'cutout' for this element.
 *
 * @return {DOMElement} this
 */
DOMNode.prototype.setCutoutState = function setCutoutState(usesCutout) {
    this._element.setCutoutState(usesCutout);
    return this;
};

/**
 * Sets the id attribute of the DOMElement.
 *
 * @method
 *
 * @param {String} id New id to be set
 *
 * @return {DOMElement} this
 */
DOMNode.prototype.setId = function setId(id) {
    this._element.setId(id);
    return this;
};

/**
 * Adds a new class to the internal class list of the underlying Element in the
 * DOM.
 *
 * @method
 *
 * @param {String} value New class name to be added
 *
 * @return {DOMElement} this
 */
DOMNode.prototype.addClass = function addClass(value) {
    this._element.addClass(value);
    return this;
};

/**
 * Removes a class from the DOMElement's classList.
 *
 * @method
 *
 * @param {String} value Class name to be removed
 *
 * @return {DOMElement} this
 */
DOMNode.prototype.removeClass = function removeClass(value) {
    this._element.removeClass(value);
    return this;
};

/**
 * Checks if the DOMElement has the passed in class.
 *
 * @method
 *
 * @param {String} value The class name
 *
 * @return {Boolean} Boolean value indicating whether the passed in class name is in the DOMElement's class list.
 */
DOMNode.prototype.hasClass = function hasClass(value) {
    return this._element.hasClass(value);
};

/**
 * Sets an attribute of the DOMElement.
 *
 * @method
 *
 * @param {String} name Attribute key (e.g. `src`)
 * @param {String} value Attribute value (e.g. `http://famo.us`)
 *
 * @return {DOMElement} this
 */
DOMNode.prototype.setAttribute = function setAttribute(name, value) {
    this._element.setAttribute(name, value);
    return this;
};

/**
 * Sets a CSS property
 *
 * @chainable
 *
 * @param {String} name  Name of the CSS rule (e.g. `background-color`)
 * @param {String} value Value of CSS property (e.g. `red`)
 *
 * @return {DOMElement} this
 */
DOMNode.prototype.setProperty = function setProperty(name, value) {
    this._element.setProperty(name, value);
    return this;
};

/**
 * Sets the content of the DOMElement. This is using `innerHTML`, escaping user
 * generated content is therefore essential for security purposes.
 *
 * @method
 *
 * @param {String} content Content to be set using `.innerHTML = ...`
 *
 * @return {DOMElement} this
 */
DOMNode.prototype.setContent = function setContent(content) {
    this._element.setContent(content);
    return this;
};

module.exports = DOMNode;
