import Hexagon from "./Hexagon";
import './board.less'
import React, { Dispatch, useEffect } from "react";
import { BoardData } from "./App";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

export const scaleFactor = 4;

const points: {
    nodeId: number
}[][] = [
    [
        { nodeId: 1 },
        { nodeId: 2 },
        { nodeId: 3 },
    ],
    [
        { nodeId: 4 },
        { nodeId: 5 },
        { nodeId: 6 },
        { nodeId: 7 },
    ],
    [
        { nodeId: 8 },
        { nodeId: 9 },
        { nodeId: 10 },
        { nodeId: 11 },
        { nodeId: 12 },
    ],
    [
        { nodeId: 13 },
        { nodeId: 14 },
        { nodeId: 15 },
        { nodeId: 16 },
    ],
    [
        
        { nodeId: 17 },
        { nodeId: 18 },
        { nodeId: 19 },
    ]
]

const edges: {
    edgeId: number,
    angle: number,
    line: number,
    offsetTop: number,
    leftPosition: number,
    leftSmallOffset: number,
    UNSAFE_LEFT_OFFSET: number,
    offsetLeftR: number,
    offsetLeftM: number,
}[] = [
    /**
     * 
     * 
     * 
     * 
     * Horizontal Nodes
     * 
     * 
     * 
     * 
     * 
     */
    { 
        edgeId: 7,
        angle: 0,
        line: 0.25,
        offsetTop: 0,
        leftPosition: 0,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 8,
        angle: 0,
        line: 0.25,
        offsetTop: 0,
        leftPosition: 1,
        leftSmallOffset: -10,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 9,
        angle: 0,
        line: 0.25,
        offsetTop: 0,
        leftPosition: 2,
        leftSmallOffset: -5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 10,
        angle: 0,
        line: 0.25,
        offsetTop: 0,
        leftPosition: 3,
        leftSmallOffset: -3.75,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 19,
        angle: 0.5,
        line: 1,
        offsetTop: 0,
        leftPosition: -0.5,
        leftSmallOffset: 20,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 20,
        angle: 0.5,
        line: 1,
        offsetTop: 0,
        leftPosition: 0.5,
        leftSmallOffset: -17.5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 21,
        angle: 0,
        line: 1,
        offsetTop: 0,
        leftPosition: 1.5,
        leftSmallOffset: -7.5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 22,
        angle: 0,
        line: 1,
        offsetTop: 0,
        leftPosition: 2.5,
        leftSmallOffset: -3.75,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 23,
        angle: 0,
        line: 1,
        offsetTop: 0,
        leftPosition: 3.5,
        leftSmallOffset: -2.5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 34,
        angle: 0,
        line: 1.75,
        offsetTop: 0,
        leftPosition: -1,
        leftSmallOffset: 10,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 35,
        angle: 0,
        line: 1.75,
        offsetTop: 0,
        leftPosition: 0,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 36,
        angle: 0,
        line: 1.75,
        offsetTop: 0,
        leftPosition: 1,
        leftSmallOffset: -10,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 37,
        angle: 0,
        line: 1.75,
        offsetTop: 0,
        leftPosition: 2,
        leftSmallOffset: -5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 38,
        angle: 0,
        line: 1.75,
        offsetTop: 0,
        leftPosition: 3,
        leftSmallOffset: -3.125,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 39,
        angle: 0,
        line: 1.75,
        offsetTop: 0,
        leftPosition: 4,
        leftSmallOffset: -2.5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 50,
        angle: 0.5,
        line: 2.5,
        offsetTop: 0,
        leftPosition: -0.5,
        leftSmallOffset: 20,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 51,
        angle: 0.5,
        line: 2.5,
        offsetTop: 0,
        leftPosition: 0.5,
        leftSmallOffset: -17.5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 52,
        angle: 0,
        line: 2.5,
        offsetTop: 0,
        leftPosition: 1.5,
        leftSmallOffset: -7.5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 53,
        angle: 0,
        line: 2.5,
        offsetTop: 0,
        leftPosition: 2.5,
        leftSmallOffset: -3.75,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 54,
        angle: 0,
        line: 2.5,
        offsetTop: 0,
        leftPosition: 3.5,
        leftSmallOffset: -2.5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 63,
        angle: 0,
        line: 3.25,
        offsetTop: 0,
        leftPosition: 0,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 64,
        angle: 0,
        line: 3.25,
        offsetTop: 0,
        leftPosition: 1,
        leftSmallOffset: -10,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 65,
        angle: 0,
        line: 3.25,
        offsetTop: 0,
        leftPosition: 2,
        leftSmallOffset: -5,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 66,
        angle: 0,
        line: 3.25,
        offsetTop: 0,
        leftPosition: 3,
        leftSmallOffset: -3.75,
        UNSAFE_LEFT_OFFSET: 0,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    /**
     * 
     * 
     * 
     * 
     * Down-Up Tilt Nodes
     * 
     * 
     * 
     * 
     * 
     */
    { 
        edgeId: 1,
        angle: 60,
        line: 0,
        offsetTop: -0.125,
        leftPosition: 0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 3,
        angle: 60,
        line: 0,
        offsetTop: -0.125,
        leftPosition: 1.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 5,
        angle: 60,
        line: 0,
        offsetTop: -0.125,
        leftPosition: 2.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },    
    { 
        edgeId: 11,
        angle: 60,
        line: 0.75,
        offsetTop: -0.125,
        leftPosition: -0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 13,
        angle: 60,
        line: 0.75,
        offsetTop: -0.125,
        leftPosition: 0.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 15,
        angle: 60,
        line: 0.75,
        offsetTop: -0.125,
        leftPosition: 1.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 17,
        angle: 60,
        line: 0.75,
        offsetTop: -0.125,
        leftPosition: 2.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },    
    { 
        edgeId: 24,
        angle: 60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: -0.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 26,
        angle: 60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: 0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 28,
        angle: 60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: 1.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 30,
        angle: 60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: 2.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 32,
        angle: 60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: 3.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    /**
     * 
     * 
     * 
     * Oppsite of Above
     * 
     * 
     * 
     */
        
     { 
        edgeId: 40,
        angle: -60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: -0.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 42,
        angle: -60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: 0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 44,
        angle: -60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: 1.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 46,
        angle: -60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: 2.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 48,
        angle: -60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: 3.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },    
    { 
        edgeId: 55,
        angle: -60,
        line: 3,
        offsetTop: -0.125,
        leftPosition: -0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 57,
        angle: -60,
        line: 3,
        offsetTop: -0.125,
        leftPosition: 0.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 59,
        angle: -60,
        line: 3,
        offsetTop: -0.125,
        leftPosition: 1.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 61,
        angle: -60,
        line: 3,
        offsetTop: -0.125,
        leftPosition: 2.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 67,
        angle: -60,
        line: 3.75,
        offsetTop: -0.125,
        leftPosition: 0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 69,
        angle: -60,
        line: 3.75,
        offsetTop: -0.125,
        leftPosition: 1.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 71,
        angle: -60,
        line: 3.75,
        offsetTop: -0.125,
        leftPosition: 2.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    /**
     * 
     * 
     * 
     * 
     * Up-Down Tilt Nodes
     * 
     * 
     * 
     * 
     * 
     */
     { 
        edgeId: 2,
        angle: -60,
        line: 0,
        offsetTop: -0.125,
        leftPosition: 0.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 4,
        angle: -60,
        line: 0,
        offsetTop: -0.125,
        leftPosition: 1.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 6,
        angle: -60,
        line: 0,
        offsetTop: -0.125,
        leftPosition: 2.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },    
    { 
        edgeId: 12,
        angle: -60,
        line: 0.75,
        offsetTop: -0.125,
        leftPosition: 0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 14,
        angle: -60,
        line: 0.75,
        offsetTop: -0.125,
        leftPosition: 1.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 16,
        angle: -60,
        line: 0.75,
        offsetTop: -0.125,
        leftPosition: 2.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 18,
        angle: -60,
        line: 0.75,
        offsetTop: -0.125,
        leftPosition: 3.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },    
    { 
        edgeId: 25,
        angle: -60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: -0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 27,
        angle: -60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: 0.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 29,
        angle: -60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: 1.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 31,
        angle: -60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: 2.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 33,
        angle: -60,
        line: 1.5,
        offsetTop: -0.125,
        leftPosition: 3.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    /**
     * 
     * 
     * 
     * Oppsite of Above
     * 
     * 
     * 
     */
        
     { 
        edgeId: 41,
        angle: 60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: -0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 43,
        angle: 60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: 0.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 45,
        angle: 60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: 1.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 47,
        angle: 60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: 2.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 49,
        angle: 60,
        line: 2.25,
        offsetTop: -0.125,
        leftPosition: 3.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },    
    { 
        edgeId: 56,
        angle: 60,
        line: 3,
        offsetTop: -0.125,
        leftPosition: 0.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 58,
        angle: 60,
        line: 3,
        offsetTop: -0.125,
        leftPosition: 1.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 60,
        angle: 60,
        line: 3,
        offsetTop: -0.125,
        leftPosition: 2.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 62,
        angle: 60,
        line: 3,
        offsetTop: -0.125,
        leftPosition: 3.25,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 68,
        angle: 60,
        line: 3.75,
        offsetTop: -0.125,
        leftPosition: 0.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 70,
        angle: 60,
        line: 3.75,
        offsetTop: -0.125,
        leftPosition: 1.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 72,
        angle: 60,
        line: 3.75,
        offsetTop: -0.125,
        leftPosition: 2.75,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -10,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },       
]

const vertices: {
    vertexId: number,
    line: number,
    offsetTop: number,
    leftPosition: number,
    leftSmallOffset: number,
    UNSAFE_LEFT_OFFSET: number,
    offsetLeftR: number,
    offsetLeftM: number,
}[] = [
    { 
        vertexId: 1,
        line: 0,
        offsetTop: -0.0375,
        leftPosition: 0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 2,
        line: 0,
        offsetTop: -0.0375,
        leftPosition: 1.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 3,
        line: 0,
        offsetTop: -0.0375,
        leftPosition: 2.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 4,
        line: 0.25,
        offsetTop: -0.0375,
        leftPosition: 0,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 5,
        line: 0.25,
        offsetTop: -0.0375,
        leftPosition: 1,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 6,
        line: 0.25,
        offsetTop: -0.0375,
        leftPosition: 2,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 7,
        line: 0.25,
        offsetTop: -0.0375,
        leftPosition: 3,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 8,
        line: 0.75,
        offsetTop: -0.0375,
        leftPosition: 0,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 9,
        line: 0.75,
        offsetTop: -0.0375,
        leftPosition: 1,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 10,
        line: 0.75,
        offsetTop: -0.0375,
        leftPosition: 2,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 11,
        line: 0.75,
        offsetTop: -0.0375,
        leftPosition: 3,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 12,
        line: 1,
        offsetTop: -0.0375,
        leftPosition: -0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 13,
        line: 1,
        offsetTop: -0.0375,
        leftPosition: 0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 14,
        line: 1,
        offsetTop: -0.0375,
        leftPosition: 1.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 15,
        line: 1,
        offsetTop: -0.0375,
        leftPosition: 2.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 16,
        line: 1,
        offsetTop: -0.0375,
        leftPosition: 3.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 17,
        line: 1.5,
        offsetTop: -0.0375,
        leftPosition: -0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 18,
        line: 1.5,
        offsetTop: -0.0375,
        leftPosition: 0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 19,
        line: 1.5,
        offsetTop: -0.0375,
        leftPosition: 1.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 20,
        line: 1.5,
        offsetTop: -0.0375,
        leftPosition: 2.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 21,
        line: 1.5,
        offsetTop: -0.0375,
        leftPosition: 3.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 22,
        line: 1.75,
        offsetTop: -0.0375,
        leftPosition: -1,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 23,
        line: 1.75,
        offsetTop: -0.0375,
        leftPosition: 0,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 24,
        line: 1.75,
        offsetTop: -0.0375,
        leftPosition: 1,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 25,
        line: 1.75,
        offsetTop: -0.0375,
        leftPosition: 2,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 26,
        line: 1.75,
        offsetTop: -0.0375,
        leftPosition: 3,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 27,
        line: 1.75,
        offsetTop: -0.0375,
        leftPosition: 4,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 28,
        line: 2.25,
        offsetTop: -0.0375,
        leftPosition: -1,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 29,
        line: 2.25,
        offsetTop: -0.0375,
        leftPosition: 0,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 30,
        line: 2.25,
        offsetTop: -0.0375,
        leftPosition: 1,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 31,
        line: 2.25,
        offsetTop: -0.0375,
        leftPosition: 2,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 32,
        line: 2.25,
        offsetTop: -0.0375,
        leftPosition: 3,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 33,
        line: 2.25,
        offsetTop: -0.0375,
        leftPosition: 4,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 34,
        line: 2.5,
        offsetTop: -0.0375,
        leftPosition: -0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 35,
        line: 2.5,
        offsetTop: -0.0375,
        leftPosition: 0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 36,
        line: 2.5,
        offsetTop: -0.0375,
        leftPosition: 1.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 37,
        line: 2.5,
        offsetTop: -0.0375,
        leftPosition: 2.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 38,
        line: 2.5,
        offsetTop: -0.0375,
        leftPosition: 3.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 39,
        line: 3,
        offsetTop: -0.0375,
        leftPosition: -0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 40,
        line: 3,
        offsetTop: -0.0375,
        leftPosition: 0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 41,
        line: 3,
        offsetTop: -0.0375,
        leftPosition: 1.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 42,
        line: 3,
        offsetTop: -0.0375,
        leftPosition: 2.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 43,
        line: 3,
        offsetTop: -0.0375,
        leftPosition: 3.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    
    //NEW LINE
    { 
        vertexId: 44,
        line: 3.25,
        offsetTop: -0.0375,
        leftPosition: 0,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 45,
        line: 3.25,
        offsetTop: -0.0375,
        leftPosition: 1,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 46,
        line: 3.25,
        offsetTop: -0.0375,
        leftPosition: 2,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 47,
        line: 3.25,
        offsetTop: -0.0375,
        leftPosition: 3,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 48,
        line: 3.75,
        offsetTop: -0.0375,
        leftPosition: 0,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 49,
        line: 3.75,
        offsetTop: -0.0375,
        leftPosition: 1,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 50,
        line: 3.75,
        offsetTop: -0.0375,
        leftPosition: 2,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 51,
        line: 3.75,
        offsetTop: -0.0375,
        leftPosition: 3,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    //NEW LINE
    { 
        vertexId: 52,
        line: 4,
        offsetTop: -0.0375,
        leftPosition: 0.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 53,
        line: 4,
        offsetTop: -0.0375,
        leftPosition: 1.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        vertexId: 54,
        line: 4,
        offsetTop: -0.0375,
        leftPosition: 2.5,
        leftSmallOffset: 0,
        UNSAFE_LEFT_OFFSET: -7.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
]

const DroppableEdge: React.FC<{
    id: string,
    edge: typeof edges[0]
}> = (props) => {
    const droppable = useDroppable({
        id: props.id
    });
    return (
        <div 
            className="edge" 
            style={{
                top: `calc(((var(--hex-height) * ${props.edge.line}) + 1rem) + ( var(--hex-height) * ${props.edge.offsetTop} ))`,
                left: `calc((((var(--hex-width) + ${props.edge.leftSmallOffset}px ) * ${props.edge.leftPosition}) + ${props.edge.UNSAFE_LEFT_OFFSET}px + 1rem ) + (var(--hex-width) * ${props.edge.offsetLeftM} + ${props.edge.offsetLeftR}px))`,
                transform: `rotate(${props.edge.angle}deg)`,
            }}
            ref={droppable.setNodeRef}
        >
            <div className="input-circle">

            </div>
        </div>
    )
}

const DroppableVertex: React.FC<{
    id: string,
    vertex: typeof vertices[0]
}> = (props) => {
    const droppable = useDroppable({
        id: props.id
    });
    return (
        <div 
            className="vertex" 
            style={{
                top: `calc(((var(--hex-height) * ${props.vertex.line}) + 1rem) + ( var(--hex-height) * ${props.vertex.offsetTop} ))`,
                left: `calc((((var(--hex-width) + ${props.vertex.leftSmallOffset}px ) * ${props.vertex.leftPosition}) + ${props.vertex.UNSAFE_LEFT_OFFSET}px + 1rem ) + (var(--hex-width) * ${props.vertex.offsetLeftM} + ${props.vertex.offsetLeftR}px))`,
            }}
            ref={droppable.setNodeRef}
        >
            <div className="input-circle">

            </div>
        </div>
    )
}

const Road: React.FC<{
    id: string
}> = (props) => {
    const draggable = useDraggable({
        id: props.id
    });
    return (
        <div 
            className="road" 
            ref={draggable.setNodeRef}
        >

        </div>
    )
}

const Board: React.FC<{
    boardData: BoardData,
    changeFn: Dispatch<React.SetStateAction<BoardData>>
}> = (props) => {

    useEffect(()=>{

    })

    return (<main className="board-root">
        <DndContext>
        <div className="container">
            {
                points.map(line => {
                    return (
                        <div className="line">
                            {
                                line.map(hex=> {
                                    return (
                                        <Hexagon 
                                            num={props.boardData.nodes[hex.nodeId-1].numPiece}
                                            resourceType={props.boardData.nodes[hex.nodeId-1].resourceType}>

                                        </Hexagon>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            {
                edges.map((edge, key)=>
                    <DroppableEdge id={key.toString()} edge={edge}>

                    </DroppableEdge>
                )
            }
            {
                vertices.map((vertex, key)=>
                    <DroppableVertex id={key.toString()} vertex={vertex}>
                        {/*
                            props.boardData.vertices[vertex.vertexId-1].isCity ? 
                            <img></img>
                            : null
                        }
                        {
                            props.boardData.vertices[vertex.vertexId-1].isSettlement ? 
                            <img></img>
                            : null
                        }
                        {
                            props.boardData.vertices[vertex.vertexId-1].isPort ? 
                            <img></img>
                            : null
                        */}
                    </DroppableVertex>
                )
            }
            <Road id="1"></Road>
        </div>
        </DndContext>
    </main>)
}

export default Board;