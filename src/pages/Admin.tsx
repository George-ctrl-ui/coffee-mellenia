import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Shield,
  Key,
  RefreshCw,
  AlertCircle,
  Coffee,
  Sparkles,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Radio,
  Zap,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Order, OrderStatus } from '../types';
import { api, ApiError } from '../services/api';

const DEFAULT_ADMIN_TOKEN = 'mellenia_admin_key_2026';

const STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready for Pickup',
  'Completed',
  'Cancelled',
];

const CATEGORY_COLORS: Record<string, string> = {
  Espresso: '#F47A28',
  Specialties: '#FFA05A',
  'Cold Brew': '#E28743',
  Bakery: '#D95E14',
  Other: '#A39082',
};

const CHART_PALETTE = ['#F47A28', '#FFA05A', '#E28743', '#D95E14', '#C84E0C', '#8D5B4C', '#E5B288'];

// Custom Tooltip for Daily Sales Area/Bar Charts
const CustomSalesTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#17100B]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#F47A28]/50 shadow-2xl text-xs space-y-1.5 min-w-[180px]">
        <div className="flex items-center justify-between border-b border-[#3E2818] pb-1.5 font-bold text-[#FFFDF8]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F47A28]" />
            {label}
          </span>
          <span className="text-[10px] text-[#A39082] uppercase">{data.dayName}</span>
        </div>
        <div className="flex justify-between items-center text-[#FFE4C6]">
          <span className="text-[#A39082]">Revenue:</span>
          <span className="font-mono font-extrabold text-[#FFA05A] text-sm">
            ₱{Number(data.revenue).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-[#FFE4C6]">
          <span className="text-[#A39082]">Orders Volume:</span>
          <span className="font-mono font-bold text-[#FFFDF8]">
            {data.ordersCount} {data.ordersCount === 1 ? 'order' : 'orders'}
          </span>
        </div>
        <div className="flex justify-between items-center text-[#FFE4C6]">
          <span className="text-[#A39082]">Items Dispensed:</span>
          <span className="font-mono text-[#A39082]">{data.totalItems} items</span>
        </div>
        <div className="flex justify-between items-center text-[#FFE4C6] pt-1 border-t border-[#3E2818]/60 text-[11px]">
          <span className="text-[#A39082]">Avg. Ticket:</span>
          <span className="font-mono text-[#FFFDF8]">
            ₱{data.ordersCount > 0 ? Math.round(data.revenue / data.ordersCount) : 0}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Product Trends
const CustomProductTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#17100B]/95 backdrop-blur-md p-3 rounded-xl border border-[#FFA05A]/40 shadow-2xl text-xs space-y-1 min-w-[160px]">
        <div className="font-bold text-[#FFFDF8] flex items-center gap-1.5">
          <Coffee className="w-3.5 h-3.5 text-[#F47A28]" />
          <span>{data.name}</span>
        </div>
        <div className="flex justify-between text-[#FFE4C6]">
          <span className="text-[#A39082]">Units Sold:</span>
          <span className="font-mono font-bold text-[#FFA05A]">{data.quantity} cups</span>
        </div>
        <div className="flex justify-between text-[#FFE4C6]">
          <span className="text-[#A39082]">Gross Sales:</span>
          <span className="font-mono font-extrabold text-[#FFFDF8]">₱{Number(data.revenue).toLocaleString()}</span>
        </div>
        <div className="text-[10px] text-[#A39082] pt-1 border-t border-[#3E2818]/50">
          Rank #{data.rank} · {data.percentage}% of total sales
        </div>
      </div>
    );
  }
  return null;
};

