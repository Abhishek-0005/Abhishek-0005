import { Button, FormControl, FormLabel, HStack, Input, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function Reports() {
  const now = new Date();
  const [from, to] = [
    `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`,
    `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()}`,
  ];
  const { data: breakdown } = useQuery<{category:string,total:number}[]>({ queryKey: ['breakdown', from, to], queryFn: async () => (await api.get('/reports/category-breakdown', { params: { from, to } })).data });

  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const { data: monthly } = useQuery<{income:number,expense:number,net:number}>({ queryKey: ['monthly', ym], queryFn: async () => (await api.get('/reports/monthly', { params: { from: ym, to: ym } })).data });

  return (
    <VStack align="stretch" spacing={4}>
      <HStack>
        <FormControl>
          <FormLabel>From</FormLabel>
          <Input type="month" defaultValue={ym} />
        </FormControl>
        <FormControl>
          <FormLabel>To</FormLabel>
          <Input type="month" defaultValue={ym} />
        </FormControl>
      </HStack>

      <HStack>
        <Button onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/export/transactions.csv`, '_blank')}>Export All CSV</Button>
      </HStack>

      <Table size="sm">
        <Thead>
          <Tr><Th>Category</Th><Th isNumeric>Total</Th></Tr>
        </Thead>
        <Tbody>
          {breakdown?.map((b) => (
            <Tr key={b.category}><Td>{b.category}</Td><Td isNumeric>{b.total.toFixed(2)}</Td></Tr>
          ))}
        </Tbody>
      </Table>

      <Table size="sm">
        <Thead>
          <Tr><Th>Metric</Th><Th isNumeric>Amount</Th></Tr>
        </Thead>
        <Tbody>
          <Tr><Td>Income</Td><Td isNumeric>{monthly?.income.toFixed(2)}</Td></Tr>
          <Tr><Td>Expense</Td><Td isNumeric>{monthly?.expense.toFixed(2)}</Td></Tr>
          <Tr><Td>Net</Td><Td isNumeric>{monthly?.net.toFixed(2)}</Td></Tr>
        </Tbody>
      </Table>
    </VStack>
  );
}
