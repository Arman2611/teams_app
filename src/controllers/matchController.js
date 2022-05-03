
module.exports = (sequelize) => {

	// Models
	const Team = require('../models/team')(sequelize);
	const Match = require('../models/match')(sequelize);
	const Score = require('../models/score')(sequelize);

	async function getMatchesList (ctx, next) {
		try {
			await Match.sync( {alter: true} );

			// Read matches list from database
			const matches = await Match.findAll();

			ctx.status = 200;
			ctx.body = matches;

		} catch(err) {
			ctx.status = 500;
			ctx.body = 'Failed to read matches list from database'
		}
	};

	async function getMatchById (ctx, next) {
		try {
			await Match.sync( {alter: true} );

			// Check if match with given id exists on database
			const match = await Match.findByPk(ctx.request.params.match_id);

			// If match is found
			if (match !== null) {
				// Response the match data
				ctx.status = 200;
				ctx.body = match

			} else {				
				ctx.status = 409;
				ctx.body = 'Match with given id not found on database'
			}

		} catch(err) {
			if (err.message.includes('invalid input syntax')) {
				ctx.status = 400;
				ctx.body = 'Invalid match_id format';
			} else {
				ctx.status = 500;
				ctx.body = 'Failed to get match data';
			}
		}
	};

	async function createMatch (ctx, next) {
		try {
			await sequelize.sync( {alter: true} );

			// Check if teams with given Id exist on database
			const team1 = await Team.findOne({ 
				where: { team_id: ctx.request.body.home_team_id }
			});
			const team2 = await Team.findOne({ 
				where: { team_id: ctx.request.body.away_team_id }
			});

			// If both home and away teams are found on database
			if (team1 !== null && team2 !== null) {

				// Create match
				const match = await Match.create({
					home_team_id: ctx.request.body.home_team_id,
					away_team_id: ctx.request.body.away_team_id,
					home_team_name: team1.name,
					away_team_name: team2.name,
					stadium: ctx.request.body.stadium,
					date_of_match: new Date(ctx.request.body.date_of_match).toISOString()
				});

				// Create Score instance for current match
				const score = await Score.create({
					match_id: match.match_id
				});

				// Add score reference to match instance
				await Match.update({
					score_id: score.score_id
				}, {
					where: { match_id: match.match_id }
				});

				// Add match_id team1 matches list
				await Team.update({
					matches: JSON.stringify([...JSON.parse(team1.matches), match.match_id])
				}, {
					where: { team_id: team1.team_id }
				});

				// Add match_id team2 matches list
				await Team.update({
					matches: JSON.stringify([...JSON.parse(team2.matches), match.match_id])
				}, {
					where: { team_id: team2.team_id }
				});

				await sequelize.sync();

				ctx.status = 201;
				ctx.body = 'The match successfully created'
			} else {
				ctx.status = 404;
				ctx.body = 'Home or Away team data not found on database'
			}
			
		} catch(err) {
			if (err.message.includes('invalid input syntax')) {
				ctx.status = 400;
				ctx.body = 'Invalid home_team_id or away_team_id format';
			} else {
				ctx.status = 500;
				ctx.body = 'Failed to create match';
			}	
		}
	};

	async function alterMatch (ctx, next) {		
		try {
			await sequelize.sync();

			// Check if match with given id exists on database
			const match = await Match.findByPk(ctx.request.body.match_id);			

			// If match is found
			if (match !== null) {

				// Request with score_id is considered as request for only editing the match score
				if (ctx.request.body.hasOwnProperty('score_id')) {

					// Check if score with given id exists on database
					const score = await Score.findByPk(ctx.request.body.score_id);

					if (score !== null) {

						// Only ongoing matches scores can be edited
						if (match.match_status === "ongoing") {

							// Edit the match score in Score instance
							await Score.update(
								{
									home_team_goals: ctx.request.body.match_score[0] || score.home_team_goals, 
									away_team_goals: ctx.request.body.match_score[1] || score.away_team_goals
								},	{
									where: { score_id: score.score_id }
								} 
							);

							// Edit the match score in Match instance
							const match_score_string = `${ctx.request.body.match_score[0]}:${ctx.request.body.match_score[1]}`;
							await Match.update(
								{
									match_score: match_score_string || match.match_score
								},	{
									where: { match_id: ctx.request.body.match_id }
								} 
							);
							await sequelize.sync();
							
							ctx.status = 200;
							ctx.body = 'Match score successfully changed'
						} else {
							ctx.status = 400;
							ctx.body = 'Only ongoing matches scores can be edited'
						}
						
					} else {
						ctx.status = 409;
						ctx.body = 'Score with given id not found on database'
					}

				} else {
					// Edit the match data
					await Match.update(
						{
							match_status: ctx.request.body.match_status || match.match_status, 
							stadium: ctx.request.body.stadium || match.stadium, 
							date_of_match: ctx.request.body.date_of_match || match.date_of_match
						},	{
							where: { match_id: ctx.request.body.match_id }
						} 
					);
					await Match.sync();

					ctx.status = 200;
					ctx.body = 'Match data successfully changed'
				}			
				
			} else {				
				ctx.status = 409;
				ctx.body = 'Match with given id not found on database'
			}
			
		} catch(err) {
			if (err.message.includes('invalid input syntax')) {
				ctx.status = 400;
				ctx.body = 'Invalid match_id format';
			} else {
				ctx.status = 500;
				ctx.body = 'Failed to edit the match data'
			}		
		}
	};

	async function deleteMatch (ctx, next) {
		try {
			await sequelize.sync( {alter: true} );

			// Check if match with given id exists on database
			const match = await Match.findByPk(ctx.request.body.match_id);

			// If match is found
			if (match !== null) {

				// Check if teams with given Id exist on database
				const team1 = await Team.findOne({
					where: { team_id: match.home_team_id }
				});
				const team2 = await Team.findOne({
					where: { team_id: match.away_team_id }
				});

				// Delete the Score instance of this match
				await Score.destroy({ 
					where: { score_id: match.score_id }, 
				});

				// Delete match references from matches array of team1
				await Team.update({
					matches: JSON.stringify(JSON.parse(team1.matches).filter(match_id => 
						match_id !== match.match_id
					))
				}, {
					where: { team_id: team1.team_id }
				});

				// Delete match references from matches array of team2
				await Team.update({
					matches: JSON.stringify(JSON.parse(team2.matches).filter(match_id => 
						match_id !== match.match_id
					))
				}, {
					where: { team_id: team2.team_id }
				});

				// Delete the match
				await Match.destroy({ 
					where: { match_id: match.match_id }, 
				});

				await sequelize.sync();

				ctx.status = 200;
				ctx.body = `Match '${team1.name} - ${team2.name}' successfully deleted`
			} else {				
				ctx.status = 409;
				ctx.body = 'Match not found on database'
			}
			
		} catch(err) {
			if (err.message.includes('invalid input syntax')) {
				ctx.status = 400;
				ctx.body = 'Invalid match_id format';
			} else {
				ctx.status = 500;
				ctx.body = 'Failed to delete the match'
			}
		}
	};

	return {
		getMatchesList: getMatchesList,
		getMatchById: getMatchById,
		createMatch: createMatch,
		alterMatch: alterMatch,
		deleteMatch: deleteMatch
	};
};