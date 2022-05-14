import Hexagon from "./Hexagon";
import './board.less'
import React, { Dispatch, useEffect, useState } from "react";
import { IPC_PORT_CATAN, UserData } from "./App";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import axios from "axios";
import { Button, Divider, Modal, Typography } from "antd";

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

const ports: {
    angle: number,
    line: number,
    offsetTop: number,
    leftPosition: number,
    leftSmallOffset: number,
    UNSAFE_LEFT_OFFSET: number,
    offsetLeftR: number,
    offsetLeftM: number,
    OFFSET_HORT: number,
    OFFSET_VERT: number,
}[] = [
        {
            angle: -30,
            line: 0,
            offsetTop: -0.125,
            leftPosition: 0.25,
            leftSmallOffset: 0,
            UNSAFE_LEFT_OFFSET: -10,
            offsetLeftM: 1,
            offsetLeftR: 0,
            OFFSET_HORT: -0.6,
            OFFSET_VERT: -0.3,
        },
        {
            angle: 30,
            line: 0,
            offsetTop: -0.125,
            leftPosition: 1.75,
            leftSmallOffset: 0,
            UNSAFE_LEFT_OFFSET: -10,
            offsetLeftM: 1,
            offsetLeftR: 0,
            OFFSET_HORT: -0.25,
            OFFSET_VERT: -0.25,
        },
        {
            angle: 30,
            line: 0.75,
            offsetTop: -0.125,
            leftPosition: 3.25,
            leftSmallOffset: 0,
            UNSAFE_LEFT_OFFSET: -10,
            offsetLeftM: 1,
            offsetLeftR: 0,
            OFFSET_HORT: -0.15,
            OFFSET_VERT: -0.27,
        },
        {
            angle: -90,
            line: 1,
            offsetTop: 0,
            leftPosition: -0.5,
            leftSmallOffset: 20,
            UNSAFE_LEFT_OFFSET: 0,
            offsetLeftM: 1,
            offsetLeftR: 0,
            OFFSET_HORT: -0.8,
            OFFSET_VERT: 0.05,
        },
        {
            angle: 90,
            line: 1.75,
            offsetTop: 0,
            leftPosition: 4,
            leftSmallOffset: -2.5,
            UNSAFE_LEFT_OFFSET: 0,
            offsetLeftM: 1,
            offsetLeftR: 0,
            OFFSET_HORT: 0,
            OFFSET_VERT: 0,
        },
        {
            angle: 270,
            line: 2.5,
            offsetTop: 0,
            leftPosition: -0.5,
            leftSmallOffset: 20,
            UNSAFE_LEFT_OFFSET: 0,
            offsetLeftM: 1,
            offsetLeftR: 0,
            OFFSET_HORT: -0.8,
            OFFSET_VERT: 0.05,
        },
        {
            angle: 150,
            line: 3,
            offsetTop: -0.125,
            leftPosition: 3.25,
            leftSmallOffset: 0,
            UNSAFE_LEFT_OFFSET: -10,
            offsetLeftM: 1,
            offsetLeftR: 0,
            OFFSET_HORT: -0.15,
            OFFSET_VERT: 0.4,
        },
        {
            angle: -150,
            line: 3.75,
            offsetTop: -0.125,
            leftPosition: 0.25,
            leftSmallOffset: 0,
            UNSAFE_LEFT_OFFSET: -10,
            offsetLeftM: 1,
            offsetLeftR: 0,
            OFFSET_HORT: -0.6,
            OFFSET_VERT: 0.42,
        },
        {
            angle: 150,
            line: 3.75,
            offsetTop: -0.125,
            leftPosition: 1.75,
            leftSmallOffset: 0,
            UNSAFE_LEFT_OFFSET: -10,
            offsetLeftM: 1,
            offsetLeftR: 0,
            OFFSET_HORT: -0.15,
            OFFSET_VERT: 0.4,
        },

    ]

const { info } = Modal;

