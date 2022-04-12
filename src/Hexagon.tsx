import { scaleFactor } from "./Board";
import './hex.css'

const Hexagon: React.FC<{
    num: number
}> = (props) => {
    return (<li
        className="hex-wrapper">
        <div
            className="hex">
            <div className="center">
                {props.num}
            </div>
        </div>
    </li>)
}

export default Hexagon;