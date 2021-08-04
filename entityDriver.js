const _ = require('lodash');
const fs = require('fs');


class EntityDriver {
    constructor(entities) {   //конструктор создает файлы синхронно
        this.entities = entities;
        this.path = process.env.PATH_TO_DATA_FILE;
        this.fileExt = ".json";

        fs.mkdirSync(this.path, { recursive: true })

        entities.map(entity => {
            const [fileName, filePath] = this._getFileNameAndPath(entity);
            console.log(fileName, filePath);
            try {
                fs.readFileSync(filePath, '', { overwrite: false });
                console.log('exists: ' + fileName)
            } catch (err) {
                fs.writeFileSync(filePath, '');
                console.log('created: ' + fileName)
            }
        });
    }


    get(entityName, id) {
        return new Promise((resolve, reject) => {
            const callback = data => {
                if (id) {
                    const record = data.filter(entityRecord => entityRecord.id === id)
                    resolve(JSON.stringify(record), ' \n', ` it was "${entityName}" data`);
                    return;
                }
                resolve(JSON.stringify(data), ' \n', ` it was "${entityName}" data`);
            }
            const callBackFileAction = () => { };
            this._handleEntityData(entityName, callback, callBackFileAction, reject);
        })
    }

    create(entityName, entity) {
        return new Promise((resolve, reject) => {
            const callback = (data) => {
                const newId = _.uniqueId();
                const isExists = data.filter(entityRecord => entityRecord.id === newId).length >= 1;
                if (isExists) {
                    reject(`record with id ${newId} allready exists`);
                    return;
                }

                entity.id = newId;
                data.push(entity);
                return data;
            };
            const callBackFileAction = this._fileWriter(resolve, reject, 'add');
            this._handleEntityData(entityName, callback, callBackFileAction, reject);
        })
    }

    delete(entityName, id) {
        return new Promise((resolve, reject) => {
            const callback = (data) => {
                const dataUpdated = data.filter(entityRecord => entityRecord.id !== String(id));

                const isAbsent = dataUpdated.length === data.length;
                if (isAbsent) {
                    reject(`record with id ${id} is absent in ${entityName}`);
                    return;
                }

                return dataUpdated;
            };

            const callBackFileAction = this._fileWriter(resolve, reject, 'delet');
            this._handleEntityData(entityName, callback, callBackFileAction, reject);
        })
    }

    update(entityName, entity) {
        return new Promise((resolve, reject) => {
            const callback = (data) => {
                const updatedData = data.map(element => {
                    if (element.id === String(entity.id)) {
                        element = entity;
                    }

                    return element;
                });

                return updatedData;
            };

            const callBackFileAction = this._fileWriter(resolve, reject, 'updat');
            this._handleEntityData(entityName, callback, callBackFileAction, reject);
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

    _handleEntityData(entityName, callback, callBackFileAction, reject) {
        this.entities.filter(oneRecord => {
            if (oneRecord === entityName) {
                const [, filePath] = this._getFileNameAndPath(entityName);

                fs.promises.readFile(filePath)
                    .then(fileData => {

                        fileData = bufferToString(fileData)

                        let fileInfo = JSON.parse(fileData);

                        const data = callback(fileInfo);
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
exports.EntityDriver = EntityDriver;