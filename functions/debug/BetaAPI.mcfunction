scoreboard objectives remove gametestapi
scoreboard objectives add gametestapi dummy
tag @s remove ess:gametestapi
scoreboard players set @s gametestapi 1
tag @s[scores={gametestapi=1}] add ess:gametestapi
execute as @s[tag=!ess:gametestapi] run tellraw @a {"rawtext":[{"text":"§9Essential §l§7>§r§c Beta API §gis not enabled!"}]}
tag @s[scores={gametestapi=1}] remove ess:gametestapi
scoreboard players reset @s gametestapi
