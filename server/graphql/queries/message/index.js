const database = require('../../../database')

module.exports = {
  Message: {
    entityId: message => message.entity_id,
    body: message => message.body,
    createdAt: message => message.created_at,
    table: async message => {
      const [table] = await database
        .select()
        .from('tables')
        .where('id', message.table_id);

      return table;
    },
    author: async message => {
      const [author] = await database
        .select()
        .from('users')
        .where('id', message.user_id);

      return author;
    },
  }
}