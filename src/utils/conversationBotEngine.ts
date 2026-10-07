export interface ChatKeyWord {
  hanzi: string;
  pinyin: string;
  translation: string;
}

export interface ChatScenario {
  id: string;
  title: string;
  icon: string;
  role: string;
  description: string;
  themeColor: string;
  initialBotMessage: {
    hanzi: string;
    pinyin: string;
    french: string;
    tip: string;
    quickReplies: string[];
    keyWords: ChatKeyWord[];
  };
}

export interface BotResponse {
  hanzi: string;
  pinyin: string;
  french: string;
  tip?: string;
  quickReplies: string[];
  keyWords?: ChatKeyWord[];
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  hanzi: string;
  pinyin: string;
  french: string;
  tip?: string;
  keyWords?: ChatKeyWord[];
  createdAt: string;
}

export const CHAT_SCENARIOS: ChatScenario[] = [
  {
    id: 'restaurant',
    title: 'Restaurant & Café',
    icon: '🍜',
    role: 'Serveur de restaurant (北京餐馆服务员)',
    description: 'Commande tes plats, demande des recommandations sans piment et demande l’addition comme un habitué.',
    themeColor: '#c23b22',
    initialBotMessage: {
      hanzi: '您好，欢迎光临！请问一共几位？大厅还有空位，请这边坐。',
      pinyin: 'Nín hǎo, huānyíng guānglín! Qǐngwèn yígòng jǐ wèi? Dàtīng hái yǒu kòngwèi, qǐng zhèbiān zuò.',
      french: 'Bonjour, bienvenue ! Combien êtes-vous ? Il y a de la place en salle, asseyez-vous par ici s’il vous plaît.',
      tip: '« 请问一共几位？» (Combien de personnes ?) est la première phrase que te dira tout serveur en Chine dès que tu franchis la porte.',
      quickReplies: [
        '我们一共两个人。(Nous sommes deux au total.)',
        '就我一个人，请问有靠窗的位置吗？(Juste moi, y a-t-il une place près de la fenêtre ?)',
        '请问你们有什么招牌菜？(Quelles sont vos spécialités recommandées ?)'
      ],
      keyWords: [
        { hanzi: '欢迎光临', pinyin: 'huānyíng guānglín', translation: 'bienvenue' },
        { hanzi: '空位', pinyin: 'kòngwèi', translation: 'place libre' },
        { hanzi: '招牌菜', pinyin: 'zhāopáicài', translation: 'plat emblématique du chef' }
      ]
    }
  },
  {
    id: 'taxi',
    title: 'Taxi & Didi',
    icon: '🚕',
    role: 'Chauffeur de taxi local (老司机)',
    description: 'Donne ta destination, demande d’éviter les embouteillages et dis au chauffeur où t’arrêter avec précision.',
    themeColor: '#d97706',
    initialBotMessage: {
      hanzi: '师傅带你走！你好，上车请系好安全带，去哪儿啊？',
      pinyin: 'Shīfu dài nǐ zǒu! Nǐ hǎo, shàngchē qǐng jì hǎo ānquándài, qù nǎr a?',
      french: 'C’est parti ! Bonjour, attachez votre ceinture en montant, où est-ce qu’on va ?',
      tip: 'En Chine, on appelle affectueusement et avec respect les chauffeurs et artisans « 师傅 » (shīfu, maître ouvrier).',
      quickReplies: [
        '去高铁站，师傅，大概需要多长时间？(À la gare TGV, environ combien de temps faut-il ?)',
        '去市中心王府井，走高架桥比较快吧？(À Wangfujing en centre-ville, par le viaduc c’est plus rapide non ?)',
        '在前面那个路口靠边停一下就行。(Arrêtez-vous juste au bord du carrefour devant.)'
      ],
      keyWords: [
        { hanzi: '师傅', pinyin: 'shīfu', translation: 'monsieur le chauffeur / maître' },
        { hanzi: '安全带', pinyin: 'ānquándài', translation: 'ceinture de sécurité' },
        { hanzi: '靠边停', pinyin: 'kàobiān tíng', translation: 'se garer sur le côté' }
      ]
    }
  },
  {
    id: 'coffee',
    title: 'Café & Détente',
    icon: '☕',
    role: 'Barista branché (咖啡师)',
    description: 'Choisis ta boisson, dose le sucre et les glaçons, demande le WiFi et décide entre sur place ou à emporter.',
    themeColor: '#854d0e',
    initialBotMessage: {
      hanzi: '下午好！今天想喝点什么？美式、拿铁，还是尝尝我们今天的手冲？',
      pinyin: 'Xiàwǔ hǎo! Jīntiān xiǎng hē diǎn shénme? Měishì, nátiě, háishi chángchang wǒmen jīntiān de shǒuchōng?',
      french: 'Bon après-midi ! Que souhaitez-vous boire aujourd’hui ? Americano, latte, ou goûter notre café filtre du jour ?',
      tip: 'En Chine, le barista te demandera toujours « 热的还是冰的？» (Chaud ou glacé ?), et tu peux préciser le sucre avec « 半糖 » (50% sucre) ou « 无糖 » (sans sucre).',
      quickReplies: [
        '来一杯热拿铁，换燕麦奶，无糖。(Un latte chaud, avec lait d’avoine, sans sucre.)',
        '一杯冰美式，在这儿喝，请问WiFi密码是多少？(Un americano glacé sur place, quel est le mot de passe du WiFi ?)',
        '打包一杯生椰拿铁，谢谢！(Un latte coco à emporter, merci !)'
      ],
      keyWords: [
        { hanzi: '手冲', pinyin: 'shǒuchōng', translation: 'café filtre artisanal' },
        { hanzi: '燕麦奶', pinyin: 'yànmài nǎi', translation: 'lait d’avoine' },
        { hanzi: '打包', pinyin: 'dǎbāo', translation: 'à emporter' }
      ]
    }
  },
  {
    id: 'shopping',
    title: 'Marché & Négociation',
    icon: '🛍️',
    role: 'Commerçant chaleureux (集市老板)',
    description: 'Demande le prix, négocie poliment avec le sourire et paie par QR code WeChat ou Alipay.',
    themeColor: '#7c3aed',
    initialBotMessage: {
      hanzi: '帅哥 / 美女，来看一看！都是正品好货，喜欢的话可以试一试，算你便宜点！',
      pinyin: 'Shuàigē / Měinǚ, lái kàn yí kàn! Dōu shì zhèngpǐn hǎohuò, xǐhuan de huà kěyǐ shì yí shì, suàn nǐ piányi diǎn!',
      french: 'Hé l’ami, viens regarder ! De la super qualité, si tu aimes tu peux essayer, je te ferai un bon prix !',
      tip: 'Les commerçants appellent couramment les clients « 帅哥 » (beau gosse) ou « 美女 » (belle fille) pour créer un climat amical et chaleureux.',
      quickReplies: [
        '老板，这件多少钱？能便宜一点吗？(Patron, combien pour ceci ? Pouvez-vous faire un petit geste ?)',
        '如果我买两个，能打个折吗？(Si j’en prends deux, vous pouvez me faire une réduction ?)',
        '可以用微信或者支付宝扫码付款吗？(Est-ce que je peux payer par QR code WeChat ou Alipay ?)'
      ],
      keyWords: [
        { hanzi: '打折', pinyin: 'dǎzhé', translation: 'faire une réduction' },
        { hanzi: '便宜', pinyin: 'piányi', translation: 'bon marché / faire un rabais' },
        { hanzi: '扫码', pinyin: 'sǎomǎ', translation: 'scanner le QR code pour payer' }
      ]
    }
  },
  {
    id: 'work',
    title: 'Bureau & Vie Pro',
    icon: '💼',
    role: 'Collègue de travail (同事小李)',
    description: 'Échange avec un collègue, discute de l’avancement des projets et propose d’aller déjeuner.',
    themeColor: '#0369a1',
    initialBotMessage: {
      hanzi: '早啊！昨天的项目汇报大家都觉得很不错。你今天手头忙不忙？中午一起去吃个饭？',
      pinyin: 'Zǎo a! Zuótiān de xiàngmù huìbào dàjiā dōu juéde hěn búcuò. Nǐ jīntiān shǒutóu máng bu máng? Zhōngwǔ yìqǐ qù chī gè fàn?',
      french: 'Salut ! Le compte-rendu de projet d’hier a beaucoup plu à tout le monde. Tu as beaucoup de travail aujourd’hui ? On va manger ensemble à midi ?',
      tip: '« 手头忙不忙 » (littéralement « tes mains sont-elles occupées ») est la façon naturelle de demander si quelqu’un est débordé.',
      quickReplies: [
        '好啊！附近新开了一家川菜馆，听说味道很地道。(Avec plaisir ! Un resto sichuanais vient d’ouvrir à côté, c’est très authentique.)',
        '今天上午有个线上会议，中午我们一点钟去怎么样？(J’ai une réunion en ligne ce matin, ça te va 13h ?)',
        '没问题，我把这封邮件发完就来找你！(Pas de souci, j’envoie cet email et je viens te chercher !)'
      ],
      keyWords: [
        { hanzi: '汇报', pinyin: 'huìbào', translation: 'compte-rendu / rapport' },
        { hanzi: '手头', pinyin: 'shǒutóu', translation: 'entre les mains / sur le moment' },
        { hanzi: '地道', pinyin: 'dìdao', translation: 'authentique / typique' }
      ]
    }
  },
  {
    id: 'freechat',
    title: 'Discussion Libre & Amis',
    icon: '💬',
    role: 'Ami chinois bienveillant (语伴小陈)',
    description: 'Bavarde spontanément de ta vie, de tes passions, de la météo et de la culture chinoise.',
    themeColor: '#16a34a',
    initialBotMessage: {
      hanzi: '哈喽！很高兴认识你！今天你那里的天气怎么样？最近在忙什么有趣的事呢？',
      pinyin: 'Hālóu! Hěn gāoxìng rènshi nǐ! Jīntiān nǐ nàli de tiānqì zěnmeyàng? Zuìjìn zài máng shénme yǒuqù de shì ne?',
      french: 'Hello ! Ravi de te rencontrer ! Quel temps fait-il chez toi aujourd’hui ? De quoi de sympa t’occupes-tu ces derniers temps ?',
      tip: 'N’hésite pas à parler avec des phrases simples mais complètes. L’IA t’aidera à affiner ton élocution et ton vocabulaire.',
      quickReplies: [
        '我今天天气特别好，我在练习中文口语。(Il fait très beau chez moi aujourd’hui, je m’entraîne à parler chinois.)',
        '最近工作有点忙，但是下周打算去旅行。(Le travail est un peu prenant, mais j’ai prévu de partir en voyage la semaine prochaine.)',
        '我很喜欢中国美食，尤其是火锅和饺子！(J’adore la cuisine chinoise, surtout la fondue sichuanaise et les raviolis !)'
      ],
      keyWords: [
        { hanzi: '天气', pinyin: 'tiānqì', translation: 'météo / temps' },
        { hanzi: '练习', pinyin: 'liànxí', translation: 's’entraîner / pratiquer' },
        { hanzi: '口语', pinyin: 'kǒuyǔ', translation: 'langue parlée / expression orale' }
      ]
    }
  }
];

