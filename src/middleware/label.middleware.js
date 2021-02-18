const service = require('../service/label.service');
const checkLabelExists = async (ctx, next) => {
	const { labels } = ctx.request.body;
	//判断每一个标签在label中是否存在
	const newLabels = [];
	for (let name of labels) {
		const labelResult = await service.getLabelByName(name);
		// console.log(labelResult);
		const label = { name };
		// console.log(label);
		if (!labelResult) {
			//创建标签
			const result = await service.create(name);
			label.id = result.insertId;
		} else {
			label.id = labelResult.id;
		}
		newLabels.push(label);
		// console.log(newLabels);
	}
	ctx.labels = newLabels;
	await next();
};
module.exports = {
	checkLabelExists,
};