const DroppableEdge: React.FC<{
    id: string,
    selected: boolean,
    edge: typeof edges[0],
    edgeData: IEdgeData,
    registrationFn: (id: number) => Promise<IEdgeData>,
}> = (props) => {
    return (
        <div
            className={`edge`}
            style={{
                top: `calc(((var(--hex-height) * ${props.edge.line}) + 1rem) + ( var(--hex-height) * ${props.edge.offsetTop} ))`,
                left: `calc((((var(--hex-width) + ${props.edge.leftSmallOffset}px ) * ${props.edge.leftPosition}) + ${props.edge.UNSAFE_LEFT_OFFSET}px + 1rem ) + (var(--hex-width) * ${props.edge.offsetLeftM} + ${props.edge.offsetLeftR}px))`,
                transform: `rotate(${props.edge.angle}deg)`,
            }}
        >
            {
                props.selected ?
                    <div className="input-circle" onClick={() => props.registrationFn(props.edgeData.edgeId)}>

                    </div>
                    : <></>
            }
            {
                props.edgeData.road ?
                    <div
                        onClick={() => {
                            info({
                                width: '1000px',
                                icon: <></>,
                                content: <div>
                                    <Typography.Title style={{ display: 'block', textAlign: 'center' }}>
                                        Road of Edge {props.edgeData.edgeId}
                                    </Typography.Title>
                                    <Divider></Divider>
                                    <Typography.Title level={3} style={{ display: 'block', textAlign: 'center' }}>
                                        Controlled By {props.edgeData.controlledPlayer.playerName}
                                    </Typography.Title>
                                    <Divider></Divider>
                                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                        
                                    </div>
                                </div>
                            })
                        }} className={`road ${props.edgeData.controlledPlayer.color}`}>
                    </div>
                    : <></>
            }
        </div>
    )
}

function getPortVertexPairs(port: number) {
    switch (port) {
        case 0: return [1, 4];
        case 1: return [2, 6];
        case 2: return [11, 16];
        case 3: return [12, 17];
        case 4: return [27, 33];
        case 5: return [34, 39];
        case 6: return [43, 47];
        case 7: return [48, 52];
        case 8: return [50, 53];
    }
}

const DroppablePort: React.FC<{
    port: typeof ports[0],
    portData: {
        giveResource: number,
        getResource: number,
        resourceType: "BRICK" | "LUMBER" | "ORE" | "WHEAT" | "WOOL",
        name: string
        id: number
    },
    portVertexPair: number[]
}> = (props) => {
    return (
        <div
            className={`port`}
            style={{
                zIndex: 0,
                top: `calc(((var(--hex-height) * ${props.port.line}) + 1rem) + ( var(--hex-height) * ${props.port.offsetTop} ) + (${props.port.OFFSET_VERT} * var(--hex-side)))`,
                left: `calc((((var(--hex-width) + ${props.port.leftSmallOffset}px ) * ${props.port.leftPosition}) + ${props.port.UNSAFE_LEFT_OFFSET}px + 1rem ) + (var(--hex-width) * ${props.port.offsetLeftM} + ${props.port.offsetLeftR}px) + (${props.port.OFFSET_HORT} * var(--hex-side)))`,
                transform: `rotate(${props.port.angle}deg)`,
            }}
            onClick={() => {
                info({
                    width: '1000px',
                    icon: <></>,
                    content: <div>
                        <Typography.Title style={{ display: 'block', textAlign: 'center' }}>
                            Port of Vertices {props.portVertexPair[0]} and {props.portVertexPair[1]}
                        </Typography.Title>
                        <Divider></Divider>
                        <Typography.Title level={3} style={{ display: 'block', textAlign: 'center' }}>
                            {props.portData.name} Ratio- {props.portData.giveResource}:1
                        </Typography.Title>
                        <Divider></Divider>
                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            
                        </div>
                    </div>
                })
            }}
        >

            <svg viewBox="0 0 150 129" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38 79C37.6852 79 37.3889 79.1482 37.2 79.4L1.2 127.4C0.705573 128.059 1.17595 129 2 129H148C148.824 129 149.294 128.059 148.8 127.4L112.8 79.4C112.611 79.1482 112.315 79 112 79H105C104.176 79 103.706 79.9408 104.2 80.6L130.3 115.4C130.794 116.059 130.324 117 129.5 117H21C20.176 117 19.7056 116.059 20.2 115.4L46.3 80.6C46.7944 79.9408 46.324 79 45.5 79H38Z" fill="#C4C4C4" />
                <ellipse cx="75" cy="52" rx="22" ry="52" fill="#C4C4C4" />
            </svg>

        </div>
    )
}

