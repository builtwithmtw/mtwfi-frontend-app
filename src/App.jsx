import { useState, useMemo, useEffect } from 'react';
import { runCalculations } from './utils/calculations';
import { storage, getBackend, setBackend } from './utils/storage';
import Header from './components/Header';
import KpiGrid from './components/KpiGrid';
import TabNav from './components/TabNav';
import SettingsTab from './components/tabs/SettingsTab';
import RoadmapTab from './components/tabs/RoadmapTab';
import PortfolioTab from './components/tabs/PortfolioTab';
import SwpTab               from './components/tabs/SwpTab';
import FinancialStatementTab from './components/tabs/FinancialStatementTab';
import RisksTab              from './components/tabs/RisksTab';
import HoursInvestingTab    from './components/tabs/HoursInvestingTab';
import RetirementPlanTab   from './components/tabs/RetirementPlanTab';

const COLOR_PALETTE = [
  '#10B981', '#34D399', '#F59E0B', '#EAB308', '#F97316',
  '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
];

const DEFAULT_INPUTS = {
  age: 27,
  salary: 400000,
  sip: 250000,
  inflation: 10.0,
  totalCorpus: 3000000,
  expenses: {
    kitchen: 50000,
    rent: 35000,
    bills: 20000,
    petrol: 15000,
    outings: 20000,
    wife: 10000,
  },
};

const DEFAULT_ASSETS = [
  { name: 'PSX (Stocks)', alloc: 50, ret: 22, color: '#10B981' },
  { name: 'Mutual Funds', alloc: 20, ret: 16, color: '#34D399' },
  { name: 'Real Estate', alloc: 15, ret: 11, color: '#F59E0B' },
  { name: 'Gold', alloc: 10, ret: 10, color: '#EAB308' },
  { name: 'USD / Foreign Assets', alloc: 5, ret: 8, color: '#F97316' },
];

const DEFAULT_HOURS_INPUTS = { workYears: 40, dwh: 9, wdy: 250 };

