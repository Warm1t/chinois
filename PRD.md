# 📑 PRD : Fluent — Le Cockpit d'Expression & Nuances en Mandarin (HSK 3-4)

> Application web interactive 100% gratuite (sans abonnement ni API payante) pour passer du vocabulaire mémorisé (Anki) à l'expression fluide de pensées et d'expressions complètes en chinois.

---

## 1. Vue d'ensemble du Projet
* **Nom du Projet** : Fluent
* **Pitch en 1 phrase** : L'outil qui transforme tes briques de vocabulaire en pensées naturelles, grâce à l'exploration exhaustive des nuances (aspects, structures 把/被, compléments de résultat, récurrence), des histoires quotidiennes immersives HSK 3-4 et un entraîneur vocal avec correction en direct.
* **Public Cible** : 
  - Apprenant motivé de niveau **HSK 3 - HSK 4**, capable d'investir un temps d'étude sérieux, connaissant déjà les caractères de base mais cherchant à maîtriser les expressions complètes, les structures idiomatiques et l'aisance à l'oral.
* **Contrainte Technique Majeure** : 
  - **100 % Gratuit & Zéro Abonnement** : Utilisation exclusive des technologies natives du navigateur (Web Speech API `zh-CN` pour le micro, Speech Synthesis pour l'écoute native, Web Storage local, webhooks MCP open-source).
  le site doit absoluement pouvoir un systeme de sauvegarde de progression peut importe l'appareil ( systeme d'identifiaciton)

---

## 2. Objectifs & Périmètre (Scope V1 - MVP)

### ✅ Inclus dans la V1 (Découpé en Grandes Fonctionnalités Totalement Abouties) :

- [ ] **Feature 1 : Le Labo d'Expression Orale avec Correcteur Vocal Interactif**
  - Exercices d'expression orale basés sur des situations de communication réelles HSK 3-4.
  - Reconnaissance vocale native en direct (**Web Speech API `zh-CN`**, gratuite, intégrée au navigateur).
  - Écoute audio du modèle natif (vitesse normale 1.0x et ralentie 0.8x pour bien décomposer les sons et tons).
  - Algorithme de scoring caractère par caractère :
    - Vert = caractère correctement prononcé/reconnu
    - Rouge/Orange = ton/son manqué ou confondu
    - Pourcentage de précision global (0 à 100%) + feedback immédiat et réessai illimité.

