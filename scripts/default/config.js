export default {
  "notify": true, //Some notify may not be disabled
  "coreversion": "1",
  "uuid":"d67a1653-f8d2-4148-81cb-01fbfc838177",
  "chatFormat": {
    "chatRank": {
      "state": true,
      "default": "[player]",
      "dividingLine": "§8/§f",
      "banklet": ["§8[", "§r§8]"],
      "textcolor": "§f",
      "chatline": " §7> ",
      "namecolor": "§f"
    },
  },
  "modules": {
    "itemcheck": {
      "overall": false,
      "baditem": {
        "state": true,
        "punishment": "tempkick",
        "illegal": ["minecraft:moving_block", "minecraft:invisible_bedrock", "minecraft:fire", "minecraft:bedrock", "minecraft:barrier", "minecraft:bedrock", "minecraft:command_block", "minecraft:repeat_command_block", "minecraf:chain_command_block", "minecraft:deny", "minecraft:allow", "minecraft:light_block"],
      },
      "itemlore": {
        "state": true,
        "punishment": "tempkick"
      },
      "keepOnDeath": {
        "state": true,
        "punishment": "tempkick"
      },
      "spawnEgg": {
        "state": true,
        "punishment": "tempkick"
      },
      "nameLength": {
        "state": true,
        "maxlength": 35,
        "punishment": "none"
      },
      "canDestroy": {
        "state": true,
        "punishment": "tempkick"
      },
      "canPlaceOn": {
        "state": true,
        "punishment": "tempkick"
      },
      "enchantLevel": {
        "state": true,
        "onlydetect32k": false,
        "punishment": "tempkick"
      },
      "badEnchant": {
        "state": true,
        "punishment": "tempkick"
      },
    },
    "placecheck": {
      "overall": true,
      "illegalBlock": {
        "state": true,
        "dangerous": ["minecraft:tnt", "minecraft:respawn_anchor"],
        "illegal": ["minecraft:moving_block", "minecraft:invisible_bedrock", "minecraft:fire"],
        "punishment": { A: "none", B: "tempkick" }
      },
      "reach": {
        "state": true,
        "maxdistance": 4.5,
        "punishment": "tempkick"
      },
      "scaffold": {
        "state": true,
        "checkforawhile": {
          "state": false,
          "punishcombo": 6
        },
        "punishment": "tempkick"
      },
    },
    "breakcheck": {
      "overall": true,
      "nuker": {
        "state": true,
        "maxbreakintick": 5,
        "punishment": "tempkick"
      },
      "reach": {
        "state": true,
        "maxdistance": 4.5,
        "punishment": "tempkick"
      }
    },
    "commandblockexploit": {
      "commandblockminecart": true, //This selection only disable api
      "killnpc": false //enable this will kill npc!
    },
    "combatcheck": {
      "overall": true,
      "reach": {
        "state": true,
        "maxdistance": 5.1,
        "punishment": "tempkick"
      },
      "attackDelay": {
        "state": true,
        "maxallowcombo": 3,
        "maxallowdelayms": 2,
        "punishment": "tempkick"
      },
      "attackCps": {
        "state": true,
        "maxAllowCps": 25,
        "maxVl": 3,
        "punishment": "tempkick"
      },
      "killauraMulti": {
        "state": true,
        "maxhitintick": 2,
        "punishment": "tempkick"
      },
      "killauraAngle": {
        "state": true,
        "maxangle": 95,
        "punishment": "tempkick"
      },
      "killauraGui": {
        "state": true,
        "punishment": "tempkick"
      },
      "attackNoswing": {
        "state": undefined,
        "punishment": "tempkick"
      },
    },
    "movement": {
      "overall": true,
      "disabler": {
        "fly": {
          "state": true,
          "minlength": 10, //prevent fase cancel
          "hurtType": ["entityAttack", "entityExplosion", "blockExplosion"]
        },
        "movement": {
          "state": true,
          "length": 20,
          "hurtType": ["entityAttack", "entityExplosion", "blockExplosion"]
        },
        "onJoin": {
          "state": true,
          "length": 10,
        }
      },
      "noFall": {
        "state": true,
        "lagVl": 3,
        "punishment": "none"
      },
      "onairtime": {
        "state": true,
        "maxOnAirTick": 70,
        "lagVl": 3,
        "punishment": "none"
      },
      "jetpack": {
        "state": true,
        "minFallingDistance": -10,
        "lagVl": 3,
        "punishment": "none"
      },
      "vanillaFly": {
        "state": true,
        "mayflycheck": true,
        "punishment": "tempkick"
      },
      "speed": {
        "state": true,
        "maxspeed": 0.35,
        "lagVl": 3,
        "punishment": "none"
      },
      "tp": {
        "state": true,
        "trueSpeed": 1.5, //The max speed
        "alloedspeedlevel": 12,
        "lagVl": 2,
        "punishment": "tempkick"
      },
      "noSlow": {
        "state": true,
        "maxspeed": 0.16,
        "lagVl": 3,
        "punishment": "none"
      },
      "invmove": {
        "state": true,
        "type": {
          "moving": true,
          "attack": true,
          "useitem": true
        },
        "punishment": "tempkick"
      },
      "invildLocation": {
        "state": true,
        "minYlocation": -104,
        "punishment": "none"
      },
      "crasher": {
        "state": true,
        "dengerousLocation": 30000000,
        "punishment": "kick"
      },
      "invildsprint": {
        "state": true,
        "type": {
          "blindness": true,
          "sneaking": true,
          "gliding": true
        },
        "lagVl": 2, //prevent false flag
        "punishment": "tempkick"
      }
    },
    "entitycheck": {
      "custom": false, //most of the entityCheck is detect in entity.json, this place can let you add new detection
      "customBan": ["minecraft:pig", "minecraft:wither"]
    },
    "actioncheck": {
      "overall": true,
      "fastuse": {
        "state": true,
        "addCooldown": 2, //prevent laggy awa
        "combo": 3, //prevent laggy awa+1
        "punishment": "tempkick"
      },
      "autototem": {
        "state": true,
        "type": {
          "moving": true,
          "attack": true,
          "gui": true
        }
      },
      "autosheid": {
        "state": true,
        "type": {
          "moving": true,
          "attack": true,
          "gui": true
        }
      }
    },
    "joincheck": {
      "namespoof": {
        "is_valid": {
          "state": true,
          "string": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "
        },
        "name_length": {
          "state": true,
          "minlength": 3,
          "maxlength": 16
        }
      }
    },
    "spamcheck": {
      "overall": true,
      "moving": {
        "state": true,
        "warnVl": 2,
        "punishment": "tempkick"
      },
      "attack": {
        "state": true,
        "punishment": "tempkick"
      },
      "gui": {
        "state": true,
        "punishment": "tempkick"
      },
      "samedelay": {
        "state": true,
        "minDeff": 1,
        "combo": 3,
        "punishment": "tempkick"
      },
      "length": {
        "maxlength": 256,
        "punishment": "tempkick"
      },
    },
    "chatcheck": {
      "overall": true,
      "sendspeed": {
        "state": true,
        "minMessageDelay": 3000
      },
      "repeat": {
        "state": true,
        "repeatvl": 2,
        "string": "`~@#%^&*()-_+=/<>,./\\|$[]{}?!～＠＃％＾＆＊（）－＿＋＝／＜＞，．／\\｜＄［］｛｝？！"
      },
      "removeAllColor": {
        "state": true,
      }
    },
    "permissioncheck": {
      "adminList": ["jasonlaubb", "hutaohutao", "awa123"],
      "forceop": {
        "state": false,
        "punishment": "none"
      },
      "AntiDeop": {
        "state": false,
        "writelist": {
          "state": false,
          "writelist": ["jasonlaubb"]
        }
      },
    },
    "badpacket": {
      "overall": true,
      "attack": {
        "state": true,
        "punishment": "tempkick"
      },
      "rotation": {
        "state": true,
        "punishment": "tempkick"
      },
      "slot": {
        "state": true,
        "punishment": "tempkick"
      }
    }
  },
  "system": {
    "language": 0, //default language: 0 = ENG | 1 = CHTW | 2 = JPN
    "lagback": {
      "state": true, //turn off this might cause bug
      "nomal": {
        "speed": 0.29,
        "onGround": null,
        "locationIn": 500000, //only work when state true
        "moving": true,
        "sprinting": null
      },
      "walking": {
        "sprinting": false,
        "moving": null,
        "onGround": null
      },
      "slowSpeed": {
        "speed": 0.281,
        "moving": true,
        "onGround": null
      },
      "onGround": {
        "onGround": true,
        "moving": null
      }
    }
  },
  "misc": {
    "overall": false,
    "dimensionLock": {
      "state": false,
      "nether": false, //kill player
      "end": false
    },
    "worldborder": {
      "state": false,
      "size": 500000 //min limit: 40, this is the max and min location of x and y
    }
  }
}
