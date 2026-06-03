import { useState, useCallback, useEffect, useRef } from 'react';

const TABS = [
  { id: 'inputs',      icon: '⚙️',  label: 'Settings' },
  { id: 'portfolio',   icon: '💼',  label: 'Asset Allocation' },
  { id: 'roadmap',     icon: '📈',  label: 'Growth Roadmap' },
  { id: 'swp',         icon: '💸',  label: 'SWP Strategy' },
  { id: 'statement',   icon: '📋',  label: 'Financial Statement' },
  { id: 'risks',       icon: '🛡️', label: 'Strategy & Risks' },
  { id: 'hours',       icon: '⏱️',  label: 'Hours Investing' },
  { id: 'retirement',  icon: '🏖️',  label: 'Retirement Plan' },
];

function ConfirmDeleteModal({ profileName, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal-card">
        <p className="modal-title">Delete Profile</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', margin: '0 0 20px' }}>
          Are you sure you want to delete <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>"{profileName}"</span>? This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn modal-btn-delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function NewProfileModal({ onConfirm, onCancel }) {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const handleSubmit = () => {
    if (name.trim()) onConfirm(name.trim());
  };

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal-card">
        <p className="modal-title">New Profile</p>
        <input
          ref={inputRef}
          className="modal-input"
          type="text"
          placeholder="Profile name…"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
          maxLength={48}
        />
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn modal-btn-confirm" disabled={!name.trim()} onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default function TabNav({
  activeTab, onTabChange,
  profiles, activeProfileId,
  onSaveProfile, onNewProfile, onLoadProfile, onDeleteProfile,
}) {
  const [savedFlash, setSavedFlash] = useState(false);
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleSave = useCallback(() => {
    onSaveProfile();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }, [onSaveProfile]);

  const handleNewConfirm = (name) => {
    setShowNewProfileModal(false);
    onNewProfile(name);
  };

  const deleteTargetName = profiles.find(p => p.id === deleteTargetId)?.name ?? '';

  return (
    <>
      {deleteTargetId && (
        <ConfirmDeleteModal
          profileName={deleteTargetName}
          onConfirm={() => { onDeleteProfile(deleteTargetId); setDeleteTargetId(null); }}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
      {showNewProfileModal && (
        <NewProfileModal
          onConfirm={handleNewConfirm}
          onCancel={() => setShowNewProfileModal(false)}
        />
      )}

      <nav className="tab-bar">
        <div className="tab-bar-scroll">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-bar-actions">
          <select
            className="profile-select"
            value={activeProfileId || ''}
            onChange={e => onLoadProfile(e.target.value)}
          >
            {profiles.length === 0
              ? <option value="" disabled>No saved profiles</option>
              : <>
                  {!activeProfileId && <option value="" disabled>Choose profile…</option>}
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </>
            }
          </select>

          <button
            className={`profile-btn${savedFlash ? ' profile-btn-saved' : ''}`}
            disabled={!activeProfileId}
            onClick={handleSave}
            title="Save current values to this profile"
          >
            {savedFlash ? 'Saved ✓' : 'Save'}
          </button>

          {activeProfileId && (
            <button
              className="profile-btn profile-btn-danger"
              onClick={() => setDeleteTargetId(activeProfileId)}
              title="Delete this profile"
            >
              ✕
            </button>
          )}

          <button
            className="profile-btn profile-btn-new"
            onClick={() => setShowNewProfileModal(true)}
            title="Save current values as a new profile"
          >
            + New
          </button>
        </div>
      </nav>
    </>
  );
}
