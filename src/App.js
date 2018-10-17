import React, { Component } from 'react';
import './App.css';
import Deck from './Components/Deck';
import Table from './Components/Table';
import ReserveDeck from './Components/Reserve_Deck';
import PickThree from './Components/Pick-Three_Slot';
import WinArea from './Components/Win_Area';
import PlayArea from './Components/Play_Area';

class App extends Component {
  state = {
    Reserve: Deck(),
    PickThree: { 
      Behind: [],
      Picks: []
    },
    PlaySlots: [ [], [], [], [], [], [], [] ],
    WinSlots: [ [], [], [], [] ]
  }

  newGame = () => {
    const reset = {...this.state};

    if(reset.Reserve.length === 52) {
      this.deal();
      return;
    }
    
    reset.Reserve.splice(0);
    reset.PickThree.Behind.splice(0);
    reset.PickThree.Picks.splice(0);
    reset.PlaySlots.forEach(slot => slot.splice(0));
    reset.WinSlots.forEach(slot => slot.splice(0));

    const newDeck = Deck();
    
    newDeck.forEach(card => reset.Reserve.push(card));

    this.setState({ reset });
  }

  deal = () => {

    const state = this.state;
    const reserve = [...state.Reserve];
    const slots = [...state.PlaySlots];
    
    reserve.sort(() => .5 - Math.random());

    let slot = 0;
    let restart = 0;
    while(restart < slots.length) {
      if(slot === slots.length - 1) {
        slots[slot].push(reserve.shift());
        restart++;
        slot = restart;
      } else {
        slots[slot].push(reserve.shift());
        slot++;
      }
    }

    this.setState({
      Reserve: reserve,
      PlaySlots: slots
    });
  }

  /*----------------*/

  pickThreeHandler = () => {
    const state = this.state;
    const reserve = [...state.Reserve];
    const behind = [...state.PickThree.Behind];
    const picks = [...state.PickThree.Picks];

    if((reserve.length && picks.length) || (behind.length && picks.length)) {
      for(let card = picks.length; card > 0; card--) {
        behind.push(picks.shift());
      }
    }

    if(reserve.length >= 3) {
      for(let card = 0; card < 3; card++) {
        picks.push(reserve.shift());
      }
    } else if(reserve.length) {
      for(let card = reserve.length; card > 0; card--) {
        picks.push(reserve.shift());
      }
    } else {
      if(behind.length) {
        for(let card = behind.length; card > 0; card--) {
          reserve.push(behind.shift());
        }
      }
    }

    this.setState({
      Reserve: reserve,
      PickThree: {
        Behind: behind,
        Picks: picks
      }
    });
  }

  winHandler = (e) => {
    const _wins = [...this.state.WinSlots],
          _behind = [...this.state.PickThree.Behind],
          _plays = [...this.state.PlaySlots],
          _picks = [...this.state.PickThree.Picks],
          el_area = e.target.parentElement.parentElement;
    let el_slot_from_index,
        card_clicked,
        slot_from,
        first_empty;

    if(el_area.className === 'play-area') {
      el_slot_from_index = Array.from(el_area.children)
                            .indexOf(e.target.parentElement);
      slot_from = _plays[el_slot_from_index];
      card_clicked = slot_from[
                      Array.from(
                        e.target.parentElement.children
                      ).indexOf(e.target)
                    ];
    } else {
      slot_from = _picks;
      card_clicked = slot_from[Array.from(
                      e.target.parentElement.children)
                      .indexOf(e.target)];
    }

    if(card_clicked.val === 1) {
      first_empty = _wins.find(slot => !slot.length);
      first_empty.push(slot_from.pop())
    } else {
      let topCard = {},
          matchingSlot;
      _wins.forEach((slot, i, arr) => {
        if(slot.length) {
          topCard.suit = slot.slice(-1)[0].suit;
          topCard.val = slot.slice(-1)[0].val;
        } else {
          return;
        }

        if(topCard.suit === card_clicked.suit &&
          topCard.val === card_clicked.val - 1) {
          matchingSlot = arr[i];
        } else {
          return;
        }
      });
      
      if(matchingSlot) {
        matchingSlot.push(slot_from.pop());
      }
    }

    if(slot_from === _picks) {
      if(!_picks.length && _behind.length) {
        const morePicks = _behind.length >= 3 ?
                            _behind.splice(-3) :
                            _behind.splice();
        for(let card = morePicks.length; card > 0; card--) {
          _picks.push(morePicks.shift());
        }
      }
    }

    this.setState({
      PickThree: {
        Behind: _behind,
        Picks: _picks
      },
      PlaySlots: _plays,
      WinSlots: _wins
    })
  }

