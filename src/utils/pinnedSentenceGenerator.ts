import { AnkiWord } from '../types/fluent';
import { EverydayPhrase, EVERYDAY_PHRASES } from '../data/everydayPhrasesData';
import { BUILT_IN_STORIES } from '../data/storiesData';

export interface PinnedWordSentenceOption {
  id: string;
  wordHanzi: string;
  wordPinyin: string;
  wordTranslation: string;
  phrase: EverydayPhrase;
}

export interface WordExampleSentence {
  id: string;
  hanzi: string;
  pinyin: string;
  french: string;
  sourceType: 'curated' | 'story' | 'everyday' | 'pattern';
  sourceLabel?: string;
  situation?: string;
  tip?: string;
}

// 1. Dictionnaire étendu de phrases authentiques du quotidien pour le vocabulaire fréquent
const CURATED_SENTENCES_BY_KEYWORD: Record<string, { hanzi: string; pinyin: string; french: string; situation: string; tip?: string; category: EverydayPhrase['category'] }[]> = {
  '咖啡': [
    {
      hanzi: '服务员，请给我一杯热美式咖啡，不加糖。',
      pinyin: 'Fúwùyuán, qǐng gěi wǒ yì bēi rè Měishì kāfēi, bù jiā táng.',
      french: 'Serveur, s’il vous plaît donnez-moi un café americano chaud, sans sucre.',
      situation: 'Commander dans un café ou un salon de thé.',
      tip: '不加糖 (bù jiā táng) = sans sucre ajouté.',
      category: 'restaurant'
    },
    {
      hanzi: '我习惯每天早上喝一杯咖啡提神。',
      pinyin: 'Wǒ xíguàn měitiān zǎoshang hē yì bēi kāfēi tíshén.',
      french: 'J’ai l’habitude de boire une tasse de café chaque matin pour me réveiller.',
      situation: 'Partager sa routine quotidienne.',
      tip: '提神 (tíshén) = donner un coup de fouet / réveiller l’esprit.',
      category: 'social'
    }
  ],
  '水': [
    {
      hanzi: '可以帮我倒一杯温水吗？谢谢！',
      pinyin: 'Kěyǐ bāng wǒ dào yì bēi wēn shuǐ ma? Xièxie!',
      french: 'Pouvez-vous me verser un verre d’eau tiède s’il vous plaît ? Merci !',
      situation: 'Au restaurant ou chez un hôte.',
      tip: 'En Chine, l’eau tiède (温水 wēnshuǐ) est la boisson de prédilection.',
      category: 'restaurant'
    }
  ],
  '茶': [
    {
      hanzi: '你喜欢喝绿茶还是红茶？',
      pinyin: 'Nǐ xǐhuan hē lǜchá háishì hóngchá?',
      french: 'Tu préfères boire du thé vert ou du thé noir ?',
      situation: 'Inviter un ami ou un collègue.',
      tip: '红茶 (thé rouge en chinois) correspond au thé noir occidental.',
      category: 'social'
    }
  ],
  '牛肉': [
    {
      hanzi: '老板，来一碗牛肉面，面条要劲道一点。',
      pinyin: 'Lǎobǎn, lái yì wǎn niúròumiàn, miàntiáo yào jìndao yìdiǎn.',
      french: 'Patron, apportez un bol de nouilles au bœuf, avec des nouilles bien fermes.',
      situation: 'Dans un petit resto de quartier.',
      tip: '劲道 (jìndao) = avec de la mâche / al dente.',
      category: 'restaurant'
    }
  ],
  '买单': [
    {
      hanzi: '服务员，我们这桌买单，微信扫码。',
      pinyin: 'Fúwùyuán, wǒmen zhè zhuō mǎidān, Wēixìn sǎomǎ.',
      french: 'Serveur, l’addition pour notre table, je règle par WeChat.',
      situation: 'En fin de repas au restaurant.',
      tip: '买单 (mǎidān) est très naturel et dynamique.',
      category: 'shopping'
    }
  ],
  '结账': [
    {
      hanzi: '老板，结账！请问一共多少钱？',
      pinyin: 'Lǎobǎn, jiézhàng! Qǐngwèn yígòng duōshao qián?',
      french: 'Patron, l’addition ! Combien cela fait au total s’il vous plaît ?',
      situation: 'Dans une échoppe ou un restaurant.',
      category: 'shopping'
    }
  ],
  '便宜': [
    {
      hanzi: '老板，买两个可以算便宜一点吗？',
      pinyin: 'Lǎobǎn, mǎi liǎng gè kěyǐ suàn piányi yìdiǎn ma?',
      french: 'Patron, si j’en prends deux, pouvez-vous me faire un petit prix ?',
      situation: 'Négocier gentiment sur un marché.',
      tip: '算便宜一点 (suàn piányi yìdiǎn) = faire un geste commercial.',
      category: 'shopping'
    }
  ],
  '贵': [
    {
      hanzi: '这个质量很好，虽然有点贵但很值。',
      pinyin: 'Zhè ge zhìliàng hěn hǎo, suīrán yǒudiǎn guì dàn hěn zhí.',
      french: 'La qualité est très bonne, bien qu’un peu chère, ça en vaut la peine.',
      situation: 'Donner son avis sur un achat.',
      category: 'shopping'
    }
  ],
  '地铁': [
    {
      hanzi: '请问去外滩坐地铁哪条线最快？',
      pinyin: 'Qǐngwèn qù Wàitān zuò dìtiě nǎ tiáo xiàn zuì kuài?',
      french: 'Pour aller au Bund, quelle ligne de métro est la plus rapide s’il vous plaît ?',
      situation: 'Demander son chemin dans le métro.',
      category: 'transport'
    }
  ],
  '出租车': [
    {
      hanzi: '师傅，我去高铁站，大概需要多长时间？',
      pinyin: 'Shīfu, wǒ qù gāotiě zhàn, dàgài xūyào duō cháng shíjiān?',
      french: 'Chauffeur, je vais à la gare TGV, combien de temps ça prendra environ ?',
      situation: 'En montant dans un taxi.',
      tip: '师傅 (shīfu) est la manière la plus polie d’appeler un chauffeur.',
      category: 'transport'
    }
  ],
  '机场': [
    {
      hanzi: '师傅，请开快一点，我赶着去机场登机。',
      pinyin: 'Shīfu, qǐng kāi kuài yìdiǎn, wǒ gǎnzhe qù jīchǎng dēngjī.',
      french: 'Chauffeur, accélérez un peu s’il vous plaît, je dois embarquer à l’aéroport.',
      situation: 'Course pressée en taxi vers l’aéroport.',
      category: 'transport'
    }
  ],
  '酒店': [
    {
      hanzi: '你好，我有预订，想办理入住手续。',
      pinyin: 'Nǐ hǎo, wǒ yǒu yùdìng, xiǎng bànlǐ rùzhù shǒuxù.',
      french: 'Bonjour, j’ai une réservation, je souhaite m’enregistrer.',
      situation: 'À la réception d’un hôtel.',
      category: 'housing'
    }
  ],
  '朋友': [
    {
      hanzi: '这周末我有几个朋友要来家里聚会。',
      pinyin: 'Zhè zhōumò wǒ yǒu jǐ gè péngyou yào lái jiālǐ jùhuì.',
      french: 'Ce week-end, quelques amis viennent à la maison pour se retrouver.',
      situation: 'Parler de ses plans avec ses amis.',
      category: 'social'
    }
  ],
  '工作': [
    {
      hanzi: '我最近工作有点忙，下班后再联系你。',
      pinyin: 'Wǒ zuìjìn gōngzuò yǒudiǎn máng, xiàbān hòu zài liánxì nǐ.',
      french: 'Je suis un peu débordé par le travail ces temps-ci, je te recontacte après le travail.',
      situation: 'Envoyer un message à un proche ou un collègue.',
      category: 'work'
    }
  ],
  '努力': [
    {
      hanzi: '只要每天努力练习，中文一定会越来越流利。',
      pinyin: 'Zhǐyào měitiān nǔlì liànxí, Zhōngwén yídìng huì yuèláiyuè liúlì.',
      french: 'Tant qu’on s’exerce avec assiduité chaque jour, notre chinois deviendra de plus en plus fluide.',
      situation: 'Encouragement et motivation personnelle.',
      category: 'social'
    }
  ],
  '学习': [
    {
      hanzi: '我觉得用讲故事的方式学习中文效果最好。',
      pinyin: 'Wǒ juéde yòng jiǎng gùshi de fāngshì xuéxí Zhōngwén xiàoguǒ zuì hǎo.',
      french: 'Je trouve qu’apprendre le chinois à travers des histoires est la méthode la plus efficace.',
      situation: 'Partager sa méthode d’apprentissage.',
      category: 'social'
    }
  ],
  '时间': [
    {
      hanzi: '明天下午你有没有时间？我们一起喝杯咖啡吧。',
      pinyin: 'Míngtiān xiàwǔ nǐ yǒu méiyǒu shíjiān? Wǒmen yìqǐ hē bēi kāfēi ba.',
      french: 'As-tu du temps demain après-midi ? Prenons un café ensemble.',
      situation: 'Proposer un rendez-vous amical.',
      category: 'social'
    }
  ],
  '医生': [
    {
      hanzi: '我感觉头有点疼，想去看一下医生。',
      pinyin: 'Wǒ gǎnjué tóu yǒudiǎn téng, xiǎng qù kàn yíxià yīshēng.',
      french: 'J’ai mal à la tête, je souhaite consulter un médecin.',
      situation: 'Exprimer un problème de santé.',
      category: 'health'
    }
  ],
  '头疼': [
    {
      hanzi: '医生，我从昨天开始有点头疼和发烧。',
      pinyin: 'Yīshēng, wǒ cóng zuótiān kāishǐ yǒudiǎn tóuténg hé fāshāo.',
      french: 'Docteur, depuis hier j’ai un peu mal à la tête et de la fièvre.',
      situation: 'Expliquer ses symptômes en consultation.',
      category: 'health'
    }
  ],
  '手机': [
    {
      hanzi: '我的手机快没电了，请问这里有充电宝吗？',
      pinyin: 'Wǒ de shǒujī kuài méidiàn le, qǐngwèn zhèlǐ yǒu chōngdiànbǎo ma?',
      french: 'Mon téléphone n’a presque plus de batterie, avez-vous une batterie partagée ici ?',
      situation: 'Dans un café ou restaurant en Chine.',
      tip: '充电宝 (chōngdiànbǎo) = batterie externe à louer en libre service.',
      category: 'reactions'
    }
  ],
  '密码': [
    {
      hanzi: '服务员，请问店里的无线网密码是多少？',
      pinyin: 'Fúwùyuán, qǐngwèn diàn lǐ de wúxiànwǎng mìmǎ shì duōshao?',
      french: 'Serveur, quel est le mot de passe du wifi s’il vous plaît ?',
      situation: 'Se connecter au wifi dans un commerce.',
      category: 'reactions'
    }
  ],
  '辣': [
    {
      hanzi: '我不太能吃辣，请帮我做微辣或者不辣。',
      pinyin: 'Wǒ bú tài néng chī là, qǐng bāng wǒ zuò wēilà huòzhě bùlà.',
      french: 'Je ne supporte pas très bien le piment, pouvez-vous faire très peu épicé ou sans piment ?',
      situation: 'Préciser ses restrictions culinaires.',
      tip: '微辣 (wēilà) = piment très léger.',
      category: 'restaurant'
    }
  ],
  '喜欢': [
    {
      hanzi: '我很喜欢这座城市的氛围，生活很方便。',
      pinyin: 'Wǒ hěn xǐhuan zhè zuò chéngshì de fēnwéi, shēnghuó hěn fāngbiàn.',
      french: 'J’aime beaucoup l’atmosphère de cette ville, la vie y est très pratique.',
      situation: 'Exprimer ses impressions de voyage ou de vie.',
      category: 'social'
    }
  ],
  '明白': [
    {
      hanzi: '我大概明白了，你能再说慢一点吗？',
      pinyin: 'Wǒ dàgài míngbai le, nǐ néng zài shuō màn yìdiǎn ma?',
      french: 'J’ai compris dans les grandes lignes, peux-tu répéter un peu plus lentement ?',
      situation: 'En pleine conversation avec un locuteur natif.',
      category: 'social'
    }
  ],
  '觉得': [
    {
      hanzi: '我觉得这个提议挺好的，大家都赞同。',
      pinyin: 'Wǒ juéde zhè ge tíyì tǐng hǎo de, dàjiā dōu zàntóng.',
      french: 'Je trouve que cette proposition est très bonne, tout le monde est d’accord.',
      situation: 'Donner son avis en réunion ou entre amis.',
      category: 'work'
    }
  ],
  '意思': [
    {
      hanzi: '这句话很有意思，是什么意思呢？',
      pinyin: 'Zhè jù huà hěn yǒu yìsi, shì shénme yìsi ne?',
      french: 'Cette expression est très intéressante, que veut-elle dire au juste ?',
      situation: 'Poser une question sur une tournure idiomatique.',
      category: 'reactions'
    }
  ],
  '天气': [
    {
      hanzi: '今天天气真舒服，不冷也不热。',
      pinyin: 'Jīntiān tiānqì zhēn shūfu, bù lěng yě bú rè.',
      french: 'Le temps est vraiment agréable aujourd’hui, ni trop froid ni trop chaud.',
      situation: 'Entamer une petite conversation de politesse.',
      category: 'social'
    }
  ],
  '回家': [
    {
      hanzi: '今天太累了，我想早点回家好好休息。',
      pinyin: 'Jīntiān tài lèi le, wǒ xiǎng zǎo diǎn huíjiā hǎohǎo xiūxi.',
      french: 'Je suis épuisé aujourd’hui, je veux rentrer tôt à la maison pour bien me reposer.',
      situation: 'Exprimer la fatigue après une longue journée.',
      category: 'reactions'
    }
  ],
  '散步': [
    {
      hanzi: '晚饭后我们一起去公园散散步吧。',
      pinyin: 'Wǎnfàn hòu wǒmen yìqǐ qù gōngyuán sànsan bù ba.',
      french: 'Après le dîner, allons faire une petite promenade dans le parc.',
      situation: 'Proposer une activité détente en fin de journée.',
      category: 'social'
    }
  ],
  '坐着': [
    {
      hanzi: '他正坐着看书，看起来非常放松。',
      pinyin: 'Tā zhèng zuò zhe kàn shū, kàn qǐlai fēicháng fàngsōng.',
      french: 'Il est assis en train de lire un livre, l’air très détendu.',
      situation: 'Décrire une posture ou une action en cours.',
      category: 'social'
    },
    {
      hanzi: '我们在咖啡馆坐着聊了很久，度过了一个愉快的下午。',
      pinyin: 'Wǒmen zài kāfēiguǎn zuò zhe liáo le hěn jiǔ, dùguò le yí gè yúkuài de xiàwǔ.',
      french: 'Nous sommes restés assis au café à discuter pendant longtemps, passant un après-midi très agréable.',
      situation: 'Partager un moment de détente entre amis.',
      category: 'social'
    }
  ],
  '坐': [
    {
      hanzi: '请坐，喝杯热茶吧！',
      pinyin: 'Qǐng zuò, hē bēi rè chá ba!',
      french: 'Asseyez-vous s’il vous plaît, buvez une tasse de thé chaud !',
      situation: 'Accueillir chaleureusement quelqu’un.',
      category: 'social'
    },
    {
      hanzi: '我们可以坐地铁去，这样既方便又快捷。',
      pinyin: 'Wǒmen kěyǐ zuò dìtiě qù, zhèyàng jì fāngbiàn yòu kuàijié.',
      french: 'On peut y aller en métro, c’est à la fois pratique et rapide.',
      situation: 'Choisir son mode de transport.',
      category: 'transport'
    }
  ],
  '站着': [
    {
      hanzi: '地铁里人很多，没有空座位，我们只能站着。',
      pinyin: 'Dìtiě lǐ rén hěn duō, méiyǒu kōng zuòwèi, wǒmen zhǐ néng zhàn zhe.',
      french: 'Il y a beaucoup de monde dans le métro et aucune place assise, nous devons rester debout.',
      situation: 'Transports en commun bondés.',
      category: 'transport'
    }
  ],
  '拿着': [
    {
      hanzi: '他手里拿着一杯热咖啡，微笑着走过来。',
      pinyin: 'Tā shǒu lǐ ná zhe yì bēi rè kāfēi, wēixiào zhe zǒu guòlái.',
      french: 'Il s’approche avec le sourire, tenant une tasse de café chaud à la main.',
      situation: 'Décrire une personne en mouvement.',
      category: 'social'
    }
  ],
  '穿着': [
    {
      hanzi: '他今天穿着一件干净的白衬衫，看起来很精神。',
      pinyin: 'Tā jīntiān chuān zhe yí jiàn gānjìng de bái chènshān, kàn qǐlai hěn jīngshen.',
      french: 'Il porte aujourd’hui une chemise blanche propre, il a l’air très élégant.',
      situation: 'Faire une remarque sur la tenue vestimentaire.',
      category: 'social'
    }
  ],
  '穿': [
    {
      hanzi: '今天外面挺冷的，出门记得多穿点衣服。',
      pinyin: 'Jīntiān wàimiàn tǐng lěng de, chūmén jìde duō chuān diǎn yīfu.',
      french: 'Il fait plutôt froid dehors aujourd’hui, pense à bien te couvrir en sortant.',
      situation: 'Conseil bienveillant selon la météo.',
      category: 'social'
    }
  ],
  '看着': [
    {
      hanzi: '他微笑着看着大家，眼神非常温和。',
      pinyin: 'Tā wēixiào zhe kàn zhe dàjiā, yǎnshén fēicháng wēnhé.',
      french: 'Il regarde tout le monde en souriant, le regard très doux.',
      situation: 'Observer avec bienveillance.',
      category: 'social'
    }
  ],
  '看': [
    {
      hanzi: '周末你打算看什么好看的电影？',
      pinyin: 'Zhōumò nǐ dǎsuàn kàn shénme hǎokàn de diànyǐng?',
      french: 'Quel bon film prévois-tu de regarder ce week-end ?',
      situation: 'Parler de ses loisirs.',
      category: 'social'
    }
  ],
  '听着': [
    {
      hanzi: '他一边听着轻音乐，一边专心写代码。',
      pinyin: 'Tā yìbiān tīng zhe qīng yīnyuè, yìbiān zhuānxīn xiě dàimǎ.',
      french: 'Il programme avec concentration tout en écoutant de la musique douce.',
      situation: 'Routine de travail détendue.',
      category: 'work'
    }
  ],
  '听': [
    {
      hanzi: '请大家安静，听老师讲下一段。',
      pinyin: 'Qǐng dàjiā ānjìng, tīng lǎoshī jiǎng xià yí duàn.',
      french: 'S’il vous plaît faites silence, écoutez le professeur pour la suite.',
      situation: 'Écouter attentivement.',
      category: 'work'
    }
  ],
  '走着': [
    {
      hanzi: '我们一边走着，一边欣赏老街的美景。',
      pinyin: 'Wǒmen yìbiān zǒu zhe, yìbiān xīnshǎng lǎojiē de měijǐng.',
      french: 'Nous marchons tout en admirant la beauté de la vieille rue.',
      situation: 'Promenade touristique détendue.',
      category: 'social'
    }
  ],
  '走': [
    {
      hanzi: '时间不早了，我们走吧，免得赶不上地铁。',
      pinyin: 'Shíjiān bù zǎo le, wǒmen zǒu ba, miǎnde gǎn bù shàng dìtiě.',
      french: 'Il se fait tard, on y va pour ne pas rater le métro.',
      situation: 'Prendre congé pour partir.',
      category: 'reactions'
    }
  ],
  '熟悉': [
    {
      hanzi: '这条老街我很熟悉，周围有很多地道的小吃。',
      pinyin: 'Zhè tiáo lǎojiē wǒ hěn shúxī, zhōuwéi yǒu hěn duō dìdao de xiǎochī.',
      french: 'Je connais très bien cette vieille rue, il y a plein de snacks authentiques autour.',
      situation: 'Partager sa connaissance d’un quartier.',
      category: 'social'
    },
    {
      hanzi: '他的笑声听起来非常熟悉，就像老朋友一样。',
      pinyin: 'Tā de xiàoshēng tīng qǐlai fēicháng shúxī, jiù xiàng lǎo péngyou yíyàng.',
      french: 'Son rire semble extrêmement familier, tout comme celui d’un vieil ami.',
      situation: 'Reconnaître une intonation familière.',
      category: 'social'
    }
  ],
  '偶尔': [
    {
      hanzi: '我平时工作很忙，但偶尔也会去老茶馆坐一坐。',
      pinyin: 'Wǒ píngshí gōngzuò hěn máng, dàn ǒu’ěr yě huì qù lǎo cháguǎn zuò yí zuò.',
      french: 'D’habitude je suis très occupé, mais il m’arrive parfois d’aller m’asseoir dans une vieille maison de thé.',
      situation: 'Évoquer une habitude occasionnelle.',
      category: 'social'
    }
  ],
  '竟然': [
    {
      hanzi: '真没想到，他竟然能说一口这么地道的普通话！',
      pinyin: 'Zhēn méi xiǎng dào, tā jìngrán néng shuō yì kǒu zhème dìdao de pǔtōnghuà!',
      french: 'Quelle surprise, il est capable de parler un mandarin aussi authentique !',
      situation: 'Exprimer un étonnement positif.',
      category: 'reactions'
    }
  ],
  '解决': [
    {
      hanzi: '别担心，大家一起商量，一定能找到办法解决。',
      pinyin: 'Bié dānxīn, dàjiā yìqǐ shāngliang, yídìng néng zhǎodào bànfǎ jiějué.',
      french: 'Ne t’inquiète pas, en en discutant ensemble, nous trouverons certainement une solution.',
      situation: 'Résoudre un problème en équipe.',
      category: 'work'
    }
  ],
  '茶馆': [
    {
      hanzi: '老茶馆里总是热热闹闹的，坐满了喝茶聊天的人。',
      pinyin: 'Lǎo cháguǎn lǐ zǒngshì rèrenàonào de, zuò mǎn le hē chá liáotiān de rén.',
      french: 'La vieille maison de thé est toujours très animée, remplie de gens qui boivent du thé et discutent.',
      situation: 'Atmosphère traditionnelle chinoise.',
      category: 'social'
    }
  ],
  '衬衫': [
    {
      hanzi: '这件白衬衫的面料特别透气，穿起来很舒服。',
      pinyin: 'Zhè jiàn bái chènshān de miànliào tèbié tòuqì, chuān qǐlai hěn shūfu.',
      french: 'Le tissu de cette chemise blanche est très respirant, très agréable à porter.',
      situation: 'Apprécier le confort d’un vêtement.',
      category: 'shopping'
    }
  ],
  '笑声': [
    {
      hanzi: '院子里传来了老朋友们欢快的笑声。',
      pinyin: 'Yuànzi lǐ chuán lái le lǎo péngyoumen huānkuài de xiàoshēng.',
      french: 'Des rires joyeux de vieux amis résonnent depuis la cour.',
      situation: 'Atmosphère chaleureuse.',
      category: 'social'
    }
  ],
  '声音': [
    {
      hanzi: '周围有点吵，请你稍微大点声音说话。',
      pinyin: 'Zhōuwéi yǒudiǎn chǎo, qǐng nǐ shāowēi dà diǎn shēngyīn shuōhuà.',
      french: 'C’est un peu bruyant autour, pouvez-vous parler d’une voix un peu plus forte s’il vous plaît ?',
      situation: 'Demander de parler plus fort.',
      category: 'reactions'
    }
  ],
  '旁边': [
    {
      hanzi: '地铁口就在便利店旁边，走两步就到了。',
      pinyin: 'Dìtiě kǒu jiù zài biànlìdiàn pángbiān, zǒu liǎng bù jiù dào le.',
      french: 'La sortie de métro est juste à côté de la supérette, c’est à deux pas.',
      situation: 'Donner des indications précises.',
      category: 'transport'
    }
  ],
  '老爷爷': [
    {
      hanzi: '那位老爷爷每天早晨都在公园里散步打太极。',
      pinyin: 'Nà wèi lǎo yéye měitiān zǎochén dōu zài gōngyuán lǐ sànbù dǎ tàijí.',
      french: 'Ce grand-père se promène et pratique le tai-chi tous les matins dans le parc.',
      situation: 'Décrire les habitudes d’une personne âgée.',
      category: 'social'
    }
  ],
  '准备': [
    {
      hanzi: '大家都准备好了吗？我们要出发去机场了。',
      pinyin: 'Dàjiā dōu zhǔnbèi hǎo le ma? Wǒmen yào chūfā qù jīchǎng le.',
      french: 'Est-ce que tout le monde est prêt ? Nous allons partir pour l’aéroport.',
      situation: 'Vérifier la préparation avant le départ.',
      category: 'transport'
    }
  ],
  '舒服': [
    {
      hanzi: '这把椅子坐着特别舒服，一点也不觉得累。',
      pinyin: 'Zhè bǎ yǐzi zuò zhe tèbié shūfu, yìdiǎn yě bù juéde lèi.',
      french: 'Cette chaise est particulièrement confortable pour s’asseoir, on ne se fatigue pas du tout.',
      situation: 'Exprimer le confort d’une assise.',
      category: 'housing'
    }
  ],
  '累': [
    {
      hanzi: '今天走了一整天的路，感觉有点累，想早点睡。',
      pinyin: 'Jīntiān zǒu le yì zhěng tiān de lù, gǎnjué yǒudiǎn lèi, xiǎng zǎo diǎn shuì.',
      french: 'J’ai marché toute la journée, je me sens un peu fatigué et souhaite dormir tôt.',
      situation: 'Exprimer sa fatigue le soir.',
      category: 'reactions'
    }
  ],
  '帮': [
    {
      hanzi: '你能帮我拿一下这杯咖啡吗？谢谢！',
      pinyin: 'Nǐ néng bāng wǒ ná yíxià zhè bēi kāfēi ma? Xièxie!',
      french: 'Peux-tu m’aider en tenant cette tasse de café s’il te plaît ? Merci !',
      situation: 'Demander un petit coup de main.',
      category: 'social'
    }
  ],
  '等': [
    {
      hanzi: '请在门口稍等一下，我拿好包马上出来。',
      pinyin: 'Qǐng zài ménkǒu shāoděng yíxià, wǒ ná hǎo bāo mǎshàng chūlái.',
      french: 'Patiente un instant à la porte s’il te plaît, je prends mon sac et je sors tout de suite.',
      situation: 'Faire patienter quelques instants.',
      category: 'social'
    }
  ],
  '认识': [
    {
      hanzi: '很高兴认识你！希望我们在中国能经常联系。',
      pinyin: 'Hěn gāoxìng rènshi nǐ! Xīwàng wǒmen zài Zhōngguó néng jīngcháng liánxì.',
      french: 'Très heureux de faire ta connaissance ! Au plaisir d’échanger régulièrement en Chine.',
      situation: 'Nouer une nouvelle amitié.',
      category: 'social'
    }
  ]
};

