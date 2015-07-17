'use strict';

var Registry = require('../utilities/Registry');

function CutoutRegistry (bufferReg) {
    Registry.call(this);
}

CutoutRegistry.prototype = Object.create(Registry.prototype);
CutoutRegistry.prototype.constructor = CutoutRegistry;

module.exports = CutoutRegistry;
