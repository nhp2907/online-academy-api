import envs from "./envs/index";
export const currentEnvName = process.env.REACT_APP_STAGE || "development";
export const currentEnv = envs[currentEnvName];
