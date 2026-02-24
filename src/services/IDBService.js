import { openDB } from 'idb'
import { searchLowers } from '@/utils/math.js'

class IDBService {
    #dbName = null
    #dbVersion = 1
    #db = null
    #logMode = false

    constructor(dbName, logMode = false) {
        this.#dbName = dbName
        this.#logMode = logMode
    }

    async conn() {
        try {
            if (this.#db) return this

            if (!this.#dbName) {
                console.error(`[IDBService] conn(): Nome do banco de dados não informado.`)
                return
            }

            this.#dbVersion = await this.#getDbVersion(this.#dbName)
            this.#db = await openDB(this.#dbName, this.#dbVersion)

            this.#log(`conn(): DB "${this.#dbName}" (v${this.#dbVersion}) inicializado.`, 'info')

            return this
        } catch (error) {
            console.error(`[IDBService] conn(): Falha crítica ao conectar:`, error)
        }
    }

    async close() {
        if (this.#db) {
            await this.#db.close()
            this.#db = null
            this.#log(`close(): Conexão encerrada.`)
            return
        }
        this.#log(`close(): Não há conexão ativa para encerrar.`, 'warn')
    }

    async createStore(storeName, keyPath = null, autoIncrement = false) {
        try {
            if (!this.#ensureDb('createStore')) return

            if (!storeName) {
                this.#log(`createStore(): storeName não informado.`, 'warn')
                return
            }

            if (this.#db.objectStoreNames.contains(storeName)) {
                this.#log(`createStore(): Store "${storeName}" já existe.`, 'warn')
                return
            }

            this.#db.close()

            const dbVersion = this.#dbVersion + 1

            this.#db = await openDB(this.#dbName, dbVersion, {
                upgrade(db) {
                    const options = {}
                    if (keyPath) options.keyPath = keyPath
                    if (autoIncrement) options.autoIncrement = autoIncrement

                    db.createObjectStore(storeName, options)
                },
                blocked() {
                    console.error('[IDBService] Operação bloqueada! Feche outras abas.')
                },
            })

            this.#dbVersion = this.#db.version
            this.#log(`createStore(): Store "${storeName}" criada com sucesso.`)
        } catch (error) {
            console.error(`[IDBService] createStore() Erro severo:`, error?.message)
        }
    }

