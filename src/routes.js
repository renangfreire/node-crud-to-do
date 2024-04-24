import { Database } from "./db/database.js"

const database = new Database();

export const routes = [
    {
        method: "GET",
        path: "/tasks",
        handler: (req, res) => {
            const tasks = database.read("tasks")
            
            return res.writeHead(200).end(JSON.stringify(tasks));
        }
    },
    {
        method: "POST",
        path: "/tasks",
        handler: (req, res) => {
            const now = new Date().toISOString()
            const task = req.body
            
            database.create("tasks", {...task, created_at: now})

            return res.writeHead(200).end()
        }
    },
    {
        method: "UPDATE"
    },
    {
        method: "DELETE"
    }
]