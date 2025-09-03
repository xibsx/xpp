const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL')
const {makeid} = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");
const mongoose = require('mongoose');
const Session = require('./models/Session');
const {
    default: xibs_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

function removeFile(FilePath){
    if(!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true })
 };

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
        async function XIBS_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/'+id)
     try {
            let Pair_Code_By_xibs = xibs_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({level: "fatal"}).child({level: "fatal"})),
                },
                printQRInTerminal: false,
                logger: pino({level: "fatal"}).child({level: "fatal"}),
                browser: ["Chrome (Linux)", "", ""]
             });
             if(!Pair_Code_By_xibs.authState.creds.registered) {
                await delay(1500);
                        num = num.replace(/[^0-9]/g,'');
                            const code = await Pair_Code_By_xibs.requestPairingCode(num)
                 if(!res.headersSent){
                 await res.send({code});
                     }
                 }
            Pair_Code_By_xibs.ev.on('creds.update', saveCreds)
            Pair_Code_By_xibs.ev.on("connection.update", async (s) => {
                const {
                    connection,
                    lastDisconnect
                } = s;
                if (connection == "open") {
                await delay(5000);
                let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                await delay(800);
               let b64data = Buffer.from(data).toString('base64');
               let session = await Pair_Code_By_xibs.sendMessage(Pair_Code_By_xibs.user.id, { text: '' + b64data });

               // Save to MongoDB
               try {
                const dbSession = new Session({
                    sessionId: makeid(10),
                    phoneNumber: num,
                    scanId: b64data,
                    pairingCode: code,
                    createdAt: new Date(),
                    status: 'active',
                    method: 'pair'
                });
                await dbSession.save();
                console.log('╔══════════════════════════════════╗');
                console.log('║ Pair session saved to MongoDB    ║');
                console.log('╚══════════════════════════════════╝');
               } catch (dbError) {
                console.log('MongoDB save error:', dbError.message);
               }

               let XIBS_TEXT = `
*_Pair Code Connected by xibs_*
*_Made With 🤍_*
______________________________________
╔════◇
║ *『 WOW YOU CHOOSEN XIBS 』*
║ _You Have Completed the First Step to Deploy a Whatsapp Bot._
╚══════════════════════╝
╔═════◇
║  『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
║❒ *Ytube:* _youtube.com/@xibs_
║❒ *Owner:* _https://wa.me/message/NHCZC5DSOEUXB1_
║❒ *Repo:* _https://github.com/xibs/xibs-bot_
║❒ *WaGroup:* _https://chat.whatsapp.com/L0ctUUVLlsrFYwBHApKfew_
║❒ *WaChannel:* _https://whatsapp.com/channel/0029VaJmfmTDJ6H7CmuBss0o_
║❒ *Plugins:* _https://github.com/xibs/xibs-plugins_
╚══════════════════════╝ 
_____________________________________

_Don't Forget To Give Star To My Repo_`
 await Pair_Code_By_xibs.sendMessage(Pair_Code_By_xibs.user.id,{text:XIBS_TEXT},{quoted:session})
 

        await delay(100);
        await Pair_Code_By_xibs.ws.close();
        return await removeFile('./temp/'+id);
            } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    XIBS_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            await removeFile('./temp/'+id);
         if(!res.headersSent){
            await res.send({code:"Service Unavailable"});
         }
        }
    }
    return await XIBS_PAIR_CODE()
});
module.exports = router