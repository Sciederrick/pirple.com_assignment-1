const http = require('http')
const https = require('https')
const url = require('url')
const fs = require('fs')
const config = require('./config')

//HTTP Server
const httpServer = http.createServer((req, res)=>{
  unifiedServer(req, res)
})

httpServer.listen(config.httpPort, ()=>console.log(`The server is listening on PORT: ${config.httpPort}`))

//HTTPS Server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions, (req, res)=>{
  unifiedServer(req, res)
})

httpsServer.listen(config.httpsPort, ()=>{
  console.log(`The sever is listening on port ${config.httpsPort}`)
})

let unifiedServer = (req, res)=>{
  const parsedURL = url.parse(req.url, true)
  const path = parsedURL.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')
  const queryStringObject = parsedURL.query
  const method = req.method.toLowerCase()
  const headers = req.headers
  req.setEncoding('utf8')
  let buffer = ''

  req.on('data', data=>{
    buffer += data
  })

  req.on('end', ()=>{
    const requestHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound
    const data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    }

    requestHandler(data, (statusCode, payload)=>{
      statusCode = typeof statusCode === 'number' ? statusCode : 200

      payload = typeof payload === 'object' ? payload : {}

      const payloadString = JSON.stringify(payload)

      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
    })
  })
}

const handlers = {}

handlers.hello = (data, callback)=>{
  callback(200, {message:'Hello NodeJS Programmer!'})
}

handlers.notFound = (data, callback)=>{
  callback(404)
}

const router = {
  'hello': handlers.hello
}
