import { Button, FormControl, FormLabel, HStack, Input, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useState } from 'react';

type Category = { id: number; name: string; description?: string | null };

export default function Categories() {
  const qc = useQueryClient();
  const { data } = useQuery<Category[]>({ queryKey: ['categories'], queryFn: async () => (await api.get('/categories')).data });

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const create = useMutation({
    mutationFn: async () => (await api.post('/categories', { name, description: desc || null })).data,
    onSuccess: () => {
      setName('');
      setDesc('');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const update = useMutation({
    mutationFn: async (c: Category) => (await api.patch(`/categories/${c.id}`, { name: c.name, description: c.description || null })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  const del = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/categories/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  return (
    <VStack align="stretch" spacing={4}>
      <HStack>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input value={desc} onChange={(e) => setDesc(e.target.value)} />
        </FormControl>
        <Button onClick={() => create.mutate()} isDisabled={!name}>Add</Button>
      </HStack>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((c) => (
            <Tr key={c.id}>
              <Td>
                <Input value={c.name} onChange={(e) => update.mutate({ ...c, name: e.target.value })} />
              </Td>
              <Td>
                <Input value={c.description || ''} onChange={(e) => update.mutate({ ...c, description: e.target.value })} />
              </Td>
              <Td>
                <Button colorScheme="red" size="sm" onClick={() => del.mutate(c.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}
