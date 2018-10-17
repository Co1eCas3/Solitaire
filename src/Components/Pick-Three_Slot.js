import React from 'react';
import Card from './Card';

const pickThree = ( props ) => {

  const showPicks = ( pickCards ) => {
    const picks = pickCards.Picks;
    
    return (
      picks.map((card, i, arr) => {
        const topCard = (i === arr.length - 1);
        card.wasUp = true;
        return (
          <Card
            addClass={`in-pick-three-${i}`}
            key = {card.key}
            isUp={card.wasUp}
            color={card.color}
            val={card.f_val ? card.f_val : card.val}
            suit={card.suit}
            setDrag = {topCard}
            drag = {props.drag}
            setWin = {topCard}
            win = {props.win} />
        );
      })
    );
  }
  
  return (
    <ul className="pick-three">{showPicks(props.hasCards)}</ul>
  )
};

export default pickThree;