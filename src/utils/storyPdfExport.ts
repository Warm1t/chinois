import { MaayotStory, StorySentence } from '../types/fluent';
import { AudioNovel, NovelPage } from '../types/novel';
import { analyzeSentenceRhythm } from './chineseRhythmEngine';

export interface PdfExportOptions {
  layoutMode: 'interlinear' | 'classic' | 'immersion';
  includePinyin: boolean;
  includeTranslation: boolean;
  includeVocabulary: boolean;
  includeQuiz?: boolean;
  novelScope?: 'all' | 'chapter' | 'page';
  currentChapterNumber?: number;
  currentPageNumber?: number;
}

const escapeHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Génère le HTML d'une phrase selon le mode de mise en page choisi
 */
const renderSentenceHtml = (
  sentence: StorySentence,
  idx: number,
  options: PdfExportOptions
): string => {
  const analysis = analyzeSentenceRhythm(sentence);
  const allWords = analysis.chunks.flatMap((c) => c.words);

  if (options.layoutMode === 'interlinear') {
    const wordsHtml = allWords
      .map((w) => {
        const cleanHanzi = escapeHtml(w.hanzi);
        const cleanPinyin = options.includePinyin && w.pinyin ? escapeHtml(w.pinyin) : '';
        const cleanTrans = w.translation ? escapeHtml(w.translation) : '';
        return `
          <div class="word-box">
            ${cleanPinyin ? `<span class="word-pinyin">${cleanPinyin}</span>` : ''}
            <span class="word-hanzi">${cleanHanzi}</span>
            ${cleanTrans ? `<span class="word-gloss">${cleanTrans}</span>` : ''}
          </div>
        `;
      })
      .join('');

    return `
      <div class="sentence-card">
        <div class="sentence-header">
          <span class="sentence-num">#${idx + 1}</span>
          <span class="sentence-full-hanzi">${escapeHtml(sentence.hanzi)}</span>
        </div>
        <div class="words-flow">
          ${wordsHtml}
        </div>
        ${
          options.includeTranslation && sentence.translation
            ? `<div class="sentence-translation"><strong>Sens :</strong> « ${escapeHtml(sentence.translation)} »</div>`
            : ''
        }
      </div>
    `;
  }

  if (options.layoutMode === 'classic') {
    return `
      <div class="classic-sentence">
        <div class="classic-hanzi">
          <span class="sentence-num-inline">${idx + 1}.</span> ${escapeHtml(sentence.hanzi)}
        </div>
        ${
          options.includePinyin && sentence.pinyin
            ? `<div class="classic-pinyin">${escapeHtml(sentence.pinyin)}</div>`
            : ''
        }
        ${
          options.includeTranslation && sentence.translation
            ? `<div class="classic-translation">« ${escapeHtml(sentence.translation)} »</div>`
            : ''
        }
      </div>
    `;
  }

  // Mode 'immersion' (Hanzi purs, grands caractères, optionnellement traduction en fin)
  return `
    <span class="immersion-sentence">
      ${escapeHtml(sentence.hanzi)}
    </span>
  `;
};

/**
 * Styles CSS d'impression A4 soignés pour les caractères chinois, le Pinyin et le français
 */
