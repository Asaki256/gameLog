'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockWishlist, mockGames } from '@/lib/mockData';
import { PLATFORM_LABELS } from '@/lib/types';
import { Plus, AlertTriangle, Calendar, DollarSign, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const backlogCount = mockGames.filter(g => g.status === 'backlog' || g.status === 'unplayed').length;
  const showWarning = backlogCount >= 5; // 5本以上で警告（仕様書は10本だが、デモのため5本に変更）

  const handleDelete = (id: string) => {
    alert(`Wishlistアイテムを削除しました（モック）: ${id}`);
  };

  const handleAddGame = () => {
    alert('Wishlistアイテムを追加（モック）');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Wishlist</h2>
            <p className="text-muted-foreground">
              {mockWishlist.length}件の購入予定ゲーム
            </p>
          </div>
          <Button onClick={handleAddGame} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            追加
          </Button>
        </div>

        {/* 積みゲー警告 */}
        {showWarning && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
            <CardContent className="flex items-center gap-4 p-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  積みゲー警告
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  現在{backlogCount}本の未プレイ・積みゲーがあります。
                  新しいゲームを購入する前に、既存のゲームをプレイすることをおすすめします。
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wishlistアイテム一覧 */}
        <div className="space-y-4">
          {mockWishlist.length > 0 ? (
            mockWishlist.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="h-32 w-24 shrink-0 rounded bg-muted flex items-center justify-center text-sm text-muted-foreground mx-auto sm:mx-0">
                      No Image
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h3>
                        <Badge variant="outline">{PLATFORM_LABELS[item.platform]}</Badge>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {item.expectedPrice && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">予想価格:</span>
                            <span>¥{item.expectedPrice.toLocaleString()}</span>
                          </div>
                        )}

                        {item.releaseDate && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">発売日:</span>
                            <span>
                              {new Date(item.releaseDate).toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-sm text-muted-foreground">{item.notes}</p>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                        購入済みにする
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Wishlistが空です</h3>
                <p className="text-muted-foreground mb-4 text-center">
                  購入予定のゲームを追加して、管理しましょう
                </p>
                <Button onClick={handleAddGame}>
                  <Plus className="mr-2 h-4 w-4" />
                  最初のアイテムを追加
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* サマリー情報 */}
        {mockWishlist.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Wishlistサマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">合計アイテム数</p>
                  <p className="text-2xl font-bold">{mockWishlist.length}件</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">予想総額</p>
                  <p className="text-2xl font-bold">
                    ¥
                    {mockWishlist
                      .reduce((acc, item) => acc + (item.expectedPrice || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">発売予定</p>
                  <p className="text-2xl font-bold">
                    {mockWishlist.filter(item => item.releaseDate).length}件
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
