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

    read(tableName, filterQueries) {
        let data = this.#database[tableName] ?? [];

        if(filterQueries){
            const filterEntries = Object.entries(filterQueries)

           data = data.reduce((arr, column) => {
                 const similarToFilter = filterEntries.every(([key, value]) => column[key].includes(value))

                 if(!similarToFilter) {return arr}

                 arr.push(column)
                 return arr
            }, [])
        }

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
        structureSchema.id = id
        
        const databaseMock = this.#database[tableName]
        
        if(!databaseMock) throw new Error("Not exist data in DB")

        const indexColumn = databaseMock.findIndex(column => column.id === id)

        if(indexColumn === -1) throw new Error("Id not found in database")
        
        databaseMock[indexColumn] = structureSchema

        this.#persist()
    }
    delete(tableName, { id }){
        const databaseMock = this.#database[tableName]

        const indexColumn = databaseMock.findIndex(column => column.id === id)

        if(indexColumn === -1) throw new Error("Id not found in database")

        databaseMock.splice(indexColumn, 1)

        this.#persist()
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

        return schemaEntries.reduce((obj,[key, properties]) => {
            if(key && !data[key] && properties.notNull) throw new Error("Fields NOT NULL should be empty: " + key)
            
            obj[key] = data[key] ?? ""

            if(typeof obj[key] !== properties.type){
                throw new Error(`Invalid Data Type for ${key}, in schema type is ${properties.type}`)
            }

            return obj
        }, {})
    }
}