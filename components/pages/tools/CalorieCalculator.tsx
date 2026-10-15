'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Apple, Info, RotateCcw, Target, PieChart } from 'lucide-react';
import { ACTIVITY_LEVELS, CALORIE_GOALS } from '@/data/tools';

export default function CalorieCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [age, setAge] = useState<number | ''>(30);

  // Metric fields
  const [heightCm, setHeightCm] = useState<number | ''>(170);
  const [weightKg, setWeightKg] = useState<number | ''>(70);

  // Imperial fields
  const [heightFeet, setHeightFeet] = useState<number | ''>(5);
  const [heightInches, setHeightInches] = useState<number | ''>(7);
  const [weightLbs, setWeightLbs] = useState<number | ''>(154);

  // Strategy selections
  const [activityId, setActivityId] = useState<string>('moderate');
  const [goalId, setGoalId] = useState<string>('weight_loss');

  const calorieData = useMemo(() => {
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

    // 1. Calculate BMR (Mifflin-St Jeor)
    let bmr = 10 * wKg + 6.25 * hCm - 5 * a;
    if (gender === 'male') {
      bmr += 5;
    } else {
      mifflinBmr: bmr -= 161;
    }

    // 2. Activity multiplier
    const selectedActivity =
      ACTIVITY_LEVELS.find((l) => l.id === activityId) ?? ACTIVITY_LEVELS[2];
    const tdee = Math.round(bmr * selectedActivity.multiplier);

    // 3. Goal delta
    const selectedGoal =
      CALORIE_GOALS.find((g) => g.id === goalId) ?? CALORIE_GOALS[2];
    const targetCalories = Math.max(tdee + selectedGoal.calorieDelta, 1100);

    // 4. Macro breakdown (Balanced Healthy Diet)
    // Protein: ~25% of calories (4 kcal/g)
    // Carbohydrates: ~50% of calories (4 kcal/g)
    // Fat: ~25% of calories (9 kcal/g)
    const proteinGrams = Math.round((targetCalories * 0.25) / 4);
    const carbsGrams = Math.round((targetCalories * 0.5) / 4);
    const fatGrams = Math.round((targetCalories * 0.25) / 9);

    return {
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      selectedGoal,
      proteinGrams,
      carbsGrams,
      fatGrams,
    };
  }, [unit, gender, age, heightCm, weightKg, heightFeet, heightInches, weightLbs, activityId, goalId]);

  const handleReset = () => {
    setUnit('metric');
    setGender('female');
    setAge(30);
    setHeightCm(170);
    setWeightKg(70);
    setHeightFeet(5);
    setHeightInches(7);
    setWeightLbs(154);
    setActivityId('moderate');
    setGoalId('weight_loss');
  };

  return (
    <div className="w-full bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* =========================================================
              LEFT COLUMN: Interactive Caloric Inputs
              ========================================================= */}
          {/* =========================================================
              LEFT COLUMN: Interactive Caloric Inputs
              ========================================================= */}
          <div className="lg:col-span-7 bg-[#faf9f8] border border-[#ded9d5] rounded-xl p-6 sm:p-8 shadow-2xs">
            {/* Unit Header */}
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
                  placeholder="30"
                />
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unit === 'metric' ? (
                  <div>
                    <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      min="60"
                      max="260"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full h-12 px-4 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                      placeholder="170"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                      Height (ft / in)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="2"
                        max="8"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full h-12 px-3 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary shadow-2xs"
                        placeholder="5 ft"
                      />
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full h-12 px-3 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary shadow-2xs"
                        placeholder="7 in"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-1.5">
                    Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                  </label>
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
                    className="w-full h-12 px-4 text-base text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all placeholder:text-primary-text/60 focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                    placeholder={unit === 'metric' ? '70' : '154'}
                  />
                </div>
              </div>

              {/* Activity Level Selection */}
              <div>
                <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-2">
                  Daily Physical Activity Level
                </label>
                <div className="space-y-2.5">
                  {ACTIVITY_LEVELS.map((level) => (
                    <label
                      key={level.id}
                      onClick={() => setActivityId(level.id)}
                      className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                        activityId === level.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-2xs'
                          : 'border-[#ded9d5] bg-white hover:bg-border-background/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="activityLevel"
                        value={level.id}
                        checked={activityId === level.id}
                        onChange={() => setActivityId(level.id)}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="font-bold text-[14.5px] sm:text-[15px] text-foreground block mb-0.5">
                          {level.label}
                        </span>
                        <span className="text-[13px] sm:text-[13.5px] text-primary-text leading-relaxed block">
                          {level.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Goal Selection */}
              <div>
                <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary-text mb-2">
                  Health & Weight Goal
                </label>
                <select
                  value={goalId}
                  onChange={(e) => setGoalId(e.target.value)}
                  className="w-full h-12 px-4 text-[14.5px] sm:text-[15px] font-semibold text-foreground bg-white border border-[#ded9d5] rounded-xl outline-none transition-all focus:border-primary cursor-pointer shadow-2xs"
                >
                  {CALORIE_GOALS.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.label}
                    </option>
                  ))}
                </select>
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
              RIGHT COLUMN: Target Calorie & Macro Distribution
              ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {calorieData ? (
              <motion.div
                key={`${calorieData.targetCalories}-${goalId}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#ded9d5] rounded-xl p-6 sm:p-8 shadow-2xs"
              >
                <div className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <Target size={14} className="text-[#ffa91f]" />
                  <span>Daily Calorie Target</span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-[44px] sm:text-[52px] font-black tracking-tight text-foreground leading-none">
                    {calorieData.targetCalories.toLocaleString()}
                  </span>
                  <span className="text-[14.5px] sm:text-[15px] font-semibold text-primary-text">
                    kcal / day
                  </span>
                </div>

                <div className="mt-2.5 text-[13px] sm:text-[13.5px] font-bold text-primary">
                  {calorieData.selectedGoal.label}
                </div>

                <p className="mt-2.5 text-[15px] sm:text-[16px] text-primary-text leading-relaxed">
                  {calorieData.selectedGoal.description}
                </p>

                {/* Energy Balance Stats */}
                <div className="mt-6 pt-5 border-t border-[#ded9d5] grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#faf9f8] border border-[#ded9d5] shadow-2xs">
                    <span className="text-primary-text block text-[12px] sm:text-[12.5px] font-medium">BMR (Rest)</span>
                    <span className="font-bold text-foreground text-[15px] sm:text-[16px]">
                      {calorieData.bmr.toLocaleString()} kcal
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#faf9f8] border border-[#ded9d5] shadow-2xs">
                    <span className="text-primary-text block text-[12px] sm:text-[12.5px] font-medium">Maintenance TDEE</span>
                    <span className="font-bold text-foreground text-[15px] sm:text-[16px]">
                      {calorieData.tdee.toLocaleString()} kcal
                    </span>
                  </div>
                </div>

                {/* Macronutrient Distribution Recommendation */}
                <div className="mt-6 pt-5 border-t border-[#ded9d5]">
                  <div className="flex items-center gap-1.5 text-[13px] sm:text-[13.5px] font-bold uppercase tracking-wider text-foreground mb-3.5">
                    <PieChart size={15} className="text-primary" />
                    <span>Recommended Macronutrient Targets</span>
                  </div>

                  {/* Multi-segment Bar */}
                  <div className="flex h-3 w-full rounded-full overflow-hidden mb-4">
                    <div style={{ width: '25%' }} className="bg-[#6b185f]" title="Protein (25%)" />
                    <div style={{ width: '50%' }} className="bg-[#ffa91f]" title="Carbs (50%)" />
                    <div style={{ width: '25%' }} className="bg-[#1b6d47]" title="Healthy Fats (25%)" />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-primary/5 border border-primary/10 shadow-2xs">
                      <span className="font-bold text-[#6b185f] block text-[13px] sm:text-[13.5px]">Protein</span>
                      <span className="text-[15px] sm:text-[16px] font-bold text-foreground">{calorieData.proteinGrams}g</span>
                      <span className="text-[11.5px] sm:text-[12px] text-primary-text block mt-0.5">25% (4 kcal/g)</span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-[#ffa91f]/10 border border-[#ffa91f]/20 shadow-2xs">
                      <span className="font-bold text-[#b45309] block text-[13px] sm:text-[13.5px]">Carbs</span>
                      <span className="text-[15px] sm:text-[16px] font-bold text-foreground">{calorieData.carbsGrams}g</span>
                      <span className="text-[11.5px] sm:text-[12px] text-primary-text block mt-0.5">50% (4 kcal/g)</span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                      <span className="font-bold text-emerald-800 block text-[13px] sm:text-[13.5px]">Fats</span>
                      <span className="text-[15px] sm:text-[16px] font-bold text-foreground">{calorieData.fatGrams}g</span>
                      <span className="text-[11.5px] sm:text-[12px] text-primary-text block mt-0.5">25% (9 kcal/g)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#faf9f8] border border-[#ded9d5] rounded-xl p-8 text-center text-primary-text shadow-2xs">
                <Info size={32} className="mx-auto text-primary-text mb-2" />
                <p className="text-[15px] sm:text-[16px] text-primary-text">Please input valid parameters to calculate your caloric targets.</p>
              </div>
            )}

            {/* Pacing Advice */}
            <div className="bg-white border border-[#ded9d5] rounded-xl p-6 sm:p-7 shadow-2xs">
              <h4 className="font-bold text-foreground text-[15px] sm:text-[16px] mb-2.5 flex items-center gap-2">
                <Apple size={16} className="text-primary" />
                <span>Sustainable Calorie Management</span>
              </h4>
              <p className="text-[14.5px] sm:text-[15.5px] text-primary-text leading-relaxed">
                Clinical nutrition guidelines emphasize consistency over drastic restriction. A deficit between 250 to 500 kcal/day promotes healthy fat loss while preserving metabolic health and lean muscle mass.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
