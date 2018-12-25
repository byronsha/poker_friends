const database = require('../../../database')

module.exports = {
  Mutation: {
    addPlayer: async (_, { groupEntityId, userEntityId, bankroll }, { user }) => {
      const [group] = await database('groups')
        .where('creator_id', user.id)
        .where('entity_id', groupEntityId);
      
      if (!group) {
        return { errors: ['Group not found'] }
      }

      const [foundUser] = await database('users')
        .where('entity_id', userEntityId)

      if (!foundUser) {
        return { errors: ['User not found'] }
      }

      const newPlayer = await database('players')
        .insert({
          group_id: group.id,
          user_id: foundUser.id,
          bankroll,
        })
      
      console.log('NEW P', newPlayer)

      return group;
    }
  }
}