const DroppableVertex: React.FC<{
    id: string,
    selected: boolean,
    vertex: typeof vertices[0],
    vertexData: IVertexData,
    registrationFn: (id: number) => Promise<IVertexData>,
    buildCity: (vertexId: number) => void
}> = (props) => {
    return (
        <div
            className="vertex"
            style={{
                top: `calc(((var(--hex-height) * ${props.vertex.line}) + 1rem) + ( var(--hex-height) * ${props.vertex.offsetTop} ))`,
                left: `calc((((var(--hex-width) + ${props.vertex.leftSmallOffset}px ) * ${props.vertex.leftPosition}) + ${props.vertex.UNSAFE_LEFT_OFFSET}px + 1rem ) + (var(--hex-width) * ${props.vertex.offsetLeftM} + ${props.vertex.offsetLeftR}px))`,
            }}
        >
            {
                props.selected ?
                    <div className="input-circle" onClick={() => props.registrationFn(props.vertexData.vertxId)}>

                    </div>
                    : <></>
            }
            {
                props.vertexData.vertexType === "SETTLEMENT" ?
                    <div
                        onClick={() => {
                            info({
                                width: '1000px',
                                icon: <></>,
                                content: <div>
                                    <Typography.Title style={{ display: 'block', textAlign: 'center' }}>
                                        Settlement of Vertex {props.vertexData.vertxId}
                                    </Typography.Title>
                                    <Divider></Divider>
                                    <Typography.Title level={3} style={{ display: 'block', textAlign: 'center' }}>
                                        Controlled By {props.vertexData.controlledPlayer.playerName}
                                    </Typography.Title>
                                    <Divider></Divider>
                                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                        <Button onClick={()=>props.buildCity(props.vertexData.vertxId)}>
                                            Upgrade to City
                                        </Button>
                                    </div>
                                </div>
                            })
                        }}
                        className={`settlement ${props.vertexData.controlledPlayer.color}`}>
                        <svg viewBox="0 0 75 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M38.5238 0.708418C37.5389 -0.250095 35.965 -0.233909 35.0001 0.744658L1.0035 35.2209C0.98758 35.237 0.971944 35.2533 0.956586 35.2696C0.382802 35.6212 0 36.254 0 36.9762V84.9762H74.9876V37.0762C74.9876 36.3844 74.6531 35.7707 74.137 35.3881C74.0788 35.3184 74.0159 35.2505 73.9483 35.1846L38.5238 0.708418Z" />
                        </svg>
                    </div>
                    : props.vertexData.vertexType === 'CITY' ?
                        <div
                            onClick={() => {
                                info({
                                    width: '1000px',
                                    icon: <></>,
                                    content: <div>
                                        <Typography.Title style={{ display: 'block', textAlign: 'center' }}>
                                            City of Vertex {props.vertexData.vertxId}
                                        </Typography.Title>
                                        <Divider></Divider>
                                        <Typography.Title level={3} style={{ display: 'block', textAlign: 'center' }}>
                                            Controlled By {props.vertexData.controlledPlayer.playerName}
                                        </Typography.Title>
                                        <Divider></Divider>
                                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                            
                                        </div>
                                    </div>
                                })
                            }} className={`settlement ${props.vertexData.controlledPlayer.color}`}>
                            <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M51.6051 21.087C50.6006 19.6209 48.4301 19.6416 47.4538 21.1265L25.418 54.6409C25.1775 55.0068 25.0476 55.3992 25.0126 55.7888C25.0043 55.8628 25 55.9381 25 56.0144V79.0144V127.014C25 128.119 25.8954 129.014 27 129.014H173C174.105 129.014 175 128.119 175 127.014V81.0144C175 79.9098 174.105 79.0144 173 79.0144H75V56.2079C75.044 55.671 74.9137 55.1085 74.5664 54.6014L51.6051 21.087Z" />
                            </svg>
                        </div>
                        : <></>
            }
        </div>
    )
}

