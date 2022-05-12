import { Props } from '@dnd-kit/core/dist/components/DragOverlay';
import { Empty, Typography } from 'antd';
import { UserData } from './App';
import './Deck.less'
import GameCard from './GameCard';

function getCardImage(card: keyof UserData['deck'] | keyof UserData['specialCards']) {
    switch (card) {
        case "BRICK" : return "Brick.png";
        case "LUMBER" : return "Lumber.png";
        case "ORE" : return "Ore.png";
        case "WHEAT" : return "Wheat.png";
        case "WOOL" : return "Wool.png";
        case "LARGEST_ARMY": return "Largest Army";
        case "LONGEST_ROAD": return "Longest Road";
    }
}

function doesUserHaveCards(userData: UserData): boolean {
    for (const e in userData.deck) {
        //@ts-ignore
        if (userData.deck[(e)] > 0) {
            return true;
        }
        //@ts-ignore
        if (userData.developmentCards[(e)] > 0) {
            return true;
        }
        //@ts-ignore
        if (userData.specialCards[(e)] > 0) {
            return true;
        }
    }
    return false;
}

function getDescription(card: keyof UserData['deck'] | keyof UserData['specialCards']) {
    switch(card) {
        case "BRICK": return (<>
            <Typography.Paragraph>
                
            </Typography.Paragraph>
        </>);
        case "LUMBER": return (<>
            <Typography.Paragraph>

            </Typography.Paragraph>
        </>);
        case "ORE": return (<>
            <Typography.Paragraph>

            </Typography.Paragraph>
        </>);
        case "WHEAT": return (<>
            <Typography.Paragraph>

            </Typography.Paragraph>
        </>);
        case "WOOL": return (<>
            <Typography.Paragraph>

            </Typography.Paragraph>
        </>);
        case "LARGEST_ARMY": return (<>
            <Typography.Paragraph>

            </Typography.Paragraph>
        </>);
        case "LONGEST_ROAD": return (<>
            <Typography.Paragraph>

            </Typography.Paragraph>
        </>);
    }
}

const Deck: React.FC<{
    userData: UserData
}> = (props) => {
    return (
        <div className="deck" style={{
            justifyContent: !doesUserHaveCards(props.userData) ? 'center' : 'flex-start'
        }}>
            {
                doesUserHaveCards(props.userData) ?
                <>
                    {Object.keys(props.userData.deck).map((val) => {
                        //@ts-ignore
                        if (props.userData.deck[val] == 0) {
                            return <></>
                        }
                        //@ts-ignore
                        return <GameCard img={getCardImage(val)} title={val} count={props.userData.deck[val]} description={getDescription(val)}>
                        </GameCard>
                    })}
                    {Object.keys(props.userData.developmentCards).map((val) => {
                        //@ts-ignore
                        if (props.userData.developmentCards[val] == 0) {
                            return <></>
                        }
                        //@ts-ignore
                        return <GameCard title={val} img={getCardImage(val)} count={props.userData.developmentCards[val]} description={getDescription(val)}>
                        </GameCard>
                    })}
                </>
                :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Your Deck is Empty">

                </Empty>
            }
            {/*<GameCard
                title="ore"
                count={1}
                img="./Ore.png">

            </GameCard>
            <GameCard title="Grain" count={1}
                img="./Wheat.png"></GameCard>
            <GameCard title="Brick" count={1}
                img="./Brick.png" ></GameCard>
            <GameCard title="Lumber" count={1}
                img="./Lumber.png" ></GameCard>
            <GameCard title="Wool" count={1}
                img="./Wool.png" ></GameCard>
            <GameCard title="Longest Road" count={1} img=""
                bottom={<>
                    <Typography.Text strong>2 Victory Points!</Typography.Text>
                    <Typography.Paragraph className="p">
                        This card goes to the player with the largest unbroken road of
                        at least 5 segemants. Another player who builds a longer road takes
                        this card
                    </Typography.Paragraph>
                </>}>

            </GameCard>
            <GameCard title="Largest Army" count={1}
                img=""
                bottom={<>
                    <Typography.Text strong>2 Victory Points!</Typography.Text>
                    <Typography.Paragraph className="p">
                        This card goes to the player with the largest unbroken road of
                        at least 5 segemants. Another player who builds a longer road takes
                        this card
                    </Typography.Paragraph>
                </>}>
            </GameCard>*/}
        </div>
    )
}

export default Deck;