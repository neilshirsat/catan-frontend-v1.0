import { Badge, Card, Typography } from "antd";
import './GameCard.less'

const GameCard: React.FC<{
    title: string,
    count: number,
    img: string,
}> = (props) => {
    return (<Badge count={props.count} color="blue">
        <div className="card">
            <div className="cover">
                <img src={props.img}></img>
            </div>
            <div className="card-bottom">
                <Typography.Title level={5} className="tg">
                    {props.title}
                </Typography.Title>
            </div>
        </div>
    </Badge>)
}

export default GameCard;