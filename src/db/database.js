import { schema } from "./schema.js"
import { readFile, writeFile } from 'node:fs/promises'

const dbPath =  new URL("./db.json", import.meta.url)
export class Database {
    #database = {};

    constructor(){
        readFile(dbPath, 'utf8').then((data) => {
            const dataParsed = JSON.parse(data);
            this.#database = dataParsed
        }).catch(() => {
            this.#persist
        })
    }

    #persist(){
        writeFile(dbPath, JSON.stringify(this.#database))
    }   

    read(tableName){
        const data = this.#database[tableName] ?? [];

        return data
    }
    
    create(tableName, data){
        const structureSchema = this.#structureSchema(tableName, data)
        const databaseMock = this.#database[tableName]
        
        if(!databaseMock){
            this.#database[tableName] = [ structureSchema ]
        } else{
            databaseMock.push(structureSchema)
        }

        this.#persist()
    }
    update(tableName, {id, data}){
        const structureSchema = this.#structureSchema(tableName, data)
        const databaseMock = this.#database[tableName]
        
        if(!databaseMock) throw new Error("Not exist data in DB")

        const indexColumn = databaseMock.findIndex(column => column.id === id)

        if(indexColumn === -1) throw new Error("Id not found in database")
        
        databaseMock[indexColumn] = structureSchema

        this.#persist()
    }
    delete(tableName, id){

    }
    #structureSchema(tableName, data){
        const schemaTable = schema[tableName]
        const schemaEntries = Object.entries(schemaTable)
        const dataKeys = Object.keys(data)

        if(!schemaEntries){
            throw new Error("Couldn't find tableName")
        }

        const allDataExistSchema = dataKeys.every(dataKey => {
            return schemaTable.hasOwnProperty(dataKey)
        })

        if(!allDataExistSchema){
            throw new Error("Invalid sending data structure")
        }

        return schemaEntries.reduce((obj,[key, keyType]) => {
            if(key && !data[key]){
                obj[key] = ""

                return obj
            }

            if(typeof data[key] !== keyType){
                throw new Error("Invalid Data Type for " + key)
            }

            obj[key] = data[key]
            return obj
        }, {})
    }
}