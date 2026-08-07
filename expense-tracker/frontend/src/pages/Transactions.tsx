import { FormEvent, useEffect, useState } from 'react';
import api from '../lib/api';

type Category = { id: number; name: string };

type Transaction = {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  note?: string;
  categoryId: number;
  category: Category;
};

export default function Transactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({ startDate: '', endDate: '', categoryId: '', type: '' });

  const [form, setForm] = useState({ amount: '', type: 'EXPENSE', date: new Date().toISOString().substring(0, 10), note: '', categoryId: '' });

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
    api
      .get<Transaction[]>(`/transactions?${params.toString()}`)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get<Category[]>('/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate, filters.categoryId, filters.type]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      amount: Number(form.amount),
      type: form.type as 'INCOME' | 'EXPENSE',
      date: new Date(form.date).toISOString(),
      note: form.note || undefined,
      categoryId: Number(form.categoryId),
    };
    await api.post('/transactions', payload);
    setForm({ amount: '', type: 'EXPENSE', date: new Date().toISOString().substring(0, 10), note: '', categoryId: '' });
    load();
  };

  const onDelete = async (id: number) => {
    await api.delete(`/transactions/${id}`);
    load();
  };

  const onExport = async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/export/transactions.csv?${params.toString()}`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <h2>Transactions</h2>

      <div className="card">
        <div className="row">
          <input className="input" type="date" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
          <input className="input" type="date" value={filters.endDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
          <select className="input" value={filters.categoryId} onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select className="input" value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <button className="btn" onClick={onExport}>Export CSV</button>
        </div>
      </div>

      <form onSubmit={onCreate} className="card">
        <div className="row">
          <input className="input" placeholder="Amount" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
          <select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <input className="input" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          <select className="input" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input className="input" placeholder="Note" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
          <button className="btn" type="submit">Add</button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.type}</td>
                  <td>{Number(t.amount).toFixed(2)}</td>
                  <td>{t.category?.name}</td>
                  <td>{t.note}</td>
                  <td>
                    <button className="btn" onClick={() => onDelete(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
