const envs = require("./envs/index");
const currentEnvName = process.env.REACT_APP_STAGE || "development";
const currentEnv = envs[currentEnvName];

module.exports = {
    currentEnv, currentEnvName
}
