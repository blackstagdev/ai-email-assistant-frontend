import { useEffect, useState } from 'react';
import { analyticsAPI } from '../lib/api';
import {
  TrendingUp,
  Users,
  Mail,
  DollarSign,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.dashboard(timeRange);
      setMetrics(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Business overview and analytics</p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === range ? 'bg-primary-600 text-white' : 'bg-white border'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-3xl font-bold mt-2">{metrics.overview?.totalContacts?.toLocaleString() || 0}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(metrics.revenue?.total || 0)}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Interactions</p>
              <p className="text-3xl font-bold mt-2">{metrics.overview?.totalInteractions?.toLocaleString() || 0}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-3xl font-bold mt-2">{metrics.support?.openTickets || 0}</p>
            </div>
            <Mail className="w-12 h-12 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Interactions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.trends?.interactionsByDay || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), 'MMM d')} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.trends?.revenueByDay || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), 'MMM d')} />
              <YAxis />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Bar dataKey="amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
