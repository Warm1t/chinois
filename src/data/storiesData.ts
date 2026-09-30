import { MaayotStory, AnkiWord } from '../types/fluent';

export const BUILT_IN_STORIES: MaayotStory[] = [
  {
    id: 'story-tea-house',
    title: '老茶馆里的奇妙相遇',
    titlePinyin: 'Lǎo cháguǎn lǐ de qímiào xiāngyù',
    titleTranslation: 'Une rencontre insolite dans la vieille maison de thé',
    level: 'HSK 3',
    category: 'Culture & Rencontres',
    readTime: '2 min',
    wordCount: 145,
    isDaily: true,
    targetWords: [
      { hanzi: '偶尔', pinyin: 'ǒu\'ěr', translation: 'de temps en temps, occasionnellement' },
      { hanzi: '熟悉', pinyin: 'shúxī', translation: 'bien connaître, être familier' },
      { hanzi: '竟然', pinyin: 'jìngrán', translation: 'contre toute attente, à ma grande surprise' },
      { hanzi: '解决', pinyin: 'jiějué', translation: 'résoudre, régler (un problème)' }
    ],
    paragraphs: [
      {
        sentences: [
          {
            hanzi: '在成都的一条安静老街上，有一家开了三十年的老茶馆。',
            pinyin: 'Zài Chéngdū de yì tiáo ānjìng lǎojiē shang, yǒu yì jiā kāi le sānshí nián de lǎo cháguǎn.',
            translation: 'Dans une vieille rue paisible de Chengdu, il y a une ancienne maison de thé ouverte depuis trente ans.',
            words: [
              { hanzi: '在', pinyin: 'zài', translation: 'à, dans' },
              { hanzi: '成都', pinyin: 'Chéngdū', translation: 'Chengdu (ville du Sichuan)' },
              { hanzi: '的', pinyin: 'de', translation: 'particule de possession' },
              { hanzi: '一条', pinyin: 'yì tiáo', translation: 'une (classificateur pour rue)' },
              { hanzi: '安静', pinyin: 'ānjìng', translation: 'calme, paisible' },
              { hanzi: '老街', pinyin: 'lǎojiē', translation: 'vieille rue' },
              { hanzi: '上', pinyin: 'shang', translation: 'sur, dans' },
              { hanzi: '有一家', pinyin: 'yǒu yì jiā', translation: 'il y a une' },
              { hanzi: '开了', pinyin: 'kāi le', translation: 'ouverte depuis' },
              { hanzi: '三十年', pinyin: 'sānshí nián', translation: 'trente ans' },
              { hanzi: '的', pinyin: 'de', translation: 'de' },
              { hanzi: '老茶馆', pinyin: 'lǎo cháguǎn', translation: 'vieille maison de thé' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '小林平时工作非常忙，只有周末才会偶尔来这里喝茶看书。',
            pinyin: 'Xiǎo Lín píngshí gōngzuò fēicháng máng, zhǐyǒu zhōumò cái huì ǒu\'ěr lái zhèlǐ hēchá kànshū.',
            translation: 'Xiao Lin est d\'ordinaire très occupé par son travail, et ne vient ici que de temps en temps le week-end pour boire le thé et lire.',
            words: [
              { hanzi: '小林', pinyin: 'Xiǎo Lín', translation: 'Xiao Lin (nom de personne)' },
              { hanzi: '平时', pinyin: 'píngshí', translation: 'd\'ordinaire, d\'habitude' },
              { hanzi: '工作', pinyin: 'gōngzuò', translation: 'travail, travailler' },
              { hanzi: '非常', pinyin: 'fēicháng', translation: 'très, extrêmement' },
              { hanzi: '忙', pinyin: 'máng', translation: 'occupé' },
              { hanzi: '只有', pinyin: 'zhǐyǒu', translation: 'seulement, uniquement si' },
              { hanzi: '周末', pinyin: 'zhōumò', translation: 'week-end' },
              { hanzi: '才', pinyin: 'cái', translation: 'alors seulement' },
              { hanzi: '会', pinyin: 'huì', translation: 'arriver de, pouvoir' },
              { hanzi: '偶尔', pinyin: 'ǒu\'ěr', translation: 'de temps en temps', isTarget: true },
              { hanzi: '来', pinyin: 'lái', translation: 'venir' },
              { hanzi: '这里', pinyin: 'zhèlǐ', translation: 'ici' },
              { hanzi: '喝茶', pinyin: 'hēchá', translation: 'boire du thé' },
              { hanzi: '看书', pinyin: 'kànshū', translation: 'lire un livre' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      },
      {
        sentences: [
          {
            hanzi: '今天，旁边坐着一位穿白衬衫的老爷爷，他的笑声听起来非常熟悉。',
            pinyin: 'Jīntiān, pángbiān zuò zhe yí wèi chuān bái chènshān de lǎo yéye, tā de xiàoshēng tīng qǐlái fēicháng shúxī.',
            translation: 'Aujourd\'hui, à côté de lui était assis un grand-père en chemise blanche, dont le rire semblait très familier.',
            words: [
              { hanzi: '今天', pinyin: 'jīntiān', translation: 'aujourd\'hui' },
              { hanzi: '旁边', pinyin: 'pángbiān', translation: 'à côté' },
              { hanzi: '坐着', pinyin: 'zuò zhe', translation: 'assis' },
              { hanzi: '一位', pinyin: 'yí wèi', translation: 'une (personne de respect)' },
              { hanzi: '穿', pinyin: 'chuān', translation: 'porter (vêtement)' },
              { hanzi: '白衬衫', pinyin: 'bái chènshān', translation: 'chemise blanche' },
              { hanzi: '的', pinyin: 'de', translation: 'qui' },
              { hanzi: '老爷爷', pinyin: 'lǎo yéye', translation: 'grand-père, vieil homme' },
              { hanzi: '他的', pinyin: 'tā de', translation: 'son' },
              { hanzi: '笑声', pinyin: 'xiàoshēng', translation: 'rire' },
              { hanzi: '听起来', pinyin: 'tīng qǐlái', translation: 'sembler à l\'oreille' },
              { hanzi: '非常', pinyin: 'fēicháng', translation: 'très' },
              { hanzi: '熟悉', pinyin: 'shúxī', translation: 'familier, bien connu', isTarget: true },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '小林抬头一看，竟然是他小学时最尊敬的数学老师！',
            pinyin: 'Xiǎo Lín táitóu yí kàn, jìngrán shì tā xiǎoxué shí zuì zūnjìng de shùxué lǎoshī!',
            translation: 'Xiao Lin leva la tête et regarda : c\'était, contre toute attente, son professeur de maths préféré de l\'école primaire !',
            words: [
              { hanzi: '小林', pinyin: 'Xiǎo Lín', translation: 'Xiao Lin' },
              { hanzi: '抬头', pinyin: 'táitóu', translation: 'lever la tête' },
              { hanzi: '一看', pinyin: 'yí kàn', translation: 'jeter un coup d\'œil' },
              { hanzi: '竟然', pinyin: 'jìngrán', translation: 'contre toute attente', isTarget: true },
              { hanzi: '是', pinyin: 'shì', translation: 'être' },
              { hanzi: '他', pinyin: 'tā', translation: 'son' },
              { hanzi: '小学时', pinyin: 'xiǎoxué shí', translation: 'à l\'époque de l\'école primaire' },
              { hanzi: '最', pinyin: 'zuì', translation: 'le plus' },
              { hanzi: '尊敬', pinyin: 'zūnjìng', translation: 'respecté' },
              { hanzi: '的', pinyin: 'de', translation: 'qui' },
              { hanzi: '数学', pinyin: 'shùxué', translation: 'mathématiques' },
              { hanzi: '老师', pinyin: 'lǎoshī', translation: 'professeur' },
              { hanzi: '！', pinyin: '', translation: '!' }
            ]
          },
          {
            hanzi: '当年遇到不会的难题，都是这位老师耐心帮他解决的。',
            pinyin: 'Dāngnián yù dào bú huì de nántí, dōu shì zhè wèi lǎoshī nàixīn bāng tā jiějué de.',
            translation: 'À l\'époque, quand il tombait sur des problèmes difficiles qu\'il ne savait pas faire, c\'est toujours ce professeur qui l\'aidait patiemment à les résoudre.',
            words: [
              { hanzi: '当年', pinyin: 'dāngnián', translation: 'en ces années-là' },
              { hanzi: '遇到', pinyin: 'yù dào', translation: 'rencontrer, tomber sur' },
              { hanzi: '不会的', pinyin: 'bú huì de', translation: 'qu\'on ne sait pas faire' },
              { hanzi: '难题', pinyin: 'nántí', translation: 'problème difficile' },
              { hanzi: '都是', pinyin: 'dōu shì', translation: 'c\'était toujours' },
              { hanzi: '这位', pinyin: 'zhè wèi', translation: 'ce' },
              { hanzi: '老师', pinyin: 'lǎoshī', translation: 'professeur' },
              { hanzi: '耐心', pinyin: 'nàixīn', translation: 'patiemment' },
              { hanzi: '帮他', pinyin: 'bāng tā', translation: 'aider lui' },
              { hanzi: '解决', pinyin: 'jiějué', translation: 'résoudre', isTarget: true },
              { hanzi: '的', pinyin: 'de', translation: 'qui l\'a fait' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      }
    ],
    audioText: '在成都的一条安静老街上，有一家开了三十年的老茶馆。小林平时工作非常忙，只有周末才会偶尔来这里喝茶看书。今天，旁边坐着一位穿白衬衫的老爷爷，他的笑声听起来非常熟悉。小林抬头一看，竟然是他小学时最尊敬的数学老师！当年遇到不会的难题，都是这位老师耐心帮他解决的。',
    quiz: [
      {
        question: '小林为什么平时不常来这家茶馆？',
        questionPinyin: 'Xiǎo Lín wèishénme píngshí bù cháng lái zhè jiā cháguǎn?',
        options: [
          '因为茶水太贵了 (Le thé est trop cher)',
          '因为他平时工作非常忙 (Parce qu\'il est très pris par son travail)',
          '因为茶馆离家太远 (La maison de thé est trop loin)',
          '因为他不爱喝茶 (Parce qu\'il n\'aime pas le thé)'
        ],
        correctIndex: 1,
        explanation: 'Dans le texte : "小林平时工作非常忙，只有周末才会偶尔来这里" (Xiao Lin est très occupé d\'ordinaire, il ne vient qu\'occasionnellement le week-end).'
      },
      {
        question: '小林在茶馆里遇到了谁？',
        questionPinyin: 'Xiǎo Lín zài cháguǎn lǐ yù dào le shéi?',
        options: [
          '他现在的大学同事 (Son collègue d\'université actuel)',
          '他的亲生爷爷 (Son grand-père biologique)',
          '他小学最尊敬的数学老师 (Son professeur de maths respecté du primaire)',
          '茶馆的老板 (Le patron de la maison de thé)'
        ],
        correctIndex: 2,
        explanation: 'Xiao Lin a levé la tête et a découvert que c\'était son ancien professeur d\'école primaire (小学时最尊敬的数学老师).'
      }
    ],
    discussionPrompt: {
      question: '你在生活中是否也曾偶尔偶遇过很久没见的老朋友或老老师？当时的心情怎么样？',
      questionPinyin: 'Nǐ zài shēnghuó zhōng shìfǒu yě céng ǒu\'ěr ǒuyù guò hěn jiǔ méi jiàn de lǎo péngyou huò lǎo lǎoshī? Dāngshí de xīnqíng zěnmeyàng?',
      questionTranslation: 'As-tu déjà rencontré par hasard dans ta vie un vieil ami ou professeur perdu de vue ? Quel était ton sentiment ?',
      suggestedWords: ['偶尔 (ǒu\'ěr)', '熟悉 (shúxī)', '惊喜 (jīngxǐ)', '感动 (gǎndòng)']
    }
  },
  {
    id: 'story-lost-in-hutong',
    title: '胡同里的问路奇遇',
    titlePinyin: 'Hútòng lǐ de wènlù qíyù',
    titleTranslation: 'Aventure et boussole dans les ruelles de Pékin',
    level: 'HSK 3',
    category: 'Voyage & Exploration',
    readTime: '2 min',
    wordCount: 158,
    targetWords: [
      { hanzi: '迷路', pinyin: 'mílù', translation: 'se perdre, s\'égarer' },
      { hanzi: '热情', pinyin: 'rèqíng', translation: 'chaleureux, enthousiaste' },
      { hanzi: '顺利', pinyin: 'shùnlì', translation: 'sans encombre, avec succès' },
      { hanzi: '无论如何', pinyin: 'wúlùn rúhé', translation: 'quoi qu\'il en soit, dans tous les cas' }
    ],
    paragraphs: [
      {
        sentences: [
          {
            hanzi: '大卫刚到北京留学不久，非常喜欢一个人在胡同里散步。',
            pinyin: 'Dàwèi gāng dào Běijīng liúxué bù jiǔ, fēicháng xǐhuan yí gè rén zài hútòng lǐ sànbù.',
            translation: 'David est arrivé à Pékin pour étudier il y a peu de temps, et adore se promener seul dans les hutongs.',
            words: [
              { hanzi: '大卫', pinyin: 'Dàwèi', translation: 'David' },
              { hanzi: '刚到', pinyin: 'gāng dào', translation: 'vient d\'arriver' },
              { hanzi: '北京', pinyin: 'Běijīng', translation: 'Pékin' },
              { hanzi: '留学', pinyin: 'liúxué', translation: 'étudier à l\'étranger' },
              { hanzi: '不久', pinyin: 'bù jiǔ', translation: 'depuis peu' },
              { hanzi: '非常', pinyin: 'fēicháng', translation: 'très' },
              { hanzi: '喜欢', pinyin: 'xǐhuan', translation: 'aimer' },
              { hanzi: '一个人', pinyin: 'yí gè rén', translation: 'seul' },
              { hanzi: '在', pinyin: 'zài', translation: 'dans' },
              { hanzi: '胡同里', pinyin: 'hútòng lǐ', translation: 'les ruelles (hutong)' },
              { hanzi: '散步', pinyin: 'sànbù', translation: 'se promener' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '昨天下午，手机突然没电了，他一不小心在复杂的小巷子里迷路了。',
            pinyin: 'Zuótiān xiàwǔ, shǒujī tūrán méi diàn le, tā yí bù xiǎoxīn zài fùzá de xiǎoxiàngzi lǐ mílù le.',
            translation: 'Hier après-midi, son téléphone est soudainement tombé à plat de batterie, et par inadvertance, il s\'est perdu dans les ruelles tortueuses.',
            words: [
              { hanzi: '昨天', pinyin: 'zuótiān', translation: 'hier' },
              { hanzi: '下午', pinyin: 'xiàwǔ', translation: 'après-midi' },
              { hanzi: '手机', pinyin: 'shǒujī', translation: 'téléphone' },
              { hanzi: '突然', pinyin: 'tūrán', translation: 'soudainement' },
              { hanzi: '没电了', pinyin: 'méi diàn le', translation: 'plus de batterie' },
              { hanzi: '他', pinyin: 'tā', translation: 'il' },
              { hanzi: '一不小心', pinyin: 'yí bù xiǎoxīn', translation: 'par inadvertance' },
              { hanzi: '在', pinyin: 'zài', translation: 'dans' },
              { hanzi: '复杂', pinyin: 'fùzá', translation: 'complexe, sinueux' },
              { hanzi: '的', pinyin: 'de', translation: 'de' },
              { hanzi: '小巷子', pinyin: 'xiǎoxiàngzi', translation: 'petites ruelles' },
              { hanzi: '里', pinyin: 'lǐ', translation: 'dans' },
              { hanzi: '迷路', pinyin: 'mílù', translation: 'se perdre', isTarget: true },
              { hanzi: '了', pinyin: 'le', translation: 'particule de changement d\'état' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      },
      {
        sentences: [
          {
            hanzi: '幸运的是，一位推着自行车的大妈非常热情地带他走出了胡同。',
            pinyin: 'Xìngyùn de shì, yí wèi tuī zhe zìxíngchē de dàmā fēicháng rèqíng de dài tā zǒu chū le hútòng.',
            translation: 'Heureusement, une gentille dame poussant son vélo l\'a guidé très chaleureusement hors des ruelles.',
            words: [
              { hanzi: '幸运的是', pinyin: 'xìngyùn de shì', translation: 'heureusement' },
              { hanzi: '一位', pinyin: 'yí wèi', translation: 'une dame' },
              { hanzi: '推着', pinyin: 'tuī zhe', translation: 'poussant' },
              { hanzi: '自行车', pinyin: 'zìxíngchē', translation: 'vélo' },
              { hanzi: '的', pinyin: 'de', translation: 'qui' },
              { hanzi: '大妈', pinyin: 'dàmā', translation: 'dame âgée' },
              { hanzi: '非常', pinyin: 'fēicháng', translation: 'très' },
              { hanzi: '热情', pinyin: 'rèqíng', translation: 'chaleureux, bienveillant', isTarget: true },
              { hanzi: '地', pinyin: 'de', translation: 'particule adverbiale' },
              { hanzi: '带他', pinyin: 'dài tā', translation: 'le mener, le guider' },
              { hanzi: '走出了', pinyin: 'zǒu chū le', translation: 'sortir de' },
              { hanzi: '胡同', pinyin: 'hútòng', translation: 'les hutongs' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '在她的帮助下，大卫顺利找到了地铁站，准时回到了学校。',
            pinyin: 'Zài tā de bāngzhù xià, Dàwèi shùnlì zhǎo dào le dìtiězhàn, zhǔnshí huí dào le xuéxiào.',
            translation: 'Grâce à son aide, David a trouvé la station de métro sans encombre et est rentré à l\'école à l\'heure.',
            words: [
              { hanzi: '在她的', pinyin: 'zài tā de', translation: 'grâce à son' },
              { hanzi: '帮助下', pinyin: 'bāngzhù xià', translation: 'aide' },
              { hanzi: '大卫', pinyin: 'Dàwèi', translation: 'David' },
              { hanzi: '顺利', pinyin: 'shùnlì', translation: 'sans encombre, avec succès', isTarget: true },
              { hanzi: '找到了', pinyin: 'zhǎo dào le', translation: 'a trouvé' },
              { hanzi: '地铁站', pinyin: 'dìtiězhàn', translation: 'station de métro' },
              { hanzi: '准时', pinyin: 'zhǔnshí', translation: 'à l\'heure' },
              { hanzi: '回到了', pinyin: 'huí dào le', translation: 'est rentré à' },
              { hanzi: '学校', pinyin: 'xuéxiào', translation: 'l\'école' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      }
    ],
    audioText: '大卫刚到北京留学不久，非常喜欢一个人在胡同里散步。昨天下午，手机突然没电了，他一不小心在复杂的小巷子里迷路了。幸运的是，一位推着自行车的大妈非常热情地带他走出了胡同。在她的帮助下，大卫顺利找到了地铁站，准时回到了学校。',
    quiz: [
      {
        question: '大卫为什么会在胡同里迷路？',
        questionPinyin: 'Dàwèi wèishénme huì zài hútòng lǐ mílù?',
        options: [
          '因为他在跑步没有看路 (Il courait sans faire attention)',
          '因为天黑了看不见 (Il faisait nuit noire)',
          '因为手机没电了，巷子又很复杂 (Son téléphone était à plat et les ruelles complexes)',
          '因为下雨了 (À cause de la pluie)'
        ],
        correctIndex: 2,
        explanation: 'Son téléphone n\'avait plus de batterie (手机突然没电了) et les petites ruelles étaient tortueuses (复杂的小巷子).'
      }
    ],
    discussionPrompt: {
      question: '如果你去一个陌生的城市旅游并不小心迷路了，你会怎么解决这个问题？',
      questionPinyin: 'Rúguǒ nǐ qù yí gè mòshēng de chéngshì lǚyóu bìng yì bù xiǎoxīn mílù le, nǐ huì zěnme jiějué zhè gè wèntí?',
      questionTranslation: 'Si tu voyages dans une ville inconnue et que tu te perds par inadvertance, comment résoudrais-tu ce problème ?',
      suggestedWords: ['问路 (wènlù)', '热情 (rèqíng)', '顺利 (shùnlì)', '地图 (dìtú)']
    }
  },
  {
    id: 'story-late-office-light',
    title: '深夜办公室的那盏灯',
    titlePinyin: 'Shēnyè bàngōngshì de nà zhǎn dēng',
    titleTranslation: 'La lumière du bureau tard le soir',
    level: 'HSK 4',
    category: 'Carrière & Persévérance',
    readTime: '3 min',
    wordCount: 168,
    targetWords: [
      { hanzi: '坚持', pinyin: 'jiānchí', translation: 'persévérer, s\'accrocher' },
      { hanzi: '压力', pinyin: 'yālì', translation: 'stress, pression' },
      { hanzi: '终于', pinyin: 'zhōngyú', translation: 'enfin, au bout du compte' },
      { hanzi: '值得', pinyin: 'zhíde', translation: 'valoir la peine / le coup' }
    ],
    paragraphs: [
      {
        sentences: [
          {
            hanzi: '晚上十点，整座写字楼都安静了下来，只剩下李明办公室的灯还亮着。',
            pinyin: 'Wǎnshang shí diǎn, zhěng zuò xiězìlóu dōu ānjìng le xiàlái, zhǐ shèng xià Lǐ Míng bàngōngshì de dēng hái liàng zhe.',
            translation: 'À dix heures du soir, tout l\'immeuble de bureaux était devenu silencieux, seule la lampe du bureau de Li Ming était encore allumée.',
            words: [
              { hanzi: '晚上', pinyin: 'wǎnshang', translation: 'le soir' },
              { hanzi: '十点', pinyin: 'shí diǎn', translation: 'dix heures' },
              { hanzi: '整座', pinyin: 'zhěng zuò', translation: 'tout entier' },
              { hanzi: '写字楼', pinyin: 'xiězìlóu', translation: 'immeuble de bureaux' },
              { hanzi: '都', pinyin: 'dōu', translation: 'tous' },
              { hanzi: '安静了下来', pinyin: 'ānjìng le xiàlái', translation: 'devenu silencieux' },
              { hanzi: '只剩下', pinyin: 'zhǐ shèng xià', translation: 'ne rester que' },
              { hanzi: '李明', pinyin: 'Lǐ Míng', translation: 'Li Ming' },
              { hanzi: '办公室', pinyin: 'bàngōngshì', translation: 'bureau' },
              { hanzi: '的', pinyin: 'de', translation: 'de' },
              { hanzi: '灯', pinyin: 'dēng', translation: 'lampe, lumière' },
              { hanzi: '还', pinyin: 'hái', translation: 'encore' },
              { hanzi: '亮着', pinyin: 'liàng zhe', translation: 'allumée' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '面对明天的重要项目发布，他虽然感到巨大的压力，但他知道绝不能放弃。',
            pinyin: 'Miànduì míngtiān de zhòngyào xiàngmù fābù, tā suīrán gǎndào jùdà de yālì, dàn tā zhīdào jué bù néng fàngqì.',
            translation: 'Face au lancement important de projet demain, bien qu\'il ressente une forte pression, il sait qu\'il ne doit absolument pas abandonner.',
            words: [
              { hanzi: '面对', pinyin: 'miànduì', translation: 'faire face à' },
              { hanzi: '明天的', pinyin: 'míngtiān de', translation: 'de demain' },
              { hanzi: '重要', pinyin: 'zhòngyào', translation: 'important' },
              { hanzi: '项目', pinyin: 'xiàngmù', translation: 'projet' },
              { hanzi: '发布', pinyin: 'fābù', translation: 'lancement' },
              { hanzi: '他', pinyin: 'tā', translation: 'il' },
              { hanzi: '虽然', pinyin: 'suīrán', translation: 'bien que' },
              { hanzi: '感到', pinyin: 'gǎndào', translation: 'ressentir' },
              { hanzi: '巨大的', pinyin: 'jùdà de', translation: 'énorme, immense' },
              { hanzi: '压力', pinyin: 'yālì', translation: 'stress, pression', isTarget: true },
              { hanzi: '但', pinyin: 'dàn', translation: 'mais' },
              { hanzi: '他知道', pinyin: 'tā zhīdào', translation: 'il sait' },
              { hanzi: '绝不能', pinyin: 'jué bù néng', translation: 'absolument pas pouvoir' },
              { hanzi: '放弃', pinyin: 'fàngqì', translation: 'abandonner' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      },
      {
        sentences: [
          {
            hanzi: '只要再坚持两个小时，所有的程序测试就能彻底完成。',
            pinyin: 'Zhǐyào zài jiānchí liǎng gè xiǎoshí, suǒyǒu de chéngxù cèshì jiù néng chèdǐ wánchéng.',
            translation: 'Il suffit de s\'accrocher encore deux heures, et tous les tests du programme seront complètement achevés.',
            words: [
              { hanzi: '只要', pinyin: 'zhǐyào', translation: 'il suffit de, tant que' },
              { hanzi: '再', pinyin: 'zài', translation: 'encore' },
              { hanzi: '坚持', pinyin: 'jiānchí', translation: 'persévérer, tenir bon', isTarget: true },
              { hanzi: '两个', pinyin: 'liǎng gè', translation: 'deux' },
              { hanzi: '小时', pinyin: 'xiǎoshí', translation: 'heures' },
              { hanzi: '所有', pinyin: 'suǒyǒu', translation: 'tous' },
              { hanzi: '的', pinyin: 'de', translation: 'de' },
              { hanzi: '程序', pinyin: 'chéngxù', translation: 'programme informatique' },
              { hanzi: '测试', pinyin: 'cèshì', translation: 'tests' },
              { hanzi: '就能', pinyin: 'jiù néng', translation: 'pourra alors' },
              { hanzi: '彻底', pinyin: 'chèdǐ', translation: 'entièrement' },
              { hanzi: '完成', pinyin: 'wánchéng', translation: 'être achevé' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '到了凌晨一点，屏幕上终于弹出了成功字样，所有的付出都是值得的！',
            pinyin: 'Dào le língchén yì diǎn, píngmù shang zhōngyú tán chū le chénggōng zìyàng, suǒyǒu de fùchū dōu shì zhíde de!',
            translation: 'À une heure du matin, le mot Succès est enfin apparu à l\'écran, tous les efforts en valaient la peine !',
            words: [
              { hanzi: '到了', pinyin: 'dào le', translation: 'arrivé à' },
              { hanzi: '凌晨', pinyin: 'língchén', translation: 'le milieu de la nuit, les premières heures' },
              { hanzi: '一点', pinyin: 'yì diǎn', translation: 'une heure' },
              { hanzi: '屏幕上', pinyin: 'píngmù shang', translation: 'à l\'écran' },
              { hanzi: '终于', pinyin: 'zhōngyú', translation: 'enfin, finalement', isTarget: true },
              { hanzi: '弹出了', pinyin: 'tán chū le', translation: 'a surgi' },
              { hanzi: '成功', pinyin: 'chénggōng', translation: 'succès' },
              { hanzi: '字样', pinyin: 'zìyàng', translation: 'mention' },
              { hanzi: '所有的', pinyin: 'suǒyǒu de', translation: 'tous les' },
              { hanzi: '付出', pinyin: 'fùchū', translation: 'efforts consentis' },
              { hanzi: '都是', pinyin: 'dōu shì', translation: 'sont tous' },
              { hanzi: '值得的', pinyin: 'zhíde de', translation: 'qui en valent la peine', isTarget: true },
              { hanzi: '！', pinyin: '', translation: '!' }
            ]
          }
        ]
      }
    ],
    audioText: '晚上十点，整座写字楼都安静了下来，只剩下李明办公室的灯还亮着。面对明天的重要项目发布，他虽然感到巨大的压力，但他知道绝不能放弃。只要再坚持两个小时，所有的程序测试就能彻底完成。到了凌晨一点，屏幕上终于弹出了成功字样，所有的付出都是值得的！',
    quiz: [
      {
        question: '李明在办公室工作到很晚是为了什么？',
        questionPinyin: 'Lǐ Míng zài bàngōngshì gōngzuò dào hěn wǎn shì wèile shénme?',
        options: [
          '为了看晚间电影 (Pour regarder un film tard le soir)',
          '为了准备并测试明天的重要项目 (Pour préparer et tester un projet important de demain)',
          '因为把钥匙丢在办公室了 (Parce qu\'il a perdu ses clés)',
          '为了等同事下班 (Pour attendre un collègue)'
        ],
        correctIndex: 1,
        explanation: 'Le texte indique qu\'il devait faire face au lancement d\'un projet important le lendemain (面对明天的重要项目发布).'
      }
    ],
    discussionPrompt: {
      question: '在你的工作或学中文的过程中，有什么事情是你曾经觉得压力很大，但坚持下来后觉得非常值得的？',
      questionPinyin: 'Zài nǐ de gōngzuò huò xué zhōngwén de guòchéng zhōng, yǒu shénme shìqing shì nǐ céngjīng juéde yālì hěn dà, dàn jiānchí xiàlái hòu juéde fēicháng zhíde de?',
      questionTranslation: 'Dans ton travail ou ton apprentissage du chinois, quelle est la chose où tu as ressenti une grosse pression, mais que tu as persévérée et trouvée très valorisante ?',
      suggestedWords: ['坚持 (jiānchí)', '压力 (yālì)', '值得 (zhíde)', '成功 (chénggōng)']
    }
  }
];

// =========================================================================
// GÉNÉRATEUR INTELLIGENT D'HISTOIRES À PARTIR DE MOTS ANKI DE L'UTILISATEUR
// =========================================================================

export const generateStoryFromAnkiWords = (ankiWords: AnkiWord[]): MaayotStory => {
  // Sélection de 3 à 5 mots Anki cibles
  const selectedWords = ankiWords.slice(0, 4);

  const targetWords = selectedWords.map(w => ({
    hanzi: w.hanzi,
    pinyin: w.pinyin || '',
    translation: w.translation || ''
  }));

  const word1 = selectedWords[0]?.hanzi || '词汇';
  const word2 = selectedWords[1]?.hanzi || '学习';
  const word3 = selectedWords[2]?.hanzi || '日常';
  const word4 = selectedWords[3]?.hanzi || '进步';

  const title = `用我的词汇卡：${word1}与${word2}的故事`;
  const titlePinyin = `Yòng wǒ de cíhuì kǎ: ${word1} yǔ ${word2} de gùshì`;
  const titleTranslation = `Histoire personnalisée avec : ${word1} et ${word2}`;

  const sentence1Hanzi = `今天早晨，阳光洒在窗台上，我坐在书桌前开始复习我的中文卡片。`;
  const sentence2Hanzi = `在这些词汇中，我最想掌握的就是“${word1}”和“${word2}”，因为它们在生活中经常被用到。`;
  const sentence3Hanzi = `下午出门时，听到街上的人在谈论关于“${word3}”的话题，我发现自己竟然能听懂一部分了！`;
  const sentence4Hanzi = `只要每天认真积累和练习“${word4}”，我的中文表达能力一定会越来越自然流利。`;

  const audioText = `${sentence1Hanzi} ${sentence2Hanzi} ${sentence3Hanzi} ${sentence4Hanzi}`;

  return {
    id: `custom-anki-${Date.now()}`,
    title,
    titlePinyin,
    titleTranslation,
    level: 'HSK 3',
    category: 'Histoire Personnalisée Anki',
    readTime: '2 min',
    wordCount: 130,
    audioText,
    targetWords,
    paragraphs: [
      {
        sentences: [
          {
            hanzi: sentence1Hanzi,
            pinyin: 'Jīntiān zǎochen, yángguāng sǎ zài chuāngtái shang, wǒ zuò zài shūzhuō qián kāishǐ fùxí wǒ de zhōngwén kǎpiàn.',
            translation: 'Ce matin, le soleil baignait le rebord de la fenêtre, et j\'étais assis à mon bureau pour réviser mes cartes de chinois.',
            words: [
              { hanzi: '今天', pinyin: 'jīntiān', translation: 'aujourd\'hui' },
              { hanzi: '早晨', pinyin: 'zǎochen', translation: 'matin' },
              { hanzi: '阳光', pinyin: 'yángguāng', translation: 'lumière du soleil' },
              { hanzi: '坐在', pinyin: 'zuò zài', translation: 'être assis à' },
              { hanzi: '书桌前', pinyin: 'shūzhuō qián', translation: 'devant le bureau' },
              { hanzi: '复习', pinyin: 'fùxí', translation: 'réviser' },
              { hanzi: '中文卡片', pinyin: 'zhōngwén kǎpiàn', translation: 'cartes de chinois' }
            ]
          },
          {
            hanzi: sentence2Hanzi,
            pinyin: `Zài zhèxiē cíhuì zhōng, wǒ zuì xiǎng zhǎngwò de jiù shì "${word1}" hé "${word2}", yīnwèi tāmen zài shēnghuó zhōng jīngcháng bèi yòng dào.`,
            translation: `Parmi ces mots, ceux que je veux le plus maîtriser sont "${word1}" et "${word2}", car ils sont fréquemment utilisés au quotidien.`,
            words: [
              { hanzi: '在这些', pinyin: 'zài zhèxiē', translation: 'parmi ces' },
              { hanzi: '词汇中', pinyin: 'cíhuì zhōng', translation: 'mots de vocabulaire' },
              { hanzi: '最想', pinyin: 'zuì xiǎng', translation: 'vouloir le plus' },
              { hanzi: '掌握', pinyin: 'zhǎngwò', translation: 'maîtriser' },
              { hanzi: word1, pinyin: selectedWords[0]?.pinyin || '', translation: selectedWords[0]?.translation || '', isTarget: true },
              { hanzi: '和', pinyin: 'hé', translation: 'et' },
              { hanzi: word2, pinyin: selectedWords[1]?.pinyin || '', translation: selectedWords[1]?.translation || '', isTarget: true },
              { hanzi: '经常', pinyin: 'jīngcháng', translation: 'souvent' },
              { hanzi: '被用到', pinyin: 'bèi yòng dào', translation: 'être employé' }
            ]
          }
        ]
      },
      {
        sentences: [
          {
            hanzi: sentence3Hanzi,
            pinyin: `Xiàwǔ chūmén shí, tīng dào jiē shang de rén zài tánlùn guānyú "${word3}" de huàtí, wǒ fāxiàn zìjǐ jìngrán néng tīngdǒng yí bùfen le!`,
            translation: `En sortant cet après-midi, j'ai entendu des passants discuter du sujet "${word3}", et j'ai réalisé que je pouvais en comprendre une partie !`,
            words: [
              { hanzi: '下午', pinyin: 'xiàwǔ', translation: 'après-midi' },
              { hanzi: '出门时', pinyin: 'chūmén shí', translation: 'en sortant' },
              { hanzi: '街上的人', pinyin: 'jiē shang de rén', translation: 'les gens dans la rue' },
              { hanzi: '谈论', pinyin: 'tánlùn', translation: 'discuter de' },
              { hanzi: word3, pinyin: selectedWords[2]?.pinyin || '', translation: selectedWords[2]?.translation || '', isTarget: true },
              { hanzi: '话题', pinyin: 'huàtí', translation: 'sujet' },
              { hanzi: '发现', pinyin: 'fāxiàn', translation: 'découvrir, réaliser' },
              { hanzi: '听懂', pinyin: 'tīngdǒng', translation: 'comprendre à l\'oreille' }
            ]
          },
          {
            hanzi: sentence4Hanzi,
            pinyin: `Zhǐyào měitiān rènzhēn jīlěi hé liànxí "${word4}", wǒ de zhōngwén biǎodá nénglì yídìng huì yuèláiyuè zìrán liúlì.`,
            translation: `Tant que j'accumule et pratique sérieusement chaque jour "${word4}", mon expression en chinois deviendra assurément de plus en plus fluide et naturelle.`,
            words: [
              { hanzi: '只要', pinyin: 'zhǐyào', translation: 'tant que, il suffit de' },
              { hanzi: '每天', pinyin: 'měitiān', translation: 'chaque jour' },
              { hanzi: '认真', pinyin: 'rènzhēn', translation: 'sérieusement' },
              { hanzi: '积累', pinyin: 'jīlěi', translation: 'accumuler' },
              { hanzi: '练习', pinyin: 'liànxí', translation: 's\'entraîner' },
              { hanzi: word4, pinyin: selectedWords[3]?.pinyin || '', translation: selectedWords[3]?.translation || '', isTarget: true },
              { hanzi: '表达能力', pinyin: 'biǎodá nénglì', translation: 'capacité d\'expression' },
              { hanzi: '自然流利', pinyin: 'zìrán liúlì', translation: 'naturel et fluide' }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        question: `Dans cette histoire, quel était le sentiment en entendant les gens parler dans la rue ?`,
        options: [
          'De la colère car ils parlaient trop vite',
          'La fierté et la surprise de pouvoir comprendre une partie de la conversation',
          'L\'envie d\'abandonner le chinois',
          'L\'indifférence'
        ],
        correctIndex: 1,
        explanation: 'Le texte dit : "我发现自己竟然能听懂一部分了！" (J\'ai réalisé contre toute attente que je comprenais déjà une partie !)'
      }
    ],
    discussionPrompt: {
      question: `Essaie d'utiliser le mot “${word1}” ou “${word2}” dans une courte phrase orale pour t'entraîner !`,
      questionTranslation: `Essaie de prononcer une phrase au micro contenant tes mots Anki !`,
      suggestedWords: [word1, word2]
    }
  };
};
