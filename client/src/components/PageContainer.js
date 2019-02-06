import * as React from 'react';
import { Box } from 'rebass';

const PageContainer = ({ children }) => (
  <Box m={4} borderRadius={2} style={{
    width: 'calc(100vw - 304px)',
    marginLeft: '280px',
    marginRight: '24px',
    position: 'absolute',
    height: 'calc(100vh - 152px)',
  }}>   
    {children}
  </Box>
)

export default PageContainer;