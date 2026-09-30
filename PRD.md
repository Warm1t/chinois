# 📑 PRD : Fluent — Le Cockpit d'Expression & Nuances en Mandarin (HSK 3-4)

> Application web interactive 100% gratuite (sans abonnement payant) pour passer du vocabulaire mémorisé (Anki) à l'expression fluide de pensées et d'expressions complètes en chinois, avec synchronisation multi-appareils, histoires immersives inspirées de Maayot et correction vocale native.

---

## 1. Vue d'ensemble du Projet

* **Nom du Projet** : Fluent — Mandarin Coach HSK 3-4
* **Pitch en 1 phrase** : L'outil tout-en-un qui transforme tes cartes de vocabulaire Anki en pensées naturelles grâce à l'exploration exhaustive des nuances grammaticales, des histoires quotidiennes immersives (style Maayot) et un entraîneur vocal avec correction en direct.
* **Public Cible** : 
  - Apprenant motivé de niveau **HSK 3 - HSK 4**, capable d'investir un temps d'étude sérieux, connaissant les caractères de base mais cherchant à maîtriser les expressions complètes, les structures idiomatiques et l'aisance à l'oral.
* **Contraintes Techniques Majeures** : 
  - **100 % Gratuit & Zéro Abonnement Obligatoire** : Utilisation des technologies natives du navigateur (Web Speech API `zh-CN` pour le micro, Speech Synthesis pour l'écoute native).
  - **Sauvegarde Universelle Multi-Appareils** : Système de synchronisation Cloud automatique (Supabase + Auth GitHub) pour garantir que la progression ne soit jamais perdue entre PC 1, PC 2 et mobile, complété par une sauvegarde de secours en 1 clic.
  - **Sécurité et Confidentialité Absolues** : Code hébergé sur GitHub Pages public, zéro fuite d'informations sensibles, isolation totale des données personnelles via Row Level Security (RLS).

---

## 2. Architecture & Modules Fonctionnels (Scope Actuel)

### 🌟 Module 1 : L'Accueil Guidé & Répétition Espacée (Home Dashboard)
- Cockpit décisionnel du jour : action recommandée sans fatigue décisionnelle.
- Système d'ancrage cognitif en 3 étapes : 🌱 Découvert ➔ 🌿 En assimilation ➔ 🌳 Ancré.
- Compteur de streak quotidien et statistiques de maîtrise (nuances validées, cartes Anki liées).
- Rappels et intégration de calendrier Google / Apple.

---

### 📖 Module 2 : L'Espace Histoires Immersives (Inspiré à 100% de l'App Maayot)
- **Lecteur immersif en sinogrammes** : Textes calibrés HSK 3-4 authentiques sur fond parchemin/encre.
- **Dictionnaire instantané au clic (One-Click Dictionary)** :
  - Clic sur n'importe quel mot ➔ Popup avec Hanzi géant, Pinyin accentué, traduction française, prononciation audio du mot.
  - Détection automatique et badge *"⭐ Dans ton Anki"* si le mot fait partie des paquets de l'utilisateur.
- **Barre d'outils Maayot** :
  - **Toggle Pinyin** : Afficher ou masquer le Pinyin en un clic pour forcer la lecture en caractères.
  - **Toggle Traduction** : Affichage phrase par phrase sous le texte.
  - **Lecteur Audio Intégré & Vitesse réglable** : Synthèse vocale native à `0.75x` (ralenti pour les tons), `1.0x` (normal) et `1.2x` (accéléré).
- **Générateur d'Histoire Personnalisée Anki (🪄 Exclusivité Fluent)** :
  - Génère instantanément une histoire inédite en contexte à partir de 4 cartes Anki choisies dans le deck de l'utilisateur.
- **Quiz de Compréhension** :
  - 2 à 3 questions à choix multiples avec explications détaillées après réponse.
- **Défi d'Expression Orale & Écrite** :
  - Prompt ouvert de réflexion avec saisie écrite ou dictée au micro (évaluation vocale instantanée).
- **Validation & Streak de lecture** : Bouton pour enregistrer l'histoire comme lue.

---

### 🎙️ Module 3 : Le Labo d'Expression Orale & Correcteur Vocal (Voice Coach Lab)
- Exercices ciblés sur les 18 nuances fondamentales du mandarin HSK 3-4.
- Reconnaissance vocale native en direct (**Web Speech API `zh-CN`**).
- Algorithme d'alignement caractère par caractère :
  - Vert = Caractère correctement prononcé
  - Rouge = Caractère manqué ou ton confondu
- Score de précision en pourcentage (0 à 100%) + feedback immédiat et réessais illimités.
- Validation automatique à partir de 80% de réussite.

---

### 🗂️ Module 4 : Le Répertoire des 5 Modules & 18 Nuances (Curriculum Overview)
- **Module 1 : Aspects & Temps** (`了1`, `了2`, `了1+2`, `过`, `着`, `在`).
- **Module 2 : Récurrence & Répétition** (`又`, `再`, `还`, `往往`, `常常`).
- **Module 3 : Compléments de Résultat & de Potentiel** (`完`, `到`, `见`, `懂`, `得/不`).
- **Module 4 : Structures Spéciales** (`把`, `被`, `是...的`, `连...都`).
- **Module 5 : Connecteurs & Fluidité** (`虽然...但是`, `只要...就`, `越来越`).
- Chaque fiche contient : Situation concrète, formule structurelle, explication de la pensée chinoise, pièges typiques des francophones et test de discrimination active.

---

### ⚡ Module 5 : Liaison Anki Universelle (Multi-Paquets & Multi-Appareils)
- **Connexion Directe AnkiConnect** :
  - Configuration universelle CORS `*` et bind `0.0.0.0` (accessible en local et en Wi-Fi).
  - Script d'automatisation en 1 clic : [`configurer_anki.bat`](file:///d:/chinois/configurer_anki.bat).
  - Détection automatique de tous les paquets de l'utilisateur et synchronisation groupée en 1 clic.
- **Mode Nomade & Sauvegarde Sans Proxy** :
  - Importation par glisser-déposer de fichiers texte, TSV, CSV ou JSON.
  - Exportation des cartes liées en fichier `.json` pour utilisation sur mobile ou autre PC sans Anki.

---

### ☁️ Module 6 : Synchronisation de Profil & Sauvegarde Permanente
- **Stockage initial local** : Sauvegarde dans le `localStorage` du navigateur.
- **Sauvegarde manuelle 1-clic** : Fenêtre `ProfileSyncModal` permettant de télécharger et restaurer l'intégralité du profil (`fluent-progression.json`).
- **Synchronisation Cloud Automatique (Supabase)** :
  - Base de données Cloud PostgreSQL gratuite.
  - Authentification GitHub OAuth pour un accès strictement personnel et sécurisé.
  - Mise à jour en temps réel et automatique de la progression à chaque exercice validé ou histoire lue.

---

## 3. Stack Technique Choisie

| Composant | Technologie | Justification |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript | Composants typés, robustesse, réactivité maximale |
| **Build & Bundler** | Vite 5 | Démarrage en 300ms, proxy dev, build optimisé |
| **Styling & Thème** | Tailwind CSS | Design soigné style Encre & Papier, responsive mobile/PC |
| **Reconnaissance Vocale** | Web Speech API (`SpeechRecognition` zh-CN) | 100% gratuit, natif, sans clé API payante |
| **Synthèse Vocale** | Web Speech Synthesis (`SpeechSynthesisUtterance`) | Voix chinoise native avec contrôle de vitesse (0.75x à 1.2x) |
| **Base de Données Cloud** | Supabase (PostgreSQL + RLS) | Gratuit à vie, synchronisation temps réel, sécurisé |
| **Liaison Anki** | AnkiConnect RPC (Code 2055492159) | Standard mondial open-source pour connecter Anki |
| **Hébergement** | GitHub Pages (Déploiement continu Actions) | Gratuit, sécurisé en HTTPS, zéro coût de serveur |

---

## 4. Modèle de Données Métier (TypeScript)

```typescript
// --- Modèle Profil & Sauvegarde ---
export interface UserProfileBackup {
  version: number;
  exportedAt: string;
  completedExercises: string[];
  streakDays: number;
  syncedAnkiWords: AnkiWord[];
  anchoringRecords: Record<string, AnchoringRecord>;
  completedStoryIds?: string[];
  reminderTime?: string;
  webhookUrl?: string;
}

// --- Modèle Histoire Maayot ---
export interface MaayotStory {
  id: string;
  title: string;
  titlePinyin: string;
  titleTranslation: string;
  level: 'HSK 3' | 'HSK 4';
  category: string;
  readTime: string;
  wordCount: number;
  targetWords: { hanzi: string; pinyin: string; translation: string }[];
  paragraphs: {
    sentences: {
      hanzi: string;
      pinyin: string;
      translation: string;
      words: { hanzi: string; pinyin: string; translation: string; isTarget?: boolean }[];
    }[];
  }[];
  audioText: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  discussionPrompt: {
    question: string;
    questionTranslation: string;
    suggestedWords?: string[];
  };
}

// --- Modèle Nuance & Évaluation Vocale ---
export interface NuanceCard {
  id: string;
  moduleId: string;
  level: 'HSK 3' | 'HSK 4';
  category: NuanceCategory;
  title: string;
  structuralFormula: string;
  targetChinese: string;
  targetPinyin: string;
  translationFrench: string;
  activeTest: ActiveTestQuestion;
}

export interface VoiceEvaluationResult {
  spokenText: string;
  accuracyScore: number;
  matchedCharacters: { char: string; status: 'correct' | 'incorrect' | 'missing' }[];
  feedbackMessage: string;
  isPerfect: boolean;
}
```

---

## 5. Règles Pédagogiques & Lignes Directrices

1. **Pinyin non-intrusif & désactivable** : Le pinyin est une béquille temporaire. Il doit pouvoir être activé/masqué en un seul clic à tout moment.
2. **Contextualisation absolue** : Aucun caractère ou mot Anki ne doit être appris isolément ; ils doivent toujours vivre au sein d'expressions idiomatiques ou de récits complets.
3. **Explications en français clair** : Proscrire le jargon linguistique théorique (remplacer *"aspect perfectif post-verbal"* par *"action achevée produisant un état nouveau"*).
4. **Zéro friction technique** : Lancer l'application en 1 double-clic via `lancer_app.bat` et configurer Anki via `configurer_anki.bat`.

---

## 6. Vérification & Validation par l'Utilisateur (Règle d'or)

* Chaque fonctionnalité majeure doit être présentée pas à pas, avec une démonstration de son bon fonctionnement et une demande explicite de validation auprès de l'utilisateur avant de passer au chantier suivant.

---

## 7. Sécurité & Confidentialité des Données (Règle d'or)

* **Code public, données privées** : Le code source étant hébergé publiquement sur GitHub et déployé sur GitHub Pages, aucune information personnelle (historique d'apprentissage, notes, identifiants, clés privées) ne doit figurer dans le code ou les commits.
* **Cloisonnement total (RLS)** : Dans la base Supabase, la politique de sécurité Row Level Security (RLS) doit impérativement restreindre la lecture et l'écriture à l'utilisateur authentifié uniquement (`auth.uid() = user_id`).
* **Zéro interférence tierce** : Aucun visiteur du site GitHub Pages ne doit pouvoir visualiser, modifier ou perturber la progression de l'utilisateur.