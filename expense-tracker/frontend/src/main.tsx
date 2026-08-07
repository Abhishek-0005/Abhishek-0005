import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import './styles.css';

function Layout() {
  return (
    <div className="container">
      <nav className="nav">
        <h1>Expense Tracker</h1>
        <div>
          <Link to="/">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/categories">Categories</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>,
);
