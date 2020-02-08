const bcrypt = require('bcryptjs');
const stripe = require('../stripe')

const {
	generateToken,
	checkFields,
	getUserId,
	// checkAdmin,
} = require('../utils');

module.exports = {
	signup,
	login,
	update,
	deleteUser,
	checkEmail,
	createCustomer,
	addCoachStripeId,
	createStripeLink,
	stripeDirectCharge,
	stripePayout,
	stripeBalance,
	stripePayIntent,
	stripeCreateToken,

};

/*
  @param {String!} - first_name
  @param {String!} - last_name
  @param {String!} - email
  @param {String!} - password
  @param {String!} - city
  @param {String!} - state
  @param {String}  - image_url
  @param {String}  - gender
  @param {String}  - personal_url
  @param {String}  - blog_url
  @param {String}  - twitter_url
  @param {String}  - portfolio_url
  @param {String}  - linkedin_url
  @param {String}  - github_url
  @param {String}  - bio
  @param {Boolean} - payment_info

  Adds a user to database. Email must be unique.

  @return {String} - token: required for authorization
  @return {Object} - user: type User for newly created account
*/
async function signup(_parent, args, context) {
	const { first_name, last_name, password, email, city, state } = args;
	checkFields({ first_name, last_name, password, email, city, state });
	const hash = bcrypt.hashSync(args.password, 10);
	args.password = hash;
	const user = await context.prisma.createUser({
		...args,
		fn_lc: first_name.toLowerCase(),
		ln_lc: last_name.toLowerCase(),
		city_lc: city.toLowerCase(),
		state_lc: state.toLowerCase(),
	});
	const token = generateToken(user);

	return {
		token,
		user,
	};
}

/*
  @param {String} - email
  @param {String} - password

  Find user with email, then checks password

  @return {String} - token: required for authorization
  @return {Object} - user: type User for logged in user
*/
async function login(_parent, args, context) {
	const user = await context.prisma.user({ email: args.email });
	const token = generateToken(user);
	const passwordMatch = await bcrypt.compare(args.password, user.password);
	if (!user || !passwordMatch) {
		throw new Error('Invalid Login');
	}
	return {
		token,
		user,
	};
}

/*
  Same params as signup, as any field is editable. All fields are optional. Checks for empty fields. 

  @return {Object} - Type user with updated information
*/
async function update(_parent, args, context) {
	const id = getUserId(context);
	const { first_name, last_name, city, state } = args;

	if (first_name) {
		return await context.prisma.updateUser({
			data: { ...args, fn_lc: first_name.toLowerCase() },
			where: {
				id,
			},
		});
	} else if (last_name) {
		return await context.prisma.updateUser({
			data: { ...args, ln_lc: last_name.toLowerCase() },
			where: {
				id,
			},
		});
	} else if (city) {
		return await context.prisma.updateUser({
			data: { ...args, city_lc: city.toLowerCase() },
			where: {
				id,
			},
		});
	} else if (state) {
		return await context.prisma.updateUser({
			data: { ...args, state_lc: state.toLowerCase() },
			where: {
				id,
			},
		});
	} else {
		return await context.prisma.updateUser({
			data: args,
			where: {
				id,
			},
		});
	}
}

/*
  Deletes own user

  @return {Object} type User of deleted user
*/
async function deleteUser(_parent, _args, context) {
	const id = getUserId(context);
	return await context.prisma.deleteUser({ id });
}

async function checkEmail(_parent, args, context) {
	const user = await context.prisma.user({ email: args.email });
	if (user) {
		throw new Error('Email has been taken.');
	} else {
		return 'This email is available!';
	}
}

// Stripe Integration 
async function createCustomer(_parent, args, context) {
	const { source } = args;
	console.log('turkey bacon', args);

	const userid = getUserId(context);
	let user = await context.prisma.user({ id: userid });
	// console.log(user);
		// This creates the "customer" in stripe database
		await stripe.customers.create({
			email: user.email,
			source,
		}).then(async (customer)=>{
			console.log(customer);
			cusId = customer.id;
			await context.prisma.updateUser({
				data: { stripeCusId: cusId},
				where: {
					email: user.email,
					},
	
			});
			console.log('hi')
		})
	if (!user) {
		throw new Error('not authenticated');
	}

	console.log('bye')
	return "Customer created";
}

async function addCoachStripeId(_parent, args, context) {
	console.log('addCoachStripeId args: ', args);

	const id = getUserId(context);
	const { code } = args;
	// Connects to stripes API and creates an  active connected account with the authorization_code sent to stripe from the user onboarding
	const response = await stripe.oauth.token({
		grant_type: 'authorization_code',
		code,
	});

	console.log('response', response);
	return context.prisma.updateUser({
		data: { stripeId: response.stripe_user_id },
		where: { id },
	});
}

// One time login in link for a coach to view their dashboard in stripe 
async function createStripeLink(_parent, _args, context) {
	const userid = getUserId(context);
	const user = await context.prisma.user({ id: userid });

	let login = ''

	await stripe.accounts.createLoginLink(
		user.stripeId).then(link => {
		  // asynchronously called
			console.log(link.url);
			login = link.url;
			return link.url
		})
	return login;
}


async function stripeDirectCharge(_parent, args, context) {
	const { amount, currency, source, coachId } = args;


	const coach = await context.prisma.user({id: coachId});
	const status = stripe.charges.create({
			amount,
			currency,
			source,
			transfer_data: {
				destination: coach.stripeId
			}
		})
		// {stripeCusId: user.stripeCusId})
		.then((res) => {
			console.log(res);
			return {success: "Payment successful!", error: null}
		})
		.catch(function(err){
			return {success: null, error: err.message}
		});

	return status;
}


async function stripePayout(_parent, args, context){
	const { amount, currency, method, coachId } = args;


	const coach = await context.prisma.user({ id: coachId});

	stripe.payouts.create({
		amount,
		currency,
		method,
	}, {
		stripe_account: coach.stripeId,
	}).then(function(payout){
		console.log(payout);
	}).catch(function(err){
		console.log(err);
	})
return 'Payout Successful';

}


async function stripeBalance(_parent, args, context){
	const coach = await context.prisma.user({ id: getUserId(context)});
	return stripe.balance.retrieve({
		stripe_account: coach.stripeId,
	}).then(function(balance){
		return {available: balance.available[0].amount, pending: balance.pending[0].amount}
	}).catch(function(err){
		console.log(err);
		return err
	})
}


async function stripePayIntent(_parent, args, context) {
	const { amount, currency, source, on_behalf_of } = args;

	const userid = getUserId(context);
	const user = await context.prisma.user({ id: userid });

	console.log('hey', user.stripeCusId);
console.log('no', user.stripeId);

		stripe.paymentIntents.create(
		{
			amount,
			currency,
			source,
			on_behalf_of,
			
			// application_fee_amount: 0,
		},
		{ stripe_account: user.stripeCusId }
	).then(function(paymentIntent) {
		// asynchronously called
		console.log('here', paymentIntent);
	  })
	  .catch(function(err){
		console.log(err);
	});;	

	return user;
}

async function stripeCreateToken(_parent, args, context) {
	const { customer } = args;

	const userid = getUserId(context);
	const user = await context.prisma.user({ id: userid });

	console.log(user.stripeId);

	const token = stripe.tokens.create(
		{
			customer,
		},
		{
			stripe_account: user.stripeId,
		},
	);

	console.log(token);

	return user;
}
