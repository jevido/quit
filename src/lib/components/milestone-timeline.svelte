<script>
	import {
		Activity,
		Brain,
		Check,
		Crown,
		Heart,
		Leaf,
		Shield,
		ShieldCheck,
		Sparkles,
		Star,
		TrendingUp,
		Trophy,
		Wind
	} from '@lucide/svelte';
	import { cn } from '$lib/utils.js';
	import {
		formatDuration,
		getMilestoneProgress,
		HEALTH_MILESTONES
	} from '$lib/health-milestones.js';

	let { elapsedMinutes = 0 } = $props();

	const ICON_MAP = {
		heart: Heart,
		wind: Wind,
		shield: Shield,
		sparkles: Sparkles,
		lungs: Wind,
		activity: Activity,
		leaf: Leaf,
		'trending-up': TrendingUp,
		brain: Brain,
		trophy: Trophy,
		star: Star,
		'shield-check': ShieldCheck,
		crown: Crown
	};
</script>

<div class="space-y-0">
	{#each HEALTH_MILESTONES as milestone (milestone.id)}
		{@const progress = getMilestoneProgress(milestone, elapsedMinutes)}
		{@const isComplete = progress >= 1}
		{@const isActive = progress > 0 && progress < 1}
		{@const IconComponent = ICON_MAP[milestone.icon] || Heart}
		{@const progressPercent = Math.min(100, Math.round(progress * 100))}
		<div class={cn('relative flex gap-4 pb-8 last:pb-0')}>
			<div class="flex flex-col items-center">
				<div
					class={cn(
						'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500',
						isComplete
							? 'border-primary bg-primary text-primary-foreground'
							: isActive
								? 'border-primary bg-primary/10 text-primary'
								: 'border-border bg-muted text-muted-foreground'
					)}
				>
					{#if isComplete}
						<Check class="h-5 w-5" />
					{:else}
						<IconComponent class="h-4 w-4" />
					{/if}
				</div>
				<div class="mt-2 w-0.5 flex-1 bg-border"></div>
			</div>

			<div class={cn('-mt-0.5 flex-1 pb-2', !isComplete && !isActive && 'opacity-50')}>
				<div class="flex flex-wrap items-center gap-2">
					<h3 class={cn('text-sm font-semibold', isComplete ? 'text-primary' : 'text-foreground')}>
						{milestone.title}
					</h3>
					<span
						class="rounded-full bg-muted px-2 py-0.5 text-[10px] tracking-wider text-muted-foreground uppercase"
					>
						{formatDuration(milestone.timeMinutes)}
					</span>
				</div>
				<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
					{milestone.description}
				</p>

				{#if isActive}
					<div class="mt-3 space-y-1">
						<div class="flex items-center justify-between text-xs">
							<span class="font-medium text-primary">{progressPercent}% complete</span>
							<span class="text-muted-foreground">
								{formatDuration(milestone.timeMinutes - elapsedMinutes)} left
							</span>
						</div>
						<div class="h-2 overflow-hidden rounded-full bg-muted">
							<div
								class="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
								style={`width: ${progressPercent}%`}
							></div>
						</div>
					</div>
				{/if}

				{#if isComplete}
					<div class="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
						<Check class="h-3 w-3" />
						Achieved!
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
