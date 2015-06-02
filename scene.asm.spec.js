var tap = require('tap');
var scene = require('./scene.asm');

function setup() {
    // 64k heap
    var heap = new ArrayBuffer(0x10000);

    // produce exports object linked to AOT-compiled code
    return scene(window, null, heap);
}

tap.test('Node allocation', function (t) {
    t.equal(
        typeof scene.allocNode,
        'function'
    );



    t.end();
});


//
// var a = core.allocNode();
// var b = core.allocNode();
// var c = core.allocNode();
// var d = core.allocNode();
// var e = core.allocNode();
//
// core.addChild(a, b);
// core.addChild(a, c);
//
// core.addChild(b, d);
// core.addChild(c, e);
//
// core.setPosition(a, 30, 40, 50);
