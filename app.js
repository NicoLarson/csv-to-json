const dataCsvInput = require("fs").readFileSync("./input/ZOTEROCSV.csv", "utf8")

const lineBreak = dataCsvInput.split("\n")

// Extraction des titres
let header = lineBreak[0].split("\"")
const haveCommas = (str) => {
    return str != ','
}
header = header.filter(haveCommas)
header.shift()
header.pop()

for (let i = 0; i < header.length; i++) {
    header[i] = header[i].toLocaleLowerCase()
    for (let j = 0; j < header[i].length; j++) {
        if (header[i][j] == ' ') {
            header[i] = header[i].replace(' ', '_')
        }
    }
}
// Traitement des données
let data = []

for (let i = 1; i < lineBreak.length; i++) {
    let ligne = lineBreak[i].split("\"")
    ligne = ligne.filter(haveCommas)
    ligne.shift()
    ligne.pop()
    let document = new Object()
    for (let j = 0; j < ligne.length; j++) {
        if (header[j] == 'key' || header[j] == 'item_type' || header[j] == 'publication_year' || header[j] == 'author' || header[j] == 'title' || header[j] == 'publication_title' || header[j] == 'issn' || header[j] == 'doi' || header[j] == 'url' || header[j] == 'abstract_note' || header[j] == 'date_added' || header[j] == 'date_modified' || header[j] == 'pages' || header[j] == 'language' || header[j] == 'automatic_tags') {
            // Traitement auteurs
            if (header[j] == 'author') {
                let arrayOfAuthors = []
                ligne[j] = ligne[j].split(";")
                for (let k = 0; k < ligne[j].length; k++) {
                    if (ligne[j][k].includes(' ')) {
                        ligne[j][k] = ligne[j][k].replace(' ', '')
                    }
                }
                // Array of authors in string clean
                for (let k = 0; k < ligne[j].length; k++) {
                    let author = new Object()
                    ligne[j][k] = ligne[j][k].split(',')
                    author.firstName = ligne[j][k][0]
                    author.lastName = ligne[j][k][1]
                    arrayOfAuthors.push(author)
                }
                ligne[j] = arrayOfAuthors
            }
            // Traitement des tags
            if (header[j] == 'automatic_tags') {
                ligne[j] = ligne[j].split(';')
                for (let k = 0; k < ligne[j].length; k++) {
                    if (ligne[j][k].includes(' ')) {
                        ligne[j][k] = ligne[j][k].replace(' ', '')
                    }
                }
            }
            document[header[j]] = ligne[j]
            data.push(document)
        }
    }
}

// Clean duplicate items by title
const uniqueDocument = Array.from(new Set(data.map(document => document.title)))
    .map(title => {
        return data.find(document => document.title === title)
    })

// Create JSON file

const documents = { documents: uniqueDocument }
let datas = JSON.stringify(documents)
require("fs").writeFileSync('./output/db.json', datas)