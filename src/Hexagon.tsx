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
    console.error('imageAssociatedWithResource DOESNT WORK')
    console.error(resourceType)
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
    resourceType: "HILLS" | "FOREST" | "MOUNTAINS" | "FIELDS" | "PASTURE" | "DESERT"
}> = (props) => {
    return (<div
        className="hex-wrapper">
        <div
            className="hex">
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
            <img className="picture" src={`${imageAssociatedWithResource(props.resourceType)}`} />
        </div>
    </div>)
}

export default Hexagon;