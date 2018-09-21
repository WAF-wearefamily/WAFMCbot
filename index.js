/*jslint bitwise: true, node: true */
/* WAF VANILLA BOT MADE BY THEREALF AND XATEV AKA KIMBERLEE 2018 */
'use strict';

var Discord = require("discord.js");
const { Client, Attachment } = require('discord.js');
var Rcon = require("./lib/rcon.js");
var express = require("express");
var app = express();
var http = require("http").Server(app);

var cfile = (process.argv.length > 2) ? process.argv[2] : "./config.json"

console.log("[INFO] Using configuration file:", cfile);

var c = require(cfile);

function makeDiscordMessage(bodymatch) {
    // make a discord message string by formatting the configured template with the given parameters

    return c.DISCORD_MESSAGE_TEMPLATE
        .replace("%username%", bodymatch[1].replace(/(\§[A-Z-a-z-0-9])/g, ""))
        .replace("%message%", bodymatch[2]);
}

function makeMinecraftTellraw(message) {
    // same as the discord side but with discord message parameters
    /*  if(message.content.has((message.content.find("text", "<:")))){        //handle animated emojis
          return c.MINECRAFT_WARN_EMO
        }*/
    return c.MINECRAFT_TELLRAW_TEMPLATE
        .replace("%username%", "[DISCORD] " + message.author.username)
        .replace("%discriminator%", message.author.discriminator)
        .replace("%message%", message.cleanContent);
}

var debug = c.DEBUG;
var therealf = new Discord.Client();

var rconTimeout;

app.use(function(request, response, next) {
    request.rawBody = "";
    request.setEncoding("utf8");

    request.on("data", function(chunk) {
        request.rawBody += chunk;
    });

    request.on("end", function() {
        next();
    });
});

therealf.on("ready", function() {
    var channel = c.DISCORD_CHANNEL_ID;
    app.post(c.WEBHOOK, function(request, response) {
        var body = request.rawBody;
        console.log("[INFO] Recieved " + body);
        var re = new RegExp(c.REGEX_MATCH_CHAT_MC);
        var ignored = new RegExp(c.REGEX_IGNORED_CHAT);
        if (!ignored.test(body)) {
            var bodymatch = body.match(re);
            if (debug) {
                console.log("[DEBUG] Username: " + bodymatch[1]);
                console.log("[DEBUG] Text: " + bodymatch[2]);
            }
            therealf.channels.get(channel).sendMessage(makeDiscordMessage(bodymatch));
        }
        response.send("");
    });
});

