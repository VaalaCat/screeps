
/**
 * 自动攻击最近的 Creep
 * @param {Creep|StructureTower} obj 
 */
export const autoAttackCreep = obj => {
	if (obj.store.getUsedCapacity() == 0) return false
	const target = obj.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	if (target) {
		if (obj.attack(target) == ERR_NOT_IN_RANGE) {
			obj.moveTo(target);
		}
		return true
	}
	return false
}