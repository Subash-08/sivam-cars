'use client';

import { useState } from 'react';
import { formatINR } from '@/lib/utils';
import { Calculator } from 'lucide-react';

interface EmiCalculatorProps {
    price: number;
}

export function EmiCalculator({ price }: EmiCalculatorProps) {
    const defaultDownPayment = Math.round(price * 0.1);

    const [downPayment, setDownPayment] = useState<number>(defaultDownPayment);
    const [interestRate, setInterestRate] = useState<number>(9);
    const [tenure, setTenure] = useState<number>(60);

    const loanAmount = Math.max(0, price - (downPayment || 0));

    // Calculate EMI
    const calculateEMI = () => {
        const r = (interestRate || 0) / 12 / 100;
        const n = tenure || 1;

        if (loanAmount <= 0) return 0;
        if (r === 0) return Math.round(loanAmount / n);

        const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return Math.round(emi);
    };

    const emi = calculateEMI();

    return (
        <section className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">EMI Calculator</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-5">
                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="text-sm font-medium text-foreground">Down Payment</label>
                            <span className="text-sm font-semibold text-primary">{formatINR(downPayment)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={price}
                            step="10000"
                            value={downPayment}
                            onChange={(e) => setDownPayment(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>₹0</span>
                            <span>{formatINR(price)}</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="text-sm font-medium text-foreground">Interest Rate (%)</label>
                            <span className="text-sm font-semibold text-primary">{interestRate}%</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="20"
                            step="0.5"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>5%</span>
                            <span>20%</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="text-sm font-medium text-foreground">Loan Tenure (Months)</label>
                            <span className="text-sm font-semibold text-primary">{tenure} Months</span>
                        </div>
                        <input
                            type="range"
                            min="12"
                            max="84"
                            step="12"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>12m</span>
                            <span>84m</span>
                        </div>
                    </div>
                </div>

                {/* Results Card */}
                <div className="bg-muted rounded-xl p-6 flex flex-col justify-center items-center text-center space-y-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-medium">Estimated EMI</p>
                        <p className="text-4xl font-bold text-primary">{formatINR(emi)}<span className="text-lg text-muted-foreground font-medium">/mo</span></p>
                    </div>

                    <div className="w-full h-px bg-border"></div>

                    <div className="w-full grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1 font-medium">Loan Amount</p>
                            <p className="font-semibold text-foreground text-lg">{formatINR(loanAmount)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1 font-medium">Total Interest</p>
                            <p className="font-semibold text-foreground text-lg">{formatINR(Math.max(0, (emi * tenure) - loanAmount))}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