// 2. Modèles de patrons syntaxiques naturels pour tout mot personnalisé
const FALLBACK_TEMPLATES = [
  {
    makeHanzi: (word: string) => `在日常生活中，我经常用到“${word}”这个表达。`,
    makePinyin: (wordPinyin: string) => `Zài rìcháng shēnghuó zhōng, wǒ jīngcháng yòng dào "${wordPinyin}" zhè ge biǎodá.`,
    makeFrench: (wordTrans: string) => `Dans la vie quotidienne, j’utilise souvent l’expression liée à « ${wordTrans} ».`,
    situation: 'Mise en contexte conversationnelle active',
    category: 'social' as const,
  },
  {
    makeHanzi: (word: string) => `请问在这种情况，我可以说“${word}”吗？`,
    makePinyin: (wordPinyin: string) => `Qǐngwèn zài zhè zhǒng qíngkuàng, wǒ kěyǐ shuō "${wordPinyin}" ma?`,
    makeFrench: (wordTrans: string) => `Dans cette situation, puis-je employer « ${wordTrans} » s’il vous plaît ?`,
    situation: 'Valider l’usage naturel avec un interlocuteur',
    category: 'reactions' as const,
  },
  {
    makeHanzi: (word: string) => `关于“${word}”，你能给我举一个更地道的例子吗？`,
    makePinyin: (wordPinyin: string) => `Guānyú "${wordPinyin}", nǐ néng gěi wǒ jǔ yí gè gèng dìdao de lìzi ma?`,
    makeFrench: (wordTrans: string) => `À propos de « ${wordTrans} », peux-tu me donner un exemple encore plus authentique ?`,
    situation: 'Pratique interactive d’approfondissement',
    category: 'work' as const,
  }
];

