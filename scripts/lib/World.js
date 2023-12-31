import * as mc from "@minecraft/server"
import { langs } from "./Language";
import { errorlogger } from './ErrorLogger.js'

export function flag(player, detect, punishment) {
try {
  if (mc.world.database_config.notify) mc.world.sendMessage(`§9Essential §l§7>§r§c ${player.name} §g${langs(mc.world.langcache).cheating} | ${langs(mc.world.langcache).detectevent}: §c${detect}`);
  if (punishment == "tempkick") {
    player.tempkickstate = true;
    player.triggerEvent("tempkick")
  };
  if (punishment == "kick") return player.runCommand(`kick "${player.name}" "§9\nEssential §l§7>§r§c\n§g${langs(mc.world.langcache).cheating} | ${langs(mc.world.langcache).detectevent}: §c${detect}"`);
  if (punishment == "ban") return player.addTag(`isBanned`)
} catch (e) {
  errorlogger(e, "World/flag")
}
};

export function killDroppedItem(x, y, z, dimension = "overworld") {
try {
  mc.world.getDimension(dimension).runCommand(`kill @e[type=item,r=1.5,x=${x},y=${y},z=${z}]`);
} catch (e) {
  errorlogger(e, "World/killDroppedItem")
}
};

export function warn(detect, info) {
try {
  if (!mc.world.database_config.notify) return;
  if (info == null) {
    return mc.world.sendMessage(`§9Essential §l§7>§r§c\n§g${langs(mc.world.langcache).warning} | ${langs(mc.world.langcache).detectevent}: §c${detect}`)
  } else {
    return mc.world.sendMessage(`§9Essential §l§7>§r§c\n§g${info} | ${langs(mc.world.langcache).detectevent}: §c${detect}`)
  }
} catch (e) {
  errorlogger(e, "World/warn")
}
};

export function getScores(player, scoreboard) {
try {
  const output = mc.world.scoreboard.getObjective(scoreboard).getScores().find(score => score.participant.displayName == (player.typeId == "minecraft:player" ? player.name : typeof player == "string" ? player : player.id))?.score;

  if (!isNaN(Number(score1))) {
    return output
  } else {
    return undefined
  }
} catch (e) {
  errorlogger(e, "World/getScores")
}
};

export function getGamemode(player) {
try {
  const gamemodes = {
    survival: 0,
    creative: 1,
    adventure: 2,
    spectator: 3
  };

  for (const gamemode in mc.GameMode) {
    if ([...mc.world.getPlayers({
      name: player.name,
      gameMode: mc.GameMode[gamemode]
    })].length > 0) return gamemodes[mc.GameMode[gamemode]]
  }
} catch (e) {
  errorlogger(e, "World/getGamemode")
}
};

export function lagback(player, type) {
try {
  player.teleport({ x: player.location.x, y: player.location.y, z: player.location.z }, { dimension: player.dimension })
  // if (type == "nomal") {
  //   const le = player.nomal;
  //   return player.teleport({ x: le.x, y: le.y, z: le.z })
  // };
  // if (type == "walking") {
  //   const le = player.walking;
  //   return player.teleport({ x: le.x, y: le.y, z: le.z })
  // };
  // if (type == "slowSpeed") {
  //   const le = player.walking;
  //   return player.teleport({ x: le.x, y: le.y, z: le.z })
  // };
  // if (type == "onGround") {
  //   const le = player.onGround;
  //   return player.teleport({ x: le.x, y: le.y, z: le.z })
  // };
} catch (e) {
  errorlogger(e, "World/lagback")
}
};

export function compare(realstate, truestate) {
try {
  if (realstate == null) return true;
  if (realstate != truestate) return false;
  if (realstate == truestate) return true;
  console.warn(`Essential > compare error: ${realstate} and ${truestate}`)
  return realstate
} catch (e) {
  errorlogger(e, "World/compare")
}
};
