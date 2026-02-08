<script>
	import {
		Check,
		Crown,
		Heart,
		Leaf,
		Lock,
		Shield,
		Sparkles,
		Star,
		Trophy,
		Wind
	} from '@lucide/svelte';
	import { ACTIVITY_ACHIEVEMENTS, getAchievementProgress } from '$lib/activity-achievements.js';
	import { cn } from '$lib/utils.js';

	let { stats, elapsedMinutes = 0 } = $props();

	const ICON_MAP = {
		wind: Wind,
		shield: Shield,
		sparkles: Sparkles,
		trophy: Trophy,
		star: Star,
		leaf: Leaf,
		crown: Crown,
		heart: Heart
	};

	const CATEGORY_LABELS = {
		all: 'All',
		breathing: 'Breathing',
		cravings: 'Cravings',
		visits: 'Check-ins',
		streak: 'Streaks'
	};

	let filter = $state('all');

	const formatTimeValue = (minutes) => {
		if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d`;
		if (minutes >= 60) return `${Math.floor(minutes / 60)}h`;
		return `${Math.floor(minutes)}m`;
	};

	const filtered = $derived.by(() =>
		filter === 'all'
			? ACTIVITY_ACHIEVEMENTS
			: ACTIVITY_ACHIEVEMENTS.filter((achievement) => achievement.category === filter)
	);

	const totalUnlocked = $derived.by(
		() =>
			ACTIVITY_ACHIEVEMENTS.filter(
				(achievement) => achievement.getValue(stats, elapsedMinutes) >= achievement.threshold
			).length
	);
</script>

<div class="space-y-5">
	<div class="space-y-1">
		<div class="flex items-center justify-between">
			<h2 class="font-serif text-lg font-semibold text-foreground">Achievements</h2>
			<span class="text-xs text-muted-foreground">
				{totalUnlocked} / {ACTIVITY_ACHIEVEMENTS.length} unlocked
			</span>
		</div>
		<p class="text-sm text-muted-foreground">Earn badges through your actions and your time.</p>
	</div>

	<div class="grid grid-cols-2 gap-2.5">
		<div class="rounded-lg border border-border bg-card p-3 text-center">
			<div class="font-serif text-lg font-bold text-foreground">{stats.breathingCycles}</div>
			<div class="text-[10px] tracking-wide text-muted-foreground uppercase">Breathing Cycles</div>
		</div>
		<div class="rounded-lg border border-border bg-card p-3 text-center">
			<div class="font-serif text-lg font-bold text-foreground">{stats.cravingsResisted}</div>
			<div class="text-[10px] tracking-wide text-muted-foreground uppercase">Cravings Resisted</div>
		</div>
		<div class="rounded-lg border border-border bg-card p-3 text-center">
			<div class="font-serif text-lg font-bold text-foreground">{stats.appVisits}</div>
			<div class="text-[10px] tracking-wide text-muted-foreground uppercase">Days Checked In</div>
		</div>
		<div class="rounded-lg border border-border bg-card p-3 text-center">
			<div class="font-serif text-lg font-bold text-foreground">{stats.dailyStreak}</div>
			<div class="text-[10px] tracking-wide text-muted-foreground uppercase">Current Streak</div>
		</div>
		<div class="rounded-lg border border-border bg-card p-3 text-center">
			<div class="font-serif text-lg font-bold text-foreground">
				{Math.floor(elapsedMinutes / 1440)}
			</div>
			<div class="text-[10px] tracking-wide text-muted-foreground uppercase">Days Smoke-Free</div>
		</div>
		<div class="rounded-lg border border-border bg-card p-3 text-center">
			<div class="font-serif text-lg font-bold text-foreground">{stats.longestBreathingStreak}</div>
			<div class="text-[10px] tracking-wide text-muted-foreground uppercase">
				Longest Breath Streak
			</div>
		</div>
	</div>

	<div class="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
		{#each Object.entries(CATEGORY_LABELS) as [key, label]}
			<button
				onclick={() => (filter = key)}
				class={cn(
					'rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
					filter === key
						? 'bg-primary text-primary-foreground'
						: 'bg-muted text-muted-foreground hover:text-foreground'
				)}
			>
				{label}
			</button>
		{/each}
	</div>

	<div class="space-y-3">
		{#each filtered as achievement (achievement.id)}
			{@const progress = getAchievementProgress(achievement, stats, elapsedMinutes)}
			{@const isComplete = progress >= 1}
			{@const currentValue = achievement.getValue(stats, elapsedMinutes)}
			{@const isTimeAchievement = achievement.id.startsWith('time-')}
			{@const displayValue = isTimeAchievement ? formatTimeValue(currentValue) : currentValue}
			{@const displayThreshold = isTimeAchievement
				? formatTimeValue(achievement.threshold)
				: achievement.threshold}
			{@const IconComponent = ICON_MAP[achievement.icon] || Star}
			{@const progressPercent = Math.min(100, Math.round(progress * 100))}
			<div
				class={cn(
					'rounded-xl border p-4 transition-all duration-300',
					isComplete ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
				)}
			>
				<div class="flex gap-3">
					<div
						class={cn(
							'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all',
							isComplete
								? 'border-primary bg-primary text-primary-foreground'
								: progress > 0
									? 'border-primary/40 bg-primary/10 text-primary'
									: 'border-border bg-muted text-muted-foreground'
						)}
					>
						{#if isComplete}
							<Check class="h-5 w-5" />
						{:else if progress > 0}
							<IconComponent class="h-4 w-4" />
						{:else}
							<Lock class="h-3.5 w-3.5" />
						{/if}
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<h3
								class={cn(
									'truncate text-sm font-semibold',
									isComplete ? 'text-primary' : 'text-foreground'
								)}
							>
								{achievement.title}
							</h3>
						</div>
						<p
							class={cn(
								'mt-0.5 text-xs leading-relaxed',
								isComplete ? 'text-muted-foreground' : 'text-muted-foreground/80'
							)}
						>
							{achievement.description}
						</p>

						{#if !isComplete}
							<div class="mt-2.5 space-y-1">
								<div class="flex items-center justify-between text-[11px]">
									<span class="font-medium text-primary">
										{displayValue} / {displayThreshold}
									</span>
									<span class="text-muted-foreground">{progressPercent}%</span>
								</div>
								<div class="h-1.5 overflow-hidden rounded-full bg-muted">
									<div
										class="h-full rounded-full bg-primary transition-all duration-500 ease-out"
										style={`width: ${progressPercent}%`}
									></div>
								</div>
							</div>
						{:else}
							<div class="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary">
								<Check class="h-3 w-3" />
								Unlocked!
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
