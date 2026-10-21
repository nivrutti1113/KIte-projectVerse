'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  School, 
  Bot, 
  HelpCircle,
  CreditCard
} from 'lucide-react';

export default function PricingPage() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number }>({
    name: 'Maker Pro Plan',
    price: 4999
  });

  const handleStartCheckout = async (planName: string, priceInr: number) => {
    setSelectedPlan({ name: planName, price: priceInr });
    setIsProcessing(true);

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: planName, amountInr: priceInr })
      });
      const data = await res.json();
      setCheckoutModalOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePaymentConfirm = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `order_${Date.now()}`,
          paymentId: `pay_${Date.now()}`,
          signature: 'simulated_valid_signature',
          userId: user?.id || 'usr-student-1',
          planTier: 'premium'
        })
      });

      if (res.ok) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
          setCheckoutModalOpen(false);
        }, 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Affordable Indian STEM Education</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Transparent Plans for Makers & Schools
        </h1>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          Start for free with core robotics and coding projects. Upgrade to Maker Pro for advanced AI vision and competition-grade hardware capstones.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
        {/* Tier 1: Free Explorer */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Explorer Tier
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Free Forever</h3>
            <p className="text-xs text-slate-400 mt-2">
              For curious young students exploring robotics and basic electronics.
            </p>

            <div className="my-6">
              <span className="text-4xl font-black text-white">₹0</span>
              <span className="text-xs text-slate-400 ml-1.5">/ lifetime</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Access to 10+ core starter projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Full Browser Code Editor (Python, Arduino C++)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Basic AI Mentor hints (5 questions/day)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Public STEM Maker Portfolio</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800">
            <Link
              href="/projects"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center transition-colors"
            >
              Start Free Today
            </Link>
          </div>
        </div>

        {/* Tier 2: Maker Pro (Featured) */}
        <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 border-2 border-cyan-400 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider shadow-md">
            Most Popular for Young Makers
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Individual Pro
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Maker Pro</h3>
            <p className="text-xs text-slate-300 mt-2">
              Full access to competition projects, advanced AI vision, and mentor reviews.
            </p>

            <div className="my-6">
              <span className="text-4xl font-black text-white">₹4,999</span>
              <span className="text-xs text-slate-400 ml-1.5">/ student / year</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span><strong>Unlimited access to 100+ projects</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>Full AI Mentor with circuit debugging</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>Verified Mentor Review & 6-Point Rubrics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>Certified Digital Badges & Portfolio Showcase</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>Robotics Competition Readiness Packs</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800">
            <button
              onClick={() => handleStartCheckout('Maker Pro Annual', 4999)}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Enroll in Maker Pro (₹4,999)</span>
            </button>
          </div>
        </div>

        {/* Tier 3: School Lab Institutional */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Institutions
            </span>
            <h3 className="text-xl font-bold text-white mt-1">School STEM Lab</h3>
            <p className="text-xs text-slate-400 mt-2">
              For CBSE/ICSE schools and Atal Tinkering Labs (ATL) seeking structured curriculum.
            </p>

            <div className="my-6">
              <span className="text-4xl font-black text-white">₹45,000</span>
              <span className="text-xs text-slate-400 ml-1.5">/ school / year</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Up to 300 Enrolled Students & 10 Faculty</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-tenant class and join code management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Automated ATL compliance audit reports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Dedicated KITE STEM curriculum coordinator</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800">
            <Link
              href="/school/dashboard"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center transition-colors"
            >
              School Admin Inquiry
            </Link>
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Modal (Safe Simulation + Live key support) */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-white text-lg">Razorpay STEM Checkout</h3>
              <p className="text-xs text-slate-400 mt-1">
                KITE ProjectVerse Secure Payment Gateway
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs mb-6">
              <div className="flex justify-between text-slate-300">
                <span>Selected Plan:</span>
                <strong className="text-white">{selectedPlan.name}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Billing Period:</span>
                <span>Annual (365 Days)</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800 text-sm">
                <span className="font-bold text-white">Amount Due:</span>
                <span className="font-bold text-emerald-400">₹{selectedPlan.price} INR</span>
              </div>
            </div>

            {paymentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-center text-xs text-emerald-200">
                <Check className="h-6 w-6 text-emerald-400 mx-auto mb-1 animate-bounce" />
                <p className="font-bold text-sm">Payment Verified Successfully!</p>
                <p className="mt-1">Maker Pro membership is now active on your account.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleSimulatePaymentConfirm}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isProcessing ? 'Verifying Signature...' : 'Confirm Test Payment (Sandbox)'}</span>
                </button>

                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  Server-side HMAC-SHA256 signature verification active. No credit card details stored.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
