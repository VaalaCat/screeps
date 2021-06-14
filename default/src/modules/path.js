/**
 * 返回 Creep 到目的地的距离的平方
 * @param {Creep} creep 
 * @param {number} x 
 * @param {number} y 
 */
export const dis = (creep, x, y) => {
	return (x - creep.pos.x) * (x - creep.pos.x) + (y - creep.pos.y) * (y - creep.pos.y)
}

/**
 * 返回最近的一个点的数组下标
 * @param {Creep} creep 
 * @param {array} points 传入一个多点数组
 */
export const nearestPoint = (creep, points) => {
	let min = 100000000000, cur = 0
	for (let i in points) {
		let tmp = dis(creep, points[i].pos.x, points[i].pos.y)
		if (tmp < min) {
			min = tmp; cur = i
		}
	}
	return cur
}

/**
 * 判断到某个点是否可达
 * @param {Creep} creep 起点 Creep
 * @param {object} point 传入一个点
 */
export const reachable = (creep, point) => {
	let route = creep.room.findPath(creep.pos, point)
	// console.log(JSON.stringify(route))
	return true
}