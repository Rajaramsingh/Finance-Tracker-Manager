import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { TransactionWithCategory } from '../../../lib/types';

export function useRecentTransactions(userId: string, limit: number = 5) {
  return useQuery({
    queryKey: ['recentTransactions', userId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category_user:category_user_id (
            id,
            name,
            icon,
            type
          ),
          category_ai:category_ai_id (
            id,
            name,
            icon,
            type
          )
        `)
        .eq('user_id', userId)
        .order('occurred_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as TransactionWithCategory[];
    },
    enabled: !!userId,
  });
}

