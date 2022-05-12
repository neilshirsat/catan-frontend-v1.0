import { Badge, Button, Card, Divider, Modal, Typography } from "antd";
import React from "react";
import './GameCard.less'

const { info } = Modal;

type CatanCard =
    "BRICK" |
    "LUMBER" |
    "ORE" |
    "WHEAT" |
    "WOOL" |
    "LONGEST_ROAD" |
    "LARGEST_ARMY" |
    "VICTORY_POINT" |
    "KNIGHT" |
    "MONOPOLY" |
    "YEAR_OF_PLENTY" |
    "ROAD_BUILDING";

const GameCard: React.FC<{
    title: string,
    count: number,
    img: string,
    description: React.ReactNode;
    action?: React.ReactNode;
}> = (props) => {
    return (
        <Badge count={props.count} color="blue">
            {/*<div className="card">
            <div className="card-title">
                <Typography.Title level={3} className="tg">
                    {props.title.toLowerCase()}
                </Typography.Title>
            </div>
            <div className="cover">
                <img src={props.img}></img>
            </div>
            {
                props.hasBottom ?
                <div className="card-bottom">
                    {props.bottom}
                </div>
                : <></>
            }
        </div>*/}
            <img className="image" src={props.img} onClick={() => {
                info({
                    width: '1000px',
                    icon: <></>,
                    content: <div>
                        <Typography.Title style={{ display: 'block', textAlign: 'center', textTransform: 'capitalize' }}>
                            {props.title.toLowerCase()}
                        </Typography.Title>
                        <Divider></Divider>
                        <Typography.Title level={3} style={{ display: 'block', textAlign: 'center' }}>
                            Count: {props.count}
                        </Typography.Title>
                        <Divider></Divider>
                        {
                            props.action ?
                                <>
                                    <Typography.Title level={3} style={{ display: 'block', textAlign: 'center' }}>
                                        Card Actions
                                    </Typography.Title>
                                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                        {props.action}
                                    </div>
                                </>
                                : <></>
                        }
                        <Typography.Title level={5} style={{ display: 'block', textAlign: 'center' }}>
                            Description
                        </Typography.Title>
                        <Divider></Divider>
                        {props.description}
                    </div>
                })
            }}></img>
        </Badge>)
}

export default GameCard;