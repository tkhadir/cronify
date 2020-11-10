const rxjs = require('rxjs')
const db = require('./db')
const croner = require('./croner')
const path = require('path')


module.exports = (app) => {
    db.init()
    croner.init()
    let home$ = new rxjs.Subject()
    app.get('/', (req, res) => home$.next([req, res]))
    home$
    .subscribe((args) => {
            let [req, res] = args
            res.sendFile(path.join(__dirname + '/public/index.html'))
    })

    let list$ = new rxjs.Subject()
    app.get('/list', (req, res) => list$.next([req, res]))
    list$
    .subscribe((args) => {
            let [req, res] = args
            let results = []
            db.list((rows) => {
                rows.forEach(r => {
                  results.push(JSON.parse(r.jdoc))
                })
                console.log(results)
                res.send(results)
            })
    })

    let save$ = new rxjs.Subject()
    app.post('/save', (req, res) => save$.next([req, res]))
    save$
    .subscribe((args) => {
            let [req, res] = args
            console.log(req.body)
            if (req.body) {
                let json = req.body
                db.save(json)
            }
            else console.log('invalid body sent')
            res.send('done')
    })

}