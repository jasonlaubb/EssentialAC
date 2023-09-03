import { world } from '@minecraft/server';
export function errorlogger(e, modules){
  world.sendMessage(`§9Essential §l§7>§r§g catch §cerror §gwith §c${e.name}: ${e.message} ${e.stack}`);
  console.warn(`Essential > ERROR: ${e.name}: ${e.message} ${e.stack}`)
};
