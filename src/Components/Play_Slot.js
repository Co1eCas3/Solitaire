import React from 'react';

const playSlot = ( props ) => {
  return (
    <ul 
      className="play-slot"
      key={props.key}
      draggable = {props.setDrag}
      onDragOver = {props.setDrag ? 
                      (e) => props.drag.over(e) : 
                      null}
      onDrop = {props.setDrag ? 
                  (e) => props.drag.drop(e) : 
                  null} >
      {props.children}
    </ul>
  )
}

export default playSlot;