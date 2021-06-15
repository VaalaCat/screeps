import { errorMapper } from './modules/errorMapper'
import { aKindCreepToDo, everyCreepToDo, renewCreep, generateCreep, clearMemory, initCreep } from './modules/utils'
import { roleHarvester, roleUpgrader, roleBuilder, roleMiscer } from './modules/role'

export const loop = errorMapper(() => {
	aKindCreepToDo('harvester', roleHarvester.run)
	aKindCreepToDo('upgrader', roleUpgrader.run)
	aKindCreepToDo('builder', roleBuilder.run)
	aKindCreepToDo('miscer', roleMiscer.run)
	everyCreepToDo(renewCreep, 'Spawn1')
	generateCreep('Spawn1', 3, 'harvester', [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE])
	generateCreep('Spawn1', 2, 'builder', [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE])
	generateCreep('Spawn1', 2, 'upgrader', [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE])
	generateCreep('Spawn1', 1, 'miscer', [WORK, WORK, WORK, ATTACK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE])
	clearMemory()
})