import { HskLevel, StoryParagraph } from './fluent';

export interface NovelPage {
  pageNumber: number;        // 1 à 30
  chapterNumber: number;     // 1 à 6
  chapterTitle: string;
  chapterTitlePinyin: string;
  chapterTitleTranslation: string;
  paragraphs: StoryParagraph[];
  audioText: string;
}

export interface NovelChapterMeta {
  chapterNumber: number;
  title: string;
  titlePinyin: string;
  titleTranslation: string;
  startPage: number;
  endPage: number;
}

export interface AudioNovel {
  id: string;
  title: string;
  titlePinyin: string;
  titleTranslation: string;
  level: HskLevel | 'HSK 3' | 'HSK 4';
  genre: string;
  coverEmoji: string;
  coverColor: string;
  totalPages: number;
  totalChapters: number;
  estimatedListeningTime: string;
  wordCount: number;
  synopsis: string;
  synopsisTranslation: string;
  keyVocabulary: {
    hanzi: string;
    pinyin: string;
    translation: string;
  }[];
  chaptersMeta: NovelChapterMeta[];
  pages: NovelPage[];
}
