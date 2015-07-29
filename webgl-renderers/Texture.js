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

/**
 * Texture is a private class that stores image data
 * to be accessed from a shader or used as a render target.
 *
 * @class Texture
 * @constructor
 *
 * @param {WebGLRenderingContext} gl WebGL Context
 * @param {Object} [options] Options
 * @param {Number} [options.width]
 * @param {Number} [options.height]
 * @param {Boolean} [options.mipmap]
 * @param {Number} [options.format=gl.RGBA]
 * @param {Number} [options.type=gl.UNSIGNED_BYTE]
 * @param {Number} [options.magFilter=gl.NEAREST]
 * @param {Number} [options.minFilter=gl.NEAREST]
 * @param {Number} [options.flipYWebgl=false]
 * @param {Number} [options.premultiplyAlphaWebgl=false]
 * @param {Number} [options.wrapS=gl.CLAMP_TO_EDGE]
 * @param {Number} [options.wrapT=gl.CLAMP_TO_EDGE]
 */
function Texture (gl, options) {
    options = options || {};

    this.gl = gl;
    this.id = gl.createTexture();

    this.width = options.width || 0;
    this.height = options.height || 0;
    this.mipmap = options.mipmap;

    // @deprecated Remove when deprecation of string options is complete!
    if (typeof options.format === 'string')
        options.format = this.gl[options.format];

    if (typeof options.type === 'string')
        options.type = this.gl[options.type];

    if (typeof options.magFilter === 'string')
        options.magFilter = this.gl[options.magFilter];

    if (typeof options.minFilter === 'string')
        options.minFilter = this.gl[options.minFilter];

    if (typeof options.wrapS === 'string')
        options.wrapS = this.gl[options.wrapS];

    if (typeof options.wrapT === 'string')
        options.wrapT = this.gl[options.wrapT];
    // End of deprecation.

    this.format = options.format != null ? options.format : gl.RGBA;
    this.type = options.type != null ? options.type : gl.UNSIGNED_BYTE;

    this.magFilter = options.magFilter != null ? options.magFilter : gl.NEAREST;
    this.minFilter = options.minFilter != null ? options.minFilter : gl.NEAREST;

    this.flipYWebgl = options.flipYWebgl != null ? options.flipYWebgl : false;
    this.premultiplyAlphaWebgl = options.premultiplyAlphaWebgl != null ? options.premultiplyAlphaWebgl : false;

    this.wrapS = options.wrapS != null ? options.wrapS : gl.CLAMP_TO_EDGE;
    this.wrapT = options.wrapT != null ? options.wrapT : gl.CLAMP_TO_EDGE;

    // @deprecated No longer bind on construction to avoid side effects!
    this.bind();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipYWebgl);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlphaWebgl);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
}

/**
 * Binds this texture as the selected target.
 *
 * @method
 * @return {Object} Current texture instance.
 */
Texture.prototype.bind = function bind () {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    return this;
};

/**
 * Erases the texture data in the given texture slot.
 *
 * @method
 * @return {Object} Current texture instance.
 */
Texture.prototype.unbind = function unbind () {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    return this;
};

/**
 * Replaces the image data in the texture with the given image.
 *
 * @method
 *
 * @param {Image}   img     The image object to upload pixel data from.
 * @return {Texture}        this
 */
Texture.prototype.setImage = function setImage (img) {
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, this.format, this.type, img);
    if (this.mipmap) this.gl.generateMipmap(this.gl.TEXTURE_2D);
    return this;
};

/**
 * Replaces the image data in the texture with an array of arbitrary data.
 *
 * @method
 *
 * @param {Array}   input   Array to be set as data to texture.
 * @return {Texture}        this
 */
Texture.prototype.setArray = function setArray (input) {
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, input);
    return this;
};

/**
 * Dumps the RGBA-pixel contents of a texture into an array for debugging purposes
 *
 * @method
 *
 * @param {Number} x        x-offset between texture coordinates and snapshot
 * @param {Number} y        y-offset between texture coordinates and snapshot
 * @param {Number} width    x-depth of the snapshot
 * @param {Number} height   y-depth of the snapshot
 *
 * @return {Array}          An array of the pixels contained in the snapshot.
 */
Texture.prototype.readBack = function readBack (x, y, width, height) {
    var gl = this.gl;
    var pixels;

    x = x || 0;
    y = y || 0;

    width = width != null ? width : this.width;
    height = height != null ? height : this.height;

    var fb = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        pixels = new Uint8Array(width * height * 4);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }

    return pixels;
};

module.exports = Texture;
