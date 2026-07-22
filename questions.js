/*
  問題を追加する場所です。

  画像を使う場合：
  1. assets/tasks フォルダに画像を入れる
  2. image: "assets/tasks/ファイル名.png" を指定する

  image を空文字にすると emoji が表示されます。
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
