'use strict'
const { PeerRPCServer, PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const util = require('util');
const link = new Link({
  grape: 'http://127.0.0.1:30001'
})

link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
const client = new PeerRPCClient(link, {})

peer.init()
client.init();
const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)
console.log('Server: ', port);
link.startAnnouncing('put_order', service.port, {interval: 1000})	
link.startAnnouncing('get_order', service.port, {interval: 1000})

service.on('request', (rid, key, payload, handler) => {
	console.log('rid: ', rid);
 	switch (key) {
 		case 'put_order':
 			console.log(`${rid},\n ${key},\n`, payload);
 			updateOrders(payload.msg);
  			handler.reply(null, payload)	
 			break;
		case 'get_order':
			console.log(`${rid},\n ${key},\n`, payload);
			handler.reply(null, payload)	
			break;
 		default:
  			handler.reply(null, { msg: 'Not the service you were looking for.' })
  			break;

 	}

})

function updateOrders(hash) {
	link.lookup('update_orders', (err,data) => {
		if (data.length > 1) {
			client.map('update_orders', { msg: hash }, { timeout: 10000 }, (err, data) => {
			  console.log("Order Updated");
			})
		} else {
			client.request('update_orders', { msg: hash }, { timeout: 10000 }, (err, data) => {
			  console.log("Order Updated");
			})
		}
	})

}

