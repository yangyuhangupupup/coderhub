const connection = require('../app/database');
class AuthService {
	async checkResource(tableName, id, userid) {
		const statement = `select * from ${tableName} where id = ? and user_id = ?;`;
		const [result] = await connection.execute(statement, [id, userid]);

		return result.length === 0 ? false : true;
	}
}
module.exports = new AuthService();
