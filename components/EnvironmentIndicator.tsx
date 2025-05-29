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
          backgroundColor: '#10B981', // Green
          text: 'DEV',
        };
      case 'preview':
        return {
          backgroundColor: '#F59E0B', // Orange/Yellow
          text: 'PREVIEW',
        };
      default:
        return {
          backgroundColor: '#6B7280', // Gray
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
    top: 50, // Adjust based on your status bar height
    right: 10,
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