const DEFAULT_HOURS_EXPENSES = [
  { id: 1, name: 'Shadi', amount: 3_000_000,  amountInput: '3',  amountUnit: 'M', investPct: 50 },
  { id: 2, name: 'Car',   amount: 10_000_000, amountInput: '10', amountUnit: 'M', investPct: 50 },
  { id: 3, name: 'House', amount: 25_000_000, amountInput: '25', amountUnit: 'M', investPct: 50 },
];

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [portfolioAssets, setPortfolioAssets] = useState(DEFAULT_ASSETS);
  const [hoursInputs, setHoursInputs] = useState(DEFAULT_HOURS_INPUTS);
  const [hoursExpenses, setHoursExpenses] = useState(DEFAULT_HOURS_EXPENSES);
  const [compoundingMode, setCompoundingMode] = useState('real');
  const [activeTab, setActiveTab] = useState('inputs');
  const [isLoading, setIsLoading] = useState(true);
  const [datasource, setDatasource] = useState(() => getBackend());

  useEffect(() => {
    setIsLoading(true);
    async function init() {
      const [savedProfiles, activeId] = await Promise.all([
        storage.loadProfiles(),
        storage.getActiveProfileId(),
      ]);
      setProfiles(savedProfiles);
      setActiveProfileId(activeId);
      if (activeId) {
        const profile = savedProfiles.find(p => p.id === activeId);
        if (profile) {
          setInputs(profile.inputs);
          setPortfolioAssets(profile.portfolioAssets);
          setHoursInputs(profile.hoursInputs ?? DEFAULT_HOURS_INPUTS);
          setHoursExpenses(profile.hoursExpenses ?? DEFAULT_HOURS_EXPENSES);
        }
      }
      setIsLoading(false);
    }
    init();
  }, [datasource]);

  const handleDatasourceChange = (backend) => {
    setBackend(backend);
    setDatasource(backend);
  };

  const calc = useMemo(
    () => runCalculations(inputs, portfolioAssets, compoundingMode),
    [inputs, portfolioAssets, compoundingMode],
  );

  const handleInputChange = (path, value) => {
    setInputs(prev => {
      const parts = path.split('.');
      if (parts.length === 1) return { ...prev, [path]: value };
      return { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } };
    });
  };

  const handleAssetUpdate = (index, field, value) => {
    setPortfolioAssets(prev => prev.map((a, i) => {
      if (i !== index) return a;
      if (field === 'name') return { ...a, name: value };
      if (field === 'alloc') return { ...a, alloc: parseFloat(value) || 0 };
      if (field === 'ret') return { ...a, ret: parseFloat(value) || 0 };
      return a;
    }));
  };

  const handleAssetAdd = () => {
    setPortfolioAssets(prev => [
      ...prev,
      { name: 'New Asset Class', alloc: 0, ret: 12, color: COLOR_PALETTE[prev.length % COLOR_PALETTE.length] },
    ]);
  };

  const handleAssetDelete = (index) => {
    setPortfolioAssets(prev => {
      if (prev.length <= 1) { alert('You must maintain at least one asset class.'); return prev; }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveProfile = async () => {
    if (!activeProfileId) return;
    const updated = profiles.map(p =>
      p.id === activeProfileId
        ? { ...p, inputs, portfolioAssets, hoursInputs, hoursExpenses }
        : p,
    );
    setProfiles(updated);
    await storage.persistProfiles(updated);
  };

  const handleNewProfile = async (name) => {
    const id = `profile_${Date.now()}`;
    const updated = [...profiles, { id, name, inputs: DEFAULT_INPUTS, portfolioAssets: DEFAULT_ASSETS, hoursInputs: DEFAULT_HOURS_INPUTS, hoursExpenses: DEFAULT_HOURS_EXPENSES }];
    setProfiles(updated);
    setActiveProfileId(id);
    setInputs(DEFAULT_INPUTS);
    setPortfolioAssets(DEFAULT_ASSETS);
    setHoursInputs(DEFAULT_HOURS_INPUTS);
    setHoursExpenses(DEFAULT_HOURS_EXPENSES);
    await Promise.all([
      storage.persistProfiles(updated),
      storage.setActiveProfileId(id),
    ]);
  };

  const handleLoadProfile = async (id) => {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return;
    setActiveProfileId(id);
    setInputs(profile.inputs);
    setPortfolioAssets(profile.portfolioAssets);
    setHoursInputs(profile.hoursInputs ?? DEFAULT_HOURS_INPUTS);
    setHoursExpenses(profile.hoursExpenses ?? DEFAULT_HOURS_EXPENSES);
    await storage.setActiveProfileId(id);
  };

  const handleDeleteProfile = async (id) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    const promises = [storage.persistProfiles(updated)];
    if (activeProfileId === id) {
      const next = updated[0]?.id || null;
      setActiveProfileId(next);
      promises.push(storage.setActiveProfileId(next));
    }
    await Promise.all(promises);
  };

  const {
    totalExpense, annualExpense, targetCorpus, swrMultiplier,
    safetyRealCAGR, progressPct, yearsToFI, metTarget,
    portfolioCAGR, totalAlloc, projection,
  } = calc;

  const yearsLabel = !metTarget ? '40+ Years' : yearsToFI === 0 ? 'Achieved!' : `${yearsToFI} Years`;
  const ageLabel = !metTarget ? 'Review SIP / Assets' : yearsToFI === 0 ? 'You are FI!' : `Projected Age ${inputs.age + yearsToFI}`;

  if (isLoading) return <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--primary)' }}>Loading…</div>;

  return (
    <div className="app">
      <Header
        progressPct={progressPct}
        yearsLabel={yearsLabel}
        ageLabel={ageLabel}
        datasource={datasource}
        onDatasourceChange={handleDatasourceChange}
      />

      <KpiGrid
        totalCorpus={inputs.totalCorpus}
        annualExpense={annualExpense}
        totalExpense={totalExpense}
        targetCorpus={targetCorpus}
        swrMultiplier={swrMultiplier}
        safetyRealCAGR={safetyRealCAGR}
        yearsLabel={yearsLabel}
        ageLabel={ageLabel}
      />

      <TabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSaveProfile={handleSaveProfile}
        onNewProfile={handleNewProfile}
        onLoadProfile={handleLoadProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      <div className="tab-area">
        {activeTab === 'inputs' && (
          <SettingsTab
            key={activeProfileId}
            inputs={inputs}
            onInputChange={handleInputChange}
            hoursInputs={hoursInputs}
            onHoursInputsChange={setHoursInputs}
          />
        )}
        {activeTab === 'roadmap' && (
          <RoadmapTab
            projection={projection}
            targetCorpus={targetCorpus}
            yearsToFI={yearsToFI}
            compoundingMode={compoundingMode}
            onModeChange={setCompoundingMode}
          />
        )}
        {activeTab === 'portfolio' && (
          <PortfolioTab
            assets={portfolioAssets}
            onUpdate={handleAssetUpdate}
            onAdd={handleAssetAdd}
            onDelete={handleAssetDelete}
            totalAlloc={totalAlloc}
            portfolioCAGR={portfolioCAGR}
          />
        )}
        {activeTab === 'swp' && (
          <SwpTab
            calc={calc}
            inflation={inputs.inflation}
          />
        )}
        {activeTab === 'statement' && (
          <FinancialStatementTab
            inputs={inputs}
            calc={calc}
          />
        )}
        {activeTab === 'risks' && (
          <RisksTab
            inputs={inputs}
            calc={calc}
          />
        )}
        {activeTab === 'retirement' && (
          <RetirementPlanTab
            inputs={inputs}
            calc={calc}
          />
        )}
        {activeTab === 'hours' && (
          <HoursInvestingTab
            salary={inputs.salary}
            portfolioCAGR={portfolioCAGR}
            hoursInputs={hoursInputs}
            hoursExpenses={hoursExpenses}
            onHoursExpensesChange={setHoursExpenses}
          />
        )}
      </div>
    </div>
  );
}
