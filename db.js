var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')

let init = () => {
    db.serialize(() => {
        db.run("create table jobs (jdoc JSON)")
    })
}

let save = (doc) => {
    try {
        db.serialize(() => {
            db.run("insert into jobs values('" + JSON.stringify(doc) + "')")
        })
    } catch (e) {
        console.error(e)
    }
}

let list = (callback) => {
    db.all("select rowid, jdoc from jobs",[], (err, rows) => {
            callback(rows)
    })
}

let update = (doc, rowid) => {
    try {
        db.serialize(() => {
            db.run("update jobs set jdoc = '" + JSON.stringify(doc) + "' where rowid = '" + rowid + "'")
        })
    } catch (e) {
        console.error(e)
    }
}

module.exports.init = init
module.exports.save = save
module.exports.list = list
module.exports.update = update