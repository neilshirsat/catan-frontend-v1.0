import './hex.css'

function imageAssociatedWithResource(resourceType: 'mountain' | 'pasture' | 'field' | 'desert' | 'hill' | 'forest') {
    switch(resourceType) {
        case 'mountain': return './catan-images/mountain-tile.png'
        case 'field': return './catan-images/Wheat Tile.png'
        case 'forest': return './catan-images/Forest Tile.png'
        case 'hill': return './catan-images/Brick Tile.png'
        case 'pasture': return './catan-images/Pasture Tile.png'
        case 'desert': return './catan-images/Desert tile.png'
    }
}

const Hexagon: React.FC<{
    num: number,
    resourceType: 'mountain' | 'pasture' | 'field' | 'desert' | 'hill' | 'forest' 
}> = (props) => {
    return (<li
        className="hex-wrapper">
        <div
            className="hex">
            <div className="center">
                {props.num}
            </div>
            <img className="picture" src={`${imageAssociatedWithResource(props.resourceType)}`} />
        </div>
    </li>)
}

export default Hexagon;