/**
 * Génère une liste de phrases pratiques du quotidien pour un mot épinglé donné.
 * Priorise les phrases authentiques enregistrées ou construites spécialement.
 */
export const generateSentencesForWord = (word: AnkiWord): EverydayPhrase[] => {
  const cleanHanzi = word.hanzi.trim();
  const cleanPinyin = (word.pinyin || '').trim();
  const cleanTranslation = (word.translation || cleanHanzi).trim();
  const results: EverydayPhrase[] = [];

  // A. Si le mot avait déjà une phrase d'exemple personnalisée enregistrée
  if (word.exampleSentence && word.exampleSentence.trim().length > 0) {
    results.push({
      id: `gen-${word.id}-custom-example`,
      category: 'social',
      categoryLabel: 'Exemple Enregistré',
      categoryIcon: '⭐',
      hanzi: word.exampleSentence.trim(),
      pinyin: (word.examplePinyin || '').trim() || cleanPinyin,
      french: (word.exampleTranslation || '').trim() || `Phrase d'usage avec ${cleanHanzi}`,
      situation: `Exemple direct lié à « ${cleanHanzi} »`,
      tip: `Mot cible : ${cleanHanzi} (${cleanPinyin})`,
      difficulty: 'Indispensable',
    });
  }

  // B. Chercher une correspondance exacte ou partielle dans les phrases authentiques
  let matchedEntries: { hanzi: string; pinyin: string; french: string; situation: string; tip?: string; category: EverydayPhrase['category'] }[] = [];

  if (CURATED_SENTENCES_BY_KEYWORD[cleanHanzi]) {
    matchedEntries = CURATED_SENTENCES_BY_KEYWORD[cleanHanzi];
  } else {
    // Recherche par inclusion (ex: si le mot est "喝咖啡" ou "一杯咖啡")
    for (const [key, entries] of Object.entries(CURATED_SENTENCES_BY_KEYWORD)) {
      if (cleanHanzi.includes(key) || key.includes(cleanHanzi)) {
        matchedEntries = entries;
        break;
      }
    }
  }

  matchedEntries.forEach((entry, idx) => {
    results.push({
      id: `gen-${word.id}-curated-${idx}`,
      category: entry.category,
      categoryLabel: entry.category === 'restaurant' ? 'Restaurant & Café' : entry.category === 'transport' ? 'Transports' : entry.category === 'shopping' ? 'Achats' : entry.category === 'work' ? 'Travail' : entry.category === 'health' ? 'Santé' : 'Vie Quotidienne',
      categoryIcon: entry.category === 'restaurant' ? '🍜' : entry.category === 'transport' ? '🚕' : entry.category === 'shopping' ? '🛍️' : entry.category === 'work' ? '💼' : entry.category === 'health' ? '🏥' : '💬',
      hanzi: entry.hanzi,
      pinyin: entry.pinyin,
      french: entry.french,
      situation: entry.situation,
      tip: entry.tip || `Contient ton mot épinglé : ${cleanHanzi}`,
      difficulty: 'Courant',
    });
  });

  // C. Si aucune phrase authentique trouvée ou s'il en faut au moins 2, appliquer les patrons contextuels intelligents
  if (results.length < 2) {
    FALLBACK_TEMPLATES.forEach((tmpl, idx) => {
      if (results.length >= 3) return;
      results.push({
        id: `gen-${word.id}-tmpl-${idx}`,
        category: tmpl.category,
        categoryLabel: 'Mise en Pratique',
        categoryIcon: '💡',
        hanzi: tmpl.makeHanzi(cleanHanzi),
        pinyin: tmpl.makePinyin(cleanPinyin || cleanHanzi),
        french: tmpl.makeFrench(cleanTranslation),
        situation: tmpl.situation,
        tip: `Intègre « ${cleanHanzi} » dans une phrase complète et fluide.`,
        difficulty: 'Courant',
      });
    });
  }

  return results;
};