const getPrintStyles = (): string => `
  @page {
    size: A4 portrait;
    margin: 16mm 15mm 18mm 15mm;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    font-family: "Noto Serif SC", "Songti SC", "SimSun", "Microsoft YaHei", "PingFang SC", Georgia, serif;
    color: #1c1917;
    background: #ffffff;
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }
  .print-toolbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #1c1917;
    color: #fff;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: system-ui, -apple-system, sans-serif;
    border-bottom: 3px solid #c23b22;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .print-toolbar-title {
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .print-toolbar-actions {
    display: flex;
    gap: 10px;
  }
  .btn-print {
    background: #c23b22;
    color: #fff;
    border: none;
    padding: 8px 18px;
    border-radius: 10px;
    font-weight: 800;
    font-size: 13px;
    cursor: pointer;
  }
  .btn-print:hover {
    background: #a8321c;
  }
  .btn-close {
    background: #333;
    color: #ddd;
    border: 1px solid #555;
    padding: 8px 14px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }
  @media print {
    .print-toolbar {
      display: none !important;
    }
    body {
      padding: 0;
    }
  }
  .doc-container {
    max-width: 210mm;
    margin: 0 auto;
    padding: 16px 20px;
  }
  .doc-header {
    border-bottom: 2px solid #1c1917;
    padding-bottom: 14px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .doc-badge {
    display: inline-block;
    background: #c23b22;
    color: #fff;
    font-family: system-ui, sans-serif;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 9px;
    border-radius: 99px;
    margin-bottom: 6px;
  }
  .doc-title-zh {
    font-size: 28px;
    font-weight: 900;
    margin: 0;
    color: #1c1917;
    letter-spacing: 0.03em;
  }
  .doc-title-py {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    color: #c23b22;
    font-weight: 600;
    margin: 3px 0 0 0;
  }
  .doc-title-fr {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 15px;
    color: #57534e;
    font-weight: 700;
    margin: 4px 0 0 0;
  }
  .doc-meta {
    text-align: right;
    font-family: system-ui, sans-serif;
    font-size: 11px;
    color: #78716c;
  }
  .synopsis-box {
    background: #faf8f5;
    border: 1px solid #e7e5e4;
    border-left: 4px solid #c23b22;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-size: 12.5px;
  }
  .synopsis-zh {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #292524;
  }
  .synopsis-fr {
    font-family: system-ui, sans-serif;
    color: #57534e;
    font-style: italic;
  }
  .chapter-banner {
    background: #f5f5f4;
    border: 1.5px solid #1c1917;
    border-radius: 12px;
    padding: 10px 16px;
    margin: 22px 0 14px 0;
    page-break-after: avoid;
    break-after: avoid;
  }
  .chapter-banner-top {
    font-family: system-ui, sans-serif;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    color: #c23b22;
    letter-spacing: 0.08em;
  }
  .chapter-banner-zh {
    font-size: 20px;
    font-weight: 900;
    color: #1c1917;
    margin-top: 2px;
  }
  .chapter-banner-sub {
    font-family: system-ui, sans-serif;
    font-size: 12px;
    color: #57534e;
  }
  /* Cartes interlinéaires */
  .sentence-card {
    border: 1px solid #d6d3d1;
    border-radius: 12px;
    padding: 10px 14px;
    margin-bottom: 11px;
    background: #ffffff;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .sentence-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    border-bottom: 1px dashed #e7e5e4;
    padding-bottom: 6px;
    margin-bottom: 8px;
  }
  .sentence-num {
    font-family: ui-monospace, monospace;
    font-size: 10px;
    font-weight: 800;
    color: #c23b22;
    background: #fef2f2;
    padding: 1px 6px;
    border-radius: 4px;
  }
  .sentence-full-hanzi {
    font-size: 15px;
    font-weight: 700;
    color: #44403c;
  }
  .words-flow {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 10px;
    align-items: flex-end;
    padding: 2px 0;
  }
  .word-box {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: #fafaf9;
    border: 1px solid #e7e5e4;
    border-radius: 8px;
    padding: 4px 8px;
  }
  .word-pinyin {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: #c23b22;
    line-height: 1.2;
  }
  .word-hanzi {
    font-size: 19px;
    font-weight: 900;
    color: #1c1917;
    line-height: 1.3;
    letter-spacing: 0.04em;
  }
  .word-gloss {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 9px;
    color: #78716c;
    max-width: 110px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sentence-translation {
    margin-top: 8px;
    padding-top: 6px;
    border-top: 1px solid #f5f5f4;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    color: #292524;
  }
  /* Mode Classique */
  .classic-sentence {
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f5f5f4;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .sentence-num-inline {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    color: #c23b22;
    font-weight: 800;
    margin-right: 4px;
  }
  .classic-hanzi {
    font-size: 19px;
    font-weight: 800;
    color: #1c1917;
    line-height: 1.6;
  }
  .classic-pinyin {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    color: #c23b22;
    font-weight: 600;
    margin-top: 2px;
  }
  .classic-translation {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12.5px;
    color: #57534e;
    font-style: italic;
    margin-top: 3px;
  }
  /* Mode Immersion */
  .immersion-paragraph {
    font-size: 22px;
    font-weight: 700;
    line-height: 2.0;
    text-indent: 2em;
    margin-bottom: 16px;
    color: #1c1917;
    letter-spacing: 0.05em;
  }
  /* Table du Vocabulaire */
  .vocab-section {
    margin-top: 24px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .section-title {
    font-family: system-ui, sans-serif;
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #1c1917;
    border-bottom: 2px solid #1c1917;
    padding-bottom: 6px;
    margin-bottom: 12px;
  }
  .vocab-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .vocab-item {
    border: 1px solid #e7e5e4;
    border-radius: 8px;
    padding: 6px 10px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    background: #fafaf9;
  }
  .vocab-zh {
    font-size: 16px;
    font-weight: 900;
    color: #1c1917;
  }
  .vocab-py {
    font-family: system-ui, sans-serif;
    font-size: 11px;
    color: #c23b22;
    font-weight: 700;
    margin-left: 6px;
  }
  .vocab-fr {
    font-family: system-ui, sans-serif;
    font-size: 11.5px;
    color: #57534e;
    font-weight: 600;
    text-align: right;
  }
  /* Quiz Section */
  .quiz-section {
    margin-top: 24px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .quiz-card {
    border: 1px solid #e7e5e4;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 10px;
    font-family: system-ui, sans-serif;
    font-size: 12px;
  }
  .quiz-q {
    font-weight: 800;
    color: #1c1917;
    margin-bottom: 6px;
  }
  .quiz-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px 12px;
    color: #44403c;
  }
  .doc-footer {
    margin-top: 30px;
    padding-top: 10px;
    border-top: 1px solid #e7e5e4;
    text-align: center;
    font-family: system-ui, sans-serif;
    font-size: 10px;
    color: #a8a29e;
  }
`;