    async createIndex(storeName, property, unique = false) {
        try {
            if (!this.#ensureDb('createIndex')) return

            if (!storeName) {
                this.#log(`createIndex(): storeName não informado.`, 'warn')
                return
            }

            if (!property && property.length > 0) {
                this.#log(`createIndex(): property não informado.`, 'warn')
                return
            }

            const indexName = Array.isArray(property)
                ? `${storeName}_${property.join('_')}_idx`
                : `${storeName}_${property}_idx`

            const indexList = this.getIndexList(storeName)

            if (indexList.includes(indexName)) {
                this.#log(`createIndex(): Index "${indexName}" já existe.`, 'warn')
                return
            }

            this.#db.close()

            const dbVersion = this.#dbVersion + 1

            this.#db = await openDB(this.#dbName, dbVersion, {
                upgrade(db, old, cur, transaction) {
                    const store = transaction.objectStore(storeName)

                    store.createIndex(indexName, property, { unique })
                },
            })

            this.#dbVersion = this.#db.version
            this.#log(`createIndex(): Index "${indexName}" criado com sucesso.`)
        } catch (error) {
            console.error(`[IDBService] createIndex() Erro severo:`, error?.message)
        }
    }

    async add(storeName, data) {
        try {
            if (!this.#ensureDb('add')) return

            if (!storeName) {
                this.#log(`add(): storeName não informado.`, 'warn')
                return
            }

            if (!data) {
                this.#log(`add(): data não informado.`, 'warn')
                return
            }

            const tx = this.#db.transaction(storeName, 'readwrite')
            await tx.store.add(data)
            await tx.done

            this.#log(`add(): Dados inseridos em "${storeName}".`)
        } catch (error) {
            if (error.name === 'ConstraintError') {
                this.#log(`add(): Erro de restrição. Valor duplicado em "${storeName}".`, 'error')
            } else {
                console.error(`[IDBService] add() Erro crítico:`, error?.message)
            }
        }
    }

    async put(storeName, data) {
        try {
            if (!this.#ensureDb('put')) return

            if (!storeName) {
                this.#log(`put(): storeName não informado.`, 'warn')
                return
            }

            if (!data) {
                this.#log(`put(): data não informado.`, 'warn')
                return
            }

            const tx = this.#db.transaction(storeName, 'readwrite')
            await tx.store.put(data)
            await tx.done

            this.#log(`put(): Dados atualizados em "${storeName}".`)
        } catch (error) {
            console.error(`[IDBService] put() Erro severo:`, error?.message)
        }
    }

    async bulkPut(storeName, dataArray, limiter = {}) {
        try {
            if (!this.#ensureDb('bulkPut')) return

            if (!storeName) {
                this.#log(`bulkPut(): storeName não informado.`, 'warn')
                return
            }

            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                this.#log(`bulkPut(): dataArray inválido ou vazio.`, 'warn')
                return
            }

            const tx = this.#db.transaction(storeName, 'readwrite')
            const store = tx.objectStore(storeName)

            const promises = dataArray.map(item => store.put(item))
            await Promise.all([...promises, tx.done])

            this.#log(`bulkPut(): ${dataArray.length} registros processados em "${storeName}".`)

            await this.#clearOldItems(storeName, dataArray, limiter)
        } catch (error) {
            console.error(`[IDBService] bulkPut() Erro severo:`, error?.message)
        }
    }

    async get(storeName, value, index = '') {
        try {
            if (!this.#ensureDb('get')) return null

            if (!storeName) {
                this.#log(`get(): storeName não informado.`, 'warn')
                return null
            }

            if (value === undefined || value === null) {
                this.#log(`get(): value não informado.`, 'warn')
                return null
            }

            const tx = this.#db.transaction(storeName, 'readonly')
            const result = index
                ? await tx.store.index(index).get(value)
                : await tx.store.get(value)

            await tx.done
            return result ?? null
        } catch (error) {
            console.error(`[IDBService] get() Erro severo:`, error?.message)
            return null
        }
    }

    async getAll(storeName) {
        try {
            if (!this.#ensureDb('getAll')) return null

            if (!storeName) {
                this.#log(`getAll(): storeName não informado.`, 'warn')
                return null
            }

            const tx = this.#db.transaction(storeName, 'readonly')
            const result = await tx.store.getAll()
            await tx.done

            return result
        } catch (error) {
            console.error(`[IDBService] getAll() Erro severo:`, error?.message)
            return null
        }
    }

    async deleteStore(storeName) {
        try {
            if (!this.#ensureDb('deleteStore')) return

            if (!storeName) {
                this.#log(`deleteStore(): storeName não informado.`, 'warn')
                return
            }

            if (!this.#db.objectStoreNames.contains(storeName)) {
                this.#log(`deleteStore(): Store "${storeName}" inexistente.`, 'warn')
                return
            }

            this.#db.close()

            const dbVersion = this.#dbVersion + 1

            this.#db = await openDB(this.#dbName, dbVersion, {
                upgrade(db) {
                    db.deleteObjectStore(storeName)
                },
            })

            this.#dbVersion = this.#db.version

            this.#log(`deleteStore(): Store "${storeName}" removida.`)
        } catch (error) {
            console.error(`[IDBService] deleteStore() Erro severo:`, error?.message)
        }
    }

    async deleteIndex(storeName, indexName) {
        try {
            if (!this.#ensureDb('deleteIndex')) return

            if (!storeName) {
                this.#log(`deleteIndex(): storeName não informado.`, 'warn')
                return
            }

            if (!indexName) {
                this.#log(`deleteIndex(): indexName não informado.`, 'warn')
                return
            }

            const indexList = this.getIndexList(storeName)

            if (!indexList.includes(indexName)) {
                this.#log(`deleteIndex(): Index "${indexName}" inexistente.`, 'warn')
                return
            }

            this.#db.close()
            const dbVersion = this.#dbVersion + 1

            this.#db = await openDB(this.#dbName, dbVersion, {
                upgrade(db, old, cur, transaction) {
                    const store = transaction.objectStore(storeName)
                    store.deleteIndex(indexName)
                },
            })

            this.#dbVersion = this.#db.version

            this.#log(`deleteIndex(): Index "${indexName}" removido.`)
        } catch (error) {
            console.error(`[IDBService] deleteIndex() Erro severo:`, error?.message)
        }
    }

    getIndexList(storeName) {
        if (!this.#ensureDb('getIndexList')) return []

        if (!storeName) {
            this.#log(`getIndexList(): storeName não informado.`, 'warn')
            return []
        }

        if (!this.#db.objectStoreNames.contains(storeName)) return []

        const tx = this.#db.transaction(storeName, 'readonly')

        return Array.from(tx.store.indexNames)
    }

    async #getDbVersion(dbName) {
        const databases = await indexedDB.databases()

        return databases?.find(db => db.name === dbName)?.version ?? 1
    }

    async count(storeName) {
        try {
            if (!this.#ensureDb('count')) return 0

            if (!storeName) {
                this.#log(`count(): storeName não informado.`, 'warn')
                return 0
            }

            const tx = this.#db.transaction(storeName, 'readonly')
            const count = await tx.store.count()
            await tx.done

            return count
        } catch (error) {
            console.error(`[IDBService] count() Erro severo:`, error?.message)
            return 0
        }
    }

    #ensureDb(methodName) {
        if (!this.#db) {
            console.error(`[IDBService] ${methodName}(): Banco não inicializado.`)

            return false
        }
        return true
    }

    #log(message, type = 'log') {
        if (this.#logMode) {
            const label = `[IDBService]`

            switch (type) {
                case 'warn':
                    console.warn(`${label} ${message}`)
                    break
                case 'info':
                    console.info(`${label} ${message}`)
                    break
                case 'error':
                    console.error(`${label} ${message}`)
                    break
                default:
                    console.log(`${label} ${message}`)
            }
        }
    }

    async #clearOldItems(storeName, dataList, limiterData) {
        try {
            if (!this.#ensureDb('clearOldItems')) return

            const keys = limiterData?.keyValue || []
            const indexList = limiterData?.indexList || []
            const limit = limiterData?.limit ?? 0

            const contentDataList = [
                ...new Set(
                    dataList
                        .flatMap(item => keys.map(key => item[key]))
                        .filter(data => data && !limiterData.blackList.includes(data))
                ),
            ]

            if (contentDataList.length !== 0) {
                const tx = this.#db.transaction(storeName, 'readwrite')

                for (const contentData of contentDataList) {
                    const contentIdList = await Promise.all(
                        indexList.map(async indexName => {
                            const idx = tx.store.index(indexName)
                            let cursor = await idx.openKeyCursor(IDBKeyRange.only(contentData))
                            const localIdList = []

                            while (cursor) {
                                localIdList.push(cursor.primaryKey)

                                cursor = await cursor.continue()
                            }

                            return localIdList
                        })
                    )

                    const idList = [...new Set(contentIdList.flat())]

                    if (idList.length > limit) {
                        const quantityToRemoved = Math.max(0, idList.length - limit)

                        const idListToRemoved = searchLowers(idList, quantityToRemoved)

                        await Promise.all(idListToRemoved.map(async id => tx.store.delete(id)))
                    }
                }

                await tx.done
            }
        } catch (error) {
            console.error(`[IDBService] clearOldItems() Erro severo:`, error?.message)
        }
    }
}

export default IDBService
