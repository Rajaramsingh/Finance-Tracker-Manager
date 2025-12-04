import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../../../context/AuthContext';
import { TransactionWithCategory } from '../../../lib/types';
import { Card } from '../../../components/Card';

interface CategoryGroup {
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string;
  transactions: TransactionWithCategory[];
  totalAmount: number;
}

export function TransactionsListScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { data: transactions, isLoading, error, refetch } = useTransactions(user?.id || '');

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Group transactions by category
  const categoryGroups = useMemo(() => {
    if (!transactions) return [];

    const groups = new Map<string | null, CategoryGroup>();

    transactions.forEach((transaction) => {
      // Use category_user_id if available, otherwise use category_ai_id
      const categoryId = transaction.category_user_id || transaction.category_ai_id || null;
      
      // Get category from the appropriate source
      const category = transaction.category_user || transaction.category_ai || transaction.category || null;
      
      const categoryName = category?.name || 'Uncategorized';
      const categoryIcon = category?.icon || '📦';
      const key = categoryId || 'uncategorized';

      if (!groups.has(key)) {
        groups.set(key, {
          categoryId,
          categoryName,
          categoryIcon,
          transactions: [],
          totalAmount: 0,
        });
      }

      const group = groups.get(key)!;
      group.transactions.push(transaction);
      group.totalAmount += Number(transaction.amount);
    });

    // Sort groups by total amount (descending)
    return Array.from(groups.values()).sort((a, b) => Math.abs(b.totalAmount) - Math.abs(a.totalAmount));
  }, [transactions]);

  const toggleCategory = (categoryId: string | null) => {
    const key = categoryId || 'uncategorized';
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCategories(newExpanded);
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'income' ? '+' : '-';
    const color = type === 'income' ? '#34C759' : '#FF3B30';
    return { text: `${sign}₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-red-500 text-base mb-3">Error loading transactions</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text className="text-blue-500 text-sm font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg font-semibold text-gray-800 mb-2">No transactions found</Text>
        <Text className="text-sm text-gray-600">Upload a bank statement to get started</Text>
      </View>
    );
  }

  const renderTransaction = (transaction: TransactionWithCategory) => {
    const amount = formatAmount(Number(transaction.amount), transaction.type);
    const merchant = transaction.merchant || transaction.raw_description || 'Transaction';
    const narration = transaction.raw_description || merchant;

    return (
      <View key={transaction.id} className="py-2 border-b border-gray-100 last:border-b-0">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-sm text-gray-800 mb-1" numberOfLines={3}>
              {narration}
            </Text>
            <Text className="text-xs text-gray-500">{formatDateShort(transaction.occurred_at)}</Text>
          </View>
          <View className="items-end ml-3">
            <Text className="text-sm font-semibold" style={{ color: amount.color }}>
              {amount.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCategoryGroup = (group: CategoryGroup) => {
    const key = group.categoryId || 'uncategorized';
    const isExpanded = expandedCategories.has(key);
    const groupTotal = formatAmount(Math.abs(group.totalAmount), group.totalAmount >= 0 ? 'income' : 'expense');
    const transactionCount = group.transactions.length;

    return (
      <Card key={key} className="mb-3">
        <TouchableOpacity
          onPress={() => toggleCategory(group.categoryId)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center flex-1">
              <View className="mr-3 w-6 h-6 items-center justify-center">
                <Text className="text-blue-500 text-sm">
                  {isExpanded ? '▼' : '▶'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  {group.categoryName}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-sm font-semibold" style={{ color: groupTotal.color }}>
                {groupTotal.text}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View className="mt-2 pt-2 border-t border-gray-200">
            {group.transactions
              .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
              .map(renderTransaction)}
          </View>
        )}
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {categoryGroups.map(renderCategoryGroup)}
      </ScrollView>
    </View>
  );
}
