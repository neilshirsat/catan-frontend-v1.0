import { INodeData } from './Board'
import './hex.less'

function imageAssociatedWithResource(resourceType: "HILLS" | "FOREST" | "MOUNTAINS" | "FIELDS" | "PASTURE" | "DESERT") {
    switch (resourceType) {
        case 'MOUNTAINS': return './catan-images/mountain-tile.png'
        case 'FIELDS': return './catan-images/field-tile.png'
        case 'FOREST': return './catan-images/forest-tile.png'
        case 'HILLS': return './catan-images/hill-tile.png'
        case 'PASTURE': return './catan-images/pasture-tile.png'
        case 'DESERT': return './catan-images/desert-tile.png'
    }
    //console.error('imageAssociatedWithResource DOESNT WORK')
    //console.error(resourceType)
    return 'error'
}

function getDots(num: number) {
    switch (num) {
        case 2: return ".";
        case 3: return "..";
        case 4: return "...";
        case 5: return "....";
        case 6: return ".....";
        case 7: return "......";
        case 8: return ".....";
        case 9: return "....";
        case 10: return "...";
        case 11: return "..";
        case 12: return ".";
    }
}

const Hexagon: React.FC<{
    num: number,
    nodeData: INodeData,
    selected: boolean,
    nodeId: number,
    registrationFn: (nodeId: number) => Promise<INodeData>,
    resourceType: "HILLS" | "FOREST" | "MOUNTAINS" | "FIELDS" | "PASTURE" | "DESERT"
}> = (props) => {
    return (<div
        className="hex-wrapper">
        <div
            className="hex">
            {
                props.nodeData.hasRobber ?
                    <div className='overlay robber'>
                        <div>
                            <svg className='robber' viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M70.8131 221.723C42.8456 198.799 25 163.984 25 125C25 55.9644 80.9644 0 150 0C219.036 0 275 55.9644 275 125C275 163.984 257.154 198.799 229.187 221.723L300 420H0L70.8131 221.723Z" fill="#6A6A6A" />
                            </svg>
                        </div>
                    </div>
                : <></>
            }
            {
                props.resourceType !== 'DESERT' ?
                    <div className="center">
                        <div className={`title title-${props.num}`}>
                            {props.num}
                        </div>
                        <div className="dots">
                            {getDots(props.num)}
                        </div>
                    </div>
                    : <></>
            }
            {
                props.selected ?
                    <div className="overlay">
                        <div className="input-circle" onClick={() => props.registrationFn(props.nodeId)}>

                        </div>
                    </div>
                    : <></>
            }
            <img className="picture" src={`${imageAssociatedWithResource(props.resourceType)}`} />
        </div>
    </div>)
}

export default Hexagon;