import { Tip, LeaderboardEntry, DailyStats, WeeklyStats, TelegramUser } from '../types';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '../lib/utils';

// Mock Telegram user
export const mockUser: TelegramUser = {
  id: 123456789,
  first_name: "Руслан",
  last_name: "Хаутов",
  username: "ruslan_hautov",
  language_code: "ru",
  is_premium: false,
};

// Load data from localStorage or use defaults
export const mockTips: Tip[] = loadFromLocalStorage(STORAGE_KEYS.TIPS, []);
export const mockLeaderboard: LeaderboardEntry[] = loadFromLocalStorage(STORAGE_KEYS.LEADERBOARD, []);
export const mockDailyStats: DailyStats[] = loadFromLocalStorage(STORAGE_KEYS.DAILY_STATS, []);
export const mockWeeklyStats: WeeklyStats = loadFromLocalStorage(STORAGE_KEYS.WEEKLY_STATS, {
  weekStart: new Date().toISOString().split('T')[0],
  weekEnd: new Date().toISOString().split('T')[0],
  totalAmount: 0,
  tipCount: 0,
  topWaiters: [],
});

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

// Add a new tip
export function addTip(tip: Tip): void {
  mockTips.push(tip);
  updateLeaderboard();
  saveToLocalStorage(STORAGE_KEYS.TIPS, mockTips);
  saveToLocalStorage(STORAGE_KEYS.LEADERBOARD, mockLeaderboard);
}

// Delete a tip
export function deleteTip(tipId: string): boolean {
  const index = mockTips.findIndex(tip => tip.id === tipId);
  if (index !== -1) {
    mockTips.splice(index, 1);
    updateLeaderboard();
    saveToLocalStorage(STORAGE_KEYS.TIPS, mockTips);
    saveToLocalStorage(STORAGE_KEYS.LEADERBOARD, mockLeaderboard);
    return true;
  }
  return false;
}

// Update leaderboard based on current tips
export function updateLeaderboard(): void {
  const leaderboardMap = new Map<number, LeaderboardEntry>();
  
  mockTips.forEach(tip => {
    const existing = leaderboardMap.get(tip.waiterId);
    if (existing) {
      existing.totalAmount += tip.amount;
      existing.tipCount += 1;
    } else {
      leaderboardMap.set(tip.waiterId, {
        waiterId: tip.waiterId,
        waiterName: tip.waiterName,
        waiterUsername: tip.waiterUsername,
        totalAmount: tip.amount,
        tipCount: 1,
      });
    }
  });
  
  mockLeaderboard.length = 0;
  mockLeaderboard.push(...Array.from(leaderboardMap.values()));
  mockLeaderboard.sort((a, b) => b.totalAmount - a.totalAmount);
}

// Clear all data
export function clearAllData(): void {
  mockTips.length = 0;
  mockLeaderboard.length = 0;
  mockDailyStats.length = 0;
  
  // Reset weekly stats
  Object.assign(mockWeeklyStats, {
    weekStart: new Date().toISOString().split('T')[0],
    weekEnd: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    tipCount: 0,
    topWaiters: [],
  });
  
  // Clear localStorage
  saveToLocalStorage(STORAGE_KEYS.TIPS, []);
  saveToLocalStorage(STORAGE_KEYS.LEADERBOARD, []);
  saveToLocalStorage(STORAGE_KEYS.DAILY_STATS, []);
  saveToLocalStorage(STORAGE_KEYS.WEEKLY_STATS, mockWeeklyStats);
}
