'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Info, RotateCcw, Activity } from 'lucide-react';
import { ACTIVITY_LEVELS } from '@/data/tools';

export default function BmrCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [age, setAge] = useState<number | ''>(29);

  // Metric fields
  const [heightCm, setHeightCm] = useState<number | ''>(168);
  const [weightKg, setWeightKg] = useState<number | ''>(64);

  // Imperial fields
  const [heightFeet, setHeightFeet] = useState<number | ''>(5);
  const [heightInches, setHeightInches] = useState<number | ''>(6);
  const [weightLbs, setWeightLbs] = useState<number | ''>(141);

  const bmrResult = useMemo(() => {
    let wKg = 0;
    let hCm = 0;

    if (unit === 'metric') {
      wKg = Number(weightKg);
      hCm = Number(heightCm);
    } else {
      const ft = Number(heightFeet);
      const inch = Number(heightInches);
      const totalInches = ft * 12 + inch;
      hCm = totalInches * 2.54;
      wKg = Number(weightLbs) * 0.453592;
    }

    const a = Number(age);
    if (!wKg || !hCm || !a || wKg <= 0 || hCm <= 0 || a <= 0) return null;

    // Mifflin-St Jeor Equation
    let mifflinBmr = 10 * wKg + 6.25 * hCm - 5 * a;
    if (gender === 'male') {
      mifflinBmr += 5;
    } else {
      mifflinBmr -= 161;
    }

    // Harris-Benedict Revised Equation comparison
    let hBenedictBmr = 0;
    if (gender === 'male') {
      hBenedictBmr = 88.362 + 13.397 * wKg + 4.799 * hCm - 5.677 * a;
    } else {
      hBenedictBmr = 447.593 + 9.247 * wKg + 3.098 * hCm - 4.33 * a;
    }

    return {
      bmr: Math.round(mifflinBmr),
      harrisBenedict: Math.round(hBenedictBmr),
      activityExpenditures: ACTIVITY_LEVELS.map((lvl) => ({
        ...lvl,
        calories: Math.round(mifflinBmr * lvl.multiplier),
      })),
    };
  }, [unit, gender, age, heightCm, weightKg, heightFeet, heightInches, weightLbs]);

  const handleReset = () => {
    setUnit('metric');
    setGender('female');
    setAge(29);
    setHeightCm(168);
    setWeightKg(64);
    setHeightFeet(5);
    setHeightInches(6);
    setWeightLbs(141);
  };

  return (
    <div className="w-full bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* =========================================================
              LEFT COLUMN: Interactive BMR Inputs
              ========================================================= */}
          <div className="lg:col-span-7 bg-[#faf9f8] border border-[#ded9d5] rounded-xl p-6 sm:p-8 shadow-2xs">
            {/* Units Toggle */}
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
              {/* Biological Sex */}
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
                  min="10"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-12 px-4 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                  placeholder="29"
                />
              </div>

              {/* Height */}
              {unit === 'metric' ? (
                <div>
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                    Height (centimeters)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="60"
                      max="260"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full h-12 px-4 pr-12 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                      placeholder="168"
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
                        placeholder="6"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-text">
                        in
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Weight */}
              <div>
                <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                  Weight ({unit === 'metric' ? 'kilograms' : 'pounds'})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="20"
                    max="450"
                    value={unit === 'metric' ? weightKg : weightLbs}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      if (unit === 'metric') setWeightKg(val);
                      else setWeightLbs(val);
                    }}
                    className="w-full h-12 px-4 pr-12 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                    placeholder={unit === 'metric' ? '64' : '141'}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-text">
                    {unit === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>
              </div>

              {/* Reset */}
              <div className="pt-2">
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
              RIGHT COLUMN: BMR Results & Daily Expenditure Breakdown
              ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {bmrResult ? (
              <motion.div
                key={bmrResult.bmr}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#ded9d5] rounded-xl p-6 sm:p-8 shadow-2xs"
              >
                <div className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <Flame size={14} className="text-[#ffa91f]" />
                  <span>Basal Metabolic Rate</span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-[44px] sm:text-[52px] font-black tracking-tight text-foreground leading-none">
                    {bmrResult.bmr.toLocaleString()}
                  </span>
                  <span className="text-[14.5px] sm:text-[15px] font-semibold text-primary-text">
                    kcal / day
                  </span>
                </div>

                <p className="mt-3.5 text-[15px] sm:text-[16px] text-primary-text leading-relaxed">
                  Your body burns approximately <strong className="text-foreground">{bmrResult.bmr} calories</strong> every 24 hours purely sustaining vegetative functions at complete rest.
                </p>

                {/* Harris-Benedict comparison note */}
                <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-[#faf9f8] border border-[#ded9d5] text-[13.5px] sm:text-[14px] text-primary-text flex items-center justify-between shadow-2xs">
                  <span>Harris-Benedict Formula:</span>
                  <span className="font-bold text-foreground">{bmrResult.harrisBenedict.toLocaleString()} kcal</span>
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#faf9f8] border border-[#ded9d5] rounded-xl p-8 text-center text-primary-text shadow-2xs">
                <Info size={32} className="mx-auto text-primary-text mb-2" />
                <p className="text-[15px] sm:text-[16px] text-primary-text">Please input valid parameters to calculate your BMR.</p>
              </div>
            )}

            {/* Daily Energy Expenditure Table by Activity */}
            {bmrResult && (
              <div className="bg-white border border-[#ded9d5] rounded-xl p-6 sm:p-7 shadow-2xs">
                <div className="flex items-center gap-2 text-[14px] sm:text-[14.5px] font-bold text-foreground mb-3.5">
                  <Activity size={16} className="text-primary" />
                  <span>Daily Calories by Activity Level (TDEE)</span>
                </div>

                <div className="divide-y divide-[#ded9d5] text-[13px] sm:text-[13.5px]">
                  {bmrResult.activityExpenditures.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-foreground block text-[14px] sm:text-[14.5px]">{item.label}</span>
                        <span className="text-primary-text text-[12.5px] sm:text-[13px] mt-0.5 block">{item.description}</span>
                      </div>
                      <span className="font-bold text-primary text-[14.5px] sm:text-[15px] whitespace-nowrap">
                        {item.calories.toLocaleString()} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
