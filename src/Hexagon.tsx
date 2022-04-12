import { scaleFactor } from "./Board";
import './hex.css'

const Hexagon: React.FC<{
    x: number,
    y: number,
}> = (props) => {
    return (<li
        className="hex-wrapper">
        <div
            className="hex">
            Hello
        </div>
    </li>)
}

export default Hexagon;