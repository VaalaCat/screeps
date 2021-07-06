import { StructEvent } from "./taskGen";

let timer = {};

export const addTask = (structEvent: StructEvent) => {
	if (!timer[structEvent.cronTime]) {
		timer[structEvent.cronTime] = [];
	}
	timer[structEvent.cronTime].push(structEvent);
}

export const run = () => {
	if (timer[Game.time]) {
		for (let structEvent of timer[Game.time]) {
			structEvent.todo(...structEvent.args);
		}
	}
}