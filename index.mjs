import { main } from "./src/program.mjs"
import * as glob from "./src/global.mjs"

window.global = window;
Object.assign(global, glob);

main();