<script>
	import { onDestroy, onMount } from 'svelte';
	import { RotateCcw, ShieldCheck, Wind } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';
	import { getElapsedMinutes } from '$lib/health-milestones.js';
	import {
		addBreathingCycles,
		addCravingResisted,
		clearStats,
		loadStats,
		recordMaxHold,
		resetBreathingStreak,
		recordAppVisit,
		saveStats
	} from '$lib/activity-stats.js';
	import { getUnlockedCount } from '$lib/activity-achievements.js';
	import { Button } from '$lib/components/ui/button';
	import Achievements from '$lib/components/achievements.svelte';
	import BreathingExercise from '$lib/components/breathing-exercise.svelte';
	import MilestoneTimeline from '$lib/components/milestone-timeline.svelte';
	import MotivationalBanner from '$lib/components/motivational-banner.svelte';
	import NextMilestoneCard from '$lib/components/next-milestone-card.svelte';
	import StatsCards from '$lib/components/stats-cards.svelte';
	import TimeCounter from '$lib/components/time-counter.svelte';

	let {
		quitDate,
		cigarettesPerDay,
		pricePerPack,
		cigarettesPerPack,
		onReset = () => {}
	} = $props();

	let elapsedMinutes = $state(0);
	let nowTs = $state(Date.now());
	let activeTab = $state('progress');
	let activityStats = $state(null);
	let cravingFeedback = $state(false);
	let cravingCooldownUntil = $state(0);
	let cravingSessionActive = $state(false);
	let cravingSessionSeed = $state(0);
	let elapsedInterval = null;
	let cravingTimeout = null;

	onMount(() => {
		let stats = loadStats();
		stats = recordAppVisit(stats);
		saveStats(stats);
		activityStats = stats;

		const updateElapsed = () => {
			elapsedMinutes = getElapsedMinutes(new Date(quitDate));
			nowTs = Date.now();
		};

		updateElapsed();
		elapsedInterval = setInterval(updateElapsed, 1000);
	});

	onDestroy(() => {
		clearInterval(elapsedInterval);
		clearTimeout(cravingTimeout);
	});

	const handleCycleComplete = () => {
		if (!activityStats) return;
		const updated = addBreathingCycles(activityStats, 1);
		saveStats(updated);
		activityStats = updated;
	};

	const handleBreathingStreakReset = () => {
		if (!activityStats) return;
		const updated = resetBreathingStreak(activityStats);
		if (updated !== activityStats) {
			saveStats(updated);
			activityStats = updated;
		}
	};

	const cooldownRemaining = $derived.by(() =>
		Math.max(0, Math.ceil((cravingCooldownUntil - nowTs) / 1000))
	);
	const isCravingCooldown = $derived.by(() => cooldownRemaining > 0);

	const startCravingSession = () => {
		if (isCravingCooldown || cravingSessionActive) return;
		cravingSessionActive = true;
		cravingSessionSeed += 1;
		activeTab = 'breathe';
	};

	const handleCravingSessionComplete = () => {
		if (!activityStats) return;
		const updated = addCravingResisted(activityStats);
		saveStats(updated);
		activityStats = updated;

		cravingFeedback = true;
		clearTimeout(cravingTimeout);
		cravingTimeout = setTimeout(() => {
			cravingFeedback = false;
		}, 2000);

		cravingCooldownUntil = Date.now() + 60000;
		cravingSessionActive = false;
	};

	const handleHoldDurationUpdate = (seconds) => {
		if (!activityStats) return;
		const updated = recordMaxHold(activityStats, seconds);
		if (updated !== activityStats) {
			saveStats(updated);
			activityStats = updated;
		}
	};

	const handleReset = () => {
		const snapshotStats = activityStats;
		clearStats();
		onReset(snapshotStats);
	};

	const unlockedCount = $derived.by(() =>
		activityStats ? getUnlockedCount(activityStats, elapsedMinutes) : 0
	);
</script>

