import createDeepstream from 'deepstream.io-client-js'

const options = {
  maxReconnectInterval: 1000,
  reconnectIntervalIncrement: 500,
  maxReconnectAttempts: Infinity,
  heartbeatInterval: 60000,
};
var ds = createDeepstream("192.168.0.172:6020", options);
ds.on('connectionStateChanged', connection => {
  console.log(`Connection State Changed: ${connection}`);
});

ds.on('error', err => {
  console.log(`Deapstream error: ${err}`);
});
export const client = ds.login();

// myRecord = client.record.getRecord('test/index')