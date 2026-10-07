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
            rhythmAdvice: "Enchaîne '在成都的一条' sans marquer d'arrêt, fais une micro-respiration avant '安静老街上' et marque bien la virgule. Fais glisser '开了三十年的' avant d'atterrir sur '老茶馆' !",
            rhythmChunks: [
              {
                id: 'chunk-1-1',
                text: '在成都的一条',
                pinyin: 'Zài Chéngdū de yì tiáo',
                translation: 'Dans une',
                pauseType: 'breath',
                stressLevel: 'standard',
                sandhiHint: 'yì tiáo : 4e ton sur 一 devant le 2e ton',
                words: [
                  { hanzi: '在', pinyin: 'zài', translation: 'à, dans' },
                  { hanzi: '成都', pinyin: 'Chéngdū', translation: 'Chengdu' },
                  { hanzi: '的', pinyin: 'de', translation: 'de' },
                  { hanzi: '一条', pinyin: 'yì tiáo', translation: 'une' }
                ]
              },
              {
                id: 'chunk-1-2',
                text: '安静老街上，',
                pinyin: 'ānjìng lǎojiē shang,',
                translation: 'vieille rue paisible,',
                pauseType: 'comma',
                stressLevel: 'prominent',
                words: [
                  { hanzi: '安静', pinyin: 'ānjìng', translation: 'calme, paisible' },
                  { hanzi: '老街', pinyin: 'lǎojiē', translation: 'vieille rue' },
                  { hanzi: '上', pinyin: 'shang', translation: 'sur, dans' }
                ]
              },
              {
                id: 'chunk-1-3',
                text: '有一家',
                pinyin: 'yǒu yì jiā',
                translation: 'il y a une',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [
                  { hanzi: '有一家', pinyin: 'yǒu yì jiā', translation: 'il y a une' }
                ]
              },
              {
                id: 'chunk-1-4',
                text: '开了三十年的',
                pinyin: 'kāi le sānshí nián de',
                translation: 'ouverte depuis trente ans',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [
                  { hanzi: '开了', pinyin: 'kāi le', translation: 'ouverte depuis' },
                  { hanzi: '三十年', pinyin: 'sānshí nián', translation: 'trente ans' },
                  { hanzi: '的', pinyin: 'de', translation: 'de' }
                ]
              },
              {
                id: 'chunk-1-5',
                text: '老茶馆。',
                pinyin: 'lǎo cháguǎn.',
                translation: 'vieille maison de thé.',
                pauseType: 'period',
                stressLevel: 'prominent',
                sandhiHint: 'Sandhi 3+3 : lǎo cháguǎn -> lǎo est creusé, guǎn est au 3e ton',
                words: [
                  { hanzi: '老茶馆', pinyin: 'lǎo cháguǎn', translation: 'vieille maison de thé' },
                  { hanzi: '。', pinyin: '', translation: '.' }
                ]
              }
            ],
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
            rhythmAdvice: "Accroche '小林平时工作' d'une traite, appuie franchement sur '非常' (intensif) avant la virgule, puis lie '只有周末' avec '才会偶尔来这里' avant le bloc final '喝茶看书' !",
            rhythmChunks: [
              {
                id: 'chunk-2-1',
                text: '小林平时工作',
                pinyin: 'Xiǎo Lín píngshí gōngzuò',
                translation: 'Xiao Lin d\'ordinaire au travail',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [
                  { hanzi: '小林', pinyin: 'Xiǎo Lín', translation: 'Xiao Lin' },
                  { hanzi: '平时', pinyin: 'píngshí', translation: 'd\'ordinaire' },
                  { hanzi: '工作', pinyin: 'gōngzuò', translation: 'travail' }
                ]
              },
              {
                id: 'chunk-2-2',
                text: '非常忙，',
                pinyin: 'fēicháng máng,',
                translation: 'très occupé,',
                pauseType: 'comma',
                stressLevel: 'prominent',
                words: [
                  { hanzi: '非常', pinyin: 'fēicháng', translation: 'très' },
                  { hanzi: '忙', pinyin: 'máng', translation: 'occupé' }
                ]
              },
              {
                id: 'chunk-2-3',
                text: '只有周末',
                pinyin: 'zhǐyǒu zhōumò',
                translation: 'seulement le week-end',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [
                  { hanzi: '只有', pinyin: 'zhǐyǒu', translation: 'seulement si' },
                  { hanzi: '周末', pinyin: 'zhōumò', translation: 'week-end' }
                ]
              },
              {
                id: 'chunk-2-4',
                text: '才会偶尔来这里',
                pinyin: 'cái huì ǒu\'ěr lái zhèlǐ',
                translation: 'vient de temps en temps ici',
                pauseType: 'breath',
                stressLevel: 'prominent',
                words: [
                  { hanzi: '才', pinyin: 'cái', translation: 'alors' },
                  { hanzi: '会', pinyin: 'huì', translation: 'arriver de' },
                  { hanzi: '偶尔', pinyin: 'ǒu\'ěr', translation: 'occasionnellement', isTarget: true },
                  { hanzi: '来', pinyin: 'lái', translation: 'venir' },
                  { hanzi: '这里', pinyin: 'zhèlǐ', translation: 'ici' }
                ]
              },
              {
                id: 'chunk-2-5',
                text: '喝茶看书。',
                pinyin: 'hēchá kànshū.',
                translation: 'boire le thé et lire.',
                pauseType: 'period',
                stressLevel: 'standard',
                words: [
                  { hanzi: '喝茶', pinyin: 'hēchá', translation: 'boire du thé' },
                  { hanzi: '看书', pinyin: 'kànshū', translation: 'lire un livre' },
                  { hanzi: '。', pinyin: '', translation: '.' }
                ]
              }
            ],
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
            rhythmAdvice: "Fais une pause nette après '今天，', enchaîne '旁边坐着一位穿白衬衫的' sans t'arrêter sur '的', souffle à la virgule après '老爷爷，' puis pose '他的笑声听起来' avant de faire résonner '非常熟悉' !",
            rhythmChunks: [
              {
                id: 'chunk-3-1',
                text: '今天，',
                pinyin: 'Jīntiān,',
                translation: 'Aujourd\'hui,',
                pauseType: 'comma',
                stressLevel: 'standard',
                words: [{ hanzi: '今天', pinyin: 'jīntiān', translation: 'aujourd\'hui' }]
              },
              {
                id: 'chunk-3-2',
                text: '旁边坐着',
                pinyin: 'pángbiān zuò zhe',
                translation: 'à côté était assis',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [
                  { hanzi: '旁边', pinyin: 'pángbiān', translation: 'à côté' },
                  { hanzi: '坐着', pinyin: 'zuò zhe', translation: 'assis' }
                ]
              },
              {
                id: 'chunk-3-3',
                text: '一位穿白衬衫的',
                pinyin: 'yí wèi chuān bái chènshān de',
                translation: 'un monsieur en chemise blanche',
                pauseType: 'breath',
                stressLevel: 'standard',
                sandhiHint: 'yí wèi : se prononce yí (2e ton) devant le 4e ton wèi',
                words: [
                  { hanzi: '一位', pinyin: 'yí wèi', translation: 'une personne' },
                  { hanzi: '穿', pinyin: 'chuān', translation: 'porter' },
                  { hanzi: '白衬衫', pinyin: 'bái chènshān', translation: 'chemise blanche' },
                  { hanzi: '的', pinyin: 'de', translation: 'qui' }
                ]
              },
              {
                id: 'chunk-3-4',
                text: '老爷爷，',
                pinyin: 'lǎo yéye,',
                translation: 'grand-père,',
                pauseType: 'comma',
                stressLevel: 'prominent',
                words: [{ hanzi: '老爷爷', pinyin: 'lǎo yéye', translation: 'grand-père' }]
              },
              {
                id: 'chunk-3-5',
                text: '他的笑声',
                pinyin: 'tā de xiàoshēng',
                translation: 'son rire',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [
                  { hanzi: '他的', pinyin: 'tā de', translation: 'son' },
                  { hanzi: '笑声', pinyin: 'xiàoshēng', translation: 'rire' }
                ]
              },
              {
                id: 'chunk-3-6',
                text: '听起来',
                pinyin: 'tīng qǐlái',
                translation: 'semblait à l\'oreille',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [{ hanzi: '听起来', pinyin: 'tīng qǐlái', translation: 'sembler' }]
              },
              {
                id: 'chunk-3-7',
                text: '非常熟悉。',
                pinyin: 'fēicháng shúxī.',
                translation: 'très familier.',
                pauseType: 'period',
                stressLevel: 'prominent',
                words: [
                  { hanzi: '非常', pinyin: 'fēicháng', translation: 'très' },
                  { hanzi: '熟悉', pinyin: 'shúxī', translation: 'familier', isTarget: true },
                  { hanzi: '。', pinyin: '', translation: '.' }
                ]
              }
            ],
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
            rhythmAdvice: "La surprise s'exprime dans le rythme : marque la virgule après '小林抬头一看，', appuie avec dynamisme sur '竟然' (surprise !), lie '小学时' et '最尊敬的', et conclus sur '数学老师' !",
            rhythmChunks: [
              {
                id: 'chunk-4-1',
                text: '小林抬头一看，',
                pinyin: 'Xiǎo Lín táitóu yí kàn,',
                translation: 'Xiao Lin leva la tête et regarda,',
                pauseType: 'comma',
                stressLevel: 'standard',
                sandhiHint: 'yí kàn : se prononce yí (2e ton) devant le 4e ton kàn',
                words: [
                  { hanzi: '小林', pinyin: 'Xiǎo Lín', translation: 'Xiao Lin' },
                  { hanzi: '抬头', pinyin: 'táitóu', translation: 'lever la tête' },
                  { hanzi: '一看', pinyin: 'yí kàn', translation: 'regarda' }
                ]
              },
              {
                id: 'chunk-4-2',
                text: '竟然是他',
                pinyin: 'jìngrán shì tā',
                translation: 'c\'était contre toute attente son',
                pauseType: 'breath',
                stressLevel: 'prominent',
                words: [
                  { hanzi: '竟然', pinyin: 'jìngrán', translation: 'contre toute attente', isTarget: true },
                  { hanzi: '是', pinyin: 'shì', translation: 'être' },
                  { hanzi: '他', pinyin: 'tā', translation: 'son' }
                ]
              },
              {
                id: 'chunk-4-3',
                text: '小学时',
                pinyin: 'xiǎoxué shí',
                translation: 'à l\'école primaire',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [{ hanzi: '小学时', pinyin: 'xiǎoxué shí', translation: 'à l\'époque primaire' }]
              },
              {
                id: 'chunk-4-4',
                text: '最尊敬的',
                pinyin: 'zuì zūnjìng de',
                translation: 'le plus respecté',
                pauseType: 'breath',
                stressLevel: 'prominent',
                words: [
                  { hanzi: '最', pinyin: 'zuì', translation: 'le plus' },
                  { hanzi: '尊敬', pinyin: 'zūnjìng', translation: 'respecté' },
                  { hanzi: '的', pinyin: 'de', translation: 'qui' }
                ]
              },
              {
                id: 'chunk-4-5',
                text: '数学老师！',
                pinyin: 'shùxué lǎoshī!',
                translation: 'professeur de maths !',
                pauseType: 'period',
                stressLevel: 'standard',
                words: [
                  { hanzi: '数学', pinyin: 'shùxué', translation: 'mathématiques' },
                  { hanzi: '老师', pinyin: 'lǎoshī', translation: 'professeur' },
                  { hanzi: '！', pinyin: '', translation: '!' }
                ]
              }
            ],
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
            rhythmAdvice: "Sandhi essentiel : '不会' se dit 'bú huì' (2e ton devant 4e ton). Glisse sur '都是这位老师', lie '耐心帮他' et termine sans saccade sur '解决的' !",
            rhythmChunks: [
              {
                id: 'chunk-5-1',
                text: '当年遇到',
                pinyin: 'Dāngnián yù dào',
                translation: 'À l\'époque rencontrant',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [
                  { hanzi: '当年', pinyin: 'dāngnián', translation: 'en ces années' },
                  { hanzi: '遇到', pinyin: 'yù dào', translation: 'rencontrer' }
                ]
              },
              {
                id: 'chunk-5-2',
                text: '不会的难题，',
                pinyin: 'bú huì de nántí,',
                translation: 'des problèmes insolubles,',
                pauseType: 'comma',
                stressLevel: 'prominent',
                sandhiHint: 'bú huì : se prononce bú (2e ton) devant huì (4e ton)',
                words: [
                  { hanzi: '不会的', pinyin: 'bú huì de', translation: 'insolubles' },
                  { hanzi: '难题', pinyin: 'nántí', translation: 'problèmes' }
                ]
              },
              {
                id: 'chunk-5-3',
                text: '都是这位老师',
                pinyin: 'dōu shì zhè wèi lǎoshī',
                translation: 'c\'était ce professeur',
                pauseType: 'breath',
                stressLevel: 'standard',
                sandhiHint: 'zhè wèi : liaison fluide',
                words: [
                  { hanzi: '都是', pinyin: 'dōu shì', translation: 'c\'était' },
                  { hanzi: '这位', pinyin: 'zhè wèi', translation: 'ce' },
                  { hanzi: '老师', pinyin: 'lǎoshī', translation: 'professeur' }
                ]
              },
              {
                id: 'chunk-5-4',
                text: '耐心帮他',
                pinyin: 'nàixīn bāng tā',
                translation: 'qui l\'aidait patiemment',
                pauseType: 'breath',
                stressLevel: 'standard',
                words: [
                  { hanzi: '耐心', pinyin: 'nàixīn', translation: 'patiemment' },
                  { hanzi: '帮他', pinyin: 'bāng tā', translation: 'aider lui' }
                ]
              },
              {
                id: 'chunk-5-5',
                text: '解决的。',
                pinyin: 'jiějué de.',
                translation: 'à résoudre.',
                pauseType: 'period',
                stressLevel: 'prominent',
                words: [
                  { hanzi: '解决', pinyin: 'jiějué', translation: 'résoudre', isTarget: true },
                  { hanzi: '的', pinyin: 'de', translation: 'qui l\'a fait' },
                  { hanzi: '。', pinyin: '', translation: '.' }
                ]
              }
            ],
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
  },
  {
    id: 'story-morning-park-taichi',
    title: '公园晨光与太极剑',
    titlePinyin: 'Gōngyuán chénguāng yǔ tàijíjiàn',
    titleTranslation: 'Lueur matinale au parc et épée Tai Chi',
    level: 'HSK 3',
    category: 'Santé & Quotidien',
    readTime: '2 min',
    wordCount: 152,
    targetWords: [
      { hanzi: '锻炼', pinyin: 'duànliàn', translation: 's\'entraîner, faire de l\'exercice' },
      { hanzi: '放松', pinyin: 'fàngsōng', translation: 'se détendre, se relaxer' },
      { hanzi: '动作', pinyin: 'dòngzuò', translation: 'mouvement, geste' },
      { hanzi: '习惯', pinyin: 'xíguàn', translation: 'habitude, s\'habituer à' }
    ],
    paragraphs: [
      {
        sentences: [
          {
            hanzi: '清晨六点半，城市刚刚苏醒，公园里就已经有很多老人在晨练了。',
            pinyin: 'Qīngchén liù diǎn bàn, chéngshì gānggāng sūxǐng, gōngyuán lǐ jiù yǐjīng yǒu hěn duō lǎorén zài chénliàn le.',
            translation: 'À six heures et demie du matin, alors que la ville s\'éveille à peine, de nombreuses personnes âgées font déjà de l\'exercice dans le parc.',
            words: [
              { hanzi: '清晨', pinyin: 'qīngchén', translation: 'petit matin' },
              { hanzi: '六点半', pinyin: 'liù diǎn bàn', translation: 'six heures et demie' },
              { hanzi: '城市', pinyin: 'chéngshì', translation: 'ville' },
              { hanzi: '刚刚', pinyin: 'gānggāng', translation: 'à peine, tout juste' },
              { hanzi: '苏醒', pinyin: 'sūxǐng', translation: 's\'éveiller' },
              { hanzi: '公园里', pinyin: 'gōngyuán lǐ', translation: 'dans le parc' },
              { hanzi: '就已经', pinyin: 'jiù yǐjīng', translation: 'il y a déjà' },
              { hanzi: '有很多', pinyin: 'yǒu hěn duō', translation: 'beaucoup de' },
              { hanzi: '老人', pinyin: 'lǎorén', translation: 'personnes âgées' },
              { hanzi: '在', pinyin: 'zài', translation: 'en train de' },
              { hanzi: '晨练了', pinyin: 'chénliàn le', translation: 'faire de la gym matinale' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '小王决定改变经常熬夜的坏毛病，养成每天早起锻炼的好习惯。',
            pinyin: 'Xiǎo Wáng juédìng gǎibiàn jīngcháng áoyè de huài máobìng, yǎngchéng měitiān zǎoqǐ duànliàn de hǎo xíguàn.',
            translation: 'Xiao Wang a décidé de changer sa mauvaise habitude de veiller tard et de prendre l\'habitude de se lever tôt pour faire de l\'exercice.',
            words: [
              { hanzi: '小王', pinyin: 'Xiǎo Wáng', translation: 'Xiao Wang' },
              { hanzi: '决定', pinyin: 'juédìng', translation: 'décider' },
              { hanzi: '改变', pinyin: 'gǎibiàn', translation: 'changer' },
              { hanzi: '经常', pinyin: 'jīngcháng', translation: 'souvent' },
              { hanzi: '熬夜的', pinyin: 'áoyè de', translation: 'veiller tard' },
              { hanzi: '坏毛病', pinyin: 'huài máobìng', translation: 'mauvaise habitude' },
              { hanzi: '养成', pinyin: 'yǎngchéng', translation: 'adopter, acquérir' },
              { hanzi: '每天', pinyin: 'měitiān', translation: 'chaque jour' },
              { hanzi: '早起', pinyin: 'zǎoqǐ', translation: 'se lever tôt' },
              { hanzi: '锻炼', pinyin: 'duànliàn', translation: 's\'entraîner', isTarget: true },
              { hanzi: '的', pinyin: 'de', translation: 'de' },
              { hanzi: '好习惯', pinyin: 'hǎo xíguàn', translation: 'bonne habitude', isTarget: true },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      },
      {
        sentences: [
          {
            hanzi: '湖边有一位穿唐装的老人正在练太极剑，他的动作缓慢而优雅。',
            pinyin: 'Hú biān yǒu yí wèi chuān tángzhuāng de lǎorén zhèngzài liàn tàijíjiàn, tā de dòngzuò huǎnmàn ér yōuyǎ.',
            translation: 'Près du lac, un monsieur âgé vêtu d\'une veste traditionnelle s\'entraîne à l\'épée Tai Chi, ses mouvements sont lents et élégants.',
            words: [
              { hanzi: '湖边', pinyin: 'hú biān', translation: 'au bord du lac' },
              { hanzi: '有一位', pinyin: 'yǒu yí wèi', translation: 'il y a un' },
              { hanzi: '穿', pinyin: 'chuān', translation: 'porter' },
              { hanzi: '唐装', pinyin: 'tángzhuāng', translation: 'habit traditionnel' },
              { hanzi: '的', pinyin: 'de', translation: 'de' },
              { hanzi: '老人', pinyin: 'lǎorén', translation: 'vieil homme' },
              { hanzi: '正在', pinyin: 'zhèngzài', translation: 'en train de' },
              { hanzi: '练', pinyin: 'liàn', translation: 'pratiquer' },
              { hanzi: '太极剑', pinyin: 'tàijíjiàn', translation: 'épée de Tai Chi' },
              { hanzi: '他的', pinyin: 'tā de', translation: 'ses' },
              { hanzi: '动作', pinyin: 'dòngzuò', translation: 'mouvements', isTarget: true },
              { hanzi: '缓慢', pinyin: 'huǎnmàn', translation: 'lents' },
              { hanzi: '而', pinyin: 'ér', translation: 'et' },
              { hanzi: '优雅', pinyin: 'yōuyǎ', translation: 'élégants' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '看着湖水在微风中泛起波纹，小王深吸了一口气，整个人感到无比放松。',
            pinyin: 'Kàn zhe húshuǐ zài wēifēng zhōng fàn qǐ bōwén, Xiǎo Wáng shēn xī le yì kǒu qì, zhěng gè rén gǎndào wúbǐ fàngsōng.',
            translation: 'En observant les ondulations sur le lac sous la brise, Xiao Wang prit une profonde inspiration et se sentit infiniment détendu.',
            words: [
              { hanzi: '看着', pinyin: 'kàn zhe', translation: 'en regardant' },
              { hanzi: '湖水', pinyin: 'húshuǐ', translation: 'l\'eau du lac' },
              { hanzi: '在微风中', pinyin: 'zài wēifēng zhōng', translation: 'dans la brise' },
              { hanzi: '泛起波纹', pinyin: 'fàn qǐ bōwén', translation: 'onduler' },
              { hanzi: '小王', pinyin: 'Xiǎo Wáng', translation: 'Xiao Wang' },
              { hanzi: '深吸了', pinyin: 'shēn xī le', translation: 'inspira profondément' },
              { hanzi: '一口气', pinyin: 'yì kǒu qì', translation: 'une bouffée d\'air' },
              { hanzi: '整个人', pinyin: 'zhěng gè rén', translation: 'tout son être' },
              { hanzi: '感到', pinyin: 'gǎndào', translation: 'se sentit' },
              { hanzi: '无比', pinyin: 'wúbǐ', translation: 'infiniment' },
              { hanzi: '放松', pinyin: 'fàngsōng', translation: 'détendu', isTarget: true },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      }
    ],
    audioText: '清晨六点半，城市刚刚苏醒，公园里就已经有很多老人在晨练了。小王决定改变经常熬夜的坏毛病，养成每天早起锻炼的好习惯。湖边有一位穿唐装的老人正在练太极剑，他的动作缓慢而优雅。看着湖水在微风中泛起波纹，小王深吸了一口气，整个人感到无比放松。',
    quiz: [
      {
        question: '小王为什么决定清晨去公园？',
        questionPinyin: 'Xiǎo Wáng wèishénme juédìng qīngchén qù gōngyuán?',
        options: [
          '为了去湖边钓鱼 (Pour pêcher au bord du lac)',
          '为了改变熬夜坏毛病并养成锻炼的好习惯 (Pour changer sa mauvaise habitude et faire du sport)',
          '为了去公园拍照 (Pour prendre des photos)',
          '为了等朋友聚餐 (Pour attendre des amis pour déjeuner)'
        ],
        correctIndex: 1,
        explanation: 'Dans le texte : "小王决定改变经常熬夜的坏毛病，养成每天早起锻炼的好习惯".'
      }
    ],
    discussionPrompt: {
      question: '你平时有早起锻炼的习惯吗？你觉得哪种放松方式最有效？',
      questionPinyin: 'Nǐ píngshí yǒu zǎoqǐ duànliàn de xíguàn ma? Nǐ juéde nǎ zhǒng fàngsōng fāngshì zuì yǒuxiào?',
      questionTranslation: 'As-tu l\'habitude de faire du sport le matin ? Quelle méthode de relaxation trouves-tu la plus efficace ?',
      suggestedWords: ['锻炼 (duànliàn)', '放松 (fàngsōng)', '动作 (dòngzuò)', '习惯 (xíguàn)']
    }
  },
  {
    id: 'story-sichuan-hotpot',
    title: '热气腾腾的四川火锅',
    titlePinyin: 'Rèqì téngténg de Sìchuān huǒguō',
    titleTranslation: 'La fondue fumante du Sichuan',
    level: 'HSK 3',
    category: 'Gastronomie & Partage',
    readTime: '2 min',
    wordCount: 160,
    targetWords: [
      { hanzi: '辣', pinyin: 'là', translation: 'pimenté, épicé' },
      { hanzi: '聚会', pinyin: 'jùhuì', translation: 'se réunir, rassemblement' },
      { hanzi: '尝', pinyin: 'cháng', translation: 'goûter, tester' },
      { hanzi: '满足', pinyin: 'mǎnzú', translation: 'satisfait, comblé' }
    ],
    paragraphs: [
      {
        sentences: [
          {
            hanzi: '冬天的傍晚寒风刺骨，安娜和几位中国朋友约在火锅店聚会。',
            pinyin: 'Dōngtiān de bàngwǎn hánfēng cìgǔ, Ānnà hé jǐ wèi Zhōngguó péngyou yuē zài huǒguōdiàn jùhuì.',
            translation: 'Par une froide soirée d\'hiver, Anna et quelques amis chinois se sont donné rendez-vous dans un restaurant de fondue pour se réunir.',
            words: [
              { hanzi: '冬天的', pinyin: 'dōngtiān de', translation: 'd\'hiver' },
              { hanzi: '傍晚', pinyin: 'bàngwǎn', translation: 'soirée' },
              { hanzi: '寒风刺骨', pinyin: 'hánfēng cìgǔ', translation: 'vent glacial' },
              { hanzi: '安娜', pinyin: 'Ānnà', translation: 'Anna' },
              { hanzi: '和', pinyin: 'hé', translation: 'et' },
              { hanzi: '几位', pinyin: 'jǐ wèi', translation: 'quelques' },
              { hanzi: '中国朋友', pinyin: 'Zhōngguó péngyou', translation: 'amis chinois' },
              { hanzi: '约在', pinyin: 'yuē zài', translation: 'donner RDV à' },
              { hanzi: '火锅店', pinyin: 'huǒguōdiàn', translation: 'resto de fondue' },
              { hanzi: '聚会', pinyin: 'jùhuì', translation: 'se réunir', isTarget: true },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '红彤彤的麻辣汤底在锅里咕嘟咕嘟冒泡，散发着诱人的花椒香味。',
            pinyin: 'Hóngtóngtóng de málà tāngdǐ zài guō lǐ gūdū gūdū màopào, sànfā zhe yòurén de huājiāo xiāngwèi.',
            translation: 'Le bouillon rouge et pimenté bouillonnait dans la marmite, dégageant un parfum irrésistible de poivre du Sichuan.',
            words: [
              { hanzi: '红彤彤的', pinyin: 'hóngtóngtóng de', translation: 'tout rouge' },
              { hanzi: '麻辣', pinyin: 'málà', translation: 'pimenté et anesthésiant' },
              { hanzi: '汤底', pinyin: 'tāngdǐ', translation: 'bouillon' },
              { hanzi: '在锅里', pinyin: 'zài guō lǐ', translation: 'dans la marmite' },
              { hanzi: '冒泡', pinyin: 'màopào', translation: 'bouillonner' },
              { hanzi: '散发着', pinyin: 'sànfā zhe', translation: 'dégageant' },
              { hanzi: '诱人的', pinyin: 'yòurén de', translation: 'alléchant' },
              { hanzi: '花椒', pinyin: 'huājiāo', translation: 'poivre du Sichuan' },
              { hanzi: '香味', pinyin: 'xiāngwèi', translation: 'parfum' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      },
      {
        sentences: [
          {
            hanzi: '这是安娜第一次尝正宗的四川九宫格火锅，又麻又辣的味道让她直呼过瘾。',
            pinyin: 'Zhè shì Ānnà dì yī cì cháng zhèngzōng de Sìchuān jiǔgōnggé huǒguō, yòu má yòu là de wèidao ràng tā zhí hū guòyǐn.',
            translation: 'C\'était la première fois qu\'Anna goûtait à la véritable fondue du Sichuan en neuf cases ; la saveur à la fois anesthésiante et pimentée l\'a enchantée.',
            words: [
              { hanzi: '这是', pinyin: 'zhè shì', translation: 'c\'est' },
              { hanzi: '安娜', pinyin: 'Ānnà', translation: 'Anna' },
              { hanzi: '第一次', pinyin: 'dì yī cì', translation: 'première fois' },
              { hanzi: '尝', pinyin: 'cháng', translation: 'goûter', isTarget: true },
              { hanzi: '正宗的', pinyin: 'zhèngzōng de', translation: 'authentique' },
              { hanzi: '四川', pinyin: 'Sìchuān', translation: 'Sichuan' },
              { hanzi: '火锅', pinyin: 'huǒguō', translation: 'fondue' },
              { hanzi: '又麻又辣', pinyin: 'yòu má yòu là', translation: 'anesthésiant et pimenté', isTarget: true },
              { hanzi: '的味道', pinyin: 'de wèidao', translation: 'le goût' },
              { hanzi: '让她', pinyin: 'ràng tā', translation: 'la fit' },
              { hanzi: '直呼过瘾', pinyin: 'zhí hū guòyǐn', translation: 's\'exclamer de délice' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '大家一边涮着牛肉一边欢声笑语，每个人的脸上都写满了温暖与满足。',
            pinyin: 'Dàjiā yìbiān shuàn zhe niúròu yìbiān huānshēng xiàoyǔ, měi gè rén de liǎn shang dōu xiě mǎn le wēnnuǎn yǔ mǎnzú.',
            translation: 'Tout le monde trempait les lamelles de bœuf en riant et bavardant, chaque visage rayonnait de chaleur et de satisfaction.',
            words: [
              { hanzi: '大家', pinyin: 'dàjiā', translation: 'tout le monde' },
              { hanzi: '一边', pinyin: 'yìbiān', translation: 'en même temps' },
              { hanzi: '涮着牛肉', pinyin: 'shuàn zhe niúròu', translation: 'trempant le bœuf' },
              { hanzi: '欢声笑语', pinyin: 'huānshēng xiàoyǔ', translation: 'rires joyeux' },
              { hanzi: '每个人的', pinyin: 'měi gè rén de', translation: 'de chacun' },
              { hanzi: '脸上', pinyin: 'liǎn shang', translation: 'sur le visage' },
              { hanzi: '都写满了', pinyin: 'dōu xiě mǎn le', translation: 'était rempli de' },
              { hanzi: '温暖', pinyin: 'wēnnuǎn', translation: 'chaleur' },
              { hanzi: '与', pinyin: 'yǔ', translation: 'et' },
              { hanzi: '满足', pinyin: 'mǎnzú', translation: 'satisfaction', isTarget: true },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      }
    ],
    audioText: '冬天的傍晚寒风刺骨，安娜和几位中国朋友约在火锅店聚会。红彤彤的麻辣汤底在锅里咕嘟咕嘟冒泡，散发着诱人的花椒香味。这是安娜第一次尝正宗的四川九宫格火锅，又麻又辣的味道让她直呼过瘾。大家一边涮着牛肉一边欢声笑语，每个人的脸上都写满了温暖与满足。',
    quiz: [
      {
        question: '安娜对四川火锅的感受如何？',
        questionPinyin: 'Ānnà duì Sìchuān huǒguō de gǎnshòu rúhé?',
        options: [
          '觉得太淡没有任何味道 (Trop fade sans goût)',
          '又麻又辣觉得非常过瘾 (Épicé et anesthésiant, un pur délice)',
          '太辣了一口都没吃 (Trop fort, elle n\'a rien mangé)',
          '觉得太甜了 (Trop sucré)'
        ],
        correctIndex: 1,
        explanation: 'Dans le texte : "又麻又辣的味道让她直呼过瘾".'
      }
    ],
    discussionPrompt: {
      question: '你喜欢吃辣的中国菜吗？你最想和朋友去吃哪一种中国美食？',
      questionPinyin: 'Nǐ xǐhuan chī là de Zhōngguó cài ma? Nǐ zuì xiǎng hé péngyou qù chī nǎ yì zhǒng Zhōngguó měishí?',
      questionTranslation: 'Aimes-tu les plats chinois épicés ? Quel mets chinois aimerais-tu partager avec tes amis ?',
      suggestedWords: ['辣 (là)', '聚会 (jùhuì)', '尝 (cháng)', '满足 (mǎnzú)']
    }
  },
  {
    id: 'story-high-speed-rail',
    title: '飞驰的高铁与窗外风景',
    titlePinyin: 'Fēichí de gāotiě yǔ chuāngwài fēngjǐng',
    titleTranslation: 'Le train à grande vitesse et le paysage',
    level: 'HSK 4',
    category: 'Voyage & Modernité',
    readTime: '3 min',
    wordCount: 175,
    targetWords: [
      { hanzi: '速度', pinyin: 'sùdù', translation: 'vitesse' },
      { hanzi: '变化', pinyin: 'biànhuà', translation: 'changement, évolution' },
      { hanzi: '准时', pinyin: 'zhǔnshí', translation: 'à l\'heure, ponctuel' },
      { hanzi: '感受', pinyin: 'gǎnshòu', translation: 'ressentir, perception' }
    ],
    paragraphs: [
      {
        sentences: [
          {
            hanzi: '早晨八点整，从北京开往上海的复兴号高铁准时平稳地驶出了站台。',
            pinyin: 'Zǎochén bā diǎn zhěng, cóng Běijīng kāi wǎng Shànghǎi de Fùxīnghào gāotiě zhǔnshí píngwěn de shǐ chū le zhàntái.',
            translation: 'À huit heures précises, le TGV Fuxing reliant Pékin à Shanghai a quitté le quai avec ponctualité et stabilité.',
            words: [
              { hanzi: '早晨', pinyin: 'zǎochén', translation: 'matin' },
              { hanzi: '八点整', pinyin: 'bā diǎn zhěng', translation: 'huit heures pile' },
              { hanzi: '从北京', pinyin: 'cóng Běijīng', translation: 'depuis Pékin' },
              { hanzi: '开往上海', pinyin: 'kāi wǎng Shànghǎi', translation: 'vers Shanghai' },
              { hanzi: '复兴号高铁', pinyin: 'Fùxīnghào gāotiě', translation: 'TGV Fuxing' },
              { hanzi: '准时', pinyin: 'zhǔnshí', translation: 'à l\'heure', isTarget: true },
              { hanzi: '平稳地', pinyin: 'píngwěn de', translation: 'avec stabilité' },
              { hanzi: '驶出了', pinyin: 'shǐ chū le', translation: 'est sorti de' },
              { hanzi: '站台', pinyin: 'zhàntái', translation: 'le quai' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '列车的显示屏上跳动着时速三百五十公里的数字，但车厢里极其安静，桌上的咖啡杯甚至没有一丝晃动。',
            pinyin: 'Lièchē de xiǎnshìpíng shang tiàodòng zhe shí sù sān bǎi wǔshí gōnglǐ de shùzì, dàn chēxiāng lǐ jíqí ānjìng, zhuō shang de kāfēibēi shènzhì méiyǒu yì sī huàngdòng.',
            translation: 'L\'écran affichait une vitesse de 350 km/h, pourtant le wagon était extrêmement calme, et la tasse de café sur la tablette n\'oscillait pas d\'un millimètre.',
            words: [
              { hanzi: '列车的', pinyin: 'lièchē de', translation: 'du train' },
              { hanzi: '显示屏上', pinyin: 'xiǎnshìpíng shang', translation: 'sur l\'écran' },
              { hanzi: '跳动着', pinyin: 'tiàodòng zhe', translation: 'oscillait' },
              { hanzi: '时速', pinyin: 'shísù', translation: 'vitesse horaire', isTarget: true },
              { hanzi: '车厢里', pinyin: 'chēxiāng lǐ', translation: 'dans le wagon' },
              { hanzi: '极其安静', pinyin: 'jíqí ānjìng', translation: 'extrêmement calme' },
              { hanzi: '咖啡杯', pinyin: 'kāfēibēi', translation: 'tasse de café' },
              { hanzi: '甚至没有', pinyin: 'shènzhì méiyǒu', translation: 'même pas' },
              { hanzi: '一丝晃动', pinyin: 'yì sī huàngdòng', translation: 'un tremblement' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      },
      {
        sentences: [
          {
            hanzi: '望着窗外飞速后退的青山、绿水和现代化高楼，马克深刻感受到了中国这些年的巨大变化。',
            pinyin: 'Wàng zhe chuāngwài fēisù hòutuì de qīngshān, lǜshuǐ hé xiàndàihuà gāolóu, Mǎkè shēnkè gǎnshòu dào le Zhōngguó zhèxiē nián de jùdà biànhuà.',
            translation: 'En observant les collines verdoyantes, les rivières et les gratte-ciels défiler à toute allure, Marc a profondément ressenti l\'immense évolution de la Chine.',
            words: [
              { hanzi: '望着窗外', pinyin: 'wàng zhe chuāngwài', translation: 'en regardant dehors' },
              { hanzi: '青山绿水', pinyin: 'qīngshān lǜshuǐ', translation: 'montagnes et rivières' },
              { hanzi: '现代化高楼', pinyin: 'xiàndàihuà gāolóu', translation: 'immeubles modernes' },
              { hanzi: '马克', pinyin: 'Mǎkè', translation: 'Marc' },
              { hanzi: '深刻感受到了', pinyin: 'shēnkè gǎnshòu dào le', translation: 'a profondément ressenti', isTarget: true },
              { hanzi: '巨大变化', pinyin: 'jùdà biànhuà', translation: 'immense changement', isTarget: true },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '短短四个多小时便横跨上千公里，这不仅是速度的飞跃，更是科技带来的生活便捷。',
            pinyin: 'Duǎnduǎn sì gè duō xiǎoshí biàn héngkuà shàng qiān gōnglǐ, zhè bùjǐn shì sùdù de fēiyuè, gèng shì kējì dàilái de shēnghuó biànjié.',
            translation: 'Parcourir plus d\'un millier de kilomètres en à peine quatre heures n\'est pas seulement un bond de vitesse, c\'est toute la commodité offerte par la technologie.',
            words: [
              { hanzi: '短短', pinyin: 'duǎnduǎn', translation: 'en à peine' },
              { hanzi: '四个多小时', pinyin: 'sì gè duō xiǎoshí', translation: 'plus de 4 heures' },
              { hanzi: '横跨', pinyin: 'héngkuà', translation: 'traverser' },
              { hanzi: '上千公里', pinyin: 'shàng qiān gōnglǐ', translation: 'mille kilomètres' },
              { hanzi: '速度', pinyin: 'sùdù', translation: 'vitesse', isTarget: true },
              { hanzi: '飞跃', pinyin: 'fēiyuè', translation: 'bond en avant' },
              { hanzi: '科技', pinyin: 'kējì', translation: 'technologie' },
              { hanzi: '便捷', pinyin: 'biànjié', translation: 'commodité, facilité' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      }
    ],
    audioText: '早晨八点整，从北京开往上海的复兴号高铁准时平稳地驶出了站台。列车的显示屏上跳动着时速三百五十公里的数字，但车厢里极其安静，桌上的咖啡杯甚至没有一丝晃动。望着窗外飞速后退的青山、绿水和现代化高楼，马克深刻感受到了中国这些年的巨大变化。短短四个多小时便横跨上千公里，这不仅是速度的飞跃，更是科技带来的生活便捷。',
    quiz: [
      {
        question: '马克在乘坐中国高铁时最惊叹的是什么？',
        questionPinyin: 'Mǎkè zài chéngzuò Zhōngguó gāotiě shí zuì jīngtàn de shì shénme?',
        options: [
          '车厢非常颠簸 (Le train vibrait beaucoup)',
          '以350公里时速飞驰依然平稳安静 (Le train à 350 km/h reste très calme et stable)',
          '车票价格太贵 (Le billet est trop cher)',
          '沿途没有风景 (Aucun paysage)'
        ],
        correctIndex: 1,
        explanation: 'Dans le texte : "列车时速三百五十公里...但车厢里极其安静，桌上的咖啡杯甚至没有一丝晃动".'
      }
    ],
    discussionPrompt: {
      question: '你体验过中国的高铁吗？如果让你乘高铁去旅行，你最想去哪个城市感受当地的变化？',
      questionPinyin: 'Nǐ tǐyàn guò Zhōngguó de gāotiě ma? Rúguǒ ràng nǐ chéng gāotiě qù lǚxíng, nǐ zuì xiǎng qù nǎ gè chéngshì gǎnshòu dāngdì de biànhuà?',
      questionTranslation: 'As-tu déjà testé le TGV en Chine ? Vers quelle ville aimerais-tu voyager pour observer son développement ?',
      suggestedWords: ['速度 (sùdù)', '变化 (biànhuà)', '准时 (zhǔnshí)', '感受 (gǎnshòu)']
    }
  },
  {
    id: 'story-bookstore-rain',
    title: '雨天拐角书店的咖啡香',
    titlePinyin: 'Yǔtiān guǎijiǎo shūdiàn de kāfēixiāng',
    titleTranslation: 'Le parfum du café dans la librairie au coin de la rue',
    level: 'HSK 3',
    category: 'Vie Quotidienne & Découverte',
    readTime: '2 min',
    wordCount: 155,
    targetWords: [
      { hanzi: '安静', pinyin: 'ānjìng', translation: 'calme, tranquille' },
      { hanzi: '翻开', pinyin: 'fānkāi', translation: 'ouvrir (un livre)' },
      { hanzi: '避雨', pinyin: 'bìyǔ', translation: 's\'abriter de la pluie' },
      { hanzi: '灵感', pinyin: 'línggǎn', translation: 'inspiration' }
    ],
    paragraphs: [
      {
        sentences: [
          {
            hanzi: '夏天的午后突然下起了一场暴雨，街上的行人纷纷撑起雨伞寻找躲避的地方。',
            pinyin: 'Xiàtiān de wǔhòu tūrán xià qǐ le yì chǎng bàoyǔ, jiē shang de xíngrén fēnfēn chēng qǐ yǔsǎn xúnzhǎo duǒbì de dìfang.',
            translation: 'Un orage soudain s\'est abattu en plein après-midi d\'été, et les passants dans la rue ont ouvert leurs parapluies en quête d\'un abri.',
            words: [
              { hanzi: '夏天的午后', pinyin: 'xiàtiān de wǔhòu', translation: 'après-midi d\'été' },
              { hanzi: '突然', pinyin: 'tūrán', translation: 'soudainement' },
              { hanzi: '下起了暴雨', pinyin: 'xià qǐ le bàoyǔ', translation: 'une averse s\'est abattue' },
              { hanzi: '撑起雨伞', pinyin: 'chēng qǐ yǔsǎn', translation: 'ouvrir le parapluie' },
              { hanzi: '寻找', pinyin: 'xúnzhǎo', translation: 'chercher' },
              { hanzi: '躲避的地方', pinyin: 'duǒbì de dìfang', translation: 'un endroit pour s\'abriter' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '陈雪推开转角那家木门书店的玻璃门，本想只是临时避雨，却立刻被一股浓郁的咖啡香吸引。',
            pinyin: 'Chén Xuě tuī kāi zhuǎnjiǎo nà jiā mùmén shūdiàn de bōlimén, běn xiǎng zhǐshì línshí bìyǔ, què lìkè bèi yì gǔ nóngyù de kāfēixiāng xīyǐn.',
            translation: 'Chen Xue poussa la porte vitrée de la librairie au coin de la rue ; elle pensait simplement s\'abriter de la pluie, mais fut aussitôt attirée par un riche parfum de café.',
            words: [
              { hanzi: '陈雪', pinyin: 'Chén Xuě', translation: 'Chen Xue' },
              { hanzi: '推开', pinyin: 'tuī kāi', translation: 'pousser (porte)' },
              { hanzi: '转角书店', pinyin: 'zhuǎnjiǎo shūdiàn', translation: 'librairie du coin' },
              { hanzi: '临时', pinyin: 'línshí', translation: 'temporairement' },
              { hanzi: '避雨', pinyin: 'bìyǔ', translation: 's\'abriter de la pluie', isTarget: true },
              { hanzi: '浓郁的咖啡香', pinyin: 'nóngyù de kāfēixiāng', translation: 'parfum riche de café' },
              { hanzi: '吸引', pinyin: 'xīyǐn', translation: 'attirée' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      },
      {
        sentences: [
          {
            hanzi: '书店里非常安静，只有轻柔的音乐与雨滴敲打玻璃的沙沙声。',
            pinyin: 'Shūdiàn lǐ fēicháng ānjìng, zhǐyǒu qīngróu de yīnyuè yǔ yǔdī qiāodǎ bōli de shāshā shēng.',
            translation: 'La librairie était très calme, seul résonnait une musique douce mêlée au crépitement des gouttes de pluie contre la vitre.',
            words: [
              { hanzi: '书店里', pinyin: 'shūdiàn lǐ', translation: 'dans la librairie' },
              { hanzi: '非常', pinyin: 'fēicháng', translation: 'très' },
              { hanzi: '安静', pinyin: 'ānjìng', translation: 'calme', isTarget: true },
              { hanzi: '轻柔的音乐', pinyin: 'qīngróu de yīnyuè', translation: 'musique douce' },
              { hanzi: '雨滴', pinyin: 'yǔdī', translation: 'gouttes de pluie' },
              { hanzi: '敲打玻璃', pinyin: 'qiāodǎ bōli', translation: 'frapper la vitre' },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          },
          {
            hanzi: '她点了一杯热拿铁，翻开一本关于中国传统书画的图册，内心涌现出无数写作的灵感。',
            pinyin: 'Tā diǎn le yì bēi rè nátiě, fānkāi yì běn guānyú Zhōngguó chuántǒng shūhuà de túcè, nèixīn yǒngxiàn chū wúshù xiězuò de línggǎn.',
            translation: 'Elle commanda un café latte chaud, ouvrit un album consacré à la calligraphie chinoise, et sentit naître en elle une foule d\'inspirations d\'écriture.',
            words: [
              { hanzi: '热拿铁', pinyin: 'rè nátiě', translation: 'latte chaud' },
              { hanzi: '翻开', pinyin: 'fānkāi', translation: 'ouvrir (livre)', isTarget: true },
              { hanzi: '中国传统书画', pinyin: 'Zhōngguó chuántǒng shūhuà', translation: 'peinture et calligraphie' },
              { hanzi: '图册', pinyin: 'túcè', translation: 'album' },
              { hanzi: '涌现出', pinyin: 'yǒngxiàn chū', translation: 'surgir' },
              { hanzi: '灵感', pinyin: 'línggǎn', translation: 'inspiration', isTarget: true },
              { hanzi: '。', pinyin: '', translation: '.' }
            ]
          }
        ]
      }
    ],
    audioText: '夏天的午后突然下起了一场暴雨，街上的行人纷纷撑起雨伞寻找躲避的地方。陈雪推开转角那家木门书店的玻璃门，本想只是临时避雨，却立刻被一股浓郁的咖啡香吸引。书店里非常安静，只有轻柔的音乐与雨滴敲打玻璃的沙沙声。她点了一杯热拿铁，翻开一本关于中国传统书画的图册，内心涌现出无数写作的灵感。',
    quiz: [
      {
        question: '陈雪走进书店最初的原因是什么？',
        questionPinyin: 'Chén Xuě zǒu jìn shūdiàn zuìchū de yuányīn shì shénme?',
        options: [
          '买专业字典 (Acheter un dictionnaire)',
          '避雨 (S\'abriter de la pluie)',
          '买生日礼物 (Acheter un cadeau)',
          '找朋友 (Retrouver un ami)'
        ],
        correctIndex: 1,
        explanation: 'Dans le texte : "本想只是临时避雨，却立刻被一股浓郁的咖啡香吸引".'
      }
    ],
    discussionPrompt: {
      question: '下雨天你喜欢去安静的地方看书喝咖啡吗？在什么环境下你最容易产生灵感？',
      questionPinyin: 'Xiàyǔ tiān nǐ xǐhuan qù ānjìng de dìfang kànshū hē kāfēi ma? Zài shénme huánjìng xià nǐ zuì róngyì chǎnshēng línggǎn?',
      questionTranslation: 'Aimes-tu aller dans un endroit calme pour lire et boire un café les jours de pluie ? Quel cadre t\'inspire le plus ?',
      suggestedWords: ['安静 (ānjìng)', '翻开 (fānkāi)', '避雨 (bìyǔ)', '灵感 (línggǎn)']
    }
  }
];

// =========================================================================
// SÉLECTION DÉTERMINISTE DE L'HISTOIRE DU JOUR (ROTATION QUOTIDIENNE)
// =========================================================================

export const getTodayDailyStory = (targetDate: Date = new Date()): MaayotStory => {
  const year = targetDate.getFullYear();
  const startOfYear = new Date(year, 0, 0);
  const diff = targetDate.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = Math.abs(dayOfYear) % BUILT_IN_STORIES.length;
  return BUILT_IN_STORIES[index];
};

/**
 * Formate la description complète pour un événement iCalendar Histoire
 * Affichée uniquement lorsque l'utilisateur tape sur le widget ou ouvre l'événement.
 */
export const formatStoryCalendarDescription = (story: MaayotStory): string => {
  const targetWordsStr = story.targetWords
    .map(w => `• ${w.hanzi} (${w.pinyin}) : ${w.translation}`)
    .join('\\n');

  const storyParagraphsStr = story.paragraphs
    .map(p => p.sentences.map(s => `${s.hanzi}\\n(${s.pinyin})\\n→ ${s.translation}`).join('\\n\\n'))
    .join('\\n\\n---\\n\\n');

  const quizStr = story.quiz && story.quiz.length > 0
    ? `\\n\\n❓ Question Réflexion : ${story.quiz[0].question}\\n💡 Réponse : ${story.quiz[0].options[story.quiz[0].correctIndex]} (${story.quiz[0].explanation})`
    : '';

  return [
    `📚 Histoire du Jour : ${story.title} (${story.titlePinyin})`,
    `🇫🇷 Traduction : ${story.titleTranslation}`,
    `🏷️ Niveau : ${story.level} • ⏱️ Lecture : ${story.readTime} • 📊 ${story.wordCount} caractères`,
    ``,
    `🎯 Mots Clés Cibles :`,
    targetWordsStr,
    ``,
    `📜 Texte Intégral :`,
    storyParagraphsStr,
    quizStr,
    ``,
    `🔗 Écouter l'audio sur Fluent : https://warm1t.github.io/chinois/`
  ].join('\\n');
};

/**
 * Générer le fichier .ics pour l'Histoire du Jour sur iPhone (60 jours)
 * Titre épuré : caractère + pinyin uniquement !
 */
export const generateAppleCalendarIcsForStories = (
  reminderTime: string = '19:30',
  options: { daysCount?: number; mode?: 'all_day' | 'timed' } = {}
): string => {
  const daysCount = options.daysCount ?? 60;
  const mode = options.mode ?? 'timed';
  const [hours, minutes] = reminderTime.split(':');
  const now = new Date();
  const nowStr = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const batchUid = Math.random().toString(36).substring(2, 7);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fluent//Daily Stories Apple Widget Series//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Fluent',
    'X-WR-TIMEZONE:Europe/Paris'
  ];

  for (let i = 0; i < daysCount; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i + 1);

    const storyForDay = getTodayDailyStory(targetDate);

    const yearStr = String(targetDate.getFullYear());
    const monthStr = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(targetDate.getDate()).padStart(2, '0');
    const dateYmd = `${yearStr}${monthStr}${dayStr}`;

    const nextYearStr = String(nextDate.getFullYear());
    const nextMonthStr = String(nextDate.getMonth() + 1).padStart(2, '0');
    const nextDayStr = String(nextDate.getDate()).padStart(2, '0');
    const nextDateYmd = `${nextYearStr}${nextMonthStr}${nextDayStr}`;

    const descriptionText = formatStoryCalendarDescription(storyForDay);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:fluent-daily-story-${dateYmd}-${batchUid}@fluent.apple`);
    lines.push(`DTSTAMP:${nowStr}`);
    lines.push('CATEGORIES:Fluent');

    if (mode === 'all_day') {
      lines.push(`DTSTART;VALUE=DATE:${dateYmd}`);
      lines.push(`DTEND;VALUE=DATE:${nextDateYmd}`);
      lines.push('TRANSP:TRANSPARENT');
      lines.push(`SUMMARY:${storyForDay.title} (${storyForDay.titlePinyin})`);
      lines.push(`DESCRIPTION:${descriptionText}`);
      lines.push('LOCATION:Fluent (https://warm1t.github.io/chinois/)');
      lines.push('STATUS:CONFIRMED');

      lines.push('BEGIN:VALARM');
      lines.push(`TRIGGER:PT${hours}H${minutes}M`);
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:📚 ${storyForDay.title} (${storyForDay.titlePinyin})`);
      lines.push('END:VALARM');
    } else {
      lines.push(`DTSTART:${dateYmd}T${hours}${minutes}00`);
      lines.push(`DTEND:${dateYmd}T235900`);
      lines.push(`SUMMARY:${storyForDay.title} (${storyForDay.titlePinyin})`);
      lines.push(`DESCRIPTION:${descriptionText}`);
      lines.push('LOCATION:Fluent (https://warm1t.github.io/chinois/)');
      lines.push('STATUS:CONFIRMED');

      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-PT0M');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:📚 ${storyForDay.title} (${storyForDay.titlePinyin})`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
};

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
