import { View, Text, Platform, StatusBar } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';

interface HeaderProps {
  title: string;
}

const HEADER_HEIGHT = 60;

export function Header({ title }: HeaderProps) {
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <View 
      className="px-4 justify-center border-b"
      style={[
        {
          height: Platform.OS === 'android' ? HEADER_HEIGHT + (StatusBar.currentHeight || 0) : HEADER_HEIGHT,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          backgroundColor: theme.background,
          borderBottomColor: theme.border
        }
      ]}
    >
      <Text 
        className="text-xl font-semibold"
        style={{ color: theme.text }}
      >
        {title}
      </Text>
    </View>
  );
}
