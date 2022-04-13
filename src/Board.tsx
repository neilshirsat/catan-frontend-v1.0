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
        </div>
    </main>)
}

export default Board;