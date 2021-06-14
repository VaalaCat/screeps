import { nearestPoint } from "./path";

/**
 * 定义一个专门采集能量的 Creep！
 */
export const roleHarvester = {

	/**
	 * 让 Creep 去挖矿！
	 * @param {Creep} creep 
	 */
	run: creep => {
		if (creep.room.energyCapacityAvailable == creep.room.energyAvailable) {
			roleBuilder.run(creep)
		} else {
			if (creep.store.getFreeCapacity() > 0) {
				let sources = creep.room.find(FIND_SOURCES);
				let distnation = nearestPoint(creep, sources)
				if (creep.harvest(sources[distnation]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[distnation], { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
			else {
				let targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_TOWER) &&
							structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});
				if (targets.length > 0) {
					let distnation = nearestPoint(creep, targets)
					if (creep.transfer(targets[distnation], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[distnation], { visualizePathStyle: { stroke: '#ffffff' } });
					}
				}
			}
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
			creep.say('🔄 harvest');
		}
		if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
			creep.memory.upgrading = true;
			creep.say('⚡ upgrade');
		}

		if (creep.memory.upgrading) {
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
			}
		}
		else {
			let sources = creep.room.find(FIND_SOURCES);
			let distnation = nearestPoint(creep, sources)
			if (creep.harvest(sources[distnation]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[distnation], { visualizePathStyle: { stroke: '#ffaa00' } });
			}
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

		if (creep.room.find(FIND_MY_CONSTRUCTION_SITES).length == 0) {
			let targets = creep.room.find(FIND_STRUCTURES, {
				filter: object => object.hits < object.hitsMax
			});

			targets.sort((a, b) => a.hits - b.hits);

			if (targets.length > 0) {
				if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0]);
				}
			}
			roleUpgrader.run(creep)
		}
		else {
			if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.building = false;
				creep.say('🔄 harvest');
			}
			if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
				creep.memory.building = true;
				creep.say('🚧 build');
			}

			if (creep.memory.building) {
				let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				let distnation = nearestPoint(creep, targets)
				if (targets.length) {
					if (creep.build(targets[distnation]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[distnation], { visualizePathStyle: { stroke: '#ffffff' } });
					}
				}
			}
			else {
				let sources = creep.room.find(FIND_SOURCES);
				let distnation = nearestPoint(creep, sources)
				if (creep.harvest(sources[distnation]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[distnation], { visualizePathStyle: { stroke: '#ffaa00' } })
				}
			}
		}
	}
};