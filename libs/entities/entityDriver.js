// import path from 'path';
// import dotenv from 'dotenv';
// dotenv.config({ path: "../.env" });

import uniqueId from 'lodash/uniqueId.js';
import fs from 'fs';
import fsProm from 'fs/promises';


export default class EntityDriver {
    constructor(entities) {   //конструктор создает файлы синхронно
        this.entities = entities;
        this.path = process.env.PATH_TO_DATA_FILE;
        this.fileExt = ".json";

        
    }

    async init(){
        await fsProm.mkdir(this.path, { recursive: true });

        this.entities.map(async entity => {
            const [fileName, filePath] = this._getFileNameAndPath(entity);
            try {
                await fsProm.readFile(filePath, '', { overwrite: false });
                console.log(fileName, filePath);
                console.log('exists: ' + fileName)
            } catch (err) {
                await fsProm.writeFile(filePath, '');
                console.log(fileName, filePath);
                console.log('created: ' + fileName)
            }
        });
    }

    get(entityName, id) {
        return new Promise((resolve, reject) => {
            const fileDataHendler = data => {
                if (id) {
                    const record = data.filter(entityRecord => entityRecord.id === id)
                    resolve(record);
                    return;
                }
                resolve(data);
            }
            const callBackFileAction = () => { };
            this._handleEntityData(entityName, fileDataHendler, callBackFileAction, reject);
        })
    }

    create(entityName, entity) {
        return new Promise((resolve, reject) => {
            const fileDataHendler = (data) => {
                let newId = null;
                let isIncludeId = true;
                const ids = data.map(el => el.id);

                while (isIncludeId) {
                    newId = uniqueId();
                    isIncludeId = ids.includes(newId);
                }

                entity.id = newId;
                data.push(entity);

                return data;
            };

            const callBackFileAction = this._fileWriter(resolve, reject, 'add');
            this._handleEntityData(entityName, fileDataHendler, callBackFileAction, reject);
        });
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