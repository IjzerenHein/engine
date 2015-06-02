function Core(stdlib, foreign, buffer) {
    'use asm';

    var FLOAT_32_HEAP = new stdlib.Float32Array(buffer);
    var INT_32_HEAP = new stdlib.Int32Array(buffer);

    // Pointer address = node id
    var nextNodeId = 0|0;
    var nextFreedNodeId =

    function allocNode() {
        var nodeId = nextNodeId;
        nextNodeId = nextNodeId|0 + 1|0;

        INT_32_HEAP[nodeId << (4|0)*] |= 

        return nodeId;
    }

    function deallocNode(node) {

        return void 0|0;
    }

    function addChild(node, child) {
    }

    function removeChild(node, child) {

    }

    function getChildren(node) {

    }

    function calcTransform(node) {

    }

    function setOrigin(node, x, y, z) {

    }

    function setAlign(node, x, y, z) {

    }

    function setMountPoint(node, x, y, z) {

    }

    function setRotation(node, x, y, z, w) {

    }

    function setPosition(node, x, y, z) {

    }

    function setScale(node, x, y, z) {

    }

    function setSize(node, x, y, z) {

    }

    return {
        allocNode: allocNode,
        setOrigin: setOrigin,
        setAlign: setAlign,
        setMountPoint: setMountPoint,
        setRotation: setRotation,
        setPosition: setPosition,
        setScale: setScale,
        setSize: setSize
    };
}

var heap = new ArrayBuffer(0x10000); // 64k heap
var core = Core(window, null, heap); // produce exports object linked to AOT-compiled code




var a = core.allocNode();
var b = core.allocNode();
var c = core.allocNode();
var d = core.allocNode();
var e = core.allocNode();

core.addChild(a, b);
core.addChild(a, c);

core.addChild(b, d);
core.addChild(c, e);

core.setPosition(a, 30, 40, 50);
