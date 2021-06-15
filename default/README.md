# Screeps of VaalaCat

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

## 对象行为架构:

### 简介

Creep 架构（可以拓展到其他对象）：

进程 -> 阶段 -> 微指令

- 进程：每一个 Creep 都有且只有一个进程
- 阶段：每个进程包含多个阶段，每个阶段都进行某特定可循环的操作并具有结束符标识，阶段结束后会进入下一个阶段
- 微指令：每个阶段包含多个微指令，微指令中某些指令可以并行处理，每个微指令都会返回操作状态，微指令具有完成才回溯的特性

例如下图

```
         ┌─────────────┬─────────────┐
         │   opcode1   │   opcode2   │
┌────────┼─────────────┼─────────────┤
│        │ harvest     │ transfer    │
│ stage1 ├─────────────┼─────────────┤
│        │ rangeRepair │ rangeRepair │
├────────┼─────────────┼─────────────┤
│        │ build       │ harvest     │
│ stage2 ├─────────────┼─────────────┤
│        │ rangeRepair │ rangeRepair │
├────────┼─────────────┼─────────────┤
│        │ update      │ harvest     │
│ stage3 ├─────────────┼─────────────┤
│        │ rangeRepair │ rangeRepair │
└────────┴─────────────┴─────────────┘
```

该 Creep 含有三个阶段，每个阶段都含有两个微指令，并且每个主微指令（含有move操作）都与 `rangeRepair` 微指令流水线进行处理提高效率

### 实现

- 微指令：

	- 维护一个失败次数：`creep.memory.failed` 用于记录阶段内失败次数，每次阶段归零时判断该变量是否与微指令数量相同，判断后对其进行归零

- 阶段：阶段与微指令不同，阶段可以被更高优先级的阶段打断，并且没有回溯限制，当更高优先级的阶段可以执行时，会立即中断当前阶段，进入上一阶段，具体实现见微指令中阶段切换

	- 阶段内循环：使用 `creep.memory.microop` 记录当前微指令执行进度，进度以主指令为准，该值在对象初始化时置零，当一个微指令无法再执行时，执行进度自增，使用模运算进行回溯，强烈不推荐将两个以上的微指令组成为一个阶段，要进行其他操作请新增 `stage`

	- 阶段切换：当失败次数与微指令数量一样时切换，使用 `creep.memory.stage` 记录当前阶段执行进度，该值在对象初始化时置零，每次进程执行时，该值都从零开始计数