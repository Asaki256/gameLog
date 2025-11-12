'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockMonthlyStats, mockGames, mockDashboardStats } from '@/lib/mockData';
import { PLATFORM_LABELS } from '@/lib/types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function StatsPage() {
  const platformData = mockDashboardStats.platformBreakdown
    .filter(p => p.count > 0)
    .map((item) => ({
      name: PLATFORM_LABELS[item.platform],
      value: item.count,
    }));

  const statusData = [
    { name: '未プレイ', count: mockGames.filter(g => g.status === 'unplayed').length },
    { name: 'プレイ中', count: mockGames.filter(g => g.status === 'playing').length },
    { name: 'クリア', count: mockGames.filter(g => g.status === 'completed').length },
    { name: '積みゲー', count: mockGames.filter(g => g.status === 'backlog').length },
  ];

  const monthlyStatsFormatted = mockMonthlyStats.map(stat => ({
    month: stat.month.split('-')[1] + '月',
    クリア本数: stat.completions,
    プレイ時間: stat.playtimeHours,
  }));

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">統計</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            あなたのゲームプレイ統計
          </p>
        </div>

        {/* サマリー統計 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                総ゲーム数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockGames.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                クリア数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockGames.filter(g => g.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                総プレイ時間
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockGames.reduce((acc, g) => acc + (g.playtimeHours || 0), 0)}h
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                クリア率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round((mockGames.filter(g => g.status === 'completed').length / mockGames.length) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* グラフエリア */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 月別クリア本数 */}
          <Card>
            <CardHeader>
              <CardTitle>月別クリア本数</CardTitle>
              <CardDescription>過去6ヶ月の推移</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStatsFormatted}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="クリア本数" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 月別プレイ時間 */}
          <Card>
            <CardHeader>
              <CardTitle>月別プレイ時間</CardTitle>
              <CardDescription>過去6ヶ月の推移</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyStatsFormatted}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="プレイ時間"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* プラットフォーム別内訳 */}
          <Card>
            <CardHeader>
              <CardTitle>プラットフォーム別内訳</CardTitle>
              <CardDescription>所有ゲームの分布</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ステータス別内訳 */}
          <Card>
            <CardHeader>
              <CardTitle>ステータス別内訳</CardTitle>
              <CardDescription>ゲームの進行状況</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* トップゲーム */}
        <Card>
          <CardHeader>
            <CardTitle>プレイ時間トップ5</CardTitle>
            <CardDescription>最もプレイしたゲーム</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGames
                .sort((a, b) => (b.playtimeHours || 0) - (a.playtimeHours || 0))
                .slice(0, 5)
                .map((game, index) => (
                  <div key={game.id} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{game.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {PLATFORM_LABELS[game.platform]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{game.playtimeHours || 0}時間</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
