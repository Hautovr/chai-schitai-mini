import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from './components/ui/button';
import Home from './pages/Home';
import Stats from './pages/Stats';
import { TelegramUser } from './types';
import { getTelegramUser } from './lib/utils';
import { mockUser } from './data/mockData';
import { Home as HomeIcon, BarChart3, Menu, X } from 'lucide-react';

// Navigation component
const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Главная', icon: HomeIcon },
    { path: '/stats', label: 'Статистика', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 md:relative md:border-t-0 md:border-b md:bg-transparent ${
        isMenuOpen ? 'block' : 'hidden md:block'
      }`}>
        <div className="flex justify-around md:justify-center md:gap-4 p-4 md:p-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                <span className={`text-xs ${isActive ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

// Main App component
const App: React.FC = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      
      // Set theme
      const theme = window.Telegram.WebApp.colorScheme;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      
      // Get user data
      const telegramUser = getTelegramUser();
      setUser(telegramUser || mockUser);
      
      // Configure WebApp
      window.Telegram.WebApp.MainButton.hide();
      window.Telegram.WebApp.BackButton.hide();
      
      // Handle back button
      window.Telegram.WebApp.onEvent('backButtonClicked', () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.Telegram?.WebApp.close();
        }
      });
      
    } else {
      // Fallback for development
      setUser(mockUser);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background tg-viewport">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Ч</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-emerald-600">
                    ЧайСчитай Mini
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    by Руслан Хаутов
                  </p>
                </div>
              </div>
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium">{user.first_name}</p>
                  {user.username && (
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="pb-20 md:pb-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>

        {/* Navigation */}
        <Navigation />
      </div>
    </Router>
  );
};

export default App;
