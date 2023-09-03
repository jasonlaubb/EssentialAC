let loadms = Date.now(); //to check for /reload speed
import * as mc from '@minecraft/server'; //import minecraft modules
import * as ui from '@minecraft/server-ui' //import ui
import trueConfig from './default/config.js'; //get the Default config
import { create, state, reload, get } from './lib/DataBase.js'; //DataBase modules
import { langs } from './lib/Language.js'; //language system modules
import { errorlogger } from './lib/ErrorLogger.js'; //error logger

import en_US from './lang/en_US.js'; //lang files
import ch_TW from './lang/ch_TW.js';
import JPN from './lang/JPN.js';

import { flag, killDroppedItem, getScores, getGamemode, lagback, compare } from "./lib/World.js"; //World modules
var firstLoad = true;

const world = mc.world;

if (!state('config')) create('config', trueConfig);
var config = get('config');
var lang = langs(config.system.language);
world.database_config = config;
world.langcache = config.system.language;
if (trueConfig.coreversion != config.coreversion || config.coreversion == undefined) {
  console.warn(`Essential > config version not same as database`);
  config = trueConfig;
  reload('config');
};
if (trueConfig.uuid != config.uuid || config.uuid == undefined) {
  console.log(`Essential > config database changed to default`);
  config = trueConfig;
  reload('config');
};

if (!world.scoreboard.getObjective('gametestapi')) world.scoreboard.addObjective('gametestapi', 'debuguse');

function reset(player) {
  player.removeTag(`ess:antibreak`);
  player.lastHit = 0;
  player.gotCheck = 0;
  player.attackCps = 0;
  player.attackCpsVl = 0;
  player.flyingVl = 0;
  player.breakTime = 0;
  player.scaffoldVl = 0;
  player.hitList = [];
  player.noFallLag = 0;
  player.startTimer = false;
  player.onAirTime = 0;
  player.antiflyBreak = false;
  player.movementBreak = false;
  player.movementBreaktick = 0;
  player.onJoinBreak = false;
  player.onJoinBreaktick = 0;
  player.tempkickstate = false;
  player.speedVl = 0;
  player.noSlowVl = 0;
  player.tpVl = 0;
  player.invildsprintVl = 0;
  player.lastmessagesend = Date.now() - config.modules.chatcheck.sendspeed.minMessageDelay;
  player.lastmessage = 'undefined';
  player.repeatVl = 0;
  player.spamAvl = 0;
  player.spamBvl = 0;
  player.spamCvl = 0;
  player.spamlastmessage = Date.now();
  player.spamgotCheck = 0;
};

for (const player of mc.world.getPlayers()) {
  reset(player)
};

