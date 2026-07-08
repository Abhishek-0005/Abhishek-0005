import { Button, FormControl, FormLabel, HStack, Input, NumberInput, NumberInputField, Select, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useMemo, useState } from 'react';

type Category = { id: number; name: string };

type Transaction = {
  id: number;
  date: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
  categoryId?: number | null;
  category?: Category | null;
};

export default function Transactions() {
  const qc = useQueryClient();
  const { data: categories } = useQuery<Category[]>({ queryKey: ['categories'], queryFn: async () => (await api.get('/categories')).data });
  const [filters, setFilters] = useState<{ from?: string; to?: string; type?: string; categoryId?: string; q?: string }>({});
  const queryKey = useMemo(() => ['transactions', filters], [filters]);
  const { data: transactions } = useQuery<Transaction[]>({ queryKey, queryFn: async () => (await api.get('/transactions', { params: filters })).data });

  const [form, setForm] = useState<Partial<Transaction>>({ type: 'EXPENSE', amount: 0, date: new Date().toISOString().slice(0,10) });

  const create = useMutation({
    mutationFn: async () => (await api.post('/transactions', {
      date: form.date,
      amount: Number(form.amount),
      type: form.type,
      description: form.description || null,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    })).data,
    onSuccess: () => {
      setForm({ type: 'EXPENSE', amount: 0, date: new Date().toISOString().slice(0,10) });
      qc.invalidateQueries({ queryKey });
    },
  });

  const update = useMutation({
    mutationFn: async (t: Transaction) => (await api.patch(`/transactions/${t.id}`, {
      date: t.date,
      amount: t.amount,
      type: t.type,
      description: t.description || null,
      categoryId: t.categoryId ?? null,
    })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const del = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/transactions/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return (
    <VStack align="stretch" spacing={4}>
      <HStack>
        <FormControl>
          <FormLabel>From</FormLabel>
          <Input type="date" value={filters.from || ''} onChange={(e) => setFilters({ ...filters, from: e.target.value || undefined })} />
        </FormControl>
        <FormControl>
          <FormLabel>To</FormLabel>
          <Input type="date" value={filters.to || ''} onChange={(e) => setFilters({ ...filters, to: e.target.value || undefined })} />
        </FormControl>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select value={filters.type || ''} onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}>
            <option value="">All</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select value={filters.categoryId || ''} onChange={(e) => setFilters({ ...filters, categoryId: e.target.value || undefined })}>
            <option value="">All</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Search</FormLabel>
          <Input value={filters.q || ''} onChange={(e) => setFilters({ ...filters, q: e.target.value || undefined })} />
        </FormControl>
        <Button onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/export/transactions.csv?` + new URLSearchParams(filters as any).toString(), '_blank')}>Export CSV</Button>
      </HStack>

      <HStack>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input type="date" value={form.date as any} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </FormControl>
        <FormControl>
          <FormLabel>Amount</FormLabel>
          <NumberInput precision={2} value={Number(form.amount)} onChange={(_, v) => setForm({ ...form, amount: v })}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select value={form.categoryId as any || ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value ? Number(e.target.value) : undefined })}>
            <option value="">Uncategorized</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </FormControl>
        <Button onClick={() => create.mutate()} isDisabled={!form.date || !form.type}>Add</Button>
      </HStack>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Type</Th>
            <Th>Category</Th>
            <Th>Description</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions?.map((t) => (
            <Tr key={t.id}>
              <Td><Input type="date" value={t.date.slice(0,10)} onChange={(e) => update.mutate({ ...t, date: e.target.value })} /></Td>
              <Td><NumberInput precision={2} value={Number(t.amount)} onChange={(_, v) => update.mutate({ ...t, amount: v })}><NumberInputField /></NumberInput></Td>
              <Td>
                <Select value={t.type} onChange={(e) => update.mutate({ ...t, type: e.target.value as any })}>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </Select>
              </Td>
              <Td>
                <Select value={t.categoryId || ''} onChange={(e) => update.mutate({ ...t, categoryId: e.target.value ? Number(e.target.value) : null })}>
                  <option value="">Uncategorized</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Td>
              <Td><Input value={t.description || ''} onChange={(e) => update.mutate({ ...t, description: e.target.value })} /></Td>
              <Td><Button colorScheme="red" size="sm" onClick={() => del.mutate(t.id)}>Delete</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}
