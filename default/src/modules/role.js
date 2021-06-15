import { nearestPoint } from "./path";
import { harvest, transfer, rangeRepair, build, upgrade, OpCode } from "./operations"
import { Stage, Thread } from "./stages"


let bud = new OpCode(
	{ func: build, args: '1' },
	{ func: rangeRepair, args: '' }
)
let harv = new OpCode(
	{ func: harvest, args: '2' }
)
let trans = new OpCode(
	{ func: transfer, args: [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION] },
	{ func: rangeRepair, args: '' }
)
let upg = new OpCode(
	{ func: upgrade, args: '3' },
	{ func: rangeRepair, args: '' }
)

/**
 * 定义一个专门采集能量的 Creep！
 */
export const roleHarvester = {

	/**
	 * 让 Creep 去挖矿！
	 * @param {Creep} creep 
	 */
	run: creep => {
		let stage1 = new Stage(harv)
		let stage2 = new Stage(upg)
		let stage3 = new Stage(trans)
		let stage4 = new Stage(bud)

		let threadme = new Thread(stage1, stage2, stage3, stage4)

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

		let stage1 = new Stage(harv)
		let stage2 = new Stage(trans)
		let stage3 = new Stage(bud)
		let stage4 = new Stage(upg)

		let threadme = new Thread(stage1, stage2, stage3, stage4)

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

		let stage1 = new Stage(harv)
		let stage2 = new Stage(bud)
		let stage3 = new Stage(trans)
		let stage4 = new Stage(upg)

		let threadme = new Thread(stage1, stage2, stage3, stage4)

		threadme.start(creep)
	}
};