- [ ] **Feature 2 : Le Moteur d'Histoires Quotidiennes Sur-Mesure (HSK 3-4)**
  - Histoires riches et vivantes du quotidien (anecdotes, situations professionnelles, vie courante en Chine).
  - Ancrage des mots et expressions complètes (pas de mots isolés !).
  - Switch Pinyin Global ON / OFF (pour s'entraîner à la lecture directe des caractères simplifiés).
  - Révélation instantanée au clic sur n'importe quel caractère ou groupe de mots (Pinyin + sens français).
  - Lecture audio native de l'histoire intégrée.

- [ ] **Feature 3 : L'Encyclopédie Complète des Nuances (HSK 3-4)**
  - **Bloc 1 : Aspects & Temps** (`了1` verbal vs `了2` modal/changement vs `了1+2` action continuant dans le présent, `过` expérience vécue, `着` état continu, `在`).
  - **Bloc 2 : Récurrence & Répétition** (`又` passé vs `再` futur vs `还` persistance vs `往往` régularité conditionnelle vs `常常` simple fréquence).
  - **Bloc 3 : Compléments de Résultat & de Potentiel** (`完`, `到`, `见`, `好`, `懂` ; `看得懂 / 看不懂`, `买得起 / 买不起`, `吃得完 / 吃不完`).
  - **Bloc 4 : Compléments de Direction** (`上来/上去`, `出来/出去`, `起来`, `下去`).
  - **Bloc 5 : Structures d'Emphatique & de Manipulation** :
    - La structure **`把 (bǎ)`** : manipuler un objet et lui faire subir une action (`把书放在桌子上`).
    - La structure passive **`被 (bèi)`** : subir une action.
    - La structure d'emphase **`是...的`** : insister sur le lieu, le moment ou la manière d'une action déjà passée.
    - La structure d'extrême **`连...都/也...`** : *"même un enfant comprendrait..."*.
  - Chaque nuance comporte : règle claire, formule d'assemblage, 4 exemples contrastés, et pièges typiques des francophones.

- [ ] **Feature 4 : Le Sentence Builder & Expressions Complètes (搭配 Dāpèi)**
  - Entraînement à la recombinaison de chunks d'expressions complètes en phrases fluides.

- [ ] **Feature 5 : Routine 30 Jours, Conseils de Lecture & Workflows MCP (Slack/n8n/Webhooks)**
  - Calendrier de travail progressif HSK 3-4.
  - Recommandations d'immersion gratuites (ressources, podcasts, lectures graduées).
  - Webhooks de rappel du matin (compatibles MCP, Slack, n8n).

### ❌ Exclu de la V1 (Pour plus tard) :
- Détection formelle de la courbure de pitch F0 des 4 tons via spectrogramme audio (remplacé en V1 par l'alignement phonétique et textuel Web Speech).
- Reconnaissance manuscrite au stylet de l'ordre des traits des Hanzi.

---

## 3. Stack Technique Choisie
* **Framework** : React 18 + Vite + TypeScript (ultra-réactif, chargement instantané)
* **Design & UI** : Tailwind CSS (ambiance zen moderne, palette sobre avec touches rouge carmin chinois & indigo)
* **Typographie & Caractères** : Polices optimisées pour les caractères chinois Hanzi (Noto Sans SC / PingFang SC) avec Pinyin accentué au-dessus ou à côté
* **Icônes** : Lucide React
* **Stockage** : Persistance automatique via custom hooks et `localStorage`

---

## 4. Modèle de Données Métier (TypeScript)

```typescript
export type NuanceCategory = 'temps_aspect' | 'recurrence' | 'collocations' | 'connecteurs';

export interface GrammarNuance {
  id: string;
  title: string;
  category: NuanceCategory;
  summary: string;
  formula: string;               // ex: "Sujet + 又 + Verbe + (Objet) + 了"
  conceptExplanation: string;    // Pourquoi les francophones se trompent
  examples: {
    chinese: string;
    pinyin: string;
    french: string;
    nuanceNote: string;          // Ce qui change par rapport à la version basique
  }[];
  commonMistake: {
    wrong: string;
    correct: string;
    explanation: string;
  };
}

export interface WordChunk {
  id: string;
  theme: string;
  pattern: string;               // ex: "Verbe d'expérience + 过"
  chinese: string;
  pinyin: string;
  french: string;
  contextUsage: string;
}

export interface DayPlan {
  dayNumber: number;
  weekNumber: number;
  theme: string;
  type: 'nuance' | 'chunks' | 'builder' | 'reading' | 'challenge' | 'quiz';
  title: string;
  estimatedMinutes: number;
  description: string;
  completed: boolean;
  contentRefId?: string;
}

export interface GradedStory {
  id: string;
  title: string;
  pinyinTitle: string;
  hskLevel: 'HSK 1-2' | 'HSK 2-3';
  summary: string;
  newWordsAnchored: string[];    // Mots récents réactivés dans l'histoire
  keyNuanceUsed: string;         // Nuance illustrée (ex: "又 vs 再")
  sentences: {
    chinese: string;
    pinyin: string;
    french: string;
    highlightWord?: string;
    grammarTip?: string;
  }[];
}

export interface VoiceExercise {
  id: string;
  situationFrench: string;       // "Situation : Un ami te propose un thé, dis-lui que tu en as déjà bu deux tasses ce matin."
  targetChinese: string;         // "我今天早上已经喝了两杯茶了。"
  targetPinyin: string;          // "Wǒ jīntiān zǎoshang yǐjīng hē le liǎng bēi chá le."
  targetNuance: string;          // "Combinaison 已经...了 pour marquer l'accomplissement"
  difficulty: 'facile' | 'moyen' | 'challenge';
}

export interface VoiceEvaluationResult {
  spokenText: string;
  accuracyScore: number;         // 0 à 100%
  matchedCharacters: {
    char: string;
    status: 'correct' | 'missing' | 'incorrect';
  }[];
  feedbackMessage: string;
}
```

---

## 5. Parcours & Écrans Utilisateur (UI/UX)
1. **Header & Navigation** :
   - Statut de la streak (jours consécutifs), progression du programme 30 jours, accès direct aux modules.
2. **Écran 1 : Tableau de bord & Calendrier 30 Jours** :
   - Vue de la semaine en cours avec la micro-tâche du jour.
   - Statistiques : Chunks maîtrisés, Nuances débloquées, Textes lus, Précision vocale moyenne.
3. **Écran 2 : Histoire du Jour (Daily Graded Reader)** :
   - Micro-récit captivant de 5 à 8 phrases intégrant le vocabulaire récent.
   - Toggle Pinyin Global ON/OFF, révélation instantanée au clic sur un mot, écoute audio ralentie/normale.
4. **Écran 3 : Le Labo Vocal & Correcteur IA (Voice Coach)** :
   - Écoute du modèle audio natif.
   - Bouton Micro interactif 🎙️ (enregistrement et reconnaissance vocale directe en mandarin `zh-CN`).
   - Analyse comparative visuelle caractère par caractère (vert/rouge) et calcul du score de prononciation.
5. **Écran 4 : Le Décodeur de Nuances (Grammar Lab)** :
   - Cartes interactives comparant les faux-amis de la grammaire (ex: `了` vs `过`, `又` vs `再`).
6. **Écran 5 : Constructeur de Pensées (Sentence Builder)** :
   - Blocs interactifs à glisser ou cliquer dans le bon ordre avec validation instantanée.
7. **Écran 6 : Conseils de Lecture & Immersion Graduée** :
   - Recommandations sélectionnées (Mandarin Companion, Du Chinese, Maayot, chaînes YouTube).
8. **Écran 7 : Automatisation & Rappels (MCP / Webhook)** :
   - Configuration d'un rappel quotidien et déclenchement d'un message "Pépite du jour" vers Slack ou n8n.

---

## 6. Règles Pédagogiques & Lignes Directrices
* **Pinyin non-intrusif** : Le Pinyin doit pouvoir être masqué en 1 clic pour stimuler la mémoire visuelle des caractères.
* **Toujours contextualiser les mots** : Aucun mot isolé ne doit être présenté sans son verbe partenaire ou sa particule.
* **Explications en français courant** : Bannir le jargon linguistique abstrait (remplacer *"aspect perfectif post-verbal"* par *"action terminée avec impact présent"*).
 ## 7.Verification personnelle
 tu dois toujours me presenter fonctionnalité par fonctionnalité et t'assurer qu'elle marcheet me la faire valider ( ca peut etre de prefenrece une grosse foncitonnalité pas juste un bouton)
 ## 8 Sécurité
 Le code sera diffusé sur Github Pages, aucune information personnelle ne doit fuiter, si des données sensibles ont en jeu arreter immédiatement, aucune personne ne doit voir mes activités sur le site et y interférer 