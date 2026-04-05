import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/Layout';
import { DashboardView } from './components/views/DashboardView';
import { TransactionsView } from './components/views/TransactionsView';
import { BudgetsView } from './components/views/BudgetsView';
import { InsightsView } from './components/views/InsightsView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderView = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'transactions': return <TransactionsView />;
      case 'budgets': return <BudgetsView />;
      case 'insights': return <InsightsView />;
      default: return <DashboardView />;
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderView()}
    </Layout>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
