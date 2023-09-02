scoreboard objectives remove debugscoreboard
scoreboard objectives add debugscoreboard dummy ""
scoreboard players set @s debugscoreboard 0
replaceitem entity @s slot.weapon.offhand 0 ess:test_item
scoreboard players set @s[hasitem={item=ess:test_item}] debugscoreboard 1
replaceitem entity @s[scores={debugscoreboard=1}] slot.weapon.offhand 0 air
tellraw @s[scores={debugscoreboard=0}] {"rawtext":[{"text":"§9Essential §l§7>§r§g 除錯 | 測試:§c HoildayCreator §g結果: §cfalse"}]}
tellraw @s[scores={debugscoreboard=1}] {"rawtext":[{"text":"§9Essential §l§7>§r§g 除錯 | 測試:§c HoildayCreator §g結果: §atrue"}]}
scoreboard objectives remove debugscoreboard