import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
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
                console.log(fileName, filePath);
                console.log('exists: ' + fileName);
            } catch (err) {
                try {
                    await fsProm.writeFile(filePath, '');
                    console.log(fileName, filePath);
                    console.log('created: ' + fileName);
                } catch (err) {
                    throw new Error(`Creating DB file error: ${fileName} (${err.message})`);
                }

            }
        });
    }

    async get(entityName, id) {
        const [, filePath] = this._getFileNameAndPath(entityName);
        const fileContent = await this.getFileContent(filePath);

        if (id) {
            return fileContent.filter(entityRecord => entityRecord.id === id)
        }

        return fileContent;
    }

    async getFileContent(filePath) {
        try {
            const fileContent = await fsProm.readFile(filePath);
            const fileContentNormalize = fileContent.toString() || '[]';

            return JSON.parse(fileContentNormalize);
        } catch (err) {
            throw new Error(`Read file error: ${err.message}`);
        }
    }

    async writeFileContent(filePath, fileContent) {
        try {
            await fsProm.writeFile(filePath, JSON.stringify(fileContent));
        } catch (err) {
            throw new Error(`Write file error: ${err.message}`);
        }
    }

    async create(entityName, entity) {
        const [, filePath] = this._getFileNameAndPath(entityName);

        const fileContent = await this.getFileContent(filePath);

        entity.id = uuidv4();
        fileContent.push(entity);

        await this.writeFileContent(filePath, fileContent);

        return entity;
    }

    delete(entityName, id) {
        return new Promise((resolve, reject) => {
            const fileDataHendler = (data) => {
                const dataUpdated = data.filter(entityRecord => entityRecord.id !== String(id));
                const isAbsent = dataUpdated.length === data.length;
                if (isAbsent) {
                    reject(`record with id ${id} is absent in ${entityName}`);
                    return;
                }

                return dataUpdated;
            };

            const callBackFileAction = this._fileWriter(resolve, reject, 'delet');
            this._handleEntityData(entityName, fileDataHendler, callBackFileAction, reject);
        })
    }

    update(entityName, entity) {
        return new Promise((resolve, reject) => {
            const fileDataHendler = (data) => {
                const updatedData = data.map(element => {
                    if (element.id === String(entity.id)) {
                        element = entity;
                    }

                    return element;
                });

                return updatedData;
            };

            const callBackFileAction = this._fileWriter(resolve, reject, 'updat');
            this._handleEntityData(entityName, fileDataHendler, callBackFileAction, reject);
        })
    }

    _getFileNameAndPath(entity) {
        const fileName = entity + this.fileExt;
        const filePath = this.path + "/" + fileName;

        return [
            fileName,
            filePath
        ];
    }

    _handleEntityData(entityName, fileDataHendler, callBackFileAction, reject) {
        this.entities.filter(oneRecord => {
            if (oneRecord === entityName) {
                const [, filePath] = this._getFileNameAndPath(entityName);

                fs.promises.readFile(filePath)
                    .then(fileData => {

                        fileData = bufferToString(fileData)

                        let fileInfo = JSON.parse(fileData);

                        const data = fileDataHendler(fileInfo);
                        if (!data) {
                            return;
                        }

                        callBackFileAction(data, entityName, filePath);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });

        function bufferToString(fileData) {
            fileData = fileData.toString();

            if (!fileData) {
                console.log(`no data in file "${entityName}"`);
                fileData = "[]";
            }

            return fileData;
        }
    }

    _fileWriter(resolve, reject, action) {
        return (data, entityName, filePath) => {
            fs.promises.writeFile(filePath, JSON.stringify(data))
                .then(() => {
                    resolve(`entity is ${action}ed to "${entityName}"`);
                })
                .catch(err => {
                    reject(`error ${action}ing to "${entityName}" ERROR:${err}`);
                });
        }
    }
}