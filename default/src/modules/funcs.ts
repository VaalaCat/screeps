/**
 * 用于转运到大容量结构,即转运一次
 * @param creep 
 */
const fill = (creep: Creep) => {
	let doing = creep.memory.doing;
	if (creep.memory.filling && creep.store[doing.carry] == 0) {
		creep.memory.filling = false;
	}
	if (!creep.memory.filling && creep.store.getFreeCapacity() == 0) {
		creep.memory.filling = true;
	}
	if (creep.memory.transfer) {
		let flag = creep.transfer(doing.to, doing.carry)
		if (ERR_NOT_IN_RANGE == flag) {
			creep.moveTo(doing.to, { visualizePathStyle: { stroke: '#ffffff' } });
		} else if (flag == ERR_FULL) {
			creep.memory.doing = undefined;
		}
	}
	else {
		if (creep.withdraw(doing.from, doing.carry) == ERR_NOT_IN_RANGE) {
			creep.moveTo(doing.from, { visualizePathStyle: { stroke: '#aaaaaa' } });
		}
	}
}

/**
 * 用于采集资源,任务的to是flag位置,from是资源位置
 * @param creep 
 */
const harvest = (creep: Creep) => {
	let doing = creep.memory.doing;
	if (creep.memory.harvesting && creep.pos.lookFor(doing.from)[0].energy == 0) {
		creep.memory.harvesting = false;
	}
	if (!creep.memory.harvesting && !creep.pos.lookFor(doing.to).length) {
		creep.memory.harvesting = true;
	}
	if (creep.memory.harvesting) {
		if (creep.harvest(doing.from) == ERR_NOT_IN_RANGE || !creep.pos.isEqualTo(doing.to)) {
			creep.moveTo(doing.to, { visualizePathStyle: { stroke: '#aaaaaa' } });
		}
	}
}

/**
 * 用于生成一个指定的 Creep
 * @param spawn Spawn 的名字
 * @param body 一个身体组件数组
 * @param name Creep 的名字前缀，后面会接上时间
 * @param role Creep 的身份
 */

const spawnCreep = (spawn: string, body: any[], name: string, role: string) => {
	Game.spawns[spawn].spawnCreep(body, name + Game.time, { memory: { role: role } });
}


export const funcMap = {
	fill: fill,
	harvest: harvest,
	spawnCreep: spawnCreep
}