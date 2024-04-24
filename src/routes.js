import { Database } from "./db/database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const filterQueries = req.query
            const tasks = database.read("tasks", filterQueries)
            
            
            return res.writeHead(200).end(JSON.stringify(tasks));
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const now = new Date().toISOString()
            const task = req.body
            
            database.create("tasks", {
                ...task,
                id: randomUUID(),
                created_at: now
            })

            return res.writeHead(201).end()
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const now = new Date().toISOString();
            const data = req.body
            const { id } = req.params

             database.update("tasks", {
                id,
                data: {
                    ...data,
                    updated_at: now
                }
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params

            database.delete("tasks", { 
                id 
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (req, res) => {
            const now = new Date().toISOString();
            const bodyData = req.body
            const { id } = req.params

            const [ databaseData ] = database.read("tasks", {id})

            database.update("tasks", {
                id,
                data: {
                    ...databaseData,
                    ...bodyData,
                    completed_at: now
                }
            })

            return res.writeHead(204).end()
        }
    },
]