/**
 * Ouvre une fenêtre d'impression PDF propre et déclenche l'impression / enregistrement PDF
 */
const openPrintWindow = (title: string, bodyHtml: string) => {
  const printWin = window.open('', '_blank', 'width=960,height=800');
  if (!printWin) {
    alert("Veuillez autoriser l'ouverture des pop-ups pour exporter le PDF.");
    return;
  }

  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)} — Export PDF Fluent</title>
  <style>${getPrintStyles()}</style>
</head>
<body>
  <div class="print-toolbar">
    <div class="print-toolbar-title">
      <span>📄 Aperçu avant export PDF : <strong>${escapeHtml(title)}</strong></span>
    </div>
    <div class="print-toolbar-actions">
      <button class="btn-print" onclick="window.print()">🖨️ Enregistrer en PDF / Imprimer</button>
      <button class="btn-close" onclick="window.close()">Fermer</button>
    </div>
  </div>
  <div class="doc-container">
    ${bodyHtml}
    <div class="doc-footer">
      Fluent Mandarin • Document d'étude bilingue généré le ${new Date().toLocaleDateString('fr-FR')}
    </div>
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;

  printWin.document.open();
  printWin.document.write(fullHtml);
  printWin.document.close();
};

/**
 * Exporter une histoire courte (MaayotStory) en PDF
 */
