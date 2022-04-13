import Hexagon from "./Hexagon";
import './board.less'
import React, { Dispatch, useEffect } from "react";
import { BoardData } from "./App";

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
    offsetLeftR: number,
    offsetLeftM: number,
}[] = [
    { 
        edgeId: 8,
        angle: 0,
        line: 0.25,
        offsetTop: 0,
        leftPosition: 1,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 9,
        angle: 0,
        line: 0.25,
        offsetTop: 0,
        leftPosition: 2,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 20,
        angle: 0.5,
        line: 1,
        offsetTop: 0,
        leftPosition: 0.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 21,
        angle: 0,
        line: 0.5,
        offsetTop: 0.25,
        leftPosition: 1.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
    { 
        edgeId: 22,
        angle: 0.5,
        line: 0.5,
        offsetTop: 0.25,
        leftPosition: 2.5,
        offsetLeftM: 1,
        offsetLeftR: 0,
    },
]

const Board: React.FC<{
    boardData: BoardData,
    changeFn: Dispatch<React.SetStateAction<BoardData>>
}> = (props) => {

    useEffect(()=>{

    })

    return (<main className="board-root">
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
                edges.map(edge=>{
                    return (<div className="edge" style={{
                        top: `calc(((var(--hex-height) * ${edge.line}) + 1rem) + ( var(--hex-height) * ${edge.offsetTop} ))`,
                        left: `calc((((var(--hex-width) + 5px ) * ${edge.leftPosition}) + 1rem ) + (var(--hex-width) * ${edge.offsetLeftM} + ${edge.offsetLeftR}px))`,
                        transform: `rotate(${edge.angle}deg)`,
                        zIndex: 1,
                    }}>

                    </div>)
                })
            }
        </div>
    </main>)
}

export default Board;