const { loadEnvConfig } = require("@next/env");

const dev = process.env.NODE_ENV !== "production";
const { combinedEnv: env } = loadEnvConfig("./", dev);

module.exports = {
  client: "pg",
  connection: env.DATABASE_URL,
};
