import { useState, useMemo } from 'react';
import { runCalculations } from './utils/calculations';
import Header from './components/Header';
import KpiGrid from './components/KpiGrid';
import TabNav from './components/TabNav';
import SettingsTab from './components/tabs/SettingsTab';
import RoadmapTab from './components/tabs/RoadmapTab';
import PortfolioTab from './components/tabs/PortfolioTab';
import SwpTab               from './components/tabs/SwpTab';
import FinancialStatementTab from './components/tabs/FinancialStatementTab';
import RisksTab              from './components/tabs/RisksTab';

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

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [portfolioAssets, setPortfolioAssets] = useState(DEFAULT_ASSETS);
  const [compoundingMode, setCompoundingMode] = useState('real');
  const [activeTab, setActiveTab] = useState('inputs');

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

  const {
    totalExpense, annualExpense, targetCorpus, swrMultiplier,
    safetyRealCAGR, progressPct, yearsToFI, metTarget,
    portfolioCAGR, totalAlloc, projection,
  } = calc;

  const yearsLabel = !metTarget ? '40+ Years' : yearsToFI === 0 ? 'Achieved!' : `${yearsToFI} Years`;
  const ageLabel = !metTarget ? 'Review SIP / Assets' : yearsToFI === 0 ? 'You are FI!' : `Projected Age ${inputs.age + yearsToFI}`;

  return (
    <div className="app">
      <Header
        progressPct={progressPct}
        yearsLabel={yearsLabel}
        ageLabel={ageLabel}
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

      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="tab-area">
        {activeTab === 'inputs' && (
          <SettingsTab
            inputs={inputs}
            onInputChange={handleInputChange}
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
      </div>
    </div>
  );
}
