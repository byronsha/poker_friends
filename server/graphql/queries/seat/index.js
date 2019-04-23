const database = require('../../../database')

module.exports = {
  Seat: {
    number: source => source.seat,
    stackAmount: source => source.stackAmount,
    user: async source => {
      const [user] = await database('users')
        .where('id', source.userId);

      return user;
    },
    isViewer: (source, _, { user }) => source.userId === user.id,
    isTurn: source => source.isTurn,
    isButton: source => source.isButton,
  }
} 