const STATS_KEY = 'quit-activity-stats';

export const DEFAULT_STATS = {
	breathingCycles: 0,
	cravingsResisted: 0,
	appVisits: 0,
	dailyStreak: 0,
	lastVisitDate: null,
	longestStreak: 0
};

function getTodayDate() {
	return new Date().toISOString().split('T')[0];
}

function getYesterdayDate() {
	const date = new Date();
	date.setDate(date.getDate() - 1);
	return date.toISOString().split('T')[0];
}

export function loadStats() {
	if (typeof window === 'undefined') return { ...DEFAULT_STATS };
	try {
		const raw = localStorage.getItem(STATS_KEY);
		if (!raw) return { ...DEFAULT_STATS };
		return { ...DEFAULT_STATS, ...JSON.parse(raw) };
	} catch {
		return { ...DEFAULT_STATS };
	}
}

export function saveStats(stats) {
	localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordAppVisit(stats) {
	const today = getTodayDate();
	const yesterday = getYesterdayDate();

	if (stats.lastVisitDate === today) {
		return stats;
	}

	const newStats = { ...stats };
	newStats.appVisits += 1;

	if (stats.lastVisitDate === yesterday) {
		newStats.dailyStreak += 1;
	} else if (stats.lastVisitDate !== today) {
		newStats.dailyStreak = 1;
	}

	newStats.longestStreak = Math.max(newStats.longestStreak, newStats.dailyStreak);
	newStats.lastVisitDate = today;

	return newStats;
}

export function addBreathingCycles(stats, count) {
	return { ...stats, breathingCycles: stats.breathingCycles + count };
}

export function addCravingResisted(stats) {
	return { ...stats, cravingsResisted: stats.cravingsResisted + 1 };
}

export function clearStats() {
	localStorage.removeItem(STATS_KEY);
}
