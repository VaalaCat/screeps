import { nearestPoint } from "./path";
import { harvest, transfer, rangeRepair, build, upgrade, OpCode, pickUp, withdrawAll, deaderCollect, moveToFlag, repair, withdrawStructure } from "./operations"
import { Stage, Thread } from "./stages"
import { autoAttackCreep } from "./attack"


let bud = new OpCode(
	{ func: build, args: '' },
	{ func: rangeRepair, args: '' }
)

let harv = new OpCode(
	{ func: harvest, args: '' }
)

let trans = new OpCode(
	{ func: transfer, args: [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION] },
	{ func: rangeRepair, args: '' }
)

let upg = new OpCode(
	{ func: upgrade, args: '' },
	{ func: rangeRepair, args: '' }
)

let pik = new OpCode(
	{ func: pickUp, args: '' }
)

let rpir = new OpCode(
	{ func: repair, args: '' }
)

let wthdwall = new OpCode(
	{ func: withdrawAll, args: FIND_RUINS }
)

let cldead = new OpCode(
	{ func: deaderCollect, args: '' }
)

let mvtflg = new OpCode(
	{ func: moveToFlag, args: '' }
)

let autoatkcrp = new OpCode(
	{ func: autoAttackCreep, args: '' }
)

let getResource = new OpCode(
	{ func: withdrawStructure, args: [STRUCTURE_CONTAINER] }
)

/**
 * 定义一个只用来挖矿的 Creep
 */
export const roleMineer = {

	/**
	 * 让 Creep 去挖矿
	 * @param {Creep} creep 
	 */
	run: creep => {

		let save = new OpCode(
			{ func: transfer, args: [STRUCTURE_CONTAINER] },
			{ func: rangeRepair, args: '' }
		)

		let stage0 = new Stage(mvtflg)
		let stage1 = new Stage(harv)
		// let stage2 = new Stage(save)

		let threadme = new Thread(stage0, stage1)

		threadme.start(creep)

	}
};

/**
 * 定义一个专门采集能量的 Creep！
 */
export const roleHarvester = {

	/**
	 * 让 Creep 去挖矿！
	 * @param {Creep} creep 
	 */
	run: creep => {
		// let stage1 = new Stage(harv)
		let stage0p5 = new Stage(pik)
		let stage1 = new Stage(getResource)
		let stage2 = new Stage(trans)
		let stage3 = new Stage(bud)
		let stage4 = new Stage(upg)

		let threadme = new Thread(stage0p5, stage1, stage2, stage3, stage4)

		threadme.start(creep)
	}
};

/**
 * 定义一个专门升级的 Creep
 */
export const roleUpgrader = {

	/** 
	 * 让 Creep 去升级 Controller！
	 * @param {Creep} creep
	 */
	run: creep => {

		// let stage1 = new Stage(harv)
		let stage0p5 = new Stage(pik)
		let stage1 = new Stage(getResource)
		let stage2 = new Stage(upg)
		let stage3 = new Stage(bud)
		let stage4 = new Stage(trans)

		let threadme = new Thread(stage0p5, stage1, stage2, stage3, stage4)

		threadme.start(creep)
	}
};

/**
 * 定义一个用于建筑的 Creep
 */
export const roleBuilder = {

	/** 
	 * 让 Creep 去修房子！
	 * @param {Creep} creep
	 */
	run: creep => {

		// let stage1 = new Stage(harv)
		let stage0p5 = new Stage(pik)
		let stage1 = new Stage(getResource)
		let stage2 = new Stage(bud)
		let stage3 = new Stage(trans)
		let stage4 = new Stage(upg)

		let threadme = new Thread(stage0p5, stage1, stage2, stage3, stage4)

		threadme.start(creep)
	}
};

/**
 * 定义一个专门用来打杂的打工人
 */
export const roleMiscer = {

	/**
	 * 让 Creep 去打杂！
	 * @param {Creep} creep 
	 */
	run: creep => {
		let transToAny = new OpCode(
			{ func: transfer, args: [STRUCTURE_STORAGE, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION] },
			{ func: rangeRepair, args: '' }
		)
		//可打断型线程
		// if (creep.memory.stage == 3) creep.memory.stage = 0

		let stage0 = new Stage(mvtflg)
		let stage0p5 = new Stage(wthdwall)
		let stage1 = new Stage(pik)
		let stage2 = new Stage(cldead)
		let stage3 = new Stage(transToAny)

		let threadme = new Thread(stage0, stage0p5, stage1, stage2, stage3)

		threadme.start(creep)
	}
}

export const roleAttacker = {

	run: obj => {
		let stage1 = new Stage(rpir)
		let stage2 = new Stage(autoatkcrp)

		let threadme = new Thread(stage1, stage2)

		threadme.start(obj)
	}
}