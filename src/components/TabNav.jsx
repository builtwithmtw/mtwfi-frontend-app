import { useState, useCallback } from 'react';

const TABS = [
  { id: 'inputs',    icon: '⚙️',  label: 'Settings' },
  { id: 'roadmap',   icon: '📈',  label: 'Growth Roadmap' },
  { id: 'portfolio', icon: '💼',  label: 'Asset Allocation' },
  { id: 'swp',       icon: '💸',  label: 'SWP Strategy' },
  { id: 'statement', icon: '📋',  label: 'Financial Statement' },
  { id: 'risks',     icon: '🛡️', label: 'Strategy & Risks' },
  { id: 'hours',     icon: '⏱️',  label: 'Hours Investing' },
];

export default function TabNav({
  activeTab, onTabChange,
  profiles, activeProfileId,
  onSaveProfile, onNewProfile, onLoadProfile, onDeleteProfile,
}) {
  const [savedFlash, setSavedFlash] = useState(false);

  const handleSave = useCallback(() => {
    onSaveProfile();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }, [onSaveProfile]);

  return (
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
            onClick={() => {
              if (window.confirm(`Delete profile "${profiles.find(p => p.id === activeProfileId)?.name}"?`)) {
                onDeleteProfile(activeProfileId);
              }
            }}
            title="Delete this profile"
          >
            ✕
          </button>
        )}

        <button
          className="profile-btn profile-btn-new"
          onClick={() => {
            const name = window.prompt('New profile name:');
            if (name?.trim()) onNewProfile(name.trim());
          }}
          title="Save current values as a new profile"
        >
          + New
        </button>
      </div>
    </nav>
  );
}
