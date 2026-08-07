import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

type Monthly = {
  month: number;
  income: number;
  expense: number;
  net: number;
  categories: { id: number; name: string; expense: number }[];
};

export default function Dashboard() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<Monthly[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<Monthly[]>(`/reports/monthly?year=${year}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [year]);

  const lineData = useMemo(() => {
    const labels = Array.from({ length: 12 }, (_, i) => `M${i + 1}`);
    return {
      labels,
      datasets: [
        { label: 'Income', data: data.map((d) => d.income), borderColor: '#16a34a', backgroundColor: '#16a34a' },
        { label: 'Expense', data: data.map((d) => d.expense), borderColor: '#dc2626', backgroundColor: '#dc2626' },
        { label: 'Net', data: data.map((d) => d.net), borderColor: '#2563eb', backgroundColor: '#2563eb' },
      ],
    };
  }, [data]);

  const latestMonth = data.find((d) => d.month === new Date().getMonth() + 1) || data[0];
  const pieData = useMemo(() => {
    const labels = latestMonth?.categories.map((c) => c.name) || [];
    const values = latestMonth?.categories.map((c) => c.expense) || [];
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#f59e0b'],
        },
      ],
    };
  }, [latestMonth]);

  return (
    <div>
      <div className="row">
        <h2>Dashboard</h2>
        <div>
          <label>Year: </label>
          <input
            className="input"
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={{ width: 100 }}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="card">
            <Line data={lineData} />
          </div>
          <div className="card">
            <h3>Current Month Expense by Category</h3>
            {pieData.labels.length ? <Pie data={pieData} /> : <p>No data</p>}
          </div>
        </>
      )}
    </div>
  );
}
