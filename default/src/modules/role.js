import { nearestPoint } from "./path";
import { harvest, transfer, rangeRepair, build, upgrade } from "./operations"

/**
 * 定义一个专门采集能量的 Creep！
 */
export const roleHarvester = {

	/**
	 * 让 Creep 去挖矿！
	 * @param {Creep} creep 
	 */
	run: creep => {
		if ((creep.store.getFreeCapacity() == 0 && creep.memory.transfer == false)
			|| typeof (creep.memory.transfer) == 'undefined'
		) {
			creep.memory.transfer = true
			creep.say('🔄 transfer')
		}
		if (creep.store.getUsedCapacity() == 0 && creep.memory.transfer == true) {
			creep.memory.transfer = false
			creep.say('⛏ harvest');
		}
		if (creep.memory.transfer) {
			transfer(creep, [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION])
			rangeRepair(creep)
		} else {
			harvest(creep)
			rangeRepair(creep)
		}
	}
};

/**
 * 定义一个专门升级的 Creep
 */
export const roleUpgrader = {

	/** 
	 * 让 Creep 去升级 Controller！
	 * @param {Creep} creep
	 */
	run: creep => {

		if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.upgrading = false;
			creep.say('⛏ harvest');
		}
		if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
			creep.memory.upgrading = true;
			creep.say('⚡ upgrade');
		}

		if (creep.memory.upgrading) {
			upgrade(creep)
		}
		else {
			harvest(creep)
		}
	}
};

/**
 * 定义一个用于建筑的 Creep
 */
export const roleBuilder = {

	/** 
	 * 让 Creep 去修房子！
	 * @param {Creep} creep
	 */
	run: creep => {

		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
			creep.say('⛏ harvest');
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			creep.memory.building = true;
			creep.say('🚧 build');
		}

		if (creep.memory.building) {
			roleUpgrader.run(creep)
		}
		else {
			harvest(creep)
		}
	}
};