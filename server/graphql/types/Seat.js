const Seat = `
  type Seat {
    number: Int!
    user: User!
    stackAmount: Int
    isViewer: Boolean
    isTurn: Boolean
    isButton: Boolean
  }
`

module.exports = Seat;