export const Admin: React.FC = () => {
  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem('cm_admin_token') || DEFAULT_ADMIN_TOKEN;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState(token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Real-time synchronization states
  const [isLiveSync, setIsLiveSync] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isSimulating, setIsSimulating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Dashboard filtering & display controls
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | 'all'>('7d');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'volume'>('revenue');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'visualizations' | 'orders'>('visualizations');

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrders = async (authToken: string, isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminOrders(authToken);
      setOrders(data);
      setIsAuthenticated(true);
      setLastSyncTime(new Date());
      localStorage.setItem('cm_admin_token', authToken);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Authentication or connection failed.');
      }
      setIsAuthenticated(false);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(token);
    }
  }, []);

  // Real-time polling mechanism (5 seconds interval when Live Sync is enabled)
  useEffect(() => {
    if (!isAuthenticated || !isLiveSync || !token) {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      return;
    }

    pollTimerRef.current = setInterval(() => {
      fetchOrders(token, true);
    }, 5000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isAuthenticated, isLiveSync, token]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setToken(tokenInput);
    fetchOrders(tokenInput);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setNotification(`Order ${updated.reference} updated to ${newStatus}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSimulateOrder = async () => {
    setIsSimulating(true);
    try {
      const newOrder = await api.simulateAdminOrder(token);
      setOrders((prev) => [newOrder, ...prev]);
      setLastSyncTime(new Date());
      setNotification(`⚡ Real-Time Ingest: New order ${newOrder.reference} (₱${newOrder.total}) received!`);
      setTimeout(() => setNotification(null), 4500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  // --- ANALYTICS & RECHARTS DATA PREPARATION ---
  const analyticsData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        dailySales: [],
        topProducts: [],
        categoryShare: [],
        kpi: {
          totalRevenue: 0,
          totalOrders: 0,
          todayRevenue: 0,
          todayOrders: 0,
          avgOrderValue: 0,
          pendingOrders: 0,
        },
      };
    }

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    let cutoffDays = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;

    // Filter orders by cutoff date
    const cutoffTime = now.getTime() - cutoffDays * 86400000;

    // 1. Group daily sales
    const dayMap = new Map<
      string,
      { date: string; dayName: string; revenue: number; ordersCount: number; totalItems: number }
    >();

    // Seed continuous date range so chart doesn't have missing dates
    for (let i = cutoffDays - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const displayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dayMap.set(key, {
        date: displayLabel,
        dayName,
        revenue: 0,
        ordersCount: 0,
        totalItems: 0,
      });
    }

    let totalRevenue = 0;
    let todayRevenue = 0;
    let todayOrders = 0;
    let pendingOrders = 0;

    // Product frequency aggregation
    const productMap = new Map<string, { name: string; quantity: number; revenue: number; category?: string }>();
    const categoryMap = new Map<string, number>();

    orders.forEach((o) => {
      const oDateKey = o.createdAt.slice(0, 10);
      const isToday = oDateKey === todayStr;

      if (o.status !== 'Cancelled') {
        totalRevenue += o.total;
        if (isToday) {
          todayRevenue += o.total;
          todayOrders++;
        }
      }

      if (o.status === 'Pending' || o.status === 'Preparing') {
        pendingOrders++;
      }

      // Add to daily sales if in time range
      if (dayMap.has(oDateKey) && o.status !== 'Cancelled') {
        const entry = dayMap.get(oDateKey)!;
        entry.revenue += o.total;
        entry.ordersCount += 1;
        const itemCount = o.items.reduce((acc, it) => acc + it.quantity, 0);
        entry.totalItems += itemCount;
      }

      // Aggregate products in time range
      if (new Date(o.createdAt).getTime() >= cutoffTime && o.status !== 'Cancelled') {
        o.items.forEach((item) => {
          const existing = productMap.get(item.productName) || {
            name: item.productName,
            quantity: 0,
            revenue: 0,
          };
          existing.quantity += item.quantity;
          existing.revenue += item.subtotal;
          productMap.set(item.productName, existing);

          // Infer or default category
          let cat = 'Specialties';
          const nameLower = item.productName.toLowerCase();
          if (nameLower.includes('espresso') || nameLower.includes('americano') || nameLower.includes('cappuccino')) {
            cat = 'Espresso';
          } else if (nameLower.includes('cold brew') || nameLower.includes('iced')) {
            cat = 'Cold Brew';
          } else if (nameLower.includes('croissant') || nameLower.includes('chocolat') || nameLower.includes('brownie')) {
            cat = 'Bakery';
          }
          categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.subtotal);
        });
      }
    });

    const dailySales = Array.from(dayMap.values());

    // Top Products ranking
    const totalProductRevenue = Array.from(productMap.values()).reduce((sum, p) => sum + p.revenue, 0) || 1;
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 7)
      .map((p, idx) => ({
        ...p,
        rank: idx + 1,
        percentage: ((p.revenue / totalProductRevenue) * 100).toFixed(1),
      }));

    // Category breakdown
    const categoryShare = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#A39082',
    }));

    const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

    return {
      dailySales,
      topProducts,
      categoryShare,
      kpi: {
        totalRevenue,
        totalOrders: orders.length,
        todayRevenue,
        todayOrders,
        avgOrderValue,
        pendingOrders,
      },
    };
  }, [orders, timeRange]);

  const filteredOrderList = useMemo(() => {
    if (statusFilter === 'All') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-transparent text-[#F7EFE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#3E2818]/80 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#2A160A] text-[#F47A28] border border-[#F47A28]/40 shadow-md">
                <Shield className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFFDF8] tracking-tight">
                  Admin Real-Time Hub & Analytics
                </h1>
                <p className="text-xs text-[#A39082] mt-0.5">
                  Live Operations, Daily Sales Visualizations & Popular Product Trends · Purok 3, Talibon, Bohol
                </p>
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Real-time Live indicator */}
              <button
                onClick={() => setIsLiveSync(!isLiveSync)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isLiveSync
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-[#1C120B] border-[#3E2818] text-[#A39082]'
                }`}
                title="Toggle Real-Time Polling"
              >
                <span className={`w-2 h-2 rounded-full ${isLiveSync ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
                <Radio className="w-3.5 h-3.5" />
                <span>{isLiveSync ? 'Live Sync Active' : 'Live Sync Paused'}</span>
              </button>

              {/* Ingest Live Simulated Order Button */}
              <button
                onClick={handleSimulateOrder}
                disabled={isSimulating}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer active:scale-95 rgb-frame disabled:opacity-50"
                title="Simulate a customer order arriving in real-time"
              >
                <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce' : ''}`} />
                <span>{isSimulating ? 'Injecting Order...' : 'Simulate Live Order'}</span>
              </button>

              {/* Manual Refresh */}
              <button
                onClick={() => fetchOrders(token)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C120B] hover:bg-[#2A1A10] text-[#FFE4C6] border border-[#3E2818] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                title="Refresh from server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          )}
        </div>

        {/* Real-time Notification Banner */}
        {notification && (
          <div className="p-3 bg-gradient-to-r from-[#D95E14]/20 via-[#F47A28]/25 to-[#D95E14]/20 border border-[#F47A28]/60 rounded-xl text-xs text-[#FFFDF8] flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFA05A] shrink-0" />
              <span className="font-semibold">{notification}</span>
            </div>
            <span className="text-[10px] text-[#FFA05A] font-mono">Live Ingest</span>
          </div>
        )}

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto my-12 bg-[#17100B]/90 backdrop-blur-md p-8 rounded-2xl border border-[#3E2818] shadow-2xl rgb-frame rgb-glow space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#2A160A] text-[#F47A28] border border-[#F47A28]/30 mx-auto flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-[#FFFDF8]">Staff Authentication</h2>
              <p className="text-xs text-[#A39082] mt-1">
                Enter your administrative key to unlock live café operations and Recharts telemetry.
              </p>
              <p className="text-[11px] text-[#F47A28] mt-2 font-mono bg-[#120B07] py-1 px-2 rounded-lg border border-[#3E2818]">
                Default Key: mellenia_admin_key_2026
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#FFE4C6] uppercase tracking-wider mb-1">
                  Admin Bearer Key
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#3E2818] rounded-xl text-xs font-mono text-[#FFFDF8] focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white text-xs font-semibold rounded-xl shadow-lg transition-colors cursor-pointer rgb-frame"
              >
                {loading ? 'Authenticating...' : 'Access Live Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-8">
            
            {/* KPI Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#17100B]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#3E2818] shadow-lg rgb-frame relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A39082]">
                      Total Gross Revenue
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-[#FFFDF8] font-mono tabular-nums mt-1">
                      ₱{analyticsData.kpi.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#2A160A] text-[#F47A28] border border-[#F47A28]/30">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#FFA05A] mt-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Real-time accumulated sales</span>
                </div>
              </div>

              <div className="bg-[#17100B]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#3E2818] shadow-lg rgb-frame relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A39082]">
                      Today's Volume
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-[#FFA05A] font-mono tabular-nums mt-1">
                      ₱{analyticsData.kpi.todayRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#2A160A] text-[#FFA05A] border border-[#FFA05A]/30">
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#A39082] mt-3">
                  <span className="text-[#FFFDF8] font-bold">{analyticsData.kpi.todayOrders}</span> orders placed today
                </div>
              </div>

              <div className="bg-[#17100B]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#3E2818] shadow-lg rgb-frame relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A39082]">
                      Average Order Value
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-[#FFFDF8] font-mono tabular-nums mt-1">
                      ₱{analyticsData.kpi.avgOrderValue}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#2A160A] text-[#E28743] border border-[#E28743]/30">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#A39082] mt-3">
                  <span>Across {analyticsData.kpi.totalOrders} total orders</span>
                </div>
              </div>

              <div className="bg-[#17100B]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#3E2818] shadow-lg rgb-frame relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A39082]">
                      Active Prep Queue
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-[#F47A28] font-mono tabular-nums mt-1">
                      {analyticsData.kpi.pendingOrders}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#2A160A] text-[#F47A28] border border-[#F47A28]/30">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#FFA05A] mt-3">
                  <span className="w-2 h-2 rounded-full bg-[#F47A28] animate-pulse" />
                  <span>Pending & Preparing</span>
                </div>
              </div>
            </div>

            {/* View Selector Tabs & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-[#140E0A]/90 rounded-2xl border border-[#3E2818] backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('visualizations')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'visualizations'
                      ? 'bg-gradient-to-r from-[#D95E14] to-[#F47A28] text-white shadow-md'
                      : 'text-[#A39082] hover:text-[#FFFDF8] hover:bg-[#1E150F]'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Interactive Charts & Trends</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-[#D95E14] to-[#F47A28] text-white shadow-md'
                      : 'text-[#A39082] hover:text-[#FFFDF8] hover:bg-[#1E150F]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Order Queue ({orders.length})</span>
                </button>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A39082] mr-1">Time Range:</span>
                <div className="inline-flex rounded-xl bg-[#17100B] p-1 border border-[#3E2818]">
                  <button
                    onClick={() => setTimeRange('7d')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      timeRange === '7d' ? 'bg-[#F47A28] text-white' : 'text-[#A39082] hover:text-[#FFFDF8]'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setTimeRange('14d')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      timeRange === '14d' ? 'bg-[#F47A28] text-white' : 'text-[#A39082] hover:text-[#FFFDF8]'
                    }`}
                  >
                    14 Days
                  </button>
                  <button
                    onClick={() => setTimeRange('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      timeRange === 'all' ? 'bg-[#F47A28] text-white' : 'text-[#A39082] hover:text-[#FFFDF8]'
                    }`}
                  >
                    All Time
                  </button>
                </div>
              </div>
            </div>

            {/* TAB 1: VISUALIZATIONS DASHBOARD */}
            {activeTab === 'visualizations' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* 1. Daily Sales Volume & Revenue Area Chart */}
                <div className="bg-[#17100B]/90 backdrop-blur-md p-6 rounded-2xl border border-[#3E2818] shadow-2xl rgb-frame space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3E2818]">
                    <div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#F47A28]" />
                        <h2 className="text-base font-extrabold text-[#FFFDF8]">
                          Daily Sales Volume & Revenue Stream
                        </h2>
                      </div>
                      <p className="text-xs text-[#A39082] mt-0.5">
                        Interactive telemetry showing day-by-day gross intake (₱) and order quantities in Talibon
                      </p>
                    </div>

                    {/* Metric Switcher */}
                    <div className="flex items-center gap-2 bg-[#120B07] p-1 rounded-xl border border-[#3E2818]">
                      <button
                        onClick={() => setChartMetric('revenue')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          chartMetric === 'revenue' ? 'bg-[#F47A28] text-white' : 'text-[#A39082] hover:text-[#FFFDF8]'
                        }`}
                      >
                        Revenue (₱)
                      </button>
                      <button
                        onClick={() => setChartMetric('volume')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          chartMetric === 'volume' ? 'bg-[#F47A28] text-white' : 'text-[#A39082] hover:text-[#FFFDF8]'
                        }`}
                      >
                        Orders Count
                      </button>
                    </div>
                  </div>

                  {/* Recharts Area Chart */}
                  <div className="w-full h-72 sm:h-80 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData.dailySales}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F47A28" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#F47A28" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFA05A" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FFA05A" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A1A10" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#735A4B"
                          tick={{ fill: '#A39082', fontSize: 11 }}
                          tickLine={false}
                          axisLine={{ stroke: '#3E2818' }}
                        />
                        <YAxis
                          stroke="#735A4B"
                          tick={{ fill: '#A39082', fontSize: 11 }}
                          tickLine={false}
                          axisLine={{ stroke: '#3E2818' }}
                          tickFormatter={(val) =>
                            chartMetric === 'revenue' ? `₱${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}` : `${val}`
                          }
                        />
                        <Tooltip content={<CustomSalesTooltip />} />
                        <Area
                          type="monotone"
                          dataKey={chartMetric === 'revenue' ? 'revenue' : 'ordersCount'}
                          stroke={chartMetric === 'revenue' ? '#F47A28' : '#FFA05A'}
                          strokeWidth={3}
                          fillOpacity={1}
                          fill={chartMetric === 'revenue' ? 'url(#salesGrad)' : 'url(#volumeGrad)'}
                          activeDot={{ r: 6, fill: '#FFA05A', stroke: '#17100B', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Popular Product Trends & Category Distribution Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Popular Product Trends (Horizontal / Vertical Bar Chart) */}
                  <div className="lg:col-span-2 bg-[#17100B]/90 backdrop-blur-md p-6 rounded-2xl border border-[#3E2818] shadow-2xl rgb-frame space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#3E2818]">
                      <div>
                        <div className="flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-[#FFA05A]" />
                          <h2 className="text-base font-extrabold text-[#FFFDF8]">
                            Popular Product Trends & Demand
                          </h2>
                        </div>
                        <p className="text-xs text-[#A39082] mt-0.5">
                          Top selling specialty coffees and fresh bakery items ranked by units sold
                        </p>
                      </div>
                      <span className="text-xs text-[#FFA05A] font-semibold bg-[#2A160A] px-2.5 py-1 rounded-lg border border-[#F47A28]/30">
                        Top Performers
                      </span>
                    </div>

                    <div className="w-full h-72 pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData.topProducts}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 45, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#2A1A10" horizontal={false} />
                          <XAxis
                            type="number"
                            stroke="#735A4B"
                            tick={{ fill: '#A39082', fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: '#3E2818' }}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#735A4B"
                            tick={{ fill: '#FFE4C6', fontSize: 11, fontWeight: 600 }}
                            tickLine={false}
                            axisLine={{ stroke: '#3E2818' }}
                            width={110}
                          />
                          <Tooltip content={<CustomProductTooltip />} />
                          <Bar
                            dataKey="quantity"
                            radius={[0, 8, 8, 0]}
                            fill="#F47A28"
                          >
                            {analyticsData.topProducts.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Quick ranking table list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#3E2818]/60 text-xs">
                      {analyticsData.topProducts.slice(0, 4).map((p) => (
                        <div key={p.name} className="flex items-center justify-between p-2 rounded-lg bg-[#120B07] border border-[#3E2818]/60">
                          <span className="flex items-center gap-1.5 text-[#FFE4C6] truncate">
                            <span className="w-4 h-4 rounded-full bg-[#2A160A] text-[#FFA05A] font-bold text-[10px] flex items-center justify-center shrink-0">
                              {p.rank}
                            </span>
                            <span className="truncate">{p.name}</span>
                          </span>
                          <span className="font-mono text-[#F47A28] font-bold shrink-0">
                            {p.quantity} sold (₱{p.revenue.toLocaleString()})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Revenue Distribution (Pie / Donut Chart) */}
                  <div className="bg-[#17100B]/90 backdrop-blur-md p-6 rounded-2xl border border-[#3E2818] shadow-2xl rgb-frame space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#3E2818]">
                        <div className="flex items-center gap-2">
                          <PieIcon className="w-4 h-4 text-[#F47A28]" />
                          <h2 className="text-base font-extrabold text-[#FFFDF8]">
                            Category Share
                          </h2>
                        </div>
                      </div>
                      <p className="text-xs text-[#A39082] mt-2">
                        Gross revenue contribution by café department
                      </p>

                      <div className="w-full h-52 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.categoryShare}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {analyticsData.categoryShare.map((entry, index) => (
                                <Cell key={`cat-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(val: any) => [`₱${Number(val).toLocaleString()}`, 'Revenue']}
                              contentStyle={{
                                backgroundColor: '#17100B',
                                borderColor: '#F47A28',
                                borderRadius: '0.75rem',
                                color: '#FFFDF8',
                                fontSize: '12px',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Legend Chips */}
                    <div className="space-y-2 pt-2 border-t border-[#3E2818]/60">
                      {analyticsData.categoryShare.map((cat) => (
                        <div key={cat.name} className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-2 text-[#FFE4C6]">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span>{cat.name}</span>
                          </span>
                          <span className="font-mono font-bold text-[#FFFDF8]">
                            ₱{cat.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: LIVE ORDER QUEUE & MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Filter and Status Counts Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#3E2818]/60">
                  <div className="flex flex-wrap items-center gap-2">
                    {['All', 'Pending', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          statusFilter === status
                            ? 'bg-[#F47A28] text-white shadow-md'
                            : 'bg-[#17100B] text-[#A39082] hover:text-[#FFFDF8] border border-[#3E2818]'
                        }`}
                      >
                        {status}
                        {status === 'All'
                          ? ` (${orders.length})`
                          : ` (${orders.filter((o) => o.status === status).length})`}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-[#A39082] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last Synced: {lastSyncTime.toLocaleTimeString()}</span>
                  </div>
                </div>

                {filteredOrderList.length === 0 ? (
                  <div className="text-center py-16 bg-[#17100B]/80 rounded-2xl border border-[#3E2818] space-y-3">
                    <Coffee className="w-10 h-10 text-[#3E2818] mx-auto stroke-[1.5]" />
                    <h3 className="text-sm font-bold text-[#FFFDF8]">No Orders In This Category</h3>
                    <p className="text-xs text-[#A39082] max-w-sm mx-auto">
                      All orders for this filter have either progressed or no new orders are in this state.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredOrderList.map((order) => (
                      <div
                        key={order.id}
                        className="bg-[#17100B]/90 backdrop-blur-md p-5 rounded-2xl border border-[#3E2818] shadow-md space-y-4 hover:border-[#F47A28]/50 transition-colors rgb-frame"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3E2818]">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-base font-extrabold font-mono text-[#F47A28]">
                                {order.reference}
                              </span>
                              <span className="text-xs font-bold text-[#FFFDF8]">
                                {order.customerName}
                              </span>
                              <span className="text-xs text-[#A39082]">
                                · {order.customerPhone}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#A39082] mt-1 flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-[#F47A28]" />
                              <span>{new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <span>·</span>
                              <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>

                          {/* Status selector */}
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-[#A39082] uppercase">
                              Status:
                            </label>
                            <select
                              value={order.status}
                              disabled={updatingId === order.id}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value as OrderStatus)
                              }
                              className="px-3 py-1.5 bg-[#25170F] border border-[#3E2818] rounded-lg text-xs font-bold text-[#FFE4C6] focus:outline-hidden focus:ring-2 focus:ring-[#F47A28] cursor-pointer"
                            >
                              {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1.5 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-[#FFFDF8]">
                              <span>
                                <strong className="text-[#F47A28]">{item.quantity}×</strong> {item.productName}
                              </span>
                              <span className="font-mono tabular-nums text-[#A39082]">
                                ₱{item.subtotal}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="p-2.5 rounded-lg bg-[#120B07] border border-[#3E2818] text-xs text-[#A39082]">
                            <span className="font-bold text-[#FFE4C6]">Customer Note: </span>
                            {order.notes}
                          </div>
                        )}

                        <div className="pt-2 border-t border-[#3E2818] flex justify-between items-center text-xs">
                          <span className="text-[#A39082]">Purok 3, Talibon, Bohol Pickup</span>
                          <span className="font-extrabold text-sm text-[#F47A28] font-mono tabular-nums">
                            Total: ₱{order.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
