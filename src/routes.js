export const routes = [
    {
        method: "GET"
    },
    {
        method: "POST",
        path: "/tasks",
        handler: (req, res) => {


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