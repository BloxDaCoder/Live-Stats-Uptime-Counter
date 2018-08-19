const Discord = require('discord.js');
const { token, interval, guildID} = require('./config.json');
const client = new Discord.Client();
const sql = require("sqlite");
sql.open("./uptimedatabase.sqlite");

client.on("ready", async () => {
    console.log("Ready")
    sql.run("CREATE TABLE IF NOT EXISTS livestats (latestuptime INTEGER, lastuptime INTEGER, longestuptime INTEGER)").then(async () => {
    sql.get(`SELECT * FROM livestats`).then(async livestatsrow => {
        if (!livestatsrow) {
            if (client.guilds.get(guildID).channels.find(channels => channels.name === "live-stats")) {
               const firstmsg = await client.guilds.get(guildID).channels.find(channels => channels.name === "live-stats").send({embed : {
                    color: 0x7CFC00,
                  title: `${client.user.username}'s Uptime Live Stats Information`,
                  description: "Made possible & developed by <@134196203490377729>",
                  fields: [{
                    name: "Last Uptime",
                    value: "N/A"
                  },
                  { 
                    name: `Latest Uptime - Updated every ${interval} interval minute`,
                    value: "0 Minute"
                  },
                  { 
                    name: `Longest Uptime`,
                    value: "N/A"
                  },
                ],
                  timestamp: new Date(),
                  footer: {
                  icon_url: client.user.avatarURL,
                  text: "Live Stats Uptime Counter"
                  }
                  }
                  });
                  sql.run("INSERT INTO livestats (latestuptime, lastuptime, longestuptime) VALUES (?, ?, ?)", [0, 0, 0]);
                  setInterval(function(){
                    sql.get(`SELECT * FROM livestats`).then(async livestatsrow => {
                        if (livestatsrow) {
                            await sql.run(`UPDATE livestats SET latestuptime = ${livestatsrow.latesuptime + parseInt((interval * 60000))}`);
                            firstmsg.edit({embed : {
                                color: 0x7CFC00,
                              title: `${client.user.username}'s Uptime Live Stats Information`,
                              description: "Made possible & developed by <@134196203490377729>",
                              fields: [{
                                name: "Last Uptime",
                                value: `N/A`
                              },
                              { 
                                name: `Latest Uptime - Updated every ${interval} interval minute`,
                                value: `${(livestatsrow.latestuptime + (interval * 60000)) / 60000} Minute`
                              },
                              { 
                                name: `Longest Uptime`,
                                value: "N/A"
                              },
                            ],
                              timestamp: new Date(),
                              footer: {
                              icon_url: client.user.avatarURL,
                              text: "Live Stats Uptime Counter"
                              }
                              }
                              });
                        }
                    })
                  }, (interval * 60000))
            }
            else await client.guilds.get(guildID).createChannel("live-stats", "text")
            await client.guilds.get(guildID).channels.find(channels => channels.name === "live-stats").overwritePermissions(guildID, {
                READ_MESSAGES: true,
                SEND_MESSAGES: false
            })
            await client.guilds.get(guildID).channels.find(channels => channels.name === "live-stats").overwritePermissions(client.user.id, {
                SEND_MESSAGES: true
            })
            const firstmsg = await client.guilds.get(guildID).channels.find(channels => channels.name === "live-stats").send({embed : {
                color: 0x7CFC00,
              title: `${client.user.username}'s Uptime Live Stats Information`,
              description: "Made possible & developed by <@134196203490377729>",
              fields: [{
                name: "Last Uptime",
                value: "N/A"
              },
              { 
                name: `Latest Uptime - Updated every ${interval} interval minute`,
                value: "0 Minute"
              },
              { 
                name: `Longest Uptime`,
                value: "N/A"
              },
            ],
              timestamp: new Date(),
              footer: {
              icon_url: client.user.avatarURL,
              text: "Live Stats Uptime Counter"
              }
              }
              });
              sql.run("INSERT INTO livestats (latestuptime, lastuptime, longestuptime) VALUES (?, ?, ?)", [0, 0, 0]);
              setInterval(function(){
                sql.get(`SELECT * FROM livestats`).then(async livestatsrow => {
                    if (livestatsrow) {
                        await sql.run(`UPDATE livestats SET latestuptime = ${livestatsrow.latestuptime + parseInt((interval * 60000))}`);
                        firstmsg.edit({embed : {
                            color: 0x7CFC00,
                          title: `${client.user.username}'s Uptime Live Stats Information`,
                          description: "Made possible & developed by <@134196203490377729>",
                          fields: [{
                            name: "Last Uptime",
                            value: "N/A"
                          },
                          { 
                            name: `Latest Uptime - Updated every ${interval} interval minute`,
                            value: `${(livestatsrow.latestuptime + (interval * 60000)) / 60000} Minute`
                          },
                          { 
                            name: `Longest Uptime`,
                            value: "N/A"
                          },
                        ],
                          timestamp: new Date(),
                          footer: {
                          icon_url: client.user.avatarURL,
                          text: "Live Stats Uptime Counter"
                          }
                          }
                          });
                    }
                })
              }, (interval * 60000))
        }
        else if (livestatsrow) {
            client.guilds.get(guildID).channels.find(channels => channels.name === "live-stats").fetchMessages({limit : 1}).then(async (fetchedMessages) => {
                if (livestatsrow.latestuptime >= livestatsrow.longestuptime) {
                    await fetchedMessages.first().edit({embed : {
                        color: 0x7CFC00,
                      title: `${client.user.username}'s Uptime Live Stats Information`,
                      description: "Made possible & developed by <@134196203490377729>",
                      fields: [{
                        name: "Last Uptime",
                        value: `${livestatsrow.latestuptime / 60000} Minute`
                      },
                      { 
                        name: `Latest Uptime - Updated every ${interval} interval minute`,
                        value: `0 Minute`
                      },
                      { 
                        name: `Longest Uptime`,
                        value: `${livestatsrow.latestuptime / 60000} Minute`
                      },
                    ],
                      timestamp: new Date(),
                      footer: { 
                      icon_url: client.user.avatarURL,
                      text: "Live Stats Uptime Counter"
                      }
                      }
                      });
                  await sql.run(`UPDATE livestats SET lastuptime = ${livestatsrow.latestuptime}`);
                  await sql.run(`UPDATE livestats SET longestuptime = ${livestatsrow.latestuptime}`);
                  await sql.run(`UPDATE livestats SET latestuptime = 0`);
                  setInterval(function(){
                    sql.get(`SELECT * FROM livestats`).then(async livestatsrow => {
                        if (livestatsrow) {
                            await sql.run(`UPDATE livestats SET latestuptime = ${livestatsrow.latestuptime + parseInt((interval * 60000))}`);
                            fetchedMessages.first().edit({embed : {
                                color: 0x7CFC00,
                              title: `${client.user.username}'s Uptime Live Stats Information`,
                              description: "Made possible & developed by <@134196203490377729>",
                              fields: [{
                                name: "Last Uptime",
                                value: `${livestatsrow.lastuptime / 60000} Minute`
                              },
                              { 
                                name: `Latest Uptime - Updated every ${interval} interval minute`,
                                value: `${(livestatsrow.latestuptime + (interval * 60000)) / 60000} Minute`
                              },
                              { 
                                name: `Longest Uptime`,
                                value: `${livestatsrow.longestuptime / 60000} Minute`
                              },
                            ],
                              timestamp: new Date(),
                              footer: {
                              icon_url: client.user.avatarURL,
                              text: "Live Stats Uptime Counter"
                              }
                              }
                              });
                        }
                    })
                  }, (interval * 60000))
                }
                else
                sql.get(`SELECT * FROM livestats`).then(async livestatsrow => {
                    if (livestatsrow) {
                    if (livestatsrow.latestuptime < livestatsrow.longestuptime) {
                await fetchedMessages.first().edit({embed : {
                    color: 0x7CFC00,
                  title: `${client.user.username}'s Uptime Live Stats Information`,
                  description: "Made possible & developed by <@134196203490377729>",
                  fields: [{
                    name: "Last Uptime",
                    value: `${livestatsrow.latestuptime / 60000} Minute`
                  },
                  { 
                    name: `Latest Uptime - Updated every ${interval} interval minute`,
                    value: `0 Minute`
                  },
                  { 
                    name: `Longest Uptime`,
                    value: `${livestatsrow.longestuptime / 60000} Minute`
                  },
                ],
                  timestamp: new Date(),
                  footer: { 
                  icon_url: client.user.avatarURL,
                  text: "Live Stats Uptime Counter"
                  }
                  }
                  });
                  await sql.run(`UPDATE livestats SET lastuptime = ${livestatsrow.latestuptime}`);
                  await sql.run(`UPDATE livestats SET latestuptime = 0`);
                  setInterval(function(){
                    sql.get(`SELECT * FROM livestats`).then(async livestatsrow => {
                        if (livestatsrow) {
                            await sql.run(`UPDATE livestats SET latestuptime = ${livestatsrow.latestuptime + parseInt((interval * 60000))}`);
                            fetchedMessages.first().edit({embed : {
                                color: 0x7CFC00,
                              title: `${client.user.username}'s Uptime Live Stats Information`,
                              description: "Made possible & developed by <@134196203490377729>",
                              fields: [{
                                name: "Last Uptime",
                                value: `${livestatsrow.lastuptime / 60000} Minute`
                              },
                              { 
                                name: `Latest Uptime - Updated every ${interval} interval minute`,
                                value: `${(livestatsrow.latestuptime + (interval * 60000)) / 60000} Minute`
                              },
                              { 
                                name: `Longest Uptime`,
                                value: `${livestatsrow.longestuptime / 60000} Minute`
                              },
                            ],
                              timestamp: new Date(),
                              footer: {
                              icon_url: client.user.avatarURL,
                              text: "Live Stats Uptime Counter"
                              }
                              }
                              });
                        }
                    })
                  }, (interval * 60000))
                }
            }
                })
            })
        }
    })
})
});

client.login(token)
