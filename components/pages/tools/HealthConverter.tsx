'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  Thermometer,
  Heart,
  Droplet,
  Scale,
  Ruler,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { ConverterType, HealthConverterTab } from '@/types/tools';
import { HEALTH_CONVERTER_TABS } from '@/data/tools';

export default function HealthConverter() {
  const [activeConverter, setActiveConverter] = useState<ConverterType>('blood-glucose');

  // 1. Blood Glucose States
  const [glucoseMgDl, setGlucoseMgDl] = useState<string>('95');
  const [glucoseMmolL, setGlucoseMmolL] = useState<string>('5.3');

  const handleGlucoseMgChange = (val: string) => {
    setGlucoseMgDl(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setGlucoseMmolL((num / 18.0182).toFixed(1));
    } else {
      setGlucoseMmolL('');
    }
  };

  const handleGlucoseMmolChange = (val: string) => {
    setGlucoseMmolL(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setGlucoseMgDl(Math.round(num * 18.0182).toString());
    } else {
      setGlucoseMgDl('');
    }
  };

  // 2. Temperature States
  const [tempC, setTempC] = useState<string>('37.0');
  const [tempF, setTempF] = useState<string>('98.6');

  const handleTempCChange = (val: string) => {
    setTempC(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setTempF((num * 1.8 + 32).toFixed(1));
    } else {
      setTempF('');
    }
  };

  const handleTempFChange = (val: string) => {
    setTempF(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setTempC(((num - 32) / 1.8).toFixed(1));
    } else {
      setTempC('');
    }
  };

  // 3. Blood Pressure States
  const [sysMmHg, setSysMmHg] = useState<string>('120');
  const [diaMmHg, setDiaMmHg] = useState<string>('80');

  const [sysKpa, setSysKpa] = useState<string>('16.0');
  const [diaKpa, setDiaKpa] = useState<string>('10.7');

  const handleMmHgChange = (sys: string, dia: string) => {
    setSysMmHg(sys);
    setDiaMmHg(dia);
    const s = parseFloat(sys);
    const d = parseFloat(dia);
    if (!isNaN(s)) setSysKpa((s * 0.133322).toFixed(1));
    if (!isNaN(d)) setDiaKpa((d * 0.133322).toFixed(1));
  };

  const handleKpaChange = (sKpa: string, dKpa: string) => {
    setSysKpa(sKpa);
    setDiaKpa(dKpa);
    const s = parseFloat(sKpa);
    const d = parseFloat(dKpa);
    if (!isNaN(s)) setSysMmHg(Math.round(s * 7.50062).toString());
    if (!isNaN(d)) setDiaMmHg(Math.round(d * 7.50062).toString());
  };

  // 4. Weight States
  const [weightKg, setWeightKg] = useState<string>('70');
  const [weightLbs, setWeightLbs] = useState<string>('154.3');
  const [weightStone, setWeightStone] = useState<string>('11.0');

  const handleWeightKgChange = (val: string) => {
    setWeightKg(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const lbs = num * 2.20462;
      setWeightLbs(lbs.toFixed(1));
      setWeightStone((lbs / 14).toFixed(1));
    } else {
      setWeightLbs('');
      setWeightStone('');
    }
  };

  const handleWeightLbsChange = (val: string) => {
    setWeightLbs(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setWeightKg((num * 0.453592).toFixed(1));
      setWeightStone((num / 14).toFixed(1));
    } else {
      setWeightKg('');
      setWeightStone('');
    }
  };

  // 5. Height States
  const [heightCm, setHeightCm] = useState<string>('175');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('9');

  const handleHeightCmChange = (val: string) => {
    setHeightCm(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const totalInches = num / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inc = Math.round(totalInches % 12);
      setHeightFt(ft.toString());
      setHeightIn(inc.toString());
    } else {
      setHeightFt('');
      setHeightIn('');
    }
  };

  const handleHeightFtInChange = (ftStr: string, inStr: string) => {
    setHeightFt(ftStr);
    setHeightIn(inStr);
    const ft = parseFloat(ftStr) || 0;
    const inc = parseFloat(inStr) || 0;
    const totalInches = ft * 12 + inc;
    if (totalInches > 0) {
      setHeightCm(Math.round(totalInches * 2.54).toString());
    }
  };

  // 6. Cholesterol States
  const [cholMgDl, setCholMgDl] = useState<string>('190');
  const [cholMmolL, setCholMmolL] = useState<string>('4.9');

  const handleCholMgChange = (val: string) => {
    setCholMgDl(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setCholMmolL((num / 38.67).toFixed(1));
    } else {
      setCholMmolL('');
    }
  };

  const handleCholMmolChange = (val: string) => {
    setCholMmolL(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setCholMgDl(Math.round(num * 38.67).toString());
    } else {
      setCholMgDl('');
    }
  };

  // Fasting glucose category badge helper
  const getGlucoseStatus = () => {
    const mg = parseFloat(glucoseMgDl);
    if (isNaN(mg) || mg <= 0) return null;
    if (mg < 70) return { label: 'Low (Hypoglycemic)', color: '#0284c7', bg: '#e0f2fe' };
    if (mg <= 99) return { label: 'Normal Fasting Range', color: '#16a34a', bg: '#dcfce7' };
    if (mg <= 125) return { label: 'Elevated (Pre-diabetes)', color: '#ea580c', bg: '#ffedd5' };
    return { label: 'High (Diabetes Evaluation)', color: '#dc2626', bg: '#fee2e2' };
  };

  const glucoseStatus = getGlucoseStatus();

  const getConverterIcon = (iconName: HealthConverterTab['iconName']) => {
    switch (iconName) {
      case 'droplet':
        return <Droplet size={15} />;
      case 'heart':
        return <Heart size={15} />;
      case 'thermometer':
        return <Thermometer size={15} />;
      case 'scale':
        return <Scale size={15} />;
      case 'ruler':
        return <Ruler size={15} />;
      case 'activity':
      default:
        return <Activity size={15} />;
    }
  };

  return (
    <div className="w-full bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12">
        {/* Converter Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#faf9f8] border border-[#ded9d5] rounded-xl shadow-2xs mb-10 max-w-7xl">
          {HEALTH_CONVERTER_TABS.map((tab) => {
            const isActive = activeConverter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveConverter(tab.id)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[13px] sm:text-[13.5px] font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-primary-text hover:text-foreground hover:bg-[#f0eeeb]'
                }`}
              >
                {getConverterIcon(tab.iconName)}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Converter Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7 bg-[#faf9f8] border border-[#ded9d5] rounded-xl p-6 sm:p-8 shadow-2xs">
            <AnimatePresence mode="wait">
              {/* 1. Blood Glucose */}
              {activeConverter === 'blood-glucose' && (
                <motion.div
                  key="glucose"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-[15px] sm:text-[16px]">
                    <Droplet size={18} />
                    <span>Blood Sugar (Glucose) Unit Converter</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        mg/dL (US Standard)
                      </label>
                      <input
                        type="number"
                        value={glucoseMgDl}
                        onChange={(e) => handleGlucoseMgChange(e.target.value)}
                        className="w-full h-12 px-4 text-base font-bold text-foreground bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="95"
                      />
                    </div>

                    <div className="hidden sm:flex items-center justify-center pt-6 text-primary-text">
                      <ArrowRightLeft size={18} />
                    </div>

                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        mmol/L (International / UK)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={glucoseMmolL}
                        onChange={(e) => handleGlucoseMmolChange(e.target.value)}
                        className="w-full h-12 px-4 text-base font-bold text-foreground bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="5.3"
                      />
                    </div>
                  </div>

                  {glucoseStatus && (
                    <div className="pt-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] sm:text-[13.5px] font-semibold shadow-2xs"
                        style={{ backgroundColor: glucoseStatus.bg, color: glucoseStatus.color }}
                      >
                        <CheckCircle2 size={15} />
                        <span>Fasting Evaluation: {glucoseStatus.label}</span>
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* 2. Blood Pressure */}
              {activeConverter === 'blood-pressure' && (
                <motion.div
                  key="bp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-[15px] sm:text-[16px]">
                    <Heart size={18} />
                    <span>Blood Pressure (mmHg ↔ kPa) Converter</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3 p-5 rounded-xl bg-white border border-[#ded9d5] shadow-2xs">
                      <span className="text-[13.5px] sm:text-[14px] font-semibold text-foreground block">
                        Standard Pressure (mmHg)
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[12px] sm:text-[12.5px] font-medium text-primary-text block mb-1">Systolic</span>
                          <input
                            type="number"
                            value={sysMmHg}
                            onChange={(e) => handleMmHgChange(e.target.value, diaMmHg)}
                            className="w-full h-11 px-3 text-base font-bold bg-[#faf9f8] border border-[#ded9d5] rounded-lg shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                        <div>
                          <span className="text-[12px] sm:text-[12.5px] font-medium text-primary-text block mb-1">Diastolic</span>
                          <input
                            type="number"
                            value={diaMmHg}
                            onChange={(e) => handleMmHgChange(sysMmHg, e.target.value)}
                            className="w-full h-11 px-3 text-base font-bold bg-[#faf9f8] border border-[#ded9d5] rounded-lg shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 p-5 rounded-xl bg-white border border-[#ded9d5] shadow-2xs">
                      <span className="text-[13.5px] sm:text-[14px] font-semibold text-foreground block">
                        Kilopascals (kPa)
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[12px] sm:text-[12.5px] font-medium text-primary-text block mb-1">Systolic</span>
                          <input
                            type="number"
                            step="0.1"
                            value={sysKpa}
                            onChange={(e) => handleKpaChange(e.target.value, diaKpa)}
                            className="w-full h-11 px-3 text-base font-bold bg-[#faf9f8] border border-[#ded9d5] rounded-lg shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                        <div>
                          <span className="text-[12px] sm:text-[12.5px] font-medium text-primary-text block mb-1">Diastolic</span>
                          <input
                            type="number"
                            step="0.1"
                            value={diaKpa}
                            onChange={(e) => handleKpaChange(sysKpa, e.target.value)}
                            className="w-full h-11 px-3 text-base font-bold bg-[#faf9f8] border border-[#ded9d5] rounded-lg shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. Temperature */}
              {activeConverter === 'temperature' && (
                <motion.div
                  key="temp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-[15px] sm:text-[16px]">
                    <Thermometer size={18} />
                    <span>Body Temperature Converter (°C ↔ °F)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        Celsius (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={tempC}
                        onChange={(e) => handleTempCChange(e.target.value)}
                        className="w-full h-12 px-4 text-base font-bold text-foreground bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="37.0"
                      />
                    </div>

                    <div className="hidden sm:flex items-center justify-center pt-6 text-primary-text">
                      <ArrowRightLeft size={18} />
                    </div>

                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        Fahrenheit (°F)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={tempF}
                        onChange={(e) => handleTempFChange(e.target.value)}
                        className="w-full h-12 px-4 text-base font-bold text-foreground bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="98.6"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 4. Weight */}
              {activeConverter === 'weight' && (
                <motion.div
                  key="weight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-[15px] sm:text-[16px]">
                    <Scale size={18} />
                    <span>Mass & Weight Multi-Unit Converter</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        Kilograms (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={weightKg}
                        onChange={(e) => handleWeightKgChange(e.target.value)}
                        className="w-full h-12 px-3 text-base font-bold bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        Pounds (lbs)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={weightLbs}
                        onChange={(e) => handleWeightLbsChange(e.target.value)}
                        className="w-full h-12 px-3 text-base font-bold bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        Stones (st)
                      </label>
                      <input
                        type="number"
                        readOnly
                        value={weightStone}
                        className="w-full h-12 px-3 text-base font-bold bg-border-background border border-[#ded9d5] rounded-xl shadow-2xs text-primary-text"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 5. Height */}
              {activeConverter === 'height' && (
                <motion.div
                  key="height"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-[15px] sm:text-[16px]">
                    <Ruler size={18} />
                    <span>Height & Dimension Converter</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        Centimeters (cm)
                      </label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => handleHeightCmChange(e.target.value)}
                        className="w-full h-12 px-4 text-base font-bold bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                          Feet (ft)
                        </label>
                        <input
                          type="number"
                          value={heightFt}
                          onChange={(e) => handleHeightFtInChange(e.target.value, heightIn)}
                          className="w-full h-12 px-3 text-base font-bold bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                          Inches (in)
                        </label>
                        <input
                          type="number"
                          value={heightIn}
                          onChange={(e) => handleHeightFtInChange(heightFt, e.target.value)}
                          className="w-full h-12 px-3 text-base font-bold bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 6. Cholesterol */}
              {activeConverter === 'cholesterol' && (
                <motion.div
                  key="chol"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-[15px] sm:text-[16px]">
                    <Activity size={18} />
                    <span>Total Cholesterol Converter (mg/dL ↔ mmol/L)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        mg/dL (US)
                      </label>
                      <input
                        type="number"
                        value={cholMgDl}
                        onChange={(e) => handleCholMgChange(e.target.value)}
                        className="w-full h-12 px-4 text-base font-bold text-foreground bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="190"
                      />
                    </div>

                    <div className="hidden sm:flex items-center justify-center pt-6 text-primary-text">
                      <ArrowRightLeft size={18} />
                    </div>

                    <div>
                      <label className="block text-[13px] sm:text-[13.5px] font-semibold text-primary-text mb-2">
                        mmol/L (UK/International)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={cholMmolL}
                        onChange={(e) => handleCholMmolChange(e.target.value)}
                        className="w-full h-12 px-4 text-base font-bold text-foreground bg-white border border-[#ded9d5] rounded-xl shadow-2xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="4.9"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Clinical Reference & Guides */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border border-[#ded9d5] rounded-xl p-6 sm:p-7 shadow-2xs">
              <h3 className="text-[15px] sm:text-[16px] font-bold text-foreground mb-4 flex items-center gap-2">
                <Info size={17} className="text-primary shrink-0" />
                <span>Clinical Reference Guide</span>
              </h3>

              {activeConverter === 'blood-glucose' && (
                <div className="divide-y divide-[#ded9d5] text-[13.5px] sm:text-[14px]">
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Normal Fasting</span>
                    <span className="text-emerald-700 font-bold">70–99 mg/dL (3.9–5.5 mmol/L)</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Pre-diabetes</span>
                    <span className="text-amber-700 font-bold">100–125 mg/dL (5.6–6.9 mmol/L)</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Diabetes Threshold</span>
                    <span className="text-rose-700 font-bold">≥ 126 mg/dL (≥ 7.0 mmol/L)</span>
                  </div>
                </div>
              )}

              {activeConverter === 'blood-pressure' && (
                <div className="divide-y divide-[#ded9d5] text-[13.5px] sm:text-[14px]">
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Normal</span>
                    <span className="text-emerald-700 font-bold">&lt; 120 / &lt; 80 mmHg</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Elevated</span>
                    <span className="text-amber-700 font-bold">120–129 / &lt; 80 mmHg</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Hypertension Stage 1</span>
                    <span className="text-rose-700 font-bold">130–139 / 80–89 mmHg</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Hypertension Stage 2</span>
                    <span className="text-red-800 font-bold">≥ 140 / ≥ 90 mmHg</span>
                  </div>
                </div>
              )}

              {activeConverter === 'temperature' && (
                <div className="divide-y divide-[#ded9d5] text-[13.5px] sm:text-[14px]">
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Normal Body Temp</span>
                    <span className="text-emerald-700 font-bold">36.5°C – 37.5°C (97.7°F – 99.5°F)</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Low-grade Fever</span>
                    <span className="text-amber-700 font-bold">37.6°C – 38.0°C (99.7°F – 100.4°F)</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Fever Threshold</span>
                    <span className="text-rose-700 font-bold">&gt; 38.0°C (&gt; 100.4°F)</span>
                  </div>
                </div>
              )}

              {activeConverter === 'cholesterol' && (
                <div className="divide-y divide-[#ded9d5] text-[13.5px] sm:text-[14px]">
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Desirable Total</span>
                    <span className="text-emerald-700 font-bold">&lt; 200 mg/dL (&lt; 5.2 mmol/L)</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Borderline High</span>
                    <span className="text-amber-700 font-bold">200–239 mg/dL (5.2–6.2 mmol/L)</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-foreground">High Risk</span>
                    <span className="text-rose-700 font-bold">≥ 240 mg/dL (≥ 6.2 mmol/L)</span>
                  </div>
                </div>
              )}

              {(activeConverter === 'weight' || activeConverter === 'height') && (
                <div className="pt-1">
                  <p className="text-[14px] sm:text-[15px] text-primary-text leading-relaxed">
                    Standard medical charts commonly reference metric units (cm, kg) for medication dosing and Body Mass Index (BMI) computations, while clinical records in the US and UK frequently use imperial units.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
