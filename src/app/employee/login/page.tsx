"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, Loader2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EmployeeLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("employee@test.com");
    const [password, setPassword] = useState("Employee@123");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            setLoading(false);

            if (!data.ok) return setMsg(data.message || "Authentication failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            router.push("/marketplace");
        } catch (err) {
            setLoading(false);
            setMsg("Connection error. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative animate-fade-in">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>

                <div className="glass rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-2xl relative">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 mb-6">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Employee Portal</h1>
                        <p className="text-slate-400 text-sm">Discover your next enterprise device</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all outline-none text-white font-medium"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all outline-none text-white font-medium"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {msg && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm font-semibold animate-shake">
                                {msg}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl py-4 font-bold active:scale-95 transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Connecting...
                                </>
                            ) : (
                                <>
                                    Explore Marketplace <ShoppingBag className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-500 text-xs font-medium">
                        Forgotten credentials? Visit <span className="text-slate-300 underline cursor-pointer hover:text-purple-400 transition-colors">IT support portal</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
