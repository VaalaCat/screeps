import { nearestPoint } from "./path";

/**
 * 让 Creep 采集最近的一个能量源
 * @param {Creep} creep 
 */
export const harvest = creep => {
	if (creep.store.getFreeCapacity() == 0) return false
	let sources = creep.room.find(FIND_SOURCES_ACTIVE);
	if (sources.length) {
		let distnation = nearestPoint(creep, sources)
		if (creep.harvest(sources[distnation]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[distnation], { visualizePathStyle: { stroke: '#ffaa00' } })
		}
		return true
	}
	return false
}

/**
 * 将 Creep 采集的资源运输到最近的一个目标
 * @param {Creep} creep 
 * @param {array} dists 一个指定目标类型的数组
 */
export const transfer = (creep, dists) => {
	if (creep.store.getUsedCapacity() == 0) return false
	let targets = creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (dists.indexOf(structure.structureType) != -1) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
		}
	});
	if (targets.length) {
		let distnation = nearestPoint(creep, targets)
		if (creep.transfer(targets[distnation], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[distnation], { visualizePathStyle: { stroke: '#ffffff' } })
		}
		return true
	}
	return false
}

/**
 * 派遣 Creep 到最近的建筑工地施工
 * @param {Creep} creep 
 */
export const build = creep => {
	if (creep.store.getUsedCapacity() == 0) return false
	let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	if (targets.length) {
		let distnation = nearestPoint(creep, targets)
		if (creep.build(targets[distnation]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[distnation], { visualizePathStyle: { stroke: '#ffffff' } })
		}
		return true
	}
	return false
}

/**
 * 维修受伤最大的某个目标
 * @param {Creep} creep 
 */
export const repair = creep => {
	if (creep.store.getUsedCapacity() == 0) return false
	let targets = creep.room.find(FIND_STRUCTURES, {
		filter: object => object.hits < object.hitsMax
	});
	if (targets.length) {
		targets.sort((a, b) => a.hits - b.hits);
		if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[0]);
		}
		return true
	}
	return false
}

/**
 * 对周围的损坏建筑进行维修
 * @param {Creep} creep 
 */
export const rangeRepair = creep => {
	if (creep.store.getUsedCapacity() == 0) return false
	let targets = creep.room.find(FIND_STRUCTURES, {
		filter: object => (object.hits < object.hitsMax) && (creep.pos.inRangeTo(object, 3))
	});
	if (targets.length) {
		targets.sort((a, b) => a.hits - b.hits);
		creep.repair(targets[0])
		return true
	}
	return false
}

/**
 * 让 Creep 去升级控制器
 * @param {Creep} creep 
 */
export const upgrade = creep => {
	if (creep.store.getUsedCapacity() == 0) {
		return false
	}
	if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
		creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
	}
	return true
}


/**
 * 用于对 Creep 周围的目标进行批量操作，该动作并不包含移动
 * @param {Creep} creep 
 * @param {array} targets 目标点数组
 * @param {function} func 回调函数，用于指定具体操作
 * @param {...any} args 用于传递回调函数的参数
 */
export const nearByOperation = (creep, targets, func, ...args) => {
	for (let i in targets) {
		func(creep, targets[i], ...args)
	}
}

export class OpCode {
	/**
	 * 用于构建一个多微指令并行的微指令列表
	 * @param  {...any} args 
	 */
	constructor(...args) {
		this.operations = [...args];
		return this;
	}

	/**
	 * 对某 Creep 执行该微指令，返回主指令执行结果
	 * @param {Creep} creep 
	 * @return {boolean}
	 */
	exec(creep) {
		//如果第一个微指令（主指令）执行失败则代表失败
		let ans = this.operations[0].func(creep, this.operations[0].args)
		this.operations.every((element, index, array) => {
			if (index != 0) element.func(creep, element.args)
			return true;
		})
		return ans
	}
}