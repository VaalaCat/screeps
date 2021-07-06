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
			funcMap['transfer'](creep);
		}
	}
}