import { schema } from "./schema.js";
export class Database {
    _database = {};

    read(tableName){
        const data = this._database[tableName] ?? [];

        return data
    }
    create(tableName, data){
        const structureSchema = this._structureSchema(tableName, data)
        console.log(structureSchema)
    }
    update(tableName,id, data){

    }
    delete(tableName, id){

    }
    _structureSchema(tableName, data){
        const schemaEntries = Object.entries(schema[tableName])

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