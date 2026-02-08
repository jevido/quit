<script>
	import { onDestroy } from 'svelte';
	import { Pause, Play, RotateCcw } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { BREATHING_STEPS } from '$lib/motivational-messages.js';
	import { cn } from '$lib/utils.js';

	let { onCycleComplete = null } = $props();

	let isRunning = $state(false);
	let stepIndex = $state(0);
	let countdown = $state(BREATHING_STEPS[0].duration);
	let cycles = $state(0);
	let timerId = null;

	const currentStep = $derived.by(() => BREATHING_STEPS[stepIndex]);
	const isInhale = $derived.by(() => stepIndex === 0);
	const isExhale = $derived.by(() => stepIndex === 2);
	const scale = $derived.by(() => (isInhale ? 1.3 : isExhale ? 0.8 : stepIndex === 1 ? 1.3 : 1));

	const reset = () => {
		isRunning = false;
		stepIndex = 0;
		countdown = BREATHING_STEPS[0].duration;
		cycles = 0;
	};

	const startTimer = () => {
		clearInterval(timerId);
		timerId = setInterval(() => {
			if (countdown <= 1) {
				const nextIndex = (stepIndex + 1) % BREATHING_STEPS.length;
				if (nextIndex === 0) {
					cycles += 1;
					if (onCycleComplete) onCycleComplete();
				}
				stepIndex = nextIndex;
				countdown = BREATHING_STEPS[nextIndex].duration;
			} else {
				countdown -= 1;
			}
		}, 1000);
	};

	const stopTimer = () => {
		clearInterval(timerId);
		timerId = null;
	};

	$effect(() => {
		if (isRunning) {
			startTimer();
		} else {
			stopTimer();
		}

		return () => stopTimer();
	});

	onDestroy(() => {
		clearInterval(timerId);
	});
</script>

<div class="space-y-6">
	<div class="space-y-1 text-center">
		<h3 class="font-serif text-lg font-semibold text-foreground">Breathing Exercise</h3>
		<p class="text-sm text-muted-foreground">When cravings hit, breathe through them.</p>
	</div>

	<div class="flex items-center justify-center py-8">
		<div class="relative flex h-48 w-48 items-center justify-center">
			<div
				class={cn(
					'absolute inset-0 rounded-full border-2 transition-all ease-in-out',
					isRunning ? 'border-primary' : 'border-border'
				)}
				style={`transform: scale(${isRunning ? scale : 1}); transition-duration: ${
					currentStep.duration
				}s;`}
			></div>
			<div
				class={cn(
					'absolute inset-4 rounded-full transition-all ease-in-out',
					isRunning ? 'bg-primary/10' : 'bg-muted'
				)}
				style={`transform: scale(${isRunning ? scale : 1}); transition-duration: ${
					currentStep.duration
				}s;`}
			></div>
			<div class="relative z-10 text-center">
				{#if isRunning}
					<div class="font-serif text-3xl font-bold text-foreground">{countdown}</div>
					<div class="mt-1 text-sm font-medium text-primary">{currentStep.phase}</div>
				{:else}
					<div class="text-sm text-muted-foreground">Press start</div>
				{/if}
			</div>
		</div>
	</div>

	{#if isRunning}
		<p class="animate-in text-center text-sm text-muted-foreground italic duration-500 fade-in">
			{currentStep.instruction}
		</p>
	{/if}

	<div class="flex items-center justify-center gap-3">
		<Button
			variant="outline"
			size="icon"
			onclick={reset}
			disabled={!isRunning && cycles === 0}
			aria-label="Reset breathing exercise"
		>
			<RotateCcw class="h-4 w-4" />
		</Button>
		<Button
			onclick={() => (isRunning = !isRunning)}
			class="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
			size="lg"
		>
			{#if isRunning}
				<Pause class="mr-2 h-4 w-4" />
				Pause
			{:else}
				<Play class="mr-2 h-4 w-4" />
				{cycles > 0 ? 'Resume' : 'Start'}
			{/if}
		</Button>
	</div>

	{#if cycles > 0}
		<p class="text-center text-xs text-muted-foreground">
			{cycles}
			{cycles === 1 ? 'cycle' : 'cycles'} completed
		</p>
	{/if}
</div>
