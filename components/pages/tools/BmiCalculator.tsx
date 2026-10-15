'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle2, RotateCcw } from 'lucide-react';
import { BMI_CATEGORIES } from '@/data/tools';

export default function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [age, setAge] = useState<number | ''>(28);

  // Metric fields
  const [heightCm, setHeightCm] = useState<number | ''>(172);
  const [weightKg, setWeightKg] = useState<number | ''>(68);

  // Imperial fields
  const [heightFeet, setHeightFeet] = useState<number | ''>(5);
  const [heightInches, setHeightInches] = useState<number | ''>(8);
  const [weightLbs, setWeightLbs] = useState<number | ''>(150);

  // Calculate BMI
  const bmiResult = useMemo(() => {
    let bmi = 0;
    let heightInMeters = 0;

    if (unit === 'metric') {
      const h = Number(heightCm);
      const w = Number(weightKg);
      if (h > 50 && w > 10) {
        heightInMeters = h / 100;
        bmi = w / (heightInMeters * heightInMeters);
      }
    } else {
      const ft = Number(heightFeet);
      const inch = Number(heightInches);
      const totalInches = ft * 12 + inch;
      const wLbs = Number(weightLbs);
      if (totalInches > 20 && wLbs > 20) {
        bmi = (703 * wLbs) / (totalInches * totalInches);
        heightInMeters = (totalInches * 2.54) / 100;
      }
    }

    if (!bmi || isNaN(bmi) || bmi <= 0) return null;

    // Determine category
    let category = BMI_CATEGORIES[0];
    if (bmi < 18.5) {
      category = BMI_CATEGORIES[0];
    } else if (bmi < 25.0) {
      category = BMI_CATEGORIES[1];
    } else if (bmi < 30.0) {
      category = BMI_CATEGORIES[2];
    } else if (bmi < 35.0) {
      category = BMI_CATEGORIES[3];
    } else {
      category = BMI_CATEGORIES[4];
    }

    // Healthy weight range for this height
    const minHealthyKg = 18.5 * (heightInMeters * heightInMeters);
    const maxHealthyKg = 24.9 * (heightInMeters * heightInMeters);

    return {
      bmi: Number(bmi.toFixed(1)),
      category,
      minHealthyKg: Number(minHealthyKg.toFixed(1)),
      maxHealthyKg: Number(maxHealthyKg.toFixed(1)),
      minHealthyLbs: Number((minHealthyKg * 2.20462).toFixed(1)),
      maxHealthyLbs: Number((maxHealthyKg * 2.20462).toFixed(1)),
    };
  }, [unit, heightCm, weightKg, heightFeet, heightInches, weightLbs]);

  const handleReset = () => {
    setUnit('metric');
    setGender('female');
    setAge(28);
    setHeightCm(172);
    setWeightKg(68);
    setHeightFeet(5);
    setHeightInches(8);
    setWeightLbs(150);
  };

  // Calculate percentage pointer for spectrum (15 to 40 BMI range)
  const pointerPercentage = useMemo(() => {
    if (!bmiResult) return 50;
    const clamped = Math.min(Math.max(bmiResult.bmi, 15), 40);
    return ((clamped - 15) / (40 - 15)) * 100;
  }, [bmiResult]);

  return (
    <div className="w-full bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* =========================================================
              LEFT COLUMN: Interactive Calculator Form
              ========================================================= */}
          {/* =========================================================
              LEFT COLUMN: Interactive Calculator Form
              ========================================================= */}
          <div className="lg:col-span-7 bg-[#faf9f8] border border-[#ded9d5] rounded-xl p-6 sm:p-8 shadow-2xs">
            {/* Unit & Reset Header */}
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#ded9d5]">
              <span className="text-[14px] sm:text-[14.5px] font-bold text-foreground">Calculation Units:</span>
              <div className="flex items-center gap-1.5 p-1 bg-border-background border border-[#ded9d5] rounded-lg">
                <button
                  type="button"
                  onClick={() => setUnit('metric')}
                  className={`px-3.5 py-1.5 rounded-md text-[12.5px] sm:text-[13px] font-bold transition-all cursor-pointer ${
                    unit === 'metric'
                      ? 'bg-white text-foreground border border-[#ded9d5] shadow-2xs'
                      : 'text-primary-text hover:text-foreground'
                  }`}
                >
                  Metric (cm, kg)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('imperial')}
                  className={`px-3.5 py-1.5 rounded-md text-[12.5px] sm:text-[13px] font-bold transition-all cursor-pointer ${
                    unit === 'imperial'
                      ? 'bg-white text-foreground border border-[#ded9d5] shadow-2xs'
                      : 'text-primary-text hover:text-foreground'
                  }`}
                >
                  Imperial (ft, lbs)
                </button>
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Gender Toggle */}
              <div>
                <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-2">
                  Biological Sex
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2.5 px-4 rounded-xl border text-[14px] sm:text-[14.5px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'female'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-[#ded9d5] bg-white text-foreground hover:bg-border-background/50'
                    }`}
                  >
                    <span>Female</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2.5 px-4 rounded-xl border text-[14px] sm:text-[14.5px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'male'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-[#ded9d5] bg-white text-foreground hover:bg-border-background/50'
                    }`}
                  >
                    <span>Male</span>
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="2"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-12 px-4 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                  placeholder="e.g. 28"
                />
              </div>

              {/* Height Inputs */}
              {unit === 'metric' ? (
                <div>
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                    Height (centimeters)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="50"
                      max="260"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full h-12 px-4 pr-12 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                      placeholder="e.g. 172"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-text">
                      cm
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                      Height (feet)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="2"
                        max="8"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full h-12 px-4 pr-10 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                        placeholder="5"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-text">
                        ft
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                      Height (inches)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full h-12 px-4 pr-10 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                        placeholder="8"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-text">
                        in
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Weight Inputs */}
              <div>
                <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                  Weight ({unit === 'metric' ? 'kilograms' : 'pounds'})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="15"
                    max="450"
                    value={unit === 'metric' ? weightKg : weightLbs}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      if (unit === 'metric') setWeightKg(val);
                      else setWeightLbs(val);
                    }}
                    className="w-full h-12 px-4 pr-12 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                    placeholder={unit === 'metric' ? 'e.g. 68' : 'e.g. 150'}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-text">
                    {unit === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>
              </div>

              {/* Reset Controls */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-[13px] sm:text-[13.5px] font-semibold text-primary-text hover:text-foreground cursor-pointer transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>Reset to defaults</span>
                </button>
              </div>
            </form>
          </div>

          {/* =========================================================
              RIGHT COLUMN: Real-Time Results & Spectrum Analysis
              ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {bmiResult ? (
              <motion.div
                key={bmiResult.bmi}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#ded9d5] rounded-xl p-6 sm:p-8 shadow-2xs"
              >
                <div className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <span>Calculated Result</span>
                </div>

                {/* Big Score Display */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-[44px] sm:text-[52px] font-black tracking-tight text-foreground leading-none">
                    {bmiResult.bmi}
                  </span>
                  <span className="text-[14.5px] sm:text-[15px] font-semibold text-primary-text">
                    kg/m²
                  </span>
                </div>

                {/* Category Badge */}
                <div className="mt-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[12.5px] sm:text-[13px] font-bold"
                    style={{
                      backgroundColor: bmiResult.category.bgColor,
                      color: bmiResult.category.color,
                    }}
                  >
                    <CheckCircle2 size={14} strokeWidth={2.5} />
                    <span>{bmiResult.category.category}</span>
                  </span>
                </div>

                <p className="mt-3.5 text-[15px] sm:text-[16px] text-primary-text leading-relaxed">
                  {bmiResult.category.description}
                </p>

                {/* Color Spectrum Gauge */}
                <div className="mt-6 pt-5 border-t border-[#ded9d5]">
                  <span className="text-[13px] sm:text-[13.5px] font-bold text-foreground block mb-2">
                    BMI Spectrum Position:
                  </span>
                  <div className="relative w-full h-3 rounded-full overflow-hidden bg-linear-to-r from-sky-400 via-emerald-500 to-red-600" />
                  {/* Pin Pointer */}
                  <div
                    className="relative w-full h-4 mt-1"
                    style={{ position: 'relative' }}
                  >
                    <div
                      className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                      style={{ left: `${pointerPercentage}%` }}
                    >
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-foreground" />
                      <span className="text-[10px] font-bold text-foreground whitespace-nowrap">
                        {bmiResult.bmi}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Healthy Range Note */}
                <div className="mt-5 p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/20 text-[14px] sm:text-[14.5px] text-primary-text leading-relaxed">
                  <span className="font-bold text-foreground block mb-1">
                    Optimal Weight Target for Your Height:
                  </span>
                  {unit === 'metric' ? (
                    <span className="font-semibold text-foreground">
                      {bmiResult.minHealthyKg} kg – {bmiResult.maxHealthyKg} kg
                    </span>
                  ) : (
                    <span className="font-semibold text-foreground">
                      {bmiResult.minHealthyLbs} lbs – {bmiResult.maxHealthyLbs} lbs
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#faf9f8] border border-[#ded9d5] rounded-xl p-8 text-center text-primary-text shadow-2xs">
                <Info size={32} className="mx-auto text-primary-text mb-2" />
                <p className="text-[15px] sm:text-[16px] text-primary-text">Please input valid height and weight values to calculate your BMI.</p>
              </div>
            )}

            {/* Reference Table */}
            <div className="bg-white border border-[#ded9d5] rounded-xl p-6 sm:p-7 shadow-2xs">
              <h3 className="text-[14.5px] sm:text-[15px] font-bold text-foreground mb-3.5">
                WHO Adult BMI Classifications
              </h3>
              <div className="divide-y divide-[#ded9d5] text-[13px] sm:text-[13.5px]">
                {BMI_CATEGORIES.map((item) => (
                  <div key={item.category} className="py-2.5 flex items-center justify-between">
                    <span className="font-medium text-foreground">{item.category}</span>
                    <span className="font-bold text-primary-text">{item.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
