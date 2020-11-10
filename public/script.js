let addJob = () => {
    let cron = $("#form-cron").val()
    let script = $("#form-script").val()

    let options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({'cron': cron, 'script': script})
    }
    fetch('http://localhost:3000/save', options)
        .then(response => {
        console.log('done')
    })
    .catch(error => {
        console.error(error)
        alert('an error occcured during adding job : ' + error)
    })
}


$("#addjob-form" ).submit(function(event) {
    addJob()
    event.preventDefault()
})

let refresh = () => {
    let options = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    }
    fetch('http://localhost:3000/list', options)
        .then(response => {
        response.json().then(data => {
            console.log(data)
            let jobsData = []
            let monitoringData = []
            data.forEach(d => {
                jobsData.push('<li class="list-group-item d-flex justify-content-between align-items-center">'+ d.script + '<span class="badge badge-primary badge-pill">' + d.cron + '</span></li>')
                d.results.forEach(r => monitoringData.push('<li class="list-group-item d-flex justify-content-between align-items-center">' + r.date + ' ' + r.status + '</li>'))
            })
            $('#jobs-list').html(jobsData.join(''))
            $('#monitor-list').html(monitoringData.join(''))
        })
    })
    .catch(error => {
        console.error(error)
        alert('an error occcured during adding job : ' + error)
    })
}