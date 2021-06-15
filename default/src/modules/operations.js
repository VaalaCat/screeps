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
 * @param {any} creep 
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
 * 让 Creep 捡垃圾！
 * @param {Creep} creep 
 * @param {...number} args 可选，用于传入被捡起物品的坐标格式为两个参数，分别为x和y，不输入时会move到最近的掉落物品点去捡垃圾
 */
export const pickUp = (creep, ...args) => {
	if (creep.store.getFreeCapacity() == 0) return false;
	if (args.length != 2) {
		let targets = creep.room.find(FIND_DROPPED_RESOURCES);
		if (targets.length) {
			creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#22d18b' } });
			creep.pickup(targets[0]);
			return true
		}
		return false
	} else {
		let targets = creep.room.find(FIND_DROPPED_RESOURCES, {
			filter: object => {
				return creep.pos.isNearTo(object)
			}
		})
		if (targets.length) {
			creep.pickup(targets[0]);
			return true
		}
		return false
	}
}

/**
 * 让 Creep 取钱！
 * @param {Creep} creep 
 * @param {array} origin 指定提取物资从什么类型的结构来
 */
export const withdraw = (creep, origin) => {
	if (creep.store.getFreeCapacity() == 0) return false
	let targets = creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (origin.indexOf(structure.structureType) != -1) && (structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
		}
	});
	if (targets.length) {
		let distnation = nearestPoint(creep, targets)
		if (creep.withdraw(targets[distnation], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[distnation], { visualizePathStyle: { stroke: '#ffffff' } })
		}
		return true
	}
	return false
}

/**
 * 收集挂掉的 Creep！
 * @param {Creep} creep 
 */
export const deaderCollect = creep => {
	if (creep.store.getFreeCapacity() == 0) return false
	let deaders = creep.room.find(FIND_TOMBSTONES, {
		filter: (deader) => {
			return (deader.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
		}
	})
	if (deaders.length) {
		let distnation = nearestPoint(creep, deaders)
		if (creep.withdraw(deaders[distnation], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(deaders[distnation], { visualizePathStyle: { stroke: '#ffffff' } })
		}
		return true
	}
	return false
}

/**
 * 移动到最近的一个flag并取消
 * @param {Creep} creep 
 */
export const moveToFlag = (creep) => {
	let flags = creep.room.find(FIND_FLAGS)
	if (flags.length) {
		let distnation = nearestPoint(creep, flags)
		if (!creep.pos.isEqualTo(flags[distnation])) {
			creep.moveTo(flags[distnation], { visualizePathStyle: { stroke: '#666666' } })
		} else {
			flags[distnation].remove()
			return false
		}
		return true
	}
	return false
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