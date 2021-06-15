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
		let execSuccess = false
		for (let i = creep.memory.microop; i < this.opCodes.length; i++) {
			execSuccess = this.opCodes[i].exec(creep)
			if (!execSuccess) {
				creep.memory.failed++
				creep.memory.microop++
				creep.memory.microop %= this.opCodes.length
			} else {
				creep.memory.failed = 0
				break
			}
		}
		// 如果一个阶段执行完时，失败次数与该阶段微指令数相同，则代表该阶段执行失败
		if (creep.memory.microop == 0 && creep.memory.failed == this.opCodes.length) {
			creep.memory.failed = 0
			return false
		}
		if (creep.memory.microop == 0) { creep.memory.failed = 0; }
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
		let runSuccess = this.stages[creep.memory.stage].run(creep)
		// 如果阶段运行失败
		if (!runSuccess) {
			creep.memory.stage += 1
			creep.memory.stage %= this.stages.length
		}
	}
}