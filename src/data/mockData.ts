import { Tip, LeaderboardEntry, DailyStats, WeeklyStats, TelegramUser } from '../types';

// Mock Telegram user
export const mockUser: TelegramUser = {
  id: 123456789,
  first_name: "Руслан",
  last_name: "Хаутов",
  username: "ruslan_hautov",
  language_code: "ru",
  is_premium: false,
};

// Mock tips data - пустой массив для чистого старта
export const mockTips: Tip[] = [];

// Mock leaderboard data - пустой массив для чистого старта
export const mockLeaderboard: LeaderboardEntry[] = [];

// Mock daily stats - пустой массив для чистого старта
export const mockDailyStats: DailyStats[] = [];

// Mock weekly stats - пустые данные для чистого старта
export const mockWeeklyStats: WeeklyStats = {
  weekStart: new Date().toISOString().split('T')[0],
  weekEnd: new Date().toISOString().split('T')[0],
  totalAmount: 0,
  tipCount: 0,
  topWaiters: [],
};

// Get today's tips
export function getTodayTips(): Tip[] {
  const today = new Date().toISOString().split('T')[0];
  return mockTips.filter(tip => tip.date === today);
}

// Get tips for a specific date
export function getTipsForDate(date: string): Tip[] {
  return mockTips.filter(tip => tip.date === date);
}

// Calculate total tips for today
export function getTodayTotal(): number {
  return getTodayTips().reduce((sum, tip) => sum + tip.amount, 0);
}

// Get current week tips
export function getCurrentWeekTips(): Tip[] {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Sunday
  weekEnd.setHours(23, 59, 59, 999);
  
  return mockTips.filter(tip => {
    const tipDate = new Date(tip.date);
    return tipDate >= weekStart && tipDate <= weekEnd;
  });
}
