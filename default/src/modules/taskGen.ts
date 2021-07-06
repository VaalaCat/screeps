export class StructEvent {
	cronTime: number;
	todo: string;
	args: any[];

	/**
	 * 用于构造一个定时执行的事件
	 * @param cronTime 指定事件执行的时间
	 * @param todo 指定执行的时间函数，具体名字参照函数文件
	 * @param args 指定传入给函数的参数
	 * @returns 返回一个构造完成的时间对象
	 */
	constructor(cronTime: number, todo: string, args: any[]) {
		this.cronTime = cronTime;
		this.todo = todo;
		this.args = args;
		return this;
	}
}

export class Task {

	from: RoomPosition;
	carry: any;
	todo: string;
	to: RoomPosition;
	end: string;

	/**
	 * 用于构建一个任务对象
	 * @param from 指定该任务起始地点
	 * @param carry 指定搬运的物资类型
	 * @param todo 指定函数，具体名字参照函数文件
	 * @param to 指定任务目标
	 * @param end 指定状态机结束标志
	 * @returns 返回一个构建完成的任务对象
	 */
	constructor(from: RoomPosition, carry: any, todo: string, to: RoomPosition, end: string) {
		this.from = from;
		this.carry = carry;
		this.todo = todo;
		this.to = to;
		this.end = end;
		return this;
	}
}