  drag = {
    target: {
      card: {},
      slot: {}
    },
    start: (e) => {
      const el_grabbed = e.target,
            el_grabbed_slot = el_grabbed.parentElement,
            el_area = el_grabbed_slot.parentElement,
            el_grabbed_slot_index = Array.from(el_area.children).indexOf(el_grabbed_slot),
            card_index = Array.from(el_grabbed_slot.children).indexOf(el_grabbed);

      this.drag._behind = [...this.state.PickThree.Behind];
      this.drag._picks = [...this.state.PickThree.Picks];
      this.drag._play = [...this.state.PlaySlots];
      this.drag._win = [...this.state.WinSlots];
      
      switch(el_area.className) {
        case 'win-area':
          this.drag.target.slot.from = this.drag._win[el_grabbed_slot_index];
          break;
        case 'play-area':
          this.drag.target.slot.from = this.drag._play[el_grabbed_slot_index];
          break;
        default:
          this.drag.target.slot.from = this.drag._picks;
          break;
      }
      this.drag.target.card.moving = this.drag.target.slot.from[card_index];
    },
    over: e => e.preventDefault(),
    drop: (e) => {

      let empty_slot = false,
          el_dropped_slot_index;

      if(e.target.className !== 'play-slot') {
        el_dropped_slot_index = Array.from(e.target.parentElement.parentElement.children)
        .indexOf(e.target.parentElement);
      } else {
        el_dropped_slot_index = Array.from(e.target.parentElement.children)
        .indexOf(e.target);
        empty_slot = true;
      }
            
      this.drag.target.slot.to = this.drag._play[el_dropped_slot_index];
      this.drag.target.card.stacking = !empty_slot ? 
                                        this.drag.target.slot.to[this.drag.target.slot.to.length - 1] :
                                        null;
    },
    end: () => {

      const isKing = this.drag.target.card.moving.val === 13;
      let matchColor,
          matchVal;

      if(isKing) {
        matchColor = true;
        matchVal = isKing && this.drag.target.card.stacking === null;
      } else {
        matchColor = (this.drag.target.card.moving.color !== 
                    this.drag.target.card.stacking.color);
        matchVal = (this.drag.target.card.moving.val === 
                  this.drag.target.card.stacking.val - 1);
      }

      if(matchColor && matchVal) {
        const card_index = this.drag.target.slot.from.indexOf(
                            this.drag.target.card.moving
                          ),
              moveCards = this.drag.target.slot.from.splice(card_index);

        for(let card = moveCards.length; card > 0; card--) {
          this.drag.target.slot.to.push(moveCards.shift());
        }
      } else {
        return;
      }

      if(this.drag.target.slot.from === this.drag._picks) {
        if(!this.drag._picks.length && this.drag._behind.length) {

          const morePicks = this.drag._behind.length >= 3 ? 
                              this.drag._behind.splice(-3) : 
                              this.drag._behind.splice(0);

          for(let card = morePicks.length; card > 0; card--) {
            this.drag._picks.push(morePicks.shift());
          }
        }
      }

      this.setState({
        PickThree: {
          Behind: this.drag._behind,
          Picks: this.drag._picks
        },
        PlaySlots: this.drag._play,
        WinSlots: this.drag._win
      })
    }
  }

  render() {
    const state = this.state;

    return (
      <div className = "root">
        <button onClick = {() => this.newGame()}>
          {state.Reserve.length === 52 ? 'Deal' : 'New Game'}
        </button>
        <Table>
          <ReserveDeck 
            hasCards = {state.Reserve.length}
            pick_from = {state.Reserve.length !== 52 ? this.pickThreeHandler : null} />
          <PickThree 
            hasCards = {state.PickThree}
            win = {this.winHandler}
            drag = {this.drag}
             />
          <WinArea 
            hasCards = {state.WinSlots}
            drag = {this.drag}
             />
          <PlayArea
            hasCards = {state.PlaySlots}
            win = {this.winHandler}
            drag = {this.drag}
             />
        </Table>
      </div>
    );
  }
}

export default App;
