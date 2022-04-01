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
    </div>)
}

export default Deck;