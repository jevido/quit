<script>
	import { formatTimeParts } from '$lib/health-milestones.js';

	let { elapsedMinutes = 0 } = $props();

	const timeParts = $derived.by(() => formatTimeParts(elapsedMinutes));
	const years = $derived.by(() => timeParts.years);
	const months = $derived.by(() => timeParts.months);
	const days = $derived.by(() => timeParts.days);
	const hours = $derived.by(() => timeParts.hours);
	const minutes = $derived.by(() => timeParts.minutes);
	const seconds = $derived.by(() => timeParts.seconds);

	const pad = (value) => String(value).padStart(2, '0');
</script>

<div class="flex items-start justify-center gap-2 md:gap-3">
	{#if years > 0}
		<div class="flex flex-col items-center">
			<span class="font-serif text-3xl font-bold text-foreground tabular-nums md:text-5xl">
				{pad(years)}
			</span>
			<span class="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase md:text-xs">
				years
			</span>
		</div>
		<span class="mt-1 self-start text-2xl font-light text-primary/40 md:text-4xl">:</span>
	{/if}
	{#if years > 0 || months > 0}
		<div class="flex flex-col items-center">
			<span class="font-serif text-3xl font-bold text-foreground tabular-nums md:text-5xl">
				{pad(months)}
			</span>
			<span class="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase md:text-xs">
				months
			</span>
		</div>
		<span class="mt-1 self-start text-2xl font-light text-primary/40 md:text-4xl">:</span>
	{/if}
	<div class="flex flex-col items-center">
		<span class="font-serif text-3xl font-bold text-foreground tabular-nums md:text-5xl">
			{pad(days)}
		</span>
		<span class="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase md:text-xs"
			>days</span
		>
	</div>
	<span class="mt-1 self-start text-2xl font-light text-primary/40 md:text-4xl">:</span>
	<div class="flex flex-col items-center">
		<span class="font-serif text-3xl font-bold text-foreground tabular-nums md:text-5xl">
			{pad(hours)}
		</span>
		<span class="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase md:text-xs"
			>hours</span
		>
	</div>
	<span class="mt-1 self-start text-2xl font-light text-primary/40 md:text-4xl">:</span>
	<div class="flex flex-col items-center">
		<span class="font-serif text-3xl font-bold text-foreground tabular-nums md:text-5xl">
			{pad(minutes)}
		</span>
		<span class="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase md:text-xs"
			>min</span
		>
	</div>
	<span class="mt-1 self-start text-2xl font-light text-primary/40 md:text-4xl">:</span>
	<div class="flex flex-col items-center">
		<span class="font-serif text-3xl font-bold text-foreground tabular-nums md:text-5xl">
			{pad(seconds)}
		</span>
		<span class="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase md:text-xs"
			>sec</span
		>
	</div>
</div>
