export const MOTIVATIONAL_MESSAGES = [
	'Every second smoke-free is a victory.',
	'Your body is healing right now, even as you read this.',
	'You are stronger than any craving.',
	'This moment of difficulty is temporary. Your health is permanent.',
	'Breathe deep. Your lungs are thanking you.',
	"You're not giving something up. You're gaining everything back.",
	"Each craving lasts only 3-5 minutes. You've got this.",
	"Think of all the mornings you'll wake up feeling incredible.",
	'Your future self will thank you for this moment of strength.',
	'The hardest part is behind you. Keep going.',
	"You're rewriting your story, one breath at a time.",
	'Freedom from nicotine is the greatest gift you can give yourself.',
	'Your heart is beating stronger with every passing minute.',
	'Cravings are just proof that your body is healing.',
	'You are choosing life. That takes incredible courage.',
	'Remember why you started this journey.',
	'The air has never tasted this good.',
	"You're doing something millions wish they could do.",
	'Stay strong. The best is yet to come.',
	"Your willpower is a muscle, and it's getting stronger every day."
];

export function getRandomMessage() {
	return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}

export const BREATHING_STEPS = [
	{ phase: 'Breathe In', duration: 4, instruction: 'Slowly inhale through your nose...' },
	{ phase: 'Hold', duration: 4, instruction: 'Gently hold your breath...' },
	{ phase: 'Breathe Out', duration: 6, instruction: 'Slowly exhale through your mouth...' },
	{ phase: 'Rest', duration: 2, instruction: 'Relax and prepare for the next breath...' }
];
