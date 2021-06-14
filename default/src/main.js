import { errorMapper } from './modules/errorMapper'
import { aKindCreepToDo, everyCreepToDo, renewCreep, generateCreep, clearMemory } from './modules/utils'
import { roleHarvester, roleUpgrader, roleBuilder } from './modules/role'

export const loop = errorMapper(() => {
	aKindCreepToDo('harvester', roleHarvester.run)
	aKindCreepToDo('upgrader', roleUpgrader.run)
	aKindCreepToDo('builder', roleBuilder.run)
	everyCreepToDo(renewCreep, 'Spawn1')
	generateCreep('Spawn1', 3, 'harvester', [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE])
	generateCreep('Spawn1', 3, 'builder', [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE])
	generateCreep('Spawn1', 3, 'upgrader', [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE])
	clearMemory()
})