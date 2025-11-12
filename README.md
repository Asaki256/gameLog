
-----
**2025/11/12 12:41**
# GameLog - ゲーム積みゲー管理アプリ 仕様書

## 📋 プロジェクト概要

### コンセプト

複数プラットフォーム（Steam、Switch、PS5、Xbox等）の積みゲーを一元管理し、「次に何をプレイするか」を可視化するWebアプリケーション

### ターゲットユーザー

- 複数プラットフォームでゲームを購入するゲーマー
- 積みゲーが溜まっていることに罪悪感を感じる人
- プレイ記録を残したい人
- 「次に何をプレイするか」迷う人

-----

## 🛠 技術スタック

### フロントエンド

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (UIコンポーネント)
- **React Hook Form** (フォーム管理)
- **Recharts** (グラフ表示)

### バックエンド

- **Supabase**
  - PostgreSQL (データベース)
  - Auth (認証)
  - Storage (画像保存)
  - Edge Functions (サーバーレス関数)

### 外部API

- **IGDB API** (メインゲームDB)
- **Steam Web API** (Steam連携)

-----

## 🎯 主要機能

### 1. ユーザー認証

- Google OAuth認証
- GitHub OAuth認証
- メールアドレス + パスワード認証

### 2. ゲーム管理

#### 2.1 ゲーム登録

**手動登録**

- タイトル名で検索（IGDB API）
- プラットフォーム選択
- 購入価格・購入日入力
- カバー画像自動取得

**Steam自動連携**

- Steam ID入力
- ライブラリ自動取得
- プレイ時間自動同期（任意）

#### 2.2 ステータス管理

- `未プレイ` - 購入済み・未起動
- `プレイ中` - 現在進行中
- `クリア` - エンディング到達
- `積みゲー` - 長期間放置

#### 2.3 メタ情報

- プラットフォーム（Steam / Switch / PS5 / Xbox / PC / その他）
- 購入価格
- 購入日
- プレイ時間（手動入力 or Steam連携）
- 優先度（1-5段階）
- メモ

### 3. 積みゲー可視化

#### 3.1 ダッシュボード

**統計サマリー**

- 未プレイゲーム数
- 積みゲー総額
- 今月のクリア本数 / 目標数
- プラットフォーム別内訳（円グラフ）

**次にプレイするゲーム**

- 優先度順に最大5本表示
- カード形式（カバー画像・タイトル・プラットフォーム）
- 「ランダム選択」ボタン

#### 3.2 進捗管理

**月別統計**

- クリア本数の推移（棒グラフ）
- プレイ時間の推移（折れ線グラフ）
- 月別の目標設定機能

**タイムライン**

- プレイ開始日・クリア日の履歴
- ステータス変更の記録

### 4. ゲームライブラリ

#### 4.1 表示形式

- グリッド表示（カバー画像メイン）
- リスト表示（詳細情報表示）

#### 4.2 フィルター・ソート

**フィルター**

- プラットフォーム
- ステータス
- 購入年

**ソート**

- 購入日（新しい順 / 古い順）
- プレイ時間（多い順 / 少い順）
- 優先度（高い順 / 低い順）
- タイトル名（50音順 / ABC順）

#### 4.3 検索

- タイトル名での全文検索

### 5. Wishlist管理

- 購入予定ゲームの登録
- IGDB APIから情報取得
- 発売日・価格メモ
- 「積みゲー10本以上で警告」機能

### 6. Steam連携

#### 6.1 初回連携

1. Steam IDを入力
1. ライブラリ取得（所有ゲーム一覧）
1. 一括インポート or 選択インポート

#### 6.2 定期同期（任意）

- プレイ時間の自動更新
- 新規購入ゲームの自動追加

-----

## 🗄 データベース設計

### テーブル構成

#### users

```
id (uuid, PK)
email (text)
display_name (text)
avatar_url (text, nullable)
steam_id (text, nullable)
created_at (timestamp)
updated_at (timestamp)
```

#### games

