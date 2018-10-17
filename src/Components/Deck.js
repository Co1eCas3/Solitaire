const deck = () => {
  const cards = [];

  for(let suit = 0; suit < 4; suit++) {
    let card = {};
    suit === 0 || suit === 1 ? card.color = 'black' : card.color = 'red';

    switch(suit) {
      case 0:
        card.suit = 'S';
        break;
      case 1:
        card.suit = 'C';
        break;
      case 2:
        card.suit = 'D';
        break;
      case 3:
        card.suit = 'H';
        break;
      default:
        break;
    }
    for(let val = 1; val <= 13; val++) {
      card.val = val;

      if(val < 2 || val > 10) {
        switch(val) {
          case 1:
            card.f_val = 'A';
            break;
          case 11:
            card.f_val = 'J';
            break;
          case 12:
            card.f_val = 'Q';
            break;
          case 13:
            card.f_val = 'K';
            break;
          default:
            break;
        }
      } else {
        card.f_val = null;
      }

      card.wasUp = false;
      card.key = card.suit + card.val;

      cards.push({...card});
    }
  }

  return cards;
}



export default deck;