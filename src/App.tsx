import Board from "./Board";
import './app.less'
import { Button, Drawer, Space, Typography } from "antd";
import { useState } from "react";

const App = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    return (<div>
        <div className="app">
            <div className="app-sidebar">
                <h1>
                    Catan Game
                </h1>
                <hr color="#ccc"></hr>
                <div className="panel">
                    <h2>
                        Trade Cards
                    </h2>
                    <Button type="primary" onClick={()=>setDrawerOpen(true)}>
                        Panel 1
                    </Button>
                </div>
                <hr color="#ccc"></hr>
                <div className="panel">
                    <Button type="primary">
                        Panel 1
                    </Button>
                </div>
                <hr color="#ccc"></hr>
                <div className="panel">
                    <Button type="primary">
                        Panel 1
                    </Button>
                </div>
                <hr color="#ccc"></hr>
                <div className="panel">
                    <Button type="primary">
                        Panel 1
                    </Button>
                </div>
            </div>
            <Board></Board>
            <Drawer
                title="Trade Cards"
                placement="right"
                size="large"
                onClose={()=>setDrawerOpen(false)}
                visible={isDrawerOpen}
                extra={
                    <Space>
                        <Button onClick={()=>setDrawerOpen(false)}>Cancel</Button>
                        <Button type="primary" onClick={()=>setDrawerOpen(false)}>
                            OK
                        </Button>
                    </Space>
                }
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </div>
    </div>)
}

export default App;