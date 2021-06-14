import { OpCode } from "./operations"

export let Stage = class {
	/**
	 * 用于构建一个阶段
	 * @param  {...OpCode} args 
	 */
	constructor(...args) {
		this.opCodes = [...args];
	}

	/**
	 * 让某 Creep 执行该阶段
	 * @param {Creep} creep 
	 */
	run(creep) {
		creep.memory.failed = 0
		// 如果微指令执行失败
		if (!this.opCodes[creep.memory.microop].run(creep)) {
			creep.memory.microop += 1
			creep.memory.microop %= this.opCodes
		}
		// 如果一个阶段执行完时，失败次数与该阶段微指令数相同，则代表该阶段执行失败
		if (creep.memory.microop == 0 && creep.memory.failed == this.opCodes.length) {
			creep.memory.stage += 1
			return false
		}
		return true
	}
}

export let Thread = class {
	/**
	 * 用于构建一个线程
	 * @param  {...Stage} args 
	 */
	constructor(...args) {
		this.stages = [...args]
	}

	/**
	 * 让某 Creep 执行该线程
	 * @param {Creep} creep 
	 */
	run(creep) {
		creep.memory.stage = 0
		if (!this.stages[creep.memory.stage].run(creep)) {
			creep.memory.stage += 1
		}
	}
}