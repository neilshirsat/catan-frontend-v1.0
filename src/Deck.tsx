import { Typography } from 'antd';
import './Deck.less'
import GameCard from './GameCard';

const Deck : React.FC<{}> = (props) => {
    return (<div className="deck">
        <GameCard 
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

        </GameCard>
    </div>)
}

export default Deck;