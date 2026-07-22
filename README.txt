# SSTすごろく V1

## 起動方法
index.html をダブルクリックしてください。

## 問題を追加する方法
data/questions.js を開き、各ジャンルの配列へ次の形式で追加します。

{ title: "問題タイトル", text: "説明文", emoji: "🍎", image: "" }

## 画像を使う方法
1. assets/tasks フォルダへ PNG または JPG を入れます。
2. questions.js の image にパスを指定します。

例：
{ title: "好きな食べ物は？", text: "ひとつ教えてね。", emoji: "", image: "assets/tasks/favorite-food.png" }

## ジャンル
- intro：自己紹介
- sst：SST問題
- move：運動
- event：イベント

## 主な仕様
- 2〜5人
- 愛称入力
- 20マス
- サイコロ自動進行
- 順番自動管理
- 1回休み対応
- カードシャッフル演出
- ランダム出題
- 全画面表示対応
