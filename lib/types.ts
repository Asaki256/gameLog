export type Platform = 'steam' | 'switch' | 'ps5' | 'xbox' | 'pc' | 'other';
export type GameStatus = 'unplayed' | 'playing' | 'completed' | 'backlog';

export interface Game {
  id: string;
  userId: string;
  title: string;
  platform: Platform;
  status: GameStatus;
  igdbId?: number;
  steamAppId?: number;
  coverImageUrl?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  priority: number; // 1-5
  playtimeHours?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  steamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaySession {
  id: string;
  gameId: string;
  userId: string;
  playedAt: string;
  durationMinutes: number;
  memo?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  title: string;
  platform: Platform;
  igdbId?: number;
  expectedPrice?: number;
  releaseDate?: string;
  notes?: string;
  createdAt: string;
}

export interface MonthlyGoal {
  id: string;
  userId: string;
  year: number;
  month: number;
  targetCompletions: number;
  createdAt: string;
}

export interface DashboardStats {
  unplayedCount: number;
  backlogTotalCost: number;
  monthlyCompletedCount: number;
  monthlyTargetCount: number;
  platformBreakdown: {
    platform: Platform;
    count: number;
  }[];
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  steam: 'Steam',
  switch: 'Nintendo Switch',
  ps5: 'PlayStation 5',
  xbox: 'Xbox',
  pc: 'PC',
  other: 'その他',
};

export const STATUS_LABELS: Record<GameStatus, string> = {
  unplayed: '未プレイ',
  playing: 'プレイ中',
  completed: 'クリア',
  backlog: '積みゲー',
};

export const STATUS_COLORS: Record<GameStatus, string> = {
  unplayed: 'bg-gray-500',
  playing: 'bg-blue-500',
  completed: 'bg-green-500',
  backlog: 'bg-yellow-500',
};
