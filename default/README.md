# Screeps VsCode环境

## 常用属性

- `Game.creeps`：获取所有 Creep 的一个 map，Creep 的名为 key
- `Game.time`：获取游戏当前时间，常用于命名新单位

## 常用命令

- 新建 Creep 
```js
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1',{ memory: { role: 'harvester' } } );
```

- 启动安全模式
```js
Game.spawns['Spawn1'].room.controller.activateSafeMode();
```

- 放置地基
```js
Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );
```