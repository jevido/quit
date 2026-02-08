<script>
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ArrowLeft, Heart, Sparkles, Wind } from '@lucide/svelte';
	import { mode, setMode } from 'mode-watcher';

	let { onComplete = () => {}, onUndo = null, canUndo = false } = $props();

	const maxQuitDate = $derived.by(() => new Date().toISOString().slice(0, 16));
	// svelte-ignore state_referenced_locally
	let quitDate = $state(maxQuitDate);
	let cigarettesPerDay = $state(20);
	let pricePerPack = $state(13);
	let cigarettesPerPack = $state(20);

	const isDarkMode = $derived.by(() => mode.current === 'dark');
	const toggleTheme = () => {
		setMode(isDarkMode ? 'light' : 'dark');
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const safeQuitDate = quitDate > maxQuitDate ? maxQuitDate : quitDate;
		quitDate = safeQuitDate;
		onComplete({
			quitDate: safeQuitDate,
			cigarettesPerDay: Number(cigarettesPerDay),
			pricePerPack: Number(pricePerPack),
			cigarettesPerPack: Number(cigarettesPerPack)
		});
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<div class="w-full max-w-md space-y-8">
		{#if canUndo && onUndo}
			<div class="flex items-center justify-start">
				<Button
					variant="ghost"
					size="sm"
					onclick={onUndo}
					class="text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft class="mr-1.5 h-3.5 w-3.5" />
					Back
				</Button>
			</div>
		{/if}
		<div class="space-y-4 text-center">
			<div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
				<Wind class="h-8 w-8 text-primary" />
			</div>
			<h1 class="font-serif text-3xl font-bold text-balance text-foreground">Quit</h1>
			<p class="leading-relaxed text-balance text-muted-foreground">
				Your journey to a healthier life starts here. Let's track your progress and celebrate every
				milestone with you.
			</p>
		</div>

		<div class="flex items-center justify-center gap-6 text-sm text-muted-foreground">
			<div class="flex items-center gap-1.5">
				<Heart class="h-4 w-4 text-primary" />
				<span>Health tracking</span>
			</div>
			<div class="flex items-center gap-1.5">
				<Sparkles class="h-4 w-4 text-accent" />
				<span>Milestones</span>
			</div>
		</div>

		<Card>
			<CardHeader>
				<div class="flex items-start justify-between gap-4">
					<div class="space-y-1">
						<CardTitle class="text-lg">Set Up Your Journey</CardTitle>
						<CardDescription>
							Tell us a little about your smoking habits so we can track your progress.
						</CardDescription>
					</div>
					<Switch checked={isDarkMode} onclick={toggleTheme} aria-label="Toggle dark mode" />
				</div>
			</CardHeader>
			<CardContent>
				<form onsubmit={handleSubmit} class="space-y-5">
					<div class="space-y-2">
						<Label for="quitDate">When did you quit?</Label>
						<Input
							id="quitDate"
							type="datetime-local"
							bind:value={quitDate}
							class="bg-background"
							max={maxQuitDate}
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="cigarettesPerDay">Cigarettes per day</Label>
						<Input
							id="cigarettesPerDay"
							type="number"
							min={1}
							max={100}
							bind:value={cigarettesPerDay}
							class="bg-background"
							required
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<Label for="pricePerPack">Price per pack (€)</Label>
							<Input
								id="pricePerPack"
								type="number"
								min={0.5}
								step={0.5}
								bind:value={pricePerPack}
								class="bg-background"
								required
							/>
						</div>
						<div class="space-y-2">
							<Label for="cigarettesPerPack">Cigarettes per pack</Label>
							<Input
								id="cigarettesPerPack"
								type="number"
								min={1}
								max={50}
								bind:value={cigarettesPerPack}
								class="bg-background"
								required
							/>
						</div>
					</div>

					<Button
						type="submit"
						class="w-full bg-primary text-primary-foreground hover:bg-primary/90"
						size="lg"
					>
						Start My Journey
					</Button>
				</form>
			</CardContent>
		</Card>

		<p class="text-center text-xs text-muted-foreground">
			All data is stored locally on your device. No account needed.
		</p>
	</div>
</div>
