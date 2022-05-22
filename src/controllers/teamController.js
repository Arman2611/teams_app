
const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {

	// Models
	const { Team, Match, Score, Team_Matches } = require('../models/index')(sequelize);

	async function getTeamsList (ctx, next) {
		try {
			await Team.sync( {alter: true} );

			// If there is no query with request
			if (Object.keys(ctx.request.query).length === 0) {

				// Read teams list from database
				const teams = await Team.findAll({
					include: [
						{
							model: Match,
							as: "matches"
						}
					]
				});

				ctx.status = 200;
				ctx.body = teams;
			} else {
				// If there is query in request

				// Crafting attributes array according to request query "fields" parameter
				const attributesArray = [];
				
				// If request contains "fields" parameter
				if (ctx.request.query['fields'] !== undefined && ctx.request.query['fields'] !== '') {
					
					// Convert ctx.request.query['fields'] to array
					const fields = ctx.request.query['fields'].split(',');

					fields.forEach((field) => {
						switch (field) {
							case "name":
								attributesArray.push("name");
								break;
							case "abbreviation":
								attributesArray.push("abbreviation");
								break;
							case "league":
								attributesArray.push("league");
								break;
							case "date_of_foundation":
								attributesArray.push("date_of_foundation");
								break;
							case "matches":
								attributesArray.push("matches");
								break;
						}
					});
				} else {
					attributesArray.push("name","abbreviation","league","date_of_foundation","matches")
				};
				

				// SQL query object
				const whereObject = {};

				// Crafting SQL query object according to request query parameters
				for (queryParameter in ctx.request.query) {
					switch (queryParameter) {
						case 'name':
							whereObject.name = { [Sequelize.Op.substring]: ctx.request.query.name }
							break;
						case 'league':
							whereObject.league = ctx.request.query.league
							break;
						case 'abbreviation':
							whereObject.abbreviation = ctx.request.query.abbreviation
							break;
					}
				};

				// Crafting date query
				if ( (ctx.request.query['date_of_foundation[from]'] !== undefined) && (ctx.request.query['date_of_foundation[to]'] !== undefined) ) {
					whereObject.date_of_foundation = {
						[Sequelize.Op.between]: [
							new Date(ctx.request.query['date_of_foundation[from]']).toISOString(),
							new Date(ctx.request.query['date_of_foundation[to]']).toISOString()
						]
					}
				} else if (ctx.request.query['date_of_foundation[from]'] !== undefined && ctx.request.query['date_of_foundation[to]'] === undefined) {
					whereObject.date_of_foundation = {
						[Sequelize.Op.gt]: new Date(ctx.request.query['date_of_foundation[from]']).toISOString()
					}
				} else if (ctx.request.query['date_of_foundation[from]'] === undefined && ctx.request.query['date_of_foundation[to]'] !== undefined) {
					whereObject.date_of_foundation = {
						[Sequelize.Op.lt]: new Date(ctx.request.query['date_of_foundation[to]']).toISOString()
					}
				};

				// Get teams
				const filteredTeams = await Team.findAll({
					attributes: attributesArray,
					where: whereObject,
					include: [
						{
							model: Match,
							as: "matches"
						}
					]
				})

				ctx.status = 200;
				ctx.body = filteredTeams;
			}
		} catch(err) {
			console.log(err)
			ctx.status = 500;
			ctx.body = 'Failed to read teams list from database'
		}
	};

	async function getTeamById (ctx, next) {
		try {
			await Team.sync( {alter: true} );

			// Check if team with given id exists on database
			const team = await Team.findByPk(ctx.request.params.team_id);

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
					abbreviation: ctx.request.body.abbreviation,
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
			const team = await Team.findByPk(ctx.request.body.team_id);			

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
			const team = await Team.findByPk(ctx.request.body.team_id);			

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