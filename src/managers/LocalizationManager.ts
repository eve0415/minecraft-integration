import { resolve } from 'path';
import { ModuleManager, ModuleData } from './structures';
import { logger } from '..';
import { Language } from '../typings';

export class LocalizationManager extends ModuleManager<string, Language> {
    public register(data: ModuleData<string, Language>): Language {
        const language = data.value;
        logger.info(`Loading language: ${language.code}`);
        if (language.default && this.find(l => l.default)) {
            const d = this.find(l => l.default);
            logger.error('Trying to register two default localizations!');
            logger.error(`${d?.code} is registered as default. Failed to regsiter ${language.code}`);
            throw new Error('Cannot register duplicate default localizations');
        }
        return super.register(data);
    }

    public async registerAll(): Promise<void> {
        logger.info('Trying to read all languages');
        const dir = resolve(`${__dirname}/../localization`);
        const modules = this.scanModule(dir, /.js|.ts/);
        const result = (await Promise.all(modules.map(file => this.loadModule(file))))
            .filter<Language>((value): value is Language => value instanceof Language)
            .map<ModuleData<string, Language>>(language => this.toModuleData(language));
        await super.registerAll(result);
        logger.info(`Successfully loaded ${this.size} languages`);
        if (!this.find(l => l.default)) logger.warn('No default localizations loaded. ');
    }

    protected toModuleData(language: Language): ModuleData<string, Language> {
        return {
            key: language.code,
            value: language,
        };
    }

    public getLocalization(): Language | undefined {
        // TODO: localization per channel or message
        return this.find(l => l.default);
    }
}
