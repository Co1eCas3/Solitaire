import React from 'react';

const reserve = ( props ) => {

  const cards = props.hasCards;
  
  return (
    <div 
      className = {`reserve play-slot ${
        cards ?
          cards >= 3 ?
            'down has-3' :
            cards === 2 ?
              'down has-2' :
              'down' :
        ''
      }`}
      onClick = {props.pick_from}
      ></div>
  )
}

export default reserve;