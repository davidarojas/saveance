import { useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme as _useColorScheme } from 'react-native';

// This hook will always return a non-null color scheme (defaulting to 'light' if null)
export function useColorScheme(): NonNullable<ColorSchemeName> {
  const colorScheme = _useColorScheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return 'light'; // Default to light theme until the component mounts
  }

  return colorScheme || 'light';
}
