import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import TipList from '../components/TipList';
import Leaderboard from '../components/Leaderboard';
import ProSubscription from '../components/ProSubscription';
import CustomTipDialog from '../components/CustomTipDialog';
import UserNameDialog from '../components/UserNameDialog';
import { Tip, LeaderboardEntry, TelegramUser } from '../types';
import { getTodayTips, mockLeaderboard, mockUser } from '../data/mockData';
import { formatCurrency, getTelegramUser, showTelegramAlert } from '../lib/utils';
import { Plus, DollarSign, TrendingUp, Crown } from 'lucide-react';

const Home: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isProUser] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showCustomTipDialog, setShowCustomTipDialog] = useState(false);
  const [showUserNameDialog, setShowUserNameDialog] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Initialize Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      
      const telegramUser = getTelegramUser();
      setUser(telegramUser || mockUser);
    } else {
      // Fallback for development
      setUser(mockUser);
    }

    // Load data
    setTips(getTodayTips());
    setLeaderboard(mockLeaderboard);

    // Check if user name is saved in localStorage
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    } else {
      // Show name dialog if no name is saved
      setShowUserNameDialog(true);
    }
  }, []);

  const handleSaveUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    // Показываем алерт асинхронно, чтобы не блокировать закрытие диалога
    setTimeout(() => {
      showTelegramAlert(`Привет, ${name}! Добро пожаловать в ЧайСчитай Mini!`);
    }, 100);
  };

  const addTip = (amount: number) => {
    if (!user) return;

    const displayName = userName || user.first_name + (user.last_name ? ` ${user.last_name}` : '');

    const newTip: Tip = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      waiterId: user.id,
      waiterName: displayName,
      waiterUsername: user.username,
    };

    setTips(prev => [newTip, ...prev]);
    
    // Update leaderboard
    setLeaderboard(prev => {
      const existingEntry = prev.find(entry => entry.waiterId === user.id);
      if (existingEntry) {
        return prev.map(entry => 
          entry.waiterId === user.id 
            ? { ...entry, totalAmount: entry.totalAmount + amount, tipCount: entry.tipCount + 1 }
            : entry
        );
      } else {
        return [...prev, {
          waiterId: user.id,
          waiterName: user.first_name + (user.last_name ? ` ${user.last_name}` : ''),
          waiterUsername: user.username,
          totalAmount: amount,
          tipCount: 1,
        }];
      }
    });

    showTelegramAlert(`Добавлено чаевое: ${formatCurrency(amount)}`);
  };

  const todayTotal = tips.reduce((sum, tip) => sum + tip.amount, 0);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-emerald-600">
          ЧайСчитай Mini
        </h1>
        <p className="text-sm text-muted-foreground">
          by Руслан Хаутов
        </p>
        {user && (
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm">
              Привет, <span className="font-medium">{userName || user.first_name}</span>!
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserNameDialog(true)}
              className="h-6 w-6 p-0"
            >
              ✏️
            </Button>
          </div>
        )}
      </div>

      {/* Today's Total */}
      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-6 h-6" />
            <span className="text-sm opacity-90">Сегодня заработано</span>
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(todayTotal)}
          </div>
          <div className="text-sm opacity-90 mt-1">
            {tips.length} чаевых
          </div>
        </CardContent>
      </Card>

      {/* Add Tips Buttons */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-500" />
          Добавить чаевые
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <Button 
            onClick={() => addTip(10)}
            variant="emerald"
            size="xl"
            className="h-16"
          >
            +10₽
          </Button>
          <Button 
            onClick={() => addTip(50)}
            variant="emerald"
            size="xl"
            className="h-16"
          >
            +50₽
          </Button>
          <Button 
            onClick={() => addTip(100)}
            variant="emerald"
            size="xl"
            className="h-16"
          >
            +100₽
          </Button>
        </div>
        <Button 
          onClick={() => setShowCustomTipDialog(true)}
          variant="outline"
          size="xl"
          className="w-full h-16 border-dashed border-2 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Своя сумма
        </Button>
      </div>

      {/* Today's Tips */}
      <TipList tips={tips} />

      {/* Leaderboard */}
      <Leaderboard 
        entries={leaderboard} 
        currentUserId={user?.id}
      />

      {/* Pro Subscription */}
      {!isProUser && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold-500" />
              PRO функции
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowProModal(!showProModal)}
            >
              {showProModal ? 'Скрыть' : 'Подробнее'}
            </Button>
          </div>
          {showProModal && <ProSubscription />}
        </div>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Быстрая статистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(todayTotal)}
              </div>
              <div className="text-sm text-muted-foreground">Сегодня</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold-600">
                {leaderboard.length}
              </div>
              <div className="text-sm text-muted-foreground">Официантов</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Tip Dialog */}
      <CustomTipDialog
        open={showCustomTipDialog}
        onOpenChange={setShowCustomTipDialog}
        onAddTip={addTip}
      />

      {/* User Name Dialog */}
      <UserNameDialog
        open={showUserNameDialog}
        onOpenChange={setShowUserNameDialog}
        onSaveName={handleSaveUserName}
        currentName={userName}
      />
    </div>
  );
};

export default Home;
