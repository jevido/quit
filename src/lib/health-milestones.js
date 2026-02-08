export const HEALTH_MILESTONES = [
	{
		id: '20min',
		timeMinutes: 20,
		title: 'Heart Rate Normalizes',
		description:
			'Your heart rate and blood pressure begin to drop back to normal levels. Your hands and feet warm to their natural temperature.',
		icon: 'heart',
		category: 'heart'
	},
	{
		id: '8hr',
		timeMinutes: 480,
		title: 'Oxygen Levels Restore',
		description:
			'Carbon monoxide levels in your blood drop by half. Oxygen levels return to normal, and your body starts to heal.',
		icon: 'wind',
		category: 'blood'
	},
	{
		id: '24hr',
		timeMinutes: 1440,
		title: 'Heart Attack Risk Drops',
		description:
			'Your risk of having a heart attack has already started to decrease. Carbon monoxide is fully eliminated from your body.',
		icon: 'shield',
		category: 'heart'
	},
	{
		id: '48hr',
		timeMinutes: 2880,
		title: 'Taste & Smell Return',
		description:
			'Nerve endings begin to regrow. Your senses of taste and smell start to improve noticeably. Food tastes better!',
		icon: 'sparkles',
		category: 'nerves'
	},
	{
		id: '72hr',
		timeMinutes: 4320,
		title: 'Bronchial Tubes Relax',
		description:
			'Your bronchial tubes relax, making breathing easier. Lung capacity begins to increase and you feel more energetic.',
		icon: 'lungs',
		category: 'lungs'
	},
	{
		id: '2wk',
		timeMinutes: 20160,
		title: 'Circulation Improves',
		description:
			'Your circulation significantly improves and your lung function increases by up to 30%. Walking and exercise become easier.',
		icon: 'activity',
		category: 'heart'
	},
	{
		id: '1mo',
		timeMinutes: 43200,
		title: 'Cilia Regrow in Lungs',
		description:
			'Tiny hair-like structures (cilia) in your lungs start to regrow. They help clean the lungs and reduce infection risk.',
		icon: 'leaf',
		category: 'lungs'
	},
	{
		id: '3mo',
		timeMinutes: 129600,
		title: 'Lung Function Up 30%',
		description:
			'Your lung function has significantly improved. Coughing, sinus congestion, fatigue, and shortness of breath decrease.',
		icon: 'trending-up',
		category: 'lungs'
	},
	{
		id: '6mo',
		timeMinutes: 259200,
		title: 'Stress Response Normalizes',
		description:
			'You handle stress much better without nicotine. Energy levels are higher and you experience fewer cravings.',
		icon: 'brain',
		category: 'general'
	},
	{
		id: '1yr',
		timeMinutes: 525600,
		title: 'Heart Disease Risk Halved',
		description:
			'Your excess risk of coronary heart disease is now half that of a smoker. This is a monumental health achievement!',
		icon: 'trophy',
		category: 'heart'
	},
	{
		id: '5yr',
		timeMinutes: 2628000,
		title: 'Stroke Risk Normalized',
		description:
			'Your risk of stroke has decreased to that of a non-smoker. Blood vessels are widening and less likely to clot.',
		icon: 'star',
		category: 'blood'
	},
	{
		id: '10yr',
		timeMinutes: 5256000,
		title: 'Lung Cancer Risk Halved',
		description:
			"Your risk of dying from lung cancer is about half of a continuing smoker's. Risk of other cancers also decreases.",
		icon: 'shield-check',
		category: 'cancer'
	},
	{
		id: '15yr',
		timeMinutes: 7884000,
		title: 'Heart Risk = Non-Smoker',
		description:
			'Your risk of coronary heart disease is the same as a person who has never smoked. Your body has remarkably healed!',
		icon: 'crown',
		category: 'heart'
	}
];

export function getElapsedMinutes(quitDate) {
	return Math.max(0, (Date.now() - quitDate.getTime()) / 60000);
}

export function getMilestoneProgress(milestone, elapsedMinutes) {
	return Math.min(1, elapsedMinutes / milestone.timeMinutes);
}

export function getNextMilestone(elapsedMinutes) {
	return HEALTH_MILESTONES.find((milestone) => milestone.timeMinutes > elapsedMinutes) ?? null;
}

export function getCompletedMilestones(elapsedMinutes) {
	return HEALTH_MILESTONES.filter((milestone) => milestone.timeMinutes <= elapsedMinutes);
}

export function formatDuration(minutes) {
	const years = Math.floor(minutes / 525600);
	const months = Math.floor((minutes % 525600) / 43200);
	const days = Math.floor((minutes % 43200) / 1440);
	const hours = Math.floor((minutes % 1440) / 60);
	const mins = Math.floor(minutes % 60);
	const secs = Math.floor((minutes % 1) * 60);

	const parts = [];
	if (years > 0) parts.push(`${years}y`);
	if (months > 0) parts.push(`${months}mo`);
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (mins > 0) parts.push(`${mins}m`);
	if (parts.length === 0) parts.push(`${secs}s`);

	return parts.join(' ');
}

export function formatTimeParts(totalMinutes) {
	const totalSeconds = Math.floor(totalMinutes * 60);
	const years = Math.floor(totalSeconds / (365.25 * 24 * 3600));
	const months = Math.floor((totalSeconds % (365.25 * 24 * 3600)) / (30.44 * 24 * 3600));
	const days = Math.floor((totalSeconds % (30.44 * 24 * 3600)) / (24 * 3600));
	const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { years, months, days, hours, minutes, seconds };
}
