import { DEFAULT_STATS } from './activity-stats';

export const ACTIVITY_ACHIEVEMENTS = [
	{
		id: 'breath-1',
		title: 'First Breath',
		description:
			'Complete your first breathing cycle. The journey of a thousand breaths begins with one.',
		icon: 'wind',
		category: 'breathing',
		threshold: 1,
		getValue: (stats) => stats.breathingCycles
	},
	{
		id: 'breath-5',
		title: 'Finding Calm',
		description:
			"Complete 5 breathing cycles. You're learning to breathe through the tough moments.",
		icon: 'wind',
		category: 'breathing',
		threshold: 5,
		getValue: (stats) => stats.breathingCycles
	},
	{
		id: 'breath-10',
		title: 'Deep Breather',
		description:
			'Complete 10 breathing cycles. Your lungs are stronger with every breath you take.',
		icon: 'wind',
		category: 'breathing',
		threshold: 10,
		getValue: (stats) => stats.breathingCycles
	},
	{
		id: 'breath-25',
		title: 'Zen Apprentice',
		description: "Complete 25 breathing cycles. You've made breathing exercises a real habit.",
		icon: 'wind',
		category: 'breathing',
		threshold: 25,
		getValue: (stats) => stats.breathingCycles
	},
	{
		id: 'breath-50',
		title: 'Breath Master',
		description: 'Complete 50 breathing cycles. Mindful breathing is now second nature to you.',
		icon: 'wind',
		category: 'breathing',
		threshold: 50,
		getValue: (stats) => stats.breathingCycles
	},
	{
		id: 'breath-100',
		title: 'Lungs of Steel',
		description:
			"Complete 100 breathing cycles. You've mastered the art of breathing through cravings.",
		icon: 'wind',
		category: 'breathing',
		threshold: 100,
		getValue: (stats) => stats.breathingCycles
	},
	{
		id: 'breath-250',
		title: 'Air Bender',
		description:
			'Complete 250 breathing cycles. Your dedication to mindful breathing is extraordinary.',
		icon: 'wind',
		category: 'breathing',
		threshold: 250,
		getValue: (stats) => stats.breathingCycles
	},
	{
		id: 'craving-1',
		title: 'First Victory',
		description: "Resist your first craving. You just proved you're stronger than nicotine.",
		icon: 'shield',
		category: 'cravings',
		threshold: 1,
		getValue: (stats) => stats.cravingsResisted
	},
	{
		id: 'craving-5',
		title: 'Craving Crusher',
		description: 'Resist 5 cravings. Each one you overcome makes the next one easier.',
		icon: 'shield',
		category: 'cravings',
		threshold: 5,
		getValue: (stats) => stats.cravingsResisted
	},
	{
		id: 'craving-10',
		title: 'Willpower Rising',
		description: 'Resist 10 cravings. Your willpower is getting stronger with each one.',
		icon: 'shield',
		category: 'cravings',
		threshold: 10,
		getValue: (stats) => stats.cravingsResisted
	},
	{
		id: 'craving-25',
		title: 'Iron Will',
		description: "Resist 25 cravings. You've proven time and again that you're in control.",
		icon: 'shield',
		category: 'cravings',
		threshold: 25,
		getValue: (stats) => stats.cravingsResisted
	},
	{
		id: 'craving-50',
		title: 'Unbreakable',
		description: 'Resist 50 cravings. Nicotine has nothing on you anymore.',
		icon: 'shield',
		category: 'cravings',
		threshold: 50,
		getValue: (stats) => stats.cravingsResisted
	},
	{
		id: 'craving-100',
		title: 'Craving Conqueror',
		description: 'Resist 100 cravings. You are a true champion of self-control.',
		icon: 'shield',
		category: 'cravings',
		threshold: 100,
		getValue: (stats) => stats.cravingsResisted
	},
	{
		id: 'visit-1',
		title: 'Checking In',
		description: 'Open the app for the first time. Showing up is the hardest part.',
		icon: 'sparkles',
		category: 'visits',
		threshold: 1,
		getValue: (stats) => stats.appVisits
	},
	{
		id: 'visit-7',
		title: 'One Week Strong',
		description: 'Check in 7 different days. A full week of commitment!',
		icon: 'sparkles',
		category: 'visits',
		threshold: 7,
		getValue: (stats) => stats.appVisits
	},
	{
		id: 'visit-14',
		title: 'Fortnight Focus',
		description: 'Check in 14 different days. Two weeks of showing up for yourself.',
		icon: 'sparkles',
		category: 'visits',
		threshold: 14,
		getValue: (stats) => stats.appVisits
	},
	{
		id: 'visit-30',
		title: 'Monthly Devotion',
		description: "Check in 30 different days. You've made this a real part of your life.",
		icon: 'sparkles',
		category: 'visits',
		threshold: 30,
		getValue: (stats) => stats.appVisits
	},
	{
		id: 'visit-100',
		title: 'Centurion',
		description: 'Check in 100 different days. Your consistency is truly inspiring.',
		icon: 'sparkles',
		category: 'visits',
		threshold: 100,
		getValue: (stats) => stats.appVisits
	},
	{
		id: 'streak-3',
		title: 'Streak Starter',
		description: 'Maintain a 3-day streak. Three days in a row shows real commitment.',
		icon: 'trophy',
		category: 'streak',
		threshold: 3,
		getValue: (stats) => stats.longestStreak
	},
	{
		id: 'streak-7',
		title: 'Week Warrior',
		description: 'Maintain a 7-day streak. A full week without missing a day!',
		icon: 'trophy',
		category: 'streak',
		threshold: 7,
		getValue: (stats) => stats.longestStreak
	},
	{
		id: 'streak-14',
		title: 'Fortnight Fire',
		description: 'Maintain a 14-day streak. Two weeks of unbroken dedication.',
		icon: 'trophy',
		category: 'streak',
		threshold: 14,
		getValue: (stats) => stats.longestStreak
	},
	{
		id: 'streak-30',
		title: 'Monthly Flame',
		description: "Maintain a 30-day streak. A month of daily check-ins. You're unstoppable!",
		icon: 'trophy',
		category: 'streak',
		threshold: 30,
		getValue: (stats) => stats.longestStreak
	},
	{
		id: 'streak-60',
		title: 'Eternal Flame',
		description: 'Maintain a 60-day streak. Two months without missing a single day. Legendary.',
		icon: 'trophy',
		category: 'streak',
		threshold: 60,
		getValue: (stats) => stats.longestStreak
	}
];

export function getAchievementProgress(achievement, stats) {
	return Math.min(1, achievement.getValue(stats) / achievement.threshold);
}

export function getUnlockedCount(stats = DEFAULT_STATS) {
	return ACTIVITY_ACHIEVEMENTS.filter(
		(achievement) => achievement.getValue(stats) >= achievement.threshold
	).length;
}
