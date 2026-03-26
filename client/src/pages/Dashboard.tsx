import React, { useState } from 'react';
import ChartAnalyzer from '../components/ChartAnalyzer/ChartAnalyzer';
import TechnicalAnalysis from '../components/TechnicalAnalysis/TechnicalAnalysis';
import FundamentalAnalysis from '../components/FundamentalAnalysis/FundamentalAnalysis';
import OpportunitiesFinder from '../components/OpportunitiesFinder/OpportunitiesFinder';
import './Dashboard.css';

type TabId = 'chart' | 'technical' | 'fundamental' | 'opportunities';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'chart', label: 'الرسوم البيانية', icon: '📊' },
  { id: 'technical', label: 'التحليل الفني', icon: '📈' },
  { id: 'fundamental', label: 'التحليل الأساسي', icon: '🏢' },
  { id: 'opportunities', label: 'الفرص', icon: '🎯' },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('chart');

  const renderContent = () => {
    switch (activeTab) {
      case 'chart':
        return <ChartAnalyzer />;
      case 'technical':
        return <TechnicalAnalysis />;
      case 'fundamental':
        return <FundamentalAnalysis />;
      case 'opportunities':
        return <OpportunitiesFinder />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">لوحة التحكم</h1>
      <nav className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
