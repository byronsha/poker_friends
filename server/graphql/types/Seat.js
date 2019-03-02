const Seat = `
  type Seat {
    number: Int!
    user: User!
    stackAmount: Int
    isViewer: Boolean
  }
`

module.exports = Seat;