'use strict'
const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init()
const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)
link.startAnnouncing('update_orders', service.port, {interval: 1000})

console.log('Client: ', port);

service.on('request', (rid, key, payload, handler) => {
    switch (key) {
        case 'update_orders':
            console.log(`${rid},\n ${key},\n`, payload);
            const msg = `${payload.msg}`
            console.log(`Order Updated: ${msg}`);
            handler.reply(null, msg)    
            break;
        default:
            handler.reply(null, { msg: 'Not the service you were looking for.' })
            break;
    }
})