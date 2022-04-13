import { Badge, Card, Typography } from "antd";
import React from "react";
import './GameCard.less'

const GameCard: React.FC<{
    title: string,
    count: number,
    img: string,
    bottom?: React.ReactNode,
}> = (props) => {
    return (<Badge count={props.count} color="blue">
        <div className="card">
            <div className="card-title">
                <Typography.Title level={3} className="tg">
                    {props.title}
                </Typography.Title>
            </div>
            <div className="cover">
            </div>
            <div className="card-bottom">
                {props.bottom}
            </div>
        </div>
    </Badge>)
}

export default GameCard;