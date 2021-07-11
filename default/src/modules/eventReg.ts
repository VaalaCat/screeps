import { addEvent } from "./cron"
import { StructEvent } from "./taskGen"

export const regEvents = (spawn: StructureSpawn) => {
	let e1 = new StructEvent(Game.time + 1, 'spawnCreep', [
		spawn.name,
		[WORK, CARRY, MOVE],
		'worker',
		'worker'
	]);
	addEvent(e1, spawn);
}