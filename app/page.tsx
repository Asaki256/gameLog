'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockGames, mockDashboardStats } from '@/lib/mockData';
import { PLATFORM_LABELS, STATUS_LABELS } from '@/lib/types';
import { Shuffle, TrendingUp, DollarSign, Target, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const priorityGames = mockGames
    .filter(g => g.status === 'unplayed' || g.status === 'playing' || g.status === 'backlog')
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  const [randomGame, setRandomGame] = useState<typeof mockGames[0] | null>(null);

  const pickRandomGame = () => {
    const availableGames = mockGames.filter(
      g => g.status === 'unplayed' || g.status === 'backlog'
    );
    if (availableGames.length > 0) {
      const random = availableGames[Math.floor(Math.random() * availableGames.length)];
      setRandomGame(random);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ダッシュボード</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            あなたのゲームライブラリの概要
          </p>
        </div>

        {/* 統計サマリー */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                未プレイゲーム
              </CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unplayedCount}本</div>
              <p className="text-xs text-muted-foreground">
                積んでいるゲーム
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                積みゲー総額
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥{stats.backlogTotalCost.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                未消化の投資額
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                今月のクリア数
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.monthlyCompletedCount}/{stats.monthlyTargetCount}
              </div>
              <p className="text-xs text-muted-foreground">
                目標まであと{stats.monthlyTargetCount - stats.monthlyCompletedCount}本
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                総ゲーム数
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockGames.length}本</div>
              <p className="text-xs text-muted-foreground">
                ライブラリ全体
              </p>
            </CardContent>
          </Card>
        </div>

        {/* プラットフォーム別内訳 */}
        <Card>
          <CardHeader>
            <CardTitle>プラットフォーム別内訳</CardTitle>
            <CardDescription>各プラットフォームのゲーム数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.platformBreakdown
                .filter(p => p.count > 0)
                .map((item) => (
                  <div key={item.platform} className="flex items-center">
                    <div className="w-32 text-sm font-medium">
                      {PLATFORM_LABELS[item.platform]}
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${(item.count / mockGames.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 w-12 text-right text-sm font-medium">
                      {item.count}本
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* 次にプレイするゲーム */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>次にプレイするゲーム</CardTitle>
                <CardDescription>優先度順に表示</CardDescription>
              </div>
              <Button onClick={pickRandomGame} variant="outline" size="sm">
                <Shuffle className="mr-2 h-4 w-4" />
                ランダム選択
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {randomGame && (
              <div className="mb-4 rounded-lg border-2 border-primary bg-primary/5 p-4">
                <p className="mb-2 text-sm font-medium text-primary">ランダム選択結果:</p>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{randomGame.title}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline">{PLATFORM_LABELS[randomGame.platform]}</Badge>
                      <Badge variant="secondary">{STATUS_LABELS[randomGame.status]}</Badge>
                    </div>
                  </div>
                  <Link href={`/library/${randomGame.id}`}>
                    <Button size="sm">詳細を見る</Button>
                  </Link>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {priorityGames.map((game) => (
                <Link key={game.id} href={`/library/${game.id}`}>
                  <Card className="cursor-pointer transition-all hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="h-20 w-14 shrink-0 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold leading-tight line-clamp-2">
                            {game.title}
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {PLATFORM_LABELS[game.platform]}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {STATUS_LABELS[game.status]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < game.priority ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近のアクティビティ */}
        <Card>
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
            <CardDescription>最新のゲームプレイ記録</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGames
                .filter(g => g.status === 'playing' || g.status === 'completed')
                .slice(0, 5)
                .map((game) => (
                  <div key={game.id} className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Gamepad2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{game.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {game.status === 'completed' ? 'クリアしました' : 'プレイ中'}
                        {' • '}
                        {game.playtimeHours}時間プレイ済み
                      </p>
                    </div>
                    <Badge variant={game.status === 'completed' ? 'default' : 'secondary'}>
                      {STATUS_LABELS[game.status]}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
