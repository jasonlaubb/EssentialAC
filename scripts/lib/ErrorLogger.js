import { world } from '@minecraft/server';
import config from '../default/config.js';
export function errorlogger(e, modules){
  if(config.debug) world.sendMessage(`§9Essential §l§7>§r§g catch §cerror §gin §c${modules}§r§g at ${e.printStackTrace()} as §4${e.name}: §c${e.message}`);
  console.warn(`Essential > catch error in ${modules} as ${e.name}: ${e.message}`)
};
