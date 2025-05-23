import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      ...props
    },
    ref
  ) => {
    return (
      <View className={cn('mb-4', containerClassName)}>
        {label && (
          <Text className={cn('text-sm font-medium text-foreground mb-1.5', labelClassName)}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            'h-10 px-3 py-2 text-base border border-input rounded-md bg-background text-foreground',
            'focus:border-primary',
            error && 'border-destructive',
            inputClassName
          )}
          placeholderTextColor="#9ca3af" // gray-400
          {...props}
        />
        {error && (
          <Text className={cn('text-sm text-destructive mt-1', errorClassName)}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
