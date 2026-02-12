import { openDB } from 'idb'

class IDBService {
    #dbName = null
    #dbVersion = 1
    #db = null

    constructor(dbName) {
        this.#dbName = dbName
    }

    async ready() {
        try {
            if (this.#db) return this

            if (!this.#dbName) {
                console.warn(
                    `[IDBService] ready(): Banco de dados ${this.#dbName} não encontrado. Realizando a criação...`
                )
            }

            this.#dbVersion = await this.#getDbVersion(this.#dbName)

            if (this.#dbVersion <= 1) {
                this.#db = await openDB(this.#dbName)
            } else {
                this.#db = await openDB(this.#dbName, this.#dbVersion)
            }

            console.log(`[IDBService] ready(): DB inicializado.`)

            return this
        } catch (error) {
            console.error(error)
        }
    }

    async createStore(storeName, keyPath = null, autoIncrement = false) {
        try {
            if (!this.#ensureDb('createStore')) return

            if (typeof storeName !== 'string') {
                console.error(
                    `[IDBService] createStore(): Parâmetro storeName deve ser uma string. Tipo passado: ${typeof storeName}`
                )

                return
            }

            if (this.#db && this.#db.objectStoreNames.contains(storeName)) {
                console.warn(`[IDBService] createStore(): Store ${storeName} já existe.`)

                return
            }

            if (this.#db) {
                this.#db.close()
            }

            const dbVersion = this.#dbVersion + 1

            this.#db = await openDB(this.#dbName, dbVersion, {
                upgrade(db) {
                    if (keyPath && autoIncrement) {
                        db.createObjectStore(storeName, {
                            keyPath,
                            autoIncrement,
                        })
                    } else if (keyPath && !autoIncrement) {
                        db.createObjectStore(storeName, { keyPath })
                    } else if (!keyPath && autoIncrement) {
                        console.log('increment')
                        db.createObjectStore(storeName, { autoIncrement })
                    } else {
                        db.createObjectStore(storeName)
                    }

                    console.log(
                        `[IDBService] createStore(): Store ${storeName} criada com sucesso.`
                    )
                },
                blocked() {
                    console.warn(
                        '[IDBService] createStore(): O upgrade foi bloqueado por outra aba aberta. Feche as outras abas!'
                    )
                },
            })

            this.#dbVersion = await this.#getDbVersion(this.#dbName)
        } catch (error) {
            console.error(
                `[IDBService] createStore(): Erro ao criar store ${storeName}: Detalhes: `,
                error?.message ?? error
            )
        }
    }