const Road: React.FC<{
    id: string
}> = (props) => {
    const [state, setState] = useState(false);
    return (
        <div
            className={`road ${state ? 'filled' : ''}`}
            onClick={() => setState(true)}
        >

        </div>
    )
}

export type Player = {

}

export type NumberPiece = {
    value: number,
}

export type INodeData = {
    borderNode: boolean
    e: number
    edges: number[],
    hasRobber: boolean
    innerNode: boolean
    ne: number
    nodeId: number
    numberPieces: number
    nw: number
    resource: "HILLS" | "FOREST" | "MOUNTAINS" | "FIELDS" | "PASTURE" | "DESERT"
    se: number
    sw: number
    vertices: number[],
    w: number
}

export type NodeData = INodeData[];

export type IEdgeData = {
    connectedEdges: number[],
    connectedVertices: (EdgeData[0])[],
    controlledPlayer: UserData,
    edgeId: number,
    road: boolean,
    roadLengthCache: number,
    surroundingNodes: number[],
    visited: boolean,
}

export type EdgeData = IEdgeData[];

export type IVertexData = {
    connectedEdges: number[],
    connectedNodes: number[],
    controlledPlayer: UserData,
    empty: boolean,
    port: {},
    portVertex: boolean
    vertexType: "EMPTY" | "CITY" | "SETTLEMENT"
    vertxId: 9
}

export type VertexData = IVertexData[];

const Board: React.FC<{
    buildCity: (vertexId: number) => void,
    selectedEdges: number[],
    selectedVertex: number[],
    selectedNodes: number[],
    nodeData: NodeData,
    edgeData: EdgeData,
    vertexData: VertexData,
    edgeRegistrationFn: (id: number) => Promise<IEdgeData>,
    vertexRegistrationFn: (id: number) => Promise<IVertexData>,
    nodeRegistrationFn: (id: number) => Promise<INodeData>,
    portList: {
        giveResource: number,
        getResource: number,
        resourceType: "BRICK" | "LUMBER" | "ORE" | "WHEAT" | "WOOL",
        name: string
        id: number
    }[],
}> = (props) => {
    //console.log(props.nodeData);
    //console.log(props.nodeData.length)
    //console.log(props.nodeData[0])
    console.log(ports)
    return ((props.nodeData != undefined && props.edgeData != undefined && props.vertexData != undefined) ?
        (<main className="board-root">
            <div className="container">
                {
                    points.map(line => {
                        return (
                            <div className="line">
                                {
                                    line.map(hex => {
                                        //console.log(props.selectedNodes)
                                        //console.log(hex.nodeId)
                                        //console.log(props.nodeData[hex.nodeId])
                                        return (
                                            <Hexagon
                                                nodeId={hex.nodeId}
                                                nodeData={props.nodeData[hex.nodeId - 1]}
                                                registrationFn={props.nodeRegistrationFn}
                                                selected={props.selectedNodes.indexOf(hex.nodeId) != -1}
                                                num={props.nodeData[hex.nodeId - 1].numberPieces}
                                                resourceType={props.nodeData[hex.nodeId - 1].resource}>

                                            </Hexagon>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
                {
                    edges.map((edge, key) =>
                        <DroppableEdge registrationFn={props.edgeRegistrationFn} selected={props.selectedEdges.indexOf(edge.edgeId) != -1} edgeData={props.edgeData[edge.edgeId - 1]} id={key.toString()} edge={edge}>

                        </DroppableEdge>
                    )
                }
                {
                    vertices.map((vertex, key) =>
                        <DroppableVertex buildCity={props.buildCity} registrationFn={props.vertexRegistrationFn} selected={props.selectedVertex.indexOf(vertex.vertexId) != -1} vertexData={props.vertexData[vertex.vertexId - 1]} id={key.toString()} vertex={vertex}>

                        </DroppableVertex>
                    )
                }
                {
                    ports.map((port, key) =>
                        <DroppablePort portData={props.portList[key]} portVertexPair={getPortVertexPairs(key)!} port={port} key={key}>

                        </DroppablePort>
                    )
                }
            </div>
        </main>) : <></>)
}

export default Board;