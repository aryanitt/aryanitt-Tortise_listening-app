"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    Box,
    History,
    LogOut,
    Plus,
    Trash2,
    TrendingUp,
    TrendingDown,
    Package,
    Edit3,
    Zap,
    AlertCircle
} from "lucide-react";

type Device = {
    _id: string;
    name: string;
    brand: string;
    basePrice: number;
    offerType: "none" | "percent" | "flat";
    offerValue: number;
    finalPrice: number;
    stockQuantity: number;
    availabilityStatus: "in_stock" | "out_of_stock";
    description?: string;
    imageUrl?: string;
};

type StockLogItem = {
    _id: string;
    quantityChange: number;
    changeReason: string;
    createdAt: string;
};

export default function SupplierDashboard() {
    const router = useRouter();
    const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null), []);

    const [devices, setDevices] = useState<Device[]>([]);
    const [logs, setLogs] = useState<StockLogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [activeTab, setActiveTab] = useState<"listings" | "logs">("listings");

    const [form, setForm] = useState({
        name: "",
        brand: "",
        description: "",
        imageUrl: "",
        basePrice: 0,
        offerType: "none" as "none" | "percent" | "flat",
        offerValue: 0,
        stockQuantity: 10,
        availabilityStatus: "in_stock" as "in_stock" | "out_of_stock",
    });

    async function loadDevices() {
        if (!token) return router.push("/supplier/login");
        setLoading(true);
        try {
            const res = await fetch("/api/supplier/devices", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!data.ok) setMsg(data.message || "Failed to load devices");
            setDevices(data.devices || []);
        } catch (e) {
            setMsg("Network error loading devices");
        } finally {
            setLoading(false);
        }
    }

    async function loadLogs() {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("/api/supplier/stock-logs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.ok) setLogs(data.logs || []);
        } catch (e) {
            setMsg("Network error loading logs");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (activeTab === "listings") loadDevices();
        else loadLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    async function createDevice(e: React.FormEvent) {
        e.preventDefault();
        if (!token) return;

        const res = await fetch("/api/supplier/devices", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!data.ok) return setMsg(data.message || "Failed to create device");

        setForm({
            name: "",
            brand: "",
            description: "",
            imageUrl: "",
            basePrice: 0,
            offerType: "none",
            offerValue: 0,
            stockQuantity: 10,
            availabilityStatus: "in_stock",
        });

        await loadDevices();
    }

    async function deleteDevice(id: string) {
        if (!token) return;
        if (!confirm("Are you sure? This cannot be undone.")) return;

        const res = await fetch(`/api/supplier/devices/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!data.ok) return setMsg(data.message || "Failed to delete");
        await loadDevices();
    }

    async function updateStock(id: string, quantityChange: number) {
        if (!token) return;

        const reason = prompt("Comment for this update:") || "";
        const res = await fetch(`/api/supplier/devices/${id}/stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ quantityChange, changeReason: reason }),
        });

        const data = await res.json();
        if (!data.ok) return setMsg(data.message || "Failed to update stock");
        await loadDevices();
    }

    return (
        <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight">Admin</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab("listings")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'listings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Box className="w-5 h-5" /> Listings
                    </button>
                    <button
                        onClick={() => setActiveTab("logs")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'logs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <History className="w-5 h-5" /> Stock Logs
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 opacity-50 cursor-not-allowed">
                        <BarChart3 className="w-5 h-5" /> Analytics
                    </button>
                </nav>

                <button
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-400 transition-all mt-auto"
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
                        router.push("/supplier/login");
                    }}
                >
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-3xl font-black tracking-tight">Supplier Dashboard</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Manage hardware and logistics pipeline.</p>
                </header>

                {msg && (
                    <div className="fixed top-6 right-6 z-[100] bg-white border-l-4 border-red-500 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-bold text-slate-700">{msg}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* View Section */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="font-black text-xs uppercase tracking-widest text-slate-400">{activeTab === 'listings' ? 'Current Catalog' : 'Audit Logs'}</h2>
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                    {activeTab === 'listings' ? devices.length : logs.length} Records
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                {activeTab === 'listings' ? (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                <th className="px-8 py-4">Product</th>
                                                <th className="px-8 py-4 text-center">Price</th>
                                                <th className="px-8 py-4 text-center">Stock</th>
                                                <th className="px-8 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {loading ? (
                                                <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400 text-xs">Loading...</td></tr>
                                            ) : devices.map((d) => (
                                                <tr key={d._id} className="group hover:bg-slate-50/50">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                                                <Package className="w-5 h-5 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-slate-900">{d.name}</div>
                                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{d.brand}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <div className="text-sm font-black text-slate-900">₹{d.finalPrice.toLocaleString()}</div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <span className="text-sm font-black text-slate-900">{d.stockQuantity}</span>
                                                            <div className="flex flex-col gap-0.5">
                                                                <button onClick={() => updateStock(d._id, 1)} className="hover:text-green-500">
                                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button onClick={() => updateStock(d._id, -1)} className="hover:text-red-500">
                                                                    <TrendingDown className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button
                                                            onClick={() => deleteDevice(d._id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                <th className="px-8 py-4">Timestamp</th>
                                                <th className="px-8 py-4">Quantity</th>
                                                <th className="px-8 py-4">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {loading ? (
                                                <tr><td colSpan={3} className="px-8 py-10 text-center text-slate-400 text-xs">Loading...</td></tr>
                                            ) : logs.map((log) => (
                                                <tr key={log._id}>
                                                    <td className="px-8 py-4 text-[10px] font-bold text-slate-500">
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </td>
                                                    <td className="px-8 py-4 font-black">
                                                        <span className={log.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}>
                                                            {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4 text-sm font-medium text-slate-600">
                                                        {log.changeReason || "adjustment"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    {activeTab === 'listings' && (
                        <div>
                            <form onSubmit={createDevice} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-xl font-black tracking-tight mb-8">Publish Listing</h2>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-1">Device Name</label>
                                        <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm font-bold transition-all"
                                            placeholder="MacBook Pro" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold"
                                            placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                                        <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold"
                                            type="number" placeholder="Price" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} required />
                                    </div>
                                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold"
                                        type="number" placeholder="Stock Qty" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })} />
                                    <button className="w-full premium-gradient text-white rounded-2xl py-4 font-bold shadow-xl shadow-indigo-500/20 mt-6 active:scale-95 transition-transform">
                                        Create Item
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
