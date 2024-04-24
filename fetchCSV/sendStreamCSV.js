import { createReadStream } from 'node:fs'
import { parse } from "csv-parse"

const csvPath = new URL("task.csv", import.meta.url)

async function readCSV(){
    const streamCSV = createReadStream(csvPath)
    
    const parser = parse({
        delimiter: ",",
        from_line: 2
    })
    
    const streamLines = streamCSV.pipe(parser)

    await streamLines.forEach(async (line) => {
        const [title, description] = line;

        await fetch("http://localhost:3333/tasks", {
            headers: {"Content-type": "application/json"},
            method: "POST",
            body: JSON.stringify({
                title,
                description
            }),
        }).then(result => {
            console.log(result.status)
        })
    })
}


readCSV()


