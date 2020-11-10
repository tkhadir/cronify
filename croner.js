const util = require('util')
const exec = util.promisify(require('child_process').exec)
const db = require('./db')


let script = ''

let execute = async(script) => {
    const { stdout, stderr } = await exec(script)
    console.log('stdout:', stdout)
    console.log('stderr:', stderr)
}


let schedule = (data, rowid) => {
  let CronJob = require('cron').CronJob
  let job = new CronJob(data.cron, function() {
    if (!data.results) {
      data['results'] = []
    }
    execute(data.script)
    .then(reponse => {
      console.log('done')
      data.results.push({'date' : new Date(), 'status': 'success'})
      db.update(data, rowid)
    })
    .catch(err => {
      console.error(err)
      data.results.push({'date' : new Date(), 'status': 'failure'})
      db.update(data, rowid)
    }) 
  }, null, true, 'Europe/Paris')
  job.start()
  data['active'] = true
  db.update(data, rowid)
  console.log('job : ' + rowid + ' is scheduled')
}

let init = () => {
  let CronJob = require('cron').CronJob
  let mainJob = new CronJob('* * * * * *', function() {
    db.list((rows) => {
      rows.forEach((r, i) => {
        data = JSON.parse(r.jdoc)
        if (!data.active) {
          schedule(data, r.rowid)
        }
      })
      console.log('found jobs : ' + rows)
    })
  }, null, true, 'Europe/Paris')

  mainJob.start()
}

module.exports.init = init

