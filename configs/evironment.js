const envs = require("./envs/index");
const currentEnvName = process.env.NODE_ENV || "development";
const currentEnv = envs[currentEnvName];

module.exports = {
    currentEnv, currentEnvName
}
