import Board from "./Board";
import './app.less'
import { Button, Divider, Drawer, Space, Statistic, Typography } from "antd";
import { useState } from "react";
import GameCard from "./GameCard";
import Deck from "./Deck";
import Countdown from "antd/lib/statistic/Countdown";

const App = () => {
    const [isTradeOpen, setTradeOpen] = useState(false);
    const [isStoreOpen, setStoreOpen] = useState(false);
    const [isDeckOpen, setDeckOpen] = useState(false);

    return (<div>
        <div className="app">
            <div className="app-sidebar">
                <Typography.Title>
                    Catan
                </Typography.Title>
                <Divider></Divider>
                <div className="panel">
                    <Typography.Title level={3}>
                        Turn
                    </Typography.Title>
                    <div className="group">
                        <Typography.Text className="group-title">
                            Name:
                        </Typography.Text>
                        <Typography.Text strong editable>
                            Person Name
                        </Typography.Text>
                    </div>
                    <div className="group">
                        <Typography.Text className="group-title">
                            Name:
                        </Typography.Text>
                        <Typography.Text strong editable>
                            Person Name
                        </Typography.Text>
                    </div>
                </div>
                <Divider></Divider>
                <div className="panel">
                    <Typography.Title level={3}>
                        Game Statics
                    </Typography.Title>
                    <Countdown title="Game Duration" value={Date.now() * 500}></Countdown>
                </div>
                <Divider></Divider>
                {/*<span className="bottom-aligned"></span>*/}
                <div className="panel">
                    <Typography.Title level={3}>
                        Actions
                    </Typography.Title>
                    <div className="section-items">
                        <Button type="ghost" onClick={() => setDeckOpen(true)}>
                            View Deck
                        </Button>
                        <Button type="ghost" onClick={() => setTradeOpen(true)}>
                            Trade Cards
                        </Button>
                        <Button type="ghost" onClick={() => setStoreOpen(true)}>
                            Store
                        </Button>
                        <Button type="primary" danger>
                            Pass the Dice
                        </Button>
                    </div>
                </div>
                <Divider></Divider>
                <div className="panel">
                    <Typography.Title level={3}>
                        Help
                    </Typography.Title>
                    <div className="section-items">
                        <Button type="ghost">
                            Game Controls
                        </Button>
                        <Button type="ghost">
                            View Rules
                        </Button>
                    </div>
                </div>
            </div>
            <Board></Board>
            <Drawer
                title="Trade Cards"
                placement="right"
                size="large"
                onClose={() => setTradeOpen(false)}
                visible={isTradeOpen}
                extra={
                    <Space>
                    </Space>
                }
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            <Drawer
                title="Store"
                placement="right"
                size="large"
                onClose={() => setStoreOpen(false)}
                visible={isStoreOpen}
                extra={
                    <Space>
                    </Space>
                }
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            <Drawer
                title="Deck"
                placement="right"
                size="large"
                onClose={() => setDeckOpen(false)}
                visible={isDeckOpen}
                extra={
                    <Space>
                    </Space>
                }
            >
                <Deck>
                    
                </Deck>
            </Drawer>
        </div>
    </div>)
}

export default App;