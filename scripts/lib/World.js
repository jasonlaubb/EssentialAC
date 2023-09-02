import * as mc from "@minecraft/server"

export function flag(player, detect, punishment) {
  if (mc.world.database_confignotify) world.sendMessage(`§9Essential §l§7>§r§c ${player.name} §g${lang.cheating} | ${lang.detectevent}: §c${detect}`);
  if (punishment == "tempkick") {
    player.tempkickstate = true;
    player.triggerEvent("tempkick")
  };
  if (punishment == "kick") return player.runCommand(`kick "${player.name}" "§9\nEssential §l§7>§r§c\n§g${lang.cheating} | ${lang.detectevent}: §c${detect}"`);
  if (punishment == "ban") return player.addTag(`isBanned`)
};

export function killDroppedItem(x, y, z, dimension = "overworld") {
  mc.world.getDimension(dimension).runCommand(`kill @e[type=item,r=1.5,x=${x},y=${y},z=${z}]`);
};

export function warn(detect, info) {
  if (!mc.world.database_confignotify) return;
  if (info == null) {
    return world.sendMessage(`§9Essential §l§7>§r§c\n§g${lang.warning} | ${lang.detectevent}: §c${detect}`)
  } else {
    return world.sendMessage(`§9Essential §l§7>§r§c\n§g${info} | ${lang.detectevent}: §c${detect}`)
  }
};

export function getScores(player, scoreboard) {
  const output = world.scoreboard.getObjective(scoreboard).getScores().find(score => score.participant.displayName == (player.typeId == "minecraft:player" ? player.name : typeof player == "string" ? player : player.id))?.score;

  if (!isNaN(Number(score1))) {
    return output
  } else {
    return undefined
  }
};

export function getGamemode(player) {
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
};

export function lagback(player, type) {
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
};

export function compare(realstate, truestate) {
  if (realstate == null) return true;
  if (realstate != truestate) return false;
  if (realstate == truestate) return true;
  console.warn(`Essential > compare error: ${realstate} and ${truestate}`)
  return realstate
};