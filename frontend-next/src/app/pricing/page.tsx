"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";
import Script from "next/script";
import { Check, Star, Zap, Shield, ArrowLeft, Loader2 } from "lucide-react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Plan {
    id: string;
    name: string;
    price: number;
    currency?: string;
    interval?: string;
    features: string[];
    recommended?: boolean;
}

export default function PricingPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        // Hardcoded plans for now
        setPlans([
            {
                id: "free",
                name: "Free",
                price: 0,
                features: ["10 AI Credits/mo", "Basic Job Search", "1 Resume Upload"],
                recommended: false
            },
            {
                id: "starter",
                name: "Starter",
                price: 499,
                interval: "mo",
                features: ["50 AI Credits/mo", "Unlimited Resume Tailoring", "Priority Support", "Advanced Analytics"],
                recommended: true
            },
            {
                id: "pro",
                name: "Pro",
                price: 999,
                interval: "mo",
                features: ["200 AI Credits/mo", "Auto-Apply Agent", "Dedicated Career Coach", "All Features Unlocked"],
                recommended: false
            }
        ]);
        setLoading(false);
    }, []);

    const handleSubscribe = async (planId: string, price: number) => {
        if (price === 0) return; // Free plan

        setProcessing(planId);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            // 1. Create Order
            const orderRes = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: price,
                    currency: "INR",
                    planId
                })
            });
            const orderData = await orderRes.json();

            if (!orderData.success) {
                throw new Error(orderData.error || "Failed to create order");
            }

            // 2. Open Razorpay
            const options = {
                key: orderData.key_id,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "JoBika Premium",
                description: `Subscription for ${planId} plan`,
                order_id: orderData.order.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planId
                            })
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            alert(`Successfully subscribed to ${planId.toUpperCase()} plan!`);
                            window.location.href = "/dashboard";
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: "User Name", // Ideally fetch from user profile
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#10B981" // Primary color
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                alert(response.error.description);
            });
            rzp1.open();

        } catch (error: any) {
            console.error("Subscription failed:", error);
            alert(error.message || "Subscription failed. Please try again.");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Upgrade Your Career Journey</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Unlock premium features like AI coaching, unlimited resume tailoring, and priority applications.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${plan.recommended
                                    ? "border-primary shadow-lg scale-105 z-10"
                                    : "border-transparent shadow-sm hover:border-primary/20"
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-foreground">
                                            {plan.price === 0 ? "Free" : `₹${plan.price}`}
                                        </span>
                                        {plan.price > 0 && (
                                            <span className="text-muted-foreground">/{plan.interval}</span>
                                        )}
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan.id, plan.price)}
                                    disabled={!!processing}
                                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.recommended
                                        ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
                                        : "bg-muted text-foreground hover:bg-muted/80"
                                        }`}
                                >
                                    {processing === plan.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : plan.price === 0 ? (
                                        "Current Plan"
                                    ) : (
                                        <>
                                            Get Started
                                            <Zap className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <p className="text-muted-foreground flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Secure payment via Razorpay. Cancel anytime.
                    </p>
                </div>
            </div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div>
    );
}
