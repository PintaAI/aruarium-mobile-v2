import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { config } from '../lib/config';

/**
 * Environment indicator component that shows a visual tag for dev/preview builds
 * Shows nothing in production builds
 */
export const EnvironmentIndicator: React.FC = () => {
  // Don't show anything in production
  if (config.environment === 'production') {
    return null;
  }

  const getIndicatorStyle = () => {
    switch (config.environment) {
      case 'development':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.8)', // Green with transparency
          text: 'DEV',
        };
      case 'preview':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.8)', // Orange/Yellow with transparency
          text: 'PREVIEW',
        };
      default:
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.8)', // Gray with transparency
          text: config.environment.toUpperCase(),
        };
    }
  };

  const indicator = getIndicatorStyle();

  return (
    <View style={[styles.container, { backgroundColor: indicator.backgroundColor }]}>
      <Text style={styles.text}>{indicator.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40, // Adjust based on your status bar height
    right: 30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EnvironmentIndicator;
