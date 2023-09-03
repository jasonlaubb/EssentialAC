import { world } from '@minecraft/server';
import { errorlogger } from './ErrorLogger.js';

export function create(name, value) {
try {
  if (world.scoreboard.getObjective(`database:${name}`) == undefined) {
    world.scoreboard.addObjective(`database:${name}`, 'database');
    world.getDimension('minecraft:overworld').runCommand(`scoreboard players set ${JSON.stringify(JSON.stringify(value))} database:${name} 2147483647`);
    return console.log(`database: New database created - ${name}`);
  } else return console.warn(`database: Failed to create DataBase - ${name}`)
} catch (e) {
  errorlogger(e, "DataBase/create")
}
};

export function get(name) {
try {
  if (world.scoreboard.getObjective(`database:${name}`) !== undefined) {
    const output = JSON.parse(JSON.parse(`"${world.scoreboard.getObjective(`database:${name}`).getParticipants()[0].displayName}"`));
    return output
  } else {
    console.warn(`database: Failed to get DataBase - ${name}`);
    return undefined
  }
} catch (e) {
  errorlogger(e, "DataBase/get")
}
};

export function state(name) {
try {
  if (world.scoreboard.getObjective(`database:${name}`) == undefined) {
    return false
  } else return true
} catch (e) {
  errorlogger(e, "DataBase/state")
}
};

export function reload(name, value) {
try {
  if (world.scoreboard.getObjective(`database:${name}`) !== undefined) {
    world.databasechanged = true;
    world.scoreboard.removeObjective(`database:${name}`);
    world.scoreboard.addObjective(`database:${name}`, 'database');
    return world.getDimension('minecraft:overworld').runCommand(`scoreboard players set ${JSON.stringify(JSON.stringify(value))} database:${name} 2147483647`);
  } else return console.warn(`database: Failed to reload DataBase - ${name}`)
} catch (e) {
  errorlogger(e, "DataBase/reload")
}
};
