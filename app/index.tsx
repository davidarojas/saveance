import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';

export default function IndexRedirect() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (rootNavigationState?.key) {
      router.replace('/auth/welcome' as any);
    }
  }, [rootNavigationState, router]);

  return null;
}
