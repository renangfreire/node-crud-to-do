import { schema } from "./schema.js";
export class Database {
    #database = {};

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

    }
    update(tableName,id, data){

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