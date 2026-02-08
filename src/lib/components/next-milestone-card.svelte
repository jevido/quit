<script>
	import { Target } from '@lucide/svelte';
	import {
		formatDuration,
		getMilestoneProgress,
		getNextMilestone
	} from '$lib/health-milestones.js';

	let { elapsedMinutes = 0 } = $props();

	const next = $derived.by(() => getNextMilestone(elapsedMinutes));
	const progress = $derived.by(() => (next ? getMilestoneProgress(next, elapsedMinutes) : 0));
	const remaining = $derived.by(() => (next ? next.timeMinutes - elapsedMinutes : 0));
	const progressPercent = $derived.by(() => Math.min(100, Math.round(progress * 100)));
</script>

{#if !next}
	<div class="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
		<div class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
			<Target class="h-5 w-5 text-primary" />
		</div>
		<h3 class="font-serif text-lg font-semibold text-foreground">All Milestones Achieved!</h3>
		<p class="text-sm leading-relaxed text-muted-foreground">
			You've reached every health milestone. Your body has remarkably healed. You're an inspiration!
		</p>
	</div>
{:else}
	<div class="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-5">
		<div class="flex items-start justify-between gap-4">
			<div class="space-y-1">
				<p class="text-[10px] font-medium tracking-widest text-primary uppercase">Next milestone</p>
				<h3 class="font-serif text-lg font-semibold text-foreground">{next.title}</h3>
			</div>
			<span
				class="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
			>
				in {formatDuration(remaining)}
			</span>
		</div>
		<p class="text-sm leading-relaxed text-muted-foreground">{next.description}</p>
		<div class="space-y-1.5">
			<div class="h-2.5 overflow-hidden rounded-full bg-muted">
				<div
					class="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
					style={`width: ${progressPercent}%`}
				></div>
			</div>
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<span>{progressPercent}%</span>
				<span>{formatDuration(remaining)} remaining</span>
			</div>
		</div>
	</div>
{/if}
