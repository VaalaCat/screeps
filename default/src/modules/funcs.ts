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

export const funcMap = {
	fill: fill,
	harvest: harvest
}