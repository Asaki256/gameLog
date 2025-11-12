'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PLATFORM_LABELS, STATUS_LABELS, Platform, GameStatus } from '@/lib/types';
import { ArrowLeft, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// モック検索結果
const mockSearchResults = [
  { id: 1, title: 'Elden Ring', platform: 'Multi-Platform' },
  { id: 2, title: 'The Legend of Zelda: Tears of the Kingdom', platform: 'Nintendo Switch' },
  { id: 3, title: 'Final Fantasy XVI', platform: 'PlayStation 5' },
  { id: 4, title: 'Baldurs Gate 3', platform: 'PC, PlayStation 5' },
  { id: 5, title: 'Starfield', platform: 'Xbox, PC' },
];

export default function NewGamePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('');

  // フォーム状態
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('steam');
  const [status, setStatus] = useState<GameStatus>('unplayed');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [priority, setPriority] = useState(3);
  const [notes, setNotes] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const handleSelectGame = (gameTitle: string) => {
    setTitle(gameTitle);
    setSelectedGame(gameTitle);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // モックなので実際の保存処理は行わない
    alert(`ゲーム「${title}」を登録しました（モック）`);
    router.push('/library');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-start gap-3 sm:gap-4">
          <Link href="/library">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ゲーム登録</h2>
            <p className="text-sm sm:text-base text-muted-foreground">新しいゲームをライブラリに追加</p>
          </div>
        </div>

        {/* ゲーム検索 */}
        <Card>
          <CardHeader>
            <CardTitle>ゲームを検索</CardTitle>
            <CardDescription>
              タイトル名で検索してゲーム情報を自動取得（IGDB API連携のモック）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ゲームタイトルを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSearch}>検索</Button>
            </div>

            {showResults && (
              <div className="border rounded-lg divide-y">
                {mockSearchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectGame(result.title)}
                    className="w-full p-3 text-left hover:bg-accent transition-colors"
                  >
                    <p className="font-medium">{result.title}</p>
                    <p className="text-sm text-muted-foreground">{result.platform}</p>
                  </button>
                ))}
              </div>
            )}

            {selectedGame && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  選択中: {selectedGame}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 登録フォーム */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>ゲーム情報</CardTitle>
              <CardDescription>詳細情報を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">タイトル *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ゲームタイトル"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform">プラットフォーム *</Label>
                  <Select
                    id="platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    required
                  >
                    {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">ステータス</Label>
                  <Select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as GameStatus)}
                  >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">購入価格 (円)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="5980"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">購入日</Label>
                  <Input
                    id="date"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">優先度</Label>
                <div className="flex items-center gap-4">
                  <Select
                    id="priority"
                    value={priority.toString()}
                    onChange={(e) => setPriority(Number(e.target.value))}
                  >
                    <option value="1">1 - 低</option>
                    <option value="2">2</option>
                    <option value="3">3 - 中</option>
                    <option value="4">4</option>
                    <option value="5">5 - 高</option>
                  </Select>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < priority ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">メモ</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="このゲームについてのメモ..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  登録する
                </Button>
                <Link href="/library" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    キャンセル
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
