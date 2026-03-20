"use client";

import Link from "next/link";
import { ArrowRight, Smartphone, Briefcase, ShoppingBag, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-6 pt-24 pb-32">
        {/* Header */}
        <nav className="flex items-center justify-between mb-24 animate-fade-in">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white text-fill" />
            </div>
            <span className="text-xl font-bold tracking-tight">Tortoise</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/supplier/login" className="hover:text-white transition-colors">Supplier Login</Link>
          </div>

          <Link
            href="/employee/login"
            className="px-5 py-2.5 glass rounded-full text-sm font-semibold hover:bg-white/10 transition-colors border border-white/10"
          >
            Employee Portal
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-32 animate-fade-in [animation-delay:100ms]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Next-Gen Device Management
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Manage your device <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              ecosystem instantly.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The premium marketplace for enterprise device listings, stock logistics, and employee leasing. Scale your hardware operations with zero friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketplace"
              className="w-full sm:w-auto px-8 py-4 premium-gradient rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/20"
            >
              Browse Marketplace <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/supplier/login"
              className="w-full sm:w-auto px-8 py-4 glass rounded-2xl font-bold hover:bg-white/5 transition-all border border-white/10 flex items-center justify-center gap-2 shadow-xl"
            >
              Supplier Dashboard
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in [animation-delay:200ms]">
          {[
            { icon: ShieldCheck, title: "Secure Auth", desc: "JWT-based role management ensuring your listings stay safe." },
            { icon: ShoppingBag, title: "Smart Inventory", desc: "Track stock changes with automated audit logs and real-time alerts." },
            { icon: Briefcase, title: "Employee Leasing", desc: "Simplified workflows for equipment requests and lifecycle tracking." }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all hover:translate-y-[-4px]">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm animate-fade-in [animation-delay:300ms]">
          <p>© 2026 Tortoise Inc. Premium Hardware Solutions.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
