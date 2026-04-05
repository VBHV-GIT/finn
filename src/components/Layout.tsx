import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { LayoutDashboard, Receipt, PieChart, LineChart, Moon, Sun, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { DateFilter, Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { theme, toggleTheme, role, setRole, dateFilter, setDateFilter } = useFinance();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'insights', label: 'Insights', icon: LineChart },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Wallet className="w-6 h-6 text-primary mr-2" />
          <span className="font-bold text-xl tracking-tight">Finn Dashboard</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "w-full flex items-center px-4 py-3 rounded-lg transition-colors group text-sm font-medium",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <tab.icon className={clsx("w-5 h-5 mr-3", activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-secondary-foreground")} />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-muted-foreground">Period:</label>
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="last3Months">Last 3 Months</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 border-l border-border pl-6">
              <label className="text-sm font-medium text-muted-foreground">View as:</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring capitalize"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};
