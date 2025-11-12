'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockUser, mockSteamGames } from '@/lib/mockData';
import { Save, Link as LinkIcon, Download, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState(mockUser.displayName);
  const [email, setEmail] = useState(mockUser.email);
  const [steamId, setSteamId] = useState(mockUser.steamId || '');
  const [monthlyTarget, setMonthlyTarget] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [steamGames, setSteamGames] = useState<typeof mockSteamGames>([]);
  const [selectedGames, setSelectedGames] = useState<Set<number>>(new Set());

  const handleSaveProfile = () => {
    alert('プロフィールを保存しました（モック）');
  };

  const handleFetchSteamLibrary = async () => {
    if (!steamId) {
      alert('Steam IDを入力してください');
      return;
    }

    setIsLoading(true);
    // モック：2秒後にSteamライブラリを取得
    setTimeout(() => {
      setSteamGames(mockSteamGames);
      setIsLoading(false);
      alert(`${mockSteamGames.length}件のゲームを取得しました`);
    }, 2000);
  };

  const handleToggleGame = (appid: number) => {
    const newSelected = new Set(selectedGames);
    if (newSelected.has(appid)) {
      newSelected.delete(appid);
    } else {
      newSelected.add(appid);
    }
    setSelectedGames(newSelected);
  };

  const handleImportSelected = () => {
    alert(`${selectedGames.size}件のゲームをインポートしました（モック）`);
    setSteamGames([]);
    setSelectedGames(new Set());
  };

  return (
    <MainLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">設定</h2>
          <p className="text-muted-foreground">
            アカウント設定とプリファレンス
          </p>
        </div>

        {/* プロフィール設定 */}
        <Card>
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
            <CardDescription>基本情報を編集</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">表示名</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                メールアドレスは変更できません
              </p>
            </div>

            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" />
              プロフィールを保存
            </Button>
          </CardContent>
        </Card>

        {/* Steam連携 */}
        <Card>
          <CardHeader>
            <CardTitle>Steam連携</CardTitle>
            <CardDescription>
              Steamライブラリを自動インポート
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="steamId">Steam ID</Label>
              <div className="flex gap-2">
                <Input
                  id="steamId"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                  placeholder="76561198012345678"
                />
                <Button
                  onClick={handleFetchSteamLibrary}
                  disabled={isLoading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isLoading ? '取得中...' : 'ライブラリ取得'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Steam IDはプロフィールページのURLから確認できます
              </p>
            </div>

            {steamGames.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {steamGames.length}件のゲームが見つかりました
                  </p>
                  <Button
                    onClick={handleImportSelected}
                    disabled={selectedGames.size === 0}
                    size="sm"
                  >
                    選択中: {selectedGames.size}件をインポート
                  </Button>
                </div>

                <div className="max-h-96 overflow-y-auto border rounded-lg">
                  {steamGames.map((game) => (
                    <div
                      key={game.appid}
                      className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-accent cursor-pointer"
                      onClick={() => handleToggleGame(game.appid)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGames.has(game.appid)}
                        onChange={() => handleToggleGame(game.appid)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{game.name}</p>
                        <p className="text-sm text-muted-foreground">
                          プレイ時間: {Math.floor(game.playtime_forever / 60)}時間
                          {game.playtime_forever % 60}分
                        </p>
                      </div>
                      {selectedGames.has(game.appid) && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 月間目標設定 */}
        <Card>
          <CardHeader>
            <CardTitle>月間目標</CardTitle>
            <CardDescription>
              毎月クリアするゲーム数の目標を設定
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyTarget">月間クリア目標数</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="monthlyTarget"
                  type="number"
                  min="1"
                  max="20"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">本 / 月</span>
              </div>
            </div>

            <Button onClick={() => alert('目標を保存しました（モック）')}>
              <Save className="mr-2 h-4 w-4" />
              目標を保存
            </Button>
          </CardContent>
        </Card>

        {/* その他の設定 */}
        <Card>
          <CardHeader>
            <CardTitle>その他</CardTitle>
            <CardDescription>アカウント管理</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">データエクスポート</h4>
                <p className="text-sm text-muted-foreground">
                  ゲームライブラリをCSV形式でエクスポート
                </p>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                エクスポート
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
              <div>
                <h4 className="font-medium text-destructive">アカウント削除</h4>
                <p className="text-sm text-muted-foreground">
                  すべてのデータが完全に削除されます
                </p>
              </div>
              <Button variant="destructive">削除</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