world.beforeEvents.chatSend.subscribe(ev => {
try {
  const player = ev.sender
  const message = ev.message
  let trueMessage
  if (config.modules.chatcheck.overall && !player.op) {
    if (config.modules.chatcheck.sendspeed.state) {
      const chatdelay = Date.now() - player.lastmessagesend
      if (chatdelay < config.modules.chatcheck.sendspeed.minMessageDelay) {
        const cansend = chatdelay + config.modules.chatcheck.sendspeed.minMessageDelay
        const second = config.modules.chatcheck.sendspeed.minMessageDelay - chatdelay / 1000;
        player.sendMessage(`§9Essential §l§7>§r§c ${lang.chatFormat.tooFast[0]}${second.toFixed(2)}${lang.chatFormat.tooFast[1]}`);
        return ev.cancel = true
      }
    };
    if (config.modules.chatcheck.repeat.state) {
      trueMessage = message.toUpperCase().replaceAll(/ +/g, " ");
      const strings = config.modules.chatcheck.repeat.string;
      for (const string of strings) {
        trueMessage = trueMessage.replaceAll(string, "")
      };
      if (trueMessage = player.lastmessage) {
        if (player.repeatVl > config.modules.chatcheck.repeat.repeatVl) {
          player.sendMessage(`§9Essential §l§7>§r§c ${lang.chatFormat.repeat}`);
          return ev.cancel = true
        } else {
          player.repeatVl++
        }
      } else player.repeatVl = 0
    };
    if (config.modules.spamcheck.length.state && config.modules.spamcheck.overall) {
      if (message.length > config.modules.spamcheck.length.maxlength) {
        ev.cancel = true;
        return flag(player, "spammer_length", config.modulesspamcheck.length.punishment)
      }
    };
    if (config.modules.chatcheck.removeAllColor && message.includes('§')) {
      message = message.replaceAll(/§./g, "")
    }
  };
  if (config.modules.chatcheck.repeat.state) player.lastmessages = trueMessage;
  if (config.modules.chatcheck.sendspeed.state) player.lastmessagesend = Date.now();
  if (config.chatFormat.chatRank.state) {
    const tags = player.getTags();
    let ranks = [];
    for (const tag of tags) {
      if (!tag.startsWith('rank:')) continue;
      ranks.push(tag.slice(5))
    };
    let ranking = []
    if (ranks.length > 0) {
      const bkl = config.chatFormat.chatRank.banklet

      for (const rank of ranks) {
        ranking.push(`${bkl[0]}[${rank}]${bkl[1]}`)
      }
    } else {
      ranking.push(config.chatFormat.chatRank.default)
    }
    ranking = ranking.join(config.chatFormat.chatRank.dividingLine)
    const bkl = config.chatFormat.chatRank.banklet
    const cnc = config.chatFormat.chatRank.textcolor
    const cl = config.chatFormat.chatRank.chatline
    const nc = config.chatFormat.chatRank.namecolor
    world.sendMessage(`${bkl[0]}${ranking}${bkl[1]} ${nc}${player.name}${cl}${cnc}${message}`)
    ev.cancel = true;
  };
  if (!config.modules.spamcheck.overall || player.op) return;
  if (player.hasTag('ess:moving') && world.database_config.modules.spamcheck.moving.state) {
    if (player.spamAvl <= world.database_config.modules.spamcheck.moving.warnVl) {
      player.spamAvl++
    } else {
      player.spamAvl = 0;
      mc.system.run(() => {
        flag(player, "spammer_moving", world.database_config.modules.spamcheck.moving.punishment)
      })
    }
  };
  if (player.hasTag('ess:attack') && world.database_config.modules.spamcheck.attack.state) {
    if (player.spamBvl <= world.database_config.modules.spamcheck.attack.warnVl) {
      player.spamBvl++
    } else {
      player.spamBvl = 0;
      mc.system.run(() => {
        flag(player, "spammer_attack", world.database_config.modules.spamcheck.attack.punishment)
      })
    }
  };
  if (player.hasTag('ess:guiopen') && world.database_config.modules.spamcheck.gui.state) {
    if (player.spamBvl <= world.database_config.modules.spamcheck.gui.warnVl) {
      player.spamBvl++
    } else {
      player.spamBvl = 0;
      mc.system.run(() => {
        flag(player, "spammer_gui", world.database_config.modules.spamcheck.gui.punishment)
      })
    }
  };
  if (world.database_config.modules.spamcheck.samedelay.state) {
    if ((Date.now() - player.spamlastmessage ?? 0) < world.database_config.modules.combatcheck.attackDelay.maxallowdelayms) {
      player.spamgotCheck ??= 0;
      player.spamgotCheck += 1;
    } else player.spamgotCheck = 0;

    if (player.spamgotCheck > world.database_config.modules.spamcheck.samedelay.combo) {
      mc.system.run(() => {
        return flag(player, "spammer_samedelay", world.database_config.modules.spamcheck.samedelay.punishment)
      })
    };
    player.spamlastmessage = Date.now()
  }
} catch (e) {
  errorlogger(e, "chatSend")
}
});
world.beforeEvents.itemUse.subscribe(ev => {
try {
  const player = ev.source;
  if (player.op || config.modules.actioncheck.overall) return;
  const itemCD = ev.itemStack.getComponent(cooldownTicks);
  if (player.lastItemUse == undefined) return player.lastItemUse = Date.now();
  if (Date.now() - player.lastItemUse < itemCD + config.modules.actioncheck.fastuse.addCooldown) {
    if (player.fastuseVl <= config.modules.actioncheck.fastuse.combo) {
      player.fastuseVl++;
      ev.cancel = true
    } else {
      player.fastuseVl = 0;
      ev.cancel = true;
      flag(player, "fastuse", config.modules.actioncheck.fastsue.punishment)
    }
  } else player.fastuseVl = 0;
} catch (e) {
  errorlogger(e, "itemUseBeforeEvents")
}
});
world.afterEvents.blockPlace.subscribe(ev => {
try {
  const player = ev.player;
  if (player.op || !config.modules.placecheck.overall) return;
  const block = ev.block;
  const { x, y, z } = block.location;

  if (config.modules.placecheck.illegalBlock.state) {
    const blockId = block.typeId;
    if (config.modules.placecheck.illegalBlock.dangerous.includes(blockId)) {
      player.runCommand(`setblock ${x} ${y} ${z} air`);
      return flag(player, "illegalBlockA", config.modules.placecheck.illegalBlock.punishment.A)
    };
    if (config.modules.placecheck.illegalBlock.illegal.includes(blockId)) {
      player.runCommand(`setblock ${x} ${y} ${z} air`);
      return flag(player, "illegalBlockA", config.modules.placecheck.illegalBlock.punishment.B)
    }
  };

  if (config.modules.placecheck.reach.state) {
    if (getGamemode(player) == 1) return;
    const placeDis = Math.sqrt(
      (player.location.x - block.location.x) ** 2 +
      (player.location.y - block.location.y) ** 2 +
      (player.location.z - block.location.z) ** 2
    )
    if (placeDis > config.modules.placecheck.reach.maxdistance) {
      player.runCommand(`setblock ${x} ${y} ${z} air`);
      return flag(player, "place_reach", config.modules.placecheck.illegalBlock.punishment)
    }
  };

  if (config.modules.placecheck.scaffold.state) {
    const viewblock = player.getBlockFromViewDirection();
    if (viewblock.id != block.id || viewblock == undefined) {
      player.scaffoldVl++;
      if (!config.placecheck.scaffold.checkforawhile.state) {
        player.runCommand(`setblock ${x} ${y} ${z} air`);
        return flag(player, "scaffold", config.modules.placecheck.scaffold.punishment)
      } else {
        if (player.scaffoldVl >= config.placecheck.scaffold.checkforawhile.punishcombo) {
          player.runCommand(`setblock ${x} ${y} ${z} air`);
          return flag(player, "scaffold", config.modules.placecheck.scaffold.punishment)
        }
      }
    } else player.scaffoldVl = 0
  }
} catch (e) {
  errorlogger(e, "blockPlace")
}
});

