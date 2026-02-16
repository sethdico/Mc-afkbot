const bedrock = require('bedrock-protocol');
const http = require('http');

const config = {
  host: process.env.MC_HOST || 'Amadeusjin.aternos.me',
  port: parseInt(process.env.MC_PORT) || 30453,
  username: process.env.MC_USERNAME || 'AFKBot',
  profilesFolder: './auth'
};

const webPort = process.env.PORT || 8080;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Online');
}).listen(webPort);

let client;
let reconnectDelay = 5000;
let loopInterval;

function connect() {
  try {
    client = bedrock.createClient({
      host: config.host,
      port: config.port,
      username: config.username,
      offline: false,
      skipPing: true,
      profilesFolder: config.profilesFolder
    });

    client.on('join', () => {
      reconnectDelay = 5000;
      startLoop();
    });

    client.on('close', reconnect);
    client.on('disconnect', reconnect);
    client.on('kick', reconnect);
    client.on('error', () => {});
  } catch (e) {
    reconnect();
  }
}

function reconnect() {
  if (loopInterval) clearInterval(loopInterval);
  if (client) client.removeAllListeners();
  client = null;
  setTimeout(connect, reconnectDelay);
  reconnectDelay = Math.min(reconnectDelay * 2, 60000);
}

function startLoop() {
  if (loopInterval) clearInterval(loopInterval);
  loopInterval = setInterval(() => {
    if (!client) return;
    client.queue('animate', { action_id: 1, runtime_entity_id: 0 });
    client.queue('move_player', {
      runtime_id: 0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, z: 0, y: Math.floor(Math.random() * 360) },
      mode: 'head_rotation',
      on_ground: true,
      ridden_runtime_id: 0
    });
  }, 10000);
}

connect();
