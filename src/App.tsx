import Board, { EdgeData, IEdgeData, IVertexData, NodeData, VertexData } from "./Board";
import './app.less'
import { Button, Card, Divider, Drawer, Form, FormInstance, Input, Modal, Popconfirm, Select, Space, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import Deck from "./Deck";
import Timer from "./Timer";
import { CSSTransition, TransitionGroup } from "react-transition-group"
import axios, { AxiosResponse } from 'axios'
import ReactMarkdown from 'react-markdown'
import { dev } from "./env";
import { Option } from "antd/lib/mentions";

const { info } = Modal;

export const IPC_PORT_CATAN = 6584;

function storeCardBottom() {
    return [
        <i className="ri-hammer-line" key="build"></i>,
        <i className="ri-fullscreen-line" key="build"></i>
    ]
}

export interface UserData {
    amountCities: number
    amountResourceCards: number
    amountRoads: number
    amountSettlements: number
    color: "BLACK" | "WHITE" | "ORANGE" | "YELLOW" | "PURPLE" | "BLUE" | "GREEN";
    deck: {
        ORE: number,
        WOOL: number,
        WHEAT: number,
        LUMBER: number,
        BRICK: number
    }
    developmentCards: {
        VICTORY_POINT: number,
        KNIGHT: number,
        MONOPOLY: number,
        YEAR_OF_PLENTY: number,
        ROAD_BUILDING: number
    },
    passcode: string
    playerName: string
    secretVictoryPoints: number
    specialCards: {
        LARGEST_ARMY: number,
        LONGEST_ROAD: number
    }
    victoryPoints: number
}

const App = () => {
    const [isTradeOpen, setTradeOpen] = useState(false);
    const [isStoreOpen, setStoreOpen] = useState(false);
    const [isDeckOpen, setDeckOpen] = useState(false);
    const [isControlsVisible, setControlsVisible] = useState(false);
    const [isRulesVisible, setRulesVisible] = useState(false);


    const [isDiceVisible, setDiceVisible] = useState(false);
    const [diceRoll, setDiceRoll] = useState(-1);
    const [isStage1MessageVisible, setStage1MessageVisible] = useState(false);
    const [isStage2MessageVisible, setStage2MessageVisible] = useState(false);
    const [isStage3MessageVisible, setStage3MessageVisible] = useState(false);

    const [currentRoute, setCurrentRoute] = useState("title")
    const [startForm] = Form.useForm();

    const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);

    const [gameRulesMarkdown, setGameRulesMarkdown] = useState('');

    const [currentPlayer, setCurrentPlayer] = useState<UserData>({} as UserData);

    const [selectedEdges, setSelectedEdges] = useState<number[]>([])
    const [selectedVertex, setSelectedVertex] = useState<number[]>([])

    const [nodeData, setNodeData] = useState<NodeData | undefined>(undefined);
    const [edgeData, setEdgeData] = useState<EdgeData | undefined>(undefined);
    const [vertexData, setVertexData] = useState<VertexData | undefined>(undefined);

    const [availableColors, setAvailableColors] = useState<("BLACK" | "WHITE" | "ORANGE" | "YELLOW" | "PURPLE" | "BLUE" | "GREEN")[]>(["BLACK", "BLUE", "GREEN", "ORANGE", "PURPLE", "WHITE", "YELLOW"]);
    const [usedColors, setUsedColors] = useState<{ [key:string]: ("BLACK" | "WHITE" | "ORANGE" | "YELLOW" | "PURPLE" | "BLUE" | "GREEN")}>({});
    const baseColors = ["BLACK", "BLUE", "GREEN", "ORANGE", "PURPLE", "WHITE", "YELLOW"];


    function getPlayerData() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/get-current-player`,
            method: 'GET',
        }).then(value => {
            setCurrentPlayer(value.data);
        })
    }

    function getNames(values: any) {
        const arr: string[] = [];
        for (let val of values) {
            arr.push(val[' Name']);
        }
        return arr;
    }

    function getPasscodes(values: any) {
        const arr: string[] = [];
        for (let val of values) {
            arr.push(val[' Passcode']);
        }
        return arr;
    }

    function getColors(values: any) {
        const arr: string[] = [];
        for (let val of values) {
            arr.push(val[' Color']);
        }
        return arr;
    }

    const onSubmit = (values: FormInstance<{
        ' Name': string,
        ' Last Name': string,
    }>) => {
        console.log('Received values of form: ', values);
        const form: {
            amountPlayers: number,
            playerNames: string[],
            playerPasscodes: string[]
        } = {
            //@ts-ignore
            amountPlayers: values.names.length,
            //@ts-ignore
            playerNames: getNames(values.names),
            //@ts-ignore
            playerPasscodes: getPasscodes(values.names),
            //@ts-ignore
            playerColors: getColors(values.names)
        }
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/setup-names`,
            method: 'POST',
            data: form,
        }).then(value => {
            setCurrentRoute("app")
            axios({
                url: `http://localhost:${IPC_PORT_CATAN}/get-nodes`,
                method: 'GET',
            }).then((res) => {
                console.log(res.data);
                setNodeData(res.data);
            })
            axios({
                url: `http://localhost:${IPC_PORT_CATAN}/get-edges`,
                method: 'GET',
            }).then((res) => {
                console.log(res.data);
                setEdgeData(res.data);
            })
            axios({
                url: `http://localhost:${IPC_PORT_CATAN}/get-vertices`,
                method: 'GET',
            }).then((res) => {
                console.log(res.data);
                setVertexData(res.data);
            })
            setCurrentPlayer(value.data);
            setStage1MessageVisible(true);
            console.log(value.data);
        })
        setCurrentRoute("loading")
    };

    async function setGameRules(res: AxiosResponse<any, any>) {
        setGameRulesMarkdown(res.data)
    }

    function setSelectedVertexStage1() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/can-build-settlement-first-turn`,
            method: 'GET',
        }).then(value => {
            setSelectedVertex(value.data);
        })
    }

    function setSelectedEdgeStage1() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/can-build-roads`,
            method: 'GET',
        }).then(value => {
            setSelectedEdges(value.data);
        })
    }

    async function registerSelectedVertex(vertexId: number): Promise<IVertexData> {
        console.log("Hello World")
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/build-settlement`,
            method: 'POST',
            data: {
                vertexId: vertexId
            }
        }).then(value => {
            if (currentStage === 1 || currentStage === 2) {
                console.log(value.data)
                setVertexData(value.data);
                setSelectedVertex([]);
                info({
                    content: <Typography.Text style={{fontSize: 18}} strong>{`Player ${currentPlayer.playerName}, Please place a road adjacent to one of the vertices you just placed`}</Typography.Text>,
                    okText: "Continue",
                    icon: <></>,
                    cancelButtonProps: { style: { display: 'none' } },
                    onOk: setSelectedEdgeStage1,
                    onCancel: setSelectedEdgeStage1,
                })
            }
        })
        return {} as IVertexData;
    }

    async function registerSelectedEdges(edgeId: number): Promise<IEdgeData> {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/build-road`,
            method: 'POST',
            data: {
                edgeId: edgeId
            }
        }).then(value => {
            if (currentStage === 1 || currentStage === 2) {
                console.log(value.data)
                setEdgeData(value.data);
                setSelectedEdges([]);
                endTurn();
            }
        })
        return {} as IEdgeData;
    }

    function rollDice() {
        axios(`http://localhost:${IPC_PORT_CATAN}/roll-dice`, {
            method: 'GET',
        })
            .then(res=>{
                setDiceRoll(res.data);
                setDiceVisible(true);
            })
    }

    function endTurn() {
        axios(`http://localhost:${IPC_PORT_CATAN}/next-turn`, {
            method: 'GET',
        })
            .then(res => {
                setCurrentPlayer(res.data)
                console.log(res.data)

                axios(`http://localhost:${IPC_PORT_CATAN}/current-stage`, {
                    method: 'GET',
                })
                    .then(res => {
                        console.log(res);
                        if (currentStage != res.data) {
                            if (res.data == 2) {
                                setCurrentStage(2);
                                setStage2MessageVisible(true);
                            }
                            if (res.data == 3) {
                                setCurrentStage(3);
                                setStage3MessageVisible(true);
                            }
                        }
                        else {
                            if (currentStage == 1) {
                                info({
                                    content: <Typography.Text style={{fontSize: 18}} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' } },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })
                            }
                            else if (currentStage == 2) {
                                info({
                                    content: <Typography.Text style={{fontSize: 18}} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' } },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })
                            }
                            else {
                                rollDice();
                            }
                        }
                    })
            })
    }

    return (
        <TransitionGroup className="route">
            {
                currentRoute === "title" &&
                <CSSTransition
                    unmountOnExit
                    timeout={0}>
                    <div className="title-screen">
                        <div className="title">
                            <Typography.Title className="tg">
                                Settlers of Catan
                            </Typography.Title>
                        </div>
                        <div className="title-bottom">
                            <Typography.Text className="tg-bottom">
                                io.neilshirsat.Catan
                            </Typography.Text>
                        </div>
                        <div className="title-start">
                            <Button type="primary" onClick={() => setCurrentRoute("start")}>
                                Start
                            </Button>
                        </div>
                    </div>
                </CSSTransition>
            }
            {
                currentRoute === "start" &&
                <CSSTransition
                    unmountOnExit
                    timeout={0}>
                    <div className="start-screen">
                        <div className="start-center">
                            <Typography.Title>
                                Game Setup
                            </Typography.Title>
                            <Divider></Divider>
                            <Form
                                labelCol={{ span: 12, offset: 2 }}
                                wrapperCol={{ span: 32 }}
                                form={startForm}
                                onFinish={onSubmit}>
                                <Typography.Title level={4} style={{ marginBottom: 32 }}>
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
                                                <Space key={key} style={{ width: 'auto', display: 'flex', marginBottom: 8 }} align="baseline">
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, ' Name']}
                                                        label={['Player ', name + 1, ' Name']}
                                                        rules={[{ required: true, message: 'Missing Name' }]}
                                                    >
                                                        <Input placeholder="Name" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, ' Color']}
                                                        label={['Player ', name + 1, ' Color']}
                                                        hasFeedback
                                                        labelCol={{span:12, offset: 2}}
                                                        rules={[{ required: true, message: 'Missing Color' }]}
                                                    >
                                                        <Select dropdownStyle={{textTransform: "lowercase"}} style={{minWidth: "8rem", textTransform: "lowercase"}} onSelect={(val: "BLACK" | "WHITE" | "ORANGE" | "YELLOW" | "PURPLE" | "BLUE" | "GREEN")=>{
                                                            let tempUsedColors = usedColors;
                                                            tempUsedColors[key] = val;
                                                            setUsedColors(tempUsedColors);
                                                            let arr: typeof baseColors = [];
                                                            for (let color of baseColors) {
                                                                let x = true;
                                                                for (const e of Object.keys(usedColors)) {
                                                                    if (color === usedColors[e]) {
                                                                        x = false;
                                                                    }
                                                                }
                                                                if (x) {
                                                                    arr.push(color);
                                                                }
                                                            }
                                                            //@ts-ignore
                                                            setAvailableColors(arr);
                                                        }}>
                                                            {availableColors.map(color=><Option value={color}>{color.toLowerCase()}</Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, ' Passcode']}
                                                        label={['Player ', name + 1, ' Passcode']}
                                                        rules={[{ required: true, message: 'Missing Passcode' }]}
                                                    >
                                                        <Input type="password" placeholder="Passcode" />
                                                    </Form.Item>
                                                    <Button onClick={() => {
                                                        if (fields.length <= 2) return;
                                                        remove(name)
                                                    }} icon={<i className="ri-close-line"></i>}
                                                        disabled={fields.length <= 2} />
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="ghost" disabled={(fields.length >= 4 || fields.length < 2)} onClick={() => {
                                                    if (fields.length >= 4) return;
                                                    add();
                                                }} block icon={<i className="ri-add-line"></i>}>
                                                    Add Player
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" onClick={
                                        () => {
                                            startForm.submit();
                                        }
                                    }>
                                        Start Game
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </CSSTransition>
            }
            {
                currentRoute == "loading" &&
                <CSSTransition timeout={0}
                    unmountOnExit>
                    <div className="loading-screen">
                        <Spin spinning>

                        </Spin>
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
                                    <Typography.Text strong editable={{
                                        onChange: (newName) => {
                                            axios(`http://localhost:${IPC_PORT_CATAN}/set-name`, {
                                                method: 'POST',
                                                data: {
                                                    name: newName
                                                }
                                            })
                                                .then(res => {
                                                    setCurrentPlayer(res.data)
                                                })
                                        }
                                    }}>
                                        {currentPlayer.playerName}
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
                                        onConfirm={() => endTurn()}
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
                                    <Popconfirm
                                        title="Are you sure you would like to exit the game? This action is irreversible"
                                        onConfirm={() => setCurrentRoute("title")}
                                        onCancel={() => undefined}
                                        okText="Exit Game"
                                        cancelText="Continue"
                                    >
                                        <Button type="ghost" danger>
                                            Exit Game
                                        </Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        </div>
                        <Board 
                            edgeRegistrationFn={registerSelectedEdges} 
                            vertexRegistrationFn={registerSelectedVertex} 
                            selectedEdges={selectedEdges} 
                            selectedVertex={selectedVertex}
                            nodeData={nodeData!}
                            edgeData={edgeData!}
                            vertexData={vertexData!}></Board>
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
                            <div className="trade-root">
                                <div className="trade-game-root">
                                    <Typography.Title level={2}>
                                        Trade with the Game
                                    </Typography.Title>
                                </div>
                                <div className="trade-player-root">
                                    <Typography.Title level={2}>
                                        Trade with Another Player
                                    </Typography.Title>
                                </div>
                            </div>
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
                            className="VScroll"
                        >
                            <div className="store-root VScroll">
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
                            className="VScroll"
                        >
                            <Deck userData={currentPlayer}>

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
                            }
                            className="VScroll">
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
                            }
                            className="VScroll">
                            <ReactMarkdown children={gameRulesMarkdown} />
                        </Modal>
                        <Modal
                            title="Rolled Dice"
                            visible={isDiceVisible}
                            onOk={() => setDiceVisible(false)}
                            onCancel={() => setDiceVisible(false)}
                            width="1000px"
                            footer={
                                <Button type="primary" onClick={() => setDiceVisible(false)}>
                                    Close
                                </Button>
                            }
                            className="VScroll">
                            <Typography.Title>
                                You Rolled a {diceRoll}
                            </Typography.Title>
                        </Modal>
                        <Modal
                            title="Stage 1"
                            visible={isStage1MessageVisible}
                            onOk={() => { 
                                setStage1MessageVisible(false)
                                info({
                                    content: <Typography.Text style={{fontSize: 18}} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' } },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })                            }}
                            onCancel={() => { 
                                setStage1MessageVisible(false)
                                info({
                                    content: <Typography.Text style={{fontSize: 18}} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' }, },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })
                            }}
                            width="1000px"
                            okText="Continue"
                            cancelButtonProps={{ style: { display: 'none' } }}
                            className="VScroll">
                            <Typography.Title>
                                Welcome to Island of Catan Explorers!
                            </Typography.Title>
                            <Typography.Paragraph>
                                In the first stage of the game, there will be a round in which
                                each and every player will place down 1 settlement and 1 road
                            </Typography.Paragraph>
                        </Modal>
                        <Modal
                            title="Stage 2"
                            visible={isStage2MessageVisible}
                            onOk={() => { 
                                setStage2MessageVisible(false)
                                info({
                                    content: <Typography.Text style={{fontSize: 18}} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' } },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })                            }}
                            onCancel={() => { 
                                setStage2MessageVisible(false)
                                info({
                                    content: <Typography.Text style={{fontSize: 18}} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' }, },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })
                            }}
                            width="1000px"
                            okText="Continue"
                            cancelButtonProps={{ style: { display: 'none' } }}
                            className="VScroll">
                            <Typography.Title>
                                That was Quick! Now to the Second Stage.
                            </Typography.Title>
                            <Typography.Paragraph>
                                In the second stage of the game, there will be a round in which
                                we will go in reverse and each player will place down another road
                                and settlement
                            </Typography.Paragraph>
                        </Modal>
                        <Modal
                            title="Stage 3"
                            visible={isStage3MessageVisible}
                            onOk={() => { 
                                setStage3MessageVisible(false)
                                rollDice()
                            }}
                            onCancel={() => {
                                setStage3MessageVisible(false)
                                rollDice();
                            }}
                            width="1000px"
                            okText="Continue"
                            cancelButtonProps={{ style: { display: 'none' } }}
                            className="VScroll">
                            <Typography.Title>
                                The Game Lies Ahead Good Luck
                            </Typography.Title>
                            <Typography.Paragraph>
                                In the third stage of the game, explorers will be competing to attain 10
                                points the fastest. Good Luck!
                            </Typography.Paragraph>
                        </Modal>
                    </div>
                </CSSTransition>
            }
        </TransitionGroup>
    )
}

export default App;