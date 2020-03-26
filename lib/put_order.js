// This client will as the DHT for a service called `rpc_test`
// and then establishes a P2P connection it.
// It will then send { msg: 'hello' } to the RPC server

'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()
function putOrder(id) {
  link.put({ v: `${id}` }, (err, hash) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    if (hash) {
      peer.request('put_order', { msg: hash }, { timeout: 10000 }, (err, data) => {
        if (err) {
          console.error(err)
          process.exit(-1)
        }
        console.log(`Order ID: ${id}`)
        console.log(`Order Hash: ${data.msg}`)
      })
    }
  });
}
const orderId = process.argv.slice(2);
if (orderId[0]) {
  putOrder(orderId[0]);
} else {
  const newId = create_UUID();
  putOrder(newId);
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}