```
id (uuid, PK)
user_id (uuid, FK → users.id)
title (text)
platform (enum: steam, switch, ps5, xbox, pc, other)
status (enum: unplayed, playing, completed, backlog)
igdb_id (integer, nullable)
steam_app_id (integer, nullable)
cover_image_url (text, nullable)
purchase_price (integer, nullable)
purchase_date (date, nullable)
priority (integer, 1-5)
playtime_hours (decimal, nullable)
notes (text, nullable)
created_at (timestamp)
updated_at (timestamp)
```

#### play_sessions

```
id (uuid, PK)
game_id (uuid, FK → games.id)
user_id (uuid, FK → users.id)
played_at (date)
duration_minutes (integer)
memo (text, nullable)
created_at (timestamp)
```

#### wishlist_items

```
id (uuid, PK)
user_id (uuid, FK → users.id)
title (text)
platform (enum)
igdb_id (integer, nullable)
expected_price (integer, nullable)
release_date (date, nullable)
notes (text, nullable)
created_at (timestamp)
```

#### monthly_goals

```
id (uuid, PK)
user_id (uuid, FK → users.id)
year (integer)
month (integer)
target_completions (integer)
created_at (timestamp)

UNIQUE(user_id, year, month)
```

### インデックス

- `games.user_id`
- `games.status`
- `games.platform`
- `play_sessions.game_id`
- `play_sessions.user_id`

### Row Level Security (RLS)

- 全テーブルでユーザーごとのデータ分離
- `user_id = auth.uid()` のポリシー設定

-----

## 🔌 API連携仕様

### IGDB API

#### 用途

- ゲームタイトル検索
- カバー画像取得
- メタデータ取得（ジャンル、発売日等）

#### 認証フロー

1. Twitch Developer PortalでClient ID/Secret取得
1. サーバーサイドでBearer Token取得
1. Edge Functionsでトークン管理

#### 主要エンドポイント

**ゲーム検索**

- `POST /v4/games`
- Query: `fields name,cover.*,platforms.*; search "Zelda"; limit 10;`

**カバー画像URL生成**

- `https://images.igdb.com/igdb/image/upload/t_cover_big/{image_id}.jpg`

#### Rate Limit対策

- 4リクエスト/秒を遵守
- Supabaseキャッシュで重複リクエスト削減

### Steam Web API

#### 用途

- ユーザーのゲームライブラリ取得
- プレイ時間取得

#### 認証

- Steam Web API Key（ユーザー個別取得不要）
- Steam IDのみで公開情報取得可能

#### 主要エンドポイント

**所有ゲーム取得**

- `GET /IPlayerService/GetOwnedGames/v1/`
- パラメータ: `steamid`, `include_appinfo=1`, `include_played_free_games=1`

**プレイ時間取得**

- 上記APIのレスポンスに含まれる
- `playtime_forever` (分単位)

#### 連携フロー

1. ユーザーがSteam IDを入力
1. Supabase Edge FunctionからSteam API呼び出し
1. ゲームリスト取得
1. IGDB APIでメタデータ補完
1. DBに一括保存

-----

## 🎨 画面構成

### 1. ダッシュボード (`/`)

**レイアウト**

- 上部: 統計サマリー（カード4枚横並び）
  - 未プレイ本数
  - 積みゲー総額
  - 今月クリア数 / 目標
  - プラットフォーム別円グラフ
- 中央: 「次にプレイするゲーム」セクション
  - カルーセル形式で5本表示
  - ランダムピックボタン
- 下部: 最近のアクティビティ（タイムライン）

### 2. ゲームライブラリ (`/library`)

**レイアウト**

- 左サイドバー: フィルター
  - プラットフォーム（チェックボックス）
  - ステータス（ラジオボタン）
  - 購入年（ドロップダウン）
- 上部: 検索バー + 表示切替ボタン + ソート
- メインエリア: ゲーム一覧（グリッド or リスト）

### 3. ゲーム詳細 (`/library/{game_id}`)

**レイアウト**

- 左: カバー画像（大）
- 右: 基本情報
  - タイトル
  - プラットフォーム
  - ステータス（変更可能）
  - 購入価格・購入日
  - 優先度（星5つ）
  - プレイ時間
  - メモ欄（編集可）
- 下部: プレイ履歴（play_sessions）

### 4. ゲーム登録 (`/library/new`)

**フロー**

