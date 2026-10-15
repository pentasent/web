'use client';

import React, { useState, useEffect } from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import EmergencyContactModal from '@/components/my-health/forms/EmergencyContactModal';
import { fetchEmergencyContacts, deleteEmergencyContact } from '@/lib/api/my-health';
import { EmergencyContactRecord } from '@/types/my-health';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';
import { CardsListShimmer } from '@/shimmer/my-health';
import { PhoneCall, Plus, Edit2, Trash2, Phone } from 'lucide-react';

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<EmergencyContactRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copy = MY_HEALTH_HERO_COPY.emergency;

  const refreshContacts = () => {
    fetchEmergencyContacts()
      .then((data) => setContacts(data))
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    fetchEmergencyContacts()
      .then((data) => {
        if (!ignore) setContacts(data);
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
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: EmergencyContactRecord) => {
    setEditingContact(c);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this emergency contact?')) return;
    try {
      await deleteEmergencyContact(id);
      refreshContacts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete contact');
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
              Designated Emergency Contacts
            </h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Rapid escalation points of contact for acute emergency scenarios
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <CardsListShimmer count={4} />
        ) : contacts.length === 0 ? (
          <div className="bg-white border border-[#e8e2dc] rounded-lg p-10 text-center">
            <div className="h-12 w-12 mx-auto rounded-lg bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 mb-3">
              <PhoneCall size={22} />
            </div>
            <h3 className="text-[17px] font-bold text-foreground">
              No Emergency Contact Designated
            </h3>
            <p className="text-[13.5px] text-muted-foreground max-w-md mx-auto mt-1 leading-relaxed">
              Designating a trusted family member, partner, or close friend ensures rapid notification in urgent clinical situations.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Designate Contact</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-[#e8e2dc] rounded-lg p-5 hover:border-primary/30 transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="text-[16.5px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {c.name}
                    </h3>
                    {c.isPrimary && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                        Primary Contact
                      </span>
                    )}
                  </div>

                  <p className="text-[13px] text-muted-foreground font-medium mb-3">
                    {c.relationship}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-[#f3eee9]">
                    <div className="flex items-center gap-2 text-[14px]">
                      <Phone size={14} className="text-primary shrink-0" />
                      <a
                        href={`tel:${c.phone}`}
                        className="font-bold text-foreground hover:text-primary transition-colors"
                      >
                        {c.phone}
                      </a>
                    </div>

                    {c.alternatePhone && (
                      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Alt:</span>
                        <a
                          href={`tel:${c.alternatePhone}`}
                          className="hover:text-primary transition-colors"
                        >
                          {c.alternatePhone}
                        </a>
                      </div>
                    )}

                    {c.notes && (
                      <p className="text-[12.5px] text-muted-foreground pt-1.5 leading-relaxed">
                        {c.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#f3eee9] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-[#faf7f4] rounded-lg transition-colors cursor-pointer"
                    title="Edit contact"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete contact"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EmergencyContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contactToEdit={editingContact}
        onSaved={refreshContacts}
      />
    </main>
  );
}
