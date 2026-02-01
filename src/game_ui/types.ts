import React from 'react';

export interface SceneProps {
  onComplete: () => void;
}

export type SceneComponent = React.FC<SceneProps>;

export interface Chapter {
  title: string;
  scenes: SceneComponent[];
}
