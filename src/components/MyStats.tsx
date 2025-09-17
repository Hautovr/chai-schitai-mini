import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tip } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { TrendingUp, Calendar, Target, Award, Clock } from 'lucide-react';

interface MyStatsProps {
  tips: Tip[];
  userName: string;
}

const MyStats: React.FC<MyStatsProps> = ({ tips, userName }) => {
  // Вычисляем статистику
  const totalAmount = tips.reduce((sum, tip) => sum + tip.amount, 0);
  const totalTips = tips.length;
  const averageTip = totalTips > 0 ? Math.round(totalAmount / totalTips) : 0;
  
  // Лучший день (по сумме)
  const dailyTotals = tips.reduce((acc, tip) => {
    const date = tip.date;
    acc[date] = (acc[date] || 0) + tip.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const bestDay = Object.entries(dailyTotals).reduce((best, [date, amount]) => {
    return amount > best.amount ? { date, amount } : best;
  }, { date: '', amount: 0 });
  
  // Статистика за неделю
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekTips = tips.filter(tip => new Date(tip.date) >= weekAgo);
  const weekAmount = weekTips.reduce((sum, tip) => sum + tip.amount, 0);
  
  // Статистика за месяц
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const monthTips = tips.filter(tip => new Date(tip.date) >= monthAgo);
  const monthAmount = monthTips.reduce((sum, tip) => sum + tip.amount, 0);
  
  // Категории чаевых
  const smallTips = tips.filter(tip => tip.amount < 100).length;
  const mediumTips = tips.filter(tip => tip.amount >= 100 && tip.amount < 200).length;
  const largeTips = tips.filter(tip => tip.amount >= 200).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Моя статистика
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Статистика для {userName}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Основные метрики */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-sm text-muted-foreground">Всего заработано</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="text-2xl font-bold text-blue-600">
              {totalTips}
            </div>
            <div className="text-sm text-muted-foreground">Чаевых получено</div>
          </div>
        </div>

        {/* Средний размер чаевых */}
        <div className="text-center p-4 rounded-lg bg-gold-50 dark:bg-gold-950/20">
          <div className="text-2xl font-bold text-gold-600">
            {formatCurrency(averageTip)}
          </div>
          <div className="text-sm text-muted-foreground">Средний размер чаевых</div>
        </div>

        {/* Статистика по периодам */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            По периодам
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border bg-card">
              <div className="text-lg font-semibold text-emerald-600">
                {formatCurrency(weekAmount)}
              </div>
              <div className="text-xs text-muted-foreground">За неделю</div>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <div className="text-lg font-semibold text-blue-600">
                {formatCurrency(monthAmount)}
              </div>
              <div className="text-xs text-muted-foreground">За месяц</div>
            </div>
          </div>
        </div>

        {/* Лучший день */}
        {bestDay.date && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-gold-50 to-gold-100 dark:from-gold-950/20 dark:to-gold-900/20 border border-gold-200 dark:border-gold-800">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-gold-600" />
              <span className="font-semibold text-gold-800 dark:text-gold-200">Лучший день</span>
            </div>
            <div className="text-lg font-bold text-gold-700 dark:text-gold-300">
              {formatCurrency(bestDay.amount)}
            </div>
            <div className="text-sm text-gold-600 dark:text-gold-400">
              {formatDate(new Date(bestDay.date))}
            </div>
          </div>
        )}

        {/* Категории чаевых */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Target className="w-4 h-4" />
            Категории чаевых
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="text-lg font-semibold text-gray-600">
                {smallTips}
              </div>
              <div className="text-xs text-muted-foreground">Малые</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
              <div className="text-lg font-semibold text-emerald-600">
                {mediumTips}
              </div>
              <div className="text-xs text-muted-foreground">Средние</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-gold-50 dark:bg-gold-950/20">
              <div className="text-lg font-semibold text-gold-600">
                {largeTips}
              </div>
              <div className="text-xs text-muted-foreground">Большие</div>
            </div>
          </div>
        </div>

        {/* Мотивационные сообщения */}
        {totalTips === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Начните добавлять чаевые!</p>
            <p className="text-sm">Ваша статистика появится здесь</p>
          </div>
        )}

        {totalTips > 0 && totalTips < 5 && (
          <div className="text-center py-4 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
            <p className="font-medium">Отличное начало! 🎉</p>
            <p className="text-sm">Продолжайте в том же духе!</p>
          </div>
        )}

        {totalTips >= 5 && (
          <div className="text-center py-4 text-gold-600 bg-gold-50 dark:bg-gold-950/20 rounded-lg">
            <p className="font-medium">Вы профессионал! ⭐</p>
            <p className="text-sm">Отличная работа с чаевыми!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyStats;
