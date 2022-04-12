import Hexagon from "./Hexagon";
import './board.scss'
import React, { Dispatch, useEffect } from "react";
import { BoardData } from "./App";

export const scaleFactor = 4;

const points: {
    nodeId: number
}[] = [
    { nodeId: 1 },
    { nodeId: 2 },
    { nodeId: 3 },
    { nodeId: 4 },
    { nodeId: 5 },
    { nodeId: 6 },
    { nodeId: 7 },
    { nodeId: 8 },
    { nodeId: 9 },
    { nodeId: 10 },
    { nodeId: 11 },
    { nodeId: 12 },
    { nodeId: 13 },
    { nodeId: 14 },
    { nodeId: 15 },
    { nodeId: 16 },
    { nodeId: 17 },
    { nodeId: 18 },
    { nodeId: 19 },
]

const Board: React.FC<{
    boardData: BoardData,
    changeFn: Dispatch<React.SetStateAction<BoardData>>
}> = (props) => {

    useEffect(()=>{

    })

    return (<main className="board-root">
        <ul className="container">
            {
                points.map(hex => {
                    return (
                        <Hexagon x={0} y={0}>

                        </Hexagon>
                    )
                })
            }
        </ul>
    </main>)
}

export default Board;