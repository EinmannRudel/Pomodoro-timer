const buttons = document.querySelectorAll('.btn');
const pomodoroBtn = document.querySelector('.pomodoro');
const shortBreakBtn = document.querySelector('.short-break');
const longBreakBtn = document.querySelector('.long-break');
const pomodoroTimer = document.querySelector('.pomodoro-timer');
const actionsBtn = document.querySelectorAll('.btn-actions');
const pomodoroStartBtn = document.querySelector('.pomodoro-start');
const pomodoroStopBtn = document.querySelector('.pomodoro-stop');
const pomodoroRefreshBtn = document.querySelector('.pomodoro-refresh');
const pomodoroSettingsBtn = document.querySelector('.pomodoro-settings');

console.log(actionsBtn);

let timerInterval;
let timeRemainning = 25 * 60;

buttons.forEach((item) => {
	item.addEventListener('click', () => {
		if (!item.classList.contains('active')) {
			buttons.forEach((btn) => {
				btn.classList.remove('active');
			});
			item.classList.add('active');
		}
	});
});

actionsBtn.forEach((item) => {
	item.addEventListener('click', () => {
		if (!item.classList.contains('active')) {
			actionsBtn.forEach((btn) => {
				btn.classList.remove('active');
			});
			item.classList.add('active');
		}
	});
});

const updateTimer = () => {
	const minutes = Math.floor(timeRemainning / 60);
	const seconds = timeRemainning % 60;

	pomodoroTimer.textContent = `${minutes
		.toString()
		.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const startTimer = () => {
	if (timerInterval) return;
	timerInterval = setInterval(() => {
		timeRemainning--;
		updateTimer();

		if (timeRemainning <= 0) {
			clearInterval(timerInterval);
			alert('Time Off!');
		}
	}, 1000);
};

const setTime = (minutes) => {
	clearInterval(timerInterval);
	timerInterval = null;
	timeRemainning = minutes * 60;
	updateTimer();
};

pomodoroStartBtn.addEventListener('click', () => {
	startTimer();
});

pomodoroBtn.addEventListener('click', () => {
	setTime(25);
});
shortBreakBtn.addEventListener('click', () => {
	setTime(5);
});
longBreakBtn.addEventListener('click', () => {
	setTime(15);
});

pomodoroStopBtn.addEventListener('click', () => {
	clearInterval(timerInterval);
	timerInterval = null;
});

pomodoroRefreshBtn.addEventListener('click', () => {
	clearInterval(timerInterval);
	timerInterval = null;
	timeRemainning = 25 * 60;
	updateTimer();
});
