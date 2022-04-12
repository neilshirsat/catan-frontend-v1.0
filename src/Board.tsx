import Hexagon from "./Hexagon";
import './board.less'
import React, { Dispatch, useEffect } from "react";
import { BoardData } from "./App";

export const scaleFactor = 4;

const points: {
    x: number;
    y: number;
}[] = [
    { x: 27 * scaleFactor, y: 10 * scaleFactor }, //1
    { x: 45 * scaleFactor, y: 10 * scaleFactor }, //2
    { x: 63 * scaleFactor, y: 10 * scaleFactor }, //3
    { x: 18 * scaleFactor, y: 25 * scaleFactor }, //4
    { x: 36 * scaleFactor, y: 25 * scaleFactor }, //5
        //Center
        //{ x: 45 * scaleFactor, y: 40 * scaleFactor },
        //Top
        //{ x: 45 * scaleFactor, y: 10 * scaleFactor },
        //Bottom
        //{ x: 45 * scaleFactor, y: 70 * scaleFactor },
        //Inside Circle
        //{ x: 54 * scaleFactor, y: 55 * scaleFactor }, //Bottom Right
        //{ x: 36 * scaleFactor, y: 55 * scaleFactor }, //Bottom Left
        //{ x: 27 * scaleFactor, y: 40 * scaleFactor }, //Left
        //{ x: 36 * scaleFactor, y: 25 * scaleFactor }, //Top Left
        //{ x: 54 * scaleFactor, y: 25 * scaleFactor }, //Top Right
        //{ x: 63 * scaleFactor, y: 40 * scaleFactor }, //Right
        //Outside Circle
        //{ x: 81 * scaleFactor, y: 40 * scaleFactor }, //Right Right
        //{ x: 9 * scaleFactor, y: 40 * scaleFactor }, //Left Left
        //Compose Rose 1-8 Starting from North->E->S->W
        //{ x: 63 * scaleFactor, y: 10 * scaleFactor },
        //{ x: 72 * scaleFactor, y: 25 * scaleFactor },
        //{ x: 72 * scaleFactor, y: 55 * scaleFactor },
        //{ x: 63 * scaleFactor, y: 70 * scaleFactor },
        //{ x: 27 * scaleFactor, y: 70 * scaleFactor },
        //{ x: 18 * scaleFactor, y: 55 * scaleFactor },
        //{ x: 18 * scaleFactor, y: 25 * scaleFactor },
        //{ x: 27 * scaleFactor, y: 10 * scaleFactor },
    ]

const Board: React.FC<{
    boardData: BoardData,
    changeFn: Dispatch<React.SetStateAction<BoardData>>
}> = (props) => {

    useEffect(()=>{

    })

    return (<div className="board-root">
        <svg
            className="board" 
            viewBox={`0 0 ${90 * scaleFactor} ${80 * scaleFactor}`}
            style={{
            }}>
            <defs>
                <pattern id="background" style={{padding: '1rem'}} height="100%" width="100%" patternContentUnits="objectBoundingBox">
                    <image height="1" width="1" preserveAspectRatio="none" href="https://www.thespruce.com/thmb/OBzH-HbeogCLRTyu2KGFAP6jLgc=/1500x1500/filters:fill(auto,1)/_hero_SQ_Catan-Board-Game-1-4e3bc64d68ea4b2d99840e423879cb9f.jpg" />
                </pattern>
            </defs>
            {points.map(e =>
                <>
                    <Hexagon x={e.x} y={e.y}>
                    
                    </Hexagon>
                </>
            )}
            <line x1={36 * scaleFactor} y1={45 * scaleFactor} x2={36 * scaleFactor} y2={35 * scaleFactor} stroke="blue" width="2px"></line>
            
        </svg>
    </div>)
}

export default Board;