
module.exports = (sequelize) => {

	// Models
	const Team = require('../models/team')(sequelize);

	async function getTeamsList (ctx, next) {
		try {
			await Team.sync( {alter: true} );

			// Read teams list from database
			const teams = await Team.findAll();

			ctx.status = 200;
			ctx.body = teams;

		} catch(err) {
			ctx.status = 500;
			ctx.body = 'Failed to read teams list from database'
		}
	};

	async function getTeamById (ctx, next) {
		try {
			await Team.sync( {alter: true} );

			// Check if team with given id exists on database
			const team = await Team.findOne({ 
				where: { team_id: ctx.request.params.team_id }, 
			});

			// If team is found
			if (team !== null) {				
				// Response the team data
				ctx.status = 200;
				ctx.body = team

			} else {				
				ctx.status = 409;
				ctx.body = 'Team with given id not found on database'
			}

		} catch(err) {
			if (err.message.includes('invalid input syntax')) {
				ctx.status = 400;
				ctx.body = 'Invalid team_id format';
			} else {
				ctx.status = 500;
				ctx.body = 'Failed to get team data';
			}
		}
	};

	async function createTeam (ctx, next) {
		try {
			await Team.sync( {alter: true} );

			// Check if team with given name exists in base
			const team = await Team.findOne({ 
				where: { name: ctx.request.body.name }, 
			});			

			// If there is no team on database with such name
			if (team === null) {
				// Create a team
				const user = await Team.create({
					name: ctx.request.body.name,
					league: ctx.request.body.league,
					date_of_foundation: new Date(ctx.request.body.date_of_foundation).toISOString(),
					matches: JSON.stringify([])
				});
				await Team.sync();

				ctx.status = 201;
				ctx.body = 'The team successfully created'
			} else {
				ctx.status = 409;
				ctx.body = 'This team already exists'
			}
			
		} catch(err) {
			ctx.status = 500;
			ctx.body = 'Failed to create team'
		}
	};

	async function alterTeam (ctx, next) {
		try {
			await Team.sync( {alter: true} );

			// Check if team with given id exists on database
			const team = await Team.findOne({ 
				where: { team_id: ctx.request.body.team_id }, 
			});			

			// If team is found
			if (team !== null) {				
				// Alter the team
				await Team.update(
					{ 
						name: ctx.request.body.name || team.name, 
						league: ctx.request.body.league || team.league, 
						date_of_foundation: ctx.request.body.date_of_foundation || team.date_of_foundation
					},	{
						where: { team_id: ctx.request.body.team_id }
					} 
				);
				await Team.sync();

				ctx.status = 200;
				ctx.body = 'Team data successfully changed'
			} else {				
				ctx.status = 409;
				ctx.body = 'Team with given id not found on database'
			}
			
		} catch(err) {
			if (err.message.includes('invalid input syntax')) {
				ctx.status = 400;
				ctx.body = 'Invalid team_id format';
			} else {
				ctx.status = 500;
				ctx.body = 'Failed to change the team data';
			}			
		}
	};

	async function deleteTeam (ctx, next) {
		try {
			await Team.sync( {alter: true} );

			// Check if team with given id exists on database
			const team = await Team.findOne({ 
				where: { team_id: ctx.request.body.team_id }, 
			});			

			// If team is found
			if (team !== null) {				
				// Delete the team
				await Team.destroy({ 
					where: { team_id: ctx.request.body.team_id }, 
				});
				await Team.sync();

				ctx.status = 200;
				ctx.body = `Team ${team.name} successfully deleted`
			} else {				
				ctx.status = 409;
				ctx.body = 'Team not found on database'
			}
			
		} catch(err) {
			if (err.message.includes('invalid input syntax')) {
				ctx.status = 400;
				ctx.body = 'Invalid team_id format';
			} else {
				ctx.status = 500;
				ctx.body = 'Failed to delete the team'
			}
		}
	};

	return {
		getTeamsList: getTeamsList,
		getTeamById: getTeamById,
		createTeam: createTeam,
		alterTeam: alterTeam,
		deleteTeam: deleteTeam
	};
};