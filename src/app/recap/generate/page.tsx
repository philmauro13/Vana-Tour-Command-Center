'use client';

import { useState, useEffect } from 'react';
import { ROUTING_DATA } from '@/lib/data';

// ═══════════════════════════════════════════════════════════════
// Generate Recap — Enter show metrics, get a shareable link
// ═══════════════════════════════════════════════════════════════

interface ShowEntry {
  date: string;
  city: string;
  venue: string;
  doorCount: string;
  capacity: string;
  ticketSales: string;
  merchTopItem: string;
  settlement: string;
  guarantee: string;
}

interface AnnouncementEntry {
  message: string;
  category: 'general' | 'alert' | 'celebration' | 'logistics' | 'safety';
}

const EMPTY_ANNOUNCEMENT: AnnouncementEntry = { message: '', category: 'general' };

export default function GenerateRecap() {
  const [selectedDate, setSelectedDate] = useState('');
  const [form, setForm] = useState<ShowEntry | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementEntry[]>([{ ...EMPTY_ANNOUNCEMENT }]);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Show dates only
  const showDates = ROUTING_DATA.filter(d => d.type === 'SHOW');

  // When date changes, populate the form
  useEffect(() => {
    if (!selectedDate) { setForm(null); return; }
    const day = ROUTING_DATA.find(d => d.date === selectedDate);
    if (!day) return;
    setForm({
      date: selectedDate,
      city: day.city,
      venue: day.venue || '',
      doorCount: '',
      capacity: '',
      ticketSales: '',
      merchTopItem: '',
      settlement: '',
      guarantee: '',
    });
    setGeneratedUrl('');
  }, [selectedDate]);

  const updateField = (field: keyof ShowEntry, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  const addAnnouncement = () => {
    setAnnouncements([...announcements, { ...EMPTY_ANNOUNCEMENT }]);
  };

  const removeAnnouncement = (idx: number) => {
    setAnnouncements(announcements.filter((_, i) => i !== idx));
  };

  const updateAnnouncement = (idx: number, field: keyof AnnouncementEntry, value: string) => {
    const updated = [...announcements];
    updated[idx] = { ...updated[idx], [field]: value };
    setAnnouncements(updated);
  };

  // Generate the recap URL
  const handleGenerate = () => {
    if (!form) return;
    // Store data in localStorage for the recap page to pick up (demo mode)
    const recapData = {
      doorCount: parseInt(form.doorCount) || 0,
      capacity: parseInt(form.capacity) || 0,
      ticketSales: parseInt(form.ticketSales) || 0,
      merchTopItem: form.merchTopItem,
      settlement: parseInt(form.settlement) || 0,
      guarantee: parseInt(form.guarantee) || 0,
      announcements: announcements.filter(a => a.message.trim()),
    };
    localStorage.setItem(`tourhq_recap_${form.date}`, JSON.stringify(recapData));

    // Build the URL
    const url = `${window.location.origin}/recap/${form.date}`;
    setGeneratedUrl(url);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = generatedUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-[520px] px-5 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <a href="/" className="mb-4 inline-block text-xs text-dim hover:text-cyan">← Back to Command Center</a>
        <h1 className="text-2xl font-black text-text">Generate Show Recap</h1>
        <p className="mt-1 text-sm text-dim">Enter tonight's numbers. Get a shareable link for the band.</p>
      </div>

      {/* Date picker */}
      <div className="mb-6">
        <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-wider text-dim">Select Show Date</label>
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="w-full rounded-xl border border-border bg-bg-card px-4 py-3 text-sm text-text outline-none focus:border-accent/50"
        >
          <option value="">— Pick a date —</option>
          {showDates.map(d => (
            <option key={d.date} value={d.date}>
              {d.date} — {d.city} @ {d.venue}
            </option>
          ))}
        </select>
      </div>

      {form && (
        <>
          {/* Show info */}
          <div className="mb-6 rounded-xl border border-border bg-bg-card p-4">
            <div className="mb-1 text-lg font-bold">{form.city}</div>
            <div className="text-xs text-dim">{form.venue} • {form.date}</div>
          </div>

          {/* The 4 Key Fields */}
          <div className="mb-6">
            <label className="mb-3 block text-[0.65rem] font-bold uppercase tracking-wider text-dim">
              🎯 Show Metrics (the 4 numbers the recap needs)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Door Count" value={form.doorCount} onChange={v => updateField('doorCount', v)}
                placeholder="312" icon="👥" />
              <InputField label="Venue Capacity" value={form.capacity} onChange={v => updateField('capacity', v)}
                placeholder="400" icon="🏟️" />
              <InputField label="Ticket Sales" value={form.ticketSales} onChange={v => updateField('ticketSales', v)}
                placeholder="298" icon="🎟️" />
              <InputField label="Top Merch Item" value={form.merchTopItem} onChange={v => updateField('merchTopItem', v)}
                placeholder="Lady in Red Tee" icon="🏆" isText />
            </div>
          </div>

          {/* Settlement (optional but useful) */}
          <div className="mb-6">
            <label className="mb-3 block text-[0.65rem] font-bold uppercase tracking-wider text-dim">
              💰 Settlement (optional — pulls from Tour HQ if empty)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Total Settlement" value={form.settlement} onChange={v => updateField('settlement', v)}
                placeholder="2800" prefix="$" />
              <InputField label="Guarantee" value={form.guarantee} onChange={v => updateField('guarantee', v)}
                placeholder="2500" prefix="$" />
            </div>
          </div>

          {/* Announcements */}
          <div className="mb-6">
            <label className="mb-3 block text-[0.65rem] font-bold uppercase tracking-wider text-dim">
              📢 Announcements for the Band
            </label>
            <div className="space-y-3">
              {announcements.map((a, idx) => (
                <div key={idx} className="flex gap-2">
                  <select
                    value={a.category}
                    onChange={e => updateAnnouncement(idx, 'category', e.target.value)}
                    className="w-28 shrink-0 rounded-lg border border-border bg-bg-card px-2 py-2 text-xs text-text outline-none focus:border-accent/50"
                  >
                    <option value="general">General</option>
                    <option value="logistics">Logistics</option>
                    <option value="celebration">Celebration</option>
                    <option value="alert">Alert</option>
                    <option value="safety">Safety</option>
                  </select>
                  <input
                    type="text"
                    value={a.message}
                    onChange={e => updateAnnouncement(idx, 'message', e.target.value)}
                    placeholder="e.g. Load-in tomorrow at 10am"
                    className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text outline-none focus:border-accent/50"
                  />
                  {announcements.length > 1 && (
                    <button onClick={() => removeAnnouncement(idx)}
                      className="shrink-0 rounded-lg px-2 text-dim hover:text-accent">✕</button>
                  )}
                </div>
              ))}
              <button onClick={addAnnouncement}
                className="text-xs text-cyan hover:text-cyan/80">+ Add announcement</button>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!form.doorCount || !form.capacity}
            className="mb-6 w-full rounded-xl bg-gradient-to-r from-accent to-[#ff1744] py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(217,4,41,0.3)] transition-all hover:shadow-[0_0_30px_rgba(217,4,41,0.5)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            🎤 Generate Recap Link
          </button>

          {/* Generated URL */}
          {generatedUrl && (
            <div className="mb-6 rounded-xl border border-success/20 bg-success/5 p-4">
              <div className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider text-success">
                ✅ Recap Ready!
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2 font-mono text-xs text-text"
                />
                <button
                  onClick={copyUrl}
                  className="shrink-0 rounded-lg bg-success/20 px-4 py-2 text-xs font-bold text-success hover:bg-success/30"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <div className="mt-2 text-xs text-dim">
                Share this link with the band. They see the recap — not the budget.
              </div>
              <a href={generatedUrl} target="_blank" rel="noopener"
                className="mt-2 inline-block text-xs text-cyan hover:underline">
                Preview recap →
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Input field component ─────────────────────────────────────────

function InputField({ label, value, onChange, placeholder, icon, prefix, isText }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; icon?: string; prefix?: string; isText?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 text-[0.55rem] font-semibold uppercase tracking-wider text-dim">
        {icon && <span className="mr-1">{icon}</span>}{label}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dim">{prefix}</span>
        )}
        <input
          type={isText ? 'text' : 'number'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-border bg-bg-card py-2 text-sm text-text outline-none focus:border-accent/50 ${prefix ? 'pl-7 pr-3' : 'px-3'}`}
        />
      </div>
    </div>
  );
}
