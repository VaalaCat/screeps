import { errorMapper } from './modules/errorMapper'
import { regEvents } from './modules/eventReg'
import { runEvents } from './modules/cron'

// export const loop = errorMapper(() => {
export const loop = () => {
	let spawn1 = Game.spawns['Spawn1'];
	regEvents(spawn1);
	runEvents(spawn1);
}