<script>
	import { Cigarette, Clock, Euro } from '@lucide/svelte';

	let {
		elapsedMinutes = 0,
		cigarettesPerDay = 0,
		pricePerPack = 0,
		cigarettesPerPack = 1
	} = $props();

	const elapsedDays = $derived.by(() => elapsedMinutes / 1440);
	const cigarettesAvoided = $derived.by(() => Math.floor(elapsedDays * cigarettesPerDay));
	const moneySaved = $derived.by(() => (cigarettesAvoided / cigarettesPerPack) * pricePerPack);
	const lifeRegained = $derived.by(() => cigarettesAvoided * 11);
	const lifeHours = $derived.by(() => Math.floor(lifeRegained / 60));
	const lifeDays = $derived.by(() => Math.floor(lifeHours / 24));
	const lifeString = $derived.by(() =>
		lifeDays > 0
			? `${lifeDays}d ${lifeHours % 24}h`
			: lifeHours > 0
				? `${lifeHours}h ${lifeRegained % 60}m`
				: `${lifeRegained}m`
	);
</script>

<div class="grid grid-cols-3 gap-3">
	<div class="space-y-1 rounded-xl border border-border bg-card p-4 text-center">
		<div class="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
			<Euro class="h-4 w-4 text-primary" />
		</div>
		<div class="font-serif text-xl font-bold text-foreground md:text-2xl">
			€{moneySaved.toFixed(2)}
		</div>
		<div class="text-[10px] tracking-wide text-muted-foreground uppercase md:text-xs">Saved</div>
	</div>

	<div class="space-y-1 rounded-xl border border-border bg-card p-4 text-center">
		<div class="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
			<Cigarette class="h-4 w-4 text-destructive" />
		</div>
		<div class="font-serif text-xl font-bold text-foreground md:text-2xl">
			{cigarettesAvoided.toLocaleString()}
		</div>
		<div class="text-[10px] tracking-wide text-muted-foreground uppercase md:text-xs">
			Not smoked
		</div>
	</div>

	<div class="space-y-1 rounded-xl border border-border bg-card p-4 text-center">
		<div class="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
			<Clock class="h-4 w-4 text-primary" />
		</div>
		<div class="font-serif text-xl font-bold text-foreground md:text-2xl">{lifeString}</div>
		<div class="text-[10px] tracking-wide text-muted-foreground uppercase md:text-xs">
			Life regained
		</div>
	</div>
</div>
