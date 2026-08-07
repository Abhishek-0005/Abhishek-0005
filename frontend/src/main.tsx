import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Reports from './pages/Reports';

const client = new QueryClient();

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Container maxW="container.lg" py={6}>
            <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Link to="/">Dashboard</Link>
              <Link to="/transactions">Transactions</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/reports">Reports</Link>
            </nav>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
