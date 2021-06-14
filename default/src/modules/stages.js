import { OpCode } from "./operations"

export class Stage {
	/**
	 * 用于构建一个阶段
	 * @param  {...OpCode} args 
	 */
	constructor(...args) {
		this.opCodes = [...args];
		return this
	}

	/**
	 * 让某 Creep 执行该阶段
	 * @param {Creep} creep 
	 */
	run(creep) {
		creep.memory.failed = 0
		// 如果微指令执行失败
		if (!this.opCodes[creep.memory.microop].exec(creep)) {
			creep.memory.microop += 1
			creep.memory.microop %= this.opCodes.length
		}
		// 如果一个阶段执行完时，失败次数与该阶段微指令数相同，则代表该阶段执行失败
		if (creep.memory.microop == 0 && creep.memory.failed == this.opCodes.length) {
			creep.memory.stage += 1
			return false
		}
		return true
	}
}

export class Thread {
	/**
	 * 用于构建一个线程
	 * @param  {...Stage} args 
	 */
	constructor(...args) {
		this.stages = [...args]
		return this
	}

	/**
	 * 让某 Creep 执行该线程
	 * @param {Creep} creep 
	 */
	start(creep) {
		creep.memory.stage = 0
		if (!this.stages[creep.memory.stage].run(creep)) {
			creep.memory.stage += 1
		}
	}
}