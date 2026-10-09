import { CurriculumModule, NuanceCard } from '../types/fluent';

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'module-1-aspects',
    order: 1,
    title: 'Module 1 : Le Temps & les Particules d’Aspect',
    subtitle: 'En finir avec la confusion du passé et de la durée',
    description: 'En chinois, les verbes ne se conjuguent pas. Tout repose sur les particules d’aspect (了, 过, 着, 在). Maîtrise la nuance entre une action achevée, une expérience de vie et une action qui continue dans le présent.',
    category: 'aspect_temps',
    cardIds: ['m1-double-le', 'm1-guo-experience', 'm1-zhe-continuation', 'm1-le-changement'],
  },
  {
    id: 'module-2-recurrence',
    order: 2,
    title: 'Module 2 : La Récurrence & la Fréquence',
    subtitle: 'Les faux-amis du "encore" et de l’habitude',
    description: 'Traduire "encore" ou "souvent" mot à mot est le piège numéro 1. Distingue rigoureusement la répétition passée (又), future (再), la persistance (还), et l’habitude (常常 vs 往往).',
    category: 'recurrence_frequence',
    cardIds: ['m2-you-vs-zai', 'm2-changchang-wangwang', 'm2-hai-persistence'],
  },
  {
    id: 'module-3-structures',
    order: 3,
    title: 'Module 3 : Les Structures Spéciales Fondamentales',
    subtitle: '把, 被, 是……的, 连……都 : la pensée chinoise native',
    description: 'Ces 4 structures changent l’ordre classique Sujet-Verbe-Objet pour manipuler un objet, exprimer un préjudice subi ou braquer le projecteur sur un détail d’un événement passé.',
    category: 'structures_speciales',
    cardIds: ['m3-ba-structure', 'm3-bei-passive', 'm3-shi-de-emphasis', 'm3-lian-dou'],
  },
  {
    id: 'module-4-complements',
    order: 4,
    title: 'Module 4 : Compléments de Résultat & de Potentiel',
    subtitle: 'Dire ce qu’on arrive ou n’arrive pas à accomplir',
    description: 'Arrête de dire "我不能看懂" ! Les compléments de résultat (完, 到, 见, 懂) et de potentiel (看得懂 / 看不懂, 买得起 / 买不起) expriment la capacité réelle avec l’élégance d’un locuteur fluide.',
    category: 'complements',
    cardIds: ['m4-kan-de-dong', 'm4-wan-hao-result', 'm4-dao-jian-perception', 'm4-mai-de-qi'],
  },
  {
    id: 'module-5-connecteurs',
    order: 5,
    title: 'Module 5 : Connecteurs Logiques & Fluidité d’Élocution',
    subtitle: 'Articuler et nuancer des pensées complexes',
    description: 'Passe de phrases isolées à un discours articulé : concessions (虽然……但是……), conditions rigoureuses (只要……就…… vs 只有……才……) et progressions dynamiques (越来越……).',
    category: 'connecteurs_fluidite',
    cardIds: ['m5-suiran-danshi', 'm5-zhiyao-vs-zhiyou', 'm5-yue-lai-yue'],
  },
];

