// pomodoro

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

// modal

const settingsModal = document.querySelector('.settings-modal');
const settingsBtn = document.querySelectorAll('.settings-btn');
const settingsContent = document.querySelectorAll('.settings-content > div');
const saveBtn = document.querySelector('.save-btn');
const closeBtn = document.querySelector('.close-btn');

// window.addEventListener('DOMContentLoaded', loadTimerSettings);

let timerInterval;
let timeRemainning = 0;

// pomodoro settings

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

// modal settings

const LS = localStorage;
const pomodoroInput = document.getElementById('pomodoro-time');
const shortBreakInput = document.getElementById('short-break-time');
const longBreakInput = document.getElementById('long-break-time');

settingsBtn.forEach((elems, index) => {
	elems.addEventListener('click', () => {
		if (!elems.classList.contains('tab-active'))
			settingsBtn.forEach((btn) => {
				btn.classList.remove('tab-active');
			});
		elems.classList.add('tab-active');

		settingsContent.forEach((content) =>
			content.classList.remove('content-active')
		);
		settingsContent[index].classList.add('content-active');
	});
});

pomodoroSettingsBtn.addEventListener('click', () => {
	settingsModal.classList.toggle('modal-active');
});
closeBtn.addEventListener('click', () => {
	settingsModal.classList.toggle('modal-active');
});

// timer Settings

const saveTimerSettings = () => {
	const timerObj = {
		pomodoro: +pomodoroInput.value,
		shortBreak: +shortBreakInput.value,
		longBreak: +longBreakInput.value,
	};

	LS.setItem('timerSettings', JSON.stringify(timerObj));
};

saveBtn.addEventListener('click', saveTimerSettings);

const loadTimerSettings = () => {
	const savedSettings = LS.getItem('timerSettings');

	if (savedSettings) {
		const timerParse = JSON.parse(savedSettings);
		pomodoroInput.value = timerParse.pomodoro;
		shortBreakInput.value = timerParse.shortBreak;
		longBreakInput.value = timerParse.longBreak;

		if (pomodoroBtn.classList.contains('active')) {
			timeRemainning = timerParse.pomodoro * 60;
		} else if (shortBreakBtn.classList.contains('active')) {
			timeRemainning = timerParse.shortBreak * 60;
		} else if (longBreakBtn.classList.contains('active')) {
			timeRemainning = timerParse.longBreak * 60;
		}
		updateTimer();
	} else return;
};

window.addEventListener('DOMContentLoaded', loadTimerSettings);
