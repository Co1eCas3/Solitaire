import React from 'react';

const card = ( props ) => {

  return <li 
            style={{color: props.color}}
            className={`card ${!props.isUp ? 'down' : ''} ${props.addClass ? props.addClass : ''}`}
            draggable = {props.setDrag}
            onDragStart = {(e) => props.drag.start(e)}
            onDragOver = {(e) => props.drag.over(e)}
            onDragEnd = {() => props.drag.end()}
            onDrop = {(e) => props.drag.drop(e)}
            onClick = {props.setWin ? props.win : null}>
              {!props.isUp ? '' : props.val + props.suit}
            </li>
}

export default card;