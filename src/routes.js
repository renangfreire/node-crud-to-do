import { Database } from "./db/database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const tasks = database.read("tasks")
            
            return res.writeHead(200).end(JSON.stringify(tasks));
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const now = new Date().toISOString()
            const task = req.body
            
            // database.create("tasks", {
            //     ...task,
            //     id: randomUUID(),
            //     created_at: now
            // })

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
            return res.writeHead(204).end()
        }
    }
]