export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface Tip {
  id: string;
  amount: number;
  date: string;
  time: string;
  waiterId: number;
  waiterName: string;
  waiterUsername?: string;
}

export interface LeaderboardEntry {
  waiterId: number;
  waiterName: string;
  waiterUsername?: string;
  totalAmount: number;
  tipCount: number;
}

export interface DailyStats {
  date: string;
  totalAmount: number;
  tipCount: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalAmount: number;
  tipCount: number;
  topWaiters: LeaderboardEntry[];
}

export interface AppState {
  currentUser: TelegramUser | null;
  todayTips: Tip[];
  leaderboard: LeaderboardEntry[];
  weeklyStats: WeeklyStats;
  dailyStats: DailyStats[];
  isProUser: boolean;
}