world.afterEvents.blockBreak.subscribe(ev => {
try {
  const player = ev.player;
  const block = ev.brokenBlockPermutation;
  const { x, y, z } = block.location;
  if (player.hasTag('ess:antibreak') && !player.op) {
    killDroppedItem(x, y, z);
    block.setPermutation(block.clone());
    return player.sendMessage(`§9Essential §l§7>§r§g ${lang.antiBreak}`)
  };
  if (player.op || !config.modules.breakcheck.overall) return;

  if (config.modules.breakcheck.nuker.state) {
    if (player.isOp() || !config.modules.breakcheck.overall) return;
    player.nuker++;
    if (player.nuker > config.modules.breakcheck.nuker.maxbreakintick) {
      player.nuker = 0;
      player.addTag('ess:antibreak');
      killDroppedItem(x, y, z);
      block.setPermutation(block.clone());
      flag(player, "nuker", config.modules.breakcheck.nuker.punishment)
    }
  };

  if (config.modules.breakcheck.reach.state) {
    if (getGamemode(player) == 1) return;
    const breakDis = Math.sqrt(
      (player.location.x - x) ** 2 +
      (player.location.y - y) ** 2 +
      (player.location.z - z)
    );
    if (breakDis > config.modules.breakcheck.reach.maxdistance) {
      killDroppedItem(x, y, z);
      block.setPermutation(block.clone());
      flag(player, "break_reach", config.modules.breakcheck.reach.punishment)
    }
  }
} catch (e) {
  errorlogger(e, "blockBreak")
}
});
world.afterEvents.entitySpawn.subscribe(ev => {
try {
  const entity = ev.entity;
  const entityId = entity.typeId;
  if (config.modules.commandblockexploit.commandblockminecart && entityId == "minecraft:command_block_minecart") {
    entity.kill();
    warn("detect_cbm", null)
  };
  if (config.modules.commandblockexploit.killnpc && entityId == "minecraft:npc") {
    entity.kill();
    warn("detect_npc", null)
  };
  if (config.modules.entitycheck.custom && config.modules.entitycheck.custom.includes(entityId)) {
    entity.kill();
    warn("entity_ban", null)
  }
} catch (e) {
  errorlogger(e, "entitySpawn")
}
});

