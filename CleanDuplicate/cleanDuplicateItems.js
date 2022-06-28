const data = require('./db.json');

// Clean duplicate items by title
const uniqueDocument = Array.from(new Set(data.map(document => document.title)))
    .map(title => {
        return data.find(document => document.title === title)
    })



// Create JSON file

const date = new Date();
let month = date.getMonth() + 1
let fileName = 'db' + date.getFullYear() + month + date.getDate() + date.getHours() + date.getMinutes() + '.json'
const documents = { documents: uniqueDocument }
let datas = JSON.stringify(documents)
require("fs").writeFileSync(`./output/${fileName}`, datas)