import { v4 as uuidv4 } from 'uuid';
import fsProm from 'fs/promises';


export default class EntityDriver {
    constructor(entities) {
        this.entities = entities;
        this.path = process.env.PATH_TO_DATA_FILE;
        this.fileExt = '.json';
    }

    async init() {
        await fsProm.mkdir(this.path, { recursive: true });

        this.entities.map(async entity => {
            const [fileName, filePath] = this._getFileNameAndPath(entity);
            try {
                await fsProm.readFile(filePath, '', { overwrite: false });
            } catch (err) {
                try {
                    await fsProm.writeFile(filePath, '');
                } catch (err) {
                    throw new Error(`Creating DB file error: ${fileName} (${err.message})`);
                }

            }
        });
    }

    async get(entityName, id) {
        const [, filePath] = this._getFileNameAndPath(entityName);
        const fileContent = await this._getFileContent(filePath);

        if (id) {
            return fileContent.filter(entityRecord => entityRecord.id === id)
        }

        return fileContent;
    }

    async create(entityName, entity) {
        const [, filePath] = this._getFileNameAndPath(entityName);

        const fileContent = await this._getFileContent(filePath);

        entity.id = uuidv4();
        fileContent.push(entity);

        await this._writeFileContent(filePath, fileContent);

        return entity;
    }

    async delete(entityName, id) {
        const [, filePath] = this._getFileNameAndPath(entityName);

        const fileContent = await this._getFileContent(filePath);

        const fileContentUpdated = fileContent.filter(entityRecord => entityRecord.id !== String(id));
        const isAbsent = fileContentUpdated.length === fileContent.length;
        if (isAbsent) {
            throw new Error(`record with id ${id} is absent in ${entityName}s`);
        }

        await this._writeFileContent(filePath, fileContentUpdated);

        return `record with id ${id} is deleted`;
    }

    async update(entityName, entity) {
        const [, filePath] = this._getFileNameAndPath(entityName);

        const fileContent = await this._getFileContent(filePath);

        const entityForUpdate = fileContent.filter(entityRecord => entityRecord.id === String(entity.id));

        if (entityForUpdate.length === 0) {
            throw new Error(`record with id ${entity.id} is absent in ${entityName}s`);
        }

        const fileContentUpdated = fileContent.map(element => {
            if (element.id === String(entity.id)) {
                element = entity;
            }

            return element;
        });

        await this._writeFileContent(filePath, fileContentUpdated);

        return entity;
    }

    _getFileNameAndPath(entity) {
        const fileName = entity + this.fileExt;
        const filePath = this.path + "/" + fileName;

        return [
            fileName,
            filePath
        ];
    }

    async _getFileContent(filePath) {
        try {
            const fileContent = await fsProm.readFile(filePath);
            const fileContentNormalize = fileContent.toString() || '[]';

            return JSON.parse(fileContentNormalize);
        } catch (err) {
            throw new Error(`Read file error: ${err.message}`);
        }
    }

    async _writeFileContent(filePath, fileContent) {
        try {
            await fsProm.writeFile(filePath, JSON.stringify(fileContent));
        } catch (err) {
            throw new Error(`Write file error: ${err.message}`);
        }
    }
}