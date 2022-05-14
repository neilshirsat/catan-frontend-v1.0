import Board, { EdgeData, IEdgeData, INodeData, IVertexData, NodeData, Player, VertexData } from "./Board";
import './app.less'
import { Button, Card, Checkbox, Divider, Drawer, Empty, Form, FormInstance, Input, InputNumber, List, message, Modal, notification, Popconfirm, Select, Space, Spin, Table, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Deck from "./Deck";
import Timer from "./Timer";
import { CSSTransition, TransitionGroup } from "react-transition-group"
import axios, { AxiosResponse } from 'axios'
import ReactMarkdown from 'react-markdown'
import { dev } from "./env";
import { Option } from "antd/lib/mentions";
import { DragDropContext, DraggableLocation, DropResult } from "react-beautiful-dnd";
import { TransferList, TransferListProps } from "./transfer-list";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { useForm } from "antd/lib/form/Form";
import GameCard from "./GameCard";
import { Subject } from "rxjs";

const { info } = Modal;

export const IPC_PORT_CATAN = 6584;

function storeCardBottom(disabled: boolean, onClickFn: () => void) {
    return [
        <i onClick={() => {
            onClickFn()
        }} className="ri-hammer-line" key="build"></i>,
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
    id: number
    passcode: string
    playerName: string
    secretVictoryPoints: number
    specialCards: {
        LARGEST_ARMY: number,
        LONGEST_ROAD: number
    }
    victoryPoints: number
}

type Trade = {
    tradeOutgoing: {
        ORE: number,
        WOOL: number,
        WHEAT: number,
        LUMBER: number,
        BRICK: number
    }
    tradeIngoing: {
        ORE: number,
        WOOL: number,
        WHEAT: number,
        LUMBER: number,
        BRICK: number
    }
    tradeId: number,
    targetPlayers: number[]
}

const App = () => {
    const [isTradeOpen, setTradeOpen] = useState(false);
    const [isStoreOpen, setStoreOpen] = useState(false);
    const [isDeckOpen, setDeckOpen] = useState(false);
    const [isDevelopmentCardsOpen, setDevelopmentCardsOpen] = useState(false);
    const [isControlsVisible, setControlsVisible] = useState(false);
    const [isRulesVisible, setRulesVisible] = useState(false);


    const [isDiceVisible, setDiceVisible] = useState(false);
    const [diceRoll, setDiceRoll] = useState(-1);
    const [isStage1MessageVisible, setStage1MessageVisible] = useState(false);
    const [isStage2MessageVisible, setStage2MessageVisible] = useState(false);
    const [isStage3MessageVisible, setStage3MessageVisible] = useState(false);
    const [discardPanelVisible, setDiscardPanelVisible] = useState(false);
    const [discardPanelDisabled, setDiscardPanelDisabled] = useState(true);

    const [currentRoute, setCurrentRoute] = useState("title")
    const [startForm] = Form.useForm();

    const [playersToRob, setPlayersToRob] = useState<UserData[]>([])

    const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);

    const [gameRulesMarkdown, setGameRulesMarkdown] = useState('');

    const [currentPlayer, setCurrentPlayer] = useState<UserData>({} as UserData);
    const [otherPlayers, setOtherPlayers] = useState<UserData[]>([]);

    const [selectedEdges, setSelectedEdges] = useState<number[]>([])
    const [selectedVertex, setSelectedVertex] = useState<number[]>([])
    const [selectedNodes, setSelectedNodes] = useState<number[]>([])

    const [nodeData, setNodeData] = useState<NodeData | undefined>(undefined);
    const [edgeData, setEdgeData] = useState<EdgeData | undefined>(undefined);
    const [vertexData, setVertexData] = useState<VertexData | undefined>(undefined);

    const [availableColors, setAvailableColors] = useState<("BLACK" | "WHITE" | "ORANGE" | "YELLOW" | "PURPLE" | "BLUE" | "GREEN")[]>(["BLACK", "BLUE", "GREEN", "ORANGE", "PURPLE", "WHITE", "YELLOW"]);
    const [usedColors, setUsedColors] = useState<{ [key: string]: ("BLACK" | "WHITE" | "ORANGE" | "YELLOW" | "PURPLE" | "BLUE" | "GREEN") }>({});
    const baseColors = ["BLACK", "BLUE", "GREEN", "ORANGE", "PURPLE", "WHITE", "YELLOW"];

    const [currentDeckOverflowPlayers, setCurrentDeckOverflowPlayers] = useState<UserData[] | undefined>(undefined)
    const [currentDiscardPlayer, setCurrentDiscardPlayer] = useState<UserData>({} as UserData)
    const [discardCards, setDiscardCards] = useState<TransferListProps['discard']>([])
    const [keepCards, setKeepCards] = useState<TransferListProps['keep']>([])
    const transferListRef = useRef<TransferList>(null);

    const [currentTrades, setCurrentTrades] = useState<Trade[]>([])

    const [hasBuit, setHasBuilt] = useState(false);
    const [isBuildingRoad, setIsBuildingRoad] = useState(false);
    const [isBuildingSettlement, setIsBuildingSettlement] = useState(false);
    const [isBuildingCity, setIsBuildingCity] = useState(false);

    const [isLoadingAmountLeft, setIsLoadingAmountLeft] = useState(false);
    const [amountLeft, setAmountLeft] = useState<{
        key: string,
        value: string,
    }[]>([])

    const [isPortOpen, setPortOpen] = useState(false)

    const [isPlayingKnightCard, setPlayingKnightCard] = useState(false);
    const [isPlayingRoadBuildingCard, setPlayingRoadBuildingCard] = useState(false);
    const [currentRoadBuildingCards, setCurrentRoadBuildingCards] = useState<number[]>([])

    useEffect(() => {
        if (currentPlayer.secretVictoryPoints + currentPlayer.victoryPoints >= 10) {
            info({
                width: "1000px",
                content: <Typography.Title style={{ textAlign: 'center' }}>🎉 {currentPlayer.playerName} won the game 🎉</Typography.Title>,
                okText: "Continue",
                icon: <></>,
                cancelButtonProps: { style: { display: 'none' }, },
                onOk: () => {
                    axios({
                        url: `http://localhost:${IPC_PORT_CATAN}/restart`,
                        method: 'GET'
                    });
                    setCurrentRoute("title");
                },
                onCancel: setSelectedNodesRobber
            });
        }
    }, [currentPlayer])

    function getPlayerData() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/get-current-player`,
            method: 'GET',
        }).then(value => {
            setCurrentPlayer(value.data);
            //console.log(value.data)
        })
        getOtherPlayerData();

    }

    function getOtherPlayerData() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/other-players`,
            method: 'GET',
        }).then(value => {
            //console.log(value.data);
            setOtherPlayers(value.data);
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

    const [portList, setPortList] = useState<{
        giveResource: number,
        getResource: number,
        resourceType: "BRICK" | "LUMBER" | "ORE" | "WHEAT" | "WOOL",
        name: string
        id: number
    }[]>([])

    function getPortList() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/port-list`,
            method: 'GET',
        }).then(value => {
            console.log(value.data);
            let data: typeof portList = value.data;
            for (let i = 0; i < data.length; i++) {
                data[i].id = i;
            }
            setPortList(data);
        })
    }

    function getPortVertices() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/port-vertices`,
            method: 'GET',
        }).then(value => {
            console.log(value.data);
        })
    }

    function getPortVertexPairs(port: number) {
        switch (port) {
            case 0: return [1, 4];
            case 1: return [2, 6];
            case 2: return [11, 16];
            case 3: return [12, 17];
            case 4: return [27, 33];
            case 5: return [34, 39];
            case 6: return [43, 47];
            case 7: return [48, 52];
            case 8: return [50, 53];
        }
    }

    let hasQueriedNodes = false;
    let hasQueriedEdges = false;
    let hasQueriedVertices = false;
    const appLoadCallback = () => {
        console.log("Queried")
        if (hasQueriedNodes && hasQueriedEdges && hasQueriedVertices) {
            console.log("Queried All Finished")
            setCurrentRoute("app")
        }
    }

    const onSubmit = (values: FormInstance<{
        ' Name': string,
        ' Last Name': string,
    }>) => {
        //console.log('Received values of form: ', values);
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
            axios({
                url: `http://localhost:${IPC_PORT_CATAN}/get-nodes`,
                method: 'GET',
            }).then((res) => {
                //console.log(res.data);
                setNodeData(res.data);
                hasQueriedNodes = true;
                appLoadCallback()
            })
            axios({
                url: `http://localhost:${IPC_PORT_CATAN}/get-edges`,
                method: 'GET',
            }).then((res) => {
                //console.log(res.data);
                setEdgeData(res.data);
                hasQueriedEdges = true;
                appLoadCallback()
            })
            axios({
                url: `http://localhost:${IPC_PORT_CATAN}/get-vertices`,
                method: 'GET',
            }).then((res) => {
                //console.log(res.data);
                setVertexData(res.data);
                hasQueriedVertices = true;
                appLoadCallback()
            })
            setCurrentPlayer(value.data);
            setStage1MessageVisible(true);
            //console.log(value.data);
            getPortList();
            getPortVertices();
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

    function setSelectedVertexSettlements() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/can-build-settlement`,
            method: 'GET',
        }).then(value => {
            setSelectedVertex(value.data);
            console.log(value.data)
            if (value.data.length <= 0) {
                notification.open({
                    message: "No Possible Vertices to Build a Settlement"
                })
                setSelectedVertex([]);
                setIsBuildingSettlement(false);
            }
        })
    }

    function setSelectedVertexCities() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/can-build-city`,
            method: 'GET',
        }).then(value => {
            setSelectedVertex(value.data);
        })
    }

    function buyDevelopmentCard() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/can-build-city`,
            method: 'GET',
        }).then(value => {
            setSelectedVertex(value.data);
        })
    }

    function setSelectedNodesRobber() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/can-place-robber-nodes`,
            method: 'GET',
        }).then(value => {
            setSelectedNodes(value.data);
        })
    }

    async function registerSelectedVertex(vertexId: number): Promise<IVertexData> {
        console.log('registering')

        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/build-settlement`,
            method: 'POST',
            data: {
                vertexId: vertexId
            }
        }).then(value => {
            if (currentStage === 1 || currentStage === 2) {
                //console.log(value.data)
                setVertexData(value.data);
                setSelectedVertex([]);
                if (currentStage == 2) {
                    getPlayerData();
                }
                info({
                    width: "1000px",
                    content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${currentPlayer.playerName}, Please place a road adjacent to the vertex you just placed`}</Typography.Text>,
                    okText: "Continue",
                    icon: <></>,
                    cancelButtonProps: { style: { display: 'none' } },
                    onOk: setSelectedEdgeStage1,
                    onCancel: setSelectedEdgeStage1,
                })
            }
            else {
                setVertexData(value.data);
                setSelectedVertex([]);
                setHasBuilt(true);
                setIsBuildingSettlement(false);
            }
        })

        return {} as IVertexData;
    }

    async function registerSelectedEdges(edgeId: number): Promise<IEdgeData> {
        if (isPlayingRoadBuildingCard) {
            console.log(edgeId)
            console.log(currentRoadBuildingCards)
            if (currentRoadBuildingCards.length <= 0) {
                setCurrentRoadBuildingCards([edgeId])
                if (selectedEdges.length === 1) {
                    info({
                        width: "1000px",
                        content: <Typography.Text style={{ fontSize: 18 }} strong>No Availible Edges for the Second Road</Typography.Text>,
                        okText: "Continue",
                        icon: <></>,
                        cancelButtonProps: { style: { display: 'none' } },
                    })
                    axios({
                        url: `http://localhost:${IPC_PORT_CATAN}/use-road-building`,
                        method: 'POST',
                        data: {
                            edgeID1: currentRoadBuildingCards[0],
                            edgeID2: currentRoadBuildingCards[0],
                            playerId: currentPlayer.id
                        }
                    }).then(value => {
                        setEdgeData(value.data);
                        setSelectedEdges([]);
                        setCurrentRoadBuildingCards([]);
                        setIsBuildingRoad(false);
                        getPlayerData()
                    })
                }
                info({
                    width: "1000px",
                    content: <Typography.Text style={{ fontSize: 18 }} strong>Place the second edge</Typography.Text>,
                    okText: "Continue",
                    icon: <></>,
                    cancelButtonProps: { style: { display: 'none' } },
                })
                return {} as IEdgeData;
            }
            else {
                currentRoadBuildingCards.push(edgeId);
                axios({
                    url: `http://localhost:${IPC_PORT_CATAN}/use-road-building`,
                    method: 'POST',
                    data: {
                        edgeID1: currentRoadBuildingCards[0],
                        edgeID2: currentRoadBuildingCards[1],
                        playerId: currentPlayer.id
                    }
                }).then(value => {
                    setEdgeData(value.data);
                    setSelectedEdges([]);
                    setCurrentRoadBuildingCards([]);
                    setIsBuildingRoad(false);
                    getPlayerData()
                })
                return {} as IEdgeData;
            }
        }
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/build-road`,
            method: 'POST',
            data: {
                edgeId: edgeId
            }
        }).then(value => {
            if (currentStage === 1 || currentStage === 2) {
                //console.log(value.data)
                setEdgeData(value.data);
                setSelectedEdges([]);
                endTurn();
            }
            else {
                setEdgeData(value.data);
                setSelectedEdges([]);
                setHasBuilt(true);
                setIsBuildingRoad(false)
                getPlayerData()
            }
        })
        return {} as IEdgeData;
    }

    async function registerSelectedNode(nodeId: number): Promise<INodeData> {
        if (isPlayingKnightCard) {
            axios({
                url: `http://localhost:${IPC_PORT_CATAN}/move-robber`,
                method: 'POST',
                data: {
                    nodeId: nodeId
                }
            }).then(value => {
                //console.log(value)
                setSelectedNodes([])
                axios({
                    url: `http://localhost:${IPC_PORT_CATAN}/get-nodes`,
                    method: 'GET',
                }).then((res) => {
                    //console.log(res.data);
                    setNodeData(res.data);
                    getPlayersToRob();
                })
            })
            return {} as INodeData;
        }
        //console.log('In Register Selected Node')
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/move-robber`,
            method: 'POST',
            data: {
                nodeId: nodeId
            }
        }).then(value => {
            //console.log(value)
            setSelectedNodes([])
            axios({
                url: `http://localhost:${IPC_PORT_CATAN}/get-nodes`,
                method: 'GET',
            }).then((res) => {
                //console.log(res.data);
                setNodeData(res.data);
                getPlayersToRob();
            })
        })
        return {} as INodeData;
    }

    function rollDice() {
        axios(`http://localhost:${IPC_PORT_CATAN}/roll-dice`, {
            method: 'GET',
        })
            .then(res => {
                setDiceRoll(res.data);
                getPlayerData();
                if (res.data === 7) {
                }
                setDiceVisible(true);
            })
    }

    function endTurn() {
        axios(`http://localhost:${IPC_PORT_CATAN}/next-turn`, {
            method: 'GET',
        })
            .then(res => {
                setCurrentPlayer(res.data)
                //console.log(res.data)
                //console.log(currentPlayer)

                axios(`http://localhost:${IPC_PORT_CATAN}/current-stage`, {
                    method: 'GET',
                })
                    .then(res2 => {
                        //console.log(res2);
                        if (currentStage != res2.data) {
                            if (res2.data == 2) {
                                setCurrentStage(2);
                                setStage2MessageVisible(true);
                            }
                            if (res2.data == 3) {
                                setCurrentStage(3);
                                setStage3MessageVisible(true);
                            }
                        }
                        else {
                            if (currentStage == 1) {
                                //console.log("Before Player")
                                //console.log(currentPlayer)
                                info({
                                    width: "1000px",
                                    content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${res.data.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' } },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })
                            }
                            else if (currentStage == 2) {
                                info({
                                    width: "1000px",
                                    content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${res.data.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' } },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })
                            }
                            else {
                                info({
                                    width: "1000px",
                                    content: <Typography.Title style={{ textAlign: 'center' }}>{`Player ${res.data.playerName}, It is your turn now`}</Typography.Title>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' } },
                                    onOk: () => {
                                        setHasBuilt(false);
                                        setDiceRoll(-1);
                                    },
                                    onCancel: () => {
                                        setHasBuilt(false);
                                        setDiceRoll(-1);
                                        setCurrentTrades([]);
                                    },
                                })
                                //rollDice();
                            }
                        }
                    })
            })
    }

    function formatedCardName(name: 'ORE' | 'WOOL' | 'WHEAT' | 'LUMBER' | 'BRICK') {
        switch (name) {
            case 'ORE': return "Ore";
            case 'LUMBER': return "Lumber";
            case "WHEAT": return "Wheat";
            case "WOOL": return "Wool";
            case "BRICK": return "Brick";
        }
    }

    function countCards(player: UserData) {
        return player.amountResourceCards;
    }

    function getPlayersToTrade(otherPlayers: UserData[]): UserData[] {
        let arr: UserData[] = [];
        for (let user of otherPlayers) {
            if (countCards(user) > 0) {
                arr.push(user);
            }
        }
        return arr;
    }

    async function getPlayersToRob() {
        return axios(`http://localhost:${IPC_PORT_CATAN}/get-players-to-rob`, {
            method: 'GET'
        })
            .then(res => {
                setPlayersToRob(res.data)
                const dialog = info({
                    width: "1000px",
                    //@ts-ignore
                    content: (
                        <>
                            <Typography.Title style={{ textAlign: 'center' }}>Choose a Player to Steal From</Typography.Title>
                            <Divider></Divider>
                            <Space style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                {
                                    (res.data as typeof playersToRob).map(val => <Button type="primary" onClick={() => {

                                        if (isPlayingKnightCard) {
                                            axios(`http://localhost:${IPC_PORT_CATAN}/use-knight`, {
                                                method: 'POST',
                                                data: {
                                                    playerRobbingId: currentPlayer.id,
                                                    playerRobbedId: val.id,
                                                }
                                            })
                                                .then(res => {
                                                    setCurrentPlayer(res.data)
                                                    notification.open({
                                                        message: 'Knight Card Played Successfully'
                                                    })
                                                    setPlayingKnightCard(false);
                                                })
                                            dialog.destroy();
                                            return;
                                        }

                                        axios(`http://localhost:${IPC_PORT_CATAN}/rob-cards`, {
                                            method: 'POST',
                                            data: {
                                                playerRobbingId: currentPlayer.id,
                                                playerRobbedId: val.id,
                                            }
                                        })
                                            .then(res => {
                                                notification.open({
                                                    message: `Player ${currentPlayer.playerName} stole a ${formatedCardName(res.data)} from ${val.playerName}`
                                                })
                                            })
                                        dialog.destroy();
                                    }}>
                                        {val.playerName}
                                    </Button>)
                                }
                                {
                                    res.data.length <= 0 ?
                                        <>
                                            <div>
                                                <Typography.Text strong>No One to Rob.</Typography.Text>
                                            </div>
                                            <Button type="primary" onClick={() => dialog.destroy()}>
                                                Continue
                                            </Button>
                                        </>
                                        : <></>
                                }
                            </Space>
                        </>
                    ),
                    okText: "Continue",
                    icon: <></>,
                    okButtonProps: { style: { display: 'none' }, },
                    cancelButtonProps: { style: { display: 'none' }, },
                    onOk: undefined,
                    onCancel: undefined
                })
            })
    }

    async function getAllPlayersWhoNeedToEmptyHand() {
        return axios(`http://localhost:${IPC_PORT_CATAN}/overflow-deck-players`, {
            method: 'GET'
        })
            .then(res => {
                setCurrentDeckOverflowPlayers(res.data);
                console.log(res.data);
                return res.data;
            })
    }

    useEffect(()=>{
        if (!currentDeckOverflowPlayers) {
            return;
        }
        if (currentDeckOverflowPlayers!.length <= 0) {
            info({
                width: "1000px",
                //@ts-ignore
                content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${currentPlayer.playerName} please move the robber`}</Typography.Text>,
                okText: "Continue",
                icon: <></>,
                cancelButtonProps: { style: { display: 'none' }, },
                onOk: setSelectedNodesRobber,
                onCancel: setSelectedNodesRobber
            })
        }
        else {
            setCurrentDiscardPlayer(currentDeckOverflowPlayers![0])
        }
    }, [currentDeckOverflowPlayers])

    useEffect(()=>{
        if (!currentDiscardPlayer.playerName){
            return;
        }
        let cards: TransferListProps['keep'] = [];
        for (let e in currentDiscardPlayer.deck) {
            //@ts-ignore
            let amount: number = currentDiscardPlayer.deck[e];
            console.log(e)
            console.log(amount)
            for (let i = 0; i < amount; i++) {
                cards.push({
                    key: e + i,
                    //@ts-ignore
                    value: e
                })
            }
        }
        let half = cards.length / 2;
        let firstHalf = cards.slice(0, half)
        let secondHalf = cards.slice(half)
        console.log(half)
        console.log(firstHalf)
        console.log(secondHalf)
        setKeepCards(firstHalf)
        setDiscardCards(secondHalf)
        setDiscardPanelVisible(true);
    }, [currentDiscardPlayer])

    function handleDiceRemoval() {
        setDiceVisible(false);
        console.log(diceRoll);
        if (diceRoll === 7) {
            getAllPlayersWhoNeedToEmptyHand().then((res) => {
                console.log(res);
                //
                //
                //
                //
                //
                // TODO DEBUG THIS PORTION OF THE CODE
                //
                //
                //
                //
                console.log(res);
                
            })
        }
    }

    const submitObservable : Subject<void> = new Subject();

    function handleDiscardPanelClose() {
        const state = transferListRef.current!.state;
        const amountCards = state!.discard.length + state!.keep.length;
        const amountInDiscardPile = Math.floor(amountCards / 2.0);
        console.log(amountCards);
        console.log(amountInDiscardPile)
        if (state!.discard.length != amountInDiscardPile) {
            notification.open({
                message: `Discard Pile Must have ${amountInDiscardPile} Cards` 
            })
            return;
        }
        setDiscardPanelVisible(false)
        const deck: UserData['deck'] = {
            BRICK: 0,
            LUMBER: 0,
            ORE: 0,
            WHEAT: 0,
            WOOL: 0
        };
        for (let card of state!.discard) {
            deck[card.value] = deck[card.value] + 1;
        }
        axios(`http://localhost:${IPC_PORT_CATAN}/discard-cards`, {
            method: 'POST',
            data: {
                discardCard: deck,
                playerId: currentDiscardPlayer.id
            }
        })
            .then(res => {
                currentDeckOverflowPlayers!.splice(0, 1);
                setCurrentDeckOverflowPlayers(currentDeckOverflowPlayers!)

                if (currentDeckOverflowPlayers!.length > 0) {
                    setCurrentDiscardPlayer(currentDeckOverflowPlayers![0])

                    let cards: TransferListProps['keep'] = [];
                    for (let e in currentDiscardPlayer.deck) {
                        //@ts-ignore
                        let amount: number = currentDiscardPlayer[e];
                        for (let i = 0; i < amount; i++) {
                            cards.push({
                                key: e + i,
                                //@ts-ignore
                                value: e
                            })
                        }
                    }
                    let half = cards.length / 2;
                    let firstHalf = cards.slice(0, half)
                    let secondHalf = cards.slice(half)
                    console.log(firstHalf)
                    console.log(secondHalf)
                    setKeepCards(firstHalf)
                    setDiscardCards(secondHalf)
                    notification.open({
                        message: `Discarded Cards from Player ${currentDiscardPlayer.playerName} Cards` 
                    })
                    return;
                }
                else {
                    getPlayerData();
                    getOtherPlayerData();
                    info({
                        width: "1000px",
                        //@ts-ignore
                        content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${currentPlayer.playerName} please move the robber`}</Typography.Text>,
                        okText: "Continue",
                        icon: <></>,
                        cancelButtonProps: { style: { display: 'none' }, },
                        onOk: setSelectedNodesRobber,
                        onCancel: setSelectedNodesRobber
                    })
                }
            })
    }

    let keepCardsDone = false;
    useEffect(()=>{
        console.log(keepCards);
        console.log(discardCards);
        if (keepCardsDone) {
            setDiscardPanelVisible(true);
            keepCardsDone = false;
            return;
        }
        keepCardsDone = true;
    }, [keepCards, discardCards])

    const [tradeForm] = useForm();
    function createTrade() {
        const dialog = info({
            width: "1000px",
            content: <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Form form={tradeForm} onFinish={(instance) => {
                    dialog.destroy();
                    let sum = instance['outgoing-brick'] +
                        instance['outgoing-lumber'] +
                        instance['outgoing-ore'] +
                        instance['outgoing-wheat'] +
                        instance['outgoing-wool'] +
                        instance['ingoing-brick'] +
                        instance['ingoing-lumber'] +
                        instance['ingoing-ore'] +
                        instance['ingoing-wheat'] +
                        instance['ingoing-wool'];
                    let p1Sum = instance['outgoing-brick'] +
                        instance['outgoing-lumber'] +
                        instance['outgoing-ore'] +
                        instance['outgoing-wheat'] +
                        instance['outgoing-wool'];
                    let p2Sum = instance['outgoing-brick'] +
                        instance['outgoing-lumber'] +
                        instance['outgoing-ore'] +
                        instance['outgoing-wheat'] +
                        instance['outgoing-wool'];
                    console.log(instance)
                    console.log(sum)
                    if (sum > 0 && p1Sum > 0 && p2Sum > 0) {
                        setCurrentTrades(state => [
                            ...state,
                            {
                                tradeOutgoing: {
                                    BRICK: instance['outgoing-brick'],
                                    LUMBER: instance['outgoing-lumber'],
                                    ORE: instance['outgoing-ore'],
                                    WHEAT: instance['outgoing-wheat'],
                                    WOOL: instance['outgoing-wool']
                                },
                                tradeIngoing: {
                                    BRICK: instance['ingoing-brick'],
                                    LUMBER: instance['ingoing-lumber'],
                                    ORE: instance['ingoing-ore'],
                                    WHEAT: instance['ingoing-wheat'],
                                    WOOL: instance['ingoing-wool']
                                },
                                targetPlayers: instance['target-players'],
                                tradeId: Math.random()
                            }
                        ])
                    }
                    else {
                        dialog.destroy();
                        notification.open({
                            message: "Must Add Cards to Both Side to Trade"
                        })
                    }
                    finishTradeForm.resetFields();
                }} initialValues={{
                    'outgoing-brick': 0,
                    'outgoing-lumber': 0,
                    'outgoing-ore': 0,
                    'outgoing-wheat': 0,
                    'outgoing-wool': 0,
                    'ingoing-brick': 0,
                    'ingoing-lumber': 0,
                    'ingoing-ore': 0,
                    'ingoing-wheat': 0,
                    'ingoing-wool': 0,
                    'target-players': [],
                }}>
                    <Typography.Title level={5}>Enter the Cards You Want to Trade. Select the Target Players of this trade- in other words, the players who are alllowed to accept the trade</Typography.Title>
                    <div style={{ display: "flex", flexDirection: 'row' }}>
                        <div style={{ width: '50%', maxWidth: '50%' }}>
                            <Typography.Text style={{ display: 'block', marginBottom: '16px' }} strong>Outgoing Cards</Typography.Text>
                            <Form.Item name="outgoing-brick" label="Bricks">
                                <InputNumber min={0} max={currentPlayer.deck.BRICK}></InputNumber>
                            </Form.Item>
                            <Form.Item name="outgoing-lumber" label="Lumber">
                                <InputNumber min={0} max={currentPlayer.deck.LUMBER}></InputNumber>
                            </Form.Item>
                            <Form.Item name="outgoing-ore" label="Ore">
                                <InputNumber min={0} max={currentPlayer.deck.ORE}></InputNumber>
                            </Form.Item>
                            <Form.Item name="outgoing-wheat" label="Wheat">
                                <InputNumber min={0} max={currentPlayer.deck.WHEAT}></InputNumber>
                            </Form.Item>
                            <Form.Item name="outgoing-wool" label="Wool">
                                <InputNumber min={0} max={currentPlayer.deck.WOOL}></InputNumber>
                            </Form.Item>
                        </div>
                        <div style={{ width: '50%', maxWidth: '50%' }}>
                            <Typography.Text style={{ display: 'block', marginBottom: '16px' }} strong>Ingoing Cards</Typography.Text>
                            <Form.Item name="ingoing-brick" label="Bricks">
                                <InputNumber min={0} max={19 - currentPlayer.deck.BRICK}></InputNumber>
                            </Form.Item>
                            <Form.Item name="ingoing-lumber" label="Lumber">
                                <InputNumber min={0} max={19 - currentPlayer.deck.LUMBER}></InputNumber>
                            </Form.Item>
                            <Form.Item name="ingoing-ore" label="Ore">
                                <InputNumber min={0} max={19 - currentPlayer.deck.ORE}></InputNumber>
                            </Form.Item>
                            <Form.Item name="ingoing-wheat" label="Wheat">
                                <InputNumber min={0} max={19 - currentPlayer.deck.WHEAT}></InputNumber>
                            </Form.Item>
                            <Form.Item name="ingoing-wool" label="Wool">
                                <InputNumber min={0} max={19 - currentPlayer.deck.WOOL}></InputNumber>
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item name="target-players" label="Target Players">
                        <Checkbox.Group>
                            {otherPlayers.map(val => <Checkbox value={val.id}>{val.playerName}</Checkbox>)}
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </div>,
            okText: "Continue",
            icon: <></>,
            cancelButtonProps: { style: { display: 'none' } },
            onOk: () => tradeForm.submit(),
            onCancel: () => tradeForm.submit(),
        })
    }

    const [finishTradeForm] = useForm();
    function consumeTrade(trade: Trade) {
        const playerEnterDialog = info({
            width: "1000px",
            content: <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                form={finishTradeForm}
                onFinish={(val) => {
                    let user: UserData | undefined = undefined;
                    for (let player of otherPlayers) {
                        if (player.id === (val['player'] as number)) {
                            user = player;
                        }
                    }
                    if (!user) {
                        notification.open({
                            type: 'error',
                            message: 'Invalid Password'
                        })
                        playerEnterDialog.destroy();
                        return;
                    }
                    if (user.passcode !== val['passcode']) {
                        notification.open({
                            type: 'error',
                            message: 'Passcode is not valid'
                        })
                        playerEnterDialog.destroy();
                        return;
                    }
                    for (let player of trade.targetPlayers) {
                        if (user.id === player) {
                            playerEnterDialog.destroy();
                            finishTrade(user, trade);
                            finishTradeForm.resetFields();
                            return;
                        }
                    }
                    playerEnterDialog.destroy();
                    notification.open({
                        type: 'error',
                        message: 'You are not a target player of this trade.'
                    })
                    finishTradeForm.resetFields();
                }}
            >
                <Typography.Paragraph>Enter your Passcode. It will automatically be used to determine your</Typography.Paragraph>
                <Form.Item name="player" label="Player Name" rules={[{ required: true }]}>
                    <Select>
                        {otherPlayers.map(player => <Select.Option value={player.id}>
                            {player.playerName}
                        </Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="passcode" label="Passcode" rules={[{ required: true }]}>
                    <Input type="password"></Input>
                </Form.Item>
            </Form>,
            okText: "Continue",
            cancelText: "Cancel Trade",
            icon: <></>,
            onOk: () => finishTradeForm.submit(),
            onCancel: () => {
                playerEnterDialog.destroy();
            },
        })
    }

    function getUserBasedOnPasscode(passcode: string) {
        for (const person of otherPlayers) {
            if (person.passcode === passcode) {
                return person;
            }
        }
    }

    function finishTrade(user: UserData, trade: Trade) {
        //@ts-ignore
        window.trade = () => currentTrades();
        const dialog = info({
            width: "1000px",
            content: <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: "flex", flexDirection: 'row' }}>
                    <div style={{ width: '50%', maxWidth: '50%' }}>
                        <List
                            size="small"
                            header={<Typography.Text style={{ display: 'block', marginBottom: '16px' }} strong>Outgoing Cards</Typography.Text>}
                            bordered
                            dataSource={Object.keys(trade.tradeOutgoing)}
                            renderItem={item => <List.Item>
                                <Typography.Text strong>{item.toLowerCase()}:&nbsp;&nbsp;{
                                    //@ts-ignore
                                    trade.tradeOutgoing[item]
                                }</Typography.Text>
                                <Typography.Text>
                                    You Have {
                                        //@ts-ignore
                                        user.deck[item]
                                    }
                                </Typography.Text>
                            </List.Item>}
                        />
                    </div>
                    <div style={{ width: '50%', maxWidth: '50%' }}>
                        <List
                            size="small"
                            header={<Typography.Text style={{ display: 'block', marginBottom: '16px' }} strong>Ingoing Cards</Typography.Text>}
                            bordered
                            dataSource={Object.keys(trade.tradeIngoing)}
                            renderItem={item => <List.Item>
                                <Typography.Text strong>{item.toLowerCase()}:&nbsp;&nbsp;{
                                    //@ts-ignore
                                    trade.tradeIngoing[item]
                                }</Typography.Text>
                                <Typography.Text>
                                    You Have {
                                        //@ts-ignore
                                        user.deck[item]
                                    }
                                </Typography.Text>
                            </List.Item>}
                        />
                    </div>
                </div>
            </div>,
            okText: "Trade",
            icon: <></>,
            onOk: () => {
                if (trade.tradeIngoing.BRICK > user!.deck.BRICK) {
                    notification.open({
                        type: 'error',
                        message: 'Insufficient Bricks'
                    })
                    dialog.destroy();
                    return;
                }
                if (trade.tradeIngoing.LUMBER > user!.deck.LUMBER) {
                    notification.open({
                        type: 'error',
                        message: 'Insufficient Lumber'
                    })
                    dialog.destroy();
                    return;
                }
                if (trade.tradeIngoing.WHEAT >= user!.deck.WHEAT) {
                    notification.open({
                        type: 'error',
                        message: 'Insufficient Wheat'
                    })
                    dialog.destroy();
                    return;
                }
                if (trade.tradeIngoing.WOOL >= user!.deck.WOOL) {
                    notification.open({
                        type: 'error',
                        message: 'Insufficient Wool'
                    })
                    dialog.destroy();
                    return;
                }
                if (trade.tradeIngoing.ORE >= user!.deck.ORE) {
                    notification.open({
                        type: 'error',
                        message: 'Insufficient Ore'
                    })
                    dialog.destroy();
                    return;
                }
                axios({
                    url: `http://localhost:${IPC_PORT_CATAN}/trade`,
                    method: 'POST',
                    data: {
                        tradeOutgoing: trade.tradeOutgoing,
                        tradeIngoing: trade.tradeIngoing,
                        playerId: currentPlayer.id
                    }
                }).then(value => {
                    setCurrentPlayer(value.data)
                })
            },
            onCancel: () => {
                dialog.destroy()
            },
        })
    }

    function fnUseDevelopmentCard() {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/use-dev-card`,
            method: 'POST',
            data: {}
        }).then((res) => {
            setCurrentPlayer(res.data);
            notification.open({
                message: 'Successfully Used Development Card'
            })
        })
    }

    function fnUseYearOfPlenty(resource1: string, resource2: string) {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/use-year-of-plenty`,
            method: 'POST',
            data: {
                playerId: currentPlayer.id,
                resourceType1: resource1,
                resourceType2: resource2
            }
        }).then((res) => {
            setCurrentPlayer(res.data);
            notification.open({
                message: 'Successfully Used Year of Plenty Card'
            })
        })
    }

    function fnUseMonopoly(resource: string) {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/use-monopoly`,
            method: 'POST',
            data: {
                playerId: currentPlayer.id,
                resourceType: resource
            }
        }).then((res) => {
            setCurrentPlayer(res.data);
            getOtherPlayerData();
            notification.open({
                message: 'Successfully Used Monopoly Card'
            })
        })
    }

    function fnUseKnight() {
        knightCardCloseObserable.next();
        setDevelopmentCardsOpen(false);
        setPlayingKnightCard(true);
        const dialog = info({
            width: "1000px",
            //@ts-ignore
            content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${currentPlayer.playerName} please move the robber`}</Typography.Text>,
            okText: "Continue",
            icon: <></>,
            cancelButtonProps: { style: { display: 'none' }, },
            onOk: () => {
                dialog.destroy()
                setSelectedNodesRobber()
            },
            onCancel: setSelectedNodesRobber
        })
        setSelectedNodesRobber();
    }

    function fnUseRoadBuilding() {
        roadBuildingCloseObserable.next();
        setDevelopmentCardsOpen(false);
        setPlayingRoadBuildingCard(true);
        setSelectedEdgeStage1();
    }

    useEffect(() => {
        console.log('Updates Is Loading Amount Left');
        console.log(`New Value ${isLoadingAmountLeft}`);
    }, [isLoadingAmountLeft])

    useEffect(() => {
        console.log('Updates Amount Left');
        console.log(amountLeft)
        setIsLoadingAmountLeft(false);
        if (amountLeft.length <= 0) return;
        const currentData = [
            {
                key: 'Settlements',
                value: currentPlayer.amountSettlements
            },
            {
                key: 'City',
                value: currentPlayer.amountCities
            },
            {
                key: 'Roads',
                value: currentPlayer.amountRoads
            }
        ]
        info({
            title: 'Game Statistics',
            width: '1000px',
            icon: <></>,
            centered: true,
            content: <div className="VScroll" style={{ maxHeight: '70vh' }}>
                <Typography.Title style={{ display: 'block', textAlign: 'center' }}>
                    Game Statistics
                </Typography.Title>
                <Divider></Divider>
                <Typography.Title level={3} style={{ display: 'block', textAlign: 'center' }}>
                    Amount of Resource Cards in the Deck
                </Typography.Title>
                {
                    !amountLeft ? <></> :
                        <Table
                            columns={[
                                {
                                    title: 'Card Name',
                                    dataIndex: 'key',
                                    key: 'card-name'
                                },
                                {
                                    title: 'Amount Cards Left',
                                    dataIndex: 'value',
                                    key: 'card-value'
                                }
                            ]}
                            rowKey={record => (record.key + Math.random())}
                            dataSource={amountLeft}>

                        </Table>
                }
                <Divider></Divider>
                <Typography.Title level={3} style={{ display: 'block', textAlign: 'center' }}>
                    Player Inventory
                    <Table
                        columns={[
                            {
                                title: 'Type',
                                dataIndex: 'key',
                                key: 'type'
                            },
                            {
                                title: 'Amount Left',
                                dataIndex: 'value',
                                key: 'value'
                            }
                        ]}
                        rowKey={record => (record.key + Math.random())}
                        dataSource={currentData}>
                    </Table>                                               </Typography.Title>
                <Divider></Divider>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                </div>
            </div>
        })
    }, [amountLeft])

    function tradeWithBank(
        requestedResource: "BRICK" | "LUMBER" | "ORE" | "WHEAT" | "WOOL",
        sentResource: "BRICK" | "LUMBER" | "ORE" | "WHEAT" | "WOOL",
        amountToSend: number) {
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/trade-with-bank`,
            method: 'POST',
            data: {
                playerId: currentPlayer.id,
                tradeOutgoing: {
                    [sentResource]: amountToSend,
                },
                resourceGiven: sentResource,
                resourceNeeded: requestedResource
            }
        }).then((res) => {
            setCurrentPlayer(res.data);
            notification.open({
                message: 'Successfully Traded Cards'
            })
        })
    }

    function buildCity(vertexId: number) {
        if (diceRoll == -1) {
            notification.open({
                message: 'Cannot Build City Before Rolled Dice'
            })
            return;
        }
        if (currentPlayer.deck.ORE < 3 || currentPlayer.deck.WHEAT < 2 || currentPlayer.amountSettlements < 1) {
            notification.open({
                message: 'Insufficient Resources'
            });
            return;
        }
        axios({
            url: `http://localhost:${IPC_PORT_CATAN}/build-city`,
            method: 'POST',
            data: {
                vertexId: vertexId
            }
        }).then(value => {
            setVertexData(value.data);
            setSelectedVertex([]);
            getPlayerData();
            setHasBuilt(true);
            setIsBuildingCity(false)
        })
    }

    const knightCardCloseObserable: Subject<void> = new Subject();
    const roadBuildingCloseObserable: Subject<void> = new Subject();

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
                                <Typography.Title level={4} style={{ marginBottom: 16 }}>
                                    Please Enter the Names and Passcodes of the Players
                                </Typography.Title>
                                <Typography.Title level={5} style={{ marginBottom: 32 }}>
                                    Please Make Sure to Keep Track of Your Passwords. They will be used in order
                                    to securely accept and decline trades with other players.
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
                                                        labelCol={{ span: 12, offset: 2 }}
                                                        rules={[{ required: true, message: 'Missing Color' }]}
                                                    >
                                                        <Select dropdownStyle={{ textTransform: "lowercase" }} style={{ minWidth: "8rem", textTransform: "lowercase" }} onSelect={(val: "BLACK" | "WHITE" | "ORANGE" | "YELLOW" | "PURPLE" | "BLUE" | "GREEN") => {
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
                                                            {availableColors.map(color => <Option value={color}>{color.toLowerCase()}</Option>)}
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
                                    <Button type="primary" htmlType="submit">
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
                        <div className="app-sidebar VScroll">
                            <div className="panel">
                                <Typography.Title level={3}>
                                    Player {currentPlayer.id}'s Turn
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
                                <div className="group">
                                    <Typography.Text className="group-title">
                                        Victory Points:
                                    </Typography.Text>
                                    <Typography.Text strong>
                                        {currentPlayer.victoryPoints}
                                    </Typography.Text>

                                </div>
                                {
                                    diceRoll != -1 ?
                                        <div className="group">
                                            <Typography.Text className="group-title">
                                                Rolled Dice:
                                            </Typography.Text>
                                            <Typography.Text strong style={{ textTransform: 'lowercase' }}>
                                                {diceRoll}
                                            </Typography.Text>
                                        </div>
                                        :
                                        <></>
                                }

                                <div className="group">
                                    <Typography.Text className="group-title">
                                        Player Color:
                                    </Typography.Text>
                                    <Typography.Text strong style={{ textTransform: 'lowercase' }}>
                                        {currentPlayer.color}
                                    </Typography.Text>
                                </div>
                            </div>
                            <Divider></Divider>
                            <div className="panel">
                                <Typography.Title level={3}>
                                    Actions
                                </Typography.Title>
                                <div className="section-items">
                                    <Button type="ghost" onClick={() => {
                                        setIsLoadingAmountLeft(true);
                                        axios({
                                            url: `http://localhost:${IPC_PORT_CATAN}/get-amount-left`,
                                            method: 'GET'
                                        }).then((res) => {
                                            let values = [];
                                            for (const key in res.data) {
                                                values.push({
                                                    key: key,
                                                    value: (res.data[key] as string)
                                                });
                                            }
                                            console.log(res);
                                            console.log(values);
                                            setAmountLeft(values);
                                        })
                                        console.log(isLoadingAmountLeft);
                                    }}>
                                        Game Statistics
                                    </Button>
                                    <Button type="ghost" onClick={() => {
                                        info({
                                            width: "1000px",
                                            //@ts-ignore
                                            content: <>
                                                <Typography.Title style={{ textAlign: 'center' }} level={5}>Victory Points: {currentPlayer.victoryPoints}</Typography.Title>
                                                <Typography.Title style={{ textAlign: 'center' }} level={5}>Secret Victory Points: {currentPlayer.secretVictoryPoints}</Typography.Title>
                                            </>,
                                            okText: "Ok",
                                            icon: <></>,
                                            cancelButtonProps: { style: { display: 'none' }, },
                                        })
                                    }}>
                                        View Secret Victory Points
                                    </Button>
                                    <Button type="ghost" onClick={() => setDevelopmentCardsOpen(true)}>
                                        Development Cards
                                    </Button>
                                    <Button type="ghost" onClick={() => setDeckOpen(true)}>
                                        View Deck
                                    </Button>
                                    <Button type="ghost" onClick={() => {
                                        if (diceRoll == -1) {
                                            notification.open({
                                                message: 'Cannot Trade Cards Before Rolled Dice'
                                            })
                                        }
                                        else if (hasBuit) {
                                            notification.open({
                                                message: 'Cannot Trade After Building Settlements, Roads, or Cities'
                                            })
                                        }
                                        else {
                                            setTradeOpen(true)
                                        }
                                    }}>
                                        Trade Cards
                                    </Button>
                                    <Button type="ghost" onClick={() => {
                                        if (diceRoll == -1) {
                                            notification.open({
                                                message: 'Cannot Buy Settlements, Roads, Cities, and Development Cards Before Rolling'
                                            })
                                        }
                                        else {
                                            setStoreOpen(true)
                                        }
                                    }}>
                                        Store
                                    </Button>
                                    {
                                        isBuildingCity || isBuildingRoad || isBuildingSettlement
                                            ? <Button type="ghost" onClick={() => {
                                                if (isBuildingCity) {
                                                    setIsBuildingCity(false)
                                                    setSelectedVertex([])
                                                }
                                                if (isBuildingSettlement) {
                                                    setIsBuildingSettlement(false)
                                                    setSelectedVertex([])
                                                }
                                                if (isBuildingRoad) {
                                                    setIsBuildingRoad(false)
                                                    setSelectedEdges([])
                                                }
                                            }}>
                                                Cancel Building
                                            </Button>
                                            : <></>
                                    }
                                    <Button type="ghost" disabled={diceRoll != -1 || currentStage != 3} onClick={() => {
                                        rollDice()
                                    }}>
                                        Roll the Dice
                                    </Button>
                                    <Popconfirm
                                        title="Are you sure you would like to complete your turn?"
                                        onConfirm={() => endTurn()}
                                        onCancel={() => undefined}
                                        okText="Pass the Dice"
                                        cancelText="Continue Turn"
                                    >
                                        <Button type="primary" style={{ width: '100%' }} danger disabled={diceRoll === -1}>
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
                        {
                            nodeData && edgeData && vertexData
                                ? <Board
                                    buildCity={buildCity}
                                    portList={portList}
                                    edgeRegistrationFn={registerSelectedEdges}
                                    vertexRegistrationFn={registerSelectedVertex}
                                    nodeRegistrationFn={registerSelectedNode}
                                    selectedEdges={selectedEdges}
                                    selectedVertex={selectedVertex}
                                    selectedNodes={selectedNodes}
                                    nodeData={nodeData!}
                                    edgeData={edgeData!}
                                    vertexData={vertexData!}></Board>
                                : <div className="loading-screen">
                                    <Spin spinning>

                                    </Spin>
                                </div>
                        }
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
                                <div className="trade-player-root">
                                    <Typography.Title level={4}>
                                        Trade with Other Players
                                    </Typography.Title>
                                    <Button
                                        type="primary"
                                        block
                                        onClick={createTrade}
                                        style={{ marginBottom: 16 }}>
                                        Initiate Trade With Others
                                    </Button>
                                    <List
                                        size="small"
                                        header={<div>Current Trades</div>}
                                        bordered
                                        dataSource={currentTrades}
                                        renderItem={item => <List.Item>
                                            <Button type="ghost" style={{ marginRight: '1rem' }} onClick={() => consumeTrade(item)}>
                                                Consume Trade
                                            </Button>
                                            {console.log(item.targetPlayers)}
                                            {item.targetPlayers.map(targetPlayer => {
                                                let user: UserData | undefined = undefined;
                                                for (let player of otherPlayers) {
                                                    if (player.id === targetPlayer) {
                                                        user = player;
                                                    }
                                                }
                                                return user!.playerName + ", "
                                            })}
                                        </List.Item>}
                                    />
                                </div>
                                <div className="trade-game-root">
                                    <Typography.Title level={4}>
                                        Trading with the Bank
                                    </Typography.Title>
                                    <Button
                                        type="ghost"
                                        style={{ marginRight: '1rem' }}
                                        onClick={() => {
                                            if (currentPlayer.deck.BRICK < 4 &&
                                                currentPlayer.deck.LUMBER < 4 &&
                                                currentPlayer.deck.ORE < 4 &&
                                                currentPlayer.deck.WHEAT < 4 &&
                                                currentPlayer.deck.WOOL < 4) {
                                                notification.open({
                                                    message: 'Insufficient Resources'
                                                })
                                                return;
                                            }
                                            const dialog = info({
                                                width: '1000px',
                                                icon: <></>,
                                                content: <div>
                                                    <Typography.Title style={{ display: 'block', textAlign: 'center' }}>
                                                        Trade with Bank 4:1 Ratio
                                                    </Typography.Title>
                                                    <Divider></Divider>
                                                    <Typography.Title style={{ display: 'block', textAlign: 'center' }} level={5}>
                                                        Choose Which Resources to Trade
                                                    </Typography.Title>
                                                    <Form onFinish={(formInstance) => {
                                                        tradeWithBank(formInstance['req-resource'], formInstance['send-resource'], 4);
                                                        dialog.destroy();
                                                    }}>
                                                        <Form.Item name="req-resource" label="Requested Resource From Bank" required>
                                                            <Select>
                                                                <Select.Option value="BRICK">Brick</Select.Option>
                                                                <Select.Option value="LUMBER">Lumber</Select.Option>
                                                                <Select.Option value="ORE">Ore</Select.Option>
                                                                <Select.Option value="WHEAT">Wheat</Select.Option>
                                                                <Select.Option value="WOOL">Wool</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item name="send-resource" label="Resource to Send" required>
                                                            <Select>
                                                                {
                                                                    currentPlayer.deck.BRICK >= 4 ?
                                                                        <Select.Option value="BRICK">Brick</Select.Option> : <></>
                                                                }
                                                                {
                                                                    currentPlayer.deck.LUMBER >= 4 ?
                                                                        <Select.Option value="LUMBER">Lumber</Select.Option> : <></>
                                                                }
                                                                {
                                                                    currentPlayer.deck.ORE >= 4 ?
                                                                        <Select.Option value="ORE">Ore</Select.Option> : <></>
                                                                }
                                                                {
                                                                    currentPlayer.deck.WHEAT >= 4 ?
                                                                        <Select.Option value="WHEAT">Wheat</Select.Option> : <></>
                                                                }
                                                                {
                                                                    currentPlayer.deck.WOOL >= 4 ?
                                                                        <Select.Option value="WOOL">Wool</Select.Option> : <></>
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                        <Button type="primary" htmlType="submit">
                                                            Continue
                                                        </Button>
                                                    </Form>
                                                </div>,
                                                okButtonProps: {
                                                    style: { display: 'none' }
                                                },
                                                cancelButtonProps: {
                                                    style: { display: 'none' }
                                                }
                                            })
                                        }}>
                                        Trade with the Bank
                                    </Button>
                                </div>
                                <div className="trade-game-root">
                                    <Typography.Title level={4}>
                                        Maritime Trade
                                    </Typography.Title>
                                    <List
                                        size="small"
                                        header={<div>Ports</div>}
                                        bordered
                                        dataSource={portList}
                                        renderItem={(item) => <List.Item>
                                            <Button
                                                disabled={/*
                                                    (
                                                        !vertexData![getPortVertexPairs(item.id)![0]-1].empty ? vertexData![getPortVertexPairs(item.id)![0]-1].controlledPlayer.id !== currentPlayer.id : true ||
                                                        !vertexData![getPortVertexPairs(item.id)![1]-1].empty ? vertexData![getPortVertexPairs(item.id)![1]-1].controlledPlayer.id !== currentPlayer.id : true
                                                    ) &&
                                                    (
                                                    item.resourceType != null ?
                                                    currentPlayer.deck[item.resourceType] >= item.giveResource 
                                                    : ((
                                                        currentPlayer.deck.BRICK > item.giveResource
                                                    ) ||(
                                                        currentPlayer.deck.LUMBER > item.giveResource
                                                    ) ||(
                                                        currentPlayer.deck.ORE > item.giveResource
                                                    ) ||(
                                                        currentPlayer.deck.WHEAT > item.giveResource
                                                    ) ||(
                                                        currentPlayer.deck.WOOL > item.giveResource
                                                    )))*/false
                                                }
                                                type="ghost"
                                                style={{ marginRight: '1rem' }}
                                                onClick={() => {
                                                    console.log(vertexData![getPortVertexPairs(item.id)![0] - 1].empty)
                                                    console.log(vertexData![getPortVertexPairs(item.id)![1] - 1].empty)
                                                    console.log(vertexData![getPortVertexPairs(item.id)![0] - 1]);
                                                    console.log(vertexData![getPortVertexPairs(item.id)![1] - 1]);
                                                    console.log(currentPlayer.id)

                                                    if (
                                                        ((!vertexData![getPortVertexPairs(item.id)![0] - 1].empty) ?
                                                            vertexData![getPortVertexPairs(item.id)![0] - 1].controlledPlayer.id !== currentPlayer.id :
                                                            true) &&
                                                        ((!vertexData![getPortVertexPairs(item.id)![1] - 1].empty) ?
                                                            vertexData![getPortVertexPairs(item.id)![1] - 1].controlledPlayer.id !== currentPlayer.id :
                                                            true)) {
                                                        notification.open({
                                                            message: 'Must Have a Settlement or City on the Port to Trade with the Port'
                                                        })
                                                        return;
                                                    }
                                                    if (item.resourceType === null) {
                                                        if (currentPlayer.deck.BRICK < item.giveResource &&
                                                            currentPlayer.deck.LUMBER < item.giveResource &&
                                                            currentPlayer.deck.ORE < item.giveResource &&
                                                            currentPlayer.deck.WHEAT < item.giveResource &&
                                                            currentPlayer.deck.WOOL < item.giveResource) {
                                                            notification.open({
                                                                message: 'Insufficient Resources'
                                                            })
                                                            return;
                                                        }
                                                    }
                                                    if (currentPlayer.deck[item.resourceType] < item.giveResource) {
                                                        notification.open({
                                                            message: 'Insufficient Resources'
                                                        })
                                                        return;
                                                    }
                                                    if (item.resourceType === null) {
                                                        const dialog = info({
                                                            width: '1000px',
                                                            icon: <></>,
                                                            content: <div>
                                                                <Typography.Title style={{ display: 'block', textAlign: 'center' }}>
                                                                    Trade with Bank 3:1 Ratio
                                                                </Typography.Title>
                                                                <Divider></Divider>
                                                                <Typography.Title style={{ display: 'block', textAlign: 'center' }} level={5}>
                                                                    Choose Which Resources to Trade
                                                                </Typography.Title>
                                                                <Form onFinish={(formInstance) => {
                                                                    tradeWithBank(formInstance['req-resource'], formInstance['send-resource'], 3);
                                                                    dialog.destroy();
                                                                }}>
                                                                    <Form.Item name="req-resource" label="Requested Resource From Bank" required>
                                                                        <Select>
                                                                            <Select.Option value="BRICK">Brick</Select.Option>
                                                                            <Select.Option value="LUMBER">Lumber</Select.Option>
                                                                            <Select.Option value="ORE">Ore</Select.Option>
                                                                            <Select.Option value="WHEAT">Wheat</Select.Option>
                                                                            <Select.Option value="WOOL">Wool</Select.Option>
                                                                        </Select>
                                                                    </Form.Item>
                                                                    <Form.Item name="send-resource" label="Resource to Send" required>
                                                                        <Select>
                                                                            {
                                                                                currentPlayer.deck.BRICK >= 3 ?
                                                                                    <Select.Option value="BRICK">Brick</Select.Option> : <></>
                                                                            }
                                                                            {
                                                                                currentPlayer.deck.LUMBER >= 3 ?
                                                                                    <Select.Option value="LUMBER">Lumber</Select.Option> : <></>
                                                                            }
                                                                            {
                                                                                currentPlayer.deck.ORE >= 3 ?
                                                                                    <Select.Option value="ORE">Ore</Select.Option> : <></>
                                                                            }
                                                                            {
                                                                                currentPlayer.deck.WHEAT >= 3 ?
                                                                                    <Select.Option value="WHEAT">Wheat</Select.Option> : <></>
                                                                            }
                                                                            {
                                                                                currentPlayer.deck.WOOL >= 3 ?
                                                                                    <Select.Option value="WOOL">Wool</Select.Option> : <></>
                                                                            }
                                                                        </Select>
                                                                    </Form.Item>
                                                                    <Button type="primary" htmlType="submit">
                                                                        Continue
                                                                    </Button>
                                                                </Form>
                                                            </div>,
                                                            okButtonProps: {
                                                                style: { display: 'none' }
                                                            },
                                                            cancelButtonProps: {
                                                                style: { display: 'none' }
                                                            }
                                                        })
                                                    }
                                                    else {
                                                        const dialog = info({
                                                            width: '1000px',
                                                            icon: <></>,
                                                            content: <div>
                                                                <Typography.Title style={{ display: 'block', textAlign: 'center' }}>
                                                                    Trade with the Bank 2:1 Ratio
                                                                </Typography.Title>
                                                                <Divider></Divider>
                                                                <Typography.Title style={{ display: 'block', textAlign: 'center' }} level={5}>
                                                                    Choose Which Resource to Give
                                                                </Typography.Title>
                                                                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                                                                    {
                                                                        currentPlayer.deck.BRICK >= 2 ?
                                                                            <Button onClick={() => {
                                                                                dialog.destroy();
                                                                                tradeWithBank(item.resourceType, "BRICK", item.giveResource)
                                                                            }}>
                                                                                Brick
                                                                            </Button> : <></>
                                                                    }
                                                                    {
                                                                        currentPlayer.deck.LUMBER >= 2 ?
                                                                            <Button onClick={() => {
                                                                                dialog.destroy();
                                                                                tradeWithBank(item.resourceType, "LUMBER", item.giveResource)
                                                                            }}>
                                                                                Lumber
                                                                            </Button> : <></>
                                                                    }
                                                                    {
                                                                        currentPlayer.deck.ORE >= 2 ?
                                                                            <Button onClick={() => {
                                                                                dialog.destroy();
                                                                                tradeWithBank(item.resourceType, "ORE", item.giveResource)
                                                                            }}>
                                                                                Ore
                                                                            </Button> : <></>
                                                                    }
                                                                    {
                                                                        currentPlayer.deck.WHEAT >= 2 ?
                                                                            <Button onClick={() => {
                                                                                dialog.destroy();
                                                                                tradeWithBank(item.resourceType, "WHEAT", item.giveResource)
                                                                            }}>
                                                                                Wheat
                                                                            </Button> : <></>
                                                                    }
                                                                    {
                                                                        currentPlayer.deck.WOOL >= 2 ?
                                                                            <Button onClick={() => {
                                                                                dialog.destroy();
                                                                                tradeWithBank(item.resourceType, "WOOL", item.giveResource)
                                                                            }}>
                                                                                Wool
                                                                            </Button> : <></>
                                                                    }
                                                                </div>
                                                            </div>,
                                                            okButtonProps: {
                                                                style: { display: 'none' }
                                                            },
                                                            cancelButtonProps: {
                                                                style: { display: 'none' }
                                                            }
                                                        })
                                                    }
                                                }}>
                                                Trade with the Port
                                            </Button>
                                            <Typography.Text strong style={{ marginRight: '1rem' }}>
                                                {item.name}
                                            </Typography.Text>
                                            <Typography.Text>
                                                Trade Ratio- {item.giveResource}:{item.getResource}
                                            </Typography.Text>
                                        </List.Item>}
                                    />
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
                                    actions={storeCardBottom((currentPlayer.deck.LUMBER < 1 || currentPlayer.deck.BRICK < 1), () => {
                                        console.log(currentPlayer)
                                        if (currentPlayer.deck.BRICK < 1 || currentPlayer.deck.LUMBER < 1) {
                                            notification.open({
                                                message: 'Insufficient Resources'
                                            });
                                            return;
                                        }
                                        if (isBuildingCity) {
                                            setIsBuildingCity(false)
                                            setSelectedVertex([])
                                        }
                                        if (isBuildingSettlement) {
                                            setIsBuildingSettlement(false)
                                            setSelectedVertex([])
                                        }

                                        setSelectedEdgeStage1();
                                        setStoreOpen(false);
                                        setIsBuildingRoad(true);
                                    })}
                                    cover={
                                        <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect className={currentPlayer.color} x="25" y="63" width="150" height="25" rx="2" />
                                        </svg>
                                    }>
                                    <Typography.Text>
                                        Materials Needed: 1 Brick, 1 Lumber
                                    </Typography.Text>
                                </Card>
                                <Card style={{ width: '300px' }}
                                    title="Settlement"
                                    actions={storeCardBottom((currentPlayer.deck.LUMBER < 1 || currentPlayer.deck.BRICK < 1 || currentPlayer.deck.WOOL < 1 || currentPlayer.deck.WHEAT < 1), () => {
                                        if (currentPlayer.deck.BRICK < 1 || currentPlayer.deck.LUMBER < 1 || currentPlayer.deck.WOOL < 1 || currentPlayer.deck.WHEAT < 1) {
                                            notification.open({
                                                message: 'Insufficient Resources'
                                            });
                                            return;
                                        }
                                        if (isBuildingCity) {
                                            setIsBuildingCity(false)
                                            setSelectedVertex([])
                                        }
                                        if (isBuildingRoad) {
                                            setIsBuildingRoad(false)
                                            setSelectedEdges([])
                                        }
                                        getPlayerData();
                                        setSelectedVertexSettlements();
                                        setStoreOpen(false);
                                        setIsBuildingSettlement(true);
                                    })}
                                    cover={
                                        <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={currentPlayer.color} fill-rule="evenodd" clip-rule="evenodd" d="M101.524 33.7084C100.539 32.7499 98.965 32.7661 98.0001 33.7447L64.0035 68.2209C63.9876 68.237 63.9719 68.2532 63.9566 68.2696C63.3828 68.6212 63 69.254 63 69.9762V117.976H137.988V70.0762C137.988 69.3844 137.653 68.7707 137.137 68.3881C137.079 68.3184 137.016 68.2505 136.948 68.1846L101.524 33.7084Z" />
                                        </svg>
                                    }>
                                    <Typography.Text>
                                        Materials Needed: 1 Brick, 1 Lumber, 1 Wheat, 1 Wool
                                    </Typography.Text>
                                </Card>
                                <Card style={{ width: '300px' }}
                                    title="City"
                                    actions={[<Typography.Text>Click on the Settlement to Upgrade</Typography.Text>]}
                                    cover={
                                        <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={currentPlayer.color} fill-rule="evenodd" clip-rule="evenodd" d="M51.6051 21.087C50.6006 19.6209 48.4301 19.6416 47.4538 21.1265L25.418 54.6409C25.1775 55.0068 25.0476 55.3992 25.0126 55.7888C25.0043 55.8628 25 55.9381 25 56.0144V79.0144V127.014C25 128.119 25.8954 129.014 27 129.014H173C174.105 129.014 175 128.119 175 127.014V81.0144C175 79.9098 174.105 79.0144 173 79.0144H75V56.2079C75.044 55.671 74.9137 55.1085 74.5664 54.6014L51.6051 21.087Z" />
                                        </svg>
                                    }>
                                    <Typography.Text>
                                        Materials Needed: 3 Ores, 2 Wheats, and 1 existing settlement
                                    </Typography.Text>
                                </Card>
                                <Card style={{ width: '300px' }}
                                    title="Victory Card"
                                    actions={storeCardBottom((currentPlayer.deck.WOOL >= 1 && currentPlayer.deck.WHEAT >= 1 && currentPlayer.deck.ORE >= 1), () => {
                                        console.log('Buying Card')
                                        if (currentPlayer.deck.WOOL < 1 || currentPlayer.deck.WHEAT < 1 || currentPlayer.deck.ORE < 1) {
                                            notification.open({
                                                message: 'Insufficient Resources'
                                            });
                                            return;
                                        }
                                        console.log('Buying Card. Passed 1st Step')
                                        axios({
                                            url: `http://localhost:${IPC_PORT_CATAN}/buy-development-card`,
                                            method: 'POST',
                                            data: {}
                                        }).then((res) => {
                                            setCurrentPlayer(res.data);
                                            notification.open({
                                                message: 'Successfully Bought Development Card'
                                            })
                                        })
                                    })}
                                    cover={<div></div>}>
                                    <Typography.Text>
                                        Materials Needed: 1 Wool, 1 Wheat, 1 Ore
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
                            <Typography.Title level={5}>Contains the Players Resource and Special Cards. The use development card sidebar contains the development cards</Typography.Title>
                            <Deck userData={currentPlayer}>

                            </Deck>
                        </Drawer>
                        <Drawer
                            title="Development Cards"
                            placement="right"
                            size="large"
                            onClose={() => setDevelopmentCardsOpen(false)}
                            visible={isDevelopmentCardsOpen}
                            extra={
                                <Space>
                                </Space>
                            }
                            className="VScroll"
                        >
                            <Typography.Title level={5}>Contains the Current Player's Development Cards. Click on a card to Use</Typography.Title>
                            <div className="deck" style={{
                                justifyContent: (currentPlayer.developmentCards.KNIGHT <= 0 && currentPlayer.developmentCards.MONOPOLY <= 0 && currentPlayer.developmentCards.ROAD_BUILDING <= 0 && currentPlayer.developmentCards.VICTORY_POINT <= 0 && currentPlayer.developmentCards.YEAR_OF_PLENTY <= 0) ? 'center' : 'flex-start'
                            }}>
                                {
                                    currentPlayer.developmentCards.VICTORY_POINT <= 0 ? <></> :
                                        <GameCard
                                            title="Victory Point Cards"
                                            img="victory-point-card.png"
                                            count={currentPlayer.developmentCards.VICTORY_POINT}
                                            description={<Typography.Paragraph>
                                                secretly adds a point that counts toward total score; not visible to other player
                                            </Typography.Paragraph>}
                                        >

                                        </GameCard>
                                }
                                {
                                    currentPlayer.developmentCards.KNIGHT <= 0 ? <></> :
                                        <GameCard
                                            title="Knight Card"
                                            img="knight.png"
                                            count={currentPlayer.developmentCards.KNIGHT}
                                            description={<Typography.Paragraph>
                                                Moves the robber to any hex; blocks resource and can steal from selected player
                                            </Typography.Paragraph>}
                                            action={<Button onClick={() => {
                                                fnUseKnight()
                                            }}>
                                                Use 1 Knight Card
                                            </Button>}
                                            closeDialog={knightCardCloseObserable.asObservable()}>

                                        </GameCard>
                                }
                                {
                                    currentPlayer.developmentCards.MONOPOLY <= 0 ? <></> :
                                        <GameCard
                                            title="Monopoly Card"
                                            img="monopoly.png"
                                            count={currentPlayer.developmentCards.MONOPOLY}
                                            description={<Typography.Paragraph>
                                                select a resource and all players have to give you that resource
                                            </Typography.Paragraph>}
                                            action={<Button onClick={() => {
                                                const dialog = info({
                                                    width: '1000px',
                                                    icon: <></>,
                                                    content: <div>
                                                        <Typography.Title style={{ display: 'block', textAlign: 'center' }} level={3}>
                                                            Monopoly Card
                                                        </Typography.Title>
                                                        <Divider></Divider>
                                                        <Typography.Title style={{ display: 'block', textAlign: 'center' }} level={5}>
                                                            Choose Which Resourse to Take from the other players
                                                        </Typography.Title>
                                                        <div style={{ marginTop: 16, display: 'flex', gap: '8px', flexDirection: 'row', justifyContent: 'center' }}>
                                                            <Button onClick={() => {
                                                                fnUseMonopoly("BRICK")
                                                                dialog.destroy();
                                                            }}>
                                                                Brick
                                                            </Button>
                                                            <Button onClick={() => {
                                                                fnUseMonopoly("LUMBER")
                                                                dialog.destroy();
                                                            }}>
                                                                Lumber
                                                            </Button>
                                                            <Button onClick={() => {
                                                                fnUseMonopoly("ORE")
                                                                dialog.destroy();
                                                            }}>
                                                                Ore
                                                            </Button>
                                                            <Button onClick={() => {
                                                                fnUseMonopoly("WHEAT")
                                                                dialog.destroy();
                                                            }}>
                                                                Wheat
                                                            </Button>
                                                            <Button onClick={() => {
                                                                fnUseMonopoly("WOOL")
                                                                dialog.destroy();
                                                            }}>
                                                                Wool
                                                            </Button>
                                                        </div>
                                                    </div>,
                                                    okButtonProps: {
                                                        style: { display: 'none' }
                                                    },
                                                    cancelButtonProps: {
                                                        style: { display: 'none' }
                                                    }
                                                })
                                            }}>
                                                Use 1 Monopoly Card
                                            </Button>}>

                                        </GameCard>
                                }
                                {
                                    currentPlayer.developmentCards.YEAR_OF_PLENTY <= 0 ? <></> :
                                        <GameCard
                                            title="Year of Plenty Card"
                                            img="year-of-plenty-card.png"
                                            count={currentPlayer.developmentCards.YEAR_OF_PLENTY}
                                            description={<Typography.Paragraph>
                                                take any 2 resource cards from supply stack
                                            </Typography.Paragraph>}
                                            action={<Button onClick={() => {
                                                const dialog = info({
                                                    width: '1000px',
                                                    icon: <></>,
                                                    content: <div>
                                                        <Typography.Title style={{ display: 'block', textAlign: 'center' }} level={3}>
                                                            Year of Plenty Card
                                                        </Typography.Title>
                                                        <Divider></Divider>
                                                        <Typography.Title style={{ display: 'block', textAlign: 'center' }} level={5}>
                                                            Choose Which Resourse to take from the Bank
                                                        </Typography.Title>
                                                        <Form onFinish={(formInstance) => {
                                                            fnUseYearOfPlenty(formInstance['resource-1'], formInstance['resource-2']);
                                                            dialog.destroy();
                                                        }}>
                                                            <Form.Item name="resource-1" label="1st Resource" required>
                                                                <Select>
                                                                    <Select.Option value="BRICK">Brick</Select.Option>
                                                                    <Select.Option value="LUMBER">Lumber</Select.Option>
                                                                    <Select.Option value="ORE">Ore</Select.Option>
                                                                    <Select.Option value="WHEAT">Wheat</Select.Option>
                                                                    <Select.Option value="WOOL">Wool</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item name="resource-2" label="2nd Resource" required>
                                                                <Select>
                                                                    <Select.Option value="BRICK">Brick</Select.Option>
                                                                    <Select.Option value="LUMBER">Lumber</Select.Option>
                                                                    <Select.Option value="ORE">Ore</Select.Option>
                                                                    <Select.Option value="WHEAT">Wheat</Select.Option>
                                                                    <Select.Option value="WOOL">Wool</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                            <Button type="primary" htmlType="submit">
                                                                Continue
                                                            </Button>
                                                        </Form>
                                                    </div>,
                                                    okButtonProps: {
                                                        style: { display: 'none' }
                                                    },
                                                    cancelButtonProps: {
                                                        style: { display: 'none' }
                                                    }
                                                })
                                            }}>
                                                Use 1 Year of Plenty Card
                                            </Button>}>

                                        </GameCard>
                                }
                                {
                                    currentPlayer.developmentCards.ROAD_BUILDING <= 0 ? <></> :
                                        <GameCard
                                            title="Road Building Card"
                                            img="road-building-card.png"
                                            count={currentPlayer.developmentCards.ROAD_BUILDING}
                                            description={<Typography.Paragraph>
                                                Build 2 roads without using resource cards
                                            </Typography.Paragraph>}
                                            action={<Button onClick={() => fnUseRoadBuilding()}>
                                                Use 1 Road Building Card
                                            </Button>}
                                            closeDialog={roadBuildingCloseObserable.asObservable()}>

                                        </GameCard>
                                }
                                {
                                    (currentPlayer.developmentCards.KNIGHT <= 0 && currentPlayer.developmentCards.MONOPOLY <= 0 && currentPlayer.developmentCards.ROAD_BUILDING <= 0 && currentPlayer.developmentCards.VICTORY_POINT <= 0 && currentPlayer.developmentCards.YEAR_OF_PLENTY <= 0)
                                        ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You Dont Have Any Development Cards"></Empty>
                                        : <></>
                                }
                            </div>
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
                            onOk={handleDiceRemoval}
                            onCancel={handleDiceRemoval}
                            width="1000px"
                            footer={
                                <Button type="primary" onClick={handleDiceRemoval}>
                                    Close
                                </Button>
                            }
                            className="VScroll">
                            <Typography.Title style={{ textAlign: 'center' }}>
                                You Rolled a {diceRoll}
                            </Typography.Title>
                        </Modal>
                        <Modal
                            title="Stage 1"
                            visible={isStage1MessageVisible}
                            onOk={() => {
                                setStage1MessageVisible(false)
                                info({
                                    width: '1000px',
                                    content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' } },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })
                            }}
                            onCancel={() => {
                                setStage1MessageVisible(false)
                                info({
                                    width: "1000px",
                                    content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
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
                            <Typography.Title style={{ textAlign: 'center' }}>
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
                                    width: "1000px",
                                    content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
                                    okText: "Continue",
                                    icon: <></>,
                                    cancelButtonProps: { style: { display: 'none' } },
                                    onOk: setSelectedVertexStage1,
                                    onCancel: setSelectedVertexStage1,
                                })
                            }}
                            onCancel={() => {
                                setStage2MessageVisible(false)
                                info({
                                    width: "1000px",
                                    content: <Typography.Text style={{ fontSize: 18 }} strong>{`Player ${currentPlayer.playerName}, Please place a settlement anywhere you would like on the board`}</Typography.Text>,
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
                            <Typography.Title style={{ textAlign: 'center' }}>
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
                                //rollDice()
                            }}
                            onCancel={() => {
                                setStage3MessageVisible(false)
                                //rollDice();
                            }}
                            width="1000px"
                            okText="Continue"
                            cancelButtonProps={{ style: { display: 'none' } }}
                            className="VScroll">
                            <Typography.Title style={{ textAlign: 'center' }}>
                                The Game Lies Ahead Good Luck
                            </Typography.Title>
                            <Typography.Paragraph>
                                In the third stage of the game, explorers will be competing to attain 10
                                points the fastest. Good Luck!
                            </Typography.Paragraph>
                        </Modal>
                        <Modal
                            title="Discard Panel"
                            visible={discardPanelVisible}
                            onOk={handleDiscardPanelClose}
                            onCancel={handleDiscardPanelClose}
                            width="1250px"
                            okText="Continue"
                            closable={false}
                            okButtonProps={{
                            }}
                            cancelButtonProps={{ style: { display: 'none' } }}
                            className="VScroll">
                            <div className="discard-root VScroll">
                                <Typography.Text strong>Player {currentDiscardPlayer.playerName} Please Drag and Drop the Cards that you would like to keep and discard</Typography.Text>
                                <TransferList
                                    ref={transferListRef}
                                    stateFn={(amountInDiscard) => {
                                        console.log(Math.floor((keepCards.length + discardCards.length) / 2));
                                        console.log((keepCards.length + discardCards.length) / 2);
                                        console.log(amountInDiscard);
                                        if (amountInDiscard === discardCards.length) {
                                            setDiscardPanelDisabled(false);
                                        }
                                        else {
                                            setDiscardPanelDisabled(true);
                                        }
                                    }}
                                    submitObservable={submitObservable.asObservable()}
                                    submit={() => {
                                        handleDiscardPanelClose();
                                    }}
                                    discard={discardCards}
                                    keep={keepCards}></TransferList>
                            </div>
                        </Modal>
                    </div>
                </CSSTransition>
            }
        </TransitionGroup>
    )
}

export default App;