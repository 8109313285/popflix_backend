const redis = require("redis");
const client = redis.createClient({
  port: 6379,
  host: "64.227.148.202",
});
client.connect();
client.on("connect", () => {
  console.log(`client connected to redis`);
});
client.on("ready", () => {
  console.log(`client connected to redis and ready to use..`);
});
client.on("error", (err) => {
  console.log(err.message);
});
client.on("end", () => {
  //   client.disconnect();
  console.log(`client disconnected from redis`);
});

module.exports = client;
