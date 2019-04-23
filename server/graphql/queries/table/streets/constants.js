module.exports = {
  BOARD_SIZE: {
    'deal': 0,
    'preflop': 0,
    'flop': 3,
    'turn': 4,
    'river': 5,
  },
  PREVIOUS_STREET: {
    'preflop': 'deal',
    'flop': 'preflop',
    'turn': 'flop',
    'river': 'turn',
  },
  NEXT_STREET: {
    'deal': 'preflop',
    'preflop': 'flop',
    'flop': 'turn',
    'turn': 'river',
    'river': 'river',
  },
}