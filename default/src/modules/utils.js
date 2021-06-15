/**
 * 使用一个源建造一个新个体
 * @param {string} spawn 建造新个体的源名字 例如 Spawn1
 * @param {string} name 新个体的名字，例如 Creep1
 * @param {string} role 新个体的角色，例如 harvester
 * @param {array} body 新个体的功能，例如 [WORK,CARRY,MOVE]
 */
export const newCreep = (spawn, name, role, body) => {
	Game.spawns[spawn].spawnCreep(body, name, {
		memory: { role: role, microop: 0, stage: 0, failed: 0 }
	});
}

/**
 * 让所有的 Creep 都执行这个回调函数
 * @param {function} func 回调函数，指定让每个 Creep 都干什么事情
 */
export const everyCreepToDo = (func, ...args) => {
	for (let name in Game.creeps) {
		let creep = Game.creeps[name];
		func(creep, ...args);
	}
}

/**
 * 让特定种类的 Creep 执行某操作
 * @param {string} role 给出 Creep 的种类，这里定义了 upgrader，havester，builder
 * @param {function} func 回调函数，指定 Creep 行为
 */
export const aKindCreepToDo = (role, func, ...args) => {
	for (let name in Game.creeps) {
		let creep = Game.creeps[name];
		if (creep.memory.role == role) {
			func(creep, args);
		}
	}
}

/**
 * 使用某 Spawn 给某 Creep 续命
 * @param {Creep} creep 
 */
export const renewCreep = (creep, spawn) => {
	Game.spawns[spawn].renewCreep(creep)
}

/**
 * 清除挂掉的打工人
 */
export const clearMemory = () => {
	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('Clearing non-existing creep memory:', name);
		}
	}
}

/**
 * 将某种 Creep 保持在一定数量！自动生成打工人
 * @param {string} spawn 来源
 * @param {number} num Creep 保持的数量
 * @param {string} role Creep 保持的类型
 * @param {array} body Creep 的组成
 */
export const generateCreep = (spawn, num, role, body) => {
	let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
	if (num > creeps.length) { newCreep(spawn, `${role.replace(/^\S/, s => s.toUpperCase())}${Game.time}`, role, body) }
}


/**
 * 用于初始化一个对象
 * @param {any} obj
 */
export const initObj = obj => {
	if (typeof (obj.memory.microop) == 'undefined') obj.memory.microop = 0
	if (typeof (obj.memory.stage) == 'undefined') obj.memory.stage = 0
	if (typeof (obj.memory.failed) == 'undefined') obj.memory.failed = 0
	if (typeof (obj.memory.busy) == 'undefined') obj.memory.busy = false
}