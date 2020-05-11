console.log("starting");
const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " ping Received");
  response.sendStatus(200);
});
app.listen(4200);
setInterval(() => {
  http.get("http://longing-elfin-waste.glitch.me/");
}, 280000);

const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite"
});

const force = true;
const ms = require("pretty-ms");
const counter = sequelize.define("counter", {
  counter: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true
  },
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
});
const _IDSYS = counter.findOne({
  where: {
    counter: "ID_SYSTEM"
  }
});
if (!_IDSYS)
  _IDSYS = counter.create({
    counter: "ID_SYSTEM",
    count: 0
  });
const marriage = sequelize.define("marriage", {
  couple_id: {
    type: Sequelize.INTEGER
  },
  user_id: {
    type: Sequelize.STRING
  },
  waifu_id: {
    type: Sequelize.STRING
  }
});

sequelize.sync({ force: false }, () => {
  console.log("database synced");
});

const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "?confess";
client.once("ready", () => {
  console.log("Bot Ready as fuck");
});
client.clean = async (client, text) => {
  if (text && text.constructor.name == "Promise") text = await text;
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 1 });

  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203))
    .replace(
      client.token,
      "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0"
    );

  return text;
};
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) {
    if (message.content.startsWith(prefix)) {
      const confess = message.content.slice(prefix.length).split(" ");
      if (!confess) return;
      const channel = client.channels.cache.get("709022946060140574");
      channel.send(
        new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setDescription(confess.join(" "))
      );
      message.channel.send("Your confession has been sent.");
      console.log(message.author.id + " - " + confess.join(" "));
      const ch = client.channels.cache.get("709077189991071746");
      ch.send(
        new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle(message.author.id)
          .setDescription(confess.join(" "))
      );
    }
  }
  if (message.guild) {
    if (message.content.startsWith("?marry")) {
      const target = message.mentions.users.first();
      if (!target) {
        return message.channel.send("You gotta mention who to marry. lmao");
      }
      if (target.bot) {
        return message.channel.send("You can't marry a bot, lmao");
      }
      if (target.id === message.author.id) {
        return message.channel.send("You can't marry yourself, lmao");
      }
      const tar = await marriage.findOne({
        where: {
          user_id: target.id
        }
      });
      const me = await marriage.findOne({
        where: {
          user_id: message.author.id
        }
      });
      if (tar && me && tar.waifu_id === me.user_id) {
        return message.channel.send(
          "uh... you two are already married to each other :D"
        );
      }
      if (tar) {
        return message.channel.send(
          `${target} is already married to someone else :(`
        );
      }
      if (me) {
        return message.channel.send(
          "Uh... youre already married to someone else..."
        );
      }

      const filter = response => {
        const m = response.content.toLowerCase();
        return (
          response.author.id === target.id && m.startsWith("yes")
        );
      };
      message.channel.send(
        `Hey ${target} will you accept ${message.author} as your beloved husband/wife? yes or no`
      );
      message.channel
        .awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
        .then(async collected => {
          let IDSYS = await counter.findOne({
            where: {
              counter: "ID_SYSTEM"
            }
          });
          if (!IDSYS) {
            IDSYS = await counter.create({
              countet: "ID_SYSTEM"
            });
          }
          const oof = await marriage.create({
            couple_id: IDSYS.count,
            user_id: message.author.id,
            waifu_id: target.id
          });
          const yes = await marriage.create({
            couple_id: IDSYS.count,
            user_id: target.id,
            waifu_id: message.author.id
          });
          IDSYS.count++;
          IDSYS.save();
          return message.channel.send(
            `${message.author} and ${target} has been married yay.`
          );
        })
        .catch(collected => {
          console.log(collected);
          message.channel.send(
            "Looks like nobody is getting married this time."
          );
        });
    }
    if (message.content.startsWith("?divorce")) {
      const me = await marriage.findOne({
        where: {
          user_id: message.author.id
        }
      });
      if (!me) {
        return message.channel.send(
          "You can't file a divorce if you are not married to someone :/"
        );
      }
      const filter = responds => {
        const m = responds.content.toLowerCase();
        return (
          responds.author.id === me.waifu_id &&
          m.startsWith("yes")
        );
      };
      message.channel.send(`
        Hey <@${me.waifu_id}> will you sign the divorce papers from <@${message.author.id}>? yes or no?
      `);
      message.channel
        .awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
        .then(async collected => {
          const waifu = me.waifu_id;
          await marriage.destroy({
            where: {
              user_id: message.author.id
            }
          });
          await marriage.destroy({
            where: {
              user_id: waifu
            }
          });
          return message.channel.send(
            `<@${message.author.id}> and <@${waifu}> has gotten a divorced. :(`
          );
        })
        .catch(collected => {
          return message.channel.send(
            "Looks like nobody is getting divorce this time."
          );
        });
    }
    if (message.content.startsWith("?waifu")) {
      const me = await marriage.findOne({
        where: {
          user_id: message.author.id
        }
      });
      if (!me) {
        return message.channel.send("You are not married to someone :(");
      }
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`You are lawfully married to <@${me.waifu_id}>`)
          .setColor("RANDOM")
      );
    }
    if (message.content.startsWith("?uptime")) {
      return message.channel.send(
        `Bot has been online for **${ms(client.uptime)}**`
      );
    }
    if (message.content.startsWith("?couples")) {
      let text = "\u200b";
      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("All Couples in the server");
      for (let i = 0; i < 500; i++) {
        const couple = await marriage.findOne({
          where: {
            couple_id: i
          }
        });
        if (!couple) continue;
        if (couple) {
          text += `:heart: <@${couple.user_id}> § <@${couple.waifu_id}> :heart:\n`;
        }
      }
      embed.setDescription(text);
      return message.channel.send(embed);
    }
    if (message.content.startsWith("?ping")) {
      const msg = await message.channel.send("Ping?");
      msg.edit(
        `Pong! Latency is ${msg.createdTimestamp -
          message.createdTimestamp}ms. API Latency is ${Math.round(
          client.ws.ping
        )}ms`
      );
    }
    if (
      message.content.startsWith("?eval") &&
      message.author.id === "258528688495132672"
    ) {
      const code = message.content.slice(5);
      try {
        const evaled = eval(code);
        const clean = await client.clean(client, evaled);
        message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
      } catch (err) {
        message.channel.send(
          `\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``
        );
      }
    }
  }
});
//client.login(process.env.TOKEN);
