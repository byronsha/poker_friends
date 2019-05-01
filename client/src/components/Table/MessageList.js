import React from 'react';
import { Flex, Box, Text } from 'rebass';

const dateOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric',
};

const formatDate = createdAt =>
  new Date(parseInt(createdAt)).toLocaleDateString('en-US', dateOptions);

export default class MessageList extends React.Component {
  componentDidMount() {
    if (this.lastElement) {
      this.lastElement.scrollIntoView();
    }
  }
  
  componentDidUpdate() {
    this.lastElement.scrollIntoView({ behavior: "smooth" });
  }
  
  render() {
    const { messages } = this.props;

    return (
      <Box px={2} mb={3} style={{
        overflow: 'auto',
        height: 'calc(16vh + 16px)',
        maxHeight: 'calc(16vh + 16px)',
        boxShadow: '#eee 1px 1px 4px inset',
      }}>
        {messages.map((message, idx) => (
          <Box
            mb={1}
            key={idx}
            ref={element => {
              if (element && idx === messages.length - 1) {
                this.lastElement = element;
              }
            }}
          >
            <Flex alignItems="center">
              {message.author && (
                <Text fontSize={1} fontWeight="bold" mr={1}>
                  {message.author.username}
                </Text>
              )}
              <Text
                mt={1}
                color={message.author ? 'lightgray' : 'green'}
                style={{ fontSize: '12px' }}
              >
                {formatDate(message.createdAt)}
              </Text>
            </Flex>
            <Text fontSize={1} color={message.author ? 'black' : 'green'}>
              {message.body}
            </Text>
          </Box>
        ))}
      </Box>
    );
  }
}