<div class="min-h-screen bg-background">
	<header class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
		<div class="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
			<div class="flex items-center gap-2">
				<Wind class="h-5 w-5 text-primary" />
				<span class="font-serif text-base font-semibold text-foreground">Quit</span>
			</div>
			<Button
				variant="ghost"
				size="sm"
				onclick={handleReset}
				class="text-xs text-muted-foreground hover:text-foreground"
			>
				<RotateCcw class="mr-1.5 h-3.5 w-3.5" />
				Reset
			</Button>
		</div>
	</header>

	<nav class="sticky top-14.25 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
		<div class="mx-auto flex max-w-lg">
			{#each ['progress', 'breathe', 'milestones', 'achievements'] as tab}
				<button
					onclick={() => (activeTab = tab)}
					class={cn(
						'relative flex-1 py-3 text-sm font-medium capitalize transition-colors',
						activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
					)}
				>
					{#if tab === 'achievements'}
						<span class="flex items-center justify-center gap-1">
							<span class="xs:inline hidden">Badges</span>
							<span class="xs:hidden">Badges</span>
							{#if unlockedCount > 0}
								<span
									class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] leading-none font-bold text-primary-foreground"
								>
									{unlockedCount}
								</span>
							{/if}
						</span>
					{:else}
						{tab}
					{/if}
					{#if activeTab === tab}
						<span class="absolute right-1/4 bottom-0 left-1/4 h-0.5 rounded-full bg-primary"></span>
					{/if}
				</button>
			{/each}
		</div>
	</nav>

	<main class="mx-auto max-w-lg px-4 py-6">
		{#if activeTab === 'progress'}
			<div class="animate-in space-y-6 duration-300 fade-in">
				<section class="space-y-2 text-center">
					<p class="text-xs tracking-widest text-muted-foreground uppercase">Smoke-free for</p>
					<TimeCounter {elapsedMinutes} />
				</section>

				<StatsCards {elapsedMinutes} {cigarettesPerDay} {pricePerPack} {cigarettesPerPack} />

				<NextMilestoneCard {elapsedMinutes} />

				<div class="text-center">
					<Button
						onclick={startCravingSession}
						variant="outline"
						class={cn(
							'border-primary/30 text-primary transition-all duration-300 hover:bg-primary/10',
							cravingFeedback && 'scale-105 bg-primary text-primary-foreground hover:bg-primary/90'
						)}
						disabled={isCravingCooldown || cravingSessionActive}
					>
						<ShieldCheck class="mr-2 h-4 w-4" />
						{cravingFeedback
							? "You're amazing!"
							: isCravingCooldown
								? `Wait ${cooldownRemaining}s`
								: cravingSessionActive
									? 'Breathing...'
									: 'Resist craving'}
					</Button>
					{#if activityStats && activityStats.cravingsResisted > 0 && !cravingFeedback}
						<p class="mt-2 text-xs text-muted-foreground">
							{activityStats.cravingsResisted} craving{activityStats.cravingsResisted === 1
								? ''
								: 's'}
							resisted so far
						</p>
					{/if}
				</div>

				<MotivationalBanner />
			</div>
		{/if}

		{#if activeTab === 'breathe'}
			<div class="animate-in duration-300 fade-in">
				{#key cravingSessionSeed}
					<BreathingExercise
						onCycleComplete={handleCycleComplete}
						onStreakReset={handleBreathingStreakReset}
						onSessionComplete={handleCravingSessionComplete}
						onHoldDurationUpdate={handleHoldDurationUpdate}
						{elapsedMinutes}
						sessionCycles={cravingSessionActive ? 3 : null}
						autoStart={cravingSessionActive}
					/>
				{/key}
			</div>
		{/if}

		{#if activeTab === 'milestones'}
			<div class="animate-in duration-300 fade-in">
				<div class="space-y-4">
					<div class="space-y-1">
						<h2 class="font-serif text-lg font-semibold text-foreground">Health Milestones</h2>
						<p class="text-sm text-muted-foreground">Watch your body heal over time.</p>
					</div>
					<MilestoneTimeline {elapsedMinutes} />
				</div>
			</div>
		{/if}

		{#if activeTab === 'achievements' && activityStats}
			<div class="animate-in duration-300 fade-in">
				<Achievements stats={activityStats} {elapsedMinutes} />
			</div>
		{/if}
	</main>

	<footer class="mx-auto max-w-lg px-4 py-8 text-center">
		<p class="text-xs text-muted-foreground">
			All data is stored locally, there are no servers. You are in control.
		</p>
	</footer>
</div>
