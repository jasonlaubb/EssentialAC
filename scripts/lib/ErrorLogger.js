import { world } from '@minecraft/server';
export function errorlogger(e, modules){
  world.sendMessage(`§9Essential §l§7>§r§g catch §cerror §gin §c${modules}§r§g as §4${e.name}: §c${e.message}`);
  console.warn(`Essential > catch error in ${modules} as ${e.name}: ${e.message}`)
}
