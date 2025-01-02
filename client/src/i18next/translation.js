// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

import { translation_en } from './en';
import { translation_zh_CN } from './zh-CN';
import { translation_zh_TW } from './zh-TW';

export const translation_resources = {
    en: translation_en,
    'zh-CN': translation_zh_CN,
    'zh-TW': translation_zh_TW
};