    async createIndex(storeName, property, unique = false) {
        try {
            if (!this.#ensureDb('createIndex')) return

            if (typeof storeName !== 'string') {
                console.error(
                    `[IDBService] createIndex(): Parâmetro storeName deve ser uma string. Tipo passado: ${typeof storeName}`
                )

                return
            }

            const indexName = `${storeName}_${property}_idx`
            const indexList = this.getIndexList(storeName)

            if (indexList.includes(indexName)) {
                console.warn(`[IDBService] createIndex(): Index "${indexName}" já existe.`)

                return
            }

            if (this.#db) {
                this.#db.close()
            }

            const dbVersion = this.#dbVersion + 1

            this.#db = await openDB(this.#dbName, dbVersion, {
                upgrade(db, oldVersion, currentVersion, transaction) {
                    const store = transaction.objectStore(storeName)

                    if (unique) {
                        store.createIndex(indexName, property, { unique })

                        console.log(`Index "${indexName}" criada com sucesso`)

                        return
                    }

                    store.createIndex(indexName, property)

                    console.log(`Index "${indexName}" criada com sucesso`)
                },
                blocked() {
                    console.warn(
                        '[IDBService] createIndex(): O upgrade foi bloqueado por outra aba aberta. Feche as outras abas!'
                    )
                },
            })

            this.#dbVersion = await this.#getDbVersion(this.#dbName)
        } catch (error) {
            console.error(
                `[IDBService] createIndex(): Erro ao criar index ${storeName}_${property}_idx: Detalhes: `,
                error?.message ?? error
            )
        }
    }

    async add(storeName, data) {
        try {
            if (!this.#ensureDb('add')) return

            if (!storeName) {
                console.error(
                    `[IDBService] add(): Store ${storeName} não encontrada. Realize a criação para prosseguir com a inserção.`
                )

                return
            }

            const tx = this.#db.transaction(storeName, 'readwrite')

            await tx.store.add(data)
            await tx.done

            console.log('[IDBService] add(): Dados inseridos com sucesso.')
        } catch (error) {
            if (error.name === 'ConstraintError') {
                console.error(
                    `[IDBService] add(): Erro de restrição. Um dos valores inseridos já existe no DB. `
                )
            } else {
                console.error(
                    `[IDBService] add(): Erro ao inserir dados da store ${storeName}: Detalhes: `,
                    error?.message ?? error
                )
            }
        }
    }

    async put(storeName, data) {
        try {
            if (!this.#ensureDb('put')) return

            if (!storeName) {
                console.error(
                    `[IDBService] put(): Store ${storeName} não encontrada. Realize a criação para prosseguir com a inserção.`
                )

                return
            }

            if (typeof storeName !== 'string') {
                console.error(
                    `[IDBService] put(): Parâmetro storeName deve ser uma string. Tipo passado: ${typeof storeName}`
                )

                return
            }

            const tx = this.#db.transaction(storeName, 'readwrite')

            await tx.store.put(data)
            await tx.done

            console.log('[IDBService] put(): Dados modificados com sucesso.')
        } catch (error) {
            console.error(
                `[IDBService] put(): Erro ao alterar dados da store ${storeName}: Detalhes: `,
                error?.message ?? error
            )
        }
    }

    async get(storeName, value, index = '') {
        try {
            if (!this.#ensureDb('get')) return

            if (typeof storeName !== 'string') {
                console.error(
                    `[IDBService] get(): Parâmetro Index deve ser uma string. Tipo passado: ${typeof storeName}`
                )

                return null
            }

            if (typeof index !== 'string') {
                console.error(
                    `[IDBService] get(): Parâmetro Index deve ser uma string. Tipo passado: ${typeof index}`
                )

                return null
            }

            if (!this.#db) {
                console.error('[IDBService] get(): Banco não inicializado. Chame ready() primeiro.')

                return null
            }

            const tx = this.#db.transaction(storeName, 'readonly')
            let result

            if (index && index.length > 0) {
                const idx = tx.store.index(index)

                if (!idx) {
                    console.error(`[IDBService] get(): Index "${index}" não encontrado.`)

                    return null
                }

                result = await idx.get(value)
            } else {
                result = await tx.store.get(value)
            }

            await tx.done

            return result ?? null
        } catch (error) {
            console.error(
                `[IDBService] get(): Erro ao buscar na store "${storeName}":`,
                error?.message ?? error
            )

            return null
        }
    }

    async getAll(storeName) {
        try {
            if (!this.#ensureDb('getAll')) return

            if (typeof storeName !== 'string') {
                console.error(
                    `[IDBService] getAll(): Parâmetro storeName deve ser uma string. Tipo passado: ${typeof storeName}`
                )

                return null
            }

            if (!this.#db) {
                console.error(
                    '[IDBService] getAll(): Banco não inicializado. Chame ready() primeiro.'
                )

                return null
            }

            const tx = this.#db.transaction(storeName, 'readonly')

            const result = await tx.store.getAll()

            await tx.done

            return result ?? null
        } catch (error) {
            console.error(
                `[IDBService] getAll(): Erro ao buscar na store "${storeName}":`,
                error?.message ?? error
            )

            return null
        }
    }

    async deleteStore(storeName) {
        try {
            if (!this.#ensureDb('deleteStore')) return

            if (!this.#db.objectStoreNames.contains(storeName)) {
                console.warn(`[IDBService] deleteStore(): A store "${storeName}" não existe.`)
                return
            }

            if (this.#db) {
                this.#db.close()
            }

            const dbVersion = this.#dbVersion + 1

            this.#db = await openDB(storeName, dbVersion, {
                upgrade(db) {
                    db.deleteObjectStore(storeName)

                    console.log(
                        `[IDBService] deleteStore(): Store "${storeName}" removida com sucesso.`
                    )
                },
            })
        } catch (error) {
            console.error(
                `[IDBService] deleteStore(): Erro ao deletar store. Detalhes: `,
                error?.message ?? error
            )
        }
    }

    async deleteIndex(storeName, indexName) {
        try {
            if (!this.#ensureDb('deleteIndex')) return

            const indexList = this.getIndexList(storeName)

            if (!indexList.includes(indexName)) {
                console.warn(`[IDBService] deleteIndex(): O índice "${indexName}" não existe.`)
                return
            }

            if (this.#db) {
                this.#db.close()
            }

            const dbVersion = this.#dbVersion + 1

            this.#db = await openDB(storeName, dbVersion, {
                upgrade(db, oldVersion, currentVersion, transaction) {
                    const store = transaction.objectStore(storeName)

                    store.deleteIndex(indexName)

                    console.log(
                        `[IDBService] deleteIndex(): Índice "${indexName}" removido com sucesso.`
                    )
                },
            })
        } catch (error) {
            console.error(
                `[IDBService] deleteIndex(): Erro ao deletar index. Detalhes: `,
                error?.message ?? error
            )
        }
    }

    async hasDatabase(dbName) {
        const databases = await indexedDB.databases()

        return databases?.some(db => db.name === dbName) ?? false
    }

    getDbName() {
        return this.#dbName
    }

    getIndexList(storeName) {
        if (!this.#ensureDb('getIndexList')) return

        if (!storeName) {
            console.error(
                `[IDBService] getIndexList(): Store ${storeName} não encontrada. Realize a criação para prosseguir com a inserção.`
            )

            return
        }

        if (typeof storeName !== 'string') {
            console.error(
                `[IDBService] getIndexList(): Parâmetro storeName deve ser uma string. Tipo passado: ${typeof storeName}`
            )

            return []
        }

        if (!this.#db.objectStoreNames.contains(storeName)) {
            return []
        }

        const tx = this.#db.transaction(storeName, 'readonly')

        return Array.from(tx.store.indexNames)
    }

    async #getDbVersion(dbName) {
        const databases = await indexedDB.databases()

        return databases?.find(db => db.name === dbName)?.version ?? 1
    }

    #ensureDb(methodName) {
        if (!this.#db) {
            console.error(
                `[IDBService] ${methodName}(): Banco não inicializado. Chame ready() primeiro.`
            )
            return false
        }
        return true
    }
}

export default IDBService