/**
 * Génère toutes les options de phrases pour une collection entière de mots épinglés.
 */
export const generateSentencesForAllPinnedWords = (words: AnkiWord[]): PinnedWordSentenceOption[] => {
  const all: PinnedWordSentenceOption[] = [];

  words.forEach(word => {
    const phrases = generateSentencesForWord(word);
    phrases.forEach(phrase => {
      all.push({
        id: phrase.id,
        wordHanzi: word.hanzi,
        wordPinyin: word.pinyin || '',
        wordTranslation: word.translation || '',
        phrase
      });
    });
  });

  return all;
};

/**
 * Recherche et génère des phrases d'exemple authentiques contenant un mot spécifique.
 * Idéal pour afficher sur le bandeau de définition dans les histoires ou les listes.
 */
export const getWordExampleSentences = (
  word: { hanzi: string; pinyin?: string; translation?: string },
  currentSentenceHanzi?: string
): WordExampleSentence[] => {
  const cleanHanzi = word.hanzi.trim();
  const cleanPinyin = (word.pinyin || '').trim();
  const cleanTranslation = (word.translation || cleanHanzi).trim();
  const results: WordExampleSentence[] = [];
  const seenHanzi = new Set<string>();

  if (!cleanHanzi) return [];

  // Exclure la phrase actuelle si fournie pour ne pas répéter ce que l'utilisateur lit déjà
  if (currentSentenceHanzi) {
    seenHanzi.add(currentSentenceHanzi.trim());
  }

  // 1. Chercher dans CURATED_SENTENCES_BY_KEYWORD
  // 1.A. Correspondance exacte
  if (CURATED_SENTENCES_BY_KEYWORD[cleanHanzi]) {
    for (const item of CURATED_SENTENCES_BY_KEYWORD[cleanHanzi]) {
      if (!seenHanzi.has(item.hanzi)) {
        seenHanzi.add(item.hanzi);
        results.push({
          id: `ex-curated-${cleanHanzi}-${results.length}`,
          hanzi: item.hanzi,
          pinyin: item.pinyin,
          french: item.french,
          situation: item.situation,
          tip: item.tip,
          sourceType: 'curated',
          sourceLabel: 'Usage courant',
        });
      }
    }
  }

  // 1.B. Correspondance partielle ou racine dans les curated (ex: si le mot est "坐着" ou "喝咖啡")
  if (results.length < 2) {
    for (const [key, entries] of Object.entries(CURATED_SENTENCES_BY_KEYWORD)) {
      if (key !== cleanHanzi && (cleanHanzi.includes(key) || (key.length >= 2 && key.includes(cleanHanzi)))) {
        for (const item of entries) {
          if (item.hanzi.includes(cleanHanzi) && !seenHanzi.has(item.hanzi)) {
            seenHanzi.add(item.hanzi);
            results.push({
              id: `ex-curated-sub-${cleanHanzi}-${results.length}`,
              hanzi: item.hanzi,
              pinyin: item.pinyin,
              french: item.french,
              situation: item.situation,
              tip: item.tip,
              sourceType: 'curated',
              sourceLabel: 'Usage courant',
            });
            if (results.length >= 3) break;
          }
        }
      }
      if (results.length >= 3) break;
    }
  }

  // 2. Chercher dans toutes les histoires (BUILT_IN_STORIES)
  if (results.length < 3) {
    for (const story of BUILT_IN_STORIES) {
      for (const p of story.paragraphs) {
        for (const s of p.sentences) {
          if (s.hanzi.includes(cleanHanzi) && !seenHanzi.has(s.hanzi)) {
            seenHanzi.add(s.hanzi);
            results.push({
              id: `ex-story-${story.id}-${results.length}`,
              hanzi: s.hanzi,
              pinyin: s.pinyin,
              french: s.translation,
              situation: `Extrait de l'histoire : ${story.title}`,
              sourceType: 'story',
              sourceLabel: `Histoire : ${story.title}`,
            });
            if (results.length >= 3) break;
          }
        }
        if (results.length >= 3) break;
      }
      if (results.length >= 3) break;
    }
  }

  // 3. Chercher dans les phrases du quotidien (EVERYDAY_PHRASES)
  if (results.length < 3) {
    for (const phrase of EVERYDAY_PHRASES) {
      if (phrase.hanzi.includes(cleanHanzi) && !seenHanzi.has(phrase.hanzi)) {
        seenHanzi.add(phrase.hanzi);
        results.push({
          id: `ex-everyday-${phrase.id}`,
          hanzi: phrase.hanzi,
          pinyin: phrase.pinyin,
          french: phrase.french,
          situation: phrase.situation,
          tip: phrase.tip,
          sourceType: 'everyday',
          sourceLabel: phrase.categoryLabel,
        });
        if (results.length >= 3) break;
      }
    }
  }

  // 4. Si moins de 2 exemples trouvés, générer des patrons contextuels fluides et adaptés
  if (results.length < 2) {
    // Si c'est un verbe d'état avec 着 (ex: 坐着, 站着, 拿着, 走着, 看着, 听着, 穿着)
    if (cleanHanzi.endsWith('着')) {
      const aspectPhrase1 = {
        hanzi: `他正${cleanHanzi}看窗外，像是在思考什么。`,
        pinyin: `Tā zhèng ${cleanPinyin || cleanHanzi} kàn chuāngwài, xiàng shì zài sīkǎo shénme.`,
        french: `Il est en train de regarder par la fenêtre tout en étant ${cleanTranslation}, comme s’il réfléchissait.`,
        situation: `Action continue ou posture (${cleanHanzi})`,
      };
      if (!seenHanzi.has(aspectPhrase1.hanzi)) {
        seenHanzi.add(aspectPhrase1.hanzi);
        results.push({
          id: `ex-aspect-1-${cleanHanzi}`,
          hanzi: aspectPhrase1.hanzi,
          pinyin: aspectPhrase1.pinyin,
          french: aspectPhrase1.french,
          situation: aspectPhrase1.situation,
          sourceType: 'pattern',
          sourceLabel: 'Exemple naturel',
        });
      }
    }

    // Patrons contextuels de haute qualité
    const naturalTemplates = [
      {
        makeHanzi: (w: string) => `在日常交流中，你可以用“${w}”来表达相应的意思。`,
        makePinyin: (p: string) => `Zài rìcháng jiāoliú zhōng, nǐ kěyǐ yòng "${p}" lái biǎodá xiāngyìng de yìsi.`,
        makeFrench: (t: string) => `Dans la conversation quotidienne, tu peux employer « ${t} » pour t’exprimer.`,
        situation: 'Pratique courante',
      },
      {
        makeHanzi: (w: string) => `你知道“${w}”在实际对话中应该怎么用吗？`,
        makePinyin: (p: string) => `Nǐ zhīdào "${p}" zài shíjì duìhuà zhōng yīnggāi zěnme yòng ma?`,
        makeFrench: (t: string) => `Sais-tu comment employer « ${t} » dans une vraie conversation ?`,
        situation: 'Application conversationnelle',
      },
    ];

    for (let i = 0; i < naturalTemplates.length && results.length < 2; i++) {
      const tmpl = naturalTemplates[i];
      const h = tmpl.makeHanzi(cleanHanzi);
      if (!seenHanzi.has(h)) {
        seenHanzi.add(h);
        results.push({
          id: `ex-gen-${cleanHanzi}-${i}`,
          hanzi: h,
          pinyin: tmpl.makePinyin(cleanPinyin || cleanHanzi),
          french: tmpl.makeFrench(cleanTranslation),
          situation: tmpl.situation,
          sourceType: 'pattern',
          sourceLabel: 'Exemple d’usage',
        });
      }
    }
  }

  // Si vraiment aucun autre exemple n'a été trouvé et qu'une phrase d'origine existait,
  // la rajouter comme dernière alternative
  if (results.length === 0 && currentSentenceHanzi) {
    results.push({
      id: `ex-fallback-origin`,
      hanzi: currentSentenceHanzi,
      pinyin: cleanPinyin,
      french: cleanTranslation,
      sourceType: 'story',
      sourceLabel: 'Phrase actuelle',
    });
  }

  return results.slice(0, 3);
};

