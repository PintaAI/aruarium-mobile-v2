import React from 'react';
import { View, Text } from 'react-native';

// Define types for the component props
export interface PlayerProps {
  position: [number, number];
  rotation: number;
  color: string;
}

/**
 * Player component to render the player entity in the Z-Type game
 */
export const Player = (props: PlayerProps) => {
  const { position, rotation, color } = props;
  
  return (
    <View 
      className="absolute justify-center items-center"
      style={{
        left: position[0],
        top: position[1],
        transform: [{ rotate: `${rotation}deg` }]
      }}
    >
      <Text style={{ color, fontSize: 24, fontWeight: 'bold' }}>⧋</Text>
    </View>
  );
};

export default Player;
