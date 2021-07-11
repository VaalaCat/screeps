import { Task } from './taskGen';
import { funcMap } from './funcs';

/**
 * 主要部件为 CARRY 和 MOVE 的搬砖工人
 */
export const roleTransporter = {
	/**
	 * 让工人搬起来！
	 * @param creep Creep 对象
	 */
	run: (creep: Creep) => {
		let doing = creep.memory.doing;
		if (!doing) {
			if (creep.room.memory.transQueue) {
				doing = creep.room.memory.transQueue.shift();
			}
		}

		if (doing) {
			funcMap[doing.todo](creep);
		}
	}
}

/**
 * 主要部件为 MOVE 和 WORK 的打工人
 */
export const roleWorker = {
	/**
	 * 让工人开始打工
	 * @param creep Creep 对象
	 */
	run: (creep: Creep) => {
		let doing = creep.memory.doing;
		if (!doing) {
			if (creep.room.memory.workQueue) {
				doing = creep.room.memory.workQueue.shift();
			}
		}
		if (doing) {
			funcMap[doing.todo](creep);
		}
	}
}