const {
    botConfig
} = require('./config')


const User = require('./models/user')
const Character = require('./models/character')

const TelegramBot = require('node-telegram-bot-api')

let bot = new TelegramBot(botConfig, {
    polling: {
        interval: 200,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})



bot.onText(/\/start/, msg => {
    // console.log(msg.from.username);
    User.aproveTgUser(msg.from.username, msg.chat.id)
        .then(user => {
            if (user) {
                
                let messText = user.chatId ? `Welcome back, ${user.login}` : "Welcome, to your first auth!";
                bot.sendMessage(msg.chat.id, messText, {
                    "reply_markup": {
                        "keyboard": [
                            ["feature", "/subscribes"],
                            ["feature"],
                            ["/unsubscribe"]
                        ]
                    }
                });
            } else {
                bot.sendMessage(msg.chat.id, "It seems you have to sign up in web-app first");
            }
        })
})
bot.onText(/\/unsubscribe/, msg => {
    User.findByTgName(msg.from.username)
    .then(resUser=>{
        return User.tgUnsubscribe(resUser._id);
    })
})
bot.onText(/\/delete (.+)/, function (msg, match) {
    var characId = match[1];
    let isAdmin = 0; 
    User.findByTgName(msg.from.username)
    .then(resUser=>{
        if(!resUser){
            bot.sendMessage(msg.chat.id, "It seems you have to sign up in web-app first");
            throw new Error("d");
        }
        if(resUser.role ===1 ){
            Character.deleteById(characId).then(res=>{
                bot.sendMessage(msg.chat.id, "Deleting successful!");
            }).catch(err=>{
                bot.sendMessage(msg.chat.id, "Internal error while deleting!");
            })

        }else {
            bot.sendMessage(msg.chat.id, "It seems you have no right to perform this");
        }
    })});

    
bot.onText(/\/search (.+)/, function (msg, match) {
    var searchString = match[1];
    let isAdmin = 0; 
    User.findByTgName(msg.from.username)
    .then(resUser=>{
        if(!resUser){
            bot.sendMessage(msg.chat.id, "It seems you have to sign up in web-app first");
            throw new Error("d");
        }
        isAdmin = resUser.role;
        return  Character.getAllByString(searchString);
    }).then(resArr=>{
        bot.sendMessage(msg.chat.id, `=====================\n<strong>Search result for ${searchString}:</strong>`, {
            parse_mode: "HTML"
        });
        let i = 0;
        resArr.forEach(charac=>{
            if(i>4){
                return;
            }
            let characStr = `Name: ${charac.name}
Fullname: ${charac.fullname}
Alias: ${charac.alias}
Image: <a href="${charac.image}"> Download </a>
${isAdmin ? `<i>Id:\n${charac._id}</i>` : ""}
<a href="#">Link on site</a>
`;
            bot.sendMessage(msg.chat.id, characStr, {parse_mode: "HTML"});
            i++;
        });
    })
});
bot.onText(/\/subscribes/, msg => {
    User.findByTgName(msg.from.username)
        .then(resultingUser => {
            // console.log(resultingUser.subscribes);
            return Character.findManyById(resultingUser.subscribes);
        }).then(res => {
            // console.log(res);
            
            bot.sendMessage(msg.chat.id, "=====================\n<strong>Your subscriptions:</strong>", {
                parse_mode: "HTML"
            });
            res.forEach(charac => {
                let characStr = `Name: ${charac.name}
Fullname: ${charac.fullname}
Alias: ${charac.alias}
Image: <a href="${charac.image}"> Download </a>
<a href="#">Link on site</a>
`;
                bot.sendMessage(msg.chat.id, characStr, {
                    parse_mode: "HTML"
                });
            });
        })
})
// MAY DO LATER
// bot.on('message', (msg) => {
//     // console.log(msg);
//     let file = bot.getFile(msg.photo[0].file_id).then(
//         res=>{
//             console.log(res);

//             https://api.telegram.org/file/bot<token>/<file_path>
//             bot.sendMessage(msg.chat.id, 'I"m not a chat-bot!');
//         }
//     )
//   });


bot.onText(/\/help (.+)/, (msg) => {
    bot.sendMessage(msg.chat.id, "Meow")
})


bot.on("polling_error", (err) => console.log(err));



module.exports = bot;