# Screeps of VaalaCat

## 常用属性

- `Game.creeps`：获取所有 Creep 的一个 map，Creep 的名为 key
- `Game.time`：获取游戏当前时间，常用于命名新单位

## 常用命令

- 新建 Creep 
```js
Game.spawns['Spawn1'].spawnCreep( [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM], 'Miscer1',{ memory: { role: 'miscer' ,microop: 0, stage: 0, failed: 0 } } );
```

- 启动安全模式
```js
Game.spawns['Spawn1'].room.controller.activateSafeMode();
```

- 放置地基
```js
Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );
```

- 占领房间
```js
Game.creeps['Miscer1'].claimController(Game.creeps['Miscer1'].room.controller)
```

## 对象行为架构:

### 简介

Creep 架构更新，由于之前的事件链模型在任务复杂度急剧增加时效率急剧降低并且我的脑子已经顶不住了，所以使用事件驱动的方式进行了重构

新的事件/任务驱动型的模型将会有两大类任务

1. 主体为 Creep 的任务
2. 主体为不可移动的生产任务

对 Creep 的任务维护两个消息队列

1. 用以运输的 MOVE 为主的任务队列

	任务结构为
	```ts
	let sampleTask = {
		from : originPos,
		carry : resourceType,
		do : functionDo,
		to : destinationPos,
		end : whenToFinish
	};
	```

2. 用以采集/建造/维修等 WORK 为主的任务队列

	任务结构为
	```ts
	let sampleTask = {
		from : originPos,
		carry : resourceType,
		do : functionDo,
		to : destinationPos,
		end : whenToFinish
	};
	```

对于主体为非移动的任务，采用事件注册方式，将任务注册在计时器中定时执行，事件结构为
```ts
let genCreep = {
	cronTime : Game.time + 500, // 当前时间后延 500 Tick 执行
	do : functionDo,
	args : [param]
};
```

对于任意一种任务，都将其`queue.push(task)`进入队列/计时器

但二者的执行方式有所不同

对于 creep 的任务，执行方式为
```ts
let doing = creep.memory.doing;

run : (creep) => {
	if (!doing) {
		if (creep.room.memory.transQueue){
			doing = transQueue.shift();
		}
	}

	if (doing) {
		doing.do(doing.from, doing.carry, doing.to);
		if (doing.end) {
			doing = undefined;
		}
	}
}
```
对于注册型的事件我们需要这样执行
```ts
let timer = {};

addTask : (task) => {
	if (!timer[task.cronTime]) {
		timer[task.cronTime] = [];
	}
	timer[task.cronTime].push(task);
}

run : () => {
	if (timer[Game.time]) {
		for (let task of timer[Game.time]) {
			task.do(...args);
		}
	}
}
```
每一个任务都可以由任意对象发布，要注意事件发生器发布事件不要重复