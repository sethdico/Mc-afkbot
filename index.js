const bedrock = require('bedrock-protocol');

const config = {
  host: process.env.MC_HOST || 'TheHulagens.aternos.me',
  port: parseInt(process.env.MC_PORT) || 40436,
  username: process.env.MC_USERNAME || 'AFKBot',
  profilesFolder: './auth',
  afkMode: process.env.AFK_MODE || 'passive'
};

let client = null;
let reconnectAttempts = 0;
let afkInterval = null;

function startAfk() {
  if (afkInterval) clearInterval(afkInterval);
  afkInterval = setInterval(() => {
    if (!client) return;
    if (config.afkMode === 'active') {
      try {
        client.queue('text', {
          type: 'chat', needs_translation: false, source_name: client.username, xuid: '', platform_chat_id: '',
          message: `AFK ${new Date().toLocaleTimeString()}`
        });
      } catch (e) {}
    }
  }, 60000);
}

function connect() {
  console.log(`Connecting to ${config.host}:${config.port} as ${config.username}`);
  
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
      console.log('Connected');
      reconnectAttempts = 0;
      startAfk();
    });

    client.on('disconnect', () => reconnect());
    client.on('kick', () => reconnect());
    client.on('close', () => reconnect());
    client.on('error', () => {}); 

  } catch (e) {
    reconnect();
  }
}

function reconnect() {
  if (afkInterval) clearInterval(afkInterval);
  reconnectAttempts++;
  console.log(`Reconnecting in 30s (Attempt ${reconnectAttempts})`);
  setTimeout(connect, 30000);
}

connect();
