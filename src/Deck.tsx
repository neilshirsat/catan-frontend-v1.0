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
        case "LARGEST_ARMY": return "Largest Army.png";
        case "LONGEST_ROAD": return "Longest Road.png";
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
            Produced by hills; used to build roads and settlements
            </Typography.Paragraph>
        </>);
        case "LUMBER": return (<>
            <Typography.Paragraph>
            Produced by forest; used to build roads and settlements
            </Typography.Paragraph>
        </>);
        case "ORE": return (<>
            <Typography.Paragraph>
            Produced by mountains; used to build cities and buy development cards
            </Typography.Paragraph>
        </>);
        case "WHEAT": return (<>
            <Typography.Paragraph>
            produced by fields; used to build cities and settlements and buy development cards
            </Typography.Paragraph>
        </>);
        case "WOOL": return (<>
            <Typography.Paragraph>
            produced by pastures; used to build settlement and development cards
            </Typography.Paragraph>
        </>);
        case "LARGEST_ARMY": return (<>
            <Typography.Paragraph>
            Player who has a longest road out of all players; has to have at least a legal road length of 5 or greater
            </Typography.Paragraph>
        </>);
        case "LONGEST_ROAD": return (<>
            <Typography.Paragraph>
            Player who has the largest army size of all players; has to have an army size of 3 or greater
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