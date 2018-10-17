import React from 'react';
import PlaySlot from './Play_Slot';
import Card from './Card';



const playArea = ( props ) => {
  
  const showCards = ( playSlots ) => {
    return (
      playSlots.map((slot, i) => {
        return (
          <PlaySlot 
            key={i}
            setDrag = {!slot.length? true : false}
            drag = {props.drag}>
            {slot.map((card, i, cur) => {
              const topCard = (i === cur.length - 1);
              if(topCard && !card.wasUp) card.wasUp = true;
              
              return (
                <Card
                  key = {card.key}
                  isUp = {card.wasUp}
                  color = {card.color}
                  val = {card.f_val ? card.f_val : card.val}
                  suit = {card.suit}
                  setDrag = {card.wasUp}
                  drag = {props.drag}
                  setWin = {topCard}
                  win = {props.win} />
              )
            })}
          </PlaySlot>
        )
      })
    );
  }

  return (
    <ul className="play-area">{showCards( props.hasCards )}</ul>
  )
}

export default playArea;