import React from 'react';

export const commonStyles: Record<string, React.CSSProperties> = {
  sceneContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    cursor: 'pointer',
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'filter 0.1s ease',
  },
};
