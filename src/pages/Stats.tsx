import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Chart from '../components/Chart';
// import Leaderboard from '../components/Leaderboard';
import { DailyStats, WeeklyStats, TelegramUser } from '../types';
import { mockDailyStats, mockWeeklyStats, mockUser } from '../data/mockData';
import { formatCurrency, getTelegramUser } from '../lib/utils';
import { BarChart3, TrendingUp, Trophy, Calendar, DollarSign } from 'lucide-react';

const Stats: React.FC = () => {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

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
    setDailyStats(mockDailyStats);
    setWeeklyStats(mockWeeklyStats);
  }, []);

  const getTopWaiters = () => {
    if (!weeklyStats) return [];
    return weeklyStats.topWaiters.slice(0, 3);
  };

  const getAveragePerDay = () => {
    if (dailyStats.length === 0) return 0;
    const total = dailyStats.reduce((sum, day) => sum + day.totalAmount, 0);
    return Math.round(total / dailyStats.length);
  };

  const getBestDay = () => {
    if (dailyStats.length === 0) return null;
    return dailyStats.reduce((best, day) => 
      day.totalAmount > best.totalAmount ? day : best
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-emerald-600">
          Статистика
        </h1>
        <p className="text-sm text-muted-foreground">
          Анализ чаевых и производительности
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        <Button
          variant={timeRange === 'week' ? 'emerald' : 'outline'}
          onClick={() => setTimeRange('week')}
          className="flex-1"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Неделя
        </Button>
        <Button
          variant={timeRange === 'month' ? 'emerald' : 'outline'}
          onClick={() => setTimeRange('month')}
          className="flex-1"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Месяц
        </Button>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2">
        <Button
          variant={chartType === 'line' ? 'emerald' : 'outline'}
          onClick={() => setChartType('line')}
          className="flex-1"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Линейный
        </Button>
        <Button
          variant={chartType === 'bar' ? 'emerald' : 'outline'}
          onClick={() => setChartType('bar')}
          className="flex-1"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Столбчатый
        </Button>
      </div>

      {/* Chart */}
      <Chart 
        data={dailyStats} 
        type={chartType}
        title={`Статистика за ${timeRange === 'week' ? 'неделю' : 'месяц'}`}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(getAveragePerDay())}
            </div>
            <div className="text-sm text-muted-foreground">Среднее в день</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold-600">
              {dailyStats.length}
            </div>
            <div className="text-sm text-muted-foreground">Дней активности</div>
          </CardContent>
        </Card>
      </div>

      {/* Best Day */}
      {getBestDay() && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold-500" />
              Лучший день
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {new Date(getBestDay()!.date).toLocaleDateString('ru-RU', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getBestDay()!.tipCount} чаевых
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(getBestDay()!.totalAmount)}
                </div>
                <Badge variant="gold">Рекорд!</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Achievement */}
      {weeklyStats && weeklyStats.totalAmount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold-500" />
              Ваши достижения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-lg font-semibold text-emerald-600 mb-2">
                Отличная работа!
              </div>
              <div className="text-sm text-muted-foreground">
                Вы заработали {formatCurrency(weeklyStats.totalAmount)} за неделю
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Summary */}
      {weeklyStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Итоги недели
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(weeklyStats.totalAmount)}
                </div>
                <div className="text-sm text-muted-foreground">Общая сумма</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-600">
                  {weeklyStats.tipCount}
                </div>
                <div className="text-sm text-muted-foreground">Всего чаевых</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Stats;
