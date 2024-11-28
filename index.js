import path from 'path';
import express from 'express';
import {fileURLToPath} from 'url';
import { readFile, writeFile } from 'node:fs/promises';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.get('/', (req, res) => {
//     res.send('Started Working, Express!');
// });

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.get("/", (req, res, next) => { 
    // show the page
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const _retfile = path.join(__dirname, 'public/Pagina-Web.html');
   
    res.sendFile(_retfile);
});

app.post("/realizar-compra", async (req, res, next) => { 
    try {
        const compra = req.body;
        const comprasRealizadas = await readJSONFile('compras.json');
    
        comprasRealizadas.push(compra);
        await writeFile("compras.json", JSON.stringify(comprasRealizadas, null, 2));
        res.status(200).send("Compra received!");
    } catch {
        res.status(500).send("Internal server error");
    }
});

async function readJSONFile(filename) {
    try {
      const data = await readFile(filename, "utf8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

app.listen(port, () => {
    console.log(`Server listening at port: http://localhost:${port}`);
});
