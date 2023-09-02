scoreboard objectives remove gametestapi
scoreboard objectives add gametestapi dummy
tag @s remove ess:gametestapi
scoreboard players set @s gametestapi 1
tag @s[scores={gametestapi=1}] add ess:gametestapi
tellraw @s[tag=!ess:gametestapi] {"rawtext":[{"text":"§9Essential §l§7>§r§g 除錯 | 測試:§c BetaAPI §g結果: §cfalse"}]}
tellraw @s[tag=ess:gametestapi] {"rawtext":[{"text":"§9Essential §l§7>§r§g 除錯 | 測試:§c BetaAPI §g結果: §atrue"}]}
tag @s[scores={gametestapi=1}] remove ess:gametestapi
scoreboard players reset @s gametestapi