therealf.on("message", function(message) {
    if (message.channel.id === therealf.channels.get(c.DISCORD_CHANNEL_ID).id) {
        if (message.author.id !== therealf.user.id) {
            var client = new Rcon(c.MINECRAFT_SERVER_RCON_IP, c.MINECRAFT_SERVER_RCON_PORT); // create rcon client
            client.auth(c.MINECRAFT_SERVER_RCON_PASSWORD, function(err) { // only authenticate when needed
                if (message.content.startsWith("!mc-help")){ //help list
                     var channel = c.DISCORD_CHANNEL_ID;
                     therealf.channels.get(channel).send("```" +
                                      "+-------------------------------------------------------------------+"
                     + "\n" +         "| Commands     Properties                 Permissions               |" + "\n"
                                    + "+-------------------------------------------------------------------+" + "\n"
                                    + "| !time      | (set/add) (amount)       | everyone                  |" + "\n" +
                                      "+-------------------------------------------------------------------+" + "\n" +
                                      "| !gamemode  | (gamemode)               | Godfathers                |" + "\n"
                                    + "+-------------------------------------------------------------------+" + "\n" +
                                      "| !tp        | (player) (coords/player) | Godfathers & Consiglieres |"+ "\n" +
                                      "+-------------------------------------------------------------------+" + "\n" +
                                      "| !list      |                          | everyone                  |"+ "\n" +
                                      "+-------------------------------------------------------------------+" + "\n" +
                                      "| !give      | (player) (item id)       | Godfathers                |"
                     + "\n" +         "+-------------------------------------------------------------------+" + "\n" +
                                      "| !weather   | (weather)                | everyone                  |"+ "\n" +
                                      "+-------------------------------------------------------------------+"+ "\n" +
                                      "| !whitelist | (add/remove) (player)    | Godfathers                |"+ "\n" +
                                      "+-------------------------------------------------------------------+"+ "\n" +
                                      "| !spawn     | (player)                 | Godfathers & Consiglieres |"+ "\n" +
                                      "+-------------------------------------------------------------------+"+ "\n" + "```");
                     client.close(); //close rcon client
                  }
                 else if (message.content.startsWith("!list")){
                     client.command(message.content.substring(1), function(err, resp) { // Execute command
                     var channel = c.DISCORD_CHANNEL_ID;
                     therealf.channels.get(channel).send("Command sent");
                     var channel = c.DISCORD_LOG_ID;
                     therealf.channels.get(channel).send(resp);
                     client.close(); //close rcon client
                 });
                    }
                    else if (message.content.startsWith("!time")){
                        client.command(message.content.substring(1), function(err, resp) { // Execute command
                        var channel = c.DISCORD_CHANNEL_ID;
                        therealf.channels.get(channel).send("Command sent");
                        var channel = c.DISCORD_LOG_ID;
                        therealf.channels.get(channel).send(resp);
                        client.close(); //close rcon client
                    });
                       }
                       else if (message.content.startsWith("!weather")){
                           client.command(message.content.substring(1), function(err, resp) { // Execute command
                           var channel = c.DISCORD_CHANNEL_ID;
                           therealf.channels.get(channel).send("Command sent");
                           var channel = c.DISCORD_LOG_ID;
                           therealf.channels.get(channel).send(resp);
                           client.close(); //close rcon client
                       });
                          }
                else if ((message.member.roles.find("name", "Godfather (ADMIN)") || message.member.roles.find("name", "Consigliere (MOD)")) && message.content.startsWith("!spawn")) {
                    var username = message.content.substring(7);
                    client.command('/tp ' + username + " -848 69 -1040", function(err, resp) { // Execute command
                        var channel = c.DISCORD_CHANNEL_ID;
                        therealf.channels.get(channel).send("Command sent");
                        var channel = c.DISCORD_LOG_ID;
                        therealf.channels.get(channel).send(resp);
                        client.close(); //close rcon client
                    });
                }
                else if ((message.member.roles.find("name", "Godfather (ADMIN)") || message.member.roles.find("name", "Consigliere (MOD)")) && message.content.startsWith("!tp")) {
                  client.command(message.content.substring(1), function(err, resp) { // Execute command
                  var channel = c.DISCORD_CHANNEL_ID;
                  therealf.channels.get(channel).send("Command sent");
                  var channel = c.DISCORD_LOG_ID;
                  therealf.channels.get(channel).send(resp);
                  client.close(); //close rcon client
              });
                 }

                else if ((message.member.roles.find("name", "Godfather (ADMIN)") || message.member.roles.find("name", "Consigliere (MOD)")) && message.content.startsWith("!")) // Check if user has admin role and if commands starts with !
                {
                    client.command(message.content.substring(1), function(err, resp) { // Execute command
                        var channel = c.DISCORD_CHANNEL_ID;
                        therealf.channels.get(channel).send("Command sent");
                        var channel = c.DISCORD_LOG_ID;
                        therealf.channels.get(channel).send(resp);
                        client.close(); //close rcon client
                    });
                } else if (!(message.member.roles.find("name", "Godfather (ADMIN)") || message.member.roles.find("name", "Consigliere (MOD)")) && message.content.startsWith("!")) {
                    var channel = c.DISCORD_CHANNEL_ID;
                    therealf.channels.get(channel).send("Invalid Permission");
                } else {
                    client.command('tellraw @a ' + makeMinecraftTellraw(message), function(err, resp) {
                        client.close();
                    });
                }
            });
        }
    }
});

therealf.login(c.DISCORD_TOKEN);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1";
var serverport = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || c.PORT;
if (process.env.OPENSHIFT_NODEJS_IP !== undefined) {
    http.listen(serverport, ipaddress, function() {
        console.log("[INFO] Bot listening on *:" + serverport);
    });
} else {
    http.listen(serverport, function() {
        console.log("[INFO] Bot listening on *:" + c.PORT);
    });
}