export const exportStoryToPdf = (story: MaayotStory, options: PdfExportOptions) => {
  let globalIdx = 0;

  const paragraphsHtml = story.paragraphs
    .map((p) => {
      if (options.layoutMode === 'immersion') {
        const inner = p.sentences
          .map((s) => {
            const html = renderSentenceHtml(s, globalIdx, options);
            globalIdx++;
            return html;
          })
          .join('');
        const translationsBlock =
          options.includeTranslation
            ? `<div style="font-family: system-ui, sans-serif; font-size: 12px; color: #57534e; margin-bottom: 14px; padding-left: 12px; border-left: 3px solid #e7e5e4;">
                ${p.sentences.map((s) => `<div>• ${escapeHtml(s.translation)}</div>`).join('')}
              </div>`
            : '';
        return `<div class="immersion-paragraph">${inner}</div>${translationsBlock}`;
      }

      return p.sentences
        .map((s) => {
          const html = renderSentenceHtml(s, globalIdx, options);
          globalIdx++;
          return html;
        })
        .join('');
    })
    .join('');

  const vocabHtml =
    options.includeVocabulary && story.targetWords && story.targetWords.length > 0
      ? `
      <div class="vocab-section">
        <div class="section-title">📌 Vocabulaire Clé de l'Histoire (${story.targetWords.length} mots)</div>
        <div class="vocab-grid">
          ${story.targetWords
            .map(
              (w) => `
            <div class="vocab-item">
              <div>
                <span class="vocab-zh">${escapeHtml(w.hanzi)}</span>
                <span class="vocab-py">${escapeHtml(w.pinyin)}</span>
              </div>
              <div class="vocab-fr">${escapeHtml(w.translation)}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
      : '';

  const quizHtml =
    options.includeQuiz && story.quiz && story.quiz.length > 0
      ? `
      <div class="quiz-section">
        <div class="section-title">🎯 Quiz de Compréhension</div>
        ${story.quiz
          .map(
            (q, i) => `
          <div class="quiz-card">
            <div class="quiz-q">${i + 1}. ${escapeHtml(q.question)}</div>
            <div class="quiz-options">
              ${q.options
                .map((opt, oIdx) => `<div>${String.fromCharCode(65 + oIdx)}. ${escapeHtml(opt)}</div>`)
                .join('')}
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `
      : '';

  const bodyHtml = `
    <div class="doc-header">
      <div>
        <span class="doc-badge">${escapeHtml(story.level)} • ${escapeHtml(story.category)}</span>
        <h1 class="doc-title-zh">${escapeHtml(story.title)}</h1>
        ${options.includePinyin ? `<p class="doc-title-py">${escapeHtml(story.titlePinyin)}</p>` : ''}
        <p class="doc-title-fr">${escapeHtml(story.titleTranslation)}</p>
      </div>
      <div class="doc-meta">
        <div>⏱️ Lecture : ${escapeHtml(story.readTime)}</div>
        <div>📝 ${story.wordCount} caractères</div>
      </div>
    </div>
    ${paragraphsHtml}
    ${vocabHtml}
    ${quizHtml}
  `;

  openPrintWindow(`${story.title} (${story.titleTranslation})`, bodyHtml);
};

/**
 * Exporter plusieurs histoires (ex: toutes les histoires générées par l'utilisateur) en un seul recueil PDF
 */
export const exportMultipleStoriesToPdf = (stories: MaayotStory[], options: PdfExportOptions) => {
  if (!stories.length) return;

  const allStoriesHtml = stories
    .map((story, sIdx) => {
      let globalIdx = 0;
      const paragraphsHtml = story.paragraphs
        .map((p) =>
          p.sentences
            .map((s) => {
              const html = renderSentenceHtml(s, globalIdx, options);
              globalIdx++;
              return html;
            })
            .join('')
        )
        .join('');

      const vocabHtml =
        options.includeVocabulary && story.targetWords && story.targetWords.length > 0
          ? `
          <div class="vocab-section">
            <div class="section-title">📌 Vocabulaire Clé (${story.targetWords.length} mots)</div>
            <div class="vocab-grid">
              ${story.targetWords
                .map(
                  (w) => `
                <div class="vocab-item">
                  <div>
                    <span class="vocab-zh">${escapeHtml(w.hanzi)}</span>
                    <span class="vocab-py">${escapeHtml(w.pinyin)}</span>
                  </div>
                  <div class="vocab-fr">${escapeHtml(w.translation)}</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
          : '';

      return `
        <div style="${sIdx > 0 ? 'page-break-before: always; break-before: page;' : ''}">
          <div class="doc-header">
            <div>
              <span class="doc-badge">Histoire ${sIdx + 1}/${stories.length} • ${escapeHtml(story.level)}</span>
              <h1 class="doc-title-zh">${escapeHtml(story.title)}</h1>
              ${options.includePinyin ? `<p class="doc-title-py">${escapeHtml(story.titlePinyin)}</p>` : ''}
              <p class="doc-title-fr">${escapeHtml(story.titleTranslation)}</p>
            </div>
            <div class="doc-meta">
              <div>${escapeHtml(story.category)}</div>
              <div>📝 ${story.wordCount} caractères</div>
            </div>
          </div>
          ${paragraphsHtml}
          ${vocabHtml}
        </div>
      `;
    })
    .join('');

  openPrintWindow(`Recueil de ${stories.length} Histoires Mandarin`, allStoriesHtml);
};

/**
 * Exporter un Roman Audio Classique (AudioNovel) en PDF
 */
export const exportNovelToPdf = (novel: AudioNovel, options: PdfExportOptions) => {
  let pagesToExport: NovelPage[] = novel.pages;
  let subtitleScope = `Roman Complet (${novel.totalChapters} chapitres • ${novel.totalPages} pages)`;

  if (options.novelScope === 'chapter' && options.currentChapterNumber) {
    pagesToExport = novel.pages.filter((p) => p.chapterNumber === options.currentChapterNumber);
    const chMeta = novel.chaptersMeta.find((c) => c.chapterNumber === options.currentChapterNumber);
    subtitleScope = `Chapitre ${options.currentChapterNumber} : ${chMeta?.title || ''} (${chMeta?.titleTranslation || ''})`;
  } else if (options.novelScope === 'page' && options.currentPageNumber) {
    pagesToExport = novel.pages.filter((p) => p.pageNumber === options.currentPageNumber);
    subtitleScope = `Page ${options.currentPageNumber} / ${novel.totalPages}`;
  }

  let globalSentenceIdx = 0;
  let lastChapterNum = -1;

  const pagesHtml = pagesToExport
    .map((page) => {
      let chapterBanner = '';
      if (page.chapterNumber !== lastChapterNum) {
        lastChapterNum = page.chapterNumber;
        chapterBanner = `
          <div class="chapter-banner">
            <div class="chapter-banner-top">Chapitre ${page.chapterNumber} • Pages ${
          novel.chaptersMeta.find((c) => c.chapterNumber === page.chapterNumber)?.startPage || page.pageNumber
        }–${novel.chaptersMeta.find((c) => c.chapterNumber === page.chapterNumber)?.endPage || page.pageNumber}</div>
            <div class="chapter-banner-zh">${escapeHtml(page.chapterTitle)}</div>
            <div class="chapter-banner-sub">
              ${options.includePinyin ? `${escapeHtml(page.chapterTitlePinyin)} — ` : ''}${escapeHtml(
          page.chapterTitleTranslation
        )}
            </div>
          </div>
        `;
      }

      const pageHeader = `
        <div style="font-family: system-ui, sans-serif; font-size: 11px; font-weight: 800; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; margin: 14px 0 8px 0;">
          — Page ${page.pageNumber} / ${novel.totalPages} —
        </div>
      `;

      const sentencesHtml = page.paragraphs
        .map((par) => {
          if (options.layoutMode === 'immersion') {
            const inner = par.sentences
              .map((s) => {
                const html = renderSentenceHtml(s, globalSentenceIdx, options);
                globalSentenceIdx++;
                return html;
              })
              .join('');
            return `<div class="immersion-paragraph">${inner}</div>`;
          }

          return par.sentences
            .map((s) => {
              const html = renderSentenceHtml(s, globalSentenceIdx, options);
              globalSentenceIdx++;
              return html;
            })
            .join('');
        })
        .join('');

      return `${chapterBanner}${pageHeader}${sentencesHtml}`;
    })
    .join('');

  const vocabHtml =
    options.includeVocabulary && novel.keyVocabulary && novel.keyVocabulary.length > 0
      ? `
      <div class="vocab-section">
        <div class="section-title">📌 Vocabulaire Clé de l'Œuvre</div>
        <div class="vocab-grid">
          ${novel.keyVocabulary
            .map(
              (w) => `
            <div class="vocab-item">
              <div>
                <span class="vocab-zh">${escapeHtml(w.hanzi)}</span>
                <span class="vocab-py">${escapeHtml(w.pinyin)}</span>
              </div>
              <div class="vocab-fr">${escapeHtml(w.translation)}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
      : '';

  const bodyHtml = `
    <div class="doc-header">
      <div>
        <span class="doc-badge">${escapeHtml(novel.level)} • ${escapeHtml(novel.genre)}</span>
        <h1 class="doc-title-zh">${escapeHtml(novel.coverEmoji)} ${escapeHtml(novel.title)}</h1>
        ${options.includePinyin ? `<p class="doc-title-py">${escapeHtml(novel.titlePinyin)}</p>` : ''}
        <p class="doc-title-fr">${escapeHtml(novel.titleTranslation)}</p>
      </div>
      <div class="doc-meta">
        <div><strong>${escapeHtml(subtitleScope)}</strong></div>
        <div>📝 ${novel.wordCount} sinogrammes au total</div>
      </div>
    </div>
    <div class="synopsis-box">
      <div class="synopsis-zh">${escapeHtml(novel.synopsis)}</div>
      ${options.includeTranslation ? `<div class="synopsis-fr">${escapeHtml(novel.synopsisTranslation)}</div>` : ''}
    </div>
    ${pagesHtml}
    ${vocabHtml}
  `;

  openPrintWindow(`${novel.title} — ${subtitleScope}`, bodyHtml);
};

