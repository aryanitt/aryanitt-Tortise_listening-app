"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, Package, Tag, ArrowUpRight, Filter, ShoppingCart, Zap } from "lucide-react";

type Device = {
    _id: string;
    name: string;
    brand: string;
    description: string;
    imageUrl: string;
    basePrice: number;
    offerType: "none" | "percent" | "flat";
    offerValue: number;
    finalPrice: number;
    stockQuantity: number;
};

export default function MarketplacePage() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        const res = await fetch(`/api/devices?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setLoading(false);
        setDevices(data.devices || []);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-9 h-9 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Marketplace</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors"
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("role");
                                router.push("/employee/login");
                            }}
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Search Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-black tracking-tight mb-4">Discover Devices</h1>
                        <p className="text-slate-500 text-lg">Browse high-performance enterprise hardware ready for your next project.</p>
                    </div>

                    <div className="w-full md:w-[400px] flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-sm"
                                placeholder="Search name or brand..."
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && load()}
                            />
                        </div>
                        <button
                            className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                            onClick={load}
                        >
                            <Filter className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Device Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[450px] bg-slate-100 rounded-[2rem] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {devices.map((d) => (
                            <div key={d._id} className="group bg-white border border-slate-200 rounded-[2.5rem] p-5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:translate-y-[-8px]">
                                {/* Image Container */}
                                <div className="relative h-64 bg-slate-50 rounded-[2rem] flex items-center justify-center overflow-hidden mb-6 group-hover:bg-slate-100/50 transition-colors">
                                    {d.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={d.imageUrl} alt={d.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="text-slate-300 flex flex-col items-center gap-3">
                                            <Package className="w-12 h-12" />
                                            <span className="text-xs font-bold uppercase tracking-widest">No Preview</span>
                                        </div>
                                    )}

                                    {d.offerType !== "none" && (
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-indigo-600 border border-indigo-100 shadow-sm">
                                            {d.offerType === "percent" ? `${d.offerValue}% OFF` : `₹${d.offerValue} OFF`}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="px-2">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">{d.name}</h3>
                                            <p className="text-slate-400 font-semibold text-sm">{d.brand}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-500 line-clamp-2 mt-3 leading-relaxed">
                                        {d.description || `Experience high performance with the latest ${d.name} from ${d.brand}.`}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                        <div>
                                            <div className="text-slate-400 text-xs font-bold line-through mb-1">₹{d.basePrice.toLocaleString()}</div>
                                            <div className="text-2xl font-black text-slate-900 leading-none">₹{d.finalPrice.toLocaleString()}</div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-green-700 uppercase">{d.stockQuantity} Ready</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="mt-6 w-full premium-gradient text-white rounded-2xl py-4 font-bold active:scale-95 transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2 group/btn opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300">
                                        <ShoppingCart className="w-5 h-5" /> Request Lease
                                    </button>
                                </div>
                            </div>
                        ))}

                        {devices.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 glass border-dashed rounded-[3rem]">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                    <Search className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No hardware found</h3>
                                <p className="text-slate-500 max-w-sm text-center">We couldn't find any products matching your search. Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold">Tortoise Marketplace</span>
                    </div>
                    <p className="text-slate-400 text-sm italic italic_not_italic">"Equipping the world's most ambitious teams."</p>
                    <div className="flex gap-6 text-slate-400 font-medium text-sm">
                        <span className="hover:text-slate-900 cursor-pointer transition-colors line-through">Support</span>
                        <span className="hover:text-slate-900 cursor-pointer transition-colors line-through">Privacy</span>
                        <span className="hover:text-slate-900 cursor-pointer transition-colors line-through">Terms</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
