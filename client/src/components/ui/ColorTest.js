import * as React from 'react';
import theme from '../../theme';

function ColorTest() {
  return (
    <div style={{ position: 'absolute', left: 300, top: 200 }}>
      {Object.keys(theme.colors).map(colorName =>
        <div key={colorName} style={{
          width: 50,
          height: 50,
          backgroundColor: theme.colors[colorName]
        }} />
      )}
    </div>
  )
}

export default ColorTest;