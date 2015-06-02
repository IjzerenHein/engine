# Memory Layout

## Nodes

Nodes have an unique id. The id is equivalent to the node's location in memory.

A node occupies 104 bytes in memory:

---+------------------------------------------------------------------------------------------------+-------
   | quaternion rotation (16 bytes) | position (12 bytes) | scale (12 bytes) | transform (64 bytes) |
---+------------------------------------------------------------------------------------------------+-------
   ^
   Node id = Location in memory

Updating the rotation, position, scale or transform invalidates the node.
This results into the node's id being pushed onto the update queue, therefore
resulting into an update on the next frame.

The update queue is being stored in a contiguous block of memory.

Deallocating a node results into its id being freed. The freed id is being
pushed onto an array of 4 byte ids.

## Transitions

Transitions are implemented in the same asm.js module.

# Architecture

      Worker
(Application Code)

+----------------+
| Core (JIT)     |
|                |      "Heap Swap"    +-----------+
| +------------+ |-------------------->| Rendering |
| | Core (AOT) | |<--------------------| Logic     |
| +------------+ |                     +-----------+
+----------------+

ArrayBuffers are Transferable objects. Therefore they can be hot-swapped. The
asm.js spec currently doesn't account for this scenario.
