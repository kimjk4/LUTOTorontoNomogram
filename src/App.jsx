import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, RotateCcw, Info, Calculator, FileText, AlertTriangle } from 'lucide-react';

const App = () => {
    // State for the checkboxes
    const [selectedFindings, setSelectedFindings] = useState({
        oligohydramnios: false,
        bilateralHN: false,
        bilateralUreteralDilatation: false,
        megacystis: false,
        bladderThickening: false,
        urinoma: false,
    });

    const [probability, setProbability] = useState(0);
    const [logit, setLogit] = useState(0);

    // Coefficients based on Rickard et al. 2023
    const coefficients = {
        oligohydramnios: 1.778,
        bilateralHN: 1.8444,
        bilateralUreteralDilatation: 3.23253,
        megacystis: 3.38305,
        bladderThickening: 2.27534,
        urinoma: 1.7466412,
    };

    // Baseline prevalence of 6% (Intercept)
    const BASELINE_CONSTANT = -2.7515;

    // Toggle handler
    const handleToggle = (key) => {
        setSelectedFindings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Reset handler
    const resetForm = () => {
        setSelectedFindings({
            oligohydramnios: false,
            bilateralHN: false,
            bilateralUreteralDilatation: false,
            megacystis: false,
            bladderThickening: false,
            urinoma: false,
        });
    };

    // Calculation Effect
    useEffect(() => {
        let currentLogit = BASELINE_CONSTANT;

        Object.keys(selectedFindings).forEach((key) => {
            if (selectedFindings[key]) {
                currentLogit += coefficients[key];
            }
        });

        const calculatedProbability = 1 / (1 + Math.exp(-currentLogit));

        setLogit(currentLogit);
        setProbability(calculatedProbability);
    }, [selectedFindings]);

    // UI Configuration List
    const findingsList = [
        { key: 'oligohydramnios', label: 'Oligohydramnios', val: coefficients.oligohydramnios },
        { key: 'bilateralHN', label: 'Bilateral Hydronephrosis', val: coefficients.bilateralHN },
        { key: 'bilateralUreteralDilatation', label: 'Bilateral Ureteral Dilatation', val: coefficients.bilateralUreteralDilatation },
        { key: 'megacystis', label: 'Megacystis', val: coefficients.megacystis },
        { key: 'bladderThickening', label: 'Bladder Thickening', val: coefficients.bladderThickening },
        { key: 'urinoma', label: 'Urinoma', val: coefficients.urinoma },
    ];

    // Helper to determine risk colors and labels
    const getRiskLevel = (prob) => {
        const p = prob * 100;
        if (p < 20) return { text: 'Low Probability', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' };
        if (p < 50) return { text: 'Moderate Probability', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' };
        if (p < 95) return { text: 'High Probability', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-500' };
        return { text: 'Very High Probability', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-600' };
    };

    const risk = getRiskLevel(probability);
    const percentage = (probability * 100).toFixed(1);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Top Brand Bar */}
            <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        {/* Note: In a real deployment, ensure these image paths are correct relative to your public folder */}
                        <img
                            src="image_e1f5d6.png"
                            alt="SickKids Logo"
                            className="h-10 object-contain"
                            onError={(e) => e.target.style.display = 'none'} // Fallback if image fails
                        />
                        <img
                            src="image_e1f599.png"
                            alt="University of Toronto Logo"
                            className="h-10 object-contain"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                    <div className="text-xs font-semibold text-slate-400 tracking-wide uppercase hidden md:block">
                        SickKids Urology
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto">

                    {/* Header Section */}
                    <header className="mb-8 mt-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                            Toronto LUTO Nomogram
                        </h1>
                        <p className="text-slate-600 max-w-3xl text-lg leading-relaxed">
                            A Bayesian meta-regression derived prenatal ultrasound index to predict <span className="font-semibold text-sky-600">Lower Urinary Tract Obstruction (LUTO)</span> and Prune Belly Syndrome.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Main Input Column */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* Input Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                        <Calculator className="w-5 h-5 text-sky-500" />
                                        Select Ultrasound Findings
                                    </h2>
                                    <button
                                        onClick={resetForm}
                                        className="text-xs font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-sky-200 transition-all shadow-sm active:scale-95"
                                    >
                                        <RotateCcw className="w-3 h-3" /> Reset
                                    </button>
                                </div>

                                <div className="divide-y divide-slate-50">
                                    {findingsList.map((item) => (
                                        <label
                                            key={item.key}
                                            className={`relative p-4 md:p-5 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-slate-50 group ${selectedFindings[item.key] ? 'bg-sky-50/60' : ''}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Custom Checkbox UI */}
                                                <div className={`
                          w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300
                          ${selectedFindings[item.key]
                                                        ? 'bg-sky-500 border-sky-500 shadow-md scale-105'
                                                        : 'border-slate-300 bg-white group-hover:border-sky-300'}
                        `}>
                                                    {selectedFindings[item.key] && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />}
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className={`font-medium text-lg transition-colors ${selectedFindings[item.key] ? 'text-sky-900' : 'text-slate-700'}`}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Hidden actual input for accessibility */}
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={selectedFindings[item.key]}
                                                onChange={() => handleToggle(item.key)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clinical Context Box */}
                            <div className="bg-sky-50 rounded-xl p-5 border border-sky-100 flex gap-4 items-start">
                                <div className="bg-sky-100 p-2 rounded-full flex-shrink-0 text-sky-600">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div className="text-sm text-sky-900 leading-relaxed">
                                    <p className="font-bold mb-1">Target Population</p>
                                    <p>
                                        This nomogram is validated for <strong>male fetuses</strong> with moderate-to-severe hydronephrosis (SFU Grade 3-4).
                                        The calculation includes a baseline 6% prevalence.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Results Column */}
                        <div className="lg:col-span-5 space-y-6">

                            {/* Main Result Card */}
                            <div className={`bg-white rounded-2xl shadow-xl border-t-8 transition-all duration-500 overflow-hidden ${risk.border.replace('border-', 'border-t-')}`}>
                                <div className="p-8 text-center border-b border-slate-50 relative">
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-6">
                                        Predicted Probability
                                    </h3>

                                    <div className="flex items-baseline justify-center gap-1 mb-6">
                                        <span className={`text-7xl font-bold tracking-tighter transition-colors duration-300 ${risk.color.replace('text-', 'text-slate-900 ')}`}>
                                            {percentage}
                                        </span>
                                        <span className="text-3xl font-medium text-slate-400">%</span>
                                    </div>

                                    <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold shadow-sm ${risk.bg} ${risk.color} transition-colors duration-300`}>
                                        {probability >= 0.95 && <AlertTriangle className="w-4 h-4" />}
                                        {risk.text}
                                    </div>
                                </div>

                                {/* Progress Bar Visual */}
                                <div className="h-4 w-full bg-slate-100 relative">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${risk.bar}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                    {/* 95% Cutoff Marker */}
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400/50 z-10" style={{ left: '95%' }} title="95% Threshold"></div>
                                </div>

                                {/* Calculation Details */}
                                <div className="p-6 bg-slate-50/80">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Breakdown
                                    </h4>

                                    <div className="space-y-3 text-sm">
                                        {/* Intercept */}
                                        <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-200 border-dashed">
                                            <span className="italic">Baseline (Intercept)</span>
                                            <span className="font-mono text-xs">{BASELINE_CONSTANT.toFixed(4)}</span>
                                        </div>

                                        {/* Active Findings */}
                                        {findingsList.map(f => selectedFindings[f.key] && (
                                            <div key={f.key} className="flex justify-between items-center text-slate-700 animate-in fade-in slide-in-from-left-2 duration-300">
                                                <span className="font-medium flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                                                    {f.label}
                                                </span>
                                                <span className="font-mono text-sky-600 font-bold">+{f.val}</span>
                                            </div>
                                        ))}

                                        {Object.values(selectedFindings).every(v => !v) && (
                                            <div className="text-slate-400 text-center py-2 italic text-xs">
                                                No additional risk factors present
                                            </div>
                                        )}

                                        <div className="border-t-2 border-slate-200 mt-2 pt-3 flex justify-between items-center text-slate-900">
                                            <span className="font-bold">Total Logit</span>
                                            <span className="font-mono font-bold">{logit.toFixed(4)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Formula & Reference */}
                            <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-500">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold uppercase tracking-wide text-slate-400">Formula</span>
                                </div>
                                <div className="font-mono bg-white p-2 rounded border border-slate-200 text-center mb-3">
                                    1 / (1 + e<sup>-(Logit)</sup>)
                                </div>
                                <p className="leading-snug text-slate-400 italic">
                                    Note: A probability ≥95% strongly suggests LUTO/PBS, though clinical judgment is paramount.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Footer */}
                    <footer className="mt-16 border-t border-slate-200 pt-8 text-center pb-8">
                        <div className="inline-block bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                                Rickard, Kim, Mieghem et al., Prenatal Diagnosis (2023)
                            </p>
                            <p className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                                SickKids Urology
                            </p>
                        </div>
                    </footer>

                </div>
            </div>
        </div>
    );
};

export default App;
