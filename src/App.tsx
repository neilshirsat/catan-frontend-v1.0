import Board from "./Board";
import './app.less'
import { Button, Card, Divider, Drawer, Modal, Popconfirm, Space, Statistic, Typography } from "antd";
import { useState } from "react";
import Deck from "./Deck";
import Timer from "./Timer";

function storeCardBottom() {
    return [
        <i className="ri-hammer-line" key="build"></i>,
        <i className="ri-fullscreen-line" key="build"></i>
    ]
}

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
                        style={{ width: '300px' }}
                        title="Road"
                        actions={storeCardBottom()}
                        cover={
                            <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="25" y="63" width="150" height="25" rx="2" fill="#00b0ff" />
                            </svg>
                        }>
                        <Typography.Text>
                            Materials Needed:
                        </Typography.Text>
                    </Card>
                    <Card style={{ width: '300px' }}
                        title="Settlement"
                        actions={storeCardBottom()}
                        cover={
                            <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M101.524 33.7084C100.539 32.7499 98.965 32.7661 98.0001 33.7447L64.0035 68.2209C63.9876 68.237 63.9719 68.2532 63.9566 68.2696C63.3828 68.6212 63 69.254 63 69.9762V117.976H137.988V70.0762C137.988 69.3844 137.653 68.7707 137.137 68.3881C137.079 68.3184 137.016 68.2505 136.948 68.1846L101.524 33.7084Z" fill="#FF0000" />
                            </svg>
                        }>
                        <Typography.Text>
                            Materials Needed:
                        </Typography.Text>
                    </Card>
                    <Card style={{ width: '300px' }}
                        title="City"
                        actions={storeCardBottom()}
                        cover={
                            <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M51.6051 21.087C50.6006 19.6209 48.4301 19.6416 47.4538 21.1265L25.418 54.6409C25.1775 55.0068 25.0476 55.3992 25.0126 55.7888C25.0043 55.8628 25 55.9381 25 56.0144V79.0144V127.014C25 128.119 25.8954 129.014 27 129.014H173C174.105 129.014 175 128.119 175 127.014V81.0144C175 79.9098 174.105 79.0144 173 79.0144H75V56.2079C75.044 55.671 74.9137 55.1085 74.5664 54.6014L51.6051 21.087Z" fill="#FF0000" />
                            </svg>
                        }>
                        <Typography.Text>
                            Materials Needed:
                        </Typography.Text>
                    </Card>
                    <Card style={{ width: '300px' }}
                        title="Victory Card"
                        actions={storeCardBottom()}
                        cover={
                            <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M101.524 33.7084C100.539 32.7499 98.965 32.7661 98.0001 33.7447L64.0035 68.2209C63.9876 68.237 63.9719 68.2532 63.9566 68.2696C63.3828 68.6212 63 69.254 63 69.9762V117.976H137.988V70.0762C137.988 69.3844 137.653 68.7707 137.137 68.3881C137.079 68.3184 137.016 68.2505 136.948 68.1846L101.524 33.7084Z" fill="#FF0000" />
                            </svg>
                        }>
                        <Typography.Text>
                            Materials Needed:
                        </Typography.Text>
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