const TABS = [
  { id: 'inputs',    icon: '⚙️',  label: 'Settings' },
  { id: 'roadmap',   icon: '📈',  label: 'Growth Roadmap' },
  { id: 'portfolio', icon: '💼',  label: 'Asset Allocation' },
  { id: 'swp',       icon: '💸',  label: 'SWP Strategy' },
  { id: 'risks',     icon: '🛡️', label: 'Strategy & Risks' },
];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <nav className="tab-bar">
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
    </nav>
  );
}