world.afterEvents.playerSpawn.subscribe(ev => {
try {
  if (firstLoad && config.debug){
    ev.player.runCommand(`function debug/BetaAPI`);
    ev.player.runCommand(`function debug/HoildayCreator`);
    firstLoad = false
  };
  if (!ev.initialSpawn || ev.player.op) return;
  ev.player.sendMessage(`§9Essential §l§7>§r§g ${lang.running}`);
  const player = ev.player;
  if (config.modules.joincheck.namespoof.is_valid.state) {
    const playername = player.name
    let name = player.name
    for (let i = 0; i < config.modules.joincheck.namespoof.is_valid.string.length; i++) {
      name = name.replaceAll(config.modules.joincheck.namespoof.is_valid.string[i], "")
    }
    if (name.length > 0) {
      flag(player, "name_invild", "none");
      return player.runCommand(`kick "${player.name}"`)
    }
  };
  if (config.modules.joincheck.namespoof.name_length.state) {
    if (player.name.length > config.modules.joincheck.namespoof.name_length.maxlength || player.name.length < config.modules.joincheck.namespoof.name_length.minlength) {
      flag(player, "name_length", "none");
      return player.runCommand(`kick "${player.name}"`)
    }
  };
  reset(player);
  if (config.modules.movement.disabler.onJoin.state && config.modules.movement.overall) {
    player.onJoinBreak = true;
    player.onJoinBreaktick = config.modules.movement.disabler.onJoin.length
  }
} catch (e) {
  errorlogger(e, "playerSpawn")
}
});
world.afterEvents.entityHitEntity.subscribe(ev => {
try {
  const player = ev.damagingEntity;
  const target = ev.hitEntity;
  if (config.modules.badpacket.overall && !player.op && player.id == target.id && config.modules.badpacket.attack.state) {
    player.kill();
    return flag(player, "invild_attack", config.modules.badpacket.attack.punishment)
  };
  if (player.typeId !== "minecraft:player" || config.modules.combatcheck.overall) return;
  if (player.op) return;
  if (config.modules.combatcheck.reach.state) {
    const attckDis = Math.sqrt(
      (player.location.x - target.location.x) ** 2 +
      (player.location.y - target.location.y) ** 2 +
      (player.location.z - target.location.z) ** 2
    );
    if (attackDis > config.modules.combatcheck.reach.maxdistance) {
      return flag(player, "attack_reach", config.modules.combatcheck.reach.punishment)
    }
  };

  if (config.modules.combatcheck.attackDelay.state) {
    if ((Date.now() - player.lastHit ?? 0) < config.modules.combatcheck.attackDelay.maxallowdelayms) {
      player.gotCheck ??= 0;
      player.gotCheck += 1;
    } else player.gotCheck = 0;

    if (player.gotCheck > config.modules.combatcheck.attackDelay.maxcombo) {
      return flag(player, "attack_delay", config.modules.combatcheck.attackDelay.punishment)
    };

    player.lastHit = Date.now()
  };

  if (config.modules.combatcheck.attackCps.state) {
    player.attackCps++;
    if (player.attackCps > config.combatcheck.attackCps.maxAllowCps) {
      player.attackCpsVl++;
      player.attackCps = 0;
      if (player.attackCpsVl > config.combatcheck.attackCps.maxVl) {
        player.attackCpsVl = 0;
        return flag(player, "attack_cps", config.combatcheck.attackCps.punishment)
      } else {
        player.kill();
        return flag(player, "attack_cps", "none")
      }
    }
  };

  if (config.modules.combatcheck.killauraMulti.state) {
    if (!player.hitList.includes(target.id)) killaura[player.name].push(target.id);
    if (player.hitList.length > config.modules.combatcheck.killauraMulti.maxhitintick) {
      player.hitList = [];
      return flag(player, "killaura_multi", config.modules.combatcheck.killauraMulti.punishment)
    }
  };

  if (config.modules.combatcheck.killauraAngle.state) {
    const pos1 = { x: player.location.x, y: player.location.y, z: player.location.z };
    const pos2 = { x: entity.location.x, y: entity.location.y, z: entity.location.z };
    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
    if (angle <= -180) angle += 360;
    angle = Math.abs(angle);
    if (angle > config.modules.combatcheck.killauraAngle.maxangle && Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.z - pos2.z) ** 2) > 2) {
      return flag(player, "killaura_angle", config.modules.combatcheck.killauraAngle.punishment)
    }
  };

  if (config.modules.combatcheck.killauraGui.state) {
    if (player.hasTag(`ess:guiopen`)) {
      flag(player, "killaura_gui", config.modules.combatcheck.killauraGui.punishment)
    }
  };
} catch (e) {
  errorlogger(e, "entityHit")
}
});
world.afterEvents.entityHurt.subscribe(ev => {
try {
  if (!config.modules.movement.overall) return;
  const player = [...mc.world.getPlayers()].filter(player => ev.damageSource.damagingEntity?.id == player.id)[0];
  if (!player.op || player.typeId !== "minecraft:player" || getGamemode(player) == 1 || getGamemode(player) == 3) return;
  const ds = ev.damageSource.cause;
  if (config.modules.movement.disabler.fly.state && config.modules.movement.disabler.fly.hurtType.includes(ds)) {
    player.antiflyBreak = true
  };
  if (config.modules.movement.disabler.movement.state && config.modules.movement.disabler.fly.hurtType.includes(ds)) {
    player.movementBreak = true;
    player.movementBreaktick = config.modules.movement.disabler.movement.length
  }
} catch { }
})
mc.system.runInterval(() => {
try {
  if (!state('config')) {
    world.sendMessage(`§9Essential §l§7>§g§c ${en_US.database.delete}`);
    create('config', world.database_config);
    world.databasechanged = true
    world.database_config = get('config')
    config = get('config')
    return
  };
  if (!world.databasechanged && JSON.stringify(get('config')) != JSON.stringify(world.database_config)) {
    world.sendMessage(`§9Essential §l§7>§r§c ${lang.database.changed}`);
    reload('config', world.database_config);
    return
  };
  if (world.databasechanged) {
    config = get('config');
    world.database_config = get('config');
    world.databasechanged = false
  };

  //language changer
  if (world.database_config.system.language != world.langcache) {
    lang = langs(world.database_config.system.language)
    console.log(`Essential > language changed`)
  };
} catch (e) {
  errorlogger(e, "systemRunInterval")
};

try {
  for (const player of mc.world.getPlayers()) {
    player.op = !world.database_config.realmUse ? player.isOp() : player.hasTag('ess:admin'); //in RealmUse, use tag instead
    player.id === '-4294967295' ? player.host = true : player.host = false //prevent host deop + tempkick
    if (world.database_config.modules.permissioncheck.forceop.state && player.op && !world.database_config.modules.permissioncheck.adminList.includes(player.name)) {
      player.setOp(false);
      flag(player, world.database_config.modules.permissioncheck, forceop.punishment)
    };
    if (world.database_config.modules.permissioncheck.AntiDeop.state && !player.op) {
      if (world.database_config.modules.permissioncheck.AntiDeop.writelist.state) {
        if (world.database_config.modules.permissioncheck.AntiDeop.writelist.writelist.includes(player.name) && world.database_config.modules.permissioncheck.adminList.includes(player.name)) {
          player.setOp(true)
        } else {
          if (world.database_config.modules.permissioncheck.adminList.includes(player.name)) {
            player.setOp(true)
          }
        }
      }
    };
    if (!player.op) {
      const { x, y, z } = player.location

      if (world.database_config.system.lagback.state) {
        const A1 = Math.sqrt(player.getVelocity().x ** 2 + player.getVelocity().z ** 2).toFixed(3);
        const A2 = compare(player.isOnGround, world.database_config.system.lagback.nomal.onGround);
        if (world.database_config.misc.worldborder.state) {
          const il = world.database_config.system.lagback.nomal.locationIn
          const A3 = compare(x < il && z < il && x > -il && x > -il, world.database_config.system.lagback.nomal.inLocation)
        } else { const A3 = true };
        const A4 = compare(player.hasTag('ess:moving'), world.database_config.system.lagback.nomal.moving);
        const A5 = compare(player.isSprinting, world.database_config.system.lagback.nomal.sprinting);
        if (A1 < world.database_config.system.lagback.nomal.speed && A2 && A3 && A4 && A5) {
          player.lagbacknomal = { x: x, y: y, z: z }
        }
        const B1 = compare(player.isSprinting, world.database_config.system.lagback.walking.sprinting);
        const B2 = compare(player.hasTag('ess:moving'), world.database_config.system.lagback.walking.moving);
        const B3 = compare(player.isOnGround, world.database_config.system.lagback.walking.onGround);
        if (B1 && B2 && B3) {
          player.lagbackwalking = { x: x, y: y, z: z }
        };
        const C1 = compare(player.hasTag('ess:moving'), world.database_config.system.lagback.slowSpeed.moving);
        const C2 = compare(player.isOnGround, world.database_config.system.lagback.slowSpeed.onGround);
        if (A1 < world.database_config.system.lagback.slowSpeed.speed && C1 && C2) {
          player.lagbackslowspeed = { x: x, y: y, z: z }
        }
      };

      if (world.database_config.modules.actioncheck.overall) {
        if (world.database_config.modules.actioncheck.autototem.state) {
          const att = world.database_config.modules.actioncheck.autototem
          const attt = att.type
          if (player.hasTag('essflag:movingtotemA') && attt.gui) {
            player.runCommand(`replaceitem entity @s slot.weapon.offhand 0 air`);
            flag(player, "gui_totem", att.punishment)
          };
          if (player.hasTag('essflag:movingtotemB') && attt.moving) {
            player.runCommand(`replaceitem entity @s slot.weapon.offhand 0 air`);
            flag(player, "gui_totem", att.punishment)
          };
          if (player.hasTag('essflag:movingtotemC') && attt.attack) {
            player.runCommand(`replaceitem entity @s slot.weapon.offhand 0 air`);
            flag(player, "gui_totem", att.punishment)
          };
        };
        if (world.database_config.modules.actioncheck.autosheid.state) {
          const ats = world.database_config.modules.actioncheck.autosheid
          const atst = ats.type
          if (player.hasTag('essflag:movingsheidA') && attt.gui) {
            player.runCommand(`replaceitem entity @s slot.weapon.offhand 0 air`);
            player.removeTag('essflag:movingsheidA');
            flag(player, "gui_totem", atst.punishment)
          };
          if (player.hasTag('essflag:movingsheidB') && attt.moving) {
            player.runCommand(`replaceitem entity @s slot.weapon.offhand 0 air`);
            player.removeTag('essflag:movingsheidB');
            flag(player, "gui_totem", atst.punishment)
          };
          if (player.hasTag('essflag:movingsheidC') && attt.attack) {
            player.runCommand(`replaceitem entity @s slot.weapon.offhand 0 air`);
            player.removeTag('essflag:movingsheidC');
            flag(player, "gui_totem", atst.punishment)
          }
        }
      };

      if (world.database_config.modules.itemcheck.overall) { //itemCheck
        const container = player.getComponent("inventory").container;
        for (let i = 0; i < container.size; i++) {
          const item = container.getItem(i);
          if (item) {
            const itemEnchant = item.getComponent("enchantments").enchantments;
            const itemId = item.typeId;
            const itemAmount = item.amount;
            const itemLore = item.getLore();
            if (world.database_config.itemcheck.baditem.illegal.includes(itemId) && world.database_config.modules.itemcheck.baditem.state) {
              container.setItem(i);
              flag(player, "item:bad_item", world.database_config.modules.itemcheck.baditem.punishment);
              continue
            };
            if (itemLore.length > 0 && world.database_config.modules.itemcheck.itemlore.state) {
              container.setItem(i);
              flag(player, "item:lore", world.database_config.modules.itemcheck.itemlore.punishment);
              continue
            };
            if (world.database_config.modules.itemcheck.itemstack.state) {
              if (itemAmount > item.maxAmount) {
                container.setItem(i);
                flag(player, "item:stack", world.database_config.modules.itemcheck.itemstack.punishment);
                continue
              }
            };
            if (item.keepOnDeath && world.database_config.modules.itemcheck.keepOnDeath.state) {
              container.setItem(i);
              flag(player, "item:KeepOnDeath", world.database_config.modules.itemcheck.keepOnDeath.punishment);
              continue
            };
            if (itemId.endsWith('spawn_egg') && item.modules.itemcheck.spawnEgg.state) {
              container.setItem(i);
              flag(player, "item:spawn_egg", world.database_config.modules.itemcheck.spawnEgg.punishment);
              continue
            };
            if (item.nameTag.length > world.database_config.modules.itemcheck.nameLength.maxlength) {
              item.nameTag = undefined;
              flag(player, "item:name_length", world.database_config.modules.itemcheck.nameLength.punishment);
              continue
            };
            if (item.getCanDestroy.length > 0 && world.database_config.modules.itemcheck.canDestroy.state) {
              item.setCanDestroy(undefined);
              flag(player, "item:can_destroy", world.database_config.modules.itemcheck.canDestroy.punishment);
              continue
            };
            if (item.getCanPlaceOn.length > 0 && world.database_config.modules.itemcheck.canDestroy.state) {
              item.setCanPlaceOn(undefined);
              flag(player, "item:can_placeOn", world.database_config.modules.itemcheck.canPlaceOn.punishment);
              continue
            };
            for (const enchantment of itemEnchant) {
              const enLv = enchantment.level;
              const enTy = enchantment.type;
              if (world.database_config.itemcheck.badEnchant.state && enLv > 0) {
                if (item.maxAmount > 1 || itemId.endsWith('totem') || itemId.endsWith('_bucket') || itemId.endsWith('boat') || itemId.endsWith('minecart') || itemId.endsWith('bed')) {
                  container.setItem(i);
                  flag(player, "item:bad_enchant", world.database_config.bad_enchant[1]);
                  continue
                }
              };
              if (world.database_config.enchantLevel.state) {
                if (enLv > enTy.maxLevel || enLv <= 0) {
                  if (world.database_config.itemcheck.enchantLevel.onlydetect32k && enLv < 32767) continue;
                  container.setItem(i);
                  flag(player, "item:enchant_level", world.database_config.enchant_level[1]);
                  continue
                }
              }
            }
          }
        }
      };

      if (world.database_config.modules.movement.overall) {
        if (world.database_config.modules.movement.crasher.state) {
          const vdl = world.database_config.modules.movement.crasher.dangerousLocation;
          if (x > vdl || x < -vdl || y > vdl || y < -vdl || z > vdl || z < -vdl) {
            player.teleport({ location: { x: 0, y: 0, z: 0 } });
            flag(player, "crasher", world.database_config.modules.movement.crasher.punishment);
            continue
          }
        };
        if (world.database_config.modules.movement.invildLocation.state) {
          if (x < world.database_config.modules.movement.invildLocation.minYlocation) {
            player.teleport({ location: { x: x, y: -104, z: z } });
            flag(player, "invild_location", world.database_config.modules.movement.invildLocation.punishment);
            continue
          }
        };
        if (world.database_config.modules.movement.invmove.state) {
          if (player.hasTag("essflag:invmoveA") && world.database_config.modules.movement.invmove.moving) {
            player.removeTag("essflag:invmoveA");
            flag(player, "inv_move", world.database_config.modules.movement.invmove.punishment);
            continue
          };
          if (player.hasTag("essflag:invmoveB") && world.database_config.modules.movement.invmove.attack) {
            player.removeTag("essflag:invmoveB");
            flag(player, "inv_attack", world.database_config.modules.movement.invmove.punishment);
            continue
          };
          if (player.hasTag("essflag:invmoveC") && world.database_config.modules.movement.invmove.useitem) {
            player.removeTag("essflag:invmoveC");
            flag(player, "inv_useitem", world.database_config.modules.movement.invmove.punishment);
            continue
          }
        };

        const playerVelocity = player.getVelocity();
        const playerSpeed = Number(Math.sqrt(Math.abs(playerVelocity.x ** 2 + playerVelocity.z ** 2)).toFixed(3));

        if (player.antiflyBreak && player.isOnGround) player.antiflyBreak = false;

        if (player.movementBreak) {
          if (player.movementBreaktick > 0) {
            player.movementBreaktick -= 1
          } else {
            player.movementBreak = false
          }
        };

        let bypassmovement = false;

        if (getGamemode(player) == 1 || getGamemode(player) == 3) bypassmovement = true;

        if (world.database_config.modules.movement.noFall.state && !bypassmovement) {
          if (!player.isOnGround) {
            if (player.fallSpeed < 0 && player.getVelocity().y == 0) {
              if (player.noFallLag <= world.database_config.modules.movement.noFall.lagVl) {
                player.noFallLag++;
                lagback(player, "onGround");
                continue
              } else {
                player.noFallLag = 0;
                lagback(player, "onGround");
                flag(player, "noFall", world.database_config.modules.movement.noFall.punishment);
                continue
              }
            }
          }
        };
        if (world.database_config.modules.movement.onairtime.state && !player.movementBreak && !player.antiflyBreak) {
          let onAirState = false;
          let hasFlyEffect = false;
          if (player.dimension.getBlock({ x: x, y: y - 1, z: z })?.isAir() && player.dimension.getBlock({ x: x, y: y - 2, z: z })?.isAir()) {
            onAirState = true
          };
          if (player.getEffect('slow_falling') || player.getEffect('levitation') || player.getEffect('jump_boost')) hasFlyEffect = true;
          if (hasFlyEffect || player.getVelocity().y < -0.2 || player.isOnGround || player.isClimbing || player.isSwimming || player.isInWater || player.isGliding) {
            player.onAirTime = 0;
            player.startTimer = false
          };
          if (!hasFlyEffect && !player.isClimbing && !player.isOnGround && !player.isSwimming && onAirState && !player.isGliding && !player.startTimer && player.fallDistance < 0) {
            player.startTimer = true
          };
          if (player.startTimer) player.onAirTime++;
          if (player.onAirTime > world.database_config.modules.movement.onairtime.maxOnAirTick) {
            if (player.flyingVl <= world.database_config.modules.movement.onairtime.lagVl) {
              player.flyingVl++;
              lagback(player, "onGround");
              player.onAirTime = 0;
              player.startTimer = false
              continue
            } else {
              player.flyingVl = 0;
              lagback(player, "onGround");
              player.onAirTime = 0;
              player.startTimer = false;
              flag(player, "onairtime", world.database_config.modules.movement.onAirTime.punishment);
              continue
            }
          };
          if (world.database_config.modules.movement.vanillaFly.state && player.isFlying && !player.hasTag('ess:mayfly') && !bypassmovement) {
            player.isFlying = false;
            flag(player, "vanilla_fly", world.database_config.modules.movement.vanillaFly.punishment);
            continue
          };
          if (world.database_config.modules.movement.tp.state && !player.movementBreak) {
            const trueSpeed = Math.sqrt(playerVelocity.x ** 2 + playerVelocity.z ** 2).toFixed(2)
            if (trueSpeed > world.database_config.modules.movement.tp.trueSpeed) {
              if (!player.hasTag('speed') && !player.movementBreak && !player.getEffect("speed")?.amplifier > world.database_config.modules.movement.tp.trueSpeed) {
                if (player.tpVl <= world.database_config.modules.movement.tp.lagVl) {
                  player.tpVl++;
                  lagback(player, "slowSpeed");
                  continue
                } else {
                  player.tpVl = 0;
                  lagback(player, "slowSpeed");
                  continue
                }
              }
            };
            if (playerSpeed > world.database_config.modules.movement.speed.maxspeed) {
              if (player.speedVl <= world.database_config.modules.movement.speed.lagVl) {
                player.speedVl++;
                lagback(player, "slowSpeed");
                continue
              } else {
                player.speedVl = 0;
                lagback(player, "slowSpeed");
                flag(player, "speed", world.database_config.modules.movement.speed.punishment);
                continue
              }
            }
          };
          if (world.database_config.modules.movement.noSlow.state && !player.movementBreak && player.hasTag(`ess:right`) && !player.isGliding && !player.isSwimming && !player.getEffect('speed') && !player.hasTag('ess:riding')) {
            if (playerSpeed > world.database_config.modules.movement.noSlow.maxspeed) {
              if (player.noSlowVl <= world.database_config.modules.movement.noSlow.lagVl) {
                player.noSlowVl++;
                lagback(player, "nomal");
                continue
              } else {
                player.noSlowVl = 0;
                lagback(player, "nomal");
                flag(player, "noSlow", world.database_config.modules.movement.noSlow.punishment)
              }
            }
          };
          if (world.database_config.modules.movement.invildsprint.state && player.isSprinting) {
            let invildsprintFlag = false;
            if (player.isSneaking) {
              if (player.invildsprintVl > world.database_config.modules.movement.invildsprint.lagVl) {
                player.invildsprintVl = 0;
                lagback(player, "walking");
                flag(player, "sprint_sneaking", world.database_config.modules.movement.invildsprint.punishment);
                continue
              } else invildsprintFlag = true
            };
            if (player.isGliding) {
              if (player.invildsprintVl > world.database_config.modules.movement.invildsprint.lagVl) {
                player.invildsprintVl = 0;
                lagback(player, "walking");
                flag(player, "sprint_sneaking", world.database_config.modules.movement.invildsprint.punishment);
                continue
              } else invildsprintFlag = true
            };
            if (player.getEffect('blindness')) {
              if (player.invildsprintVl > world.database_config.modules.movement.invildsprint.lagVl) {
                player.invildsprintVl = 0;
                lagback(player, "walking");
                flag(player, "sprint_sneaking", world.database_config.modules.movement.invildsprint.punishment);
                continue
              } else invildsprintFlag = true
            };
            if (invildsprintFlag) {
              player.invildsprintVl++;
              lagback(player, "walking");
              continue
            }
          }
        };
      };
      if (world.database_config.modules.badpacket.overall) {
        if (world.database_config.modules.badpacket.slot.state) {
          if (player.selectSlot > 8 || player.selectSlot < 0) {
            player.selectSlot = 4;
            flag(player, "invild_select_slot", world.database_config.modules.badpacket.slot.punishment)
          }
        };
        if (world.database_config.modules.badpacket.rotation.state) {
          const gR = player.getRotation()
          if (gR.x > 90 || gR, x < -90 || gR.y > 180 || gR.y < -180) {
            player.setRotation({ x: 0, y: 0 });
            flag(player, "invild_rotation", world.database_config.modules.badpacket.rotation.punishment)
          }
        }
      };
      player.breakTime = 0;
      player.hitList = [];
      if (mc.system.currentTick % 20 == 0) {
        player.attackCps = 0
      };
      if (world.database_config.misc.dimensionLock.state && world.database_config.misc.overall && getGamemode(player) !== 1 && getGamemode(player) !== 3) {
        if (player.dimension.id == "minecraft:the_end" && world.database_config.misc.dimensionLock.end) {
          player.kill();
          player.sendMessage(`§c§lHey!§r§7 ${lang.stoptoend}`)
        };
        if (player.dimension.id == "minecraft:nether" && world.database_config.misc.dimensionLock.nether) {
          player.kill();
          player.sendMessage(`§c§lHey!§r§7 ${lang.stoptonether}`)
        };
      };
      if (world.database_config.misc.worldborder.state && world.database_config.misc.overall) {
        const wbl = world.database_config.misc.worldborder.size;
        if (x > wbl || x < -wbl || z > wbl || z > wbl) {
          if (wbl >= 20) {
            lagback(player, "nomal");
            player.sendMessage(`§c§lHey!§r§7 ${lang.stopgoing}`)
          }
        }
      }
    }
  }
} catch (e) {
  errorlogger(e, "systemForEach")
}
}, 0);

world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
try {
  if (ev.id !== "ess:kick") return;
  const player = ev.entity;
  if (player.op || player.host) {
    console.warn(`Essential > Failed to tempkick ${player.name} as Admin`);
    return ev.cancel = true
  };
  if (!player.tempkickstate) {
    console.warn(`Essential > Failed to tempkick ${player.name}`);
    return ev.cancel = true
  };
  player.tempkickstate = false;
  console.warn(`Essential > tempkick ${player.name} finished`)
} catch (e) {
  errorlogger(e, "triggerEvents")
}
});

mc.system.beforeEvents.watchdogTerminate.subscribe(ev => {
try {
  ev.cancel = true;
  console.warn(`Essential > watchdogTerminate | ${terminateReason}`)
} catch (e) {
  errorlogger(e, "watchDogEvent")
}
});

loadms = Date.now() - loadms
console.log('Essential > scripts loaded');
world.sendMessage(`§9Essential §l§7>§r§g ${lang.striptsloaded} §e(${loadms}ms)`)
