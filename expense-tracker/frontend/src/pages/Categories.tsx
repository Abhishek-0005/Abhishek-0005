import { FormEvent, useEffect, useState } from 'react';
import api from '../lib/api';

type Category = { id: number; name: string };

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get<Category[]>('/categories')
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/categories', { name });
    setName('');
    load();
  };

  const onDelete = async (id: number) => {
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <h2>Categories</h2>

      <form onSubmit={onCreate} className="row">
        <input className="input" placeholder="New category" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn" type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>
                    <button className="btn" onClick={() => onDelete(c.id)}>Delete</button>
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
