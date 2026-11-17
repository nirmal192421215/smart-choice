import React, { useState } from 'react';
import {
  useAdminDestinations,
  NfcDestination,
} from '../../hooks/useAdminStore';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Globe,
  Radio,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDestinations: React.FC = () => {
  const {
    destinations,
    addDestination,
    updateDestination,
    deleteDestination,
    toggleDestination,
    reorderDestination,
  } = useAdminDestinations();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Edit draft state
  const [draft, setDraft] = useState<Partial<NfcDestination>>({});

  // New item state
  const [newItem, setNewItem] = useState<Omit<NfcDestination, 'id' | 'sortOrder'>>({
    name: '',
    slug: '',
    icon: 'globe',
    color: '#2563EB',
    subtitle: '',
    description: '',
    isActive: true,
  });

  const sortedDestinations = [...destinations].sort((a, b) => a.sortOrder - b.sortOrder);

  const startEdit = (dest: NfcDestination) => {
    setEditingId(dest.id);
    setDraft({ ...dest });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = (id: string) => {
    if (!draft.name?.trim()) {
      toast.error('Destination Name is required');
      return;
    }
    updateDestination(id, draft);
    setEditingId(null);
    setDraft({});
    toast.success('Destination platform updated!');
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) {
      toast.error('Name is required');
      return;
    }

    const slug = newItem.slug.trim() || newItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newDest: NfcDestination = {
      id: `dest_${Date.now().toString(36)}`,
      name: newItem.name.trim(),
      slug: slug,
      icon: newItem.icon || 'globe',
      color: newItem.color || '#2563EB',
      subtitle: newItem.subtitle.trim() || 'Tap to Connect',
      description: newItem.description.trim() || `Instant NFC tap to ${newItem.name}`,
      isActive: newItem.isActive,
      sortOrder: destinations.length,
    };

    addDestination(newDest);
    setIsAddingNew(false);
    setNewItem({
      name: '',
      slug: '',
      icon: 'globe',
      color: '#2563EB',
      subtitle: '',
      description: '',
      isActive: true,
    });
    toast.success(`Added ${newDest.name} destination!`);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-brand-teal" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              NFC Integrations
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-brand-navy mt-1">
            Supported Tap Destinations & Platforms
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure social networks, personal links, and profiles encoded into the NFC chip.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {/* Add New Destination Form Modal/Card */}
      {isAddingNew && (
        <form
          onSubmit={handleAddNew}
          className="bg-teal-50/40 border-2 border-dashed border-brand-teal/40 rounded-3xl p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-brand-navy">
              Add New Tap Destination Platform
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-600">Platform Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. LinkedIn, TikTok"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600">Brand Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={newItem.color}
                  onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                  className="w-9 h-9 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={newItem.color}
                  onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600">Tagline / Subtitle</label>
              <input
                type="text"
                placeholder="e.g. Connect Professionally"
                value={newItem.subtitle}
                onChange={(e) => setNewItem({ ...newItem, subtitle: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600">Description</label>
            <input
              type="text"
              placeholder="e.g. Opens public profile with a single phone tap"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-teal text-white text-xs font-bold hover:bg-brand-teal/90 shadow-sm"
            >
              Save Platform
            </button>
          </div>
        </form>
      )}

      {/* Destinations List Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {sortedDestinations.map((dest, idx) => {
            const isEditing = editingId === dest.id;

            return (
              <div
                key={dest.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  dest.isActive ? 'hover:bg-neutral-50/50' : 'bg-neutral-50/80 opacity-60'
                }`}
              >
                {/* Left: Indicator & info */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Reorder controls */}
                  <div className="flex flex-col gap-1 text-neutral-400">
                    <button
                      onClick={() => reorderDestination(dest.id, 'up')}
                      disabled={idx === 0}
                      className="hover:text-brand-navy disabled:opacity-20 p-0.5"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => reorderDestination(dest.id, 'down')}
                      disabled={idx === sortedDestinations.length - 1}
                      className="hover:text-brand-navy disabled:opacity-20 p-0.5"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Brand Color Dot */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0"
                    style={{ backgroundColor: dest.color }}
                  >
                    {dest.name.charAt(0)}
                  </div>

                  {/* Content or Edit inputs */}
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                      <input
                        type="text"
                        value={draft.name || ''}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        className="px-3 py-1.5 rounded-lg border border-brand-teal text-xs font-bold"
                        placeholder="Platform Name"
                      />
                      <input
                        type="text"
                        value={draft.subtitle || ''}
                        onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        placeholder="Subtitle"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={draft.color || dest.color}
                          onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={draft.color || dest.color}
                          onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                          className="w-20 px-2 py-1 rounded border border-neutral-300 text-xs font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-brand-navy">{dest.name}</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          /{dest.slug}
                        </span>
                        {!dest.isActive && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-neutral-200 text-neutral-600 rounded">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 font-medium">
                        {dest.subtitle} &bull; {dest.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(dest.id)}
                        className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 rounded-xl bg-neutral-200 text-neutral-600 hover:bg-neutral-300 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Active toggle */}
                      <button
                        onClick={() => toggleDestination(dest.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          dest.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-300 hover:bg-neutral-200'
                        }`}
                      >
                        {dest.isActive ? 'Active' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => startEdit(dest)}
                        className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete destination "${dest.name}"?`)) {
                            deleteDestination(dest.id);
                            toast.success(`Removed ${dest.name}`);
                          }
                        }}
                        className="p-2 rounded-xl hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDestinations;
