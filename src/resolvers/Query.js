const { getUserId, validToken } = require('../utils');

/*
  Test query

  @return {String} 
*/
function info() {
	return 'Welcome to Quality Hub';
}

/*
  @param {ID} id: id of user

  Get info of a user by their ID

  @return {Object}  - Type User with specified ID
*/
async function user(parents, args, context, info) {
	return await context.prisma.user({ id: args.id });
}

/*
  Get info of all users

  @return {[Object]}  - All users
*/
async function users(parent, args, context, info) {
	// await checkAdmin(context);
	let { keywords } = args;
	let where;
	if (keywords) {
		where = { OR: [] };
		keywords = keywords.toLowerCase();
		let split = splitAndTrimTags(keywords);
		split.forEach(word => {
			where.OR.push({ fn_lc_starts_with: word.name });
			where.OR.push({ ln_lc_starts_with: word.name });
			where.OR.push({ city_lc_starts_with: word.name });
			where.OR.push({ state_lc_starts_with: word.name });
		});
	}
	return await context.prisma.users({ where });
}

/*
  Get info of self, or info or user stored in token

  @return {Object}  - Type User 
*/
async function me(_parent, _args, context) {
	return await context.prisma.user({ id: getUserId(context) });
}

function splitAndTrimTags(tagString) {
	const tagArray = tagString.split(',');
	return tagArray.map(tag => {
		return { name: tag.trim() };
	});
}

function checkToken(parent, args, context, info) {
	return validToken(context)
}

module.exports = {
	user,
	users,
	info,
	me,
	checkToken
};
