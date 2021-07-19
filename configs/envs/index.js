import * as development from "./development";
import * as production from "./production";
import * as testing from "./testing";
import * as staging from "./staging";

const envs = {
  development,
  testing,
  staging,
  production
};

export default envs;