// Moteur de génération de réponses avec détection intelligente des intentions
export const generateBotResponse = (
  scenarioId: string, 
  userText: string
): BotResponse => {
  const text = (userText || '').trim().toLowerCase();

  // ============================================================
  // 1. SCÉNARIO RESTAURANT
  // ============================================================
  if (scenarioId === 'restaurant') {
    if (text.includes('位') || text.includes('人') || text.includes('两') || text.includes('一') || text.includes('三') || text.includes('坐')) {
      return {
        hanzi: '好嘞！两个人请跟我来，坐这张靠窗的四人桌吧。这是菜单，想喝热茶还是冰水？',
        pinyin: 'Hǎolei! Liǎng gè rén qǐng gēn wǒ lái, zuò zhè zhāng kàochuāng de sì rén zhuō ba. Zhè shì càidān, xiǎng hē rè chá háishi bīng shuǐ?',
        french: 'Très bien ! Pour deux personnes suivez-moi, installez-vous à cette table de quatre près de la fenêtre. Voici le menu, voulez-vous du thé chaud ou de l’eau glacée ?',
        tip: '« 好嘞 » (hǎolei) est une interjection joviale très courante des serveurs dans le nord de la Chine pour dire « C’est noté avec plaisir ! ».',
        quickReplies: [
          '先来一壶热茶吧，请问有什么特色菜？(Apportez-nous d’abord une théière de thé chaud, quelles sont vos spécialités ?)',
          '我们要两碗牛肉面，少放点辣椒。(Deux bols de nouilles au bœuf, avec peu de piment.)',
          '我们想先看看菜单，等一会儿再点。(On voudrait d’abord regarder le menu, on commandera dans un instant.)'
        ],
        keyWords: [
          { hanzi: '靠窗', pinyin: 'kàochuāng', translation: 'près de la fenêtre' },
          { hanzi: '菜单', pinyin: 'càidān', translation: 'menu / carte' },
          { hanzi: '热茶', pinyin: 'rèchá', translation: 'thé chaud' }
        ]
      };
    }

    if (text.includes('菜') || text.includes('推荐') || text.includes('招牌') || text.includes('吃') || text.includes('面') || text.includes('牛肉')) {
      return {
        hanzi: '我们家的招牌是红烧牛肉面和宫保鸡丁，每天都卖出几百份！口味偏微辣，你们能吃辣吗？',
        pinyin: 'Wǒmen jiā de zhāopái shì hóngshāo niúròumiàn hé gōngbǎo jīdīng, měitiān dōu mài chū jǐ bǎi fèn! Kǒuwèi piān wēilà, nǐmen néng chī là ma?',
        french: 'Nos spécialités sont les nouilles au bœuf mijoté et le poulet Kung Pao, on en sert des centaines chaque jour ! C’est légèrement pimenté, supportez-vous le piment ?',
        tip: 'Pour doser le piment : « 不辣 » (pas épicé), « 微辣 » (légèrement pimenté), « 中辣 » (moyen), « 特辣 » (très pimenté).',
        quickReplies: [
          '我们可以吃微辣，那就各来一份吧！(On peut manger légèrement pimenté, alors apportez-en un de chaque !)',
          '我一点辣都不能吃，能完全不放辣吗？(Je ne supporte pas du tout le piment, pouvez-vous ne pas en mettre du tout ?)',
          '再加一份拍黄瓜当凉菜，谢谢！(Rajoutez aussi une salade de concombres écrasés en entrée, merci !)'
        ],
        keyWords: [
          { hanzi: '红烧', pinyin: 'hóngshāo', translation: 'braisé à la sauce soja rouge' },
          { hanzi: '微辣', pinyin: 'wēilà', translation: 'légèrement pimenté' },
          { hanzi: '凉菜', pinyin: 'liángcài', translation: 'entrée froide' }
        ]
      };
    }

    if (text.includes('结账') || text.includes('买单') || text.includes('钱') || text.includes('微信') || text.includes('支付宝') || text.includes('买')) {
      return {
        hanzi: '好的，一共是一百二十八块钱。桌角有二维码，微信或者支付宝直接扫码就可以支付！',
        pinyin: 'Hǎo de, yígòng shì yībǎi èrshíbā kuài qián. Zhuōjiǎo yǒu èrwéimǎ, Wēixìn huòzhě Zhīfùbǎo zhíjiē sǎomǎ jiù kěyǐ zhīfù!',
        french: 'D’accord, cela fait 128 yuans au total. Il y a un QR code au coin de la table, vous pouvez scanner directement avec WeChat ou Alipay !',
        tip: 'En Chine, au lieu de demander l’addition au serveur avec une carte bleue physique, on scanne directement le QR code collé sur la table.',
        quickReplies: [
          '好的，我已经扫码付好了，你看一下。(D’accord, j’ai scanné et payé, regarde s’il te plaît.)',
          '请问可以开一张发票吗？(Est-ce que vous pouvez me donner une facture ?)',
          '菜非常好吃，下次我们还会再来！(Les plats étaient délicieux, nous reviendrons la prochaine fois !)'
        ],
        keyWords: [
          { hanzi: '二维码', pinyin: 'èrwéimǎ', translation: 'QR code' },
          { hanzi: '支付', pinyin: 'zhīfù', translation: 'payer / régler' },
          { hanzi: '发票', pinyin: 'fāpiào', translation: 'facture officielle' }
        ]
      };
    }

    // Réponse par défaut restaurant
    return {
      hanzi: '没问题，我都记下了！厨房马上给您准备，请稍等十分钟左右，先喝点水。',
      pinyin: 'Méi wèntí, wǒ dōu jì xià le! Chúfáng mǎshàng gěi nín zhǔnbèi, qǐng shāo děng shí fēnzhōng zuǒyòu, xiān hē diǎn shuǐ.',
      french: 'Pas de problème, j’ai tout bien noté ! La cuisine prépare tout de suite, patientez environ dix minutes, prenez un peu d’eau en attendant.',
      tip: '« 稍等 » (shāo děng) signifie « patienter un instant » en langage courtois de service.',
      quickReplies: [
        '服务员，能再拿两双筷子和一个小碗吗？(Serveur, pouvez-vous apporter deux paires de baguettes et un petit bol ?)',
        '老板，结账！可以用微信付款吗？(Patron, l’addition ! On peut payer par WeChat ?)',
        '今天的菜上得真快，谢谢！(Les plats sont arrivés vraiment vite aujourd’hui, merci !)'
      ],
      keyWords: [
        { hanzi: '稍等', pinyin: 'shāo děng', translation: 'patienter un court instant' },
        { hanzi: '筷子', pinyin: 'kuàizi', translation: 'baguettes' },
        { hanzi: '厨房', pinyin: 'chúfáng', translation: 'cuisine' }
      ]
    };
  }

  // ============================================================
  // 2. SCÉNARIO TAXI
  // ============================================================
  if (scenarioId === 'taxi') {
    if (text.includes('站') || text.includes('机场') || text.includes('去') || text.includes('王府井') || text.includes('酒店')) {
      return {
        hanzi: '好嘞！现在正是早高峰，主干道有点堵车，我走高架桥绕一下，能省十五分钟，你看行吗？',
        pinyin: 'Hǎolei! Xiànzài zhèng shì zǎo gāofēng, zhǔgàndào yǒudiǎn dǔchē, wǒ zǒu gāojiàqiáo rào yíxià, néng shěng shíwǔ fēnzhōng, nǐ kàn xíng ma?',
        french: 'C’est noté ! C’est l’heure de pointe du matin, l’artère principale est bouchée, je vais contourner par le viaduc, on gagnera 15 minutes, ça te va ?',
        tip: '« 早高峰 » (zǎo gāofēng) désigne l’heure de pointe du matin, et « 堵车 » (dǔchē) signifie être coincé dans les bouchons.',
        quickReplies: [
          '行，没问题，听师傅的，能快点到就行！(Ça marche, je vous fais confiance, tant qu’on arrive vite !)',
          '大概多少分钟能到？我赶十点半的火车。(On arrive dans combien de temps environ ? J’ai un train à 10h30.)',
          '走环路也行，安全第一。(Par le périphérique aussi ça va, la sécurité d’abord.)'
        ],
        keyWords: [
          { hanzi: '高峰', pinyin: 'gāofēng', translation: 'heure de pointe' },
          { hanzi: '堵车', pinyin: 'dǔchē', translation: 'embouteillage' },
          { hanzi: '高架桥', pinyin: 'gāojiàqiáo', translation: 'viaduc urbain / autoroute surélevée' }
        ]
      };
    }

    if (text.includes('停') || text.includes('到') || text.includes('路口') || text.includes('下车')) {
      return {
        hanzi: '好的，前面的公交站不能停，我就在路口拐弯后的路灯旁边放你下来，你看可以吗？',
        pinyin: 'Hǎo de, qiánmiàn de gōngjiāozhàn bù néng tíng, wǒ jiù zài lùkǒu guǎiwān hòu de lùdēng pángbiān fàng nǐ xiàlai, nǐ kàn kěyǐ ma?',
        french: 'D’accord, on ne peut pas s’arrêter à l’arrêt de bus devant, je te dépose juste après le virage du carrefour à côté du lampadaire, ça te convient ?',
        tip: '« 放我下来 » (fàng wǒ xiàlai) est la formulation native la plus naturelle pour dire « déposez-moi ici ».',
        quickReplies: [
          '太好了，就停在那儿吧，谢谢师傅！(Parfait, arrêtez-vous là, merci chauffeur !)',
          '师傅，扫码付款，车费多少钱？(Chauffeur, je scanne le code, combien coûte la course ?)',
          '我的行李在后备箱，麻烦帮我开一下。(Mes bagages sont dans le coffre, merci de m’ouvrir.)'
        ],
        keyWords: [
          { hanzi: '拐弯', pinyin: 'guǎiwān', translation: 'tourner au virage' },
          { hanzi: '后备箱', pinyin: 'hòubèixiāng', translation: 'coffre de la voiture' },
          { hanzi: '车费', pinyin: 'chēfèi', translation: 'prix de la course' }
        ]
      };
    }

    return {
      hanzi: '收到！车里温度合适吗？要是觉得空调太冷或者太热，随时跟我说一声。',
      pinyin: 'Shōudào! Chē lǐ wēndù héshì ma? Yàoshi juéde kōngtiáo tài lěng huòzhě tài rè, suíshí gēn wǒ shuō yì shēng.',
      french: 'Bien reçu ! La température vous convient ? Si la clim est trop froide ou trop chaude, dites-le moi à tout moment.',
      tip: '« 空调 » (kōngtiáo, climatisation) est omniprésente dans les taxis chinois, en été comme en hiver.',
      quickReplies: [
        '温度正好，非常舒服，谢谢师傅。(La température est parfaite, très confortable, merci !)',
        '空调稍微调小一点点可以吗？(Pouvez-vous baisser un tout petit peu la clim ?)',
        '到地方麻烦提醒我一声。(Merci de me prévenir quand on arrive.)'
      ],
      keyWords: [
        { hanzi: '空调', pinyin: 'kōngtiáo', translation: 'climatisation' },
        { hanzi: '合适', pinyin: 'héshì', translation: 'adéquat / convenable' },
        { hanzi: '提醒', pinyin: 'tíxǐng', translation: 'rappeler / prévenir' }
      ]
    };
  }

  // ============================================================
  // 3. SCÉNARIO CAFÉ
  // ============================================================
  if (scenarioId === 'coffee') {
    if (text.includes('拿铁') || text.includes('美式') || text.includes('喝') || text.includes('杯') || text.includes('冰') || text.includes('热')) {
      return {
        hanzi: '好的！请问您需要大杯还是中杯？在这儿喝是用马克杯，打包是用纸杯。另外甜度需要调整吗？',
        pinyin: 'Hǎo de! Qǐngwèn nín xūyào dàbēi háishi zhōngbēi? Zài zhèr hē shì yòng mǎkèbēi, dǎbāo shì yòng zhǐbēi. Lìngwài tiándù xūyào tiáozhěng ma?',
        french: 'Très bien ! Préférez-vous un grand verre ou un moyen ? Pour boire sur place c’est une tasse mug, à emporter c’est un gobelet carton. Faut-il ajuster le sucre ?',
        tip: 'Les trois formats de tasse courants en Chine sont « 中杯 » (Tall/Moyen), « 大杯 » (Grande/Grand) et « 超大杯 » (Venti).',
        quickReplies: [
          '大杯，在这儿喝，做无糖的，谢谢。(Grand verre, sur place, sans sucre merci.)',
          '打包带走，麻烦少冰、半糖。(À emporter, avec peu de glaçons et 50% de sucre s’il vous plaît.)',
          '请问你们店里有无线WiFi吗？密码是什么？(Avez-vous le WiFi dans le café ? Quel est le mot de passe ?)'
        ],
        keyWords: [
          { hanzi: '大杯', pinyin: 'dàbēi', translation: 'grand format' },
          { hanzi: '甜度', pinyin: 'tiándù', translation: 'niveau de sucre' },
          { hanzi: '无糖', pinyin: 'wútáng', translation: 'sans sucre' }
        ]
      };
    }

    if (text.includes('wifi') || text.includes('密码') || text.includes('网') || text.includes('上网')) {
      return {
        hanzi: 'WiFi名字就是我们店名 CafeCoffee，密码是八个八：88888888，旁边桌子底下有插座可以充电！',
        pinyin: 'WiFi míngzi jiù shì wǒmen diànmíng CafeCoffee, mìmǎ shì bā gè bā: 88888888, pángbiān zhuōzi dǐxia yǒu chāzuò kěyǐ chōngdiàn!',
        french: 'Le nom du WiFi est le nom du café CafeCoffee, et le mot de passe est huit fois le chiffre 8 : 88888888. Il y a des prises sous la table d’à côté pour recharger !',
        tip: 'Le chiffre 8 (bā) sonne comme « 发 » (fā, prospérité et fortune), c’est le mot de passe le plus populaire dans les commerces en Chine !',
        quickReplies: [
          '太方便了，刚好我的手机快没电了！(Trop pratique, mon téléphone n’avait presque plus de batterie !)',
          '好的，咖啡做好了叫我一声。(D’accord, appelez-moi quand le café sera prêt.)',
          '请问洗手间在哪个方向？(Dans quelle direction se trouvent les toilettes ?)'
        ],
        keyWords: [
          { hanzi: '密码', pinyin: 'mìmǎ', translation: 'mot de passe' },
          { hanzi: '插座', pinyin: 'chāzuò', translation: 'prise de courant' },
          { hanzi: '充电', pinyin: 'chōngdiàn', translation: 'recharger la batterie' }
        ]
      };
    }

    return {
      hanzi: '您的饮品做好了，小心烫口！如果需要纸巾或者吸管，就在取餐台右边自取。',
      pinyin: 'Nín de yǐnpǐn zuò hǎo le, xiǎoxīn tàngkǒu! Rúguǒ xūyào zhǐjīn huòzhě xīguǎn, jiù zài qǔcāntái yòubiān zìqǔ.',
      french: 'Votre boisson est prête, attention c’est chaud ! Si vous avez besoin de serviettes ou d’une paille, servez-vous à droite du comptoir.',
      tip: '« 小心烫 » (Attention c’est brûlant) est la formule polie indispensable répétée dès qu’on sert du thé ou café chaud.',
      quickReplies: [
        '闻起来真香，谢谢你的服务！(Ça sent vraiment bon, merci pour ton service !)',
        '能再帮我多拿两张纸巾吗？(Peux-tu m’apporter deux serviettes en papier de plus ?)',
        '味道非常棒，奶泡很细腻！(Le goût est formidable, la mousse de lait est très onctueuse !)'
      ],
      keyWords: [
        { hanzi: '烫', pinyin: 'tàng', translation: 'brûlant / très chaud' },
        { hanzi: '吸管', pinyin: 'xīguǎn', translation: 'paille pour boire' },
        { hanzi: '自取', pinyin: 'zìqǔ', translation: 'se servir soi-même' }
      ]
    };
  }

  // ============================================================
  // 4. SCÉNARIO SHOPPING & NÉGOCIATION
  // ============================================================
  if (scenarioId === 'shopping') {
    if (text.includes('钱') || text.includes('贵') || text.includes('便宜') || text.includes('折') || text.includes('少')) {
      return {
        hanzi: '这件原价两百八，看你中文说得这么溜，真心交个朋友，一百八十块拿走！绝对不赚你钱！',
        pinyin: 'Zhè jiàn yuánjià liǎng bǎi bā, kàn nǐ zhōngwén shuō de zhème liù, zhēnxīn jiāo gè péngyou, yībǎi bāshí kuài ná zǒu! Juéduì bù zhuàn nǐ qián!',
        french: 'C’était 280 au départ. Comme tu parles chinois avec tant de fluidité, pour le plaisir de devenir amis, prends-le pour 180 ! Je ne gagne rien dessus !',
        tip: 'L’expression « 中文说得真溜 » (tu as un chinois super fluide) est le compliment préféré des commerçants avant de proposer un rabais.',
        quickReplies: [
          '一百五十块，能卖的话我现在马上扫码付钱！(150 yuans, si tu es d’accord je scanne et paie tout de suite !)',
          '那行吧，就一百八，可以用微信付款吗？(Bon d’accord, 180, je peux payer par WeChat ?)',
          '我先去别家转转，要是合适我再回来。(Je vais voir dans d’autres boutiques, si ça me plaît je reviens.)'
        ],
        keyWords: [
          { hanzi: '原价', pinyin: 'yuánjià', translation: 'prix d’origine' },
          { hanzi: '溜', pinyin: 'liù', translation: 'fluide / adroit (langue)' },
          { hanzi: '划算', pinyin: 'huásuàn', translation: 'rentable / une bonne affaire' }
        ]
      };
    }

    return {
      hanzi: '没问题，包给你装好了！质量你尽管放心，穿得舒服下次常来啊！祝你今天玩得开心！',
      pinyin: 'Méi wèntí, bāo gěi nǐ zhuāng hǎo le! Zhìliàng nǐ jǐnguǎn fàngxīn, chuān de shūfu xià cì cháng lái a! Zhù nǐ jīntiān wán de kāixīn!',
      french: 'Pas de problème, c’est emballé dans le sac ! N’aie aucune inquiétude sur la qualité, si c’est confortable reviens souvent ! Passe une super journée !',
      tip: '« 常来啊 » (reviens souvent !) est la salutation chaleureuse finale des commerçants de quartier.',
      quickReplies: [
        '好的老板，生意兴隆啊！(Merci patron, prospérité dans tes affaires !)',
        '东西很不错，下次叫我朋友也来买。(C’est super, la prochaine fois j’amènerai mes amis acheter ici.)',
        '慢走，祝你今天发大财！(Prends soin de toi, fais fortune aujourd’hui !)'
      ],
      keyWords: [
        { hanzi: '质量', pinyin: 'zhìliàng', translation: 'qualité' },
        { hanzi: '生意兴隆', pinyin: 'shēngyi xīnglóng', translation: 'commerce prospère (souhait traditionnel)' },
        { hanzi: '发财', pinyin: 'fācái', translation: 'faire fortune / prospérer' }
      ]
    };
  }

  // ============================================================
  // 5. SCÉNARIO TRAVAIL & BUREAU
  // ============================================================
  if (scenarioId === 'work') {
    if (text.includes('吃') || text.includes('饭') || text.includes('午') || text.includes('川菜') || text.includes('面')) {
      return {
        hanzi: '太棒了！那我们中午十二点半在公司楼下大堂集合。那家川菜的毛血旺和回锅肉绝了，保证合你胃口！',
        pinyin: 'Tài bàng le! Nà wǒmen zhōngwǔ shí’èr diǎn bàn zài gōngsī lóuxià dàtáng jíhé. Nà jiā chuāncài de máoxuěwàng hé huíguōròu jué le, bǎozhèng hé nǐ wèikǒu!',
        french: 'Génial ! Rendez-vous à 12h30 dans le hall en bas de l’immeuble. Le porc sauté deux fois et les spécialités sont à tomber par terre, tu vas adorer !',
        tip: '« 绝了 » (jué le) est une expression familière très à la mode chez les jeunes citadins chinois pour dire « C’est incroyable / au top du top ! ».',
        quickReplies: [
          '好，十二点半不见不散！(D’accord, 12h30 au rendez-vous, sois là !)',
          '听起来太诱人了，我已经开始饿了！(Ça a l’air trop tentant, j’ai déjà faim !)',
          '把小王也叫上吧，人多点菜更热闹。(On invite aussi Xiao Wang ? À plusieurs on peut goûter plus de plats.)'
        ],
        keyWords: [
          { hanzi: '集合', pinyin: 'jíhé', translation: 'se rassembler / se retrouver' },
          { hanzi: '不见不散', pinyin: 'bú jiàn bú sàn', translation: 'on ne part pas sans s’être vus (expression idiomatique)' },
          { hanzi: '胃口', pinyin: 'wèikǒu', translation: 'appétit / goût personnel' }
        ]
      };
    }

    return {
      hanzi: '行！工作再忙也要劳逸结合。如果项目上有什么需要我帮忙的，随时敲我微信！',
      pinyin: 'Xíng! Gōngzuò zài máng yě yào láoyì jiéhé. Rúguǒ xiàngmù shang yǒu shénme xūyào wǒ bāngmáng de, suíshí qiāo wǒ Wēixìn!',
      french: 'Ça marche ! Même avec beaucoup de travail, il faut savoir équilibrer effort et repos. Si tu as besoin d’aide sur le projet, envoie-moi un message sur WeChat n’importe quand !',
      tip: '« 劳逸结合 » (láoyì jiéhé) est un proverbe chinois classique qui conseille de concilier travail et détente pour rester efficace.',
      quickReplies: [
        '收到，多谢支持，我们下午见！(Bien reçu, merci pour ton soutien, à cet après-midi !)',
        '没问题，我把修改好的文件发你邮箱了。(Pas de souci, je t’ai envoyé le document corrigé par mail.)',
        '加油，今天把这个案子搞定！(Bon courage, on boucle ce dossier aujourd’hui !)'
      ],
      keyWords: [
        { hanzi: '劳逸结合', pinyin: 'láoyì jiéhé', translation: 'équilibrer travail et repos' },
        { hanzi: '随时', pinyin: 'suíshí', translation: 'à n’importe quel moment' },
        { hanzi: '搞定', pinyin: 'gǎodìng', translation: 'boucler / régler l’affaire' }
      ]
    };
  }

  // ============================================================
  // 6. SCÉNARIO LIBRE & AMICAL (DEFAULT CHAT)
  // ============================================================
  if (text.includes('你好') || text.includes('哈喽') || text.includes('hi') || text.includes('hello')) {
    return {
      hanzi: '你好啊！能用中文和你交流太开心了！你学习中文多久了？发音听起来很舒服呢！',
      pinyin: 'Nǐ hǎo a! Néng yòng zhōngwén hé nǐ jiāoliú tài kāixīn le! Nǐ xuéxí zhōngwén duōjiǔ le? Fāyīn tīng qǐlái hěn shūfu ne!',
      french: 'Bonjour ! Je suis trop content de pouvoir échanger en chinois avec toi ! Depuis combien de temps apprends-tu le chinois ? Ta prononciation est très agréable à écouter !',
      tip: 'Pour parler de la durée : « 我学中文一年了 » (J’étudie le chinois depuis un an). La particule « 了 » à la fin indique que l’action continue.',
      quickReplies: [
        '我学中文大概半年了，主要是练习听说。(J’apprends le chinois depuis environ 6 mois, surtout l’écoute et l’oral.)',
        '谢谢夸奖！我每天用 Fluent 和 Anki 背单词。(Merci pour le compliment ! J’apprends chaque jour avec Fluent et Anki.)',
        '我想学好中文，以后去中国旅游。(Je veux bien maîtriser le chinois pour voyager en Chine plus tard.)'
      ],
      keyWords: [
        { hanzi: '交流', pinyin: 'jiāoliú', translation: 'échanger / communiquer' },
        { hanzi: '发音', pinyin: 'fāyīn', translation: 'prononciation' },
        { hanzi: '夸奖', pinyin: 'kuājiǎng', translation: 'complimenter / flatter' }
      ]
    };
  }

  if (text.includes('天气') || text.includes('热') || text.includes('冷') || text.includes('下雨') || text.includes('晴')) {
    return {
      hanzi: '好天气真的会让人心情大好！好天气的日子最适合出门散步喝杯茶。你平时周末最喜欢做些什么放松？',
      pinyin: 'Hǎo tiānqì zhēnde huì ràng rén xīnqíng dà hǎo! Hǎo tiānqì de rìzi zuì shìhé chūmén sànbù hē bēi chá. Nǐ píngshí zhōumò zuì xǐhuan zuò xiē shénme fàngsōng?',
      french: 'Le beau temps met vraiment de bonne humeur ! Les jours ensoleillés sont parfaits pour aller se promener et boire un thé. Qu’aimes-tu faire le week-end pour décompresser ?',
      tip: '« 心情大好 » exprime le fait d’avoir le moral au beau fixe.',
      quickReplies: [
        '我喜欢看书、听音乐，偶尔和朋友去聚餐。(J’aime lire, écouter de la musique, et de temps en temps dîner entre amis.)',
        '我喜欢运动，比如跑步或者游泳。(J’aime faire du sport, comme courir ou nager.)',
        '周末我常常宅在家里做中国菜！(Le week-end je reste souvent à la maison pour cuisiner chinois !)'
      ],
      keyWords: [
        { hanzi: '心情', pinyin: 'xīnqíng', translation: 'humeur / moral' },
        { hanzi: '散步', pinyin: 'sànbù', translation: 'se promener à pied' },
        { hanzi: '放松', pinyin: 'fàngsōng', translation: 'se détendre / relâcher la pression' }
      ]
    };
  }

  // Réponse conversationnelle libre d'encouragement
  return {
    hanzi: '你说得很有意思！用自己的话表达观点，这就是口语进步最快的方法。我们接下来想聊什么呢？',
    pinyin: 'Nǐ shuō de hěn yǒu yìsi! Yòng zìjǐ de huà biǎodá guǎndiǎn, zhè jiù shì kǒuyǔ jìnbù zuì kuài de fāngfǎ. Wǒmen jiēxiàlái xiǎng liáo shénme ne?',
    french: 'Ce que tu dis est très intéressant ! Exprimer ses idées avec ses propres mots est le moyen le plus rapide de progresser à l’oral. De quoi aimerais-tu parler ensuite ?',
    tip: 'Chaque tentative renforce la connexion neuronale entre le sens et le ton mandarin. Continue sur cette lancée !',
    quickReplies: [
      '你能给我推荐几个地道的中国电影或电视剧吗？(Peux-tu me recommander de bons films ou séries chinoises ?)',
      '我想聊聊中国的传统节日和习俗。(J’aimerais parler des fêtes traditionnelles et coutumes chinoises.)',
      '你觉得练习中文声调有什么好诀窍？(Selon toi, quelle est la meilleure astuce pour maîtriser les tons chinois ?)'
    ],
    keyWords: [
      { hanzi: '表达', pinyin: 'biǎodá', translation: 'exprimer / formuler' },
      { hanzi: '观点', pinyin: 'guǎndiǎn', translation: 'point de vue / opinion' },
      { hanzi: '进步', pinyin: 'jìnbù', translation: 'progresser / faire des progrès' }
    ]
  };
};
