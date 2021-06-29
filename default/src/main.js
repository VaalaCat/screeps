import { errorMapper } from './modules/errorMapper'
import { aKindCreepToDo, everyCreepToDo, renewCreep, generateCreep, clearMemory, initObj } from './modules/utils'
import { roleHarvester, roleUpgrader, roleBuilder, roleMiscer, roleMineer } from './modules/role'
import { autoAttackCreep } from './modules/attack'
import { repair } from './modules/operations'

export const loop = errorMapper(() => {
	aKindCreepToDo('harvester', roleHarvester.run)
	aKindCreepToDo('upgrader', roleUpgrader.run)
	aKindCreepToDo('builder', roleBuilder.run)
	aKindCreepToDo('miscer', roleMiscer.run)
	aKindCreepToDo('mineer', roleMineer.run)

	everyCreepToDo(renewCreep, 'Spawn1')

	generateCreep('Spawn1', 1, 'harvester', [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE])
	generateCreep('Spawn1', 1, 'builder', [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE])
	generateCreep('Spawn1', 2, 'upgrader', [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE])
	generateCreep('Spawn1', 1, 'miscer', [WORK, WORK, ATTACK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE])
	generateCreep('Spawn1', 2, 'mineer', [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE])

	clearMemory()
	autoAttackCreep(Game.structures['60c613f3dd1942092e892a2f'])
	repair(Game.structures['60c613f3dd1942092e892a2f'])
	autoAttackCreep(Game.structures['60ced7489f3c33092dc50137'])
	repair(Game.structures['60ced7489f3c33092dc50137'])
})