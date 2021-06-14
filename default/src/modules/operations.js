import { nearestPoint } from "./path";

/**
 * 让 Creep 采集最近的一个能量源
 * @param {Creep} creep 
 */
export const harvest = (creep) => {
	if (creep.store.getFreeCapacity() > 0) {
		let sources = creep.room.find(FIND_SOURCES_ACTIVE);
		let distnation = nearestPoint(creep, sources)
		if (creep.harvest(sources[distnation]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[distnation], { visualizePathStyle: { stroke: '#ffaa00' } });
		}
		return 0
	}
	else {
		return ERR_FULL
	}
}
