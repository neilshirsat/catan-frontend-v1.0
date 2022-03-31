import { Badge, Card } from "antd";
import './GameCard.less'

const GameCard : React.FC<{}> = (props) => {
    return (<Badge count={10} color="blue">
        <div className="card">
            Hello
        </div>
      </Badge>)
}

export default GameCard;