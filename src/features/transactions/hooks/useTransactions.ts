import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Transaction, TransactionWithCategory } from '../../../lib/types';

export function useTransactions(userId: string, filters?: { startDate?: string; endDate?: string; categoryId?: string }) {
  return useQuery({
    queryKey: ['transactions', userId, filters],
    queryFn: async () => {
      let query = supabase
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
        .order('occurred_at', { ascending: false });

      if (filters?.startDate) {
        query = query.gte('occurred_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('occurred_at', filters.endDate);
      }
      if (filters?.categoryId) {
        query = query.eq('category_user_id', filters.categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TransactionWithCategory[];
    },
  });
}
