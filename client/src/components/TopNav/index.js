import React from 'react';
import { css } from 'emotion'; 
import { Box } from 'rebass';

class TopNav extends React.Component {
  render() {
    return (
      <Box className={css`
        position: relative;
        height: 64px;
        padding: 0;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        z-index: 1;
      `}>
      </Box>
    )
  }
}

export default TopNav;