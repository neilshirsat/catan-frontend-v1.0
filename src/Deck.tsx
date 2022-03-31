import './Deck.less'
import GameCard from './GameCard';

const Deck : React.FC<{}> = (props) => {
    return (<div className="deck">
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
    </div>)
}

export default Deck;