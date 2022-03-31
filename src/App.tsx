import Board from "./Board";
import './app.less'
import { Button, Card, Divider, Drawer, Modal, Popconfirm, Space, Statistic, Typography } from "antd";
import { useState } from "react";
import GameCard from "./GameCard";
import Deck from "./Deck";
import Countdown from "antd/lib/statistic/Countdown";
import Timer from "./Timer";
import Meta from "antd/lib/card/Meta";

const App = () => {
    const [isTradeOpen, setTradeOpen] = useState(false);
    const [isStoreOpen, setStoreOpen] = useState(false);
    const [isDeckOpen, setDeckOpen] = useState(false);
    const [isControlsVisible, setControlsVisible] = useState(false);
    const [isRulesVisible, setRulesVisible] = useState(false);

    return (<div>
        <div className="app">
            <div className="app-sidebar">
                <div className="panel">
                    <Typography.Title level={3}>
                        Turn
                    </Typography.Title>
                    <div className="group">
                        <Typography.Text className="group-title">
                            Player Name:
                        </Typography.Text>
                        <Typography.Text strong editable>
                            Player Name
                        </Typography.Text>
                    </div>
                    <div className="group">
                        <Typography.Text className="group-title">
                            Game Duration:
                        </Typography.Text>
                        <Typography.Text strong>
                            <Timer></Timer>
                        </Typography.Text>
                    </div>
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
                        <Popconfirm
                            title="Are you sure you would like to complete your turn?"
                            onConfirm={() => undefined}
                            onCancel={() => undefined}
                            okText="Pass the Dice"
                            cancelText="Continue Turn"
                        >
                            <Button type="primary" danger>
                                Pass the Dice
                            </Button>
                        </Popconfirm>
                    </div>
                </div>
                <Divider></Divider>
                <div className="panel">
                    <Typography.Title level={3}>
                        Help
                    </Typography.Title>
                    <div className="section-items">
                        <Button type="ghost" onClick={() => setControlsVisible(true)}>
                            Game Controls
                        </Button>
                        <Button type="ghost" onClick={() => setRulesVisible(true)}>
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
                <div className="store-root">
                    <Card 
                        style={{ width: '250px' }} 
                        title="Road"
                        actions={[
                            <i className="ri-building-line" key="build"></i>
                        ]}>
                    </Card>
                    <Card style={{ width: '250px' }} title="Settlement">
                        
                    </Card>
                    <Card style={{ width: '250px' }} title="City">
                        City
                    </Card>
                    <Card style={{ width: '250px' }} title="Victory Card">
                        Victory Card
                    </Card>
                </div>
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
            <Modal
                title="Game Controls"
                visible={isControlsVisible}
                onOk={() => setControlsVisible(false)}
                onCancel={() => setControlsVisible(false)}
                width="1000px"
                footer={
                    <Button type="primary" onClick={() => setControlsVisible(false)}>
                        Close
                    </Button>
                }>
                <Typography.Title level={4}>
                    User Interface
                </Typography.Title>
                <Typography.Paragraph>
                    Description Goes Here
                </Typography.Paragraph>
            </Modal>
            <Modal
                title="Game Rules"
                visible={isRulesVisible}
                onOk={() => setRulesVisible(false)}
                onCancel={() => setRulesVisible(false)}
                width="1000px"
                footer={
                    <Button type="primary" onClick={() => setRulesVisible(false)}>
                        Close
                    </Button>
                }>
                <Typography.Title level={4}>
                    Game Rules
                </Typography.Title>
                <Typography.Paragraph>
                    Catan Rules
                </Typography.Paragraph>
            </Modal>
        </div>
    </div>)
}

export default App;