1. タイトル検索（IGDB API連携）
1. 検索結果から選択
1. 詳細入力フォーム

- プラットフォーム（必須）
- 購入価格
- 購入日
- 優先度

1. 登録完了

### 5. Steam連携 (`/settings/steam`)

**フロー**

1. Steam ID入力
1. 「ライブラリ取得」ボタン
1. 取得結果プレビュー（チェックボックス一覧）
1. 「インポート」ボタン

### 6. Wishlist (`/wishlist`)

**レイアウト**

- ゲーム一覧（リスト形式）
- 発売日順ソート
- 「積みゲー警告」バナー（10本以上の場合）

### 7. 統計 (`/stats`)

**レイアウト**

- 月別クリア本数グラフ
- プレイ時間推移グラフ
- プラットフォーム別統計
- 年間まとめ

### 8. 設定 (`/settings`)

**項目**

- プロフィール編集
- Steam連携設定
- 月間目標設定
- アカウント削除

-----

## 🚀 実装優先順位（MVP）

### Phase 1: 基本機能（2週間）

**Week 1**

- [ ] Supabase セットアップ
- [ ] 認証機能（Google OAuth）
- [ ] DB構築（users, games テーブル）
- [ ] ゲーム手動登録（IGDB API連携）

**Week 2**

- [ ] ゲーム一覧表示（グリッド）
- [ ] フィルター・ソート機能
- [ ] ステータス変更
- [ ] ダッシュボード（統計サマリーのみ）

### Phase 2: Steam連携（1週間）

- [ ] Steam API連携実装
- [ ] ライブラリ自動取得
- [ ] プレイ時間同期

### Phase 3: UX改善（1週間）

- [ ] 優先度機能（ドラッグ&ドロップ）
- [ ] ランダムピック機能
- [ ] プレイ時間手動記録

### Phase 4: 統計・グラフ（1週間）

- [ ] 月別グラフ表示
- [ ] 進捗管理機能
- [ ] 月間目標設定

### Phase 5: 追加機能（適宜）

- [ ] Wishlist管理
- [ ] GitHub OAuth追加
- [ ] リスト表示切替
- [ ] メモ・タグ機能

-----

## 📱 レスポンシブ対応

### ブレークポイント

- モバイル: `< 640px`
- タブレット: `640px - 1024px`
- デスクトップ: `> 1024px`

### モバイル最適化

- ダッシュボード: 統計カードを縦積み
- ライブラリ: グリッド2列表示
- サイドバー: ハンバーガーメニュー化

-----

## ⚠️ 注意事項

### API利用上の制限

**IGDB API**

- 4リクエスト/秒を厳守
- キャッシュ機構必須

**Steam API**

- ユーザーのプロフィールが公開設定である必要あり
- 非公開ユーザーはライブラリ取得不可

### 法的考慮事項

- IGDB APIは商用利用OK
- Steam APIの利用規約遵守
- カバー画像の著作権はゲーム会社に帰属（フェアユース範囲内）

-----

## 🎯 差別化ポイント

1. **複数プラットフォーム対応** - Steam特化型が多い中、全プラットフォーム管理
1. **積みゲー可視化** - 総額表示で購入抑制効果
1. **ランダムピック** - 「次に何やるか」問題を解決
1. **日本語完全対応** - 既存サービスは英語のみが多い
1. **シンプルなUI** - モダンでわかりやすいデザイン

-----

## 📈 将来的な拡張案

### 有料プラン機能

- 無制限ゲーム登録（無料版は50本まで）
- Steam自動同期（週1回）
- データエクスポート（CSV/JSON）
- 高度な統計・レポート

### コミュニティ機能

- フレンド機能
- ゲームレビュー共有
- クリア報告の投稿

### その他連携

- PlayStation Network（非公式API）
- Xbox Live
- Nintendo Switch Online（非公式）

-----

## 📝 まとめ

**開発期間:** MVP 5-6週間  
**初期コスト:** ¥0（全て無料プラン）  
**月間ランニングコスト:** ¥0（Supabase無料枠内）

**技術的難易度:** ★★★☆☆（中級）  
**実用性:** ★★★★★  
**市場ニーズ:** ★★★★☆​​​​​​​​​​​​​​​​
