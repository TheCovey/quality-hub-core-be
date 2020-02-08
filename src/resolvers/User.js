function __resolveReference(user, context) {
	console.log(user);
	return context.prisma.user({ id: user.id });
}

function stripeCustomerConnected(parent, args, context, info) {
	return Boolean(parent.stripeCusId)
}

function stripeCoachConnected(parent, args, context, info) {
	return Boolean(parent.stripeId)
}
module.exports = {
	__resolveReference,
	stripeCustomerConnected,
	stripeCoachConnected,
};
