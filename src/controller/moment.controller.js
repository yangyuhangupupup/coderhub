const fs = require('fs');
const {
	create,
	getMomentById,
	getMonentList,
	update,
	remove,
	hasLabel,
	addLabel,
} = require('../service/moment.service');
const { PICTURE_PATH } = require('../constance/file-path');
const { getFileByFileName } = require('../service/file.service');
class MomentController {
	async create(ctx, next) {
		//1.获取数据(userid ,content)
		const userID = ctx.user.id;
		const content = ctx.request.body.content;
		console.log(userID, content);
		const result = await create(userID, content);
		// console.log(result, 'result');
		ctx.body = result;
	}
	async detail(ctx, next) {
		const momentid = ctx.params.momentId;
		//console.log(ctx.query);
		//ctx.query针对 /haha?name=123
		//根据ID查询这条数据
		const result = await getMomentById(momentid);
		console.log(result, 'result');
		ctx.body = result;
	}

	async list(ctx, next) {
		const { offect, limit } = ctx.query;
		const result = await getMonentList(offect, limit);
		// console.log(offect, limit, 'searchbody');
		// console.log(result);
		ctx.body = result;
	}
	async update(ctx, next) {
		const { momentId } = ctx.params;
		const { content } = ctx.request.body;
		const result = await update(content, momentId);
		ctx.body = result;
	}
	async remove(ctx, next) {
		//1.获取momentid
		const { momentId } = ctx.params;
		//2.删除内容
		const result = await remove(momentId);
		ctx.body = result;
	}
	async addLabels(ctx, next) {
		const { labels } = ctx;
		const { momentId } = ctx.params;

		// 2.添加所有的标签
		for (let label of labels) {
			//2.1判断标签是否已和动态有关系
			const isExist = await hasLabel(momentId, label.id);
			if (!isExist) {
				await addLabel(momentId, label.id);
			}
		}
		ctx.body = '给动态添加标签成功';
	}

	async fileInfo(ctx, next) {
		let { filename } = ctx.params;
		const fileinfo = await getFileByFileName(filename);
		const { type } = ctx.query;
		const types = ['small', 'middle', 'large'];
		if (types.some((item) => item === type)) {
			filename = filename + '-' + type;
		}
		ctx.response.set('content-type', fileinfo.mimetype);
		ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
	}
}
module.exports = new MomentController();
