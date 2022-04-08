import Board from "./Board";
import './app.less'
import { Button, Card, Divider, Drawer, Form, Input, InputNumber, Modal, Popconfirm, Space, Statistic, Typography } from "antd";
import React, { useState } from "react";
import Deck from "./Deck";
import Timer from "./Timer";
import { CSSTransition, SwitchTransition, TransitionGroup } from "react-transition-group"
import FormItemInput from "antd/lib/form/FormItemInput";
import { FormListFieldData } from "antd/lib/form/FormList";

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
    const [currentRoute, setCurrentRoute] = useState("start")
    const [startForm] = Form.useForm();

    return (
        <TransitionGroup className="route">
            {
                currentRoute == "start" &&
                <CSSTransition
                    unmountOnExit
                    timeout={0}>
                    <div className="start-screen">
                        <div className="start-center">
                            <Typography.Title>
                                Welcome to Catan
                            </Typography.Title>
                            <Divider></Divider>
                            <Form
                                labelCol={{ span: 12 }}
                                wrapperCol={{ span: 32 }}>
                                <Typography.Title level={4} style={{ marginBottom: 16 }}>
                                    Please Enter the Names and Passcodes of the Players
                                </Typography.Title>
                                <Form.List 
                                    name="names"
                                    initialValue={[
                                        {
                                            fieldKey: 0,
                                            isListField: true,
                                            key: 0,
                                            name: 0
                                        },
                                        {
                                            fieldKey: 1,
                                            isListField: true,
                                            key: 1,
                                            name: 1
                                        }
                                    ]}
                                    rules={[
                                        {
                                            validator: async (_, names) => {
                                                if (!names || names.length < 2) {
                                                    return Promise.reject(new Error('Must Have 2 Players'));
                                                }
                                                if (!names || names.length > 4) {
                                                    return Promise.reject(new Error('Cannot Have More than 4 Players'));
                                                }
                                            },
                                        },
                                    ]}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                    <Form.Item
                                                        label={['Player ', name + 1, ' Name']}
                                                        rules={[{ required: true, message: 'Missing Name' }]}
                                                    >
                                                        <Input placeholder="Name" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label={['Player ', name + 1, ' Passcode']}
                                                        rules={[{ required: true, message: 'Missing Passcode' }]}
                                                    >
                                                        <Input type="password" placeholder="Passcode" />
                                                    </Form.Item>
                                                    <Button onClick={() => {
                                                        if (fields.length <= 2) return;
                                                        remove(name)
                                                    }} icon={<i className="ri-close-line"></i>} 
                                                    disabled={fields.length <= 2}/>
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" disabled={(fields.length >= 4 || fields.length < 2)} onClick={() => {
                                                    if (fields.length >= 4) return;
                                                    add();
                                                }} block icon={<i className="ri-add-line"></i>}>
                                                    Add Player
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Form>
                            <Button type="primary" onClick={() => setCurrentRoute("app")}>
                                Start Game
                            </Button>
                        </div>

                    </div>
                </CSSTransition>
            }
            {
                currentRoute == "app" &&
                <CSSTransition
                    timeout={0}>
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
                                    <Button type="ghost" onClick={() => setCurrentRoute("start")}>
                                        Exit to Start
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
                </CSSTransition>
            }
        </TransitionGroup>
    )
}

export default App;