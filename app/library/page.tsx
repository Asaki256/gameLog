'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { mockGames } from '@/lib/mockData';
import { PLATFORM_LABELS, STATUS_LABELS, Platform, GameStatus } from '@/lib/types';
import { Search, Plus, Grid3x3, List } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

type ViewMode = 'grid' | 'list';
type SortBy = 'title' | 'purchaseDate' | 'playtime' | 'priority';

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<GameStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('purchaseDate');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredAndSortedGames = useMemo(() => {
    let games = [...mockGames];

    // 検索フィルター
    if (searchQuery) {
      games = games.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // プラットフォームフィルター
    if (filterPlatform !== 'all') {
      games = games.filter((game) => game.platform === filterPlatform);
    }

    // ステータスフィルター
    if (filterStatus !== 'all') {
      games = games.filter((game) => game.status === filterStatus);
    }

    // ソート
    games.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title, 'ja');
        case 'purchaseDate':
          return new Date(b.purchaseDate || 0).getTime() - new Date(a.purchaseDate || 0).getTime();
        case 'playtime':
          return (b.playtimeHours || 0) - (a.playtimeHours || 0);
        case 'priority':
          return b.priority - a.priority;
        default:
          return 0;
      }
    });

    return games;
  }, [searchQuery, filterPlatform, filterStatus, sortBy]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ゲームライブラリ</h2>
            <p className="text-muted-foreground">
              {filteredAndSortedGames.length}本のゲーム
            </p>
          </div>
          <Link href="/library/new">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              ゲーム登録
            </Button>
          </Link>
        </div>

        {/* フィルター・ソートバー */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ゲームを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value as Platform | 'all')}
              >
                <option value="all">すべてのプラットフォーム</option>
                {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>

              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as GameStatus | 'all')}
              >
                <option value="all">すべてのステータス</option>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
              >
                <option value="purchaseDate">購入日順</option>
                <option value="title">タイトル順</option>
                <option value="playtime">プレイ時間順</option>
                <option value="priority">優先度順</option>
              </Select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                {filteredAndSortedGames.length}件表示
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ゲーム一覧 */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedGames.map((game) => (
              <Link key={game.id} href={`/library/${game.id}`}>
                <Card className="cursor-pointer transition-all hover:shadow-lg h-full">
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] bg-muted flex items-center justify-center rounded-t-lg">
                      <p className="text-sm text-muted-foreground">No Image</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {game.playtimeHours || 0}h
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
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
        ) : (
          <div className="space-y-2">
            {filteredAndSortedGames.map((game) => (
              <Link key={game.id} href={`/library/${game.id}`}>
                <Card className="cursor-pointer transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-12 shrink-0 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{game.title}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {PLATFORM_LABELS[game.platform]}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {STATUS_LABELS[game.status]}
                          </Badge>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-0.5">
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
                      <div className="hidden sm:block text-sm text-muted-foreground w-20 text-right">
                        {game.playtimeHours || 0}時間
                      </div>
                      <div className="hidden lg:block text-sm text-muted-foreground w-24 text-right">
                        {game.purchaseDate ? new Date(game.purchaseDate).toLocaleDateString('ja-JP') : '-'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
