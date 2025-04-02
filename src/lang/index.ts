import MessageDialog from 'i18n';
import path from 'path';
import { Config as cfg } from '../constanta';

MessageDialog.configure({
  locales: ['en', 'id'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: cfg.AppLang,
  objectNotation: true,
  autoReload: true,
  updateFiles: false,
  syncFiles: true,
  register: global,
});

export { MessageDialog };
