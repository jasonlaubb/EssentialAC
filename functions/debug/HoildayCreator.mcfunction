scoreboard objectives remove debugscoreboard
scoreboard objectives add debugscoreboard dummy ""
scoreboard players set @s debugscoreboard 0
replaceitem entity @s slot.weapon.offhand 0 ess:test_item
scoreboard players set @s[hasitem={item=ess:test_item}] debugscoreboard 1
replaceitem entity @s[scores={debugscoreboard=1}] slot.weapon.offhand 0 air
execute as @s[scores={debugscoreboard=0}] run tellraw @a {"rawtext":[{"text":"§9Essential §l§7>§r§c HoildayCreator §gis not enabled!"}]}
scoreboard objectives remove debugscoreboard
