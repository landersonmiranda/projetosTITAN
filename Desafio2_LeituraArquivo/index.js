const fs = require('fs').promises;

async function Read(path) {
    try {
        const text = await fs.readFile(path, 'utf-8');
        const numWords = text.split(/\s+/).filter(Boolean);

        console.log(`o arquivo possui ${numWords.length} palavras`)
        console.log("oi")
    } catch (err) {
        console.log(err)
    }
}
Read('./exemplo.txt')