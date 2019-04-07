const moment = require('moment');
const { stripIndents } = require('common-tags');

module.exports = {
	name: 'add',
	aliases: ['quickadd', 'add-event'],
	description: 'Ping!',
	guildOnly: true,
	args: true,
	usage: '[description new event]',
	execute(message) {
		// Slice off the prefix from the message
		const messageContentArray = message.content.split(" ");

		message.channel.send(messageContentArray[0]);
		const newQuickEvent = message.content.substr(messageContentArray[0].length + 1);
		message.channel.send(newQuickEvent);

		message.client.calendar.events.quickAdd({
			auth: message.client.jwtClient,
			calendarId: message.client.sql.getGoogleCalendarId(message.guild),
			text: newQuickEvent,
		}, function(err, response) {
			message.channel.send(stripIndents` \`\`\`Event: ${response.data.summary} 
				Start: ${moment(response.data.start.dateTime).format('dddd DD/MM/YY HH:mm Z')} 
				End  : ${moment(response.data.end.dateTime).format('dddd DD/MM/YY HH:mm Z')}\`\`\``);
		});
	},
};