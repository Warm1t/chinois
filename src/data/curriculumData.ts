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
    activeTest: {
      promptFrench: 'Comment exprimer : "J’habite à Pékin depuis deux mois (et j’y habite toujours)" ?',
      sentenceWithBlank: '我在北京住了两个月_____。',
      options: ['了', '过', '着', '在'],
      correctIndex: 0,
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
    targetPinyin: 'Wǒ cónglái méiyǒu qù guò Shànghǎi, dàn wǒ dǎsuàn míngnián qù.',
    translationFrench: 'Je ne suis jamais allé à Shanghai, mais j’ai l’intention d’y aller l’année prochaine.',
    activeTest: {
      promptFrench: 'Un collègue te demande si tu as déjà goûté le canard laqué. Tu veux répondre : "Je n’en ai jamais mangé de ma vie".',
      sentenceWithBlank: '我从来没有吃_____北京烤鸭。',
      options: ['了', '过', '在', '完'],
      correctIndex: 1,
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
    activeTest: {
      promptFrench: 'Complète pour dire : "Il écoute de la musique en étant allongé sur le lit" : 他在床上躺_____听音乐。',
      sentenceWithBlank: '他在床上躺_____听音乐。',
      options: ['着', '了', '过', '在'],
      correctIndex: 0,
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
    activeTest: {
      promptFrench: 'Comment exprimer : "Je n’ai plus faim maintenant (la faim a disparu)" ?',
      sentenceWithBlank: '我不饿_____。',
      options: ['了', '过', '在', '着'],
      correctIndex: 0,
      explanation: '我不饿了 marque le changement d’état : j’avais faim avant, mais désormais ce n’est plus le cas.',
      distractorExplanations: [
        'Exactement ! C’est le 了 modal de nouvelle situation.',
        'Faux : 过 n’a aucun sens avec un adjectif d’état présent comme 饿.',
        'Faux : 在 ne s’emploie pas en fin d’adjectif.',
        'Faux : 着 exprimerait une persistance sans rupture.'
      ]
    }
  },

  // ==========================================
  // MODULE 2 : LA RÉCURRENCE & LA FRÉQUENCE
  // ==========================================
  {
    id: 'm2-you-vs-zai',
    moduleId: 'module-2-recurrence',
    moduleTitle: 'Module 2 : La Récurrence & la Fréquence',
    level: 'HSK 4',
    category: 'recurrence_frequence',
    title: 'La Récurrence Passée avec 又 (Yòu) vs 再 (Zài)',
    structuralFormula: '你怎么 + 又 + Verbe + 了 ？ (Répétition passée vs 再 = futur)',
    situationFrench: 'Ton ami arrive encore une fois en retard à votre rendez-vous. Dis-lui avec un sourire qu’il a encore oublié l’heure !',
    keyNuanceExplanation: 'En français, on utilise le même mot "encore". En chinois, l’erreur est fatale : 又 (yòu) exprime une répétition DÉJÀ SURVENUE dans le passé (souvent accompagnée de 了). 再 (zài) exprime une répétition PROJETÉE DANS LE FUTUR ("fais-le encore une fois plus tard").',
    commonTrap: 'Dire "你怎么再迟到了" : grammaticalement impossible car l’action du retard est déjà accomplie sous tes yeux.',
    culturalNote: 'La tournure "你怎么又……了" traduit une pointe d’agacement affectueux ou de taquinerie très idiomatique.',
    targetChinese: '你怎么又迟到了？是不是又把时间忘了？',
    targetPinyin: 'Nǐ zěnme yòu chídào le? Shì bu shì yòu bǎ shíjiān wàng le?',
    translationFrench: 'Comment se fait-il que tu sois encore en retard ? Tu as encore oublié l’heure ?',
    activeTest: {
      promptFrench: 'Ton ami a adoré ce thé et veut en reprendre : "S’il te plaît, bois encore une tasse !" Faut-il mettre 又 ou 再 ?',
      sentenceWithBlank: '请你_____喝一杯茶吧！',
      options: ['再', '又', '还', '过'],
      correctIndex: 0,
      explanation: 'L’action de boire une nouvelle tasse aura lieu dans le futur immédiat : on utilise obligatoirement 再 (zài).',
      distractorExplanations: [
        'Parfait ! 再 pour l’action future à réitérer.',
        'Faux : 又 est réservé aux actions déjà répétées dans le passé.',
        'Faux : 还 ne s’associe pas à l’impératif d’invitation polie 请.',
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
    activeTest: {
      promptFrench: 'Complète : "Les personnes qui ne font pas de sport ont souvent/tendance à tomber malades" : 不爱运动的人_____容易生病。',
      sentenceWithBlank: '不爱运动的人_____容易生病。',
      options: ['往往', '常常', '再', '又'],
      correctIndex: 0,
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
    activeTest: {
      promptFrench: 'Tu demandes à un ami s’il habite toujours à la même adresse : "Tu habites encore là-bas ?"',
      sentenceWithBlank: '你_____住在那里吗？',
      options: ['还', '又', '再', '过'],
      correctIndex: 0,
      explanation: 'L’état de résidence ne s’est pas arrêté : c’est la continuité ininterrompue exprimée par 还.',
      distractorExplanations: [
        'Correct ! 还 traduit la persistance continue.',
        'Faux : 又 impliquerait qu’il a déménagé puis ré-emménagé dans le passé.',
        'Faux : 再 projetterait un ré-emménagement dans le futur.',
        'Faux : 过 signifierait s’il y a déjà vécu autrefois.'
      ]
    }
  },

  // ==========================================
  // MODULE 3 : STRUCTURES SPÉCIALES FONDAMENTALES
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
    activeTest: {
      promptFrench: 'Comment dire : "Mets ce livre sur la table" ?',
      sentenceWithBlank: '请你_____这本书放在桌子上。',
      options: ['把', '被', '让', '在'],
      correctIndex: 0,
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
    activeTest: {
      promptFrench: 'Ton gâteau a été mangé en cachette par ton petit frère : 我的蛋糕_____弟弟吃光了。',
      sentenceWithBlank: '我的蛋糕_____弟弟吃光了。',
      options: ['被', '把', '向', '从'],
      correctIndex: 0,
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
    level: 'HSK 4',
    category: 'structures_speciales',
    title: 'L’Emphase Rétrospective avec 是……的 (Qui, Quand, Où, Comment)',
    structuralFormula: 'Sujet + 是 + [Détail Clé : Moment / Lieu / Moyen / Auteur] + Verbe + 的',
    situationFrench: 'Un ami admire ton nouvel appareil photo. Tu précises que ce n’est pas un achat personnel mais un cadeau de ton frère.',
    keyNuanceExplanation: 'Quand une action passée est DÉJÀ CONNUE de tous les interlocuteurs (l’appareil est visible sous vos yeux), on n’utilise plus 了. On utilise la structure 是……的 pour focaliser l’attention sur les circonstances de l’événement (par qui, quand, où ou comment).',
    commonTrap: 'Dire "我买了相机" quand l’objet est déjà au centre de la conversation. Il faut dire "是在网上买的" ou "是哥哥送的".',
    culturalNote: 'Cette structure résout 90% des maladresses temporelles des apprenants francophones au niveau intermédiaire.',
    targetChinese: '这个相机不是我自己买的，是我哥哥送给我的。',
    targetPinyin: 'Zhè ge xiàngjī bú shì wǒ zìjǐ mǎi de, shì wǒ gēge sòng gěi wǒ de.',
    translationFrench: 'Cet appareil n’a pas été acheté par moi-même, c’est mon grand frère qui me l’a offert.',
    activeTest: {
      promptFrench: 'Tu demandes à un collègue : "À quelle heure es-tu arrivé ce matin ?" (Le fait d’être arrivé est déjà avéré)',
      sentenceWithBlank: '你是几点_____？',
      options: ['到的', '到了', '到过', '在到'],
      correctIndex: 0,
      explanation: 'Le collègue est déjà présent. L’accent est mis sur le MOMENT (几点) : la structure 是……的 s’impose.',
      distractorExplanations: [
        'Parfait ! 是……的 braque le projecteur sur le moment exact.',
        'Faux : 到了 met l’accent sur la complétion de l’action, pas sur le détail temporel.',
        'Faux : 到过 signifierait une visite générale passée.',
        'Faux : 在到 n’a aucun sens temporel.'
      ]
    }
  },
  {
    id: 'm3-lian-dou',
    moduleId: 'module-3-structures',
    moduleTitle: 'Module 3 : Les Structures Spéciales Fondamentales',
    level: 'HSK 4',
    category: 'structures_speciales',
    title: 'L’Extrême avec 连……都 / 也…… ("Même...")',
    structuralFormula: '连 + Cas extrême + 都 / 也 + Verbe / Résultat',
    situationFrench: 'Face à un caractère calligraphique très rare et complexe, tu fais remarquer que même tes amis chinois se sont trompés.',
    keyNuanceExplanation: '连 (lián) introduit l’exemple le plus inattendu ou le plus frappant ("même..."). Il s’associe obligatoirement à 都 (dōu) ou 也 (yě) avant le verbe. Si le cas extrême échoue, la conséquence est encore plus évidente pour les cas ordinaires.',
    commonTrap: 'Oublier 都 ou 也 après le groupe nominal introduit par 连. La paire 连……都 est indissociable.',
    culturalNote: 'Très utilisé pour exprimer l’épuisement ("连一口水都没喝" = je n’ai même pas bu une gorgée d’eau) ou la surprise.',
    targetChinese: '这个汉字太难了，连中国朋友都写错了。',
    targetPinyin: 'Zhè ge hànzì tài nán le, lián Zhōngguó péngyou dōu xiě cuò le.',
    translationFrench: 'Ce caractère chinois est tellement difficile que même mes amis chinois se sont trompés en l’écrivant.',
    activeTest: {
      promptFrench: 'Complète pour dire : "Il est tellement occupé qu’il n’a même pas le temps de déjeuner" : 他忙得_____吃午饭的时间都没有。',
      sentenceWithBlank: '他忙得_____吃午饭的时间都没有。',
      options: ['连', '把', '被', '向'],
      correctIndex: 0,
      explanation: '连 introduit l’élément extrême (le temps de déjeuner) corrélé avec 都没有.',
      distractorExplanations: [
        'Excellent ! La paire 连……都 traduit "même...".',
        'Faux : 把 n’a rien à voir avec l’emphase extrême.',
        'Faux : 被 est réservé au passif.',
        'Faux : 向 indique une direction.'
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
    level: 'HSK 4',
    category: 'complements',
    title: 'Le Complément de Potentiel : 看得懂 vs 看不懂',
    structuralFormula: 'Verbe + 得 + Résultat (Capacité) vs Verbe + 不 + Résultat (Incapacité)',
    situationFrench: 'Dans un petit restaurant sans photos sur le menu, tu expliques poliment au serveur que tu ne parviens pas à déchiffrer les plats.',
    keyNuanceExplanation: 'En français, on utilise le modal "pouvoir" ("je ne peux pas comprendre"). En chinois natif, on intercale 不 (incapacité) ou 得 (capacité) directement entre le verbe d’action et son accomplissement : 看 (regarder) + 不 + 懂 (comprendre). Dire "我不能看懂" sonne très lourd et traduit de l’anglais.',
    commonTrap: 'Utiliser 不能 devant le verbe au lieu d’insérer 不 au cœur du complément de résultat.',
    culturalNote: 'Les compléments de potentiel (听得懂, 吃不完, 记不住) sont les structures préférées des Chinois pour parler de leurs facultés sensorielles.',
    targetChinese: '这份菜单没有图片，我实在看不懂。',
    targetPinyin: 'Zhè fèn càidān méiyǒu túpiàn, wǒ shízài kànbudǒng.',
    translationFrench: 'Ce menu n’a pas d’images, je n’arrive vraiment pas à le comprendre.',
    activeTest: {
      promptFrench: 'Le professeur parle trop vite et à voix basse. Tu veux dire : "Je n’arrive pas à entendre ce qu’il dit".',
      sentenceWithBlank: '老师说话的声音太小，我听_____。',
      options: ['不清', '清', '好', '到'],
      correctIndex: 0,
      explanation: '听不清 (tīng bu qīng) = verbe + 不 + résultat : l’incapacité d’entendre clairement.',
      distractorExplanations: [
        'Bravo ! 听不清 est la formule parfaite.',
        'Faux : 听清 sans 不 ni 得 ne constitue pas un complément de potentiel négatif.',
        'Faux : 听好 signifie bien écouter avec attention.',
        'Faux : 听到 indique qu’on a perçu un son, pas le manque de clarté.'
      ]
    }
  },
  {
    id: 'm4-wan-hao-result',
    moduleId: 'module-4-complements',
    moduleTitle: 'Module 4 : Compléments de Résultat & de Potentiel',
    level: 'HSK 3',
    category: 'complements',
    title: 'Compléments de Résultat : 完 (Wán) vs 好 (Hǎo) (Fini vs Prêt)',
    structuralFormula: 'Verbe + 完 (Épuisement quantitatif) vs Verbe + 好 (Préparé, réussi, prêt)',
    situationFrench: 'Tu viens de terminer de cuisiner le dîner pour tes invités. Annonce joyeusement que le repas est fin prêt.',
    keyNuanceExplanation: '完 (wán) indique uniquement que l’action ou le stock arrive à son terme quantitatif ("j’ai fini de manger" = 做完, 吃完). Mais 好 (hǎo) ajoute une nuance cruciale : non seulement l’action est terminée, mais le résultat est SATISFAISANT, PRÊT pour l’étape suivante ! "饭做好了" = le repas est cuisiné et prêt à être dégusté.',
    commonTrap: 'Utiliser 完 quand on veut signifier que quelque chose est prêt et disponible.',
    culturalNote: 'Les formules "准备好了" (prêt !), "想好了" (j’ai pris ma décision), "说好了" (c’est convenu) utilisent toutes 好.',
    targetChinese: '今天的晚饭我已经做好了，你快来吃吧。',
    targetPinyin: 'Jīntiān de wǎnfàn wǒ yǐjīng zuò hǎo le, nǐ kuài lái chī ba.',
    translationFrench: 'Le dîner d’aujourd’hui est fin prêt, viens vite manger !',
    activeTest: {
      promptFrench: 'Avant de partir en voyage, tu vérifies avec ton ami : "Est-ce que tes bagages sont fin prêts ?"',
      sentenceWithBlank: '你的行李准备_____了吗？',
      options: ['好', '完', '过', '着'],
      correctIndex: 0,
      explanation: '准备好 indique que les bagages sont prêts et rangés pour le voyage, pas juste que l’action de ranger est arrêtée.',
      distractorExplanations: [
        'Exactement ! 准备好 = être fin prêt.',
        'Imparfait : 准备完 insiste froidement sur la fin des tâches sans la dimension de préparation finale.',
        'Faux : 准备过 signifierait une préparation dans le passé lointain.',
        'Faux : 准备着 décrirait une action en cours de maintien.'
      ]
    }
  },
  {
    id: 'm4-dao-jian-perception',
    moduleId: 'module-4-complements',
    moduleTitle: 'Module 4 : Compléments de Résultat & de Potentiel',
    level: 'HSK 3',
    category: 'complements',
    title: 'Compléments d’Atteinte & Perception : 到 (Dào) vs 见 (Jiàn)',
    structuralFormula: 'Verbe + 到 (Atteindre l’objectif cherché) | Verbe + 见 (Percevoir par les sens)',
    situationFrench: 'Tu as cherché tes clés partout sans succès. Tu demandes à ton colocataire s’il les a aperçues.',
    keyNuanceExplanation: 'En chinois, chercher (找) n’est pas trouver ! 找 est l’action d’investiguer, tandis que 找到 (zhǎodào) est le succès de la quête. De même, 看 est l’action de regarder, tandis que 看见 (kànjiàn) est la perception sensorielle de voir l’objet.',
    commonTrap: 'Dire "我找钥匙了" pour signifier "j’ai trouvé mes clés". Il faut dire "我找到钥匙了".',
    culturalNote: 'La distinction entre le processus et son accomplissement est l’une des plus belles rigueurs philosophiques du mandarin.',
    targetChinese: '我找了半天也没找到钥匙，你看见了吗？',
    targetPinyin: 'Wǒ zhǎo le bàntiān yě méi zhǎodào yàoshi, nǐ kànjiàn le ma?',
    translationFrench: 'J’ai cherché pendant un long moment sans réussir à trouver mes clés, est-ce que tu les as aperçues ?',
    activeTest: {
      promptFrench: 'Tu étais au concert hier soir : "As-tu réussi à entendre ce qu’a dit le chanteur ?"',
      sentenceWithBlank: '你听_____歌手说什么了吗？',
      options: ['到', '完', '在', '过'],
      correctIndex: 0,
      explanation: '听到 (tīngdào) indique que le son a atteint les oreilles avec succès.',
      distractorExplanations: [
        'Bravo ! 听到 = parvenir à entendre.',
        'Faux : 听完 insisterait sur le fait d’avoir écouté jusqu’au dernier mot.',
        'Faux : 听在 est grammaticalement incorrect.',
        'Faux : 听过 indique seulement une expérience passée globale.'
      ]
    }
  },
  {
    id: 'm4-mai-de-qi',
    moduleId: 'module-4-complements',
    moduleTitle: 'Module 4 : Compléments de Résultat & de Potentiel',
    level: 'HSK 4',
    category: 'complements',
    title: 'La Capacité Financière avec 买得起 vs 买不起',
    structuralFormula: '买 + 得 + 起 (Avoir les moyens de s’offrir) vs 买 + 不 + 起 (Trop cher pour son budget)',
    situationFrench: 'En regardant les prix exorbitants des appartements en plein centre-ville, tu admets honnêtement que c’est hors de portée.',
    keyNuanceExplanation: 'En français, on dit "je n’ai pas les moyens d’acheter". En chinois, l’expression consacrée est 买不起 (mǎibuqǐ). Le complément 起 exprime ici la capacité d’assumer une charge financière ou morale. À l’inverse, 买得起 signifie "c’est largement dans mes moyens".',
    commonTrap: 'Traduire littéralement par "我没有钱买". 买不起 est mille fois plus idiomatique et naturel.',
    culturalNote: 'On retrouve cette structure avec d’autres verbes : 看得起 / 看不起 (estimer / mépriser quelqu’un), 经得起 (supporter l’épreuve).',
    targetChinese: '那套市中心的房子太贵了，我现在实在买不起。',
    targetPinyin: 'Nà tào shìzhōngxīn de fángzi tài guì le, wǒ xiànzài shízài mǎibuqǐ.',
    translationFrench: 'Cet appartement du centre-ville est trop cher, je n’ai vraiment pas les moyens de me l’offrir pour le moment.',
    activeTest: {
      promptFrench: 'Un ami hésite sur une voiture de luxe et te demande si tu as les moyens : "Oui, heureusement je peux me la payer !"',
      sentenceWithBlank: '不用担心，这辆车我买得_____。',
      options: ['起', '懂', '到', '好'],
      correctIndex: 0,
      explanation: '买得起 est la structure idiomatique universelle pour exprimer la solvabilité financière.',
      distractorExplanations: [
        'Excellent ! 买得起 = avoir les moyens financiers.',
        'Faux : 买得懂 n’a aucun sens (on ne "comprend" pas un achat).',
        'Faux : 买得到 signifie qu’il est disponible en magasin, pas qu’on a le budget.',
        'Faux : 买得好 signifierait avoir fait une bonne affaire.'
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
    title: 'La Concession Élégante : 虽然……但是……',
    structuralFormula: '虽然 + Proposition Concessive，但是 / 可是 + Proposition Réelle',
    situationFrench: 'Exprime avec sincérité que même si l’apprentissage du chinois demande un réel investissement, tu le trouves passionnant.',
    keyNuanceExplanation: 'En français, on omet souvent la conjonction dans l’une des deux propositions ("Bien que ce soit difficile, j’adore"). En chinois, les connecteurs fonctionnent presque toujours EN PAIRES ÉQUILIBRÉES : 虽然 (suīrán) prépare l’esprit à la concession, et 但是 (dànshì) ou 可是 (kěshì) apporte le contrepoids.',
    commonTrap: 'Oublier 但是 dans la seconde moitié de la phrase. Garder la paire complète assure la mélodie et la clarté du chinois.',
    culturalNote: 'Les Chinois apprécient énormément la modération dans le discours : commencer par une concession montre de la maturité et du respect.',
    targetChinese: '虽然学中文很难，但是我觉得非常有意思。',
    targetPinyin: 'Suīrán xué zhōngwén hěn nán, dànshì wǒ juéde fēicháng yǒu yìsi.',
    translationFrench: 'Bien qu’apprendre le chinois soit difficile, je trouve cela extrêmement intéressant.',
    activeTest: {
      promptFrench: 'Complète la paire de concession : "Bien qu’il pleuve dehors, il continue de courir." : 虽然外面下着雨，_____他还在跑步。',
      sentenceWithBlank: '虽然外面下着雨，_____他还在跑步。',
      options: ['但是', '因为', '所以', '如果'],
      correctIndex: 0,
      explanation: '虽然 s’associe naturellement avec 但是 pour marquer le pivot concessif.',
      distractorExplanations: [
        'Parfait ! 虽然……但是 est la paire d’or de la concession.',
        'Faux : 因为 introduit une cause.',
        'Faux : 所以 introduit une conséquence (avec 因为).',
        'Faux : 如果 introduit une hypothèse.'
      ]
    }
  },
  {
    id: 'm5-zhiyao-vs-zhiyou',
    moduleId: 'module-5-connecteurs',
    moduleTitle: 'Module 5 : Connecteurs Logiques & Fluidité d’Élocution',
    level: 'HSK 4',
    category: 'connecteurs_fluidite',
    title: 'Condition Suffisante vs Nécessaire : 只要……就 vs 只有……才',
    structuralFormula: '只要 + Condition suffisante + 就 + Résultat | 只有 + Condition unique + 才 + Réalisation',
    situationFrench: 'Encourage un camarade en lui affirmant qu’il suffit de pratiquer 15 minutes chaque jour pour progresser à vue d’œil.',
    keyNuanceExplanation: '只要……就…… exprime une condition SUFFISANTE ("il suffit que A pour que B se réalise"). En revanche, 只有……才…… exprime une condition NÉCESSAIRE EXCLUSIVE ("ce n’est que si A, et seulement dans ce cas, que B deviendra possible"). Ne mélange jamais 就 avec 只有, ni 才 avec 只要 !',
    commonTrap: 'Intervertir les couples : 只要 va TOUJOURS avec 就, et 只有 va TOUJOURS avec 才.',
    culturalNote: 'C’est une question classique des examens HSK 4 qui teste la rigueur logique du candidat.',
    targetChinese: '只要每天坚持练习十五分钟，你的口语就会越来越好。',
    targetPinyin: 'Zhǐyào měitiān jiānchí liànxí shíwǔ fēnzhōng, nǐ de kǒuyǔ jiù huì yuè lái yuè hǎo.',
    translationFrench: 'Tant que tu persévères à pratiquer 15 minutes par jour, ton expression orale deviendra de meilleure en meilleure.',
    activeTest: {
      promptFrench: 'Complète : "Ce n’est qu’en réussissant l’examen HSK 4 qu’il pourra partir étudier en Chine" : 只有考过HSK4级，他_____能去中国留学。',
      sentenceWithBlank: '只有考过HSK4级，他_____能去中国留学。',
      options: ['才', '就', '也', '都'],
      correctIndex: 0,
      explanation: '只有 appelle rigoureusement 才 pour exprimer la condition exclusive indispensable.',
      distractorExplanations: [
        'Exactement ! 只有……才 forment un binôme indissociable.',
        'Faux : 就 s’associe avec 只要 ou 如果, jamais avec 只有.',
        'Faux : 也 n’exprime pas le déclenchement conditionnel.',
        'Faux : 都 signifie la totalité.'
      ]
    }
  },
  {
    id: 'm5-yue-lai-yue',
    moduleId: 'module-5-connecteurs',
    moduleTitle: 'Module 5 : Connecteurs Logiques & Fluidité d’Élocution',
    level: 'HSK 3',
    category: 'connecteurs_fluidite',
    title: 'L’Évolution Continue avec 越来越…… (De plus en plus)',
    structuralFormula: 'Sujet + 越来越 + Adjectif / Verbe de sentiment + 了',
    situationFrench: 'Partage ton ressenti personnel : maintenant que tu t’es habitué aux saveurs locales, tu apprécies de plus en plus la cuisine chinoise.',
    keyNuanceExplanation: '越来越 (yuè lái yuè) marque une progression continue au fil du temps. Règle absolue : on n’ajoute JAMAIS d’adverbe de degré comme 很, 非常 ou 太 devant l’adjectif qui suit, car 越来越 porte déjà en lui le comparatif graduel.',
    commonTrap: 'Dire "越来越很好" : grave faute de pléonasme. Il faut dire directement "越来越好".',
    culturalNote: 'On l’associe souvent au 了 final de changement d’état pour souligner l’écart entre hier et aujourd’hui.',
    targetChinese: '习惯了这里的饮食之后，我越来越喜欢中国菜了。',
    targetPinyin: 'Xíguàn le zhèlǐ de yǐnshí zhīhòu, wǒ yuè lái yuè xǐhuan Zhōngguó cài le.',
    translationFrench: 'Après m’être habitué à l’alimentation d’ici, j’aime de plus en plus la cuisine chinoise.',
    activeTest: {
      promptFrench: 'Comment dire correctement : "Son niveau de chinois devient de plus en plus élevé" ?',
      sentenceWithBlank: '他的中文水平越来越_____了。',
      options: ['高', '很高', '非常高', '最高'],
      correctIndex: 0,
      explanation: 'Après 越来越, l’adjectif se place seul sans adverbe de degré parasite (高, et non 很/非常/最高).',
      distractorExplanations: [
        'Parfait ! 越来越 + adjectif nu.',
        'Faux : 很 fait double emploi et constitue une faute majeure.',
        'Faux : 非常 est redondant avec 越来越.',
        'Faux : 最 est le superlatif absolu, incompatible avec l’évolution progressive.'
      ]
    }
  }
];
