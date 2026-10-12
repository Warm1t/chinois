import { EverydayPhrase } from './everydayPhrasesData';

export interface CuratedWordSentenceEntry {
  hanzi: string;
  pinyin: string;
  french: string;
  situation: string;
  tip?: string;
  category: EverydayPhrase['category'];
}

/**
 * Base de données étendue de phrases d'exemples authentiques et vivantes du quotidien.
 * Rédigées par des locuteurs natifs pour illustrer chaque mot dans un contexte réel
 * (travail, commande, transport, vie sociale, émotions, santé).
 * AUCUNE phrase méta ou patron générique.
 */
export const CURATED_SENTENCES_BY_KEYWORD: Record<string, CuratedWordSentenceEntry[]> = {
  "解决": [
    {
      hanzi: "别担心，大家一起商量，一定能找到办法解决。",
      pinyin: "Bié dānxīn, dàjiā yìqǐ shāngliang, yídìng néng zhǎodào bànfǎ jiějué.",
      french: "Ne t’inquiète pas, en en discutant ensemble, nous trouverons certainement une solution.",
      situation: "Résoudre un problème en équipe.",
      category: "work"
    },
    {
      hanzi: "这个问题比较棘手，我们需要尽快想办法解决。",
      pinyin: "Zhè ge wèntí bǐjiào jíshǒu, wǒmen xūyào jìnkuài xiǎng bànfǎ jiějué.",
      french: "Ce problème est délicat, nous devons trouver un moyen de le résoudre au plus vite.",
      situation: "Traiter une urgence au travail.",
      category: "work"
    },
  ],
  "咖啡": [
    {
      hanzi: "服务员，请给我一杯热美式咖啡，不加糖。",
      pinyin: "Fúwùyuán, qǐng gěi wǒ yì bēi rè Měishì kāfēi, bù jiā táng.",
      french: "Serveur, s’il vous plaît donnez-moi un café americano chaud, sans sucre.",
      situation: "Commander dans un café ou un salon de thé.",
      tip: "不加糖 (bù jiā táng) = sans sucre ajouté.",
      category: "restaurant"
    },
    {
      hanzi: "我习惯每天早上喝一杯咖啡提神。",
      pinyin: "Wǒ xíguàn měitiān zǎoshang hē yì bēi kāfēi tíshén.",
      french: "J’ai l’habitude de boire une tasse de café chaque matin pour me réveiller.",
      situation: "Partager sa routine quotidienne.",
      tip: "提神 (tíshén) = donner un coup de fouet / réveiller l’esprit.",
      category: "social"
    },
  ],
  "水": [
    {
      hanzi: "可以帮我倒一杯温水吗？谢谢！",
      pinyin: "Kěyǐ bāng wǒ dào yì bēi wēn shuǐ ma? Xièxie!",
      french: "Pouvez-vous me verser un verre d’eau tiède s’il vous plaît ? Merci !",
      situation: "Au restaurant ou chez un hôte.",
      tip: "En Chine, l’eau tiède (温水 wēnshuǐ) est la boisson de prédilection.",
      category: "restaurant"
    },
    {
      hanzi: "运动后要多喝水，及时补充水分。",
      pinyin: "Yùndòng hòu yào duō hē shuǐ, jíshí bǔchōng shuǐfèn.",
      french: "Après le sport il faut boire beaucoup d’eau pour bien s’hydrater.",
      situation: "Conseil santé après l’effort.",
      category: "health"
    },
  ],
  "茶": [
    {
      hanzi: "你喜欢喝绿茶还是红茶？",
      pinyin: "Nǐ xǐhuan hē lǜchá háishì hóngchá?",
      french: "Tu préfères boire du thé vert ou du thé noir ?",
      situation: "Inviter un ami ou un collègue.",
      tip: "红茶 (thé rouge en chinois) correspond au thé noir occidental.",
      category: "social"
    },
    {
      hanzi: "请喝茶，这是今年新采的龙井茶。",
      pinyin: "Qǐng hē chá, zhè shì jīnnián xīn cǎi de Lóngjǐng chá.",
      french: "Prenez une tasse de thé, c’est du Longjing fraîchement récolté cette année.",
      situation: "Accueillir des invités avec hospitalité.",
      category: "social"
    },
  ],
  "牛肉": [
    {
      hanzi: "老板，来一碗牛肉面，面条要劲道一点。",
      pinyin: "Lǎobǎn, lái yì wǎn niúròumiàn, miàntiáo yào jìndao yìdiǎn.",
      french: "Patron, apportez un bol de nouilles au bœuf, avec des nouilles bien fermes.",
      situation: "Dans un petit resto de quartier.",
      tip: "劲道 (jìndao) = avec de la mâche / al dente.",
      category: "restaurant"
    },
    {
      hanzi: "这家餐馆的红烧牛肉做得非常入味。",
      pinyin: "Zhè jiā cānguǎn de hóngshāo niúròu zuò de fēicháng rùwèi.",
      french: "Le bœuf braisé à la sauce brune de ce restaurant est très savoureux.",
      situation: "Faire l’éloge d’un plat au restaurant.",
      category: "restaurant"
    },
  ],
  "买单": [
    {
      hanzi: "服务员，我们这桌买单，微信扫码。",
      pinyin: "Fúwùyuán, wǒmen zhè zhuō mǎidān, Wēixìn sǎomǎ.",
      french: "Serveur, l’addition pour notre table, je règle par WeChat.",
      situation: "En fin de repas au restaurant.",
      tip: "买单 (mǎidān) est très naturel et dynamique.",
      category: "shopping"
    },
  ],
  "结账": [
    {
      hanzi: "老板，结账！请问一共多少钱？",
      pinyin: "Lǎobǎn, jiézhàng! Qǐngwèn yígòng duōshao qián?",
      french: "Patron, l’addition ! Combien cela fait au total s’il vous plaît ?",
      situation: "Dans une échoppe ou un restaurant.",
      category: "shopping"
    },
  ],
  "便宜": [
    {
      hanzi: "老板，买两个可以算便宜一点吗？",
      pinyin: "Lǎobǎn, mǎi liǎng gè kěyǐ suàn piányi yìdiǎn ma?",
      french: "Patron, si j’en prends deux, pouvez-vous me faire un petit prix ?",
      situation: "Négocier gentiment sur un marché.",
      category: "shopping"
    },
    {
      hanzi: "这件衣服打折了，价格真的很便宜。",
      pinyin: "Zhè jiàn yīfu dǎzhé le, jiàgé zhēn de hěn piányi.",
      french: "Ce vêtement est soldé, le prix est vraiment bon marché.",
      situation: "Partager une bonne affaire de shopping.",
      category: "shopping"
    },
  ],
  "贵": [
    {
      hanzi: "这个质量很好，虽然有点贵但很值。",
      pinyin: "Zhè ge zhìliàng hěn hǎo, suīrán yǒudiǎn guì dàn hěn zhí.",
      french: "La qualité est très bonne, bien qu’un peu chère, ça en vaut la peine.",
      situation: "Donner son avis sur un achat.",
      category: "shopping"
    },
    {
      hanzi: "这里的物价太贵了，超出我的预算了。",
      pinyin: "Zhèlǐ de wùjià tài guì le, chāochū wǒ de yùsuàn le.",
      french: "Le coût de la vie ici est trop cher, cela dépasse mon budget.",
      situation: "Exprimer une contrainte budgétaire.",
      category: "shopping"
    },
  ],
  "地铁": [
    {
      hanzi: "请问去外滩坐地铁哪条线最快？",
      pinyin: "Qǐngwèn qù Wàitān zuò dìtiě nǎ tiáo xiàn zuì kuài?",
      french: "Pour aller au Bund, quelle ligne de métro est la plus rapide s’il vous plaît ?",
      situation: "Demander son chemin dans le métro.",
      category: "transport"
    },
    {
      hanzi: "下班高峰期地铁里人特别多，得抓紧扶手。",
      pinyin: "Xiàbān gāofēngqī dìtiě lǐ rén tèbié duō, děi zhuājǐn fúshǒu.",
      french: "Aux heures de pointe le métro est bondé, il faut bien tenir la rampe.",
      situation: "Prendre les transports en heure de pointe.",
      category: "transport"
    },
  ],
  "出租车": [
    {
      hanzi: "师傅，我去高铁站，大概需要多长时间？",
      pinyin: "Shīfu, wǒ qù gāotiě zhàn, dàgài xūyào duō cháng shíjiān?",
      french: "Chauffeur, je vais à la gare TGV, combien de temps ça prendra environ ?",
      situation: "En montant dans un taxi.",
      category: "transport"
    },
    {
      hanzi: "下大雨的时候很难在路边叫到出租车。",
      pinyin: "Xià dàyǔ de shíhou hěn nán zài lùbiān jiào dào chūzūchē.",
      french: "Quand il pleut fort, il est difficile de héler un taxi au bord de la route.",
      situation: "Difficulté de transport par mauvais temps.",
      category: "transport"
    },
  ],
  "机场": [
    {
      hanzi: "师傅，请开快一点，我赶着去机场登机。",
      pinyin: "Shīfu, qǐng kāi kuài yìdiǎn, wǒ gǎnzhe qù jīchǎng dēngjī.",
      french: "Chauffeur, accélérez un peu s’il vous plaît, je dois embarquer à l’aéroport.",
      situation: "Course pressée en taxi vers l’aéroport.",
      category: "transport"
    },
    {
      hanzi: "国际航班通常需要提前两到三小时到达机场。",
      pinyin: "Guójì hángbān tōngcháng xūyào tíqián liǎng dào sān xiǎoshí dàodá jīchǎng.",
      french: "Pour un vol international, il faut généralement arriver deux à trois heures à l’avance à l’aéroport.",
      situation: "Organisation d’un voyage en avion.",
      category: "transport"
    },
  ],
  "酒店": [
    {
      hanzi: "你好，我有预订，想办理入住手续。",
      pinyin: "Nǐ hǎo, wǒ yǒu yùdìng, xiǎng bànlǐ rùzhù shǒuxù.",
      french: "Bonjour, j’ai une réservation, je souhaite m’enregistrer.",
      situation: "À la réception d’un hôtel.",
      category: "housing"
    },
    {
      hanzi: "这家酒店的位置非常方便，离地铁站只有两百米。",
      pinyin: "Zhè jiā jiǔdiàn de wèizhi fēicháng fāngbiàn, lí dìtiě zhàn zhǐ yǒu liǎng bǎi mǐ.",
      french: "L’emplacement de cet hôtel est très pratique, à seulement 200 mètres du métro.",
      situation: "Évaluer l’emplacement d’un hôtel.",
      category: "housing"
    },
  ],
  "朋友": [
    {
      hanzi: "这周末我有几个朋友要来家里聚会。",
      pinyin: "Zhè zhōumò wǒ yǒu jǐ gè péngyou yào lái jiālǐ jùhuì.",
      french: "Ce week-end, quelques amis viennent à la maison pour se retrouver.",
      situation: "Parler de ses plans avec ses amis.",
      category: "social"
    },
    {
      hanzi: "他在北京留学期间结交了许多来自世界各地的朋友。",
      pinyin: "Tā zài Běijīng liúxué qījiān jiéjiāo le xǔduō láizì shìjiè gèdì de péngyou.",
      french: "Durant ses études à Pékin, il s’est lié d’amitié avec de nombreuses personnes du monde entier.",
      situation: "Parler de rencontres enrichissantes.",
      category: "social"
    },
  ],
  "工作": [
    {
      hanzi: "我最近工作有点忙，下班后再联系你。",
      pinyin: "Wǒ zuìjìn gōngzuò yǒudiǎn máng, xiàbān hòu zài liánxì nǐ.",
      french: "Je suis un peu débordé par le travail ces temps-ci, je te recontacte après le travail.",
      situation: "Envoyer un message à un proche ou un collègue.",
      category: "work"
    },
    {
      hanzi: "找工作不仅看薪水，更要看是否有个人发展空间。",
      pinyin: "Zhǎo gōngzuò bùjǐn kàn xīnshuǐ, gèng yào kàn shìfǒu yǒu gèrén fāzhǎn kōngjiān.",
      french: "Chercher un travail ne dépend pas que du salaire, mais aussi des perspectives d’évolution personnelle.",
      situation: "Réflexion professionnelle.",
      category: "work"
    },
  ],
  "努力": [
    {
      hanzi: "只要每天努力练习，中文一定会越来越流利。",
      pinyin: "Zhǐyào měitiān nǔlì liànxí, Zhōngwén yídìng huì yuèláiyuè liúlì.",
      french: "Tant qu’on s’exerce avec assiduité chaque jour, notre chinois deviendra de plus en plus fluide.",
      situation: "Encouragement et motivation personnelle.",
      category: "social"
    },
    {
      hanzi: "他在工作中非常努力，赢得了同事和领导的信任。",
      pinyin: "Tā zài gōngzuò zhōng fēicháng nǔlì, yíngdé le tóngshì hé lǐngdǎo de xìnrèn.",
      french: "Il fait preuve d’un grand dévouement au travail, ce qui lui a valu la confiance de ses collègues et de ses supérieurs.",
      situation: "Reconnaissance professionnelle.",
      category: "work"
    },
  ],
  "学习": [
    {
      hanzi: "我觉得用讲故事的方式学习中文效果最好。",
      pinyin: "Wǒ juéde yòng jiǎng gùshi de fāngshì xuéxí Zhōngwén xiàoguǒ zuì hǎo.",
      french: "Je trouve qu’apprendre le chinois à travers des histoires est la méthode la plus efficace.",
      situation: "Partager sa méthode d’apprentissage.",
      category: "social"
    },
    {
      hanzi: "学习一门新语言需要持之以恒的耐心。",
      pinyin: "Xuéxí yì mén xīn yǔyán xūyào chízhīyǐhéng de nàixīn.",
      french: "Apprendre une nouvelle langue exige de la persévérance et de la patience.",
      situation: "Conseil d’apprentissage linguistique.",
      category: "social"
    },
  ],
  "时间": [
    {
      hanzi: "明天下午你有没有时间？我们一起喝杯咖啡吧。",
      pinyin: "Míngtiān xiàwǔ nǐ yǒu méiyǒu shíjiān? Wǒmen yìqǐ hē bēi kāfēi ba.",
      french: "As-tu du temps demain après-midi ? Prenons un café ensemble.",
      situation: "Proposer un rendez-vous amical.",
      category: "social"
    },
    {
      hanzi: "时间过得真快，转眼间我们已经认识一年了。",
      pinyin: "Shíjiān guò de zhēn kuài, zhuǎnyǎnjiān wǒmen yǐjīng rènshi yì nián le.",
      french: "Le temps passe si vite, en un clin d’œil cela fait déjà un an que nous nous connaissons.",
      situation: "Évoquer le temps qui passe.",
      category: "social"
    },
  ],
  "医生": [
    {
      hanzi: "我感觉头有点疼，想去看一下医生。",
      pinyin: "Wǒ gǎnjué tóu yǒudiǎn téng, xiǎng qù kàn yíxià yīshēng.",
      french: "J’ai mal à la tête, je souhaite consulter un médecin.",
      situation: "Exprimer un problème de santé.",
      category: "health"
    },
    {
      hanzi: "医生建议我多喝热水，按时服药，注意休息。",
      pinyin: "Yīshēng jiànyì wǒ duō hē rè shuǐ, ànshí fú yào, zhùyì xiūxi.",
      french: "Le médecin m’a conseillé de boire de l’eau chaude, de prendre mes médicaments à l’heure et de me reposer.",
      situation: "Conseils médicaux après consultation.",
      category: "health"
    },
  ],
  "头疼": [
    {
      hanzi: "医生，我从昨天开始有点头疼和发烧。",
      pinyin: "Yīshēng, wǒ cóng zuótiān kāishǐ yǒudiǎn tóuténg hé fāshāo.",
      french: "Docteur, depuis hier j’ai un peu mal à la tête et de la fièvre.",
      situation: "Expliquer ses symptômes en consultation.",
      category: "health"
    },
    {
      hanzi: "电脑看久了容易头疼，起来眺望一下远方吧。",
      pinyin: "Diànnǎo kàn jiǔ le róngyì tóuténg, qǐlai tiàowàng yíxià yuǎnfāng ba.",
      french: "Regarder l’ordinateur trop longtemps donne facilement mal à la tête, lève-toi pour regarder au loin.",
      situation: "Conseil de pause au bureau.",
      category: "health"
    },
  ],
  "手机": [
    {
      hanzi: "我的手机快没电了，请问这里有充电宝吗？",
      pinyin: "Wǒ de shǒujī kuài méidiàn le, qǐngwèn zhèlǐ yǒu chōngdiànbǎo ma?",
      french: "Mon téléphone n’a presque plus de batterie, avez-vous une batterie partagée ici ?",
      situation: "Dans un café ou restaurant en Chine.",
      category: "reactions"
    },
    {
      hanzi: "在中国出门只要带一部手机，就能解决所有支付。",
      pinyin: "Zài Zhōngguó chūmén zhǐyào dài yí bù shǒujī, jiù néng jiějué suǒyǒu zhīfù.",
      french: "En Chine, il suffit de sortir avec son téléphone pour régler tous ses paiements.",
      situation: "Pratique de la vie mobile en Chine.",
      category: "social"
    },
  ],
  "密码": [
    {
      hanzi: "服务员，请问店里的无线网密码是多少？",
      pinyin: "Fúwùyuán, qǐngwèn diàn lǐ de wúxiànwǎng mìmǎ shì duōshao?",
      french: "Serveur, quel est le mot de passe du wifi s’il vous plaît ?",
      situation: "Se connecter au wifi dans un commerce.",
      category: "reactions"
    },
    {
      hanzi: "输入六位数支付密码后，交易就完成了。",
      pinyin: "Shūrù liù wèi shù zhīfù mìmǎ hòu, jiāoyì jiù wánchéng le.",
      french: "Après avoir saisi le mot de passe de paiement à 6 chiffres, la transaction est validée.",
      situation: "Règlement mobile sécurisé.",
      category: "shopping"
    },
  ],
  "辣": [
    {
      hanzi: "我不太能吃辣，请帮我做微辣或者不辣。",
      pinyin: "Wǒ bú tài néng chī là, qǐng bāng wǒ zuò wēilà huòzhě bùlà.",
      french: "Je ne supporte pas très bien le piment, pouvez-vous faire très peu épicé ou sans piment ?",
      situation: "Préciser ses restrictions culinaires.",
      category: "restaurant"
    },
    {
      hanzi: "四川菜以麻辣闻名，吃起来特别过瘾。",
      pinyin: "Sìchuān cài yǐ málà wénmíng, chī qǐlai tèbié guòyǐn.",
      french: "La cuisine du Sichuan est réputée pour sa saveur pimentée et anesthésiante, c’est très stimulant en bouche.",
      situation: "Description gastronomique régionale.",
      category: "restaurant"
    },
  ],
  "喜欢": [
    {
      hanzi: "我很喜欢这座城市的氛围，生活很方便。",
      pinyin: "Wǒ hěn xǐhuan zhè zuò chéngshì de fēnwéi, shēnghuó hěn fāngbiàn.",
      french: "J’aime beaucoup l’atmosphère de cette ville, la vie y est très pratique.",
      situation: "Exprimer ses impressions de voyage ou de vie.",
      category: "social"
    },
    {
      hanzi: "周末我最喜欢做的事情就是去老茶馆看书。",
      pinyin: "Zhōumò wǒ zuì xǐhuan zuò de shìqing jiù shì qù lǎo cháguǎn kàn shū.",
      french: "Le week-end, ce que j’aime le plus faire, c’est aller lire dans une vieille maison de thé.",
      situation: "Partager ses loisirs favoris.",
      category: "social"
    },
  ],
  "明白": [
    {
      hanzi: "我大概明白了，你能再说慢一点吗？",
      pinyin: "Wǒ dàgài míngbai le, nǐ néng zài shuō màn yìdiǎn ma?",
      french: "J’ai compris dans les grandes lignes, peux-tu répéter un peu plus lentement ?",
      situation: "En pleine conversation avec un interlocuteur.",
      category: "social"
    },
    {
      hanzi: "经你这么一解释，我心里完全明白了。",
      pinyin: "Jīng nǐ zhème yì jiěshì, wǒ xīnlǐ wánquán míngbai le.",
      french: "Grâce à ton explication, j’ai désormais parfaitement compris.",
      situation: "Remercier pour une explication claire.",
      category: "work"
    },
  ],
  "觉得": [
    {
      hanzi: "我觉得这个提议挺好的，大家都赞同。",
      pinyin: "Wǒ juéde zhè ge tíyì tǐng hǎo de, dàjiā dōu zàntóng.",
      french: "Je trouve que cette proposition est très bonne, tout le monde est d’accord.",
      situation: "Donner son avis en réunion ou entre amis.",
      category: "work"
    },
    {
      hanzi: "你觉得今天这道菜的味道怎么样？",
      pinyin: "Nǐ juéde jīntiān zhè dào cài de wèidao zěnmeyàng?",
      french: "Comment trouves-tu le goût de ce plat aujourd’hui ?",
      situation: "Demander l’avis d’un convive au restaurant.",
      category: "restaurant"
    },
  ],
  "意思": [
    {
      hanzi: "这句话很有意思，是什么意思呢？",
      pinyin: "Zhè jù huà hěn yǒu yìsi, shì shénme yìsi ne?",
      french: "Cette expression est très intéressante, que veut-elle dire au juste ?",
      situation: "Poser une question sur une tournure idiomatique.",
      category: "reactions"
    },
    {
      hanzi: "我的意思是，我们明天再决定也不迟。",
      pinyin: "Wǒ de yìsi shì, wǒmen míngtiān zài juédìng yě bù chí.",
      french: "Ce que je veux dire, c’est qu’il n’est pas trop tard pour décider demain.",
      situation: "Clarifier son intention ou sa pensée.",
      category: "work"
    },
  ],
  "天气": [
    {
      hanzi: "今天天气真舒服，不冷也不热。",
      pinyin: "Jīntiān tiānqì zhēn shūfu, bù lěng yě bú rè.",
      french: "Le temps est vraiment agréable aujourd’hui, ni trop froid ni trop chaud.",
      situation: "Entamer une petite conversation de politesse.",
      category: "social"
    },
    {
      hanzi: "看天气预报说，明天傍晚可能会下雷阵雨。",
      pinyin: "Kàn tiānqì yùbào shuō, míngtiān bàngwǎn kěnéng huì xià léizhènyǔ.",
      french: "D’après les prévisions météo, il pourrait y avoir des orages demain en fin d’après-midi.",
      situation: "Parler de la météo à venir.",
      category: "social"
    },
  ],
  "回家": [
    {
      hanzi: "今天太累了，我想早点回家好好休息。",
      pinyin: "Jīntiān tài lèi le, wǒ xiǎng zǎo diǎn huíjiā hǎohǎo xiūxi.",
      french: "Je suis épuisé aujourd’hui, je veux rentrer tôt à la maison pour bien me reposer.",
      situation: "Exprimer la fatigue après une longue journée.",
      category: "reactions"
    },
    {
      hanzi: "路上注意安全，到家了记得发个微信报平安。",
      pinyin: "Lùshang zhùyì ānquán, dào jiā le jìde fā gè Wēixìn bào píng’ān.",
      french: "Fais attention sur la route, envoie un message sur WeChat pour dire que tu es bien rentré.",
      situation: "Recommandation bienveillante en se quittant.",
      category: "social"
    },
  ],
  "散步": [
    {
      hanzi: "晚饭后我们一起去公园散散步吧。",
      pinyin: "Wǎnfàn hòu wǒmen yìqǐ qù gōngyuán sànsan bù ba.",
      french: "Après le dîner, allons faire une petite promenade dans le parc.",
      situation: "Proposer une activité détente en fin de journée.",
      category: "social"
    },
    {
      hanzi: "老人们习惯每天清晨在河边散步打拳。",
      pinyin: "Lǎorénmen xíguàn měitiān qīngchén zài hébiān sànbù dǎ quán.",
      french: "Les personnes âgées ont l’habitude de marcher et pratiquer les arts martiaux au bord de la rivière chaque matin.",
      situation: "Description de scènes de vie matinales.",
      category: "social"
    },
  ],
  "准备": [
    {
      hanzi: "大家都准备好了吗？我们要出发去机场了。",
      pinyin: "Dàjiā dōu zhǔnbèi hǎo le ma? Wǒmen yào chūfā qù jīchǎng le.",
      french: "Est-ce que tout le monde est prêt ? Nous allons partir pour l’aéroport.",
      situation: "Vérifier la préparation avant le départ.",
      category: "transport"
    },
    {
      hanzi: "他正在为下个月的汉语水平考试做认真准备。",
      pinyin: "Tā zhèngzài wèi xià gè yuè de Hànyǔ shuǐpíng kǎoshì zuò rènzhēn zhǔnbèi.",
      french: "Il se prépare sérieusement pour l’examen HSK du mois prochain.",
      situation: "Parler de ses révisions.",
      category: "social"
    },
  ],
  "决定": [
    {
      hanzi: "我们已经决定下个月去北京旅游。",
      pinyin: "Wǒmen yǐjīng juédìng xià gè yuè qù Běijīng lǚyóu.",
      french: "Nous avons déjà décidé de partir en voyage à Pékin le mois prochain.",
      situation: "Partager un projet de vacances.",
      category: "social"
    },
    {
      hanzi: "这是一个重大的决定，你最好再认真考虑一下。",
      pinyin: "Zhè shì yí gè zhòngdà de juédìng, nǐ zuì hǎo zài rènzhēn kǎolǜ yíxià.",
      french: "C’est une décision importante, tu ferais mieux d’y réfléchir encore sérieusement.",
      situation: "Conseiller un ami face à un choix important.",
      category: "social"
    },
  ],
  "打算": [
    {
      hanzi: "毕业以后，你打算留在上海工作吗？",
      pinyin: "Bìyè yǐhòu, nǐ dǎsuàn liú zài Shànghǎi gōngzuò ma?",
      french: "Après tes études, as-tu l’intention de rester travailler à Shanghai ?",
      situation: "Discuter d’avenir professionnel.",
      category: "work"
    },
    {
      hanzi: "这个周末我打算去书店买几本中文小说。",
      pinyin: "Zhè ge zhōumò wǒ dǎsuàn qù shūdiàn mǎi jǐ běn Zhōngwén xiǎoshuō.",
      french: "Ce week-end, j’ai l’intention d’aller en librairie acheter quelques romans en chinois.",
      situation: "Parler de ses sorties prévues.",
      category: "social"
    },
  ],
  "习惯": [
    {
      hanzi: "刚来中国的时候，我不太习惯这里的饮食。",
      pinyin: "Gāng lái Zhōngguó de shíhou, wǒ bú tài xíguàn zhèlǐ de yǐnshí.",
      french: "Quand je venais d’arriver en Chine, je n’étais pas très habitué à la nourriture locale.",
      situation: "Parler de son acclimatation culturelle.",
      category: "social"
    },
    {
      hanzi: "养成早睡早起的好习惯对身体很有益。",
      pinyin: "Yǎngchéng zǎoshuì zǎoqǐ de hǎo xíguàn duì shēntǐ hěn yǒuyì.",
      french: "Prendre la bonne habitude de se coucher tôt et se lever tôt est excellent pour la santé.",
      situation: "Conseil de mode de vie sain.",
      category: "health"
    },
  ],
  "发现": [
    {
      hanzi: "我突然发现钱包落在了出租车上。",
      pinyin: "Wǒ tūrán fāxiàn qiánbāo là zài le chūzūchē shang.",
      french: "Je viens soudain de m’apercevoir que j’ai oublié mon portefeuille dans le taxi.",
      situation: "S’apercevoir d’un oubli embarrassant.",
      category: "reactions"
    },
    {
      hanzi: "在阅读这篇故事时，我发现了很多实用的词汇。",
      pinyin: "Zài yuèdú zhè piān gùshi shí, wǒ fāxiàn le hěn duō shíyòng de cíhuì.",
      french: "En lisant cette histoire, j’ai découvert beaucoup de vocabulaire pratique.",
      situation: "Constat d’apprentissage enrichissant.",
      category: "social"
    },
  ],
  "商量": [
    {
      hanzi: "这件事我们先商量一下，明天再给你答复。",
      pinyin: "Zhè jiàn shì wǒmen xiān shāngliang yíxià, míngtiān zài gěi nǐ dáfù.",
      french: "Laissez-nous d’abord nous concerter sur cette affaire, nous vous répondrons demain.",
      situation: "Demander un temps de concertation avant décision.",
      category: "work"
    },
    {
      hanzi: "遇到困难时，多和朋友商量能开阔思路。",
      pinyin: "Yù dào kùnnan shí, duō hé péngyou shāngliang néng kāikuò sīlù.",
      french: "Face aux difficultés, en discuter avec des amis permet d’ouvrir de nouvelles perspectives.",
      situation: "Échange constructif face aux défis.",
      category: "social"
    },
  ],
  "考虑": [
    {
      hanzi: "请你再认真考虑一下，别急着做决定。",
      pinyin: "Qǐng nǐ zài rènzhēn kǎolǜ yíxià, bié jízhe zuò juédìng.",
      french: "Penses-y encore sérieusement s’il te plaît, ne te précipite pas pour décider.",
      situation: "Inciter à la prudence avant un engagement.",
      category: "social"
    },
    {
      hanzi: "我们在制定计划时，必须把所有风险都考虑进去。",
      pinyin: "Wǒmen zài zhìdìng jìhuà shí, bìxū bǎ suǒyǒu fēngxiǎn dōu kǎolǜ jìnqu.",
      french: "Lors de l’élaboration du plan, nous devons prendre en compte tous les risques.",
      situation: "Planification stratégique au travail.",
      category: "work"
    },
  ],
  "安排": [
    {
      hanzi: "经理把下周的工作会议安排在周二上午。",
      pinyin: "Jīnglǐ bǎ xià zhōu de gōngzuò huìyì ānpái zài zhōu’èr shàngwǔ.",
      french: "Le directeur a fixé la réunion de travail de la semaine prochaine au mardi matin.",
      situation: "Organisation d’un créneau professionnel.",
      category: "work"
    },
    {
      hanzi: "你这个周末有什么特别的安排吗？",
      pinyin: "Nǐ zhè ge zhōumò yǒu shénme tèbié de ānpái ma?",
      french: "As-tu des projets particuliers prévus pour ce week-end ?",
      situation: "Demander l’emploi du temps d’un ami.",
      category: "social"
    },
  ],
  "照顾": [
    {
      hanzi: "他生病了，这几天都是朋友在医院照顾他。",
      pinyin: "Tā shēngbìng le, zhè jǐ tiān dōu shì péngyou zài yīyuàn zhàogù tā.",
      french: "Il est malade, ces jours-ci ce sont ses amis qui veillent sur lui à l’hôpital.",
      situation: "Prendre soin d’un ami souffrant.",
      category: "health"
    },
    {
      hanzi: "出门在外，一定要照顾好自己的身体。",
      pinyin: "Chūmén zài wài, yídìng yào zhàogù hǎo zìjǐ de shēntǐ.",
      french: "Quand on est en voyage ou loin des siens, il faut bien prendre soin de sa santé.",
      situation: "Bienveillance envers un voyageur.",
      category: "social"
    },
  ],
  "担心": [
    {
      hanzi: "别担心，一切都会好起来的。",
      pinyin: "Bié dānxīn, yíqiè dōu huì hǎo qǐlai de.",
      french: "Ne t’inquiète pas, tout va s’arranger.",
      situation: "Rassurer un proche tourmenté.",
      category: "reactions"
    },
    {
      hanzi: "妈妈总是担心我在外地吃不饱穿不暖。",
      pinyin: "Māma zǒngshì dānxīn wǒ zài wàidì chī bù bǎo chuān bù nuǎn.",
      french: "Maman s’inquiète toujours que je ne mange pas assez ou n’aie pas assez chaud loin de chez moi.",
      situation: "Sollicitude maternelle touchante.",
      category: "social"
    },
  ],
  "检查": [
    {
      hanzi: "交卷之前，请大家再仔细检查一遍名字和答案。",
      pinyin: "Jiāo juàn zhīqián, qǐng dàjiā zài zǐxì jiǎnchá yí biàn míngzi hé dá’àn.",
      french: "Avant de rendre votre copie, vérifiez attentivement une dernière fois votre nom et vos réponses.",
      situation: "Consigne avant la fin d’un examen.",
      category: "social"
    },
    {
      hanzi: "医生给我做了全面的身体检查，结果一切正常。",
      pinyin: "Yīshēng gěi wǒ zuò le quánmiàn de shēntǐ jiǎnchá, jiéguǒ yíqiè zhèngcháng.",
      french: "Le médecin m’a fait un bilan de santé complet, tout est normal.",
      situation: "Rassurant bilan médical.",
      category: "health"
    },
  ],
  "提高": [
    {
      hanzi: "多跟中国人交流是提高汉语听说能力的最好方法。",
      pinyin: "Duō gēn Zhōngguórén jiāoliú shì tígāo Hànyǔ tīngshuō nénglì de zuì hǎo fāngfǎ.",
      french: "Échanger souvent avec des Chinois est la meilleure façon d’améliorer son expression orale.",
      situation: "Conseil de progression linguistique.",
      category: "social"
    },
    {
      hanzi: "通过技术升级，工厂的生产效率大大提高了。",
      pinyin: "Tōngguò jìshù shēngjí, gōngchǎng de shēngchǎn xiàolǜ dàdà tígāo le.",
      french: "Grâce à la modernisation technologique, la productivité de l’usine a fortement progressé.",
      situation: "Amélioration des performances.",
      category: "work"
    },
  ],
  "适应": [
    {
      hanzi: "我慢慢适应了这里的生活节奏和气候。",
      pinyin: "Wǒ mànmàn shìyìng le zhèlǐ de shēnghuó jiézòu hé qìhòu.",
      french: "Je me suis peu à peu adapté au rythme de vie et au climat d’ici.",
      situation: "Partager son intégration dans un nouvel environnement.",
      category: "social"
    },
    {
      hanzi: "换了新工作后，需要一段时间来适应新的团队。",
      pinyin: "Huàn le xīn gōngzuò hòu, xūyào yí duàn shíjiān lái shìyìng xīn de tuánduì.",
      french: "Après avoir changé d’emploi, il faut un temps d’adaptation à la nouvelle équipe.",
      situation: "Transition professionnelle.",
      category: "work"
    },
  ],
  "变化": [
    {
      hanzi: "这几年中国的发展变化真是太快了！",
      pinyin: "Zhè jǐ nián Zhōngguó de fāzhǎn biànhuà zhēn shì tài kuài le!",
      french: "Ces dernières années, le développement et les changements en Chine ont été fulgurants !",
      situation: "Constat admiratif sur le dynamisme urbain.",
      category: "social"
    },
    {
      hanzi: "春天的天气变化无常，忽冷忽热的。",
      pinyin: "Chūntiān de tiānqì biànhuà wúcháng, hū lěng hū rè de.",
      french: "Au printemps, la météo est imprévisible, passant brusquement du froid au chaud.",
      situation: "Description des caprices saisonniers.",
      category: "social"
    },
  ],
  "经历": [
    {
      hanzi: "这次在中国乡村的旅行是一次难忘的人生经历。",
      pinyin: "Zhè cì zài Zhōngguó xiāngcūn de lǚxíng shì yí cì nánwàng de rénshēng jīnglì.",
      french: "Ce voyage dans la campagne chinoise a été une expérience de vie inoubliable.",
      situation: "Évoquer un voyage marquant.",
      category: "social"
    },
    {
      hanzi: "只有经历过挫折，人才能真正成熟起来。",
      pinyin: "Zhǐyǒu jīnglì guò cuòzhé, rén cái néng zhēnzhèng chéngshú qǐlai.",
      french: "Ce n’est qu’en traversant des épreuves qu’on gagne véritablement en maturité.",
      situation: "Réflexion philosophique sur la vie.",
      category: "social"
    },
  ],
  "选择": [
    {
      hanzi: "菜单上的菜式很多，我都不知道该怎么选择了。",
      pinyin: "Càidān shang de càishì hěn duō, wǒ dōu bù zhīdào gāi zěnme xuǎnzé le.",
      french: "Il y a tant de plats sur le menu que je ne sais même plus lequel choisir.",
      situation: "Hésiter devant la carte d’un grand restaurant.",
      category: "restaurant"
    },
    {
      hanzi: "面临人生的十字路口，每个人都要做出自己的选择。",
      pinyin: "Miànlín rénshēng de shízìlùkǒu, měi gè rén dōu yào zuò chū zìjǐ de xuǎnzé.",
      french: "À la croisée des chemins, chacun doit faire ses propres choix.",
      situation: "Choix de vie fondamental.",
      category: "social"
    },
  ],
  "建议": [
    {
      hanzi: "如果你是第一次来，我强烈建议你尝尝这道招牌菜。",
      pinyin: "Rúguǒ nǐ shì dì yī cì lái, wǒ qiángliè jiànyì nǐ chángchang zhè dào zhāopái cài.",
      french: "Si c’est ta première visite, je te conseille vivement de goûter la spécialité de la maison.",
      situation: "Recommander chaleureusement un plat.",
      category: "restaurant"
    },
    {
      hanzi: "谢谢你的宝贵建议，这对我们的项目非常有帮助。",
      pinyin: "Xièxie nǐ de bǎoguì jiànyì, zhè duì wǒmen de xiàngmù fēicháng yǒu bāngzhù.",
      french: "Merci pour ta précieuse suggestion, elle est d’une grande aide pour notre projet.",
      situation: "Remercier un collègue pour ses idées.",
      category: "work"
    },
  ],
  "影响": [
    {
      hanzi: "父母的言行举止会对孩子产生深远的影响。",
      pinyin: "Fùmǔ de yánxíng jǔzhǐ huì duì háizi chǎnshēng shēnyuǎn de yǐngxiǎng.",
      french: "Les paroles et actes des parents exercent une influence profonde sur leurs enfants.",
      situation: "Réflexion sur l’éducation familiale.",
      category: "social"
    },
    {
      hanzi: "今晚的暴雨可能会影响明早的航班起降。",
      pinyin: "Jīnwǎn de bàoyǔ kěnéng huì yǐngxiǎng míngzǎo de hángbān qǐjiàng.",
      french: "L’averse torrentielle de ce soir risque de perturber les décollages de demain matin.",
      situation: "Alerte météo sur les transports.",
      category: "transport"
    },
  ],
  "坚持": [
    {
      hanzi: "只要坚持每天背几个生词，一年下来词汇量会非常惊人。",
      pinyin: "Zhǐyào jiānchí měitiān bèi jǐ gè shēngcí, yì nián xiàlai cíhuìliàng huì fēicháng jīngrén.",
      french: "Tant que tu persévères à mémoriser quelques mots chaque jour, ton vocabulaire sera impressionnant au bout d’un an.",
      situation: "Conseil de régularité pour Anki et le chinois.",
      category: "social"
    },
    {
      hanzi: "不管遇到多大的困难，他始终坚持自己的梦想。",
      pinyin: "Bùguǎn yù dào duō dà de kùnnan, tā shǐzhōng jiānchí zìjǐ de mèngxiǎng.",
      french: "Quelles que soient les difficultés rencontrées, il s’accroche sans faillir à son rêve.",
      situation: "Courage et fidélité à ses idéaux.",
      category: "social"
    },
  ],
  "参加": [
    {
      hanzi: "下个星期六你想参加我们举办的中法语言角吗？",
      pinyin: "Xià gè xīngqīliù nǐ xiǎng cānjiā wǒmen jǔbàn de Zhōng-Fǎ yǔyán jiǎo ma?",
      french: "Aimerais-tu participer à notre café des langues franco-chinois samedi prochain ?",
      situation: "Inviter à un événement d’échange linguistique.",
      category: "social"
    },
    {
      hanzi: "他代表学校参加了全国大学生中文演讲比赛。",
      pinyin: "Tā dàibiǎo xuéxiào cānjiā le quánguó dàxuéshēng Zhōngwén yǎnjiǎng bǐsài.",
      french: "Il a représenté son université au concours national d’éloquence en chinois.",
      situation: "Participer à une compétition prestigieuse.",
      category: "social"
    },
  ],
  "保护": [
    {
      hanzi: "我们每一个人都应该从小事做起，保护生态环境。",
      pinyin: "Wǒmen měi yí gè rén dōu yīnggāi cóng xiǎoshì zuòqǐ, bǎohù shēngtài huánjìng.",
      french: "Chacun d’entre nous devrait commencer par de petits gestes pour protéger l’environnement.",
      situation: "Sensibilisation écologique.",
      category: "social"
    },
    {
      hanzi: "出门戴墨镜可以有效保护眼睛不受紫外线伤害。",
      pinyin: "Chūmén dài mòjìng kěyǐ yǒuxiào bǎohù yǎnjing bú shòu zǐwàixiàn shānghài.",
      french: "Porter des lunettes de soleil en sortant protège efficacement les yeux des UV.",
      situation: "Conseil de protection au quotidien.",
      category: "health"
    },
  ],
  "安全": [
    {
      hanzi: "请大家系好安全带，飞机马上就要降落了。",
      pinyin: "Qǐng dàjiā jì hǎo ānquándài, fēijī mǎshàng jiù yào jiàngluò le.",
      french: "Attachez votre ceinture de sécurité s’il vous plaît, l’avion va bientôt atterrir.",
      situation: "Consigne de sécurité en vol.",
      category: "transport"
    },
    {
      hanzi: "在陌生城市旅行时，注意人身安全永远是第一位的。",
      pinyin: "Zài mòshēng chéngshì lǚxíng shí, zhùyì rénshēn ānquán yǒngyuǎn shì dì yī wèi de.",
      french: "Quand on voyage dans une ville inconnue, la sécurité personnelle passe toujours en premier.",
      situation: "Conseil de voyage prudent.",
      category: "transport"
    },
  ],
  "方便": [
    {
      hanzi: "楼下就有二十四小时便利店，买东西特别方便。",
      pinyin: "Lóuxià jiù yǒu èrshísì xiǎoshí biànlìdiàn, mǎi dōngxi tèbié fāngbiàn.",
      french: "Il y a une supérette ouverte 24h/24 en bas, faire ses courses est très commode.",
      situation: "Louer la commodité d’un quartier.",
      category: "housing"
    },
    {
      hanzi: "请问你现在方便接电话吗？有件急事想和你沟通。",
      pinyin: "Qǐngwèn nǐ xiànzài fāngbiàn jiē diànhuà ma? Yǒu jiàn jíshì xiǎng hé nǐ gōutōng.",
      french: "Est-il commode pour vous de prendre un appel en ce moment ? J’ai une urgence à évoquer.",
      situation: "Formule polie avant un coup de téléphone professionnel.",
      category: "work"
    },
  ],
  "满意": [
    {
      hanzi: "客户对我们这次提出的设计方案非常满意。",
      pinyin: "Kèhù duì wǒmen zhè cì tíchū de shèjì fāng’àn fēicháng mǎnyì.",
      french: "Le client est particulièrement satisfait de notre proposition de design.",
      situation: "Succès d’une présentation professionnelle.",
      category: "work"
    },
    {
      hanzi: "大家对这顿丰盛的晚餐都感到十分满意。",
      pinyin: "Dàjiā duì zhè dùn fēngshèng de wǎncān dōu gǎndào shífēn mǎnyì.",
      french: "Tout le monde s’est déclaré comblé par ce somptueux dîner.",
      situation: "Convivialité autour d’une bonne table.",
      category: "restaurant"
    },
  ],
  "安静": [
    {
      hanzi: "图书馆里非常安静，适合专心看书和自习。",
      pinyin: "Túshūguǎn lǐ fēicháng ānjìng, shìhé zhuānxīn kàn shū hé zìxí.",
      french: "La bibliothèque est très calme, idéale pour lire et étudier au calme.",
      situation: "Atmosphère feutrée d’étude.",
      category: "social"
    },
    {
      hanzi: "夜深了，整座城市渐渐安静下来了。",
      pinyin: "Yè shēn le, zhěng zuò chéngshì jiànjiàn ānjìng xiàlai le.",
      french: "La nuit s’est avancée, la ville entière est peu à peu devenue silencieuse.",
      situation: "Ambiance nocturne apaisée.",
      category: "social"
    },
  ],
  "热闹": [
    {
      hanzi: "夜市里灯火通明，到处都是吃小吃的人，非常热闹。",
      pinyin: "Yèshì lǐ dēnghuǒ tōngmíng, dàochù dōu shì chī xiǎochī de rén, fēicháng rènao.",
      french: "Le marché de nuit est brillamment illuminé, plein de gourmands, une ambiance très vivante.",
      situation: "Animation festive d’un marché de nuit.",
      category: "social"
    },
    {
      hanzi: "过年的时候全家人聚在一起，气氛特别热闹。",
      pinyin: "Guònián de shíhou quán jiā rén jù zài yìqǐ, qìfēn tèbié rènao.",
      french: "Pour le Nouvel An, toute la famille réunie crée une atmosphère joyeusement animée.",
      situation: "Chaleur des fêtes familiales.",
      category: "social"
    },
  ],
  "复杂": [
    {
      hanzi: "这个系统的逻辑比较复杂，我们得一步一步来梳理。",
      pinyin: "Zhè ge xìtǒng de luóji bǐjiào fùzá, wǒmen děi yí bù yí bù lái shūlǐ.",
      french: "La logique de ce système est assez complexe, nous devons l’analyser pas à pas.",
      situation: "Décomposer un défi technique.",
      category: "work"
    },
    {
      hanzi: "人际关系往往比想象中更加复杂。",
      pinyin: "Rénjì guānxì wǎngwǎng bǐ xiǎngxiàng zhōng gèngjiā fùzá.",
      french: "Les relations humaines sont souvent bien plus complexes qu’on ne l’imagine.",
      situation: "Observation sur la vie en société.",
      category: "social"
    },
  ],
  "简单": [
    {
      hanzi: "这个操作其实很简单，我演示一遍你就能学会。",
      pinyin: "Zhè ge cāozuò qíshí hěn jiǎndān, wǒ yǎnshì yí biàn nǐ jiù néng xuéhuì.",
      french: "Cette manipulation est en fait très simple, je te montre une fois et tu sauras faire.",
      situation: "Transmission bienveillante d’un savoir-faire.",
      category: "work"
    },
    {
      hanzi: "他过着一种简单而充实的生活。",
      pinyin: "Tā guò zhe yì zhǒng jiǎndān ér chōngshí de shēnghuó.",
      french: "Il mène une existence sobre et pourtant très épanouissante.",
      situation: "Apprécier la sobriété heureuse.",
      category: "social"
    },
  ],
  "清楚": [
    {
      hanzi: "刚才网络有点卡，你能再说一遍吗？这次听得很清楚。",
      pinyin: "Gāngcái wǎngluò yǒudiǎn kǎ, nǐ néng zài shuō yí biàn ma? Zhè cì tīng de hěn qīngchu.",
      french: "Le réseau ramait un peu tout à l’heure, peux-tu répéter ? Cette fois j’entends très distinctement.",
      situation: "Appel en visio ou téléphone.",
      category: "reactions"
    },
    {
      hanzi: "这份报告的结构非常清楚，一目了然。",
      pinyin: "Zhè fèn bàogào de jiégòu fēicháng qīngchu, yí mù liǎo rán.",
      french: "La structure de ce rapport est parfaitement limpide, tout est clair d’un coup d’œil.",
      situation: "Complimenter la clarté d’un travail.",
      category: "work"
    },
  ],
  "突然": [
    {
      hanzi: "正当我们走在街上时，天空突然下起了大雨。",
      pinyin: "Zhèng dāng wǒmen zǒu zài jiē shang shí, tiānkōng tūrán xià qǐ le dà yǔ.",
      french: "Juste au moment où nous marchions dans la rue, une grosse pluie s’est soudainement mise à tomber.",
      situation: "Imprévu météo soudain.",
      category: "social"
    },
    {
      hanzi: "他突然想到了一个绝妙的解决办法。",
      pinyin: "Tā tūrán xiǎng dào le yí gè juémiào de jiějué bànfǎ.",
      french: "Une excellente solution lui est soudainement venue à l’esprit.",
      situation: "Inspiration subite.",
      category: "work"
    },
  ],
  "马上": [
    {
      hanzi: "请您稍等片刻，菜马上就给您端上来。",
      pinyin: "Qǐng nín shāoděng piànkè, cài mǎshàng jiù gěi nín duān shànglai.",
      french: "Patientez un court instant s’il vous plaît, les plats vous seront servis immédiatement.",
      situation: "Le serveur fait patienter poliment.",
      category: "restaurant"
    },
    {
      hanzi: "我收拾好东西，马上就下楼找你。",
      pinyin: "Wǒ shōushi hǎo dōngxi, mǎshàng jiù xià lóu zhǎo nǐ.",
      french: "Je finis de ranger mes affaires et je descends tout de suite te retrouver.",
      situation: "Rejoindre un ami sans attendre.",
      category: "social"
    },
  ],
  "其实": [
    {
      hanzi: "很多人觉得中文很难，其实只要掌握了方法就没那么可怕。",
      pinyin: "Hěn duō rén juéde Zhōngwén hěn nán, qíshí zhǐyào zhǎngwò le fāngfǎ jiù méi nàme kěpà.",
      french: "Beaucoup pensent que le chinois est ardu, mais en réalité, avec la bonne méthode, ce n’est pas si intimidant.",
      situation: "Dédramatiser l’apprentissage du chinois.",
      category: "social"
    },
    {
      hanzi: "他表面上很严肃，其实私底下为人特别幽默。",
      pinyin: "Tā biǎomiàn shang hěn yánsù, qíshí sīdǐxià wéirén tèbié yōumò.",
      french: "Il a l’air très sévère en apparence, mais en réalité dans le privé il est plein d’humour.",
      situation: "Révéler la vraie personnalité de quelqu’un.",
      category: "social"
    },
  ],
  "终于": [
    {
      hanzi: "经过多天的努力，我们终于把这个难题攻克了！",
      pinyin: "Jīngguò duō tiān de nǔlì, wǒmen zhōngyú bǎ zhè ge nántí gōngkè le!",
      french: "Après plusieurs jours d’efforts, nous sommes enfin venus à bout de cette difficulté !",
      situation: "Soulagement et triomphe après l’effort.",
      category: "work"
    },
    {
      hanzi: "等了将近半个小时，公交车终于来了。",
      pinyin: "Děng le jiāngjìn bàn gè xiǎoshí, gōngjiāochē zhōngyú lái le.",
      french: "Après près d’une demi-heure d’attente, le bus est enfin arrivé.",
      situation: "Attente récompensée au quotidien.",
      category: "transport"
    },
  ],
  "虽然": [
    {
      hanzi: "虽然今天下着小雨，但并不影响我们游览古镇的兴致。",
      pinyin: "Suīrán jīntiān xià zhe xiǎoyǔ, dàn bìng bù yǐngxiǎng wǒmen yóulǎn gǔzhèn de xìngzhì.",
      french: "Bien qu’il bruine aujourd’hui, cela ne gâche en rien notre enthousiasme à visiter la ville ancienne.",
      situation: "Enthousiasme intact malgré les éléments.",
      category: "social"
    },
    {
      hanzi: "虽然这道题很难，但他还是坚持自己独立完成了。",
      pinyin: "Suīrán zhè dào tí hěn nán, dàn tā háishì jiānchí zìjǐ dúlì wánchéng le.",
      french: "Bien que l’exercice fût difficile, il a tenu à le terminer de façon autonome.",
      situation: "Valoriser l’autonomie et l’effort.",
      category: "social"
    },
  ],
  "无论": [
    {
      hanzi: "无论刮风下雨，他每天早晨都坚持在公园晨跑。",
      pinyin: "Wúlùn guāfēng xiàyǔ, tā měitiān zǎochén dōu jiānchí zài gōngyuán chénpǎo.",
      french: "Qu’il vente ou qu’il pleuve, il s’astreint chaque matin à son jogging dans le parc.",
      situation: "Constance sportive exemplaire.",
      category: "health"
    },
    {
      hanzi: "无论你走到哪里，家人永远是最温暖的依靠。",
      pinyin: "Wúlùn nǐ zǒu dào nǎlǐ, jiārén yǒngyuǎn shì zuì wēnnuǎn de yīkào.",
      french: "Où que tu ailles, la famille reste toujours le plus chaleureux des refuges.",
      situation: "Soutien familial indéfectible.",
      category: "social"
    },
  ],
  "只要": [
    {
      hanzi: "只要用心去体会，生活中的每一刻都充满美好。",
      pinyin: "Zhǐyào yòngxīn qù tǐhuì, shēnghuó zhōng de měi yí kè dōu chōngmǎn měihǎo.",
      french: "Tant qu’on y met du cœur, chaque instant de l’existence est riche de beauté.",
      situation: "Éloge de la pleine conscience.",
      category: "social"
    },
    {
      hanzi: "只要你提前告诉我时间，我就能开车去机场接你。",
      pinyin: "Zhǐyào nǐ tíqián gàosu wǒ shíjiān, wǒ jiù néng kāichē qù jīchǎng jiē nǐ.",
      french: "Du moment que tu me préviens à l’avance de l’heure, je pourrai venir te chercher en voiture à l’aéroport.",
      situation: "Promesse d’aide amicale.",
      category: "transport"
    },
  ],
  "几乎": [
    {
      hanzi: "他每天几乎都要喝两杯黑咖啡，这已经成了生活习惯。",
      pinyin: "Tā měitiān jīhū dōu yào hē liǎng bēi hēi kāfēi, zhè yǐjīng chéng le shēnghuó xíguàn.",
      french: "Il boit presque deux cafés noirs par jour, c’est devenu une habitude bien ancrée.",
      situation: "Routine journalière.",
      category: "social"
    },
    {
      hanzi: "赶到车站时，火车几乎就要开动了，好险！",
      pinyin: "Gǎndào chēzhàn shí, huǒchē jīhū jiù yào kāidòng le, hǎoxiǎn!",
      french: "En arrivant en gare, le train était sur le point de partir, c’était tout juste !",
      situation: "Départ sur le fil.",
      category: "transport"
    },
  ],
  "互相": [
    {
      hanzi: "我们在语言角互相学习，我教他法文，他教我中文。",
      pinyin: "Wǒmen zài yǔyán jiǎo hùxiāng xuéxí, wǒ jiāo tā Fǎwén, tā jiāo wǒ Zhōngwén.",
      french: "Nous apprenons mutuellement au café des langues : je lui enseigne le français, il m’enseigne le chinois.",
      situation: "Tandem d’apprentissage équilibré.",
      category: "social"
    },
    {
      hanzi: "同事之间互相支持，团队才能走得更远。",
      pinyin: "Tóngshì zhījiān hùxiāng zhīchí, tuánduì cái néng zǒu de gèng yuǎn.",
      french: "C’est grâce au soutien mutuel entre collègues que l’équipe va plus loin.",
      situation: "Solidarité professionnelle.",
      category: "work"
    },
  ],
  "比较": [
    {
      hanzi: "相比坐公交车，坐地铁通常比较准时。",
      pinyin: "Xiāngbǐ zuò gōngjiāochē, zuò dìtiě tōngcháng bǐjiào zhǔnshí.",
      french: "Comparé au bus, le métro est d’ordinaire plus ponctuel.",
      situation: "Comparer deux moyens de transport.",
      category: "transport"
    },
    {
      hanzi: "这家小店的菜份量足，价格也比较公道。",
      pinyin: "Zhè jiā xiǎodiàn de cài fènliàng zú, jiàgé yě bǐjiào gōngdao.",
      french: "Les portions de ce petit restaurant sont généreuses et les prix sont plutôt raisonnables.",
      situation: "Recommander un bon rapport qualité-prix.",
      category: "restaurant"
    },
  ],
  "特别": [
    {
      hanzi: "今天早上的空气特别清新，让人心情舒畅。",
      pinyin: "Jīntiān zǎoshang de kōngqì tèbié qīngxīn, ràng rén xīnqíng shūchàng.",
      french: "L’air de ce matin est particulièrement vivifiant, cela met de bonne humeur.",
      situation: "Goûter la fraîcheur matinale.",
      category: "social"
    },
    {
      hanzi: "她对中国传统茶道文化有着特别浓厚的兴趣。",
      pinyin: "Tā duì Zhōngguó chuántǒng chádào wénhuà yǒu zhe tèbié nónghòu de xìngqù.",
      french: "Elle voue un intérêt particulièrement vif à l’art traditionnel du thé chinois.",
      situation: "Passion culturelle prononcée.",
      category: "social"
    },
  ],
  "容易": [
    {
      hanzi: "学中文发音时，四声的声调往往不容易掌握。",
      pinyin: "Xué Zhōngwén fāyīn shí, sì shēng de shēngdiào wǎngwǎng bù róngyì zhǎngwò.",
      french: "Dans la prononciation du chinois, la maîtrise des quatre tons n’est pas toujours facile.",
      situation: "Difficulté classique du mandarin.",
      category: "social"
    },
    {
      hanzi: "按这个步骤来做，安装软件其实很容易。",
      pinyin: "Àn zhè ge bùzhòu lái zuò, ānzhuāng ruǎnjiàn qíshí hěn róngyì.",
      french: "En suivant ces étapes, installer le logiciel s’avère en fait très simple.",
      situation: "Explication technique rassurante.",
      category: "work"
    },
  ],
  "困难": [
    {
      hanzi: "一开始觉得口语交流很困难，但多练几周就顺手多了。",
      pinyin: "Yì kāishǐ juéde kǒuyǔ jiāoliú hěn kùnnan, dàn duō liàn jǐ zhōu jiù shùnshǒu duō le.",
      french: "Au début je trouvais l’échange oral très ardu, mais après quelques semaines de pratique c’est bien plus fluide.",
      situation: "Constat d’un cap franchi avec succès.",
      category: "social"
    },
    {
      hanzi: "面对困难不要逃避，迎难而上才能有所突破。",
      pinyin: "Miàn duì kùnnan bú yào táobì, yíng nán ér shàng cái néng yǒu suǒ tūpò.",
      french: "Ne fuis pas les difficultés, c’est en les affrontant qu’on fait des percées.",
      situation: "Motivation face à l’adversité.",
      category: "work"
    },
  ],
  "认错": [
    {
      hanzi: "不好意思，我把你认成我的老同学了。",
      pinyin: "Bù hǎoyìsi, wǒ bǎ nǐ rèn chéng wǒ de lǎo tóngxué le.",
      french: "Désolé, je vous ai confondu avec un ancien camarade de classe.",
      situation: "Méprise amicale dans la rue.",
      category: "reactions"
    },
  ],
  "认真": [
    {
      hanzi: "他对待每一项任务都非常认真，从不马虎。",
      pinyin: "Tā duìdài měi yí xiàng rènwu dōu fēicháng rènzhēn, cóng bù mǎhu.",
      french: "Il aborde chaque mission avec un grand sérieux, sans jamais de négligence.",
      situation: "Louer la rigueur d’un collaborateur.",
      category: "work"
    },
    {
      hanzi: "老师在黑板上写字，同学们在认真记笔记。",
      pinyin: "Lǎoshī zài hēibǎn shang xiězì, tóngxuémen zài rènzhēn jì bǐjì.",
      french: "L’enseignant écrit au tableau, les élèves prennent assidûment des notes.",
      situation: "Scène de classe studieuse.",
      category: "social"
    },
  ],
  "热情": [
    {
      hanzi: "当地的居民非常热情，主动给我们指路。",
      pinyin: "Dāngdì de jūmín fēicháng rèqíng, zhǔdòng gěi wǒmen zhǐ lù.",
      french: "Les habitants du coin sont très chaleureux, ils nous ont spontanément indiqué le chemin.",
      situation: "Hospitalité locale lors d’un voyage.",
      category: "social"
    },
    {
      hanzi: "她对接待每一位客人都充满了热情。",
      pinyin: "Tā duì jiēdài měi yí wèi kèrén dōu chōngmǎn le rèqíng.",
      french: "Elle accueille chaque convive avec un enthousiasme débordant.",
      situation: "Qualité d’accueil irréprochable.",
      category: "social"
    },
  ],
  "礼貌": [
    {
      hanzi: "向长辈问好是中华传统文化中非常讲究的礼貌。",
      pinyin: "Xiàng zhǎngbèi wènhǎo shì Zhōnghuá chuántǒng wénhuà zhōng fēicháng jiǎngjiu de lǐmào.",
      french: "Saluer les aînés avec déférence est une politesse essentielle dans la culture chinoise.",
      situation: "Règle de courtoisie culturelle.",
      category: "social"
    },
    {
      hanzi: "他说话很有礼貌，给所有人留下了极好的印象。",
      pinyin: "Tā shuōhuà hěn yǒu lǐmào, gěi suǒyǒu rén liú xià le jí hǎo de yìnxiàng.",
      french: "Il s’exprime avec une grande courtoisie, ce qui a fait une excellente impression sur tout le monde.",
      situation: "Comportement exemplaire.",
      category: "social"
    },
  ],
  "难过": [
    {
      hanzi: "听到这个不幸的消息，大家都感到十分难过。",
      pinyin: "Tīng dào zhè ge búxìng de xiāoxi, dàjiā dōu gǎndào shífēn nánguò.",
      french: "En apprenant cette triste nouvelle, tout le monde s’est senti profondément peiné.",
      situation: "Partager la tristesse d’une nouvelle.",
      category: "reactions"
    },
    {
      hanzi: "别难过了，这次没考好，下次再努力就是了。",
      pinyin: "Bié nánguò le, zhè cì méi kǎo hǎo, xià cì zài nǔlì jiù shì le.",
      french: "Ne sois pas triste, tu n’as pas réussi cette fois, il suffira de redoubler d’efforts la prochaine fois.",
      situation: "Consoler après un échec.",
      category: "reactions"
    },
  ],
  "生气": [
    {
      hanzi: "别生气了，他也是无心之失，不是故意的。",
      pinyin: "Bié shēngqì le, tā yě shì wúxīn zhī shī, bú shì gùyì de.",
      french: "Ne sois plus fâché, c’était une maladresse involontaire, pas fait exprès.",
      situation: "Apaiser une tension.",
      category: "reactions"
    },
    {
      hanzi: "看到这种不守信用的行为，任谁都会感到生气。",
      pinyin: "Kàn dào zhè zhǒng bù shǒu xìnyòng de xíngwéi, rèn shéi dōu huì gǎndào shēngqì.",
      french: "En voyant un tel manque de parole, n’importe qui se mettrait en colère.",
      situation: "Indignation légitime.",
      category: "reactions"
    },
  ],
  "紧张": [
    {
      hanzi: "第一次登台做中文演讲，我手心里全是汗，非常紧张。",
      pinyin: "Dì yī cì dēngtái zuò Zhōngwén yǎnjiǎng, wǒ shǒuxīn lǐ quán shì hàn, fēicháng jǐnzhāng.",
      french: "La première fois que je suis monté sur scène parler chinois, j’avais les mains moites, j’étais très tendu.",
      situation: "Trac avant de s’exprimer en public.",
      category: "reactions"
    },
    {
      hanzi: "深呼吸几次，能有效缓解面试前的紧张情绪。",
      pinyin: "Shēn hūxī jǐ cì, néng yǒuxiào huǎnjiě miànshì qián de jǐnzhāng qíngxù.",
      french: "Prendre quelques respirations profondes aide à dissiper le stress avant un entretien.",
      situation: "Gestion du stress.",
      category: "health"
    },
  ],
  "放松": [
    {
      hanzi: "周末听听轻音乐或者泡个热水澡，能让身心彻底放松。",
      pinyin: "Zhōumò tīngting qīng yīnyuè huòzhě pào gè rèshuǐ zǎo, néng ràng shēnxīn chèdǐ fàngsōng.",
      french: "Écouter une musique douce ou prendre un bon bain chaud le week-end détend complètement le corps et l’esprit.",
      situation: "Conseil bien-être et détente.",
      category: "health"
    },
    {
      hanzi: "别把弦绷得太紧，该工作时认真工作，该放松时尽情放松。",
      pinyin: "Bié bǎ xián bēng de tài jǐn, gāi gōngzuò shí rènzhēn gōngzuò, gāi fàngsōng shí jìnqíng fàngsōng.",
      french: "Ne sois pas sous tension permanente : travaille sérieusement quand il le faut, détends-toi pleinement le moment venu.",
      situation: "Équilibre de vie professionnelle et personnelle.",
      category: "social"
    },
  ],
  "聪明": [
    {
      hanzi: "这只小猫特别聪明，竟然学会了自己开门！",
      pinyin: "Zhè zhī xiǎomāo tèbié cōngmíng, jìngrán xuéhuì le zìjǐ kāi mén!",
      french: "Ce chaton est incroyablement intelligent, il a même appris à ouvrir la porte tout seul !",
      situation: "Étonnement face à l’ingéniosité animale.",
      category: "reactions"
    },
    {
      hanzi: "他很聪明，总能找到最节省时间的解题技巧。",
      pinyin: "Tā hěn cōngmíng, zǒng néng zhǎodào zuì jiéshěng shíjiān de jiětí jìqiǎo.",
      french: "Il est très vif d’esprit et trouve toujours la méthode la plus rapide pour résoudre un problème.",
      situation: "Apprécier l’agilité mentale.",
      category: "social"
    },
  ],
  "新鲜": [
    {
      hanzi: "早市上的蔬菜和水果都是清晨刚摘的，特别新鲜。",
      pinyin: "Zǎoshì shang de shūcài hé shuǐguǒ dōu shì qīngchén gāng zhāi de, tèbié xīnxiān.",
      french: "Les légumes et fruits au marché matinal viennent d’être cueillis à l’aube, ils sont extrêmement frais.",
      situation: "Marché aux fruits et légumes du matin.",
      category: "shopping"
    },
    {
      hanzi: "雨后的空气带着泥土的清香，格外新鲜。",
      pinyin: "Yǔ hòu de kōngqì dài zhe nítǔ de qīngxiāng, géwài xīnxiān.",
      french: "L’air après la pluie embaume la terre mouillée, il est d’une fraîcheur remarquable.",
      situation: "Sensation agréable après l’averse.",
      category: "social"
    },
  ],
  "精彩": [
    {
      hanzi: "昨晚的京剧演出非常精彩，博得了全场观众的喝彩。",
      pinyin: "Zuówǎn de Jīngjù yǎnchū fēicháng jīngcǎi, bódé le quánchǎng guānzhòng de hècǎi.",
      french: "La représentation d’opéra de Pékin d’hier soir était prodigieuse, saluée par les ovations du public.",
      situation: "Spectacle culturel enthousiasmant.",
      category: "social"
    },
    {
      hanzi: "这场足球比赛太精彩了，最后一分钟才决出胜负。",
      pinyin: "Zhè chǎng zúqiú bǐsài tài jīngcǎi le, zuìhòu yì fēnzhōng cái juéchū shèngfù.",
      french: "Ce match de football a été palpitant, le dénouement s’est joué dans la toute dernière minute.",
      situation: "Intensité sportive.",
      category: "social"
    },
  ],
  "流行": [
    {
      hanzi: "这首中文歌在年轻人之间非常流行，几乎人人都会唱。",
      pinyin: "Zhè shǒu Zhōngwén gē zài niánqīngrén zhījiān fēicháng liúxíng, jīhū rénrén dōu huì chàng.",
      french: "Cette chanson chinoise est très populaire parmi les jeunes, presque tout le monde sait la fredonner.",
      situation: "Tendance musicale actuelle.",
      category: "social"
    },
    {
      hanzi: "今年复古风格的服饰又流行回来了。",
      pinyin: "Jīnnián fùgǔ fēnggé de fúshì yòu liúxíng huílái le.",
      french: "La mode rétro est de nouveau très tendance cette année.",
      situation: "Tendance vestimentaire.",
      category: "shopping"
    },
  ],
  "传统": [
    {
      hanzi: "端午节吃粽子、赛龙舟是中国传承千年的传统习俗。",
      pinyin: "Duānwǔjié chī zòngzi, sài lóngzhōu shì Zhōngguó chuánchéng qiān nián de chuántǒng xísú.",
      french: "Manger des zongzi et faire la course des bateaux-dragons lors de la fête de Duanwu est une tradition millénaire en Chine.",
      situation: "Patrimoine immatériel chinois.",
      category: "social"
    },
    {
      hanzi: "这栋老建筑保留了浓厚的传统四合院特色。",
      pinyin: "Zhè dòng lǎo jiànzhù bǎoliú le nónghòu de chuántǒng sìhéyuàn tèsè.",
      french: "Cette ancienne bâtisse a conservé toute la typicité d’une cour carrée traditionnelle (siheyuan).",
      situation: "Architecture ancienne préservée.",
      category: "housing"
    },
  ],
  "现代": [
    {
      hanzi: "上海是一座充满活力、高度现代化的国际大都市。",
      pinyin: "Shànghǎi shì yí zuò chōngmǎn huólì, gāodù xiàndàihuà de guójì dà dūshì.",
      french: "Shanghai est une métropole internationale pleine de vitalité et ultra-moderne.",
      situation: "Portrait d’une grande mégapole.",
      category: "social"
    },
    {
      hanzi: "现代科技极大地改变了我们获取信息和交流的方式。",
      pinyin: "Xiàndài kējì jídà de gǎibiàn le wǒmen huòqǔ xìnxī hé jiāoliú de fāngshì.",
      french: "Les technologies contemporaines ont profondément bouleversé notre façon d’accéder à l’information et d’échanger.",
      situation: "Constat technologique.",
      category: "work"
    },
  ],
  "经验": [
    {
      hanzi: "王师傅修车三十年了，在这方面有非常丰富的经验。",
      pinyin: "Wáng shīfu xiū chē sānshí nián le, zài zhè fāngmiàn yǒu fēicháng fēngfù de jīngyàn.",
      french: "Maître Wang répare des voitures depuis 30 ans, il a une immense expérience en la matière.",
      situation: "Éloge du savoir-faire d’un artisan.",
      category: "work"
    },
    {
      hanzi: "每次失败都是积累宝贵经验的好机会。",
      pinyin: "Měi cì shībài dōu shì jīlěi bǎoguì jīngyàn de hǎo jīhuì.",
      french: "Chaque échec est une opportunité d’accumuler une précieuse expérience.",
      situation: "Sagesse face à l’apprentissage de la vie.",
      category: "social"
    },
  ],
  "机会": [
    {
      hanzi: "这次去中国出差是一个非常难得的锻炼机会。",
      pinyin: "Zhè cì qù Zhōngguó chūchāi shì yí gè fēicháng nándé de duànliàn jīhuì.",
      french: "Ce déplacement professionnel en Chine est une opportunité rare de se perfectionner.",
      situation: "Opportunité professionnelle excitante.",
      category: "work"
    },
    {
      hanzi: "机会总是留给那些有准备的人。",
      pinyin: "Jīhuì zǒngshì liú gěi nàxiē yǒu zhǔnbèi de rén.",
      french: "La chance sourit toujours aux esprits préparés.",
      situation: "Dicton universel motivant.",
      category: "social"
    },
  ],
  "水平": [
    {
      hanzi: "经过半年的浸润式学习，他的汉语口语水平有了显著提高。",
      pinyin: "Jīngguò bàn nián de jìnrùnshì xuéxí, tā de Hànyǔ kǒuyǔ shuǐpíng yǒu le xiǎnzhù tígāo.",
      french: "Après six mois d’apprentissage immersif, son niveau d’expression orale s’est remarquablement amélioré.",
      situation: "Évolution du niveau de langue.",
      category: "social"
    },
    {
      hanzi: "中国的高铁技术已经达到了世界领先水平。",
      pinyin: "Zhōngguó de gāotiě jìshù yǐjīng dádào le shìjiè lǐngxiān shuǐpíng.",
      french: "La technologie des trains à grande vitesse chinois a atteint un niveau de pointe mondial.",
      situation: "Progrès technologique.",
      category: "transport"
    },
  ],
  "成绩": [
    {
      hanzi: "得知自己汉语考试取得了优异成绩，他高兴得跳了起来。",
      pinyin: "Dézhī zìjǐ Hànyǔ kǎoshì qǔdé le yōuyì chéngjì, tā gāoxìng de tiào le qǐlai.",
      french: "En apprenant qu’il avait obtenu un excellent score à son examen de chinois, il a sauté de joie.",
      situation: "Réjouissance après résultats d’examen.",
      category: "social"
    },
    {
      hanzi: "他在销售团队中连续三个季度取得了第一名的好成绩。",
      pinyin: "Tā zài xiāoshòu tuánduì zhōng liánxù sān gè jìdù qǔdé le dì yī míng de hǎo chéngjì.",
      french: "Au sein de l’équipe commerciale, il s’est hissé à la première place pendant trois trimestres consécutifs.",
      situation: "Performance professionnelle brillante.",
      category: "work"
    },
  ],
  "情况": [
    {
      hanzi: "请你向大家详细介绍一下目前项目的进展情况。",
      pinyin: "Qǐng nǐ xiàng dàjiā xiángxì jièshào yíxià mùqián xiàngmù de jìnzhǎn qíngkuàng.",
      french: "Présentez à tous l’état d’avancement actuel du projet en détail s’il vous plaît.",
      situation: "Tour de table en réunion.",
      category: "work"
    },
    {
      hanzi: "在突发紧急情况下，大家一定要保持冷静，听从指挥。",
      pinyin: "Zài tūfā jǐnjí qíngkuàng xià, dàjiā yídìng yào bǎochí lěngjìng, tīngcóng zhǐhuī.",
      french: "En cas d’urgence soudaine, tout le monde doit garder son calme et suivre les consignes.",
      situation: "Consigne de sécurité essentielle.",
      category: "reactions"
    },
  ],
  "原因": [
    {
      hanzi: "技术团队正在紧急排查系统崩溃的具体原因。",
      pinyin: "Jìshù tuánduì zhèngzài jǐnjí páichá xìtǒng bēngkuì de jùtǐ yuányīn.",
      french: "L’équipe technique mène des investigations urgentes pour identifier la cause exacte du crash.",
      situation: "Diagnostic technique.",
      category: "work"
    },
    {
      hanzi: "无论出于什么原因，迟到了都应该提前向大家说明。",
      pinyin: "Wúlùn chū yú shénme yuányīn, chídào le dōu yīnggāi tíqián xiàng dàjiā shuōmíng.",
      french: "Quelle qu’en soit la raison, en cas de retard, on doit prévenir à l’avance.",
      situation: "Savoir-vivre en société.",
      category: "social"
    },
  ],
  "结果": [
    {
      hanzi: "我们付出了很多心血，最终取得了令人欣喜的结果。",
      pinyin: "Wǒmen fùchū le hěn duō xīnxuè, zuìzhōng qǔdé le lìng rén xīnxǐ de jiéguǒ.",
      french: "Nous y avons consacré beaucoup d’énergie, et le résultat final est particulièrement gratifiant.",
      situation: "Aboutissement heureux d’un effort.",
      category: "work"
    },
    {
      hanzi: "他本来打算搭乘末班车，结果路上塞车没赶上。",
      pinyin: "Tā běnlái dǎsuàn dāchéng mòbānchē, jiéguǒ lùshang sāichē méi gǎn shàng.",
      french: "Il prévoyait de prendre le dernier bus, mais finalement les embouteillages l’ont fait rater.",
      situation: "Mésaventure de transport.",
      category: "transport"
    },
  ],
  "办法": [
    {
      hanzi: "只要思想不滑坡，办法总比困难多！",
      pinyin: "Zhǐyào sīxiǎng bù huápō, bànfǎ zǒng bǐ kùnnan duō!",
      french: "Tant que le moral reste solide, il y aura toujours plus de solutions que de problèmes !",
      situation: "Proverbe populaire revigorant.",
      category: "social"
    },
    {
      hanzi: "请别着急，我们一定能想出一个两全其美的解决办法。",
      pinyin: "Qǐng bié zháojí, wǒmen yídìng néng xiǎng chū yí gè liǎngquánqíměi de jiějué bànfǎ.",
      french: "Ne vous inquiétez pas, nous trouverons certainement un compromis idéal qui satisfera les deux parties.",
      situation: "Négociation apaisante.",
      category: "work"
    },
  ],
  "同事": [
    {
      hanzi: "我的同事们都非常友善，遇到问题总是乐于相助。",
      pinyin: "Wǒ de tóngshìmen dōu fēicháng yǒushàn, yù dào wèntí zǒngshì lèyú xiāngzhù.",
      french: "Mes collègues sont très prévenants, toujours prêts à m’épauler en cas de difficulté.",
      situation: "Bonne entente professionnelle.",
      category: "work"
    },
    {
      hanzi: "下班后和同事们一起聚餐吃火锅是增进感情的好方式。",
      pinyin: "Xiàbān hòu hé tóngshìmen yìqǐ jùcān chī huǒguō shì zēngjìn gǎnqíng de hǎo fāngshì.",
      french: "Partager une fondue chinoise après le travail est une belle manière de souder l’équipe.",
      situation: "Convivialité hors bureau.",
      category: "social"
    },
  ],
  "领导": [
    {
      hanzi: "领导在今天的周会上表扬了整个项目组的突出表现。",
      pinyin: "Lǐngdǎo zài jīntiān de zhōuhuì shang biǎoyáng le zhěng gè xiàngmù zǔ de tūchū biǎoxiàn.",
      french: "La direction a félicité l’ensemble de l’équipe de projet lors de la réunion hebdomadaire d’aujourd’hui.",
      situation: "Félicitations de la hiérarchie.",
      category: "work"
    },
    {
      hanzi: "我们把准备好的方案提交给领导审阅了。",
      pinyin: "Wǒmen bǎ zhǔnbèi hǎo de fāng’àn tíjiāo gěi lǐngdǎo shěnyuè le.",
      french: "Nous avons soumis la proposition préparée à l’approbation de la direction.",
      situation: "Processus d’approbation de dossier.",
      category: "work"
    },
  ],
  "客户": [
    {
      hanzi: "下午两点我们要接待来自法国的重要客户。",
      pinyin: "Xiàwǔ liǎng diǎn wǒmen yào jiēdài láizì Fǎguó de zhòngyào kèhù.",
      french: "À 14 heures nous devons accueillir un client d’envergure venu de France.",
      situation: "Accueil d’une délégation commerciale.",
      category: "work"
    },
    {
      hanzi: "保持良好的沟通是维护客户长期信任的关键。",
      pinyin: "Bǎochí liánghǎo de gōutōng shì wéihù kèhù chángqī xìnrèn de guānjiàn.",
      french: "Une écoute soignée est la clé pour fidéliser la confiance durable du client.",
      situation: "Principe de relation client.",
      category: "work"
    },
  ],
  "经理": [
    {
      hanzi: "张经理正在会议室和技术团队沟通需求细节。",
      pinyin: "Zhāng jīnglǐ zhèngzài huìyìshì hé jìshù tuánduì gōutōng xūqiú xìjié.",
      french: "Le manager Zhang est en salle de réunion à clarifier les détails des exigences avec l’équipe technique.",
      situation: "Coordination managériale.",
      category: "work"
    },
    {
      hanzi: "这份合同需要总经理亲自签字盖章后才能生效。",
      pinyin: "Zhè fèn hétong xūyào zǒng jīnglǐ qīnzì qiānzì gàizhāng hòu cái néng shēngxiào.",
      french: "Ce contrat prendra effet une fois signé et tamponné en personne par le directeur général.",
      situation: "Formalité contractuelle.",
      category: "work"
    },
  ],
  "师傅": [
    {
      hanzi: "师傅，麻烦您在前面的红绿灯路口靠边停一下。",
      pinyin: "Shīfu, máfan nín zài qiánmiàn de hónglǜdēng lùkǒu kàobiān tíng yíxià.",
      french: "Chauffeur, pourriez-vous s’il vous plaît vous garer sur le côté au prochain carrefour à feux ?",
      situation: "Demander poliment au taxi de s’arrêter.",
      category: "transport"
    },
    {
      hanzi: "修自行车的师傅手法非常熟练，两分钟就补好了胎。",
      pinyin: "Xiū zìxíngchē de shīfu shǒufǎ fēicháng shúliàn, liǎng fēnzhōng jiù bǔ hǎo le tāi.",
      french: "Le réparateur de vélo est très habile, il a colmaté le pneu en deux minutes chrono.",
      situation: "Dextérité d’un artisan de quartier.",
      category: "transport"
    },
  ],
  "邻居": [
    {
      hanzi: "俗话说“远亲不如近邻”，我们的邻居关系处得特别融洽。",
      pinyin: "Súhuà shuō “yuǎnqīn bùrú jìnlín”, wǒmen de línjū guānxì chǔ de tèbié róngqià.",
      french: "Comme dit le proverbe : « Mieux vaut un voisin proche qu’un parent éloigné », nous nous entendons à merveille entre voisins.",
      situation: "Excellente entente de voisinage.",
      category: "housing"
    },
    {
      hanzi: "邻居家做烘焙，特意送了一盒刚出炉的小饼干给我们尝尝。",
      pinyin: "Línjū jiā zuò hōngbèi, tèyì sòng le yì hé gāng chū lú de xiǎo bǐnggān gěi wǒmen chángchang.",
      french: "Nos voisins faisaient de la pâtisserie, ils nous ont gentiment apporté une boîte de biscuits tout chauds à goûter.",
      situation: "Petite attention de voisinage.",
      category: "social"
    },
  ],
  "服务员": [
    {
      hanzi: "服务员，请给我们加一壶热水，顺便拿两副碗筷。",
      pinyin: "Fúwùyuán, qǐng gěi wǒmen jiā yì hú rè shuǐ, shùnbiàn ná liǎng fù wǎnkuài.",
      french: "Serveur, remettez-nous une théière d’eau chaude s’il vous plaît, et apportez deux paires de bols et baguettes.",
      situation: "Demande courante à table.",
      category: "restaurant"
    },
    {
      hanzi: "这里的服务员态度非常温和，让人感到宾至如归。",
      pinyin: "Zhèlǐ de fúwùyuán tàidu fēicháng wēnhé, ràng rén gǎndào bīn zhì rú guī.",
      french: "Le personnel ici est d’une grande douceur, on s’y sent comme chez soi.",
      situation: "Qualité du service appréciée.",
      category: "restaurant"
    },
  ],
  "迟到": [
    {
      hanzi: "今天早上下大雪导致路上交通拥堵，很多员工都迟到了。",
      pinyin: "Jīntiān zǎoshang xià dàxuě dǎozhì lùshang jiāotōng yōngdǔ, hěn duō yuángōng dōu chídào le.",
      french: "Les fortes chutes de neige de ce matin ont bouché la circulation, beaucoup d’employés sont arrivés en retard.",
      situation: "Retard collectif lié aux intempéries.",
      category: "work"
    },
    {
      hanzi: "真不好意思，地铁信号故障耽误了，我迟到了十分钟。",
      pinyin: "Zhēn bù hǎoyìsi, dìtiě xìnhào gùzhàng dānwù le, wǒ chídào le shí fēnzhōng.",
      french: "Vraiment désolé, une panne de signalisation du métro m’a retardé, j’ai dix minutes de retard.",
      situation: "S’excuser pour un retard.",
      category: "social"
    },
  ],
  "请假": [
    {
      hanzi: "我家里有点急事需要处理，想向领导请两天假。",
      pinyin: "Wǒ jiālǐ yǒudiǎn jíshì xūyào chǔlǐ, xiǎng xiàng lǐngdǎo qǐng liǎng tiān jià.",
      french: "J’ai une urgence familiale à régler, je voudrais poser deux jours de congé auprès de mon responsable.",
      situation: "Demander un congé exceptionnel.",
      category: "work"
    },
    {
      hanzi: "身体不舒服就要及时请假休息，千万别硬撑着。",
      pinyin: "Shēntǐ bù shūfu jiù yào jíshí qǐngjià xiūxi, qiānwàn bié yìng chēng zhe.",
      french: "Si tu ne te sens pas bien, pose un arrêt pour te reposer sans attendre, ne force surtout pas.",
      situation: "Bienveillance santé au travail.",
      category: "health"
    },
  ],
  "生病": [
    {
      hanzi: "换季的时候温差大，最容易着凉生病。",
      pinyin: "Huànjì de shíhou wēnchā dà, zuì róngyì zháoliáng shēngbìng.",
      french: "Aux changements de saison, l’amplitude thermique est forte, c’est le moment où l’on tombe le plus vite malade.",
      situation: "Mise en garde santé saisonnière.",
      category: "health"
    },
    {
      hanzi: "听说你生病了，现在感觉好点了吗？记得多喝热水。",
      pinyin: "Tīngshuō nǐ shēngbìng le, xiànzài gǎnjué hǎodiǎn le ma? Jìde duō hē rè shuǐ.",
      french: "J’ai appris que tu étais malade, te sens-tu un peu mieux ? Pense à bien boire de l’eau chaude.",
      situation: "Prendre des nouvelles d’un proche souffrant.",
      category: "social"
    },
  ],
  "发烧": [
    {
      hanzi: "量了一下体温，已经三十八度五了，确实发烧了。",
      pinyin: "Liáng le yíxià tǐwēn, yǐjīng sānshíbā dù wǔ le, quèshí fāshāo le.",
      french: "J’ai pris ma température, c’est déjà à 38,5°C, j’ai bel et bien de la fièvre.",
      situation: "Prise de température à domicile.",
      category: "health"
    },
    {
      hanzi: "孩子发烧了一整夜，家长急忙带他去医院看急诊。",
      pinyin: "Háizi fāshāo le yì zhěng yè, jiāzhǎng jímáng dài tā qù yīyuàn kàn jízhěn.",
      french: "L’enfant a eu de la fièvre toute la nuit, les parents l’ont emmené en urgence à l’hôpital.",
      situation: "Consultation pédiatrique urgente.",
      category: "health"
    },
  ],
  "借": [
    {
      hanzi: "我的笔没墨水了，能借你的圆珠笔用一下吗？",
      pinyin: "Wǒ de bǐ méi mòshuǐ le, néng jiè nǐ de yuánzhūbǐ yòng yíxià ma?",
      french: "Mon stylo n’a plus d’encre, puis-je t’emprunter ton stylo à bille un instant ?",
      situation: "Dépannage de matériel entre collègues.",
      category: "social"
    },
    {
      hanzi: "他从图书馆借了三本关于中国古代历史的书。",
      pinyin: "Tā cóng túshūguǎn jiè le sān běn guānyú Zhōngguó gǔdài lìshǐ de shū.",
      french: "Il a emprunté à la bibliothèque trois ouvrages sur l’histoire de la Chine antique.",
      situation: "Emprunt d’ouvrages d’étude.",
      category: "social"
    },
  ],
  "还": [
    {
      hanzi: "借的书记得按时归还，不然会有逾期罚款哦。",
      pinyin: "Jiè de shū jìde ànshí guīhuán, bùrán huì yǒu yúqī fákuǎn o.",
      french: "Rappelle-toi de rendre les livres empruntés à temps, sinon il y a une pénalité de retard.",
      situation: "Règle de restitution d’emprunt.",
      category: "social"
    },
    {
      hanzi: "我今天把上次借你的一百块现金还给你。",
      pinyin: "Wǒ jīntiān bǎ shàng cì jiè nǐ de yì bǎi kuài xiànjīn huán gěi nǐ.",
      french: "Je te rembourse aujourd’hui les 100 yuans en liquide que tu m’avais prêtés la dernière fois.",
      situation: "Rendre de l’argent emprunté.",
      category: "shopping"
    },
  ],
  "换": [
    {
      hanzi: "这件毛衣的尺码有点偏大，请问可以换成中号吗？",
      pinyin: "Zhè jiàn máoyī de chǐmǎ yǒudiǎn piāndà, qǐngwèn kěyǐ huàn chéng zhōnghào ma?",
      french: "Ce pull taille un peu grand, est-il possible de l’échanger contre une taille M s’il vous plaît ?",
      situation: "Échanger un article en boutique.",
      category: "shopping"
    },
    {
      hanzi: "坐二号线到达人民广场后，需要换乘一号线。",
      pinyin: "Zuò èrhào xiàn dàodá Rénmín Guǎngchǎng hòu, xūyào huànchéng yīhào xiàn.",
      french: "Après avoir pris la ligne 2 jusqu’à la place du Peuple, il faut changer pour la ligne 1.",
      situation: "Correspondance dans les transports.",
      category: "transport"
    },
  ],
  "打扫": [
    {
      hanzi: "周末大家一起把客厅和厨房彻底打扫得干干净净。",
      pinyin: "Zhōumò dàjiā yìqǐ bǎ kètīng hé chúfáng chèdǐ dǎsǎo de gāngānjìngjìng.",
      french: "Ce week-end, nous avons nettoyé le salon et la cuisine de fond en comble jusqu’à ce que tout soit impeccable.",
      situation: "Grand ménage du week-end.",
      category: "housing"
    },
    {
      hanzi: "客房每天上午都会有保洁阿姨按时来打扫。",
      pinyin: "Kèfáng měitiān shàngwǔ dōu huì yǒu bǎojié āyí ànshí lái dǎsǎo.",
      french: "Le personnel d’étage vient nettoyer les chambres chaque matin avec ponctualité.",
      situation: "Service d’entretien hôtelier.",
      category: "housing"
    },
  ],
  "整理": [
    {
      hanzi: "开会前我花了一小时把客户的反馈资料仔细整理好了。",
      pinyin: "Kāihuì qián wǒ huā le yì xiǎoshí bǎ kèhù de fǎnkuì zīliào zǐxì zhěnglǐ hǎo le.",
      french: "Avant la réunion, j’ai passé une heure à soigneusement synthétiser les retours des clients.",
      situation: "Préparation documentaire.",
      category: "work"
    },
    {
      hanzi: "搬家前一定要先把不需要的旧物品清理整理一遍。",
      pinyin: "Bānjiā qián yídìng yào xiān bǎ bù xūyào de jiù wùpǐn qīnglǐ zhěnglǐ yí biàn.",
      french: "Avant de déménager, il est indispensable de faire un tri dans ses vieilles affaires.",
      situation: "Organisation d’un déménagement.",
      category: "housing"
    },
  ],
  "搬家": [
    {
      hanzi: "我下周就要搬家了，新公寓离公司只有两站地铁。",
      pinyin: "Wǒ xià zhōu jiù yào bānjiā le, xīn gōngyù lí gōngsī zhǐ yǒu liǎng zhàn dìtiě.",
      french: "Je déménage la semaine prochaine, mon nouvel appartement n’est qu’à deux stations de métro du bureau.",
      situation: "Changement de domicile bienvenu.",
      category: "housing"
    },
    {
      hanzi: "搬家虽然很繁琐，但住进新家时的心情特别舒畅。",
      pinyin: "Bānjiā suīrán hěn fánsuǒ, dàn zhù jìn xīn jiā shí de xīnqíng tèbié shūchàng.",
      french: "Même si déménager est contraignant, s’installer dans un nouveau chez-soi procure une immense satisfaction.",
      situation: "Plaisir de s’installer dans un nouveau logement.",
      category: "housing"
    },
  ],
  "租": [
    {
      hanzi: "我想在市中心租一套一室一厅的公寓，交通要方便。",
      pinyin: "Wǒ xiǎng zài shìzhōngxīn zū yí tào yíshìyìtīng de gōngyù, jiāotōng yào fāngbiàn.",
      french: "Je souhaite louer un deux-pièces au centre-ville, avec des transports pratiques.",
      situation: "Recherche de location immobilière.",
      category: "housing"
    },
    {
      hanzi: "在西湖边骑行游玩，扫码租一辆共享单车最惬意了。",
      pinyin: "Zài Xīhú biān qíxíng yóuwán, sǎomǎ zū yí liàng gòngxiǎng dānchē zuì qièyì le.",
      french: "Pour flâner le long du lac de l’Ouest, scanner et louer un vélo partagé est un pur délice.",
      situation: "Balade touristique à vélo.",
      category: "transport"
    },
  ],
  "关门": [
    {
      hanzi: "出门前请随手把门关好，并检查门锁是否锁上。",
      pinyin: "Chūmén qián qǐng suíshǒu bǎ mén guān hǎo, bìng jiǎnchá mén suǒ shìfǒu suǒ shàng.",
      french: "Fermez bien la porte derrière vous en sortant et vérifiez qu’elle est bien verrouillée.",
      situation: "Précaution de sécurité domestique.",
      category: "housing"
    },
    {
      hanzi: "这家书店平时晚上十点准时关门。",
      pinyin: "Zhè jiā shūdiàn píngshí wǎnshang shí diǎn zhǔnshí guānmén.",
      french: "Cette librairie ferme habituellement à 22 heures précises chaque soir.",
      situation: "Horaires de fermeture d’un commerce.",
      category: "shopping"
    },
  ],
  "开门": [
    {
      hanzi: "早晨八点半，超市准时开门迎接前来的顾客。",
      pinyin: "Zǎochén bā diǎn bàn, chāoshì zhǔnshí kāimén yíngjiē qiánlái de gùkè.",
      french: "À huit heures et demie du matin, le supermarché ouvre ses portes aux clients.",
      situation: "Ouverture matinale d’un magasin.",
      category: "shopping"
    },
    {
      hanzi: "听到敲门声，他连忙起身去开门迎接朋友。",
      pinyin: "Tīng dào qiāo mén shēng, tā liánmáng qǐshēn qù kāimén yíngjiē péngyou.",
      french: "En entendant frapper à la porte, il s’est empressé d’aller ouvrir pour accueillir ses amis.",
      situation: "Hospitalité amicale.",
      category: "housing"
    },
  ],
  "忘记": [
    {
      hanzi: "出门太匆忙，我居然忘记带家里的钥匙了！",
      pinyin: "Chūmén tài cōngmáng, wǒ jūrán wàngjì dài jiālǐ de yàoshi le!",
      french: "Je suis parti avec trop de précipitation, j’ai carrément oublié de prendre mes clés de maison !",
      situation: "Oubli fâcheux en quittant son domicile.",
      category: "reactions"
    },
    {
      hanzi: "无论过去多少年，我都不会忘记那段美好的留学时光。",
      pinyin: "Wúlùn guòqù duōshao nián, wǒ dōu bú huì wàngjì nà duàn měihǎo de liúxué shíguāng.",
      french: "Quel que soit le nombre d’années écoulées, je n’oublierai jamais cette formidable période d’études à l’étranger.",
      situation: "Nostalgie chaleureuse d’une belle expérience.",
      category: "social"
    },
  ],
  "记得": [
    {
      hanzi: "明天有重要会议，出门前记得把电脑充电器带上。",
      pinyin: "Míngtiān yǒu zhòngyào huìyì, chūmén qián jìde bǎ diànnǎo chōngdiànqì dài shàng.",
      french: "Nous avons une réunion capitale demain, pense à emporter le chargeur de ton ordinateur avant de partir.",
      situation: "Rappel d’organisation de travail.",
      category: "work"
    },
    {
      hanzi: "我还清楚记得第一次吃到北京烤鸭时的惊喜感觉。",
      pinyin: "Wǒ hái qīngchu jìde dì yī cì chī dào Běijīng kǎoyā shí de jīngxǐ gǎnjué.",
      french: "Je me souviens encore distinctement de l’émerveillement ressenti la première fois où j’ai goûté au canard laqué de Pékin.",
      situation: "Souvenir culinaire impérissable.",
      category: "restaurant"
    },
  ],
  "买": [
    {
      hanzi: "下班路过水果摊时，我顺便买了两斤新鲜的苹果。",
      pinyin: "Xiàbān lùguò shuǐguǒ tān shí, wǒ shùnbiàn mǎi le liǎng jīn xīnxiān de píngguǒ.",
      french: "En passant devant l’étal de fruits après le travail, j’ai acheté au passage un kilo de pommes bien fraîches.",
      situation: "Course alimentaire quotidienne.",
      category: "shopping"
    },
    {
      hanzi: "网上买高铁票非常方便，直接刷身份证就能进站。",
      pinyin: "Wǎng shang mǎi gāotiě piào fēicháng fāngbiàn, zhíjiē shuā shēnfènzhèng jiù néng jìn zhàn.",
      french: "Acheter un billet de TGV en ligne est très facile, on passe les portillons directement avec sa pièce d’identité.",
      situation: "Achat de billet de train en Chine.",
      category: "transport"
    },
  ],
  "卖": [
    {
      hanzi: "这家老字号点心铺每天清晨刚出炉的包子半小时就卖光了。",
      pinyin: "Zhè jiā lǎozìhào diǎnxīn pù měitiān qīngchén gāng chū lú de bāozi bàn xiǎoshí jiù mài guāng le.",
      french: "Dans cette échoppe traditionnelle, les baozi tout chauds sortis du panier sont vendus en moins d’une demi-heure chaque matin.",
      situation: "Succès d’une échoppe culinaire réputée.",
      category: "restaurant"
    },
    {
      hanzi: "他在二手交易平台上把闲置的旧吉他卖给了一位音乐学生。",
      pinyin: "Tā zài èrshǒu jiāoyì píngtái shang bǎ xiánzhì de jiù jítā mài gěi le yí wèi yīnyuè xuésheng.",
      french: "Il a vendu sa vieille guitare inutilisée à un étudiant en musique sur une plateforme d’occasion.",
      situation: "Vente d’objet d’occasion.",
      category: "shopping"
    },
  ],
  "吃": [
    {
      hanzi: "今天中午我们一起去学校旁边的小馆子吃面吧。",
      pinyin: "Jīntiān zhōngwǔ wǒmen yìqǐ qù xuéxiào pángbiān de xiǎo guǎnzi chī miàn ba.",
      french: "Allons manger des nouilles ensemble ce midi dans le petit restaurant à côté de l’école.",
      situation: "Pause déjeuner décontractée.",
      category: "restaurant"
    },
    {
      hanzi: "多吃新鲜蔬菜水果，少吃油腻食物，对肠胃更有好处。",
      pinyin: "Duō chī xīnxiān shūcài shuǐguǒ, shǎo chī yóunì shíwù, duì chángwèi gèng yǒu hǎochu.",
      french: "Manger beaucoup de légumes et fruits frais et réduire les plats trop gras est bien meilleur pour l’estomac.",
      situation: "Conseil diététique quotidien.",
      category: "health"
    },
  ],
  "喝": [
    {
      hanzi: "天冷了，喝一碗热气腾腾的鸡汤让人浑身暖和。",
      pinyin: "Tiān lěng le, hē yì wǎn rèqì téngténg de jītāng ràng rén húnshēn nuǎnhuo.",
      french: "Il fait froid dehors, boire un bol de bouillon de poulet bien fumant réchauffe tout le corps.",
      situation: "Boisson réconfortante par temps froid.",
      category: "restaurant"
    },
    {
      hanzi: "医生建议他少喝冰镇饮料，多喝温水。",
      pinyin: "Yīshēng jiànyì tā shǎo hē bīngzhèn yǐnliào, duō hē wēn shuǐ.",
      french: "Le médecin lui a recommandé de limiter les boissons glacées et de privilégier l’eau tiède.",
      situation: "Conseil de santé traditionnelle chinoise.",
      category: "health"
    },
  ],
  "睡": [
    {
      hanzi: "昨天晚上失眠了，只睡了四个小时，今天精神不太好。",
      pinyin: "Zuótiān wǎnshang shīmián le, zhǐ shuì le sì gè xiǎoshí, jīntiān jīngshen bú tài hǎo.",
      french: "J’ai fait des insomnies hier soir et n’ai dormi que quatre heures, je ne suis pas très en forme aujourd’hui.",
      situation: "Manque de sommeil le matin.",
      category: "health"
    },
    {
      hanzi: "别熬夜了，早点睡才能保持充沛的精力。",
      pinyin: "Bié áoyè le, zǎo diǎn shuì cái néng bǎochí chōngpèi de jīnglì.",
      french: "Arrête de veiller si tard, se coucher tôt est le seul moyen de garder une belle énergie.",
      situation: "Conseil bienveillant pour la nuit.",
      category: "health"
    },
  ],
  "起床": [
    {
      hanzi: "我平时习惯每天早晨六点半准时起床锻炼身体。",
      pinyin: "Wǒ píngshí xíguàn měitiān zǎochén liù diǎn bàn zhǔnshí qǐchuáng duànliàn shēntǐ.",
      french: "D’ordinaire j’ai pour habitude de me lever précisément à six heures et demie pour faire de l’exercice.",
      situation: "Routine matinale active.",
      category: "health"
    },
    {
      hanzi: "今天不用上班，他破例睡到九点才懒洋洋地起床。",
      pinyin: "Jīntiān bú yòng shàngbān, tā pòlì shuì dào jiǔ diǎn cái lǎnyāngyāng de qǐchuáng.",
      french: "Comme il ne travaille pas aujourd’hui, il a fait la grasse matinée jusqu’à neuf heures avant de se lever nonchalamment.",
      situation: "Grasse matinée méritée.",
      category: "social"
    },
  ],
  "上班": [
    {
      hanzi: "他每天骑半个小时自行车去公司上班，既环保又能锻炼。",
      pinyin: "Tā měitiān qí bàn gè xiǎoshí zìxíngchē qù gōngsī shàngbān, jì huánbǎo yòu néng duànliàn.",
      french: "Il se rend au travail à vélo en une demi-heure chaque jour, c’est écologique et cela fait faire du sport.",
      situation: "Trajet domicile-travail actif.",
      category: "work"
    },
    {
      hanzi: "星期一早晨上班路上车流量总是特别大。",
      pinyin: "Xīngqīyī zǎochén shàngbān lùshang chēliúliàng zǒngshì tèbié dà.",
      french: "Le trafic sur le chemin du bureau est particulièrement dense le lundi matin.",
      situation: "Circulation aux heures de bureau.",
      category: "transport"
    },
  ],
  "下班": [
    {
      hanzi: "今晚下班后，我们几个同事约好一起去打羽毛球。",
      pinyin: "Jīnwǎn xiàbān hòu, wǒmen jǐ gè tóngshì yuē hǎo yìqǐ qù dǎ yǔmáoqiú.",
      french: "Après le boulot ce soir, avec quelques collègues nous avons convenu d’aller jouer au badminton.",
      situation: "Activité sportive entre collègues.",
      category: "social"
    },
    {
      hanzi: "把手头这份报表收尾后，我就可以打卡下班了。",
      pinyin: "Bǎ shǒutóu zhè fèn bàobiǎo shōuwěi hòu, wǒ jiù kěyǐ dǎkǎ xiàbān le.",
      french: "Dès que j’aurai bouclé ce tableau récapitulatif, je pourrai badger et quitter le travail.",
      situation: "Fin de journée au travail.",
      category: "work"
    },
  ],
  "开会": [
    {
      hanzi: "我们部门正在开周会，讨论下季度的市场推广方案。",
      pinyin: "Wǒmen bùmén zhèngzài kāi zhōuhuì, tǎolùn xià jīdù de shìchǎng tuīguǎng fāng’àn.",
      french: "Notre département est en réunion hebdomadaire pour débattre de la campagne marketing du prochain trimestre.",
      situation: "Réunion de travail d’équipe.",
      category: "work"
    },
    {
      hanzi: "开会时请大家把手机调成静音模式，以免打扰讨论。",
      pinyin: "Kāihuì shí qǐng dàjiā bǎ shǒujī tiáo chéng jìngyīn móshì, yǐmiǎn dǎrǎo tǎolùn.",
      french: "Pendant la réunion, mettez vos téléphones en mode silencieux pour ne pas perturber les débats.",
      situation: "Règle de courtoisie en salle de réunion.",
      category: "work"
    },
  ],
  "写": [
    {
      hanzi: "他花了整整三个月时间，才写完了这篇学术论文。",
      pinyin: "Tā huā le zhěngzhěng sān gè yuè shíjiān, cái xiě wán le zhè piān xuéshù lùnwén.",
      french: "Il lui a fallu trois mois pleins pour achever la rédaction de ce mémoire académique.",
      situation: "Aboutissement d’un travail d’écriture.",
      category: "social"
    },
    {
      hanzi: "学习写汉字需要掌握正确的笔顺和结构。",
      pinyin: "Xuéxí xiě Hànzì xūyào zhǎngwò zhèngquè de bǐshùn hé jiégòu.",
      french: "Apprendre à écrire les sinogrammes exige de maîtriser l’ordre des traits et l’équilibre des caractères.",
      situation: "Apprentissage de la calligraphie et de l’écriture chinoise.",
      category: "social"
    },
  ],
  "发": [
    {
      hanzi: "会议纪要我已经整理好并通过电子邮件发给全组了。",
      pinyin: "Huìyì jìyào wǒ yǐjīng zhěnglǐ hǎo bìng tōngguò diànzǐ yóujiàn fā gěi quán zǔ le.",
      french: "J’ai mis en forme le compte-rendu de réunion et l’ai envoyé par courriel à l’ensemble de l’équipe.",
      situation: "Transmission professionnelle d’informations.",
      category: "work"
    },
    {
      hanzi: "到达酒店后记得给我发一条微信，让我安心。",
      pinyin: "Dàodá jiǔdiàn hòu jìde gěi wǒ fā yì tiáo Wēixìn, ràng wǒ ānxīn.",
      french: "En arrivant à l’hôtel, pense à m’envoyer un message WeChat pour me rassurer.",
      situation: "Donner des nouvelles en voyage.",
      category: "social"
    },
  ],
  "收": [
    {
      hanzi: "你寄给我的包裹我今天下午已经顺利收到了，非常感谢！",
      pinyin: "Nǐ jì gěi wǒ de bāoguǒ wǒ jīntiān xiàwǔ yǐjīng shùnlì shōudào le, fēicháng gǎnxiè!",
      french: "J’ai bien reçu le colis que tu m’avais envoyé cet après-midi, merci beaucoup !",
      situation: "Accuser réception d’un envoi postal.",
      category: "social"
    },
    {
      hanzi: "请问在这个旅游景点，门票可以微信扫码收取吗？",
      pinyin: "Qǐngwèn zài zhè ge lǚyóu jǐngdiǎn, ménpiào kěyǐ Wēixìn sǎomǎ shōuqǔ ma?",
      french: "Pour ce site touristique, le billet d’entrée peut-il être réglé par scan WeChat ?",
      situation: "Paiement à la billetterie touristique.",
      category: "shopping"
    },
  ],
  "懂": [
    {
      hanzi: "他虽然只学了一年中文，但普通的日常对话已经完全能听懂了。",
      pinyin: "Tā suīrán zhǐ xué le yì nián Zhōngwén, dàn pǔtōng de rìcháng duìhuà yǐjīng wánquán néng tīngdǒng le.",
      french: "Bien qu’il n’étudie le chinois que depuis un an, il comprend déjà parfaitement les conversations courantes.",
      situation: "Progrès en compréhension orale.",
      category: "social"
    },
    {
      hanzi: "如果你对这一段语法规则有哪里不懂，随时可以举手提问。",
      pinyin: "Rúguǒ nǐ duì zhè yí duàn yǔfǎ guīzé yǒu nǎlǐ bù dǒng, suíshí kěyǐ jǔshǒu tíwèn.",
      french: "Si tu as la moindre incompréhension sur ce point de grammaire, tu peux lever la main pour poser ta question à tout moment.",
      situation: "Encouragement à clarifier un doute de cours.",
      category: "social"
    },
  ],
  "找": [
    {
      hanzi: "你在找什么？需要我帮你一起找吗？",
      pinyin: "Nǐ zài zhǎo shénme? Xūyào wǒ bāng nǐ yìqǐ zhǎo ma?",
      french: "Que cherches-tu ? Veux-tu que je t’aide à chercher ?",
      situation: "Proposer son aide pour retrouver un objet égaré.",
      category: "social"
    },
    {
      hanzi: "老板，给你五十块钱，不用找零钱了。",
      pinyin: "Lǎobǎn, gěi nǐ wǔshí kuài qián, bú yòng zhǎo língqián le.",
      french: "Patron, voici cinquante yuans, vous pouvez garder la monnaie.",
      situation: "Laisser un pourboire ou faire l’appoint.",
      category: "shopping"
    },
  ],
  "带": [
    {
      hanzi: "外面天色阴沉快要下雨了，出门记得带上雨伞。",
      pinyin: "Wàimiàn tiānsè yīnchén kuài yào xià yǔ le, chūmén jìde dài shàng yǔsǎn.",
      french: "Le ciel est sombre dehors et il va bientôt pleuvoir, n’oublie pas de prendre ton parapluie en sortant.",
      situation: "Recommandation météo de prévoyance.",
      category: "social"
    },
    {
      hanzi: "下个月朋友来成都旅游，我打算亲自带他去尝尝地道川菜。",
      pinyin: "Xià gè yuè péngyou lái Chéngdū lǚyóu, wǒ dǎsuàn qīnzì dài tā qù chángchang dìdao Chuāncài.",
      french: "Mon ami vient visiter Chengdu le mois prochain, je prévois de l’emmener moi-même déguster d’authentiques plats sichuanais.",
      situation: "Faire visiter sa ville à un proche.",
      category: "restaurant"
    },
  ],
  "送": [
    {
      hanzi: "天太晚了没有公交车，我开车送你回家吧。",
      pinyin: "Tiān tài wǎn le méiyǒu gōngjiāochē, wǒ kāichē sòng nǐ huíjiā ba.",
      french: "Il est trop tard et il n’y a plus de bus, laisse-moi te raccompagner chez toi en voiture.",
      situation: "Gentillesse en raccompagnant un proche.",
      category: "transport"
    },
    {
      hanzi: "这是他从云南带回来的普洱茶，特意送给长辈当礼物。",
      pinyin: "Zhè shì tā cóng Yúnnán dài huílái de Pǔ’ěr chá, tèyì sòng gěi zhǎngbèi dāng lǐwù.",
      french: "C’est du thé Pu’er qu’il a rapporté du Yunnan spécialement pour l’offrir en cadeau aux aînés.",
      situation: "Offrir un cadeau respectueux.",
      category: "social"
    },
  ],
  "接": [
    {
      hanzi: "我的朋友下午四点到达浦东机场，我得准时去接他。",
      pinyin: "Wǒ de péngyou xiàwǔ sì diǎn dàodá Pǔdōng jīchǎng, wǒ děi zhǔnshí qù jiē tā.",
      french: "Mon ami atterrit à l’aéroport de Pudong à 16h, je dois aller l’accueillir à l’heure.",
      situation: "Aller chercher quelqu’un à l’aéroport.",
      category: "transport"
    },
    {
      hanzi: "我现在正在开车，不方便接电话，一会儿打给你。",
      pinyin: "Wǒ xiànzài zhèngzài kāichē, bù fāngbiàn jiē diànhuà, yíhuìr dǎ gěi nǐ.",
      french: "Je conduis en ce moment, je ne peux pas prendre l’appel, je te rappelle dans un instant.",
      situation: "Refuser poliment un appel au volant.",
      category: "transport"
    },
  ],
  "修": [
    {
      hanzi: "我的笔记本电脑屏幕坏了，请问附近有维修店吗？",
      pinyin: "Wǒ de bǐjìběn diànnǎo píngmù huài le, qǐngwèn fùjìn yǒu wéixiū diàn ma?",
      french: "L’écran de mon ordinateur portable est cassé, y a-t-il un réparateur dans les environs s’il vous plaît ?",
      situation: "Recherche d’un service de réparation informatique.",
      category: "shopping"
    },
    {
      hanzi: "这条马路正在修路施工，过往车辆需要减速慢行。",
      pinyin: "Zhè tiáo mǎlù zhèngzài xiū lù shīgōng, guòwǎng chēliàng xūyào jiǎnsù mànxíng.",
      french: "Cette avenue est en travaux de réfection, les véhicules doivent ralentir.",
      situation: "Alerte de circulation routière.",
      category: "transport"
    },
  ],
  "洗": [
    {
      hanzi: "饭前便后要洗手，这是保持卫生的好习惯。",
      pinyin: "Fàn qián biàn hòu yào xǐ shǒu, zhè shì bǎochí wèishēng de hǎo xíguàn.",
      french: "Se laver les mains avant de manger et après être allé aux toilettes est une bonne règle d’hygiène.",
      situation: "Consigne d’hygiène élémentaire.",
      category: "health"
    },
    {
      hanzi: "今天天气晴朗阳光充足，正好把床单和被套洗了晒干。",
      pinyin: "Jīntiān tiānqì qínglǎng yángguāng chōngzú, zhènghǎo bǎ chuángdān hé bèitào xǐ le shài gān.",
      french: "Le temps est radieux et très ensoleillé aujourd’hui, l’occasion rêvée de laver les draps et de les faire sécher.",
      situation: "Tâche ménagère par beau temps.",
      category: "housing"
    },
  ],
  "拿": [
    {
      hanzi: "他手里拿着一本书，安安静静地坐在长椅上阅读。",
      pinyin: "Tā shǒu lǐ ná zhe yì běn shū, ān’ānjìngjìng de zuò zài chángyǐ shang yuèdú.",
      french: "Il tient un livre à la main, assis paisiblement sur le banc en train de lire.",
      situation: "Scène de lecture paisible.",
      category: "social"
    },
    {
      hanzi: "请帮我把桌子上的那份文件拿过来一下，谢谢。",
      pinyin: "Qǐng bāng wǒ bǎ zhuōzi shang de nà fèn wénjiàn ná guòlai yíxià, xièxie.",
      french: "Prends-moi ce document sur la table s’il te plaît, merci.",
      situation: "Demander un objet au bureau.",
      category: "work"
    },
  ],
  "放": [
    {
      hanzi: "钥匙就放在门边的鞋柜上，你一进门就能看见。",
      pinyin: "Yàoshi jiù fàng zài mén biān de xiéguì shang, nǐ yí jìn mén jiù néng kànjiàn.",
      french: "Les clés sont posées sur le meuble à chaussures près de la porte, tu les verras dès que tu entreras.",
      situation: "Indiquer où se trouve un objet chez soi.",
      category: "housing"
    },
    {
      hanzi: "假期的最后一天，大家依依不舍地收拾行囊准备返程。",
      pinyin: "Jiàqī de zuìhòu yì tiān, dàjiā yīyībùshě de shōushi xíngnang zhǔnbèi fǎnchéng.",
      french: "Au dernier jour des vacances, chacun prépare ses bagages avec nostalgie avant de repartir.",
      situation: "Fin de congés.",
      category: "social"
    },
  ],
  "住": [
    {
      hanzi: "你现在住在哪个区域？离你的公司远不远？",
      pinyin: "Nǐ xiànzài zhù zài nǎ ge qūyù? Lí nǐ de gōngsī yuǎn bù yuǎn?",
      french: "Dans quel quartier habites-tu actuellement ? Est-ce loin de ton travail ?",
      situation: "Demander le lieu de résidence d’un ami.",
      category: "social"
    },
    {
      hanzi: "我们在古城里住了一家很有历史韵味的客栈。",
      pinyin: "Wǒmen zài gǔchéng lǐ zhù le yì jiā hěn yǒu lìshǐ yùnwèi de kèzhàn.",
      french: "Dans la vieille ville, nous avons logé dans une auberge pleine de charme historique.",
      situation: "Logement typique lors d’un séjour.",
      category: "housing"
    },
  ],
  "离开": [
    {
      hanzi: "火车马上就要离开站台了，请送行的亲友尽快下车。",
      pinyin: "Huǒchē mǎshàng jiù yào líkāi zhàntái le, qǐng sòngxíng de qīnyǒu jìnkuài xià chē.",
      french: "Le train va quitter le quai d’un instant à l’autre, les accompagnateurs sont priés de descendre.",
      situation: "Annonce en gare avant départ.",
      category: "transport"
    },
    {
      hanzi: "离开家乡多年后重返故里，眼前的一切既熟悉又新鲜。",
      pinyin: "Líkāi jiāxiāng duō nián hòu chóngfǎn gùlǐ, yǎnqián de yíqiè jì shúxī yòu xīnxiān.",
      french: "Après avoir quitté sa terre natale pendant des années, y revenir offre un spectacle à la fois familier et renouvelé.",
      situation: "Émotion du retour au pays natal.",
      category: "social"
    },
  ],
  "出发": [
    {
      hanzi: "一切准备就绪，我们明早六点准时开车出发。",
      pinyin: "Yíqiè zhǔnbèi jiùxù, wǒmen míngzǎo liù diǎn zhǔnshí kāichē chūfā.",
      french: "Tout est prêt, nous prendrons la route pour partir demain matin à six heures précises.",
      situation: "Départ matinal pour un trajet.",
      category: "transport"
    },
    {
      hanzi: "登山队员们在营地整装待发，向峰顶进发。",
      pinyin: "Dēngshān duìyuánmen zài yíngdì zhěngzhuāng dài fā, xiàng fēngdǐng jìnfā.",
      french: "Les alpinistes se sont équipés au camp de base, prêts à s’élancer vers le sommet.",
      situation: "Départ d’une ascension.",
      category: "social"
    },
  ],
  "到达": [
    {
      hanzi: "经过十一个小时的飞行，航班终于安全到达了巴黎。",
      pinyin: "Jīngguò shíyī gè xiǎoshí de fēixíng, hángbān zhōngyú ānquán dàodá le Bālí.",
      french: "Après onze heures de vol, l’avion a enfin atterri en toute sécurité à Paris.",
      situation: "Arrivée d’un vol long-courrier.",
      category: "transport"
    },
    {
      hanzi: "预计列车将在三十分钟后到达终点站。",
      pinyin: "Yùjì lièchē jiāng zài sānshí fēnzhōng hòu dàodá zhōngdiǎnzhàn.",
      french: "Le train devrait arriver au terminus d’ici trente minutes.",
      situation: "Annonce ferroviaire d’arrivée.",
      category: "transport"
    },
  ],
  "用": [
    {
      hanzi: "用手机扫一扫二维码，就可以立刻完成付款。",
      pinyin: "Yòng shǒujī sǎo yì sǎo èrwéimǎ, jiù kěyǐ lìkè wánchéng fùkuǎn.",
      french: "Il suffit de scanner le QR code avec son téléphone pour régler l’achat instantanément.",
      situation: "Paiement dématérialisé au quotidien.",
      category: "shopping"
    },
    {
      hanzi: "他喜欢用毛笔练习书法来修身养性。",
      pinyin: "Tā xǐhuan yòng máobǐ liànxí shūfǎ lái xiūshēn yǎngxìng.",
      french: "Il aime pratiquer la calligraphie au pinceau pour cultiver sa sérénité intérieure.",
      situation: "Pratique artistique et méditative.",
      category: "social"
    },
  ],
  "花": [
    {
      hanzi: "为了准备这场考试，他每天都花两个小时做专项练习。",
      pinyin: "Wèile zhǔnbèi zhè chǎng kǎoshì, tā měitiān dōu huā liǎng gè xiǎoshí zuò zhuānxiàng liànxí.",
      french: "Pour préparer cet examen, il consacre deux heures chaque jour à des exercices ciblés.",
      situation: "Investissement en temps d’étude.",
      category: "social"
    },
    {
      hanzi: "学会理性消费，不乱花不必要的钱，是一项重要品质。",
      pinyin: "Xuéhuì lǐxìng xiāofèi, bú luàn huā bú bìyào de qián, shì yí xiàng zhòngyào pǐnzhì.",
      french: "Savoir consommer avec discernement sans dépenser inutilement est une qualité essentielle.",
      situation: "Gestion budgétaire avisée.",
      category: "shopping"
    },
  ],
  "完": [
    {
      hanzi: "我终于把这本厚厚的汉语词典看完了！",
      pinyin: "Wǒ zhōngyú bǎ zhè běn hòuhòu de Hànyǔ cídiǎn kàn wán le!",
      french: "J’ai enfin fini de lire cet épais dictionnaire de chinois !",
      situation: "Accomplissement d’une lecture.",
      category: "social"
    },
    {
      hanzi: "等我把今天的工作处理完，就陪你一起出去散步。",
      pinyin: "Děng wǒ bǎ jīntiān de gōngzuò chǔlǐ wán, jiù péi nǐ yìqǐ chūqu sànbù.",
      french: "Dès que j’aurai terminé mon travail d’aujourd’hui, je t’accompagnerai faire une balade dehors.",
      situation: "Promesse après achèvement des tâches.",
      category: "social"
    },
  ],
  "开始": [
    {
      hanzi: "电影还有五分钟就要开始了，我们快进场检票吧。",
      pinyin: "Diànyǐng hái yǒu wǔ fēnzhōng jiù yào kāishǐ le, wǒmen kuài jìn chǎng jiǎnpiào ba.",
      french: "Le film commence dans cinq minutes, hâtons-nous d’entrer faire contrôler nos billets.",
      situation: "Entrée en salle de cinéma.",
      category: "social"
    },
    {
      hanzi: "千里之行，始于足下；学习任何技能都要从基础开始。",
      pinyin: "Qiān lǐ zhī xíng, shǐ yú zú xià; xuéxí rènhé jìnéng dōu yào cóng jīchǔ kāishǐ.",
      french: "Un voyage de mille lieues commence par un premier pas ; tout apprentissage débute par les bases.",
      situation: "Sagesse de Lao Tseu sur l’apprentissage.",
      category: "social"
    },
  ],
  "结束": [
    {
      hanzi: "长达两小时的越洋视频会议终于顺利结束了。",
      pinyin: "Cháng dá liǎng xiǎoshí de yuèyáng shìpín huìyì zhōngyú shùnlì jiéshù le.",
      french: "La visioconférence transatlantique de deux heures s’est enfin achevée avec succès.",
      situation: "Conclusion d’un grand meeting international.",
      category: "work"
    },
    {
      hanzi: "这学期的课程全部结束了，同学们迎来了期盼已久的暑假。",
      pinyin: "Zhè xuéqī de kèchéng quánbù jiéshù le, tóngxuémen yínglái le qīpàn yǐ jiǔ de shǔjià.",
      french: "Tous les cours du semestre sont terminés, les étudiants entament leurs vacances d’été tant attendues.",
      situation: "Clôture de l’année universitaire.",
      category: "social"
    },
  ],
  "继续": [
    {
      hanzi: "虽然遇到了意想不到的技术难关，但团队依然选择继续攻坚。",
      pinyin: "Suīrán yù dào le yìxiǎngbùdào de jìshù nánguān, dàn tuánduì yīrán xuǎnzé jìxù gōngjiān.",
      french: "Malgré les embûches techniques inattendues, l’équipe a choisi de poursuivre son effort avec détermination.",
      situation: "Volonté inébranlable au travail.",
      category: "work"
    },
    {
      hanzi: "休息十分钟喝口水，我们再继续后面的听力练习。",
      pinyin: "Xiūxi shí fēnzhōng hē kǒu shuǐ, wǒmen zài jìxù hòumiàn de tīnglì liànxí.",
      french: "Faisons une pause de dix minutes pour boire un peu d’eau, puis nous continuerons les exercices de compréhension orale.",
      situation: "Rythme de cours et pause.",
      category: "social"
    },
  ],
  "遇到": [
    {
      hanzi: "在异国他乡漫步时，我竟然遇到了多年未见的小学同桌！",
      pinyin: "Zài yìguó tāxiāng mànbù shí, wǒ jìngrán yù dào le duō nián wèi jiàn de xiǎoxué tóngzhuō!",
      french: "En flânant à l’étranger, je suis tombé par surprise sur mon voisin de classe de primaire perdu de vue depuis des années !",
      situation: "Coïncidence extraordinaire.",
      category: "social"
    },
    {
      hanzi: "在学习中文的过程中，遇到生词是再正常不过的事情了。",
      pinyin: "Zài xuéxí Zhōngwén de guòchéng zhōng, yù dào shēngcí shì zài zhèngcháng búguò de shìqing le.",
      french: "Dans l’apprentissage du chinois, croiser des mots inconnus est la chose la plus naturelle qui soit.",
      situation: "Dédramatiser les lacunes de vocabulaire.",
      category: "social"
    },
  ],
  "拒绝": [
    {
      hanzi: "他委婉地拒绝了对方的聚餐邀请，因为当晚有紧急工作要处理。",
      pinyin: "Tā wěiwǎn de jùjué le duìfāng de jùcān yāoqǐng, yīnwèi dāngwǎn yǒu jǐnjí gōngzuò yào chǔlǐ.",
      french: "Il a décliné poliment l’invitation à dîner, car il avait un travail urgent à finaliser ce soir-là.",
      situation: "Refuser poliment une invitation.",
      category: "social"
    },
    {
      hanzi: "面对不合理的要求，我们应该勇敢而礼貌地表达拒绝。",
      pinyin: "Miàn duì bù hélǐ de yāoqiú, wǒmen yīnggāi yǒnggǎn ér lǐmào de biǎodá jùjué.",
      french: "Face à une demande déraisonnable, il convient de savoir dire non avec fermeté et courtoisie.",
      situation: "Affirmation de soi respectueuse.",
      category: "work"
    },
  ],
  "同意": [
    {
      hanzi: "经过多轮沟通，双方终于在所有合作条款上达成了一致同意。",
      pinyin: "Jīngguò duō lún gōutōng, shuāngfāng zhōngyú zài suǒyǒu hézuò tiáokuǎn shang dáchéng le yízhì tóngyì.",
      french: "Après plusieurs tours d’échanges, les deux parties sont enfin tombées d’accord sur l’ensemble des clauses de partenariat.",
      situation: "Signature d’accord commercial.",
      category: "work"
    },
    {
      hanzi: "对于这个方案，大家都举手表决表示同意。",
      pinyin: "Duìyú zhè ge fāng’àn, dàjiā dōu jǔshǒu biǎojué biǎoshì tóngyì.",
      french: "Concernant cette proposition, tout le monde a voté à main levée pour signifier son accord.",
      situation: "Vote unanime en assemblée.",
      category: "work"
    },
  ],
  "提醒": [
    {
      hanzi: "非常感谢你的善意提醒，不然我差点就错过回程的高铁了！",
      pinyin: "Fēicháng gǎnxiè nǐ de shànyì tíxǐng, bùrán wǒ chàdiǎn jiù cuòguò huíchéng de gāotiě le!",
      french: "Merci infiniment pour ton précieux rappel, sans quoi j’aurais failli rater mon train de retour !",
      situation: "Reconnaissance pour un avertissement salvateur.",
      category: "transport"
    },
    {
      hanzi: "手机日历提前半小时弹出了提醒，通知我准备参加会议。",
      pinyin: "Shǒujī rìlì tíqián bàn xiǎoshí tán chū le tíxǐng, tōngzhī wǒ zhǔnbèi cānjiā huìyì.",
      french: "Le calendrier de mon téléphone a affiché un rappel 30 minutes avant pour me notifier de la réunion.",
      situation: "Notification automatique sur smartphone.",
      category: "work"
    },
  ],
  "解释": [
    {
      hanzi: "老师耐心地用生活中的例子为我们解释了这个复杂的成语。",
      pinyin: "Lǎoshī nàixīn de yòng shēnghuó zhōng de lìzi wèi wǒmen jiěshì le zhè ge fùzá de chéngyǔ.",
      french: "L’enseignant a patiemment illustré cet idiome complexe à l’aide d’exemples de la vie courante.",
      situation: "Explication pédagogique éclairante.",
      category: "social"
    },
    {
      hanzi: "请你给我一个合理的解释，为什么今天的交付延期了？",
      pinyin: "Qǐng nǐ gěi wǒ yí gè hélǐ de jiěshì, wèishénme jīntiān de jiāofù yánqī le?",
      french: "Donnez-moi une explication valable s’il vous plaît : pourquoi la livraison d’aujourd’hui est-elle retardée ?",
      situation: "Demander des comptes sur un retard.",
      category: "work"
    },
  ],
  "联系": [
    {
      hanzi: "这是我的名片和微信号，到了上海请随时联系我。",
      pinyin: "Zhè shì wǒ de míngpiàn hé Wēixìn hào, dào le Shànghǎi qǐng suíshí liánxì wǒ.",
      french: "Voici ma carte et mon identifiant WeChat, une fois arrivé à Shanghai n’hésite pas à me contacter.",
      situation: "Échange de coordonnées amical.",
      category: "social"
    },
    {
      hanzi: "即使大家身处不同的国家，也可以通过网络保持密切联系。",
      pinyin: "Jìshǐ dàjiā shēn chǔ bùtóng de guójiā, yě kěyǐ tōngguò wǎngluò bǎochí mìqiè liánxì.",
      french: "Même si nous vivons dans des pays différents, nous pouvons rester en contact étroit grâce à Internet.",
      situation: "Garder le contact à distance.",
      category: "social"
    },
  ],
  "打扰": [
    {
      hanzi: "不好意思打扰一下，请问去最近的地铁站怎么走？",
      pinyin: "Bù hǎoyìsi dǎrǎo yíxià, qǐngwèn qù zuì jìn de dìtiě zhàn zěnme zǒu?",
      french: "Pardonnez-moi de vous déranger, pourriez-vous m’indiquer la station de métro la plus proche ?",
      situation: "Demander son chemin poliment dans la rue.",
      category: "transport"
    },
    {
      hanzi: "看到大家都在全神贯注地工作，他便没有去打扰。",
      pinyin: "Kàn dào dàjiā dōu zài quánshénguànzhù de gōngzuò, tā biàn méiyǒu qù dǎrǎo.",
      french: "Voyant que tout le monde travaillait avec concentration, il s’est abstenu de déranger.",
      situation: "Discrétion et respect des collègues.",
      category: "work"
    },
  ],
  "抱歉": [
    {
      hanzi: "非常抱歉让您久等了，刚才系统出现了一点小故障。",
      pinyin: "Fēicháng bàoqiàn ràng nín jiǔ děng le, gāngcái xìtǒng chūxiàn le yìdiǎn xiǎo gùzhàng.",
      french: "Toutes mes excuses pour vous avoir fait attendre, le système a rencontré un petit dysfonctionnement.",
      situation: "Présenter ses excuses pour une attente.",
      category: "work"
    },
    {
      hanzi: "感到抱歉的同时，他也立刻主动提出了弥补损失的办法。",
      pinyin: "Gǎndào bàoqiàn de tóngshí, tā yě lìkè zhǔdòng tíchū le míbǔ sǔnshī de bànfǎ.",
      french: "Tout en exprimant ses regrets, il a immédiatement proposé une solution pour réparer le préjudice.",
      situation: "Attitude responsable après une erreur.",
      category: "social"
    },
  ],
  "原谅": [
    {
      hanzi: "请原谅我的粗心大意，我保证下次绝对不会再犯同样的错误。",
      pinyin: "Qǐng yuánliàng wǒ de cūxīn dàyì, wǒ bǎozhèng xià cì juéduì bú huì zài fàn tóngyàng de cuòwù.",
      french: "Pardonnez mon étourderie s’il vous plaît, je vous garantis que je ne referai plus la même faute.",
      situation: "Demander pardon humblement.",
      category: "reactions"
    },
    {
      hanzi: "真诚的沟通往往能赢得对方的原谅与理解。",
      pinyin: "Zhēnchéng de gōutōng wǎngwǎng néng yíngdé duìfāng de yuánliàng yǔ lǐjiě.",
      french: "Un dialogue sincère permet presque toujours d’obtenir le pardon et la compréhension de l’autre.",
      situation: "Pouvoir de la sincérité.",
      category: "social"
    },
  ],
  "感谢": [
    {
      hanzi: "非常感谢你在我最困难的时候伸出援手给予帮助。",
      pinyin: "Fēicháng gǎnxiè nǐ zài wǒ zuì kùnnan de shíhou shēn chū yuánshǒu jǐyǔ bāngzhù.",
      french: "Merci du fond du cœur de m’avoir tendu la main et soutenu au moment où j’en avais le plus besoin.",
      situation: "Gratitude profonde.",
      category: "social"
    },
    {
      hanzi: "主办方特意向所有志愿者表达了由衷的感谢。",
      pinyin: "Zhǔbànfāng tèyì xiàng suǒyǒu yuànzhě biǎodá le yóuzhōng de gǎnxiè.",
      french: "Les organisateurs ont adressé leurs remerciements les plus chaleureux à l’ensemble des bénévoles.",
      situation: "Remerciements officiels.",
      category: "social"
    },
  ],
  "成功": [
    {
      hanzi: "经过上百次的反复实验，团队终于成功研发出了新产品。",
      pinyin: "Jīngguò shàng bǎi cì de fǎnfù shíyàn, tuánduì zhōngyú chénggōng yánfā chū le xīn chǎnpǐn.",
      french: "Après plus d’une centaine d’essais successifs, l’équipe est enfin parvenue à mettre au point le nouveau produit.",
      situation: "Aboutissement d’une innovation.",
      category: "work"
    },
    {
      hanzi: "成功的秘诀在于日复一日的坚持与不断总结。",
      pinyin: "Chénggōng de mìjué zàiyú rì fù yí rì de jiānchí yǔ búduàn zǒngjié.",
      french: "Le secret de la réussite réside dans la persévérance quotidienne et la remise en question constante.",
      situation: "Conseil de réussite.",
      category: "social"
    },
  ],
  "失败": [
    {
      hanzi: "正如古人所说，“失败是成功之母”，从中吸取教训才是关键。",
      pinyin: "Zhèngrú gǔrén suǒ shuō, “shībài shì chénggōng zhī mǔ”, cóngzhōng xīqǔ jiàoxun cái shì guānjiàn.",
      french: "Comme disaient les anciens : « L’échec est la mère du succès », l’essentiel est d’en tirer les leçons.",
      situation: "Célèbre proverbe de résilience.",
      category: "social"
    },
    {
      hanzi: "这次测试虽然失败了，但为我们排除了好几个错误方向。",
      pinyin: "Zhè cì cèshì suīrán shībài le, dàn wèi wǒmen páichú le hǎo jǐ gè cuòwù fāngxiàng.",
      french: "Bien que ce test ait échoué, il nous a permis d’écarter plusieurs fausses pistes.",
      situation: "Regard constructif sur un échec.",
      category: "work"
    },
  ],
};
