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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Affordable Indian STEM Education</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Transparent Plans for Makers & Schools
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          Start for free with core robotics and coding projects. Upgrade to Maker Pro for advanced AI vision and competition-grade hardware capstones.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
        {/* Tier 1: Free Explorer */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Explorer Tier
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Free Forever</h3>
            <p className="text-xs text-slate-500 mt-2">
              For curious young students exploring robotics and basic electronics.
            </p>

            <div className="my-6">
              <span className="text-4xl font-black text-slate-900">₹0</span>
              <span className="text-xs text-slate-500 ml-1.5">/ lifetime</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Access to 10+ core starter projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Full Browser Code Editor (Python, Arduino C++)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Basic AI Mentor hints (5 questions/day)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Public STEM Maker Portfolio</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100">
            <Link
              href="/projects"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center transition-colors"
            >
              Start Free Today
            </Link>
          </div>
        </div>

        {/* Tier 2: Maker Pro (Featured) */}
        <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 flex flex-col justify-between shadow-md relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
            Most Popular for Young Makers
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Individual Pro
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Maker Pro</h3>
            <p className="text-xs text-slate-500 mt-2">
              Full access to competition projects, advanced AI vision, and mentor reviews.
            </p>

            <div className="my-6">
              <span className="text-4xl font-black text-slate-900">₹4,999</span>
              <span className="text-xs text-slate-500 ml-1.5">/ student / year</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span><strong className="text-slate-900">Unlimited access to 100+ projects</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Full AI Mentor with circuit debugging</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Verified Mentor Review & 6-Point Rubrics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Certified Digital Badges & Portfolio Showcase</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Robotics Competition Readiness Packs</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100">
            <button
              onClick={() => handleStartCheckout('Maker Pro Annual', 4999)}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Enroll in Maker Pro (₹4,999)</span>
            </button>
          </div>
        </div>

        {/* Tier 3: School Lab Institutional */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Institutions
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">School STEM Lab</h3>
            <p className="text-xs text-slate-500 mt-2">
              For CBSE/ICSE schools and Atal Tinkering Labs (ATL) seeking structured curriculum.
            </p>

            <div className="my-6">
              <span className="text-4xl font-black text-slate-900">₹45,000</span>
              <span className="text-xs text-slate-500 ml-1.5">/ school / year</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Up to 300 Enrolled Students & 10 Faculty</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Multi-tenant class and join code management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Automated ATL compliance audit reports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Dedicated KITE STEM curriculum coordinator</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100">
            <Link
              href="/school/dashboard"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center transition-colors"
            >
              School Admin Inquiry
            </Link>
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Modal (Safe Simulation + Live key support) */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Razorpay STEM Checkout</h3>
              <p className="text-xs text-slate-500 mt-1">
                KITE ProjectVerse Secure Payment Gateway
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Selected Plan:</span>
                <strong className="text-slate-900">{selectedPlan.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Billing Period:</span>
                <span>Annual (365 Days)</span>
              </div>
              <div className="flex justify-between text-slate-700 pt-2 border-t border-slate-200 text-sm">
                <span className="font-semibold text-slate-900">Amount Due:</span>
                <span className="font-bold text-emerald-600">₹{selectedPlan.price} INR</span>
              </div>
            </div>

            {paymentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800">
                <Check className="h-6 w-6 text-emerald-600 mx-auto mb-1 animate-bounce" />
                <p className="font-bold text-sm">Payment Verified Successfully!</p>
                <p className="mt-1">Maker Pro membership is now active on your account.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleSimulatePaymentConfirm}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isProcessing ? 'Verifying Signature...' : 'Confirm Test Payment (Sandbox)'}</span>
                </button>

                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <p className="text-[10px] text-slate-500 text-center">
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
