'use client';

import React, { useState, useEffect } from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import AllergyModal from '@/components/my-health/forms/AllergyModal';
import { fetchAllergies, archiveAllergy } from '@/lib/api/my-health';
import { AllergyRecord, AllergySeverity } from '@/types/my-health';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';
import { CardsListShimmer } from '@/shimmer/my-health';
import { Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';

export default function AllergiesPage() {
  const [allergies, setAllergies] = useState<AllergyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAllergy, setEditingAllergy] = useState<AllergyRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copy = MY_HEALTH_HERO_COPY.allergies;

  const refreshAllergies = () => {
    fetchAllergies()
      .then((data) => setAllergies(data))
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    fetchAllergies()
      .then((data) => {
        if (!ignore) setAllergies(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenCreate = () => {
    setEditingAllergy(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: AllergyRecord) => {
    setEditingAllergy(a);
    setIsModalOpen(true);
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Archive this allergy record?')) return;
    try {
      await archiveAllergy(id);
      refreshAllergies();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to archive');
    }
  };

  const getSeverityBadge = (severity: AllergySeverity) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-50 text-red-700 border-red-200/80';
      case 'moderate':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'mild':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      default:
        return 'bg-[#faf7f4] text-muted-foreground border-[#e8e2dc]';
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 md:px-8">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-foreground tracking-tight">
              Documented Allergens & Sensitivities
            </h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Prevent accidental drug interactions and adverse clinical exposures
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>Add Allergy</span>
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <CardsListShimmer count={4} />
        ) : allergies.length === 0 ? (
          <div className="bg-white border border-[#e8e2dc] rounded-lg p-10 text-center">
            <div className="h-12 w-12 mx-auto rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 mb-3">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-[17px] font-bold text-foreground">
              No Allergies Currently Documented
            </h3>
            <p className="text-[13.5px] text-muted-foreground max-w-md mx-auto mt-1 leading-relaxed">
              If you have known sensitivities to medications (such as penicillin or NSAIDs), foods, insect venom, or latex, record them here.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add First Allergy</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            {allergies.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#e8e2dc] rounded-lg p-5 hover:border-primary/30 transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h3 className="text-[16.5px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {item.allergen}
                    </h3>
                    <span
                      className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border capitalize shadow-2xs ${getSeverityBadge(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  {item.reaction ? (
                    <p className="text-[13.5px] text-primary-text mb-2">
                      <strong className="font-semibold text-foreground">Reaction: </strong>
                      {item.reaction}
                    </p>
                  ) : (
                    <p className="text-[13px] text-muted-foreground italic mb-2">
                      No specific reaction described
                    </p>
                  )}

                  {item.note && (
                    <p className="text-[12.5px] text-muted-foreground border-t border-[#f3eee9] pt-2 mt-2 leading-relaxed">
                      {item.note}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#f3eee9] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-[#faf7f4] rounded-lg transition-colors cursor-pointer"
                    title="Edit allergy"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleArchive(item.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Archive allergy"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AllergyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allergyToEdit={editingAllergy}
        onSaved={refreshAllergies}
      />
    </main>
  );
}
