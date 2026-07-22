/*
  ============================================================
  SSTすごろく 問題ファイル
  ============================================================

  問題の変更・追加は、この questions.js だけを編集します。
  app.js や index.html を変更する必要はありません。

  【追加例】
  { title: "すきな くだものは？", text: "ひとつ教えてね。", emoji: "🍎" },

  【画像を使う場合だけ】
  image: "assets/tasks/画像名.png" を追加できます。
  画像を使わない問題は、emoji だけで動作します。

  分類：
  intro = 自己紹介
  sst   = SST問題
  move  = 運動
  event = イベント

  event の効果：
  effect: "skip"     1回休み
  effect: "back2"    2マス戻る
  effect: "forward1" 1マス進む
  effect: "again"    もう一度振る
  effect: "none"     移動効果なし
*/
window.SST_TASKS = {
  intro: [
    { title: "おなまえを おしえてね", text: "みんなに聞こえる声で言ってみよう。", emoji: "👋", image: "" },
    { title: "すきな たべものは？", text: "ひとつ教えてね。", emoji: "🍓", image: "" },
    { title: "すきな あそびは？", text: "どんな遊びが好きかな？", emoji: "🧸", image: "" },
    { title: "すきな どうぶつは？", text: "好きな動物をひとつ教えてね。", emoji: "🐶", image: "" },
    { title: "すきな いろは？", text: "好きな色を教えてね。", emoji: "🎨", image: "" },
    { title: "おとなりの おともだちを しょうかい", text: "名前や、知っていることをひとつ言ってみよう。", emoji: "🤝", image: "" }
  ],

  sst: [
    { title: "おもちゃを とられちゃった", text: "こんなとき、どうする？", emoji: "🧸", image: "" },
    { title: "じゅんばんを ぬかされちゃった", text: "こんなとき、どうする？", emoji: "🚶", image: "" },
    { title: "おともだちが ないている", text: "どんな声をかける？", emoji: "😢", image: "" },
    { title: "いっしょに あそびたい", text: "なんて言ったらいいかな？", emoji: "🛝", image: "" },
    { title: "ぶつかって しまった", text: "こんなとき、どうする？", emoji: "💥", image: "" },
    { title: "かしてほしい おもちゃがある", text: "なんて言ったらいいかな？", emoji: "🚗", image: "" }
  ],

  move: [
    { title: "そのばで ジャンプ！", text: "5かいジャンプしよう。", emoji: "🦘", image: "" },
    { title: "かたあし たち", text: "できるところまで挑戦しよう。", emoji: "🦩", image: "" },
    { title: "からだを のばそう", text: "両手を上に伸ばして、ゆっくり深呼吸。", emoji: "🙆", image: "" },
    { title: "どうぶつ まねっこ", text: "好きな動物の動きをしてみよう。", emoji: "🐸", image: "" },
    { title: "ぐるっと まわろう", text: "その場でゆっくり1回まわろう。", emoji: "🌀", image: "" },
    { title: "てを たたこう", text: "先生のまねをして、同じリズムで手をたたこう。", emoji: "👏", image: "" }
  ],

  event: [
    { title: "1かい おやすみ", text: "つぎの番はお休みです。", emoji: "😴", image: "", effect: "skip" },
    { title: "2マス もどる", text: "コマが2マス戻ります。", emoji: "↩️", image: "", effect: "back2" },
    { title: "1マス すすむ", text: "コマが1マス進みます。", emoji: "➡️", image: "", effect: "forward1" },
    { title: "もういちど！", text: "もう一度サイコロを振れます。", emoji: "🎲", image: "", effect: "again" },
    { title: "みんなで はくしゅ", text: "みんなで拍手しよう。", emoji: "👏", image: "", effect: "none" }
  ]
};
