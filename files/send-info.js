const http = require('http')
const fs = require('fs')
const url = require('url')

const key = process.env.KEY
const dockerApiVersion = process.env.DOCKER_API_VERSION
const collectStats = 'true' == process.env.COLLECT_STATS
const appName = process.env.APP_NAME
const monitoringUrl = process.env.MONITORING_URL
const monitoringDelay = 1000*process.env.MONITORING_DELAY

let adapterFor = (function() {
  let adapters = {'http:': require('http'), 'https:': require('https')}
  return function(inputUrl) {
    return adapters[url.parse(inputUrl).protocol]
  }
}())

function executeDockerService (path, callback) {
  let fullPath = '/'+dockerApiVersion+'/'+path
  let request = http.request({ socketPath: '/var/run/docker.sock', path: fullPath }, (res) => {
    if (res.statusCode != 200) {
      errorCallback('Error calling socket with path '+fullPath+': http status code is '+res.statusCode)
    }
    let data = ''
    res.setEncoding('utf8')
    res.on('error', (error) => {
      errorCallback('Error calling socket with path '+fullPath+': '+error)
    })
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      callback(JSON.parse(data))
    })
  })
  request.end()
}

function errorCallback (error) {
  console.log(error)
  process.exit(1)
}

function executeDockerHealth (containers, callback) {
  executeDockerService ('containers/json?filters={"health":["healthy"]}', (data) => {
    containers.forEach(container => {
      let found = false
      data.forEach(healthy => {
        if (container.Id == healthy.Id) {
          found = true
        }
      })
      container._Healthy=found
    })
    callback()
  })
}

function executeDockerStats (containers, i, callback) {
  if (collectStats && i<containers.length) {
    executeDockerService ('containers/'+containers[i].Id+'/stats?stream=false', (data) => {
      containers[i] = {...containers[i], _Stats: data}
      executeDockerStats(containers, ++i, callback)
    })
  } else callback()
}

function saveExpires (message) {
  fs.writeFile('expires.txt', message.expiresTimestamp, (err) => {
    if (err) {
      console.log('Error writing file with message expiration time')
    }
  })
}

function sendMessage (message) {
  let str = JSON.stringify(message)
  let len = Buffer.byteLength(str)
  let myUrl = url.parse(monitoringUrl, true)
  let request = adapterFor(myUrl).request({ method: 'POST', host: myUrl.hostname, port: myUrl.port, path: myUrl.path, headers: {'Content-Type': 'application/json', 'Content-Length': len}}, (res) => {
    if (res.statusCode != 200) {
      errorCallback('Error sending message to '+monitoringUrl+': http status code is '+res.statusCode)
    } else {
      saveExpires(message)
    }
  })
  request.write(str,encoding='utf8')
  request.end()
}

function doWork () {
  let now = new Date()
  let expires = new Date(now.getTime() + (monitoringDelay*2))
  let message = {key:key, appName: appName, createdTimestamp: now.getTime(), created: now.toISOString(), expiresTimestamp:expires.getTime(), expires: expires.toISOString()}
  executeDockerService ('containers/json?all=true}', (data) => {
    message.containers = data
    executeDockerHealth(message.containers, () => {
      executeDockerStats(message.containers, 0, () => {
        executeDockerService ('info', (data) => {
          message.info = data
          message.serverName = data.Name
          sendMessage(message)
        })
      })
    })
  })
}

function main() {
  doWork()
}

main()
