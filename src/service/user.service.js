const connection = require('../app/database');
class UserService {
	async create(user) {
		const { name, password } = user;
		const statement = `insert into user (name,password) values(?,?)`;
		const result = await connection.execute(statement, [name, password]);
		return result;
	}

	async getUserByName(name) {
		const statement = `select * from user where name = ?`;
		const result = await connection.execute(statement, [name]);
		return result[0];
	}
	async updateAvatarUrlById(id, avatarUrl) {
		const statement = `update user set avatar_url = ? where id = ?`;
		const [result] = await connection.execute(statement, [avatarUrl, id]);
		return result;
	}
}
module.exports = new UserService();
