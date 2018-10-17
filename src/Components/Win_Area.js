import React from 'react';
import PlaySlot from './Play_Slot';
import Card from './Card';


const winArea = ( props ) => {

  const showCards = ( winSlots ) => {
  
    return (
      winSlots.map(( slot, i ) => {
        return (
          <PlaySlot 
            key={i}>
            {slot.map((card, i, cur) => {
              const topCard = (i === cur.length - 1);
              
              return (
                <Card
                  addClass = "in-win"
                  key = {card.key}
                  isUp = {card.wasUp}
                  color = {card.color}
                  val = {card.f_val ? card.f_val : card.val}
                  suit = {card.suit}
                  setDrag = {topCard}
                  drag = {props.drag} />
              );
            })}
          </PlaySlot>
        )
      })
    );
  }

  return (
    <ul className='win-area'>{showCards( props.hasCards )}</ul>
  )
}

export default winArea;