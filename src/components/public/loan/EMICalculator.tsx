'use client';

import { useState, useCallback } from 'react';
import { Calculator, IndianRupee } from 'lucide-react';

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);
}

function calculateEMI(
    principal: number,
    annualRate: number,
    tenureYears: number,
): { emi: number; totalInterest: number; totalPayable: number } {
    if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
        return { emi: 0, totalInterest: 0, totalPayable: 0 };
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = tenureYears * 12;
    const factor = Math.pow(1 + monthlyRate, months);
    const emi = (principal * monthlyRate * factor) / (factor - 1);
    const totalPayable = emi * months;
    const totalInterest = totalPayable - principal;

    return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayable: Math.round(totalPayable),
    };
}

export default function EMICalculator(): React.JSX.Element {
    const [carPrice, setCarPrice] = useState(500000);
    const [downPayment, setDownPayment] = useState(100000);
    const [interestRate, setInterestRate] = useState(10);
    const [tenure, setTenure] = useState(5);

    const loanAmount = Math.max(0, carPrice - downPayment);

    const { emi, totalInterest, totalPayable } = calculateEMI(
        loanAmount,
        interestRate,
        tenure,
    );

    const handleCarPriceChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = Number(e.target.value);
            setCarPrice(val);
            if (downPayment > val) setDownPayment(val);
        },
        [downPayment],
    );

    const handleDownPaymentChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setDownPayment(Math.min(Number(e.target.value), carPrice));
        },
        [carPrice],
    );

    return (
        <section id="emi-calculator" className="bg-muted py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        Plan Your Budget
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        EMI{' '}
                        <span className="text-primary">Calculator</span>
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Estimate your monthly payments before you apply.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-2">
                    {/* Inputs */}
                    <div className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 card-elevated">
                        {/* Car Price */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="emi-car-price"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Car Price
                                </label>
                                <span className="text-sm font-semibold text-primary">
                                    {formatCurrency(carPrice)}
                                </span>
                            </div>
                            <input
                                id="emi-car-price"
                                type="range"
                                min={100000}
                                max={5000000}
                                step={50000}
                                value={carPrice}
                                onChange={handleCarPriceChange}
                                className="w-full cursor-pointer accent-primary"
                            />
                            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                                <span>₹1L</span>
                                <span>₹50L</span>
                            </div>
                        </div>

                        {/* Down Payment */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="emi-down-payment"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Down Payment
                                </label>
                                <span className="text-sm font-semibold text-primary">
                                    {formatCurrency(downPayment)}
                                </span>
                            </div>
                            <input
                                id="emi-down-payment"
                                type="range"
                                min={0}
                                max={carPrice}
                                step={10000}
                                value={downPayment}
                                onChange={handleDownPaymentChange}
                                className="w-full cursor-pointer accent-primary"
                            />
                            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                                <span>₹0</span>
                                <span>{formatCurrency(carPrice)}</span>
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="emi-interest-rate"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Interest Rate
                                </label>
                                <span className="text-sm font-semibold text-primary">
                                    {interestRate}%
                                </span>
                            </div>
                            <input
                                id="emi-interest-rate"
                                type="range"
                                min={5}
                                max={20}
                                step={0.5}
                                value={interestRate}
                                onChange={(e) =>
                                    setInterestRate(Number(e.target.value))
                                }
                                className="w-full cursor-pointer accent-primary"
                            />
                            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                                <span>5%</span>
                                <span>20%</span>
                            </div>
                        </div>

                        {/* Loan Tenure */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="emi-tenure"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Loan Tenure
                                </label>
                                <span className="text-sm font-semibold text-primary">
                                    {tenure} {tenure === 1 ? 'Year' : 'Years'}
                                </span>
                            </div>
                            <input
                                id="emi-tenure"
                                type="range"
                                min={1}
                                max={7}
                                step={1}
                                value={tenure}
                                onChange={(e) =>
                                    setTenure(Number(e.target.value))
                                }
                                className="w-full cursor-pointer accent-primary"
                            />
                            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                                <span>1 Yr</span>
                                <span>7 Yrs</span>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex flex-col justify-center rounded-xl border border-border bg-card p-6 sm:p-8 card-elevated">
                        <div className="mb-6 flex items-center gap-2">
                            <Calculator
                                className="h-5 w-5 text-primary"
                                aria-hidden="true"
                            />
                            <h3 className="text-lg font-bold text-foreground">
                                Your EMI Breakdown
                            </h3>
                        </div>

                        {/* Loan Amount */}
                        <div className="mb-6 rounded-lg border border-border bg-muted p-4">
                            <p className="text-xs text-muted-foreground">
                                Loan Amount
                            </p>
                            <p className="mt-1 text-lg font-bold text-foreground">
                                {formatCurrency(loanAmount)}
                            </p>
                        </div>

                        {/* Monthly EMI — Highlighted */}
                        <div className="mb-6 rounded-xl border-2 border-primary/30 bg-primary/5 p-5 text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                                Monthly EMI
                            </p>
                            <div className="mt-1 flex items-center justify-center gap-1">
                                <IndianRupee
                                    className="h-6 w-6 text-primary"
                                    aria-hidden="true"
                                />
                                <span className="text-3xl font-bold text-primary sm:text-4xl">
                                    {emi > 0
                                        ? emi.toLocaleString('en-IN')
                                        : '—'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border border-border bg-muted p-4 text-center">
                                <p className="text-xs text-muted-foreground">
                                    Total Interest
                                </p>
                                <p className="mt-1 text-base font-bold text-foreground">
                                    {totalInterest > 0
                                        ? formatCurrency(totalInterest)
                                        : '—'}
                                </p>
                            </div>
                            <div className="rounded-lg border border-border bg-muted p-4 text-center">
                                <p className="text-xs text-muted-foreground">
                                    Total Payable
                                </p>
                                <p className="mt-1 text-base font-bold text-foreground">
                                    {totalPayable > 0
                                        ? formatCurrency(totalPayable)
                                        : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
