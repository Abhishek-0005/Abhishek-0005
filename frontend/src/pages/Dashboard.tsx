import { Card, CardBody, Heading, HStack, Stat, StatHelpText, StatLabel, StatNumber, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}`;
  const { data: monthly } = useQuery<{income:number,expense:number,net:number}>({ queryKey: ['monthly', ym], queryFn: async () => (await api.get('/reports/monthly', { params: { from: ym, to: ym } })).data });
  const from = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;
  const to = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()}`;
  const { data: breakdown } = useQuery<{category:string,total:number}[]>({ queryKey: ['breakdown', from, to], queryFn: async () => (await api.get('/reports/category-breakdown', { params: { from, to } })).data });

  const pieData = (breakdown || []).map((b) => ({ name: b.category, value: b.total }));

  return (
    <VStack align="stretch" spacing={4}>
      <HStack>
        <Card><CardBody><Stat><StatLabel>Income</StatLabel><StatNumber>${'{'}monthly?.income?.toFixed?.(2) || '0.00'{' }'}</StatNumber></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>Expense</StatLabel><StatNumber>${'{'}monthly?.expense?.toFixed?.(2) || '0.00'{' }'}</StatNumber></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>Net</StatLabel><StatNumber>${'{'}monthly?.net?.toFixed?.(2) || '0.00'{' }'}</StatNumber><StatHelpText>Current month</StatHelpText></Stat></CardBody></Card>
      </HStack>
      <Heading size="md">Category Breakdown</Heading>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="value" data={pieData} fill="#8884d8" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </VStack>
  );
}
