import { scaleFactor } from "./Board";
import './hex.css'

const Hexagon: React.FC<{
    x: number,
    y: number,
}> = (props) => {
    return (<g>
        <polygon
            className="hex"
            fill="url(#background)"
            points={`${9 * scaleFactor},${-5 * scaleFactor} ${0 * scaleFactor},${-10 * scaleFactor} ${-9 * scaleFactor},${-5 * scaleFactor} ${-9 * scaleFactor},${5 * scaleFactor} ${0 * scaleFactor},${10 * scaleFactor} ${9 * scaleFactor},${5 * scaleFactor}`}
            transform={`translate(${props.x}, ${props.y})`}>
            {props.children}
        </polygon>
    </g>)
}

export default Hexagon;