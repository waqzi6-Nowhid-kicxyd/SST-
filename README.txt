SSTすごろく V1.3

【GitHub Pagesへのアップロード】
ZIPを解凍し、次のファイルとフォルダをリポジトリの一番上へ置いてください。

index.html
styles.css
app.js
questions.js
assets
README.txt

【問題の変更・追加】
問題内容は questions.js だけを編集します。
問題ごとのフォルダやJSファイルを増やす必要はありません。

例：
{ title: "すきな くだものは？", text: "ひとつ教えてね。", emoji: "🍎", image: "" }

分類：
intro = 自己紹介
sst = SST問題
move = 運動
event = イベント

【画像を使う場合】
問題自体は questions.js に追加します。
画像を使う問題だけ assets/tasks に画像を置き、image欄へ指定します。

【V1.3の変更】
・サイコロを振る間は盤面を隠し、サイコロを大きく表示
・出目確定後もアラビア数字を表示しない
・「いくつ すすめるかな？」と問いかけて停止
・先生が「こまを すすめる」を押してから移動
・問題の追加・変更先を questions.js に統一
