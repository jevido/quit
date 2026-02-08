<script>
	import { onMount } from 'svelte';
	import { Quote, RefreshCw } from '@lucide/svelte';
	import { getRandomMessage } from '$lib/motivational-messages.js';

	let message = $state('');

	const refresh = () => {
		message = getRandomMessage();
	};

	onMount(() => {
		refresh();
	});
</script>

<div class="relative rounded-xl border border-border bg-card p-5">
	<Quote class="absolute top-4 left-4 h-5 w-5 text-primary/20" />
	<div class="pr-8 pl-6">
		<p class="text-sm leading-relaxed text-foreground italic">{message}</p>
	</div>
	<button
		onclick={refresh}
		class="absolute top-4 right-4 items-center text-muted-foreground transition-colors hover:text-primary"
		aria-label="Get new motivational message"
	>
		<RefreshCw class="h-4 w-4" />
	</button>
</div>
