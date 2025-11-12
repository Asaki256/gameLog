'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { mockGames, mockPlaySessions } from '@/lib/mockData';
import { PLATFORM_LABELS, STATUS_LABELS, GameStatus } from '@/lib/types';
import { ArrowLeft, Clock, Calendar, DollarSign, Save } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.id as string;
  const game = mockGames.find((g) => g.id === gameId);
  const sessions = mockPlaySessions.filter((s) => s.gameId === gameId);

  const [status, setStatus] = useState(game?.status || 'unplayed');
  const [priority, setPriority] = useState(game?.priority || 3);
  const [notes, setNotes] = useState(game?.notes || '');

  if (!game) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">ゲームが見つかりません</h2>
          <Link href="/library">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              ライブラリに戻る
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleSave = () => {
    // モックなので実際の保存処理は行わない
    alert('変更を保存しました（モック）');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-start gap-3 sm:gap-4">
          <Link href="/library">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">{game.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{PLATFORM_LABELS[game.platform]}</Badge>
              <Badge variant="secondary">{STATUS_LABELS[game.status]}</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左側: カバー画像と基本情報 */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">No Image</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">購入価格:</span>
                    <span>¥{game.purchasePrice?.toLocaleString() || '-'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">購入日:</span>
                    <span>
                      {game.purchaseDate
                        ? new Date(game.purchaseDate).toLocaleDateString('ja-JP')
                        : '-'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">プレイ時間:</span>
                    <span>{game.playtimeHours || 0}時間</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側: 編集フォームとセッション履歴 */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>ゲーム情報の編集</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="priority">優先度</Label>
                  <div className="flex items-center gap-2">
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
                          className={`text-lg ${
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
                    placeholder="このゲームについてのメモを入力..."
                    rows={5}
                  />
                </div>

                <Button onClick={handleSave} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  変更を保存
                </Button>
              </CardContent>
            </Card>

            {/* プレイセッション履歴 */}
            <Card>
              <CardHeader>
                <CardTitle>プレイ履歴</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-start gap-3 p-3 rounded-lg border"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <span>
                              {new Date(session.playedAt).toLocaleDateString('ja-JP')}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {session.durationMinutes}分
                            </Badge>
                          </div>
                          {session.memo && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {session.memo}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>プレイ履歴がありません</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
