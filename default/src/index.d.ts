interface CreepMemory {

	transfer: boolean;
	/**
	 * 该角色当前执行的任务
	 */
	doing: any;
	/**
	 * 该 creep 的角色
	 */
	role: string;
	filling: boolean;
	withDrawing: boolean;
	harvesting: boolean;
}

interface RoomMemory {
	/**
	 * 转运任务队列
	 */
	transQueue: any[];
}