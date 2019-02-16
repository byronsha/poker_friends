const Message = `
  type Message {
    entityId: String!
    body: String!
    table: Table!
    author: User!
    createdAt: String!
  }
`;

module.exports = Message;