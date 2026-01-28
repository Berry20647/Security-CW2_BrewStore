import React, { useState, useEffect } from "react";
import {
  getAllBookings,
  getAllUsers,
  getAllcoffees,
  createcoffee,
  updatecoffee,
  deletecoffee,
  updateBookingStatus,
  blockUser,
  unblockUser,
  getAllContacts,
  deleteContact,
  getActivityLogs,
} from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  MessageSquare,
  Activity,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Search,
  Filter,
  Clock,
  Shield,
  FileText

} from "lucide-react";

// Sidebar Navigation
const Sidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const menuItems = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "products", label: "Products", icon: ShoppingBag },
    { key: "orders", label: "Orders", icon: ShoppingBag }, // Reusing icon, could be Package
    { key: "users", label: "Users", icon: Users },
    { key: "contacts", label: "Inquiries", icon: MessageSquare },
    { key: "activity", label: "Activity", icon: Activity },
    { key: "profile", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-coffee-bean text-latte flex flex-col h-screen fixed left-0 top-0 border-r border-white/10 shadow-2xl z-50">
      <div className="p-8 border-b border-white/10">
        <h1 className="text-2xl font-serif font-bold text-cream tracking-wide">
          Brew<span className="text-caramel">Admin</span>
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeSection === item.key
                ? "bg-caramel text-coffee-bean font-bold shadow-lg"
                : "hover:bg-white/5 hover:text-white"
                }`}
            >
              <Icon size={20} />
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-white/5 hover:text-red-300 transition-all font-medium"
        >
          <LogOut size={20} />
          <span className="text-sm">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview": return <DashboardOverview setError={setError} />;
      case "products": return <ProductManagement setError={setError} />;
      case "orders": return <OrderManagement setError={setError} />;
      case "users": return <UserManagement setError={setError} />;
      case "contacts": return <ContactManagement setError={setError} />;
      case "activity": return <ActivityLogs setError={setError} />;
      case "profile": return <AdminProfileSettings setError={setError} />;
      default: return <DashboardOverview setError={setError} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans pl-64">
      <Toaster position="top-right" />
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={handleLogout} />

      <main className="p-8 md:p-12">
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-8 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-sm hover:underline">Dismiss</button>
          </div>
        )}
        {renderSection()}
      </main>
    </div>
  );
}

// --- Subcomponents ---

function DashboardOverview({ setError }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ orders: 0, sales: 0, users: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([getAllBookings(), getAllUsers(), getAllcoffees()])
      .then(([orders, users, products]) => {
        setStats({
          orders: orders.length,
          sales: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
          users: users.length,
          products: products.length,
        });
        setRecentOrders([...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [setError]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-serif font-bold text-cream">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back, Admin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Sales" value={`Rs ${stats.sales.toLocaleString()}`} color="bg-gradient-to-br from-green-900 to-green-800" />
        <StatCard label="Total Orders" value={stats.orders} color="bg-gradient-to-br from-blue-900 to-blue-800" />
        <StatCard label="Active Users" value={stats.users} color="bg-gradient-to-br from-purple-900 to-purple-800" />
        <StatCard label="Product Types" value={stats.products} color="bg-gradient-to-br from-orange-900 to-orange-800" />
      </div>

      <div className="bg-[#111] rounded-2xl p-8 border border-white/5 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Activity size={18} className="text-caramel" /> Recent Activity
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-gray-500 uppercase border-b border-white/10">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-300">
              {recentOrders.map((o) => (
                <tr key={o._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 font-mono text-xs text-gray-500">#{o._id.slice(-6)}</td>
                  <td className="px-4 py-4 font-medium text-white">{o.user?.name || "Guest"}</td>
                  <td className="px-4 py-4">{o.coffee?.name || "Product"}</td>
                  <td className="px-4 py-4 font-bold text-caramel">Rs {o.totalPrice}</td>
                  <td className="px-4 py-4"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductManagement({ setError }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", pricePerGram: "", stock: "", image: "" });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getAllcoffees().then(setProducts).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(fetchData, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updatecoffee(editing, form);
        toast.success("Product updated");
      } else {
        await createcoffee(form);
        toast.success("Product created");
      }
      setForm({ name: "", description: "", pricePerGram: "", stock: "", image: "" });
      setEditing(null);
      setShowForm(false);
      fetchData();
    } catch (err) { setError(err.message); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, pricePerGram: p.pricePerGram, stock: p.stock, image: p.image });
    setEditing(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete?")) return;
    try { await deletecoffee(id); toast.success("Deleted"); fetchData(); } catch (e) { setError(e.message); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-bold text-cream">Products</h2>
        <button onClick={() => { setEditing(null); setForm({ name: "", description: "", pricePerGram: "", stock: "", image: "" }); setShowForm(true); }} className="bg-caramel text-coffee-bean px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-coffee-bean transition-all shadow-lg text-sm uppercase tracking-wide flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#151515] w-full max-w-4xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {editing ? <Edit size={20} className="text-caramel" /> : <Plus size={20} className="text-caramel" />}
                {editing ? "Edit Product" : "New Coffee Blend"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Form */}
                <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-caramel uppercase tracking-widest border-b border-white/5 pb-2">Basic Info</h4>
                    <Input label="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Ethiopian Yirgacheffe" />
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Description</label>
                      <textarea
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-caramel focus:border-caramel transition-all h-32 resize-none"
                        required
                        placeholder="Describe the flavor profile, origin, and roast level..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-caramel uppercase tracking-widest border-b border-white/5 pb-2">Inventory & Media</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Price (Rs/g)" type="number" value={form.pricePerGram} onChange={e => setForm({ ...form, pricePerGram: e.target.value })} required />
                      <Input label="Stock (g)" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Image Filename</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-caramel focus:border-caramel transition-all"
                          value={form.image}
                          onChange={e => setForm({ ...form, image: e.target.value })}
                          required
                          placeholder="e.g. beans.jpg"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">Ensure this file exists in the server uploads folder.</p>
                    </div>
                  </div>
                </form>

                {/* Right: Live Preview */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center">Live Preview</h4>
                  <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden group shadow-2xl max-w-sm mx-auto">
                    <div className="h-56 overflow-hidden relative bg-black/50">
                      {form.image ? (
                        <img
                          src={`http://localhost:5001/uploads/${form.image}`}
                          onError={(e) => e.target.src = "http://localhost:5001/uploads/placeholder.jpg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-600 flex-col gap-2">
                          <ImageIcon size={32} />
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                      {form.pricePerGram && <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">Rs {form.pricePerGram}/g</div>}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-white mb-2">{form.name || "Product Name"}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{form.description || "Product description will appear here..."}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${form.stock > 0 ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                          {form.stock > 0 ? `${form.stock}g Stock` : "Out of Stock"}
                        </span>
                        <button className="bg-caramel text-coffee-bean p-2 rounded-full cursor-not-allowed opacity-50">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">This is how your product will appear to customers.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-end gap-4">
              <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
              <button type="submit" form="product-form" className="bg-caramel text-coffee-bean px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-coffee-bean transition-all shadow-lg uppercase tracking-wide">
                {editing ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p._id} className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden group hover:border-caramel/50 transition-all">
            <div className="h-48 overflow-hidden relative">
              <img src={p.image ? `http://localhost:5001/uploads/${p.image}` : "http://localhost:5001/uploads/placeholder.jpg"} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">Rs {p.pricePerGram}/g</div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-white mb-1">{p.name}</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{p.description}</p>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold px-2 py-1 rounded ${p.stock > 0 ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                  {p.stock > 0 ? `${p.stock}g Stock` : "Out of Stock"}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="p-2 bg-gray-800 rounded-lg hover:bg-white hover:text-black transition-colors"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderManagement({ setError }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    getAllBookings().then(setOrders).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(fetchOrders, []);

  const handleStatus = async (id, status) => {
    try { await updateBookingStatus(id, status); fetchOrders(); toast.success("Status updated"); }
    catch (e) { setError(e.message); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-cream">Orders</h2>
      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-500">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map(o => (
              <tr key={o._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{o._id.slice(-6)}</td>
                <td className="px-6 py-4 font-medium text-white">
                  {o.user?.name || "Guest"}
                  <div className="text-xs text-gray-500">{o.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{o.coffee?.name}</div>
                  <div className="text-xs text-gray-500">{o.quantity}x {o.weight}g</div>
                </td>
                <td className="px-6 py-4 font-bold text-caramel">Rs {o.totalPrice}</td>
                <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                <td className="px-6 py-4">
                  <select
                    value={o.status}
                    onChange={e => handleStatus(o._id, e.target.value)}
                    className="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-xs focus:ring-1 focus:ring-caramel outline-none"
                  >
                    {["pending", "shipped", "delivered", "cancelled"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserManagement({ setError }) {
  const [users, setUsers] = useState([]);
  useEffect(() => { getAllUsers().then(setUsers).catch(e => setError(e.message)); }, []);

  const toggleBlock = async (id, blocked) => {
    try {
      blocked ? await unblockUser(id) : await blockUser(id);
      getAllUsers().then(setUsers);
      toast.success(blocked ? "Unblocked" : "Blocked");
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-cream">Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u._id} className="bg-[#111] p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg">
                {u.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-white">{u.name}</h3>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className={`text-xs px-2 py-1 rounded ${u.isAdmin ? 'bg-purple-900/30 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
                {u.isAdmin ? "Admin" : "Customer"}
              </span>
              {!u.isAdmin && (
                <button
                  onClick={() => toggleBlock(u._id, u.blocked)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${u.blocked ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'}`}
                >
                  {u.blocked ? "Unblock User" : "Block User"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactManagement({ setError }) {
  const [contacts, setContacts] = useState([]);
  useEffect(() => { getAllContacts().then(setContacts).catch(e => setError(e.message)); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try { await deleteContact(id); setContacts(contacts.filter(c => c._id !== id)); toast.success("Deleted"); } catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-cream">Inquiries</h2>
      <div className="grid gap-4">
        {contacts.map(c => (
          <div key={c._id} className="bg-[#111] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <h4 className="font-bold text-white text-lg">{c.name} <span className="text-xs font-normal text-gray-500 ml-2">({c.email})</span></h4>
              <p className="text-gray-300 text-sm leading-relaxed bg-[#1a1a1a] p-3 rounded-lg border border-white/5">{c.message}</p>
            </div>
            <button onClick={() => handleDelete(c._id)} className="self-start md:self-center bg-red-900/20 hover:bg-red-600 hover:text-white text-red-400 p-2 rounded-lg transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {contacts.length === 0 && <div className="text-gray-500">No inquiries yet.</div>}
      </div>
    </div>
  );
}

// Placeholder for less critical parts to keep file concise but functional
function ActivityLogs({ setError }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getActivityLogs()
      .then(setLogs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [setError]);

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    (log.info && log.info.toLowerCase().includes(filter.toLowerCase())) ||
    (log.user && log.user.name && log.user.name.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-bold text-cream">Activity Logs</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-caramel"
          />
        </div>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-500 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-gray-500 flex items-center gap-2">
                      <Clock size={12} />
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {log.user ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-caramel/20 text-caramel flex items-center justify-center text-xs font-bold">
                            {log.user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-white">{log.user.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Guest / System</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${log.action === 'Request' ? 'bg-blue-900/20 text-blue-400' : 'bg-gray-800 text-gray-400'
                        }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {log.info || "No details available"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function AdminProfileSettings() { return <div className="text-gray-500">Profile settings managed centrally.</div>; }

// --- UI Utilities ---

const StatCard = ({ label, value, color }) => (
  <div className={`rounded-2xl p-6 shadow-xl ${color} relative overflow-hidden group`}>
    <div className="relative z-10">
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs font-bold text-white/60 uppercase tracking-widest">{label}</div>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
      <ShoppingBag size={100} />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-500/20 text-yellow-300",
    shipped: "bg-blue-500/20 text-blue-300",
    delivered: "bg-green-500/20 text-green-300",
    cancelled: "bg-red-500/20 text-red-300",
  };
  return <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${styles[status] || "bg-gray-500/20 text-gray-300"}`}>{status}</span>;
};

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</label>
    <input
      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-caramel focus:border-caramel transition-all"
      {...props}
    />
  </div>
);

// Style classes
// .input-field -> "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-caramel focus:border-caramel transition-all"
// .btn-primary -> "bg-coffee-bean text-white px-6 py-3 rounded-xl font-bold hover:bg-caramel hover:text-white transition-all shadow-lg text-sm uppercase tracking-wide"

const LoadingSpinner = () => <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-caramel rounded-full animate-spin border-t-transparent"></div></div>;