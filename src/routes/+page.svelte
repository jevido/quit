<script>
	import { onMount } from 'svelte';
	import Dashboard from '$lib/components/dashboard.svelte';
	import SetupScreen from '$lib/components/setup-screen.svelte';

	const STORAGE_KEY = 'quit-data';
	const STATS_KEY = 'quit-activity-stats';
	const UNDO_KEY = 'quit-last-data';
	const UNDO_STATS_KEY = 'quit-last-stats';

	let userData = null;
	let undoData = null;
	let undoStats = null;
	let loaded = false;

	const loadData = () => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return null;
			return JSON.parse(raw);
		} catch {
			return null;
		}
	};

	const saveData = (data) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	};

	const clearData = () => {
		localStorage.removeItem(STORAGE_KEY);
	};

	const loadUndo = () => {
		try {
			const raw = localStorage.getItem(UNDO_KEY);
			if (!raw) return null;
			return JSON.parse(raw);
		} catch {
			return null;
		}
	};

	const loadUndoStats = () => {
		try {
			const raw = localStorage.getItem(UNDO_STATS_KEY);
			if (!raw) return null;
			return JSON.parse(raw);
		} catch {
			return null;
		}
	};

	const saveUndo = (data, stats) => {
		localStorage.setItem(UNDO_KEY, JSON.stringify(data));
		if (stats) {
			localStorage.setItem(UNDO_STATS_KEY, JSON.stringify(stats));
		} else {
			localStorage.removeItem(UNDO_STATS_KEY);
		}
	};

	const clearUndo = () => {
		localStorage.removeItem(UNDO_KEY);
		localStorage.removeItem(UNDO_STATS_KEY);
	};

	onMount(() => {
		userData = loadData();
		undoData = loadUndo();
		undoStats = loadUndoStats();
		loaded = true;
	});

	const handleSetup = (data) => {
		saveData(data);
		userData = data;
		clearUndo();
		undoData = null;
		undoStats = null;
	};

	const handleReset = (statsSnapshot) => {
		if (userData) {
			saveUndo(userData, statsSnapshot);
			undoData = userData;
			undoStats = statsSnapshot ?? null;
		}
		clearData();
		userData = null;
	};

	const handleUndoReset = () => {
		if (!undoData) return;
		saveData(undoData);
		userData = undoData;
		if (undoStats) {
			localStorage.setItem(STATS_KEY, JSON.stringify(undoStats));
		}
		clearUndo();
		undoData = null;
		undoStats = null;
	};
</script>

{#if !loaded}
	<div class="flex min-h-screen items-center justify-center bg-background">
		<div
			class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
		></div>
	</div>
{:else if !userData}
	<SetupScreen onComplete={handleSetup} onUndo={handleUndoReset} canUndo={!!undoData} />
{:else}
	<Dashboard
		quitDate={userData.quitDate}
		cigarettesPerDay={userData.cigarettesPerDay}
		pricePerPack={userData.pricePerPack}
		cigarettesPerPack={userData.cigarettesPerPack}
		onReset={handleReset}
	/>
{/if}
