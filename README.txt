SSTすごろく V1.1

【GitHub Pagesへのアップロード】
次のファイルとフォルダを、すべて同じリポジトリの一番上に置いてください。

index.html
styles.css
app.js
questions.js
assets フォルダ
README.txt

※ index.html だけでは動きません。
※ questions.js がない場合も停止しないよう修正していますが、登録した問題は表示されません。

【問題を追加する場所】
questions.js を編集します。

例：
{ title: "すきな たべものは？", text: "ひとつ教えてね。", emoji: "🍓", image: "" }

【画像を追加する方法】
1. assets/tasks に画像を追加
2. questions.js の image に指定

例：
{ title: "すきな たべものは？", text: "ひとつ教えてね。", emoji: "", image: "assets/tasks/favorite-food.png" }

【今回の修正】
・questions.js を data フォルダからルート直下へ移動
・GitHub Pagesのキャッシュ対策を追加
・問題ファイルを読み込めなくても、シャッフル後に停止しないよう修正
