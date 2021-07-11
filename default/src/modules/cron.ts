import { StructEvent, Task } from "./taskGen";
import { funcMap } from "./funcs";
import { roleWorker, roleTransporter } from "./creep";

/**
 * 用于向某个房间添加一个事件
 * @param structEvent 想要添加的事件
 * @param spawn 该事件所在房间的 Spawn
 */
export const addEvent = (structEvent: StructEvent, spawn: StructureSpawn) => {
	let timer = spawn.room.memory.timer
	if (!timer) {
		timer = {};
	}
	if (!timer[structEvent.cronTime]) {
		timer[structEvent.cronTime] = [];
	}
	timer[structEvent.cronTime].push(structEvent);
	spawn.room.memory.timer = timer;
}

/**
 * 用于运行某房间的事件
 * @param spawn 想要运行事件的房间
 */
export const runEvents = (spawn: StructureSpawn) => {
	let timer = spawn.room.memory.timer
	console.log(JSON.stringify(timer))
	if (timer[Game.time]) {
		for (let structEvent of timer[Game.time]) {
			funcMap[structEvent.todo](...structEvent.args);
		}
		delete timer[Game.time];

	}
	spawn.room.memory.timer = timer;
}

/**
 * 用于向某房间发布一个任务
 * @param task 想要添加的任务
 * @param spawn 该任务所在房间的 Spawn
 * @param taskType 该任务的类型，为 transQeueu 或 workQeueu
 */
export const addTask = (task: Task, spawn: StructureSpawn, taskType: string) => {

}

/**
 * Creep 接受某房间的任务
 */
export const runTasks = () => {
	let creeps = Game.creeps;
	for (let i in creeps) {
		switch (creeps[i].memory.role) {
			case 'worker':
				roleWorker.run(creeps[i]);
				break;
			case 'transporter':
				roleTransporter.run(creeps[i]);
				break;
			default:
				console.log(creeps[i].name, 'is moyuing');
				creeps[i].say("我在摸鱼！");
		}
	}
}