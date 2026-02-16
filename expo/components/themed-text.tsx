import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'displayMedium' | 'headlineMedium' | 'titleMedium' | 'bodyLarge' | 'labelLarge';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'displayMedium' ? styles.displayMedium : undefined,
        type === 'headlineMedium' ? styles.headlineMedium : undefined,
        type === 'titleMedium' ? styles.titleMedium : undefined,
        type === 'bodyLarge' ? styles.bodyLarge : undefined,
        type === 'labelLarge' ? styles.labelLarge : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24, // bodyLarge
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  displayMedium: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400',
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '500',
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
