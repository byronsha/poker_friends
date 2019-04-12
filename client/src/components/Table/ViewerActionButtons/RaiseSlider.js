import * as React from 'react';
import { Slider, InputNumber } from 'antd';
import { Box, Flex } from 'rebass';

class RaiseSlider extends React.Component {
  render() {
    const { min, max, amount, onChange } = this.props;

    return (
      <Flex mt={3} alignItems="center">
        <Box width="100%">
          <Slider
            min={min}
            max={max}
            onChange={onChange}
            value={amount}
          />
        </Box>
        <Box ml={3}>
          <InputNumber
            min={min}
            max={max}
            value={amount}
            onChange={onChange}
          />
        </Box>
      </Flex>
    )
  }
}

export default RaiseSlider;