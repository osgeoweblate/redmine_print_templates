import type { Template, BasePdf } from '@pdfme/common';
import { PDFME_VERSION } from '@pdfme/common';

export const supportedLocales = ['en', 'ja', 'ar', 'th', 'it', 'pl', 'zh', 'ko', 'de', 'es', 'fr'] as const;

export const defaultTemplate: Template = {
  basePdf: {
    width: 210,
    height: 297,
    padding: [15, 10, 15, 10]
  } as BasePdf,
  schemas: [[]], // First array for pages, second for fields
  pdfmeVersion: PDFME_VERSION
};

export const themeSettings = {
  token: {
    colorPrimary: '#f1515c'
  },
};
