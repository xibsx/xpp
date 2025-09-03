const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL')
const {makeid} = require('./id');
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Session = require('./models/Session');


const pino = require("pino");
let { toBuffer } = require("qrcode");
const path = require('path');
const fs = require("fs-extra");
const { Boom } = require("@hapi/boom");
const PORT = process.env.PORT ||  5000
const MESSAGE = process.env.MESSAGE ||  `
╔════◇
║ *『 WOW YOU'VE CHOSEN XIBS 』*
║ _You Have Completed the First Step to Deploy a Whatsapp Bot._
╚════════════════════════╝
╔═════◇
║  『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
║❒ *Ytube:* _youtube.com/@xibs_
║❒ *Owner:* _https://wa.me/message/NHCZC5DSOEUXB1_
║❒ *Repo:* _https://github.com/xibs/xibs-bot_
║❒ *WaGroup:* _https://chat.whatsapp.com/L0ctUUVLlsrFYwBHApKfew_
║❒ *WaChannel:* _https://whatsapp.com/channel/0029VaJmfmTDJ6H7CmuBss0o_
║❒ *Plugins:* _https://github.com/xibs/xibs-plugins_
╚════════════════════════╝

`



if (fs.existsSync('./auth_info_baileys')) {
    fs.emptyDirSync(__dirname + '/auth_info_baileys');
  };
  
  app.use("/", async(req, res) => {

  const { default: xibsWASocket, useMultiFileAuthState, Browsers, delay,DisconnectReason, makeInMemoryStore, } = require("@whiskeysockets/baileys");
  const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
  async function XIBS() {
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys')
    try {
      let Smd = xibsWASocket({ 
        printQRInTerminal: false,
        logger: pino({ level: "silent" }), 
        browser: Browsers.baileys("Desktop"),
        auth: state 
        });


      Smd.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect, qr } = s;
        if (qr) { res.end(await toBuffer(qr)); }


        if (connection == "open"){
          await delay(3000);
          let user = Smd.user.id;


//===========================================================================================
//===============================  SESSION ID    ===========================================
//===========================================================================================

          let CREDS = fs.readFileSync(__dirname + '/auth_info_baileys/creds.json')
          var Scan_Id = Buffer.from(CREDS).toString('base64')
         
          console.log(`
╔══════════════════════════════════╗
║          SESSION GENERATED       ║
║    SESSION-ID ==> ${Scan_Id.substring(0, 20)}...  ║
╚══════════════════════════════════╝`)

          // Save to MongoDB
          try {
            const session = new Session({
                sessionId: makeid(10),
                scanId: Scan_Id,
                createdAt: new Date(),
                status: 'active',
                method: 'qr'
            });
            await session.save();
            console.log('║ Session saved to MongoDB ║');
            console.log('╚══════════════════════════════════╝');
          } catch (dbError) {
            console.log('║ MongoDB save error:', dbError.message, '║');
            console.log('╚══════════════════════════════════╝');
          }

          let msgsss = await Smd.sendMessage(user, { text:  Scan_Id });
          await Smd.sendMessage(user, { text: MESSAGE } , { quoted : msgsss });
          await delay(1000);
          try{ await fs.emptyDirSync(__dirname+'/auth_info_baileys'); }catch(e){}


        }

        Smd.ev.on('creds.update', saveCreds)

        if (connection === "close") {            
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.connectionClosed) {
              console.log("Connection closed!")
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server!")
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...")
              XIBS().catch(err => console.log(err));
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Connection TimedOut!")
            }  else {
                console.log('Connection closed with bot. Please run again.');
                console.log(reason)
            }
          }



      });
    } catch (err) {
        console.log(err);
       await fs.emptyDirSync(__dirname+'/auth_info_baileys'); 
    }
  }


  XIBS().catch(async(err) => {
    console.log(err)
    await fs.emptyDirSync(__dirname+'/auth_info_baileys'); 
});


  })


app.listen(PORT, () => console.log(`║ XIBS QR Service on http://localhost:${PORT} ║`));