// browser-sync start --server ./ --port 1337 --files 'scene.js'

function scene(stdlib, foreign, buffer) {
    'use asm';

    var Float32Array = stdlib.Float32Array;
    var Int32Array = stdlib.Int32Array;

    var FLOAT_32_HEAP = new Float32Array(buffer);
    var INT_32_HEAP = new Int32Array(buffer);

    function allocNode() {

    }

    function deallocNode() {

    }

    return {
        allocNode: allocNode,
        deallocNode: deallocNode
    };

    // // Pointer address = node id
    // var nextNodeId = 0|0;
    // var nextFreedNodeId =
    //
    // function allocNode() {
    //     var nodeId = nextNodeId;
    //     nextNodeId = nextNodeId|0 + 1|0;
    //
    //     INT_32_HEAP[nodeId << (4|0)*] |=
    //
    //     return nodeId;
    // }
    //
    // function deallocNode(node) {
    //
    //     return void 0|0;
    // }
    //
    // function addChild(node, child) {
    // }
    //
    // function removeChild(node, child) {
    // }
    //
    // return {
    //     allocNode: allocNode,
    //     deallocNode: deallocNode,
    //     addChild: addChild,
    //     removeChild: removeChild
    // };
    //
    // // function getChildren(node) {
    // //
    // // }
    // //
    // // function calcTransform(node) {
    // //
    // // }
    // //
    // // function setOrigin(node, x, y, z) {
    // //
    // // }
    // //
    // // function setAlign(node, x, y, z) {
    // //
    // // }
    // //
    // // function setMountPoint(node, x, y, z) {
    // //
    // // }
    // //
    // // function setRotation(node, x, y, z, w) {
    // //
    // // }
    // //
    // // function setPosition(node, x, y, z) {
    // //
    // // }
    // //
    // // function setScale(node, x, y, z) {
    // //
    // // }
    // //
    // // function setSize(node, x, y, z) {
    // //
    // // }
    //
    // // return {
    // //     allocNode: allocNode,
    // //     setOrigin: setOrigin,
    // //     setAlign: setAlign,
    // //     setMountPoint: setMountPoint,
    // //     setRotation: setRotation,
    // //     setPosition: setPosition,
    // //     setScale: setScale,
    // //     setSize: setSize
    // // };
}

// 64k heap
var heap = new ArrayBuffer(0x10000);

// produce exports object linked to AOT-compiled code
scene(window, null, heap);

// s.init();
