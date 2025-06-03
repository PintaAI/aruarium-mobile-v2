import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useStreakRefresh() {
  const queryClient = useQueryClient();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['streak'] });
    setRefreshTrigger(prev => prev + 1);
  }, [queryClient]);

  return { refreshTrigger, triggerRefresh };
}