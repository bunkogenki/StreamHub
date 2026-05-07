import { useState, useEffect } from "react";

const PLATFORMS = ["YouTube", "Twitch", "Kick", "TikTok", "Other"];
const PLATFORM_COLORS = { YouTube: "#FF0000", Twitch: "#9146FF", Kick: "#53FC18", TikTok: "#00F2EA", Other: "#aaaaaa" };
const PLATFORM_ICONS = { YouTube: "▶", Twitch: "📡", Kick: "🟢", TikTok: "🎵", Other: "🔗" };
const CATEGORY_COLORS = ["#f59e0b","#3b82f6","#ec4899","#10b981","#8b5cf6","#f97316","#06b6d4","#84cc16","#e11d48","#0ea5e9"];

const ORG_META = {
  "Hololive":      { color: "#3b82f6" },
  "Nijisanji":     { color: "#ec4899" },
  "VSpo!":         { color: "#8b5cf6" },
  "Crazy Raccoon": { color: "#f97316" },
};

function genId() { return Math.random().toString(36).slice(2, 9); }

const storage = {
  get: (key) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

const RAW_STREAMERS = [
  // ══ HOLOLIVE JP Gen 0 ══
  { name:"Tokino Sora",       native:"ときのそら",           org:"Hololive", sub:"JP Gen 0",     url:"https://www.youtube.com/@TokinoSora" },
  { name:"Roboco-san",        native:"ロボ子さん",            org:"Hololive", sub:"JP Gen 0",     url:"https://www.youtube.com/@Robocosan" },
  { name:"Sakura Miko",       native:"さくらみこ",            org:"Hololive", sub:"JP Gen 0",     url:"https://www.youtube.com/@SakuraMiko" },
  { name:"Hoshimachi Suisei", native:"星街すいせい",          org:"Hololive", sub:"JP Gen 0",     url:"https://www.youtube.com/@HoshimachiSuisei" },
  { name:"AZKi",              native:"AZKi",                  org:"Hololive", sub:"JP Gen 0",     url:"https://www.youtube.com/@AZKi" },
  // ══ HOLOLIVE JP Gen 1 ══
  { name:"Yozora Mel",        native:"夜空メル",              org:"Hololive", sub:"JP Gen 1",     url:"https://www.youtube.com/@YozoraMel" },
  { name:"Aki Rosenthal",     native:"アキ・ローゼンタール",  org:"Hololive", sub:"JP Gen 1",     url:"https://www.youtube.com/@AkiRosenthal" },
  { name:"Haachama",          native:"赤井はあと",            org:"Hololive", sub:"JP Gen 1",     url:"https://www.youtube.com/@HaachamaChCh" },
  { name:"Shirakami Fubuki",  native:"白上フブキ",            org:"Hololive", sub:"JP Gen 1",     url:"https://www.youtube.com/@ShirakamiShirakami" },
  { name:"Natsuiro Matsuri",  native:"夏色まつり",            org:"Hololive", sub:"JP Gen 1",     url:"https://www.youtube.com/@NatsuiroMatsuri" },
  // ══ HOLOLIVE JP Gen 2 ══
  { name:"Minato Aqua",       native:"湊あくあ",              org:"Hololive", sub:"JP Gen 2",     url:"https://www.youtube.com/@MinatoAqua" },
  { name:"Murasaki Shion",    native:"紫咲シオン",            org:"Hololive", sub:"JP Gen 2",     url:"https://www.youtube.com/@MurasakiShion" },
  { name:"Nakiri Ayame",      native:"百鬼あやめ",            org:"Hololive", sub:"JP Gen 2",     url:"https://www.youtube.com/@NakiriAyame" },
  { name:"Yuzuki Choco",      native:"癒月ちょこ",            org:"Hololive", sub:"JP Gen 2",     url:"https://www.youtube.com/@YuzukiChoco" },
  { name:"Oozora Subaru",     native:"大空スバル",            org:"Hololive", sub:"JP Gen 2",     url:"https://www.youtube.com/@OozoraSubaru" },
  // ══ HOLOLIVE JP GAMERS ══
  { name:"Ookami Mio",        native:"大神ミオ",              org:"Hololive", sub:"JP GAMERS",    url:"https://www.youtube.com/@OokamiMio" },
  { name:"Nekomata Okayu",    native:"猫又おかゆ",            org:"Hololive", sub:"JP GAMERS",    url:"https://www.youtube.com/@NekomataOkayu" },
  { name:"Inugami Korone",    native:"戌神ころね",            org:"Hololive", sub:"JP GAMERS",    url:"https://www.youtube.com/@InugamiKorone" },
  // ══ HOLOLIVE JP Gen 3 ══
  { name:"Usada Pekora",      native:"兎田ぺこら",            org:"Hololive", sub:"JP Gen 3",     url:"https://www.youtube.com/@UsadaPekora" },
  { name:"Shiranui Flare",    native:"不知火フレア",          org:"Hololive", sub:"JP Gen 3",     url:"https://www.youtube.com/@ShiranuiFlare" },
  { name:"Shirogane Noel",    native:"白銀ノエル",            org:"Hololive", sub:"JP Gen 3",     url:"https://www.youtube.com/@ShiroganeNoel" },
  { name:"Houshou Marine",    native:"宝鐘マリン",            org:"Hololive", sub:"JP Gen 3",     url:"https://www.youtube.com/@HoushouMarine" },
  // ══ HOLOLIVE JP Gen 4 ══
  { name:"Tsunomaki Watame",  native:"角巻わため",            org:"Hololive", sub:"JP Gen 4",     url:"https://www.youtube.com/@TsunomakiWatame" },
  { name:"Tokoyami Towa",     native:"常闇トワ",              org:"Hololive", sub:"JP Gen 4",     url:"https://www.youtube.com/@TokoyamiTowa" },
  { name:"Himemori Luna",     native:"姫森ルーナ",            org:"Hololive", sub:"JP Gen 4",     url:"https://www.youtube.com/@HimemoriLuna" },
  { name:"Amane Kanata",      native:"天音かなた",            org:"Hololive", sub:"JP Gen 4",     url:"https://www.youtube.com/@AmaneKanata" },
  // ══ HOLOLIVE JP Gen 5 ══
  { name:"Yukihana Lamy",     native:"雪花ラミィ",            org:"Hololive", sub:"JP Gen 5",     url:"https://www.youtube.com/@YukihanaLamy" },
  { name:"Momosuzu Nene",     native:"桃鈴ねね",              org:"Hololive", sub:"JP Gen 5",     url:"https://www.youtube.com/@MomosuzuNene" },
  { name:"Shishiro Botan",    native:"獅白ぼたん",            org:"Hololive", sub:"JP Gen 5",     url:"https://www.youtube.com/@ShishiroBotan" },
  { name:"Omaru Polka",       native:"尾丸ポルカ",            org:"Hololive", sub:"JP Gen 5",     url:"https://www.youtube.com/@OmaruPolka" },
  // ══ HOLOLIVE JP HoloX ══
  { name:"La+ Darknesss",     native:"ラプラス・ダークネス", org:"Hololive", sub:"JP HoloX",     url:"https://www.youtube.com/@LaDarknesss" },
  { name:"Takane Lui",        native:"鷹嶺ルイ",              org:"Hololive", sub:"JP HoloX",     url:"https://www.youtube.com/@TakaneLui" },
  { name:"Hakui Koyori",      native:"博衣こより",            org:"Hololive", sub:"JP HoloX",     url:"https://www.youtube.com/@HakuiKoyori" },
  { name:"Sakamata Chloe",    native:"沙花叉クロヱ",          org:"Hololive", sub:"JP HoloX",     url:"https://www.youtube.com/@SakamataChloe" },
  { name:"Kazama Iroha",      native:"風真いろは",            org:"Hololive", sub:"JP HoloX",     url:"https://www.youtube.com/@KazamaIroha" },
  // ══ HOLOLIVE JP ReGLOSS ══
  { name:"Hiodoshi Ao",       native:"火威青",                org:"Hololive", sub:"JP ReGLOSS",   url:"https://www.youtube.com/@HiodoshiAo" },
  { name:"Otonose Kanade",    native:"音乃瀬奏",              org:"Hololive", sub:"JP ReGLOSS",   url:"https://www.youtube.com/@OtonoseKanade" },
  { name:"Ichijou Ririka",    native:"一条莉々華",            org:"Hololive", sub:"JP ReGLOSS",   url:"https://www.youtube.com/@IchijouRirika" },
  { name:"Juufuutei Raden",   native:"儒烏風亭らでん",        org:"Hololive", sub:"JP ReGLOSS",   url:"https://www.youtube.com/@JuufuuteiRaden" },
  { name:"Todoroki Hajime",   native:"轟はじめ",              org:"Hololive", sub:"JP ReGLOSS",   url:"https://www.youtube.com/@TodorokiHajime" },
  // ══ HOLOLIVE JP FLOW GLOW ══
  { name:"Isaki Riona",       native:"伊咲りおな",            org:"Hololive", sub:"JP FLOW GLOW", url:"https://www.youtube.com/@IsakiRiona" },
  { name:"Koganei Niko",      native:"古賀音ニコ",            org:"Hololive", sub:"JP FLOW GLOW", url:"https://www.youtube.com/@KoganeiNiko" },
  { name:"Mizumiya Su",       native:"水宮スゥ",              org:"Hololive", sub:"JP FLOW GLOW", url:"https://www.youtube.com/@MizumiyaSu" },
  { name:"Rindo Chihaya",     native:"燐道ちはや",            org:"Hololive", sub:"JP FLOW GLOW", url:"https://www.youtube.com/@RindoChihaya" },
  { name:"Kikirara Vivi",     native:"煌々ViVi",              org:"Hololive", sub:"JP FLOW GLOW", url:"https://www.youtube.com/@KikiraraVivi" },
  // ══ HOLOLIVE EN Myth ══
  { name:"Mori Calliope",              native:"森カリオペ",   org:"Hololive", sub:"EN Myth",      url:"https://www.youtube.com/@MoriCalliope" },
  { name:"Takanashi Kiara",            native:"小鳥遊キアラ", org:"Hololive", sub:"EN Myth",      url:"https://www.youtube.com/@TakanashiKiara" },
  { name:"Ninomae Ina'nis",            native:"一伊那尓栖",   org:"Hololive", sub:"EN Myth",      url:"https://www.youtube.com/@NinomaeInanis" },
  { name:"Gawr Gura",                  native:"",             org:"Hololive", sub:"EN Myth",      url:"https://www.youtube.com/@GawrGura" },
  { name:"Watson Amelia",              native:"",             org:"Hololive", sub:"EN Myth",      url:"https://www.youtube.com/@WatsonAmelia" },
  // ══ HOLOLIVE EN Promise ══
  { name:"IRyS",                       native:"",             org:"Hololive", sub:"EN Promise",   url:"https://www.youtube.com/@IRyS" },
  { name:"Ceres Fauna",                native:"",             org:"Hololive", sub:"EN Promise",   url:"https://www.youtube.com/@CeresFauna" },
  { name:"Ouro Kronii",                native:"",             org:"Hololive", sub:"EN Promise",   url:"https://www.youtube.com/@OuroKronii" },
  { name:"Nanashi Mumei",              native:"",             org:"Hololive", sub:"EN Promise",   url:"https://www.youtube.com/@NanashiMumei" },
  { name:"Hakos Baelz",                native:"",             org:"Hololive", sub:"EN Promise",   url:"https://www.youtube.com/@HakosBaelz" },
  // ══ HOLOLIVE EN Advent ══
  { name:"Shiori Novella",             native:"",             org:"Hololive", sub:"EN Advent",    url:"https://www.youtube.com/@ShioriNovella" },
  { name:"Koseki Bijou",               native:"",             org:"Hololive", sub:"EN Advent",    url:"https://www.youtube.com/@KosekiBijou" },
  { name:"Nerissa Ravencroft",         native:"",             org:"Hololive", sub:"EN Advent",    url:"https://www.youtube.com/@NerissaRavencroft" },
  { name:"Fuwawa Abyssgard",           native:"",             org:"Hololive", sub:"EN Advent",    url:"https://www.youtube.com/@FuwawaAbyssgard" },
  { name:"Mococo Abyssgard",           native:"",             org:"Hololive", sub:"EN Advent",    url:"https://www.youtube.com/@MococoAbyssgard" },
  // ══ HOLOLIVE EN Justice ══
  { name:"Elizabeth Rose Bloodflame",  native:"",             org:"Hololive", sub:"EN Justice",   url:"https://www.youtube.com/@ElizabethRoseBloodflame" },
  { name:"Gigi Murin",                 native:"",             org:"Hololive", sub:"EN Justice",   url:"https://www.youtube.com/@GigiMurin" },
  { name:"Cecilia Immergreen",         native:"",             org:"Hololive", sub:"EN Justice",   url:"https://www.youtube.com/@CeciliaImmergreen" },
  { name:"Raora Panthera",             native:"",             org:"Hololive", sub:"EN Justice",   url:"https://www.youtube.com/@RaoraPanthera" },
  // ══ HOLOLIVE ID Gen 1 ══
  { name:"Ayunda Risu",                native:"",             org:"Hololive", sub:"ID Gen 1",     url:"https://www.youtube.com/@AyundaRisu" },
  { name:"Moona Hoshinova",            native:"",             org:"Hololive", sub:"ID Gen 1",     url:"https://www.youtube.com/@MoonaHoshinova" },
  { name:"Airani Iofifteen",           native:"",             org:"Hololive", sub:"ID Gen 1",     url:"https://www.youtube.com/@AiraniIofifteen" },
  // ══ HOLOLIVE ID Gen 2 ══
  { name:"Kureiji Ollie",              native:"",             org:"Hololive", sub:"ID Gen 2",     url:"https://www.youtube.com/@KureijiOllie" },
  { name:"Anya Melfissa",              native:"",             org:"Hololive", sub:"ID Gen 2",     url:"https://www.youtube.com/@AnyaMelfissa" },
  { name:"Pavolia Reine",              native:"",             org:"Hololive", sub:"ID Gen 2",     url:"https://www.youtube.com/@PavoliaReine" },
  // ══ HOLOLIVE ID Gen 3 ══
  { name:"Vestia Zeta",                native:"",             org:"Hololive", sub:"ID Gen 3",     url:"https://www.youtube.com/@VestiaZeta" },
  { name:"Kaela Kovalskia",            native:"",             org:"Hololive", sub:"ID Gen 3",     url:"https://www.youtube.com/@KaelaKovalskia" },
  { name:"Kobo Kanaeru",               native:"",             org:"Hololive", sub:"ID Gen 3",     url:"https://www.youtube.com/@KoboKanaeru" },
  // ══ HOLOLIVE Stars JP ══
  { name:"Hanasaki Miyabi",  native:"花咲みやび",    org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@HanasakiMiyabi" },
  { name:"Kagami Kira",      native:"鏡見キラ",      org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@KagamiKira" },
  { name:"Kanade Izuru",     native:"奏手イヅル",    org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@KanadeIzuru" },
  { name:"Arurandeisu",      native:"アルランディス", org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@Arurandeisu" },
  { name:"Rikka",            native:"律可",          org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@Rikka" },
  { name:"Astel Leda",       native:"アステル・レダ", org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@AstelLeda" },
  { name:"Kishido Temma",    native:"岸堂天真",      org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@KishidoTemma" },
  { name:"Yukoku Roberu",    native:"夕刻ロベル",    org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@YukokuRoberu" },
  { name:"Tsukishita Kaoru", native:"月下かおる",    org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@TsukishitaKaoru" },
  { name:"Shien",            native:"紫仁",          org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@ShienIzuru" },
  { name:"Aragami Oga",      native:"荒咬オウガ",    org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@AragamiOga" },
  { name:"Fuma Machita",     native:"町田麩麻",      org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@FumaMachita" },
  { name:"Utsugi Uyu",       native:"宇都木ウユ",    org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@UtsugiUyu" },
  { name:"Hizaki Gamma",     native:"緋崎ガンマ",    org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@HizakiGamma" },
  { name:"Minase Rio",       native:"皆瀬リオ",      org:"Hololive", sub:"Stars JP", url:"https://www.youtube.com/@MinaseRio" },
  // ══ HOLOLIVE Stars EN ══
  { name:"Regis Altare",     native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@RegisAltare" },
  { name:"Magni Dezmond",    native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@MagniDezmond" },
  { name:"Axel Syrios",      native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@AxelSyrios" },
  { name:"Noir Vesper",      native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@NoirVesper" },
  { name:"Gavis Bettel",     native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@GavisBettel" },
  { name:"Machina X Flayon", native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@MachinaXFlayon" },
  { name:"Banzoin Hakka",    native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@BanzoinHakka" },
  { name:"Josuiji Shinri",   native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@JosuijiShinri" },
  { name:"Jurard T Rexford", native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@JurardTRexford" },
  { name:"Goldbullet",       native:"", org:"Hololive", sub:"Stars EN", url:"https://www.youtube.com/@Goldbullet" },

  // ══ NIJISANJI JP ══
  { name:"Tsukino Mito",           native:"月ノ美兎",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@TsukinoMito" },
  { name:"Higuchi Kaede",          native:"樋口楓",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@HiguchiKaede" },
  { name:"Shiina Yuika",           native:"椎名唯華",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@ShiinaYuika" },
  { name:"Elu",                    native:"エル",               org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@Elu" },
  { name:"Suzuhara Lulu",          native:"鈴原るる",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@SuzuharaLulu" },
  { name:"Morinaka Kazaki",        native:"森中花咲",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@MorinakaKazaki" },
  { name:"Kanae",                  native:"叶",                 org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@kanae" },
  { name:"Kuzuha",                 native:"葛葉",               org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@kuzuha" },
  { name:"Sasaki Saku",            native:"笹木咲",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@SasakiSaku" },
  { name:"Ange Katrina",           native:"アンジュ・カトリーナ", org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@AngeKatrina" },
  { name:"Lize Helesta",           native:"リゼ・ヘルエスタ",   org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@LizeHelesta" },
  { name:"Rion",                   native:"リオン",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@rion" },
  { name:"Hayase Sou",             native:"早瀬走",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@HayaseSou" },
  { name:"Yashiro Kizuku",         native:"矢車かずく",         org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@YashiroKizuku" },
  { name:"Chihiro Semina",         native:"社築",               org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@ChihiroSemina" },
  { name:"Hakase Fuyuki",          native:"博士ふゆき",         org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@HakaseFuyuki" },
  { name:"Belmond Banderas",       native:"ベルモンド・バンデラス", org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@BelmondBanderas" },
  { name:"Gundou Mirei",           native:"グンドウミレイ",     org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@GundouMirei" },
  { name:"Ryushen",                native:"リュウシェン",       org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@Ryushen" },
  { name:"Dola",                   native:"ドーラ",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@dola" },
  { name:"Nui Sociere",            native:"鶯巣ヌイ",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@NuiSociere" },
  { name:"Ibrahim",                native:"イブラヒム",         org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@Ibrahim" },
  { name:"Sukoya Kana",            native:"健屋花那",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@SukoyaKana" },
  { name:"Tomoe Yuki",             native:"葉山舞鈴",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@TomoeYuki" },
  { name:"Yumeoi Kakeru",          native:"夢追翔",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@YumeoiKakeru" },
  { name:"Fuwa Minato",            native:"不破湊",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@FuwaMinato" },
  { name:"Fumi",                   native:"フミ",               org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@fumi" },
  { name:"Inui Toko",              native:"犬山たまき",         org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@InuiToko" },
  { name:"Sister Claire",          native:"シスター・クレア",   org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@SisterClaire" },
  { name:"Oliver Evans",           native:"オリバー・エバンス", org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@OliverEvans" },
  { name:"Nagao Kei",              native:"長尾景",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@NagaoKei" },
  { name:"Amamiya Kokoro",         native:"雨宮こころ",         org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@AmamiyaKokoro" },
  { name:"Lauren Iroas",           native:"ローレン・イロアス", org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@LaurenIroas" },
  { name:"Axia Krone",             native:"アクシア・クローネ", org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@AxiaKrone" },
  { name:"Lain Paterson",          native:"ライン・パタソン",   org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@LainPaterson" },
  { name:"Chloe Lana",             native:"クロエ・ラナ",       org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@ChloeLana" },
  { name:"Melissa Kinrenka",       native:"メリッサ・キンレンカ", org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@MelissaKinrenka" },
  { name:"Gwelu Os Gar",           native:"グウェル・オス・ガル", org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@GweluOsGar" },
  { name:"Joe Rikiichi",           native:"ジョー・力一",       org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@JoeRikiichi" },
  { name:"Toya Kenmochi",          native:"剣持刀也",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@ToyaKenmochi" },
  { name:"Maimoto Keisuke",        native:"舞元啓介",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@MaimotoKeisuke" },
  { name:"Sango Haruka",           native:"三枝明那",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@SangoHaruka" },
  { name:"Kagami Hayato",          native:"加賀美ハヤト",       org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@KagamiHayato" },
  { name:"Shibuya Hajime",         native:"渋谷ハジメ",         org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@ShibuyaHajime" },
  { name:"Hoshikawa Sara",         native:"星川サラ",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@HoshikawaSara" },
  { name:"Chigusa Natsume",        native:"椚あい",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@ChigusaNatsume" },
  { name:"Iwanaga Celestia",       native:"岩本菜々子",         org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@IwanagaCelestia" },
  { name:"Leos Vincent",           native:"レオス・ヴィンセント", org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@LeosVincent" },
  { name:"Salome Hyakumantenbara", native:"百万天原サロメ",     org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@SalomeHyakumantenbara" },
  { name:"Koshien Nari",           native:"甲斐田晴",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@KoshienNari" },
  { name:"Suo Sango",              native:"周央サンゴ",         org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@SuoSango" },
  { name:"Fuwa Minato",            native:"不破湊",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@FuwaMinato" },
  { name:"Yuki Chihiro",           native:"雪城眞尋",           org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@YukiChihiro" },
  { name:"Mukai Kuuya",            native:"向井恋",             org:"Nijisanji", sub:"JP", url:"https://www.youtube.com/@MukaiKuuya" },

  // ══ NIJISANJI EN Lazulight ══
  { name:"Elira Pendora",     native:"", org:"Nijisanji", sub:"EN Lazulight", url:"https://www.youtube.com/@EliraPendora" },
  { name:"Pomu Rainpuff",     native:"", org:"Nijisanji", sub:"EN Lazulight", url:"https://www.youtube.com/@PomuRainpuff" },
  { name:"Finana Ryugu",      native:"", org:"Nijisanji", sub:"EN Lazulight", url:"https://www.youtube.com/@FinanaRyugu" },
  // ══ NIJISANJI EN Obsydia ══
  { name:"Selen Tatsuki",     native:"", org:"Nijisanji", sub:"EN Obsydia",   url:"https://www.youtube.com/@SelenlTatsuki" },
  { name:"Rosemi Lovelock",   native:"", org:"Nijisanji", sub:"EN Obsydia",   url:"https://www.youtube.com/@RosemiLovelock" },
  { name:"Petra Gurin",       native:"", org:"Nijisanji", sub:"EN Obsydia",   url:"https://www.youtube.com/@PetraGurin" },
  // ══ NIJISANJI EN Ethyria ══
  { name:"Nina Kosaka",       native:"", org:"Nijisanji", sub:"EN Ethyria",   url:"https://www.youtube.com/@NinaKosaka" },
  { name:"Enna Alouette",     native:"", org:"Nijisanji", sub:"EN Ethyria",   url:"https://www.youtube.com/@EnnaAlouette" },
  { name:"Millie Parfait",    native:"", org:"Nijisanji", sub:"EN Ethyria",   url:"https://www.youtube.com/@MillieParfait" },
  { name:"Reimu Endou",       native:"", org:"Nijisanji", sub:"EN Ethyria",   url:"https://www.youtube.com/@ReimuEndou" },
  // ══ NIJISANJI EN Luxiem ══
  { name:"Vox Akuma",         native:"", org:"Nijisanji", sub:"EN Luxiem",    url:"https://www.youtube.com/@VoxAkuma" },
  { name:"Mysta Rias",        native:"", org:"Nijisanji", sub:"EN Luxiem",    url:"https://www.youtube.com/@MystaRias" },
  { name:"Ike Eveland",       native:"", org:"Nijisanji", sub:"EN Luxiem",    url:"https://www.youtube.com/@IkeEveland" },
  { name:"Luca Kaneshiro",    native:"", org:"Nijisanji", sub:"EN Luxiem",    url:"https://www.youtube.com/@LucaKaneshiro" },
  { name:"Shu Yamino",        native:"", org:"Nijisanji", sub:"EN Luxiem",    url:"https://www.youtube.com/@ShuYamino" },
  // ══ NIJISANJI EN Noctyx ══
  { name:"Fulgur Ovid",       native:"", org:"Nijisanji", sub:"EN Noctyx",    url:"https://www.youtube.com/@FulgurOvid" },
  { name:"Sonny Brisko",      native:"", org:"Nijisanji", sub:"EN Noctyx",    url:"https://www.youtube.com/@SonnyBrisko" },
  { name:"Uki Violeta",       native:"", org:"Nijisanji", sub:"EN Noctyx",    url:"https://www.youtube.com/@UkiVioleta" },
  { name:"Alban Knox",        native:"", org:"Nijisanji", sub:"EN Noctyx",    url:"https://www.youtube.com/@AlbanKnox" },
  { name:"Yugo Asuma",        native:"", org:"Nijisanji", sub:"EN Noctyx",    url:"https://www.youtube.com/@YugoAsuma" },
  // ══ NIJISANJI EN ILUNA ══
  { name:"Aia Amare",         native:"", org:"Nijisanji", sub:"EN ILUNA",     url:"https://www.youtube.com/@AiaAmare" },
  { name:"Scarle Yonaguni",   native:"", org:"Nijisanji", sub:"EN ILUNA",     url:"https://www.youtube.com/@ScarleYonaguni" },
  { name:"Kyo Kaneko",        native:"", org:"Nijisanji", sub:"EN ILUNA",     url:"https://www.youtube.com/@KyoKaneko" },
  { name:"Aster Arcadia",     native:"", org:"Nijisanji", sub:"EN ILUNA",     url:"https://www.youtube.com/@AsterArcadia" },
  { name:"Maria Marionette",  native:"", org:"Nijisanji", sub:"EN ILUNA",     url:"https://www.youtube.com/@MariaMarionette" },
  { name:"Ren Zotto",         native:"", org:"Nijisanji", sub:"EN ILUNA",     url:"https://www.youtube.com/@RenZotto" },
  // ══ NIJISANJI EN Xsoleil ══
  { name:"Doppio Dropscythe", native:"", org:"Nijisanji", sub:"EN Xsoleil",   url:"https://www.youtube.com/@DoppioDropscythe" },
  { name:"Hex Haywire",       native:"", org:"Nijisanji", sub:"EN Xsoleil",   url:"https://www.youtube.com/@HexHaywire" },
  { name:"Meloco Kyoran",     native:"", org:"Nijisanji", sub:"EN Xsoleil",   url:"https://www.youtube.com/@MelocoKyoran" },
  { name:"Ver Vermillion",    native:"", org:"Nijisanji", sub:"EN Xsoleil",   url:"https://www.youtube.com/@VerVermillion" },
  { name:"Kotoka Torahime",   native:"", org:"Nijisanji", sub:"EN Xsoleil",   url:"https://www.youtube.com/@KotokaTorahime" },
  { name:"Vezalius Bandage",  native:"", org:"Nijisanji", sub:"EN Xsoleil",   url:"https://www.youtube.com/@VezaliusBandage" },
  // ══ NIJISANJI EN Krisis ══
  { name:"Claude Clawmark",   native:"", org:"Nijisanji", sub:"EN Krisis",    url:"https://www.youtube.com/@ClaudeClawmark" },
  { name:"Seraph Dazzleglow", native:"", org:"Nijisanji", sub:"EN Krisis",    url:"https://www.youtube.com/@SeraphDazzleglow" },
  { name:"Wilson Raim",       native:"", org:"Nijisanji", sub:"EN Krisis",    url:"https://www.youtube.com/@WilsonRaim" },
  // ══ NIJISANJI EN TTT ══
  { name:"Zaion LanZa",       native:"", org:"Nijisanji", sub:"EN TTT",       url:"https://www.youtube.com/@ZaionLanZa" },

  // ══ NIJISANJI ID ══
  { name:"Hana Macchia",       native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@HanaMacchia" },
  { name:"Zea Cornelia",       native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@ZeaCornelia" },
  { name:"Taka Radjiman",      native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@TakaRadjiman" },
  { name:"Reid Fantome",       native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@ReidFantome" },
  { name:"Miyu Ottavia",       native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@MiyuOttavia" },
  { name:"Bonnivier Pranaja",  native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@BonnivierPranaja" },
  { name:"Hyona Elatiora",     native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@HyonaElatiora" },
  { name:"Layla Alstroemeria", native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@LaylaAlstroemeria" },
  { name:"Etna Crimson",       native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@EtnaCrimson" },
  { name:"Siska Leontyne",     native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@SiskaLeontyne" },
  { name:"Amicia Michella",    native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@AmiciaMichella" },
  { name:"Derem Kado",         native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@DeremKado" },
  { name:"Nara Haramaung",     native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@NaraHaramaung" },
  { name:"Xia Ekavira",        native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@XiaEkavira" },
  { name:"Seffyna",            native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@Seffyna" },
  { name:"Mika Melatika",      native:"", org:"Nijisanji", sub:"ID", url:"https://www.youtube.com/@MikaMelatika" },

  // ══ NIJISANJI KR ══
  { name:"Siu",   native:"시우", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Siu_NJkr" },
  { name:"Gaon",  native:"가온", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Gaon_NJkr" },
  { name:"Nagi",  native:"나기", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Nagi_NJkr" },
  { name:"Yuya",  native:"유야", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Yuya_NJkr" },
  { name:"Noe",   native:"노에", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Noe_NJkr" },
  { name:"Roha",  native:"로하", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Roha_NJkr" },
  { name:"Bora",  native:"보라", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Bora_NJkr" },
  { name:"Hari",  native:"하리", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Hari_NJkr" },
  { name:"Suha",  native:"수하", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Suha_NJkr" },
  { name:"Hyona", native:"효나", org:"Nijisanji", sub:"KR", url:"https://www.youtube.com/@Hyona_NJkr" },

  // ══ NIJISANJI IN ══
  { name:"Debi Daru Nia",  native:"", org:"Nijisanji", sub:"IN", url:"https://www.youtube.com/@DebiDaruNia" },
  { name:"Vihaan Astrea",  native:"", org:"Nijisanji", sub:"IN", url:"https://www.youtube.com/@VihaanAstrea" },
  { name:"Priya Akshaya",  native:"", org:"Nijisanji", sub:"IN", url:"https://www.youtube.com/@PriyaAkshaya" },

  // ══ VSPO! ══
  { name:"Yakumo Beni",      native:"八雲べに",     org:"VSpo!", sub:"", url:"https://www.youtube.com/@YakumoBeni" },
  { name:"Shishizaki Rin",   native:"獅子崎莉犬",   org:"VSpo!", sub:"", url:"https://www.youtube.com/@ShishizakiRin" },
  { name:"Kaga Sumire",      native:"花芽すみれ",   org:"VSpo!", sub:"", url:"https://www.youtube.com/@KagaSumire" },
  { name:"Hinano Tachibana", native:"橘ひなの",     org:"VSpo!", sub:"", url:"https://www.youtube.com/@HinanoTachibana" },
  { name:"Mimi",             native:"熊澤ミミ",     org:"VSpo!", sub:"", url:"https://www.youtube.com/@Mimi_vspo" },
  { name:"Araka Luto",       native:"荒咬ルト",     org:"VSpo!", sub:"", url:"https://www.youtube.com/@ArakaLuto" },
  { name:"Seto Miyako",      native:"瀬戸みやこ",   org:"VSpo!", sub:"", url:"https://www.youtube.com/@SetoMiyako" },
  { name:"Natori Sana",      native:"名取さな",     org:"VSpo!", sub:"", url:"https://www.youtube.com/@NatoriSana" },
  { name:"Tsumugi Iroha",    native:"紡木ロハ",     org:"VSpo!", sub:"", url:"https://www.youtube.com/@TsumugiIroha" },
  { name:"Noah",             native:"野鳥のあ",     org:"VSpo!", sub:"", url:"https://www.youtube.com/@Noah_vspo" },
  { name:"Ichinose Uruha",   native:"一ノ瀬うるは", org:"VSpo!", sub:"", url:"https://www.youtube.com/@IchinoseUruha" },
  { name:"Ramune Ushio",     native:"牛乃うしお",   org:"VSpo!", sub:"", url:"https://www.youtube.com/@RamuneUshio" },
  { name:"Mikoto Reirei",    native:"京本れいれい", org:"VSpo!", sub:"", url:"https://www.youtube.com/@MikotoReirei" },
  { name:"Suzuki Masaru",    native:"鈴木まさる",   org:"VSpo!", sub:"", url:"https://www.youtube.com/@SuzukiMasaru_vspo" },
  { name:"Asumi Sena",       native:"明日海せな",   org:"VSpo!", sub:"", url:"https://www.youtube.com/@AsumiSena" },
  { name:"Kurumi Moko",      native:"来夢もこ",     org:"VSpo!", sub:"", url:"https://www.youtube.com/@KurumiMoko" },

  // ══ CRAZY RACCOON ══
  { name:"Zeta",         native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@ZETA_CR" },
  { name:"Selly",        native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Selly_CR" },
  { name:"Ras",          native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Ras_CR" },
  { name:"Neth",         native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Neth_CR" },
  { name:"Xiao",         native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Xiao_CR" },
  { name:"Genburten",    native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Genburten" },
  { name:"Akanekin",     native:"茜音",   org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Akanekin_CR" },
  { name:"Broozer",      native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Broozer_CR" },
  { name:"ReStar",       native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@ReStar_CR" },
  { name:"Wokka",        native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Wokka_CR" },
  { name:"Tokyo Ghoul",  native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@TokyoGhoul_CR" },
  { name:"Ranbow",       native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Ranbow_CR" },
  { name:"Minase Roka",  native:"皆瀬ロカ", org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@MinaseRoka_CR" },
  { name:"Taishi",       native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@Taishi_CR" },
  { name:"Violent Bob",  native:"",       org:"Crazy Raccoon", sub:"", url:"https://www.youtube.com/@ViolentBob_CR" },
];

// ─── Tiny components ────────────────────────────────────
function Avatar({ name, avatar, size = 52 }) {
  const [err, setErr] = useState(false);
  const initials = name ? name.slice(0, 2).toUpperCase() : "??";
  const hue = name ? [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 200;
  if (avatar && !err)
    return <img src={avatar} alt={name} onError={() => setErr(true)} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `hsl(${hue},50%,25%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 700, color: `hsl(${hue},80%,80%)`, border: "2px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Modal({ open, onClose, children }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(5px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#12192e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, boxShadow: "0 28px 80px rgba(0,0,0,0.7)", maxHeight: "90vh", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

const INP = { padding: "9px 12px", background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, color: "#d8e0f0", fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" };
const LBL = { display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#5a6a9a", fontWeight: 600 };

function StreamerForm({ initial, categories, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial || { name: "", platform: "YouTube", url: "", avatar: "", categories: [], note: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleCat = id => set("categories", form.categories.includes(id) ? form.categories.filter(c => c !== id) : [...form.categories, id]);
  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#e8eeff", fontWeight: 800 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        <label style={LBL}>Name *<input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Streamer name" style={INP} /></label>
        <label style={LBL}>Platform
          <select value={form.platform} onChange={e => set("platform", e.target.value)} style={INP}>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label style={LBL}>Channel URL<input value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." style={INP} /></label>
        <label style={LBL}>Avatar URL <span style={{ color: "#2a3555", fontWeight: 400 }}>(optional)</span><input value={form.avatar} onChange={e => set("avatar", e.target.value)} placeholder="https://..." style={INP} /></label>
        <label style={LBL}>Note<textarea value={form.note} onChange={e => set("note", e.target.value)} rows={2} style={{ ...INP, resize: "vertical" }} /></label>
        {categories.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: "#5a6a9a", fontWeight: 600, marginBottom: 8 }}>Categories</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {categories.map(cat => {
                const on = form.categories.includes(cat.id);
                return <button key={cat.id} onClick={() => toggleCat(cat.id)} style={{ padding: "4px 12px", borderRadius: 20, cursor: "pointer", border: `1px solid ${cat.color}${on ? "cc" : "44"}`, background: on ? cat.color + "33" : "transparent", color: on ? cat.color : "#4a5a80", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>{cat.name}</button>;
              })}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9, color: "#5a6a9a", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Cancel</button>
          <button disabled={!form.name.trim()} onClick={() => onSave(form)} style={{ flex: 2, padding: 10, background: form.name.trim() ? "#3b6bff" : "#151e35", border: "none", borderRadius: 9, color: form.name.trim() ? "#fff" : "#2a3a5a", cursor: form.name.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function CategoryForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [color, setColor] = useState(initial?.color || CATEGORY_COLORS[0]);
  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#e8eeff", fontWeight: 800 }}>{initial ? "Edit Category" : "New Category"}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        <label style={LBL}>Name *<input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" style={INP} /></label>
        <div>
          <div style={{ fontSize: 12, color: "#5a6a9a", fontWeight: 600, marginBottom: 8 }}>Color</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORY_COLORS.map(c => <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: color === c ? `3px solid ${c}` : "2px solid transparent", outlineOffset: 2 }} />)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9, color: "#5a6a9a", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Cancel</button>
          <button disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), color })} style={{ flex: 2, padding: 10, background: name.trim() ? color : "#151e35", border: "none", borderRadius: 9, color: name.trim() ? "#fff" : "#2a3a5a", cursor: name.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function StreamerCard({ streamer, categories, onEdit, onDelete }) {
  const [hov, setHov] = useState(false);
  const pc = PLATFORM_COLORS[streamer.platform] || "#aaa";
  const pi = PLATFORM_ICONS[streamer.platform] || "🔗";
  const cats = categories.filter(c => (streamer.categories || []).includes(c.id));
  const orgColor = ORG_META[streamer.org]?.color;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? "#1a2236" : "#131927", border: `1px solid ${hov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, transition: "all 0.15s ease", position: "relative", boxShadow: hov ? "0 8px 36px rgba(0,0,0,0.45)" : "none" }}>
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
        {orgColor && <span style={{ background: orgColor + "20", border: `1px solid ${orgColor}40`, borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700, color: orgColor }}>{streamer.org}</span>}
        {streamer.sub && <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5, padding: "2px 7px", fontSize: 9, color: "#4a5a80" }}>{streamer.sub}</span>}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", paddingRight: 88 }}>
        <Avatar name={streamer.name} avatar={streamer.avatar} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#eef2ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{streamer.name}</div>
          {streamer.native && streamer.native !== streamer.name && <div style={{ fontSize: 11, color: "#3a4a70", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{streamer.native}</div>}
          {streamer.url && <a href={streamer.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "#2e4080", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}><span style={{ color: pc }}>{pi}</span> {streamer.url.replace(/^https?:\/\//, "").slice(0, 36)}</a>}
        </div>
      </div>
      {streamer.note ? <div style={{ fontSize: 12, color: "#5060a0", lineHeight: 1.5, borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 8 }}>{streamer.note}</div> : null}
      {cats.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{cats.map(cat => <span key={cat.id} style={{ background: cat.color + "20", border: `1px solid ${cat.color}44`, borderRadius: 20, padding: "2px 9px", fontSize: 11, color: cat.color, fontWeight: 600 }}>{cat.name}</span>)}</div>}
      <div style={{ display: "flex", gap: 7 }}>
        <button onClick={() => onEdit(streamer)} style={{ flex: 1, padding: "6px 0", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, color: "#5060a0", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
        <button onClick={() => onDelete(streamer.id)} style={{ padding: "6px 11px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 7, color: "#f87171", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>✕</button>
      </div>
    </div>
  );
}

function SidebarBtn({ label, count, active, color, onClick, onEdit, onDel }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: "flex", alignItems: "center", gap: 2 }}>
      <button onClick={onClick} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: active ? "rgba(59,107,255,0.13)" : "none", border: active ? "1px solid rgba(59,107,255,0.28)" : "1px solid transparent", borderRadius: 8, cursor: "pointer", textAlign: "left", color: active ? "#a0b8ff" : "#4a5a80", fontFamily: "inherit", fontSize: 13, fontWeight: active ? 600 : 400, transition: "all 0.12s" }}>
        {color && <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />}
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
        {count !== undefined && <span style={{ fontSize: 11, background: "rgba(255,255,255,0.05)", borderRadius: 4, padding: "1px 6px", color: "#2a3a5a" }}>{count}</span>}
      </button>
      {onEdit && hov && <>
        <button onClick={onEdit} style={{ background: "none", border: "none", color: "#2a3a5a", cursor: "pointer", fontSize: 12, padding: 4, borderRadius: 4 }}>✎</button>
        <button onClick={onDel} style={{ background: "none", border: "none", color: "#2a3a5a", cursor: "pointer", fontSize: 11, padding: 4, borderRadius: 4 }}>✕</button>
      </>}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────
export default function App() {
  const [streamers, setStreamers] = useState(null);
  const [categories, setCategories] = useState(null);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [orgFilter, setOrgFilter] = useState(null);
  const [subFilter, setSubFilter] = useState(null);
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [expandedOrgs, setExpandedOrgs] = useState({});

  useEffect(() => {
    let cats = storage.get("sh_categories");
    if (!cats) {
      cats = Object.entries(ORG_META).map(([name, meta]) => ({ id: genId(), name, color: meta.color }));
      storage.set("sh_categories", cats);
    }
    setCategories(cats);

    let strs = storage.get("sh_streamers");
    if (!strs) {
      strs = RAW_STREAMERS.map(s => {
        const orgCat = cats.find(c => c.name === s.org);
        return { id: genId(), name: s.name, native: s.native || "", platform: "YouTube", url: s.url || "", avatar: "", categories: orgCat ? [orgCat.id] : [], note: "", org: s.org, sub: s.sub || "" };
      });
      storage.set("sh_streamers", strs);
    }
    setStreamers(strs);
    setReady(true);
  }, []);

  useEffect(() => { if (ready && streamers) storage.set("sh_streamers", streamers); }, [streamers, ready]);
  useEffect(() => { if (ready && categories) storage.set("sh_categories", categories); }, [categories, ready]);

  if (!ready) return (
    <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", color: "#3a4a6a" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📺</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#5a6a9a" }}>StreamHub</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Loading…</div>
      </div>
    </div>
  );

  const addStreamer = f => { setStreamers(p => [...p, { ...f, id: genId() }]); setModal(null); };
  const editStreamer = f => { setStreamers(p => p.map(s => s.id === editTarget.id ? { ...f, id: s.id } : s)); setModal(null); setEditTarget(null); };
  const delStreamer = id => setStreamers(p => p.filter(s => s.id !== id));
  const addCat = ({ name, color }) => { setCategories(p => [...p, { id: genId(), name, color }]); setModal(null); };
  const editCat = ({ name, color }) => { setCategories(p => p.map(c => c.id === editTarget.id ? { ...c, name, color } : c)); setModal(null); setEditTarget(null); };
  const delCat = id => { setCategories(p => p.filter(c => c.id !== id)); setStreamers(p => p.map(s => ({ ...s, categories: (s.categories || []).filter(c => c !== id) }))); if (activeCategory === id) setActiveCategory(null); };

  const filtered = (streamers || []).filter(s => {
    if (search) { const q = search.toLowerCase(); if (!s.name.toLowerCase().includes(q) && !(s.native || "").toLowerCase().includes(q)) return false; }
    if (activeCategory && !(s.categories || []).includes(activeCategory)) return false;
    if (orgFilter && s.org !== orgFilter) return false;
    if (subFilter && s.sub !== subFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "org") return (a.org || "").localeCompare(b.org || "");
    if (sortBy === "sub") return (a.sub || "").localeCompare(b.sub || "");
    return 0;
  });

  const orgSubs = {};
  for (const org of Object.keys(ORG_META)) {
    orgSubs[org] = [...new Set((streamers || []).filter(s => s.org === org && s.sub).map(s => s.sub))].sort();
  }
  const orgCounts = Object.keys(ORG_META).reduce((acc, o) => { acc[o] = (streamers || []).filter(s => s.org === o).length; return acc; }, {});
  const customCats = (categories || []).filter(c => !ORG_META[c.name]);
  const activeCat = categories?.find(c => c.id === activeCategory);
  const headingLabel = subFilter ? subFilter : orgFilter ? orgFilter : activeCat ? activeCat.name : "All Streamers";
  const headingColor = subFilter || orgFilter ? ORG_META[orgFilter]?.color : activeCat?.color;

  return (
    <div style={{ background: "#0a0e1a", minHeight: "100vh", color: "#d0d8ee", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column" }}>
      <header style={{ background: "#0d1220", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 18px", height: 54, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100, flexShrink: 0 }}>
        <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", color: "#4a5a80", cursor: "pointer", fontSize: 18, padding: 4 }}>☰</button>
        <span style={{ fontSize: 20 }}>📺</span>
        <span style={{ fontWeight: 800, fontSize: 17, color: "#eef2ff", letterSpacing: "-0.3px" }}>StreamHub</span>
        <div style={{ flex: 1, maxWidth: 360, margin: "0 12px" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name…" style={{ ...INP, padding: "7px 14px" }} />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...INP, width: "auto", padding: "6px 10px", fontSize: 12, color: "#4a5a80" }}>
            <option value="name">Name ↑</option>
            <option value="org">Org</option>
            <option value="sub">Branch</option>
          </select>
          <button onClick={() => setModal("add-streamer")} style={{ padding: "7px 15px", background: "#3b6bff", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Add Streamer</button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {sidebarOpen && (
          <aside style={{ width: 230, background: "#0d1220", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2, flexShrink: 0, overflowY: "auto" }}>
            <SidebarBtn label="All Streamers" count={streamers?.length} active={!activeCategory && !orgFilter && !subFilter} onClick={() => { setActiveCategory(null); setOrgFilter(null); setSubFilter(null); }} />
            <div style={{ margin: "14px 8px 6px", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#1e2c4a", textTransform: "uppercase" }}>Orgs</div>
            {Object.entries(ORG_META).map(([org, meta]) => (
              <div key={org}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <SidebarBtn label={org} count={orgCounts[org]} active={orgFilter === org && !subFilter} color={meta.color}
                    onClick={() => { setOrgFilter(orgFilter === org && !subFilter ? null : org); setSubFilter(null); setActiveCategory(null); }} />
                  {orgSubs[org]?.length > 0 && <button onClick={() => setExpandedOrgs(p => ({ ...p, [org]: !p[org] }))} style={{ background: "none", border: "none", color: "#2a3a5a", cursor: "pointer", fontSize: 11, padding: "4px 6px" }}>{expandedOrgs[org] ? "▾" : "▸"}</button>}
                </div>
                {expandedOrgs[org] && orgSubs[org]?.map(sub => (
                  <div key={sub} style={{ paddingLeft: 16 }}>
                    <SidebarBtn label={sub} count={(streamers || []).filter(s => s.org === org && s.sub === sub).length}
                      active={subFilter === sub && orgFilter === org} color={meta.color + "99"}
                      onClick={() => { setOrgFilter(org); setSubFilter(subFilter === sub && orgFilter === org ? null : sub); setActiveCategory(null); }} />
                  </div>
                ))}
              </div>
            ))}
            <div style={{ margin: "14px 8px 6px", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#1e2c4a", textTransform: "uppercase" }}>My Categories</div>
            {customCats.map(cat => (
              <SidebarBtn key={cat.id} label={cat.name} count={(streamers || []).filter(s => (s.categories || []).includes(cat.id)).length}
                active={activeCategory === cat.id} color={cat.color}
                onClick={() => { setActiveCategory(activeCategory === cat.id ? null : cat.id); setOrgFilter(null); setSubFilter(null); }}
                onEdit={() => { setEditTarget(cat); setModal("edit-cat"); }}
                onDel={() => delCat(cat.id)} />
            ))}
            <button onClick={() => setModal("add-cat")} style={{ margin: "8px 4px 0", padding: "7px 10px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 8, color: "#2e3e60", fontSize: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>+ New Category</button>
          </aside>
        )}

        <main style={{ flex: 1, padding: "22px 20px", overflowY: "auto" }}>
          <div style={{ marginBottom: 18 }}>
            <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: headingColor || "#eef2ff" }}>{headingLabel}</h1>
            <div style={{ fontSize: 12, color: "#2e3e60", marginTop: 3 }}>{filtered.length} streamer{filtered.length !== 1 ? "s" : ""}{search ? ` matching "${search}"` : ""}</div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 20px", color: "#2a3a5a" }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>📺</div>
              <div style={{ fontSize: 15, color: "#4a5a7a", marginBottom: 6 }}>No streamers found</div>
              <div style={{ fontSize: 12 }}>Try a different search or filter</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(256px, 1fr))", gap: 12 }}>
              {filtered.map(s => <StreamerCard key={s.id} streamer={s} categories={categories || []} onEdit={st => { setEditTarget(st); setModal("edit-streamer"); }} onDelete={delStreamer} />)}
            </div>
          )}
        </main>
      </div>

      <Modal open={modal === "add-streamer"} onClose={() => setModal(null)}>
        <StreamerForm categories={categories || []} onSave={addStreamer} onCancel={() => setModal(null)} title="Add Streamer" />
      </Modal>
      <Modal open={modal === "edit-streamer"} onClose={() => { setModal(null); setEditTarget(null); }}>
        {editTarget && <StreamerForm initial={editTarget} categories={categories || []} onSave={editStreamer} onCancel={() => { setModal(null); setEditTarget(null); }} title="Edit Streamer" />}
      </Modal>
      <Modal open={modal === "add-cat"} onClose={() => setModal(null)}>
        <CategoryForm onSave={addCat} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={modal === "edit-cat"} onClose={() => { setModal(null); setEditTarget(null); }}>
        {editTarget && <CategoryForm initial={editTarget} onSave={editCat} onCancel={() => { setModal(null); setEditTarget(null); }} />}
      </Modal>
    </div>
  );
}
