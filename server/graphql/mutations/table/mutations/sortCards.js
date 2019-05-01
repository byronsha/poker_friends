const SUITS = ['s', 'd', 'h', 'c'];
const RANKS = ['A', 'K', 'Q', 'J', 'T'];

function sortSuits(a, b) {
  return SUITS.indexOf(a) - SUITS.indexOf(b);
}

function sortRanks(a, b) {
  if (RANKS.includes(a) && !RANKS.includes(b)) return -1;
  if (RANKS.includes(b) && !RANKS.includes(a)) return 1;
  return RANKS.indexOf(a) - RANKS.indexOf(b);
}

module.exports = function sortCards(a, b) {
  let [rankA, suitA] = a.split('')
  let [rankB, suitB] = b.split('')

  if (rankA === rankB) {
    return sortSuits(suitA, suitB)
  }

  if (RANKS.includes(rankA) || RANKS.includes(rankB)) {
    return sortRanks(rankA, rankB)
  }

  return parseInt(rankB) - parseInt(rankA);
}
