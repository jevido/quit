<script>
	import { onDestroy } from 'svelte';
	import { Pause, Play, RotateCcw } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';

	let {
		onCycleComplete = null,
		onStreakReset = null,
		onSessionComplete = null,
		onHoldDurationUpdate = null,
		elapsedMinutes = 0,
		sessionCycles = null,
		autoStart = false
	} = $props();

	const BREATHING_ROUTINES = [
		{
			name: 'Calm',
			steps: [
				{
					phase: 'Breathe In',
					duration: 4,
					instruction: 'Slowly inhale through your nose...',
					kind: 'inhale'
				},
				{ phase: 'Hold', duration: 4, instruction: 'Gently hold your breath...', kind: 'hold' },
				{
					phase: 'Breathe Out',
					duration: 6,
					instruction: 'Slowly exhale through your mouth...',
					kind: 'exhale'
				},
				{
					phase: 'Rest',
					duration: 2,
					instruction: 'Relax and prepare for the next breath...',
					kind: 'rest'
				}
			]
		},
		{
			name: 'Box',
			steps: [
				{ phase: 'Breathe In', duration: 4, instruction: 'Inhale steadily...', kind: 'inhale' },
				{ phase: 'Hold', duration: 4, instruction: 'Keep your shoulders relaxed...', kind: 'hold' },
				{ phase: 'Breathe Out', duration: 4, instruction: 'Exhale evenly...', kind: 'exhale' },
				{ phase: 'Hold', duration: 4, instruction: 'Stay soft and still...', kind: 'hold' }
			]
		},
		{
			name: 'Smooth Rise',
			steps: [
				{
					phase: 'Breathe In',
					duration: 5,
					instruction: 'Let the chest rise gently...',
					kind: 'inhale'
				},
				{ phase: 'Hold', duration: 3, instruction: 'Pause without strain...', kind: 'hold' },
				{
					phase: 'Breathe Out',
					duration: 7,
					instruction: 'Exhale long and steady...',
					kind: 'exhale'
				},
				{ phase: 'Rest', duration: 2, instruction: 'Relax your shoulders...', kind: 'rest' }
			]
		},
		{
			name: 'Recovery',
			steps: [
				{ phase: 'Breathe In', duration: 3, instruction: 'Short, easy inhale...', kind: 'inhale' },
				{ phase: 'Hold', duration: 2, instruction: 'Gentle pause...', kind: 'hold' },
				{ phase: 'Breathe Out', duration: 5, instruction: 'Smooth release...', kind: 'exhale' },
				{ phase: 'Rest', duration: 3, instruction: 'Let the body settle...', kind: 'rest' }
			]
		},
		{
			name: 'Long Exhale',
			steps: [
				{
					phase: 'Breathe In',
					duration: 4,
					instruction: 'Inhale through your nose...',
					kind: 'inhale'
				},
				{ phase: 'Hold', duration: 3, instruction: 'Pause gently...', kind: 'hold' },
				{
					phase: 'Breathe Out',
					duration: 8,
					instruction: 'Let the air out slowly...',
					kind: 'exhale'
				},
				{ phase: 'Rest', duration: 2, instruction: 'Reset your posture...', kind: 'rest' }
			]
		},
		{
			name: 'Quick Reset',
			steps: [
				{ phase: 'Breathe In', duration: 2, instruction: 'Quick, light inhale...', kind: 'inhale' },
				{ phase: 'Hold', duration: 2, instruction: 'Brief pause...', kind: 'hold' },
				{ phase: 'Breathe Out', duration: 4, instruction: 'Smooth exhale...', kind: 'exhale' },
				{ phase: 'Rest', duration: 2, instruction: 'Let the body settle...', kind: 'rest' }
			]
		},
		{
			name: 'Ladder',
			steps: [
				{ phase: 'Breathe In', duration: 3, instruction: 'Inhale smoothly...', kind: 'inhale' },
				{ phase: 'Hold', duration: 3, instruction: 'Hold without tension...', kind: 'hold' },
				{ phase: 'Breathe Out', duration: 4, instruction: 'Exhale softly...', kind: 'exhale' },
				{ phase: 'Rest', duration: 2, instruction: 'Reset...', kind: 'rest' },
				{
					phase: 'Breathe In',
					duration: 4,
					instruction: 'Inhale a little deeper...',
					kind: 'inhale'
				},
				{ phase: 'Hold', duration: 4, instruction: 'Stay calm...', kind: 'hold' },
				{
					phase: 'Breathe Out',
					duration: 6,
					instruction: 'Long, controlled exhale...',
					kind: 'exhale'
				},
				{ phase: 'Rest', duration: 2, instruction: 'Settle and reset...', kind: 'rest' }
			]
		}
	];

	let isRunning = $state(false);
	let isPreparing = $state(false);
	let stepIndex = $state(0);
	let routineIndex = $state(0);
	let countdown = $state(BREATHING_ROUTINES[0].steps[0].duration);
	let prepCountdown = $state(5);
	let cycles = $state(0);
	let holdDuration = $state(BREATHING_ROUTINES[0].steps[1].duration);
	let sessionCycleCount = $state(0);
	let sessionCompleted = $state(false);
	let exhaleBonus = $state(0);
	let inhaleBonus = $state(0);
	let timerId = null;

	const currentRoutine = $derived.by(() => BREATHING_ROUTINES[routineIndex]);
	const currentStep = $derived.by(() => currentRoutine.steps[stepIndex]);
	const currentDuration = $derived.by(() =>
		currentStep.kind === 'hold' ? holdDuration : currentStep.duration
	);
	const scale = $derived.by(() => {
		if (currentStep.kind === 'inhale') return 1.3;
		if (currentStep.kind === 'exhale') return 0.8;
		if (currentStep.kind === 'hold') return 1.2;
		return 1;
	});
	const maxHoldDuration = 60;
	const holdIncreaseEveryCycles = 4;
	const maxExhaleBonus = 2;
	const exhaleIncreaseEveryCycles = 4;
	const maxInhaleBonus = 1;
	const inhaleIncreaseEveryCycles = 6;
	const maxAmplifier = 1.35;
	const amplifierStepMinutes = 720; // every 12 hours

	const stepAmplifier = $derived.by(() => {
		const steps = Math.floor(Math.max(0, elapsedMinutes) / amplifierStepMinutes);
		return Math.min(maxAmplifier, 1 + steps * 0.05);
	});

	const getStepDuration = (index) => {
		const step = currentRoutine.steps[index];
		if (step.kind === 'hold') return holdDuration;
		const base =
			step.kind === 'exhale'
				? step.duration + exhaleBonus
				: step.kind === 'inhale'
					? step.duration + inhaleBonus
					: step.duration;
		return Math.max(1, Math.round(base * stepAmplifier));
	};

	const beginSession = () => {
		sessionCompleted = false;
		sessionCycleCount = 0;
		isPreparing = true;
		prepCountdown = 5;
	};

	const completeSession = () => {
		if (sessionCompleted) return;
		sessionCompleted = true;
		sessionCycleCount = 0;
		if (onSessionComplete) onSessionComplete();
	};

	const reset = () => {
		isRunning = false;
		isPreparing = false;
		stepIndex = 0;
		routineIndex = 0;
		countdown = BREATHING_ROUTINES[0].steps[0].duration;
		prepCountdown = 5;
		cycles = 0;
		holdDuration = BREATHING_ROUTINES[0].steps[1].duration;
		sessionCycleCount = 0;
		sessionCompleted = false;
		exhaleBonus = 0;
		inhaleBonus = 0;
		if (onStreakReset) onStreakReset();
	};

	const startTimer = () => {
		clearInterval(timerId);
		timerId = setInterval(() => {
			if (isPreparing) {
				if (prepCountdown <= 1) {
					isPreparing = false;
					isRunning = true;
					stepIndex = 0;
					countdown = getStepDuration(0);
					return;
				}
				prepCountdown -= 1;
				return;
			}
			if (!isRunning) return;
			if (countdown <= 1) {
				const nextIndex = (stepIndex + 1) % currentRoutine.steps.length;
				if (nextIndex === 0) {
					cycles += 1;
					if (cycles % holdIncreaseEveryCycles === 0 && holdDuration < maxHoldDuration) {
						const nextHold = Math.min(maxHoldDuration, holdDuration + 1);
						if (nextHold !== holdDuration) {
							holdDuration = nextHold;
							if (onHoldDurationUpdate) onHoldDurationUpdate(nextHold);
						}
					}
					if (cycles % exhaleIncreaseEveryCycles === 0 && exhaleBonus < maxExhaleBonus) {
						exhaleBonus = Math.min(maxExhaleBonus, exhaleBonus + 1);
					}
					if (cycles % inhaleIncreaseEveryCycles === 0 && inhaleBonus < maxInhaleBonus) {
						inhaleBonus = Math.min(maxInhaleBonus, inhaleBonus + 1);
					}
					if (onCycleComplete) onCycleComplete();
					if (sessionCycles && !sessionCompleted) {
						sessionCycleCount += 1;
						if (sessionCycleCount >= sessionCycles) {
							completeSession();
							return;
						}
					}
					routineIndex = (routineIndex + 1) % BREATHING_ROUTINES.length;
				}
				stepIndex = nextIndex;
				countdown = getStepDuration(nextIndex);
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
		if (isRunning || isPreparing) {
			startTimer();
		} else {
			stopTimer();
		}

		return () => stopTimer();
	});

	onDestroy(() => {
		clearInterval(timerId);
	});

	$effect(() => {
		if (autoStart && !isRunning && !isPreparing) {
			beginSession();
		}
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
				style={`transform: scale(${isRunning ? scale : 1}); transition-duration: ${currentDuration}s;`}
			></div>
			<div
				class={cn(
					'absolute inset-4 rounded-full transition-all ease-in-out',
					isRunning ? 'bg-primary/10' : 'bg-muted'
				)}
				style={`transform: scale(${isRunning ? scale : 1}); transition-duration: ${currentDuration}s;`}
			></div>
			<div class="relative z-10 text-center">
				{#if isPreparing}
					<div class="font-serif text-3xl font-bold text-foreground">{prepCountdown}</div>
					<div class="mt-1 text-sm font-medium text-primary">Get ready</div>
				{:else if isRunning}
					<div class="font-serif text-3xl font-bold text-foreground">{countdown}</div>
					<div class="mt-1 text-sm font-medium text-primary">{currentStep.phase}</div>
				{:else}
					<div class="text-sm text-muted-foreground">Press start</div>
				{/if}
			</div>
		</div>
	</div>

	{#if isRunning}
		<p class="text-center text-xs font-medium text-muted-foreground">
			Routine: {currentRoutine.name}
		</p>
		<p class="animate-in text-center text-sm text-muted-foreground italic duration-500 fade-in">
			{currentStep.instruction}
		</p>
	{:else if sessionCycles && sessionCompleted}
		<p class="text-center text-sm text-primary">Nice work. You stayed with it.</p>
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
			onclick={() => {
				if (isRunning) {
					isRunning = false;
					if (onStreakReset) onStreakReset();
				} else if (!isPreparing) {
					beginSession();
				}
			}}
			class="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
			size="lg"
		>
			{#if isRunning}
				<Pause class="mr-2 h-4 w-4" />
				Pause
			{:else if isPreparing}
				<Pause class="mr-2 h-4 w-4" />
				Cancel
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
		<p class="text-center text-xs text-muted-foreground">
			Your breathing feels steadier with each round.
		</p>
	{/if}
</div>
