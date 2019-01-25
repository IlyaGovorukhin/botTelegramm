const TelegramBot = require('node-telegram-bot-api');
const token = '636817292:AAGXJNkMQdeQ47G6YT5ThsflXvldnGHKpxE';
const { transfer } = require('@waves/waves-transactions');
const seed = 'episode silk romance giraffe matrix glance arctic recall tone edge disagree cloud pull doll shrug';
const Promise = require('bluebird');
const exec = require('child_process').exec;
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    let dataTrans = '';
    let msgText = msg.text;
    let signedTranserTx = transfer({
        amount: 100000,
        recipient: msgText,
    }, seed)

    let data = JSON.stringify(signedTranserTx);
    let jsonData = data;
    let command = `curl -X POST --header 'Content-Type:application/json' --header 'Accept:application/json' -d '${jsonData}' https://pool.testnet.wavesnodes.com/transactions/broadcast`
    let child =  exec(command);

    function promiseFromChildProcess(child) {
        return new Promise(function (resolve, reject) {
            child.addListener("error", reject);
            child.addListener("exit", resolve);
        });
    }
    promiseFromChildProcess(child).then(function (result) {
        console.log('promise complete: ' + result);
    }, function (err) {
        console.log('promise rejected: ' + err);
    });
    child.stdout.on('data', function (data) {
        const objectDATA = JSON.parse(data);
        if(objectDATA.error){
            dataTrans =  objectDATA.message;
        } else{
            dataTrans = objectDATA.id
        }
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, dataTrans);
    });
});

require('http').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('')
})