export const NUANCE_CARDS: NuanceCard[] = [
  // ==========================================
  // MODULE 1 : LE TEMPS & PARTICULES D'ASPECT
  // ==========================================
  {
    id: 'm1-double-le',
    moduleId: 'module-1-aspects',
    moduleTitle: 'Module 1 : Le Temps & les Particules d’Aspect',
    level: 'HSK 3',
    category: 'aspect_temps',
    title: 'Le Piège du Double 了 (Action qui dure encore !)',
    structuralFormula: 'Verbe + 了 (durée accomplie) + Objet + 了 (action en cours !)',
    situationFrench: 'Explique à un ami chinois que cela fait déjà 3 ans que tu apprends le mandarin (et que tu continues activement aujourd’hui).',
    keyNuanceExplanation: 'En chinois, si tu dis "我学了三年中文" avec un seul 了, ton interlocuteur comprendra que tu as étudié pendant 3 ans dans le passé, mais que C’EST FINI aujourd’hui ! Pour signifier que l’action se poursuit au moment présent, tu dois OBLIGATOIREMENT ajouter un second 了 à la toute fin de la phrase.',
    commonTrap: 'Omettre le second 了 en pensant que le verbe suffit. Le second 了 final transforme une action révolue en une action vivante et continue.',
    culturalNote: 'C’est la tournure que les Chinois guettent pour savoir si un étranger maîtrise réellement la notion du temps ou s’il traduit simplement son passé composé.',
    targetChinese: '我已经学了三年中文了。',
    targetPinyin: 'Wǒ yǐjīng xué le sān nián zhōngwén le.',
    translationFrench: 'Cela fait déjà trois ans que j’apprends le chinois (et je continue encore).',
    rulePoints: [
      {
        pointTitle: '1. Un seul 了 = Action terminée',
        explanation: '我学了三年中文 (sans le 了 final) = "J’ai étudié le chinois pendant 3 ans (mais aujourd’hui c\'est du passé)".',
        exampleChinese: '他学了两年法语，现在不学了。',
        examplePinyin: 'Tā xué le liǎng nián fǎyǔ, xiànzài bù xué le.',
        exampleFrench: 'Il a étudié le français pendant deux ans, maintenant il a arrêté.'
      },
      {
        pointTitle: '2. Double 了 = Continuité dans le présent',
        explanation: 'Le second 了 en fin de phrase est une particule modale : il exprime un changement d\'état cumulé qui continue d\'augmenter.',
        exampleChinese: '我已经等了一个小时了！',
        examplePinyin: 'Wǒ yǐjīng děng le yí gè xiǎoshí le!',
        exampleFrench: 'J’attends déjà depuis une heure (et je continue d\'attendre) !'
      },
      {
        pointTitle: '3. Ordre syntaxique de la durée',
        explanation: 'Verbe + 了 + Durée + (+ de) + Objet + 了 : la durée se place immédiatement après le premier verbe.',
        exampleChinese: '他睡了八个小时觉了。',
        examplePinyin: 'Tā shuì le bā gè xiǎoshí jiào le.',
        exampleFrench: 'Il dort depuis 8 heures d\'affilée.'
      }
    ],
    additionalExamples: [
      {
        chinese: '我在这家公司工作了五年了。',
        pinyin: 'Wǒ zài zhè jiā gōngsī gōngzuò le wǔ nián le.',
        translation: 'Je travaille dans cette entreprise depuis cinq ans (j\'y suis toujours).',
        contextNote: 'Vie professionnelle'
      },
      {
        chinese: '雨已经下了整整一天了。',
        pinyin: 'Yǔ yǐjīng xià le zhěngzhěng yì tiān le.',
        translation: 'Il pleut déjà depuis une journée entière.',
        contextNote: 'Météo & quotidien'
      },
      {
        chinese: '你看手机看了两个小时了，该休息一下了！',
        pinyin: 'Nǐ kàn shǒujī kàn le liǎng gè xiǎoshí le, gāi xiūxi yíxià le!',
        translation: 'Cela fait deux heures que tu es sur ton téléphone, fais une pause !',
        contextNote: 'Conseil bienveillant'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你的中文真流利，你学了多长时间了？',
        pinyin: 'Nǐ de zhōngwén zhēn liúlì, nǐ xué le duō cháng shíjiān le?',
        translation: 'Ton chinois est vraiment fluide, tu l’apprends depuis combien de temps ?'
      },
      {
        speaker: 'B',
        chinese: '我已经学了三年中文了，每天都还在坚持复习。',
        pinyin: 'Wǒ yǐjīng xué le sān nián zhōngwén le, měitiān dōu hái zài jiānchí fùxí.',
        translation: 'Cela fait déjà trois ans que j’apprends le chinois, et je continue de réviser chaque jour.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "J’attends ici depuis une demi-heure (et j’attends toujours)"',
      tokens: ['我', '在', '这里', '等', '了', '半个小时', '了'],
      correctTokens: ['我', '在', '这里', '等', '了', '半个小时', '了'],
      explanation: 'Ordre : Sujet (我) + Lieu (在这里) + Verbe + 了1 (等了) + Durée (半个小时) + 了2 de continuité finale.'
    },
    activeTest: {
      promptFrench: 'Comment exprimer : "J’habite à Pékin depuis deux mois (et j’y habite toujours)" ?',
      sentenceWithBlank: '我在北京住了两个月_____。',
      options: ['了', '过', '着', '在'],
      correctIndex: 0,
      placement: {
        word: '了',
        segments: ["我","在北京","住了两个月"],
        correctGap: 3,
        punctuation: '。'
      },
      explanation: 'Le premier 了 après 住 indique la durée de 2 mois écoulée. Le second 了 final indique que tu résides toujours à Pékin actuellement.',
      distractorExplanations: [
        'Correct ! C’est la formule du double 了.',
        'Faux : 过 signifierait que tu as vécu à Pékin par le passé mais que tu es parti.',
        'Faux : 着 exprime un état statique, pas une durée d’accomplissement cumulée.',
        'Faux : 在 ne se place jamais en fin de proposition pour marquer la continuité temporelle.'
      ]
    }
  },
  {
    id: 'm1-guo-experience',
    moduleId: 'module-1-aspects',
    moduleTitle: 'Module 1 : Le Temps & les Particules d’Aspect',
    level: 'HSK 3',
    category: 'aspect_temps',
    title: 'L’Expérience Vécue avec 从来没有...过',
    structuralFormula: 'Sujet + 从来没有 + Verbe + 过 + Lieu / Objet (Jamais de ma vie)',
    situationFrench: 'Dis que tu n’es encore jamais allé à Shanghai de ta vie, mais que tu as fermement l’intention d’y aller l’année prochaine.',
    keyNuanceExplanation: 'Pour exprimer qu’une action n’a JAMAIS fait partie de ton expérience de vie jusqu’à présent, on combine l’adverbe d’absolu 从来 (cónglái = depuis toujours), la négation 没有 et la particule d’aspect 过 (guò) après le verbe. Ne confonds jamais avec 不 + verbe !',
    commonTrap: 'Dire "我不去上海" qui signifie "je refuse d’aller à Shanghai" au lieu d’exprimer l’absence d’expérience passée.',
    culturalNote: 'Les Chinois utilisent très souvent "没有...过" lors des premières présentations pour parler des voyages, des plats goûtés ou des films vus.',
    targetChinese: '我从来没有去过上海，但我打算明年去。',
    targetPinyin: 'Wǒ cónglái méiyǒu qùguo Shànghǎi, dàn wǒ dǎsuan míngnián qù.',
    translationFrench: 'Je ne suis jamais allé à Shanghai, mais j’ai l’intention d’y aller l’année prochaine.',
    rulePoints: [
      {
        pointTitle: '1. 过 (guò) = L’empreinte de l’expérience',
        explanation: '过 marque qu’une action a été vécue au moins une fois dans le passé et qu’elle est terminée. "我去过" = "J’y suis déjà allé (j’en ai l’expérience)".',
        exampleChinese: '你吃过北京烤鸭吗？',
        examplePinyin: 'Nǐ chī guò Běijīng kǎoyā ma?',
        exampleFrench: 'As-tu déjà mangé du canard laqué de Pékin ?'
      },
      {
        pointTitle: '2. Négation obligatoire avec 没有...过',
        explanation: 'On ne dit JAMAIS 不 + Verbe + 过. La négation de l\'expérience est exclusivement 没有 + Verbe + 过.',
        exampleChinese: '我没看过这部电影。',
        examplePinyin: 'Wǒ méi kàn guò zhè bù diànyǐng.',
        exampleFrench: 'Je n’ai jamais vu ce film.'
      },
      {
        pointTitle: '3. 从来 = "Depuis toujours / De toute ma vie"',
        explanation: 'Ajouter 从来 (cónglái) renforce l\'absolu : "de toute mon existence jusqu’à ce jour".',
        exampleChinese: '他从来没喝过中国茶。',
        examplePinyin: 'Tā cónglái méi hē guò zhōngguó chá.',
        exampleFrench: 'Il n\'a jamais bu de thé chinois de sa vie.'
      }
    ],
    additionalExamples: [
      {
        chinese: '我从来没有坐过高铁，听说速度非常快。',
        pinyin: 'Wǒ cónglái méiyǒu zuò guò gāotiě, tīngshuō sùdù fēicháng kuài.',
        translation: 'Je n’ai encore jamais pris le TGV, j’ai entendu dire qu’il allait très vite.',
        contextNote: 'Voyage & découverte'
      },
      {
        chinese: '他从来没有对朋友发过脾气。',
        pinyin: 'Tā cónglái méiyǒu duì péngyou fā guò píqì.',
        translation: 'Il ne s’est jamais emporté contre un ami de sa vie.',
        contextNote: 'Personnalité & tempérament'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '这个周末我们去吃四川火锅怎么样？',
        pinyin: 'Zhè gè zhōumò wǒmen qù chī Sìchuān huǒguō zěnmeyàng?',
        translation: 'Que dirais-tu d’aller manger une fondue du Sichuan ce week-end ?'
      },
      {
        speaker: 'B',
        chinese: '太好了！我从来没有吃过真正的麻辣火锅。',
        pinyin: 'Tài hǎo le! Wǒ cónglái méiyǒu chī guò zhēnzhèng de málà huǒguō.',
        translation: 'Génial ! Je n’ai encore jamais goûté de vraie fondue épicée de ma vie.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Je n’ai jamais vu une chose pareille de ma vie"',
      tokens: ['我', '从来', '没有', '见过', '这样的', '事'],
      correctTokens: ['我', '从来', '没有', '见过', '这样的', '事'],
      explanation: 'Sujet (我) + Adverbe (从来) + Négation (没有) + Verbe + 过 (见过) + Objet (这样的事).'
    },
    activeTest: {
      promptFrench: 'Un collègue te demande si tu as déjà goûté le canard laqué. Tu veux répondre : "Je n’en ai jamais mangé de ma vie".',
      sentenceWithBlank: '我从来没有吃_____北京烤鸭。',
      options: ['了', '过', '在', '完'],
      correctIndex: 1,
      placement: {
        word: '过',
        segments: ["我","从来没有","吃","北京烤鸭"],
        correctGap: 3,
        punctuation: '。'
      },
      explanation: '过 (guò) est la particule d’aspect dédiée à l’expérience vécue ("avoir déjà fait"). Associée à 没有, elle exprime "n’avoir jamais fait".',
      distractorExplanations: [
        'Faux : 没有...了 est grammaticalement contradictoire pour exprimer une expérience.',
        'Correct ! 没有...过 est le réflexe incontournable de l’expérience.',
        'Faux : 在 indique une action en cours de déroulement présent.',
        'Faux : 完 indique l’achèvement d’une portion, pas l’expérience globale dans sa vie.'
      ]
    }
  },
  {
    id: 'm1-zhe-continuation',
    moduleId: 'module-1-aspects',
    moduleTitle: 'Module 1 : Le Temps & les Particules d’Aspect',
    level: 'HSK 3',
    category: 'aspect_temps',
    title: 'L’État Résultant Continu avec 着 (Zhe)',
    structuralFormula: 'Verbe 1 + 着 + (Objet) + Verbe 2 (Action d’accompagnement / Posture)',
    situationFrench: 'Décris l’ambiance d’une salle de réunion où la porte est restée ouverte et où le responsable parle avec le sourire.',
    keyNuanceExplanation: '着 (zhe) ne décrit pas une action dynamique en cours (qui utilise 在), mais un ÉTAT RÉSULTANT qui dure de manière statique. Par exemple, "门开" = la porte s’ouvre, mais "门开着" = la porte demeure ouverte. On l’utilise aussi pour deux actions simultanées : 笑 (sourire) + 着 + 说 (parler) = parler en souriant.',
    commonTrap: 'Confondre 在 (action active : je suis en train d’ouvrir la porte) et 着 (état statique : la porte est déjà ouverte et le reste).',
    culturalNote: 'Les descriptions de scènes de vie en chinois utilisent systématiquement 着 pour poser le décor (table garnie de plats, fenêtre ouverte, gens assis).',
    targetChinese: '门开着，老师正笑着看着大家。',
    targetPinyin: 'Mén kāi zhe, lǎoshī zhèng xiào zhe kàn zhe dàjiā.',
    translationFrench: 'La porte est ouverte, le professeur regarde tout le monde en souriant.',
    rulePoints: [
      {
        pointTitle: '1. Posture et décor statique',
        explanation: 'Porte ouverte (开着), lumières allumées (亮着), veste portée (穿着) : l\'action initiale est finie, seul l\'état perdure.',
        exampleChinese: '墙上挂着一张中国地图。',
        examplePinyin: 'Qiáng shang guà zhe yì zhāng zhōngguó dìtú.',
        exampleFrench: 'Une carte de la Chine est suspendue au mur.'
      },
      {
        pointTitle: '2. Manière d\'effectuer une seconde action (V1 + 着 + V2)',
        explanation: 'Le Verbe 1 indique la posture ou l\'attitude qui accompagne le Verbe 2 principal.',
        exampleChinese: '大家站着聊天。',
        examplePinyin: 'Dàjiā zhàn zhe liáotiān.',
        exampleFrench: 'Tout le monde discute debout.'
      }
    ],
    additionalExamples: [
      {
        chinese: '桌子上放着一杯热茶。',
        pinyin: 'Zhuōzi shang fàng zhe yì bēi rè chá.',
        translation: 'Une tasse de thé chaud est posée sur la table.',
        contextNote: 'Description de décor'
      },
      {
        chinese: '他常常躺在沙发上看书。',
        pinyin: 'Tā chángcháng tǎng zài shāfā shang kànshū.',
        translation: 'Il lit souvent en étant allongé sur le canapé.',
        contextNote: 'Posture de confort'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你看，小李正拿着一杯咖啡向我们走过来呢。',
        pinyin: 'Nǐ kàn, Xiǎo Lǐ zhèng ná zhe yì bēi kāfēi xiàng wǒmen zǒu guòlai ne.',
        translation: 'Regarde, Xiao Li s’avance vers nous en tenant une tasse de café.'
      },
      {
        speaker: 'B',
        chinese: '他总是笑着跟每个人打招呼。',
        pinyin: 'Tā zǒngshì xiào zhe gēn měi gè rén dǎ zhāohu.',
        translation: 'Il salue toujours tout le monde avec le sourire.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Il m’a répondu en souriant"',
      tokens: ['他', '微笑着', '对', '我', '说', '了', '一句话'],
      correctTokens: ['他', '微笑着', '对', '我', '说', '了', '一句话'],
      explanation: 'Sujet (他) + Manière (微笑着) + Complément d\'adresse (对我) + Verbe principal (说了) + Objet (一句话).'
    },
    activeTest: {
      promptFrench: 'Complète pour dire : "Il écoute de la musique en étant allongé sur le lit" : 他在床上躺_____听音乐。',
      sentenceWithBlank: '他在床上躺_____听音乐。',
      options: ['着', '了', '过', '在'],
      correctIndex: 0,
      placement: {
        word: '着',
        segments: ["他","在床上","躺","听音乐"],
        correctGap: 3,
        punctuation: '。'
      },
      explanation: '躺着 (tǎng zhe) décrit la posture allongée continue dans laquelle s’exécute la seconde action (écouter de la musique).',
      distractorExplanations: [
        'Bravo ! Verbe 1 + 着 indique la posture de fond.',
        'Faux : 了 romprait la simultanéité des deux actions.',
        'Faux : 过 signifierait qu’il s’est déjà allongé dans le passé.',
        'Faux : 在床上躺在 est redondant et incorrect.'
      ]
    }
  },
  {
    id: 'm1-le-changement',
    moduleId: 'module-1-aspects',
    moduleTitle: 'Module 1 : Le Temps & les Particules d’Aspect',
    level: 'HSK 3',
    category: 'aspect_temps',
    title: 'Le 了 Modal de Changement d’État (Désormais / Nouvelle Réalité)',
    structuralFormula: 'Nouvel état de fait + 了 (Rupture avec la situation antérieure)',
    situationFrench: 'L’automne est arrivé, les températures ont chuté. Tu dis à ton colocataire que tu n’as désormais plus besoin de climatisation.',
    keyNuanceExplanation: 'Le 了 modal en fin de phrase n’indique pas qu’une action est finie, mais qu’une NOUVELLE SITUATION apparaît ! "下雨" = il pleut, mais "下雨了" = tiens, il se met à pleuvoir (ce n’était pas le cas il y a 5 minutes). De même, "不用了" = ce n’est plus nécessaire désormais.',
    commonTrap: 'Penser que 了 signifie toujours "passé". "我走了" signifie "j’y vais / je pars maintenant", marquant le changement vers le départ.',
    culturalNote: 'C’est la particule la plus vivante du mandarin oral. Elle traduit l’étonnement, le changement de météo ou la prise de décision immédiate.',
    targetChinese: '天气变冷了，我已经不用开空调了。',
    targetPinyin: 'Tiānqì biàn lěng le, wǒ yǐjīng bú yòng kāi kōngtiáo le.',
    translationFrench: 'Le temps est devenu froid, je n’ai désormais plus besoin d’allumer la climatisation.',
    rulePoints: [
      {
        pointTitle: '1. Changement d\'état = Nouvelle réalité',
        explanation: 'Ajouté en fin de phrase, 了 marque une rupture avec l\'état antérieur : "ce n\'était pas le cas avant, mais c\'est vrai à présent".',
        exampleChinese: '春天来了，花开了。',
        examplePinyin: 'Chūntiān lái le, huā kāi le.',
        exampleFrench: 'Le printemps est arrivé, les fleurs s’ouvrent.'
      },
      {
        pointTitle: '2. "Ne plus faire" avec 不...了',
        explanation: '不 + Verbe + 了 signifie "ne plus" (cessation d\'une habitude ou d\'un état).',
        exampleChinese: '我不喝咖啡了，改喝茶了。',
        examplePinyin: 'Wǒ bù hē kāfēi le, gǎi hē chá le.',
        exampleFrench: 'Je ne bois plus de café, je suis passé au thé.'
      }
    ],
    additionalExamples: [
      {
        chinese: '太晚了，我得回家了。',
        pinyin: 'Tài wǎn le, wǒ děi huíjiā le.',
        translation: 'Il est trop tard, il faut que je rentre chez moi désormais.',
        contextNote: 'Départ en soirée'
      },
      {
        chinese: '我懂了！原来这个语法这么简单。',
        pinyin: 'Wǒ dǒng le! Yuánlái zhè gè yǔfǎ zhème jiǎndān.',
        translation: 'J\'ai compris ! Finalement cette règle est tellement simple.',
        contextNote: 'Déclic de compréhension'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你还头疼吗？要不要吃点药？',
        pinyin: 'Nǐ hái tóuténg ma? Yào bu yào chī diǎn yào?',
        translation: 'Tu as encore mal à la tête ? Tu veux un médicament ?'
      },
      {
        speaker: 'B',
        chinese: '不用了，休息了一会儿，我已经好多了。',
        pinyin: 'Bú yòng le, xiūxi le yíhuìr, wǒ yǐjīng hǎo duō le.',
        translation: 'Ce n’est plus nécessaire, je me suis reposé un peu, ça va beaucoup mieux désormais.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Il commence à pleuvoir, nous devons rentrer"',
      tokens: ['下雨了', '，', '我们', '该', '回去了'],
      correctTokens: ['下雨了', '，', '我们', '该', '回去了'],
      explanation: 'Changement météo (下雨了) + Sujet (我们) + Nécessité (该) + Verbe de départ avec 了 modal (回去了).'
    },
    activeTest: {
      promptFrench: 'Comment exprimer : "Je n’ai plus faim maintenant (la faim a disparu)" ?',
      sentenceWithBlank: '我不饿_____。',
      options: ['了', '过', '在', '着'],
      correctIndex: 0,
      placement: {
        word: '了',
        segments: ["我","不","饿"],
        correctGap: 3,
        punctuation: '。'
      },
      explanation: '不饿了 (bù è le) signifie "je n’ai plus faim" : le 了 final marque le changement vers la satiété.',
      distractorExplanations: [
        'Parfait ! 不 + adjectif + 了 = "ne plus être".',
        'Faux : 过 marquerait une expérience passée absurde ici.',
        'Faux : 在 exprime une action continue.',
        'Faux : 着 exprimerait un état statique sans rupture.'
      ]
    }
  },

  // ==========================================
  // MODULE 2 : RÉCURRENCE & FRÉQUENCE
  // ==========================================
  {
    id: 'm2-you-vs-zai',
    moduleId: 'module-2-recurrence',
    moduleTitle: 'Module 2 : La Récurrence & la Fréquence',
    level: 'HSK 3',
    category: 'recurrence_frequence',
    title: '又 (Yòu) vs 再 (Zài) : Répétition Passée vs Future',
    structuralFormula: 'Répétition déjà arrivée -> 又 + Verbe | Répétition à venir -> 再 + Verbe',
    situationFrench: 'Ton ami est encore arrivé en retard hier (reproche passé), mais tu lui demandes de ne plus recommencer demain.',
    keyNuanceExplanation: 'En français, "encore" sert à tout. En chinois, c’est rigoureusement scindé : si l’action s’est DÉJÀ répétée (dans le passé ou le présent constaté), utilise 又 (yòu). Si la répétition est ENVISAGÉE DANS LE FUTUR ("fais-le encore une fois"), utilise 再 (zài).',
    commonTrap: 'Dire "你明天又来" pour inviter quelqu’un à revenir demain. C’est 再 qu’il faut employer impérativement dans le futur !',
    culturalNote: 'Utiliser 又 pour le passé véhicule souvent une teinte d’agacement ou de fatalité ("encore lui !", "il a encore oublié").',
    targetChinese: '你怎么又迟到了？希望你明天别再迟到了。',
    targetPinyin: 'Nǐ zěnme yòu chídào le? Xīwàng nǐ míngtiān bié zài chídào le.',
    translationFrench: 'Comment se fait-il que tu sois encore en retard ? J’espère que tu ne le seras plus demain.',
    rulePoints: [
      {
        pointTitle: '1. 又 (yòu) = Répétition constatée / passée',
        explanation: 'S\'utilise quand une action a recommencé de manière effective : "昨天他又来了" (Hier il est encore venu).',
        exampleChinese: '他又买了一双新鞋。',
        examplePinyin: 'Tā yòu mǎi le yì shuāng xīn xié.',
        exampleFrench: 'Il s’est encore acheté une nouvelle paire de chaussures.'
      },
      {
        pointTitle: '2. 再 (zài) = Répétition future / projetée',
        explanation: 'S\'utilise pour demander ou planifier de répéter : "再见" (au revoir = se revoir plus tard), "请再说一次" (répète encore une fois s\'il te plaît).',
        exampleChinese: '明天我们再讨论这个问题。',
        examplePinyin: 'Míngtiān wǒmen zài tǎolùn zhè gè wèntí.',
        exampleFrench: 'Demain nous rediscuterons de cette question.'
      }
    ],
    additionalExamples: [
      {
        chinese: '今天又下雨了，真让人烦恼。',
        pinyin: 'Jīntiān yòu xià yǔ le, zhēn ràng rén fánnǎo.',
        translation: 'Il pleut encore aujourd’hui, c’est vraiment pénible.',
        contextNote: 'Agacement quotidien'
      },
      {
        chinese: '如果你没听懂，我可以再讲一遍。',
        pinyin: 'Rúguǒ nǐ méi tīngdǒng, wǒ kěyǐ zài jiǎng yí biàn.',
        translation: 'Si tu n’as pas compris, je peux réexpliquer encore une fois.',
        contextNote: 'Patience & enseignement'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你怎么又点外卖了？不是说要自己做饭吗？',
        pinyin: 'Nǐ zěnme yòu diǎn wàimài le? Bú shì shuō yào zìjǐ zuòfàn ma?',
        translation: 'Comment ça se fait que tu aies encore commandé à emporter ? Tu n’avais pas dit que tu cuisinerais ?'
      },
      {
        speaker: 'B',
        chinese: '今天太忙了，明天我再自己做吧！',
        pinyin: 'Jīntiān tài máng le, míngtiān wǒ zài zìjǐ zuò ba!',
        translation: 'J’étais trop pris aujourd’hui, demain je cuisinerai moi-même !'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "S\'il te plaît, bois encore un verre d\'eau"',
      tokens: ['请你', '再', '喝', '一杯', '水'],
      correctTokens: ['请你', '再', '喝', '一杯', '水'],
      explanation: 'Action future et invitation : emploi impératif de 再 (zài) devant le verbe (喝).'
    },
    activeTest: {
      promptFrench: 'Tu demandes poliment au serveur : "Pouvez-vous m’apporter encore un bol de riz s’il vous plaît ?"',
      sentenceWithBlank: '请给我_____来一碗米饭。',
      options: ['再', '又', '还', '过'],
      correctIndex: 0,
      placement: {
        word: '再',
        segments: ["请","给我","来","一碗米饭"],
        correctGap: 2,
        punctuation: '。'
      },
      explanation: 'Tu demandes une action future : "再 + Verbe" est le seul choix pour projeter une répétition à venir.',
      distractorExplanations: [
        'Bravo ! 再 projette l’action dans le futur immédiat.',
        'Faux : 又 exprimerait que le serveur a déjà apporté le bol dans le passé.',
        'Faux : 还 ne s’associe pas ainsi pour commander un plat supplémentaire au serveur.',
        'Faux : 过 exprime l’expérience passée.'
      ]
    }
  },
  {
    id: 'm2-changchang-wangwang',
    moduleId: 'module-2-recurrence',
    moduleTitle: 'Module 2 : La Récurrence & la Fréquence',
    level: 'HSK 4',
    category: 'recurrence_frequence',
    title: '常常 (Chángcháng) vs 往往 (Wǎngwǎng) : Habitude vs Règle Logique',
    structuralFormula: 'Habitude perso -> 常常 | Condition + Règle constante -> 往往',
    situationFrench: 'Explique qu’en temps normal tu sors souvent le week-end, mais que quand le travail est stressant, tu dors généralement mal.',
    keyNuanceExplanation: '常常 (chángcháng) exprime simplement la haute fréquence d’une habitude personnelle modifiable. 往往 (wǎngwǎng) s’utilise quand il y a une CONDITION PRÉALABLE et qu’un résultat se produit régulièrement en conséquence d’une loi naturelle ou psychologique.',
    commonTrap: 'Utiliser 常常 pour énoncer des constats généraux ou des lois récurrentes régies par une condition.',
    culturalNote: 'L’emploi maîtrisé de 往往 est l’une des plus grandes preuves de maturité linguistique au niveau HSK 4-5.',
    targetChinese: '周末我常常看电影，但工作忙的时候往往睡不好。',
    targetPinyin: 'Zhōumò wǒ chángcháng kàn diànyǐng, dàn gōngzuò máng de shíhou wǎngwǎng shuì bu hǎo.',
    translationFrench: 'Le week-end je regarde souvent des films, mais quand le travail est dense, j’ai tendance à mal dormir.',
    rulePoints: [
      {
        pointTitle: '1. 常常 = Habitude personnelle pure',
        explanation: 'Action qu\'une personne choisit de faire fréquemment : "我常常去图书馆" (Je vais souvent à la bibliothèque).',
        exampleChinese: '他平时常常跑步。',
        examplePinyin: 'Tā píngshí chángcháng pǎobù.',
        exampleFrench: 'D\'ordinaire il court souvent.'
      },
      {
        pointTitle: '2. 往往 = Conséquence régulière d\'une condition',
        explanation: 'Exige un contexte ou une condition : "Sous condition X, la conséquence Y a tendance à se produire naturellement".',
        exampleChinese: '天气不好的时候，路上的车往往开得很慢。',
        examplePinyin: 'Tiānqì bù hǎo de shíhou, lù shang de chē wǎngwǎng kāi de hěn màn.',
        exampleFrench: 'Quand le temps est mauvais, les voitures roulent généralement très lentement.'
      }
    ],
    additionalExamples: [
      {
        chinese: '缺乏睡眠的人，白天往往注意力不集中。',
        pinyin: 'Quēfá shuìmián de rén, báitiān wǎngwǎng zhùyìlì bù jízhōng.',
        translation: 'Les personnes qui manquent de sommeil ont généralement du mal à se concentrer en journée.',
        contextNote: 'Loi biologique & santé'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你平时周末都做些什么？',
        pinyin: 'Nǐ píngshí zhōumò dōu zuò xiē shénme?',
        translation: 'Que fais-tu d’habitude le week-end ?'
      },
      {
        speaker: 'B',
        chinese: '我常常在家做饭，但如果天气好，往往会和朋友出门爬山。',
        pinyin: 'Wǒ chángcháng zài jiā zuòfàn, dàn rúguǒ tiānqì hǎo, wǎngwǎng huì hé péngyou chūmén páshān.',
        translation: 'Je cuisine souvent chez moi, mais s’il fait beau, j’ai tendance à sortir randonner avec des amis.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Les personnes qui ne font pas de sport ont souvent tendance à tomber malades"',
      tokens: ['不爱运动的人', '往往', '更', '容易', '生病'],
      correctTokens: ['不爱运动的人', '往往', '更', '容易', '生病'],
      explanation: 'Condition (不爱运动的人) + Règle de conséquence logique (往往) + Degré (更) + Résultat (容易生病).'
    },
    activeTest: {
      promptFrench: 'Complète : "Les personnes qui ne font pas de sport ont souvent/tendance à tomber malades" : 不爱运动的人_____容易生病。',
      sentenceWithBlank: '不爱运动的人_____容易生病。',
      options: ['往往', '常常', '再', '又'],
      correctIndex: 0,
      placement: {
        word: '往往',
        segments: ["不爱运动的人","容易","生病"],
        correctGap: 1,
        punctuation: '。'
      },
      explanation: 'Il s’agit d’une loi de conséquence logique générale conditionnée par le manque de sport : 往往 est le choix rigoureux.',
      distractorExplanations: [
        'Excellent ! 往往 relie la condition au résultat récurrent.',
        'Imparfait : 常常 décrirait une habitude d’action délibérée, pas une tendance consécutive.',
        'Faux : 再 indique une réitération future.',
        'Faux : 又 marque une répétition passée spécifique.'
      ]
    }
  },
  {
    id: 'm2-hai-persistence',
    moduleId: 'module-2-recurrence',
    moduleTitle: 'Module 2 : La Récurrence & la Fréquence',
    level: 'HSK 3',
    category: 'recurrence_frequence',
    title: 'La Persistance Ininterrompue avec 还 (Hái)',
    structuralFormula: 'Sujet + 都……了，怎么 + 还 + Verbe ? (Action qui n’aurait pas dû durer)',
    situationFrench: 'Il est 23h passées, tu vois ton collègue toujours sur son écran. Exprime ton étonnement face à cette persistance.',
    keyNuanceExplanation: '还 (hái) indique que l’action commencée antérieurement CONTINUE SANS INTERRUPTION au moment où l’on parle ("toujours / encore"). Il s’oppose à 又 (qui implique une interruption puis un recommencement). On l’associe souvent à "都……了" pour souligner le décalage.',
    commonTrap: 'Mettre 又 pour dire "tu travailles encore" quand la personne n’a jamais cessé de travailler de la soirée.',
    culturalNote: 'Associé à "都……了" (il est déjà...), "怎么还..." marque une sollicitude bienveillante très fréquente en Chine.',
    targetChinese: '都已经晚上十一点了，你怎么还在工作？',
    targetPinyin: 'Dōu yǐjīng wǎnshang shíyī diǎn le, nǐ zěnme hái zài gōngzuò?',
    translationFrench: 'Il est déjà 23h, comment se fait-il que tu sois encore en train de travailler ?',
    rulePoints: [
      {
        pointTitle: '1. 还 = Continuité ininterrompue',
        explanation: 'L\'action a débuté dans le passé et n\'a jamais cessé : "他还在睡觉" = Il dort toujours.',
        exampleChinese: '外面还在下雨。',
        examplePinyin: 'Wàimiàn hái zài xiàyǔ.',
        exampleFrench: 'Il pleut toujours dehors.'
      },
      {
        pointTitle: '2. 都...了...还 = Incongruité temporelle',
        explanation: 'Marque l\'étonnement face à une action qui perdure anormalement.',
        exampleChinese: '都十二点了，你还不睡？',
        examplePinyin: 'Dōu shí\'èr diǎn le, nǐ hái bú shuì?',
        exampleFrench: 'Il est déjà minuit, et tu ne dors toujours pas ?'
      }
    ],
    additionalExamples: [
      {
        chinese: '三年过去了，他还在那家大学当老师。',
        pinyin: 'Sān nián guòqù le, tā hái zài nà jiā dàxué dāng lǎoshī.',
        translation: 'Trois ans ont passé, il est toujours professeur dans cette université.',
        contextNote: 'Persistance de statut'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你怎么还没吃晚饭？快去吃点吧！',
        pinyin: 'Nǐ zěnme hái méi chī wǎnfàn? Kuài qù chī diǎn ba!',
        translation: 'Comment ça se fait que tu n’aies pas encore dîné ? Va vite manger quelque chose !'
      },
      {
        speaker: 'B',
        chinese: '手头还有一份报告要写完，马上就去。',
        pinyin: 'Shǒutóu hái yǒu yí fèn bàogào yào xiě wán, mǎshàng jiù qù.',
        translation: 'J’ai encore un rapport à terminer sous la main, j’y vais tout de suite.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Il est déjà si tard, comment se fait-il qu’il lise encore ?"',
      tokens: ['都这么晚了', '，', '他', '怎么', '还在', '看书', '？'],
      correctTokens: ['都这么晚了', '，', '他', '怎么', '还在', '看书', '？'],
      explanation: 'Formule d’étonnement : Contexte (都这么晚了) + Sujet (他) + Question (怎么) + Persistance (还在) + Verbe (看书).'
    },
    activeTest: {
      promptFrench: 'Tu demandes à un ami s’il habite toujours à la même adresse : "Tu habites encore là-bas ?"',
      sentenceWithBlank: '你_____住在那里吗？',
      options: ['还', '又', '再', '过'],
      correctIndex: 0,
      placement: {
        word: '还',
        segments: ["你","住在","那里"],
        correctGap: 1,
        punctuation: '吗？'
      },
      explanation: 'L’état de résidence n’a pas été interrompu : 还 (hái) traduit "toujours / encore sans rupture".',
      distractorExplanations: [
        'Correct ! 还 marque la continuité ininterrompue.',
        'Faux : 又 signifierait qu’il a déménagé puis ré-emménagé là-bas.',
        'Faux : 再 projette une action nouvelle future.',
        'Faux : 过 marquerait une expérience passée révolue.'
      ]
    }
  },

  // ==========================================
  // MODULE 3 : LES STRUCTURES SPÉCIALES
  // ==========================================
  {
    id: 'm3-ba-structure',
    moduleId: 'module-3-structures',
    moduleTitle: 'Module 3 : Les Structures Spéciales Fondamentales',
    level: 'HSK 3',
    category: 'structures_speciales',
    title: 'La Structure 把 (Bǎ) : Manipuler, Déplacer ou Transformer',
    structuralFormula: 'Sujet + 把 + Objet Défini + Verbe + Résultat / Lieu',
    situationFrench: 'Tu quittes le bureau le soir. Tu demandes gentiment à ton collègue d’éteindre la climatisation.',
    keyNuanceExplanation: 'En chinois, dès qu’une action a pour effet de DÉPLACER, FERMER, MANGER ou TRANSFORMER un objet bien défini, la structure 把 est quasi-obligatoire. L’objet passe devant le verbe pour montrer qu’il subit l’action jusqu’à son résultat (关上).',
    commonTrap: 'Laisser un verbe "nu" après 把 : "把空调关" est faux. Il faut obligatoirement un complément de résultat (关上, 关好, 关了).',
    culturalNote: 'Parler sans 把 fait souvent "chinois traduit de l’anglais". L’adopter fluidifie instantanément ton statut auprès des locuteurs.',
    targetChinese: '请你在离开办公室前把空调关上。',
    targetPinyin: 'Qǐng nǐ zài líkāi bàngōngshì qián bǎ kōngtiáo guānshang.',
    translationFrench: 'S’il te plaît, éteins la climatisation avant de quitter le bureau.',
    rulePoints: [
      {
        pointTitle: '1. L\'objet doit être spécifique et connu',
        explanation: 'On ne peut pas utiliser 把 avec "un livre quelconque". L\'objet est précis ("ce livre", "la climatisation", "ton devoir").',
        exampleChinese: '请把这本书拿走。',
        examplePinyin: 'Qǐng bǎ zhè běn shū ná zǒu.',
        exampleFrench: 'Prends ce livre s\'il te plaît.'
      },
      {
        pointTitle: '2. Le verbe ne doit JAMAIS rester nu',
        explanation: 'Le verbe DOIT être suivi d\'un complément de résultat, de direction ou d\'un 了 : 放在, 关上, 喝完, 洗干净.',
        exampleChinese: '我已经把作业做完了。',
        examplePinyin: 'Wǒ yǐjīng bǎ zuòyè zuò wán le.',
        exampleFrench: 'J’ai déjà fini de faire mes devoirs.'
      },
      {
        pointTitle: '3. Les verbes interdits avec 把',
        explanation: 'Les verbes de perception et sentiments (喜欢, 觉得, 看, 听, 知道) ne manipulent aucun objet physique et ne peuvent JAMAIS s\'employer avec 把.',
        exampleChinese: '我喜欢这本书 (JAMAIS : 我把这本书喜欢).',
        examplePinyin: 'Wǒ xǐhuan zhè běn shū.',
        exampleFrench: 'J’aime ce livre.'
      }
    ],
    additionalExamples: [
      {
        chinese: '他把喝完的咖啡杯扔进了垃圾桶。',
        pinyin: 'Tā bǎ hē wán de kāfēibēi rēng jìn le lājītǒng.',
        translation: 'Il a jeté sa tasse de café vide dans la poubelle.',
        contextNote: 'Déplacement physique'
      },
      {
        chinese: '快把你的外套穿上，外面风很大！',
        pinyin: 'Kuài bǎ nǐ de wàitào chuān shang, wàimiàn fēng hěn dà!',
        translation: 'Mets vite ton manteau, il y a beaucoup de vent dehors !',
        contextNote: 'Conseil & quotidien'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '服务员，请把桌子收拾一下。',
        pinyin: 'Fúwùyuán, qǐng bǎ zhuōzi shōushi yíxià.',
        translation: 'Serveur, pourriez-vous débarrasser et nettoyer la table s’il vous plaît ?'
      },
      {
        speaker: 'B',
        chinese: '好的先生，我马上把菜单给您拿过来。',
        pinyin: 'Hǎo de xiānsheng, wǒ mǎshàng bǎ càidān gěi nín ná guòlai.',
        translation: 'Très bien monsieur, je vous apporte la carte immédiatement.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "S\'il te plaît, mets les clés sur la table"',
      tokens: ['请', '把', '钥匙', '放在', '桌子上'],
      correctTokens: ['请', '把', '钥匙', '放在', '桌子上'],
      explanation: 'Structure 把 : Politesse (请) + 把 + Objet manipulé (钥匙) + Verbe composé avec lieu (放在桌子上).'
    },
    activeTest: {
      promptFrench: 'Comment dire : "Mets ce livre sur la table" ?',
      sentenceWithBlank: '请你_____这本书放在桌子上。',
      options: ['把', '被', '让', '在'],
      correctIndex: 0,
      placement: {
        word: '把',
        segments: ["请你","这本书","放在","桌子上"],
        correctGap: 1,
        punctuation: '。'
      },
      explanation: 'Le livre est l’objet manipulé et déplacé vers un lieu précis (放在桌子上) : la structure 把 s’impose.',
      distractorExplanations: [
        'Bravo ! 把 précède l’objet manipulé.',
        'Faux : 被 est la structure passive (le livre subirait l’action).',
        'Faux : 让 signifie faire faire ou laisser.',
        'Faux : 在 ne peut pas introduire l’objet direct avant le verbe.'
      ]
    }
  },
  {
    id: 'm3-bei-passive',
    moduleId: 'module-3-structures',
    moduleTitle: 'Module 3 : Les Structures Spéciales Fondamentales',
    level: 'HSK 4',
    category: 'structures_speciales',
    title: 'La Structure Passive 被 (Bèi) : Subir un Dommage ou une Surprise',
    structuralFormula: 'Victime + 被 + (Auteur) + Verbe + Résultat néfaste / accompli',
    situationFrench: 'Tu découvres avec stupeur qu’on a emprunté ou volé ton vélo devant le métro.',
    keyNuanceExplanation: 'Contrairement au passif français qui est neutre, 被 (bèi) est traditionnellement réservé aux situations où le sujet SUBIT un dommage, une perte ou un désagrément imprévu. Le verbe doit toujours être accompagné d’un résultat marquant l’effet produit (走, 坏, 丢).',
    commonTrap: 'Utiliser 被 pour des événements positifs simples du quotidien. On l’utilise en priorité pour les désagréments.',
    culturalNote: 'À l’oral, les Chinois remplacent souvent 被 par 叫 (jiào) ou 让 (ràng) : "自行车叫人骑走了".',
    targetChinese: '我的自行车被别人骑走了，真倒霉！',
    targetPinyin: 'Wǒ de zìxíngchē bèi biérén qí zǒu le, zhēn dǎoméi!',
    translationFrench: 'Mon vélo a été emporté par quelqu’un, quelle poisse !',
    rulePoints: [
      {
        pointTitle: '1. Notion de préjudice ou de surprise',
        explanation: 'En chinois traditionnel, 被 implique que le sujet subit quelque chose de désagréable : cassé (打碎), volé (偷走), critiqué (批评).',
        exampleChinese: '我的手机屏幕被摔坏了。',
        examplePinyin: 'Wǒ de shǒujī píngmù bèi shuāi huài le.',
        exampleFrench: 'L’écran de mon téléphone s’est cassé en tombant.'
      },
      {
        pointTitle: '2. L\'auteur de l\'action est facultatif',
        explanation: 'On peut omettre qui a fait l\'action : "我的钱包被偷了" = "Mon portefeuille a été volé".',
        exampleChinese: '杯子被打破了。',
        examplePinyin: 'Bēizi bèi dǎ pò le.',
        exampleFrench: 'Le verre a été brisé.'
      }
    ],
    additionalExamples: [
      {
        chinese: '昨天下大雨，我们都被淋湿了。',
        pinyin: 'Zuótiān xià dàyǔ, wǒmen dōu bèi lín shī le.',
        translation: 'Hier sous la grosse pluie, nous avons tous été trempés.',
        contextNote: 'Désagrément météo'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你的脸色怎么这么难看？发生什么事了？',
        pinyin: 'Nǐ de liǎnsè zěnme zhème nánkàn? Fāshēng shénme shì le?',
        translation: 'Pourquoi as-tu mauvaise mine ? Que s’est-il passé ?'
      },
      {
        speaker: 'B',
        chinese: '我的电脑被病毒破坏了，所有文件都没了！',
        pinyin: 'Wǒ de diànnǎo bèi bìngdú pòhuài le, suǒyǒu wénjiàn dōu méi le!',
        translation: 'Mon ordinateur a été endommagé par un virus, tous mes fichiers ont disparu !'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Mon gâteau a été entièrement mangé par mon petit frère"',
      tokens: ['我的蛋糕', '被', '弟弟', '吃光了'],
      correctTokens: ['我的蛋糕', '被', '弟弟', '吃光了'],
      explanation: 'Sujet victime (我的蛋糕) + 被 + Auteur (弟弟) + Verbe et résultat achevé (吃光了).'
    },
    activeTest: {
      promptFrench: 'Ton gâteau a été mangé en cachette par ton petit frère : 我的蛋糕_____弟弟吃光了。',
      sentenceWithBlank: '我的蛋糕_____弟弟吃光了。',
      options: ['被', '把', '向', '从'],
      correctIndex: 0,
      placement: {
        word: '被',
        segments: ["我的蛋糕","弟弟","吃光了"],
        correctGap: 1,
        punctuation: '。'
      },
      explanation: 'Le gâteau est la victime passive qui a subi l’action d’être dévoré (吃光了) : 被 introduit l’auteur (弟弟).',
      distractorExplanations: [
        'Exact ! 被 est la marque passive par excellence.',
        'Faux : 把 exigerait que le gâteau soit le sujet actif manipulant le petit frère !',
        'Faux : 向 introduit une direction.',
        'Faux : 从 indique le point de départ.'
      ]
    }
  },
  {
    id: 'm3-shi-de-emphasis',
    moduleId: 'module-3-structures',
    moduleTitle: 'Module 3 : Les Structures Spéciales Fondamentales',
    level: 'HSK 3',
    category: 'structures_speciales',
    title: 'La Structure Focalisatrice 是……的 (Shì...de)',
    structuralFormula: 'Sujet + 是 + [Quand / Où / Comment / Par qui] + Verbe + 的',
    situationFrench: 'Quelqu’un te complimente sur ta veste. Tu précises que tu l’as achetée l’an dernier à Shanghai.',
    keyNuanceExplanation: 'Quand une action passée est DÉJÀ CONNUE des deux interlocuteurs, on n’utilise plus 了 ! On utilise 是……的 pour braquer le projecteur sur une circonstance précise : la date (什么时候), le lieu (在哪里), le moyen de transport (怎么) ou la personne (跟谁).',
    commonTrap: 'Mettre 了 au lieu de 是...的 quand on demande les détails d’un voyage déjà accompli ("你怎么去了北京？" au lieu de "你是怎么去北京的？").',
    culturalNote: 'Indispensable pour faire connaissance : les Chinois l’utilisent dès qu’ils te demandent comment tu es venu ou où tu as appris le chinois.',
    targetChinese: '这件衣服是我去年在上海买的。',
    targetPinyin: 'Zhè jiàn yīfu shì wǒ qùnián zài Shànghǎi mǎi de.',
    translationFrench: 'Ce vêtement, c’est à Shanghai que je l’ai acheté l’année dernière.',
    rulePoints: [
      {
        pointTitle: '1. L\'événement est déjà acquis et accompli',
        explanation: 'La structure ne sert pas à informer que l\'action a eu lieu, mais à éclairer SES DÉTAILS : comment, où, quand.',
        exampleChinese: '你是坐飞机来的还是坐高铁来的？',
        examplePinyin: 'Nǐ shì zuò fēijī lái de háishì zuò gāotiě lái de?',
        exampleFrench: 'Tu es venu en avion ou en TGV ?'
      },
      {
        pointTitle: '2. "是" est souvent omis à l\'affirmative',
        explanation: 'À l\'oral affirmatif, on dit souvent "我去年买的" (omission de 是), mais le "的" final est STRICTEMENT obligatoire !',
        exampleChinese: '我在网上买的。',
        examplePinyin: 'Wǒ zài wǎngshang mǎi de.',
        exampleFrench: 'C’est sur Internet que je l’ai acheté.'
      }
    ],
    additionalExamples: [
      {
        chinese: '我是前年一个人来中国留学的。',
        pinyin: 'Wǒ shì qiánnián yí gè rén lái zhōngguó liúxué de.',
        translation: 'C’est il y a deux ans que je suis venu seul étudier en Chine.',
        contextNote: 'Présentation de parcours'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你这口流利的中文是在哪里学的？',
        pinyin: 'Nǐ zhè kǒu liúlì de zhōngwén shì zài nǎlǐ xué de?',
        translation: 'Où as-tu appris ce chinois si fluide ?'
      },
      {
        speaker: 'B',
        chinese: '我是在北京语言大学学的。',
        pinyin: 'Wǒ shì zài Běijīng Yǔyán Dàxué xué de.',
        translation: 'C’est à l’Université des Langues de Pékin que je l’ai appris.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "C’est en avion que nous sommes venus à Pékin"',
      tokens: ['我们', '是', '坐飞机', '来北京的'],
      correctTokens: ['我们', '是', '坐飞机', '来北京的'],
      explanation: 'Sujet (我们) + 是 + Moyen de transport focalisé (坐飞机) + Verbe et lieu avec 的 final (来北京的).'
    },
    activeTest: {
      promptFrench: 'Pour demander à un ami chinois à quelle date il est arrivé : 你是什么时候_____？',
      sentenceWithBlank: '你是什么时候_____？',
      options: ['来的', '来了', '来过', '在来'],
      correctIndex: 0,
      placement: {
        word: '来的',
        segments: ["你","是","什么时候"],
        correctGap: 3,
        punctuation: '？'
      },
      explanation: 'La structure focalisatrice de circonstance temporelle passée impose : 是……的 (什么时候来的).',
      distractorExplanations: [
        'Excellent ! 什么时候 + 来的 est la formule naturelle.',
        'Faux : 了 ne permet pas d’interroger sur la circonstance avec 是.',
        'Faux : 来过 interrogerait sur l’expérience de vie générale.',
        'Faux : 在来 exprimerait une action en cours d’accomplissement.'
      ]
    }
  },
  {
    id: 'm3-lian-dou',
    moduleId: 'module-3-structures',
    moduleTitle: 'Module 3 : Les Structures Spéciales Fondamentales',
    level: 'HSK 3',
    category: 'structures_speciales',
    title: 'L’Extrême et l’Emphase avec 连……都/也 (Lián...dōu)',
    structuralFormula: '连 + Cas Extrême / Élément évident + 都 / 也 + Verbe / Négation',
    situationFrench: 'Un caractère chinois est si simple qu’un enfant de trois ans le connaît, ou un texte est si dur que même ton prof hésite.',
    keyNuanceExplanation: 'Pour dire "même X fait / ne fait pas Y", le chinois utilise la paire 连……都 (lián...dōu) ou 连……也 (lián...yě). "连" introduit l’exemple le plus extrême ou le plus inattendu, et "都" ou "也" reprend l’affirmation pour marquer l’universalité.',
    commonTrap: 'Omettre 都 ou 也 après le groupe nominal. En chinois, 连 a toujours besoin de son binôme de rappel (都 ou 也).',
    culturalNote: 'Omniprésent dans les conversations vivantes pour souligner l’intensité de la fatigue, de la surprise ou de la difficulté.',
    targetChinese: '这个汉字太简单了，连三岁的小孩儿都认识。',
    targetPinyin: 'Zhè gè hànzì tài jiǎndān le, lián sān suì de xiǎoháir dōu rènshi.',
    translationFrench: 'Ce sinogramme est tellement simple que même un enfant de trois ans le connaît.',
    rulePoints: [
      {
        pointTitle: '1. "Même pas" avec négation',
        explanation: '连...都/也 + 不/没 : exprime qu\'on n\'a même pas fait le strict minimum.',
        exampleChinese: '他太忙了，连一口水都没喝。',
        examplePinyin: 'Tā tài máng le, lián yì kǒu shuǐ dōu méi hē.',
        exampleFrench: 'Il était si occupé qu’il n’a même pas bu une gorgée d’eau.'
      }
    ],
    additionalExamples: [
      {
        chinese: '这道题太难了，连老师都不会做。',
        pinyin: 'Zhè dào tí tài nán le, lián lǎoshī dōu bú huì zuò.',
        translation: 'Cet exercice est si difficile que même le professeur ne sait pas le résoudre.',
        contextNote: 'Difficulté extrême'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你今天怎么这么累？',
        pinyin: 'Nǐ jīntiān zěnme zhème lèi?',
        translation: 'Pourquoi es-tu aussi fatigué aujourd’hui ?'
      },
      {
        speaker: 'B',
        chinese: '我今天连午饭都没吃，一直在写代码。',
        pinyin: 'Wǒ jīntiān lián wǔfàn dōu méi chī, yìzhí zài xiě dàimǎ.',
        translation: 'Je n’ai même pas mangé de déjeuner aujourd’hui, je n’ai fait qu’écrire du code.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Ce mot est si rare que même le dictionnaire ne le contient pas"',
      tokens: ['这个生词', '连', '词典里', '都', '查不到'],
      correctTokens: ['这个生词', '连', '词典里', '都', '查不到'],
      explanation: 'Sujet (这个生词) + 连 + Élément de référence (词典里) + 都 + Verbe de potentiel négatif (查不到).'
    },
    activeTest: {
      promptFrench: 'Complète : "Il était tellement fatigué qu’il n’a même pas mangé son dîner" : 他太累了，连晚饭_____没吃。',
      sentenceWithBlank: '他太累了，连晚饭_____没吃。',
      options: ['都', '就', '才', '再'],
      correctIndex: 0,
      placement: {
        word: '都',
        segments: ["他太累了，","连晚饭","没吃"],
        correctGap: 2,
        punctuation: '。'
      },
      explanation: 'La structure d’emphase est "连……都 / 也". 都 ou 也 est le mot de liaison obligatoire.',
      distractorExplanations: [
        'Bravo ! 都 complète la paire 连……都.',
        'Faux : 就 exprime l’immédiateté ou la facilité.',
        'Faux : 才 exprime la difficulté ou le retard.',
        'Faux : 再 exprime la répétition future.'
      ]
    }
  },

  // ==========================================
  // MODULE 4 : COMPLÉMENTS DE RÉSULTAT & POTENTIEL
  // ==========================================
  {
    id: 'm4-kan-de-dong',
    moduleId: 'module-4-complements',
    moduleTitle: 'Module 4 : Compléments de Résultat & de Potentiel',
    level: 'HSK 3',
    category: 'complements',
    title: 'Le Potentiel Réel avec 得/不 (看得懂 vs 看不懂)',
    structuralFormula: 'Verbe + 得 + Résultat (Capacité) | Verbe + 不 + Résultat (Incapacité)',
    situationFrench: 'Face à un article de journal chinois, tu expliques que tu arrives à comprendre le sens général grâce aux sinogrammes.',
    keyNuanceExplanation: 'Ne dis surtout pas "我能看懂" ou "我不能看懂" ! En chinois natif, la capacité concrète d’accomplir une action jusqu’au succès s’exprime par l’insertion de "得" (dé) ou "不" (bu) au milieu du verbe et de son résultat : 看得懂 (je peux comprendre) / 看不懂 (je n’arrive pas à comprendre).',
    commonTrap: 'Abuser de "不能 + Verbe" qui sonne comme une interdiction morale ou légale plutôt qu’une incapacité pratique.',
    culturalNote: 'Les compléments de potentiel sont au cœur de la langue parlée : 听得懂, 吃不完, 找得到, 想不起来.',
    targetChinese: '虽然汉字很多，但我大概看得懂这篇文章。',
    targetPinyin: 'Suīrán hànzì hěn duō, dàn wǒ dàgài kàn de dǒng zhè piān wénzhāng.',
    translationFrench: 'Bien qu’il y ait beaucoup de sinogrammes, j’arrive à peu près à comprendre cet article.',
    rulePoints: [
      {
        pointTitle: '1. Verbe + 得 + Résultat = Capacité',
        explanation: 'Indique que les conditions permettent d\'aboutir au résultat : 听得懂 (arriver à comprendre à l\'oreille), 找得到 (arriver à trouver).',
        exampleChinese: '你听得懂北京话吗？',
        examplePinyin: 'Nǐ tīng de dǒng Běijīnghuà ma?',
        exampleFrench: 'Arrives-tu à comprendre le dialecte pékinois ?'
      },
      {
        pointTitle: '2. Verbe + 不 + Résultat = Incapacité pratique',
        explanation: 'Indique qu\'on n\'arrive pas au résultat malgré les efforts : 听不懂 (ne pas comprendre), 吃不完 (ne pas arriver à tout finir).',
        exampleChinese: '字太小了，我看不清。',
        examplePinyin: 'Zì tài xiǎo le, wǒ kàn bu qīng.',
        exampleFrench: 'L’écriture est trop petite, je n’arrive pas à lire clairement.'
      }
    ],
    additionalExamples: [
      {
        chinese: '菜点得太多了，我们两个人肯定吃不完。',
        pinyin: 'Cài diǎn de tài duō le, wǒmen liǎng gè rén kěndìng chī bu wán.',
        translation: 'Nous avons trop commandé de plats, nous n’arriverons jamais à tout finir à deux.',
        contextNote: 'Au restaurant'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '这部中国电影没有字幕，你看得懂吗？',
        pinyin: 'Zhè bù zhōngguó diànyǐng méiyǒu zìmù, nǐ kàn de dǒng ma?',
        translation: 'Ce film chinois n’a pas de sous-titres, tu arrives à le comprendre ?'
      },
      {
        speaker: 'B',
        chinese: '语速太快了，我只能听懂一部分。',
        pinyin: 'Yǔsù tài kuài le, wǒ zhǐ néng tīng de dǒng yí bùfen.',
        translation: 'Ils parlent trop vite, je n’arrive à comprendre qu’une partie.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Parlez plus lentement, sinon je n’arrive pas à comprendre"',
      tokens: ['请说慢一点', '，', '不然', '我', '听不懂'],
      correctTokens: ['请说慢一点', '，', '不然', '我', '听不懂'],
      explanation: 'Demande (请说慢一点) + Conjonction (不然) + Sujet (我) + Complément de potentiel négatif (听不懂).'
    },
    activeTest: {
      promptFrench: 'Un ami parle trop vite au téléphone : "Je n’arrive pas à entendre clairement ce que tu dis" : 我听_____清你说的话。',
      sentenceWithBlank: '我听_____清你说的话。',
      options: ['不', '得', '没', '了'],
      correctIndex: 0,
      placement: {
        word: '不',
        segments: ["我","听","清","你说的话"],
        correctGap: 2,
        punctuation: '。'
      },
      explanation: 'Le potentiel négatif s’exprime en insérant "不" entre le verbe et le résultat : 听不清 (tīng bu qīng).',
      distractorExplanations: [
        'Exact ! 听不清 = ne pas arriver à entendre nettement.',
        'Faux : 听得清 serait affirmatif (j’entends clairement).',
        'Faux : 没 ne s’insère pas dans le complément de potentiel.',
        'Faux : 了 ne fonctionne pas en insertion de potentiel.'
      ]
    }
  },
  {
    id: 'm4-wan-hao-result',
    moduleId: 'module-4-complements',
    moduleTitle: 'Module 4 : Compléments de Résultat & de Potentiel',
    level: 'HSK 3',
    category: 'complements',
    title: '完 (Wán) vs 好 (Hǎo) : Fini Simple vs Parfaitement Prêt',
    structuralFormula: 'Action terminée chronologiquement -> Verbe + 完 | Action prête & satisfaisante -> Verbe + 好',
    situationFrench: 'Ton ami te demande si les valises sont prêtes pour partir en vacances demain matin.',
    keyNuanceExplanation: '完 (wán) indique uniquement la FIN CHRONOLOGIQUE d’une action ou d’une ressource (manger jusqu’à la dernière miette, épuiser le temps). 好 (hǎo) indique que l’action est achevée de manière SATISFAISANTE, complète et prête pour la suite ("c’est fin prêt !").',
    commonTrap: 'Dire "我准备完了" au lieu de "我准备好了" quand on est prêt à partir.',
    culturalNote: 'Au restaurant ou à la maison : "菜做好了" (les plats sont prêts à être servis) vs "菜吃完了" (les plats ont été dévorés, il ne reste rien).',
    targetChinese: '行李我已经收拾好了，明早随时可以出发。',
    targetPinyin: 'Xíngli wǒ yǐjīng shōushi hǎo le, míngzǎo suíshí kěyǐ chūfā.',
    translationFrench: 'Les valises sont prêtes et bien rangées, on peut partir à tout moment demain matin.',
    rulePoints: [
      {
        pointTitle: '1. Verbe + 完 = Achèvement brut',
        explanation: 'Épuiser une quantité ou arriver au terme du temps : 做完作业 (finir les devoirs), 喝完咖啡 (terminer son café).',
        exampleChinese: '你今天能写完这份报告吗？',
        examplePinyin: 'Nǐ jīntiān néng xiě wán zhè fèn bàogào ma?',
        exampleFrench: 'Peux-tu terminer la rédaction de ce rapport aujourd’hui ?'
      },
      {
        pointTitle: '2. Verbe + 好 = Prêt avec succès',
        explanation: 'Sous-entend la perfection ou la préparation pour l\'étape suivante : 准备好 (fin prêt), 想好 (avoir bien réfléchi).',
        exampleChinese: '我已经想好去哪儿旅游了。',
        examplePinyin: 'Wǒ yǐjīng xiǎng hǎo qù nǎr lǚyóu le.',
        exampleFrench: 'J’ai bien réfléchi et choisi où partir voyager.'
      }
    ],
    additionalExamples: [
      {
        chinese: '饭做好了，大家快来吃吧！',
        pinyin: 'Fàn zuò hǎo le, dàjiā kuài lái chī ba!',
        translation: 'Le repas est prêt, venez manger !',
        contextNote: 'Cuisine & famille'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你准备好明天的面试了吗？',
        pinyin: 'Nǐ zhǔnbèi hǎo míngtiān de miànshì le ma?',
        translation: 'Es-tu fin prêt pour ton entretien de demain ?'
      },
      {
        speaker: 'B',
        chinese: '材料都已经准备好了，信心满满！',
        pinyin: 'Cáiliào dōu yǐjīng zhǔnbèi hǎo le, xìnxīn mǎnmǎn!',
        translation: 'Tous les documents sont bien prêts, j’ai confiance !'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Le dîner est prêt, asseyez-vous vite"',
      tokens: ['晚饭', '做好了', '，', '大家', '快坐下吧'],
      correctTokens: ['晚饭', '做好了', '，', '大家', '快坐下吧'],
      explanation: 'Sujet (晚饭) + Complément d\'état prêt (做好了) + Invitation (大家快坐下吧).'
    },
    activeTest: {
      promptFrench: 'Tu annonces à tes collègues que tout est prêt pour la réunion : 会议材料我已经准备_____了。',
      sentenceWithBlank: '会议材料我已经准备_____了。',
      options: ['好', '完', '过', '在'],
      correctIndex: 0,
      placement: {
        word: '好',
        segments: ["会议材料","我已经","准备","了"],
        correctGap: 3,
        punctuation: '。'
      },
      explanation: '准备好 (zhǔnbèi hǎo) exprime l’état "fin prêt et satisfaisant" avant l’événement.',
      distractorExplanations: [
        'Parfait ! 准备好 = être prêt et opérationnel.',
        'Imparfait : 准备完 indique juste que la préparation est terminée, sans insister sur le fait d’être prêt.',
        'Faux : 过 marquerait une expérience passée.',
        'Faux : 在 ne se place pas après le verbe en complément.'
      ]
    }
  },
  {
    id: 'm4-dao-jian-perception',
    moduleId: 'module-4-complements',
    moduleTitle: 'Module 4 : Compléments de Résultat & de Potentiel',
    level: 'HSK 3',
    category: 'complements',
    title: '到 (Dào) vs 见 (Jiàn) : Aboutissement vs Perception Sensorielle',
    structuralFormula: 'Atteindre un but / Trouver -> Verbe + 到 | Percevoir par les sens -> Verbe + 见',
    situationFrench: 'Tu cherchais tes lunettes partout, et soudain tu les aperçois posées sur l’étagère.',
    keyNuanceExplanation: '找 (chercher) est l’effort. 找到 (trouver) est l’ABOUTISSEMENT victorieux. 见 (jiàn) quant à lui est réservé aux deux sens nobles de la perception : la vue (看见 = apercevoir) et l’ouïe (听见 = entendre un bruit).',
    commonTrap: 'Confondre "我找了" (j’ai cherché) et "我找到了" (j’ai trouvé). En chinois, le verbe seul ne garantit jamais le succès !',
    culturalNote: 'Les verbes d’action chinois décrivent la tentative. Le complément de résultat (到 / 见) est indispensable pour valider la réussite.',
    targetChinese: '我找了半天，终于在书架上看到了我的眼镜。',
    targetPinyin: 'Wǒ zhǎo le bàntiān, zhōngyú zài shūjià shang kàn dào le wǒ de yǎnjìng.',
    translationFrench: 'J’ai cherché un bon moment, et j’ai enfin réussi à voir mes lunettes sur l’étagère.',
    rulePoints: [
      {
        pointTitle: '1. Verbe seul = Tentative | Verbe + 到/见 = Succès',
        explanation: '看 (regarder) vs 看见/看到 (apercevoir/voir) ; 听 (écouter) vs 听见/听到 (entendre).',
        exampleChinese: '我没听见敲门声。',
        examplePinyin: 'Wǒ méi tīngjiàn qiāo mén shēng.',
        exampleFrench: 'Je n’ai pas entendu frapper à la porte.'
      }
    ],
    additionalExamples: [
      {
        chinese: '你买到回家的火车票了吗？',
        pinyin: 'Nǐ mǎi dào huíjiā de huǒchēpiào le ma?',
        translation: 'As-tu réussi à acheter ton billet de train pour rentrer ?',
        contextNote: 'Achat & aboutissement'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你在听什么？听得这么入迷？',
        pinyin: 'Nǐ zài tīng shénme? Tīng de zhème rùmí?',
        translation: 'Qu’écoutes-tu ? Tu as l’air tellement absorbé !'
      },
      {
        speaker: 'B',
        chinese: '我正在听窗外的鸟叫声，你听到了吗？',
        pinyin: 'Wǒ zhèngzài tīng chuāngwài de niǎo jiào shēng, nǐ tīng dào le ma?',
        translation: 'J’écoute le chant des oiseaux par la fenêtre, tu l’entends ?'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "J’ai enfin trouvé mes clés d’appartement"',
      tokens: ['我', '终于', '找到', '我的家门钥匙', '了'],
      correctTokens: ['我', '终于', '找到', '我的家门钥匙', '了'],
      explanation: 'Sujet (我) + Adverbe de succès (终于) + Verbe avec aboutissement (找到) + Objet (我的家门钥匙) + 了.'
    },
    activeTest: {
      promptFrench: 'Comment dire : "As-tu réussi à trouver tes clés ?" : 你_____你的钥匙了吗？',
      sentenceWithBlank: '你_____你的钥匙了吗？',
      options: ['找到', '找完', '看着', '在找'],
      correctIndex: 0,
      placement: {
        word: '找到',
        segments: ["你","你的钥匙","了吗"],
        correctGap: 1,
        punctuation: '？'
      },
      explanation: '找到 (zhǎodào) = aboutir à la découverte de l’objet cherché ("trouver").',
      distractorExplanations: [
        'Bravo ! 找到 = trouver.',
        'Faux : 找完 signifierait que tu as fini de chercher, pas forcément que tu as trouvé !',
        'Faux : 看着 indique un regard continu.',
        'Faux : 在找 indique l’action en cours de recherche.'
      ]
    }
  },
  {
    id: 'm4-mai-de-qi',
    moduleId: 'module-4-complements',
    moduleTitle: 'Module 4 : Compléments de Résultat & de Potentiel',
    level: 'HSK 4',
    category: 'complements',
    title: 'Capacité Financière et Morale avec 得起 / 不起',
    structuralFormula: 'Verbe + 得起 (Avoir les moyens de) | Verbe + 不起 (Ne pas pouvoir se permettre)',
    situationFrench: 'Dans un magasin de luxe, tu constates avec humour que le prix dépasse largement ton budget d’étudiant.',
    keyNuanceExplanation: '买得起 (mǎi de qǐ) = avoir les moyens financiers d’acheter. 买不起 (mǎi bu qǐ) = ne pas avoir les moyens de se payer. Cette tournure s’étend au plan moral et physique : 看得起 (respecter/estimer quelqu’un), 经不起 (ne pas supporter une épreuve), 对得起 (être digne de la confiance de quelqu’un).',
    commonTrap: 'Dire "我没有钱买" au lieu du naturel "我买不起".',
    culturalNote: 'Les expressions avec 得起/不起 révèlent la modestie et la franchise dans les discussions financières en Chine.',
    targetChinese: '这件大衣虽然很漂亮，但是太贵了，我买不起。',
    targetPinyin: 'Zhè jiàn dàyī suīrán hěn piàoliang, dànshì tài guì le, wǒ mǎi bu qǐ.',
    translationFrench: 'Ce manteau est très beau, mais il est trop cher, je n’ai pas les moyens de me l’offrir.',
    rulePoints: [
      {
        pointTitle: '1. Capacité financière : 买不起 / 买得起',
        explanation: 'La structure la plus courante pour exprimer son pouvoir d\'achat par rapport à un bien.',
        exampleChinese: '现在的房价太高了，很多人买不起房。',
        examplePinyin: 'Xiànzài de fángjià tài gāo le, hěn duō rén mǎi bu qǐ fáng.',
        exampleFrench: 'Le prix de l’immobilier est trop élevé, beaucoup n’ont pas les moyens d’acheter un appartement.'
      },
      {
        pointTitle: '2. Capacité morale : 对得起 / 对不起',
        explanation: '对得起 = être à la hauteur des espoirs de quelqu\'un, ne pas le décevoir.',
        exampleChinese: '只要努力了，就对得起自己。',
        examplePinyin: 'Zhǐyào nǔlì le, jiù duì de qǐ zìjǐ.',
        exampleFrench: 'Tant que tu as fait des efforts, tu es digne de toi-même.'
      }
    ],
    additionalExamples: [
      {
        chinese: '这辆跑车要几百万，普通人根本买不起。',
        pinyin: 'Zhè liàng pǎochē yào jǐ bǎi wàn, pǔtōng rén gēnběn mǎi bu qǐ.',
        translation: 'Cette sportive coûte des millions, les gens ordinaires ne peuvent absolument pas se la payer.',
        contextNote: 'Budget & luxe'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你打算买市中心的那套新房子吗？',
        pinyin: 'Nǐ dǎsuan mǎi shìzhōngxīn de nà tào xīn fángzi ma?',
        translation: 'As-tu l’intention d’acheter ce nouvel appartement en centre-ville ?'
      },
      {
        speaker: 'B',
        chinese: '市中心地段太好，价格太贵了，我目前还买不起。',
        pinyin: 'Shìzhōngxīn dìduàn tài hǎo, jiàgé tài guì le, wǒ mùqián hái mǎi bu qǐ.',
        translation: 'L’emplacement est trop prisé et le prix trop cher, je n’ai pas encore les moyens.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Le prix de cet hôtel est très abordable, tout le monde a les moyens"',
      tokens: ['这家酒店的', '价格很便宜', '，', '大家都', '住得起'],
      correctTokens: ['这家酒店的', '价格很便宜', '，', '大家都', '住得起'],
      explanation: 'Sujet (这家酒店的价格很便宜) + Proposition (大家都住得起 : tout le monde a les moyens d\'y loger).'
    },
    activeTest: {
      promptFrench: 'Comment dire : "C’est trop cher, je ne peux pas me le permettre financièrement" ?',
      sentenceWithBlank: '这块手表太贵了，我_____。',
      options: ['买不起', '买得起', '买不到', '不买好'],
      correctIndex: 0,
      placement: {
        word: '买不起',
        segments: ["这块手表","太贵了，","我"],
        correctGap: 3,
        punctuation: '。'
      },
      explanation: '买不起 (mǎi bu qǐ) est la formule consacrée pour "ne pas avoir les moyens financiers".',
      distractorExplanations: [
        'Exact ! 买不起 = hors de mes moyens.',
        'Faux : 买得起 exprimerait au contraire que tu as les moyens.',
        'Faux : 买不到 signifierait que le produit est en rupture de stock !',
        'Faux : 不买好 n’existe pas dans cette structure.'
      ]
    }
  },

  // ==========================================
  // MODULE 5 : CONNECTEURS LOGIQUES & FLUIDITÉ
  // ==========================================
  {
    id: 'm5-suiran-danshi',
    moduleId: 'module-5-connecteurs',
    moduleTitle: 'Module 5 : Connecteurs Logiques & Fluidité d’Élocution',
    level: 'HSK 3',
    category: 'connecteurs_fluidite',
    title: 'La Concession Élégante avec 虽然……但是……',
    structuralFormula: '虽然 + Proposition Concessionnelle，但是 / 可是 + Proposition Principale',
    situationFrench: 'Explique qu’apprendre le chinois est difficile, mais que c’est passionnant et très enrichissant.',
    keyNuanceExplanation: 'En français, on dit "Bien qu’il fasse froid, je sors" (une seule conjonction). En chinois, la grammaire exige presque TOUJOURS une PAIRE DE CONNECTEURS EN ÉCHO : "虽然" (bien que) dans la première partie, obligatoirement repris par "但是 / 可是" (mais) dans la seconde.',
    commonTrap: 'Omettre 但是 dans la deuxième proposition en calquant le français ("虽然很难，我很喜欢" sonne bancal sans 但是).',
    culturalNote: 'Les paires de connecteurs en miroir donnent au discours chinois son rythme et sa clarté proverbiale.',
    targetChinese: '学汉语虽然不容易，但是我觉得非常有意思。',
    targetPinyin: 'Xué hànyǔ suīrán bù róngyì, dànshì wǒ juéde fēicháng yǒu yìsi.',
    translationFrench: 'Bien qu’apprendre le chinois ne soit pas facile, je trouve cela extrêmement intéressant.',
    rulePoints: [
      {
        pointTitle: '1. Paires en miroir obligatoires',
        explanation: 'Bien que... mais : 虽然 (suīrán) doit être complété par 但是 (dànshì) ou 可是 (kěshì).',
        exampleChinese: '虽然下雨了，但是我们还是要出门。',
        examplePinyin: 'Suīrán xià yǔ le, dànshì wǒmen hái shì yào chūmén.',
        exampleFrench: 'Bien qu’il pleuve, nous devons quand même sortir.'
      }
    ],
    additionalExamples: [
      {
        chinese: '他虽然年纪很小，但是懂得很多道理。',
        pinyin: 'Tā suīrán niánjì hěn xiǎo, dànshì dǒng de hěn duō dàolǐ.',
        translation: 'Bien qu’il soit très jeune, il comprend énormément de choses.',
        contextNote: 'Maturité personnelle'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '这道四川菜辣不辣？你能吃吗？',
        pinyin: 'Zhè dào Sìchuān cài là bu là? Nǐ néng chī ma?',
        translation: 'Ce plat du Sichuan est-il épicé ? Arrives-tu à le manger ?'
      },
      {
        speaker: 'B',
        chinese: '虽然有点辣，但是味道特别香，我很喜欢！',
        pinyin: 'Suīrán yǒudiǎn là, dànshì wèidao tèbié xiāng, wǒ hěn xǐhuan!',
        translation: 'Bien que ce soit un peu épicé, le goût est délicieux, j’adore !'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Bien que ce travail soit fatigant, il est très valorisant"',
      tokens: ['这份工作', '虽然很累', '，', '但是', '非常有意义'],
      correctTokens: ['这份工作', '虽然很累', '，', '但是', '非常有意义'],
      explanation: 'Sujet (这份工作) + Concession (虽然很累) + Reprise obligatoire (但是) + Résultat (非常有意义).'
    },
    activeTest: {
      promptFrench: 'Complète : "Bien qu’il soit fatigué, il insiste pour finir son travail" : _____他很累，但是他依然坚持工作。',
      sentenceWithBlank: '_____他很累，但是他依然坚持工作。',
      options: ['虽然', '因为', '只要', '不仅'],
      correctIndex: 0,
      placement: {
        word: '虽然',
        segments: ["他很累，","但是","他依然坚持工作"],
        correctGap: 0,
        punctuation: '。'
      },
      explanation: 'Le "但是" de la seconde proposition appelle obligatoirement "虽然" dans la première (Bien que... mais...).',
      distractorExplanations: [
        'Parfait ! 虽然...但是... forme la paire de concession.',
        'Faux : 因为 appelle 所以 (cause / conséquence).',
        'Faux : 只要 appelle 就 (condition suffisante).',
        'Faux : 不仅 appelle 而且 (addition / non seulement mais encore).'
      ]
    }
  },
  {
    id: 'm5-zhiyao-vs-zhiyou',
    moduleId: 'module-5-connecteurs',
    moduleTitle: 'Module 5 : Connecteurs Logiques & Fluidité d’Élocution',
    level: 'HSK 3',
    category: 'connecteurs_fluidite',
    title: 'Condition Suffisante (只要……就) vs Nécessaire (只有……才)',
    structuralFormula: 'Condition suffisante -> 只要 A，就 B | Condition unique indispensable -> 只有 A，才 B',
    situationFrench: 'Explique que pour progresser en chinois, il suffit de s’entraîner chaque jour, mais que la fluidité ne s’obtient qu’avec la persévérance.',
    keyNuanceExplanation: '只要……就 (zhǐyào...jiù) signifie "IL SUFFIT DE... POUR QUE...". C’est une condition facile ou suffisante. 只有……才 (zhǐyǒu...cái) signifie "UNIQUEMENT SI / SEULEMENT SI... ALORS SEULEMENT...". C’est une condition sine qua non, exigeante et indispensable.',
    commonTrap: 'Mélanger les paires : ne dis JAMAIS "只要……才" ou "只有……就" ! 只要 va avec 就, 只有 va avec 才.',
    culturalNote: 'Distinction philosophique clé de la pensée chinoise entre la facilité optimiste (只要) et l’effort exigeant (只有).',
    targetChinese: '只要每天认真练习，你的汉语水平就会快速提高。',
    targetPinyin: 'Zhǐyào měitiān rènzhēn liànxí, nǐ de hànyǔ shuǐpíng jiù huì kuàisù tígāo.',
    translationFrench: 'Il suffit de s’entraîner sérieusement chaque jour pour que ton niveau de chinois progresse rapidement.',
    rulePoints: [
      {
        pointTitle: '1. 只要……就 = Condition suffisante',
        explanation: '"Il suffit que A se produise, et B arrive automatiquement" : 只要天气好，我们就去公园.',
        exampleChinese: '只要你愿意，随时可以来找我。',
        examplePinyin: 'Zhǐyào nǐ yuànyì, suíshí kěyǐ lái zhǎo wǒ.',
        exampleFrench: 'Tant que tu le souhaites, tu peux venir me voir à tout moment.'
      },
      {
        pointTitle: '2. 只有……才 = Condition indispensable et unique',
        explanation: '"Seulement si A est rempli, B pourra alors advenir (aucune autre alternative)" : 只有多说，口语才能提高.',
        exampleChinese: '只有坚持到底，才能获得成功。',
        examplePinyin: 'Zhǐyǒu jiānchí dàodǐ, cái néng huòdé chénggōng.',
        exampleFrench: 'C’est seulement en persévérant jusqu’au bout que l’on peut réussir.'
      }
    ],
    additionalExamples: [
      {
        chinese: '只有按时吃药，你的感冒才会好得快。',
        pinyin: 'Zhǐyǒu ànshí chī yào, nǐ de gǎnmào cái huì hǎo de kuài.',
        translation: 'C’est uniquement en prenant tes médicaments à l’heure que ton rhume guérira vite.',
        contextNote: 'Santé & prescription'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '学中文最重要的是什么？',
        pinyin: 'Xué zhōngwén zuì zhòngyào de shì shénme?',
        translation: 'Quelle est la chose la plus importante dans l’apprentissage du chinois ?'
      },
      {
        speaker: 'B',
        chinese: '只要保持兴趣，每天开口练习，你的语感就会越来越好。',
        pinyin: 'Zhǐyào bǎochí xìngqù, měitiān kāikǒu liànxí, nǐ de yǔgǎn jiù huì yuèláiyuè hǎo.',
        translation: 'Il suffit de garder la motivation et de pratiquer à voix haute chaque jour pour que ton intuition s’affine.'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Tant que tu fais des efforts, tes rêves pourront se réaliser"',
      tokens: ['只要', '你努力', '，', '梦想', '就', '能实现'],
      correctTokens: ['只要', '你努力', '，', '梦想', '就', '能实现'],
      explanation: 'Condition (只要你努力) + Sujet (梦想) + Conséquence liée par 就 (就能实现).'
    },
    activeTest: {
      promptFrench: 'Complète : "C’est uniquement en pratiquant chaque jour que l’on peut devenir fluide" : _____多练习，_____能说得流利。',
      sentenceWithBlank: '_____多练习，_____能说得流利。',
      options: ['只有……才', '只要……就', '因为……所以', '虽然……但是'],
      correctIndex: 0,
      placement: {
        word: '只有',
        segments: ["多练习，","才","能说得流利"],
        correctGap: 0,
        punctuation: '。'
      },
      explanation: 'Il s’agit de la condition indispensable et exigeante : 只有……才.',
      distractorExplanations: [
        'Parfait ! 只有……才 exprime la condition indispensable.',
        'Imparfait : 只要……就 exprimerait une condition suffisante facile.',
        'Faux : 因为……所以 exprime la cause et conséquence.',
        'Faux : 虽然……但是 exprime la concession opposée.'
      ]
    }
  },
  {
    id: 'm5-yue-lai-yue',
    moduleId: 'module-5-connecteurs',
    moduleTitle: 'Module 5 : Connecteurs Logiques & Fluidité d’Élocution',
    level: 'HSK 3',
    category: 'connecteurs_fluidite',
    title: 'La Progression Dynamique avec 越来越 et 越……越……',
    structuralFormula: 'Évolution avec le temps -> 越来越 + Adjectif | Corrélation directe -> 越 + Action A + 越 + Effet B',
    situationFrench: 'Tu constates avec fierté que plus tu pratiques la prononciation avec Fluent, plus tes phrases deviennent naturelles.',
    keyNuanceExplanation: 'Pour exprimer que quelque chose devient "de plus en plus...", on utilise 越来越 (yuè lái yuè) devant un adjectif ou un verbe de sentiment. Pour relier deux variables ("plus on fait A, plus B augmente"), on utilise la structure double 越 A 越 B.',
    commonTrap: 'Mettre 很 ou 非常 après 越来越 : "越来越很漂亮" est faux ! 越来越 contient déjà l’intensité.',
    culturalNote: 'Les locuteurs natifs adorent employer "越 A 越 B" pour exprimer la saveur de la vie (越吃越香, 越听越有味).',
    targetChinese: '我的发音练习得越多，我的中文就越流利。',
    targetPinyin: 'Wǒ de fāyīn liànxí de yuè duō, wǒ de zhōngwén jiù yuè liúlì.',
    translationFrench: 'Plus je pratique ma prononciation, plus mon chinois devient fluide.',
    rulePoints: [
      {
        pointTitle: '1. 越来越 + Adj = "De plus en plus avec le temps"',
        explanation: 'Indique une évolution chronologique : 越来越好 (de mieux en mieux), 越来越冷 (de plus en plus froid). Ne JAMAIS ajouter 很 !',
        exampleChinese: '天色越来越暗了。',
        examplePinyin: 'Tiānsè yuèláiyuè àn le.',
        exampleFrench: 'Le ciel devient de plus en plus sombre.'
      },
      {
        pointTitle: '2. 越 A 越 B = Corrélation de proportion',
        explanation: 'Plus on fait A, plus l\'effet B s\'amplifie : 越学越有趣 (plus on apprend, plus c\'est passionnant).',
        exampleChinese: '这首歌越听越好听。',
        examplePinyin: 'Zhè shǒu gē yuè tīng yuè hǎotīng.',
        exampleFrench: 'Plus on écoute cette chanson, plus elle est agréable.'
      }
    ],
    additionalExamples: [
      {
        chinese: '随着学习的深入，我对中国文化越来越感兴趣。',
        pinyin: 'Suízhe xuéxí de shēnrù, wǒ duì zhōngguó wénhuà yuèláiyuè gǎn xìngqù.',
        translation: 'Au fil de mon apprentissage, je m’intéresse de plus en plus à la culture chinoise.',
        contextNote: 'Intérêt culturel'
      }
    ],
    dialogue: [
      {
        speaker: 'A',
        chinese: '你觉得学汉字难吗？',
        pinyin: 'Nǐ juéde xué hànzì nán ma?',
        translation: 'Trouves-tu difficile d’apprendre les sinogrammes ?'
      },
      {
        speaker: 'B',
        chinese: '刚开始很难，但了解了字理之后，越学越觉得有意思！',
        pinyin: 'Gāng kāishǐ hěn nán, dàn liǎojiě le zìlǐ zhīhòu, yuè xué yuè juéde yǒu yìsi!',
        translation: 'Au début c’était difficile, mais après avoir compris l’étymologie, plus j’apprends et plus je trouve ça fascinant !'
      }
    ],
    sentenceBuilder: {
      promptFrench: 'Assemble : "Grâce à la pratique, son expression orale devient de plus en plus naturelle"',
      tokens: ['通过练习', '，', '他的口语', '越来越', '自然了'],
      correctTokens: ['通过练习', '，', '他的口语', '越来越', '自然了'],
      explanation: 'Complément de moyen (通过练习) + Sujet (他的口语) + Progression continue (越来越) + Adjectif et modal (自然了).'
    },
    activeTest: {
      promptFrench: 'Complète : "Plus tu lis de textes chinois, plus ta vitesse de lecture augmente" : 你读的中文书越多，你的阅读速度_____。',
      sentenceWithBlank: '你读的中文书越多，你的阅读速度_____。',
      options: ['越快', '很快', '更快', '特别快'],
      correctIndex: 0,
      placement: {
        word: '越快',
        segments: ["你读的中文书越多，","你的阅读速度"],
        correctGap: 2,
        punctuation: '。'
      },
      explanation: 'La structure corrélative "越 A 越 B" impose "越" dans les deux propositions en miroir.',
      distractorExplanations: [
        'Parfait ! 越多……越快…… respecte la corrélation 越 A 越 B.',
        'Faux : 很快 romprait la structure en miroir.',
        'Faux : 更快 ne s’associe pas avec un premier 越.',
        'Faux : 特别快 ne crée pas la relation de cause à effet.'
      ]
    }
  }
];
