const database = require('../../../database')

module.exports = {
  GroupInvite: {
    group: async source => {
      const [group] = await database
        .select('id', 'entity_id', 'name')
        .from('groups')
        .where('id', source.id)

      return group;
    },
    createdAt: source => source.created_at.toJSON(),
  }
}