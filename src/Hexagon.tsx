import './hex.less'

function imageAssociatedWithResource(resourceType: 'mountain' | 'pasture' | 'field' | 'desert' | 'hill' | 'forest') {
    switch (resourceType) {
        case 'mountain': return './catan-images/mountain-tile.png'
        case 'field': return './catan-images/field-tile.png'
        case 'forest': return './catan-images/forest-tile.png'
        case 'hill': return './catan-images/hill-tile.png'
        case 'pasture': return './catan-images/pasture-tile.png'
        case 'desert': return './catan-images/desert-tile.png'
    }
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
    resourceType: 'mountain' | 'pasture' | 'field' | 'desert' | 'hill' | 'forest'
}> = (props) => {
    return (<div
        className="hex-wrapper">
        <div
            className="hex">
            {
                props.resourceType !== 'desert' ?
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