'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

function getOrder(hash) {
  link.get(hash, (err, res) => {
    if (res) {
      peer.request('get_order', { msg: `${res.v}` }, { timeout: 10000 }, (err, data) => {
        if (err) {
          console.error(err)
          process.exit(-1)
        }
        console.log(`Order ID: ${data.msg}`)
        link.stop();
        process.exit(1);
      })
    } else {
      console.log('No order found.');
    }
  })
}
const hash = process.argv.slice(2);
if (hash[0]) {
  getOrder(hash[0]);
} else {
  console.log('No Order Hash provided.');
  link.stop();
  process.exit();
}