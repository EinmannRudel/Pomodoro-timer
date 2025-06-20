// ==== Constants ====
const LS = localStorage;

const defaultSettings = {
	pomodoro: 25,
	shortBreak: 5,
	longBreak: 15,
};

// ==== DOM Elements ====
const buttons = document.querySelectorAll('.btn');
const pomodoroBtn = document.querySelector('.pomodoro');
const shortBreakBtn = document.querySelector('.short-break');
const longBreakBtn = document.querySelector('.long-break');

const actionsBtn = document.querySelectorAll('.btn-actions');
const pomodoroStartBtn = document.querySelector('.pomodoro-start');
const pomodoroStopBtn = document.querySelector('.pomodoro-stop');
const pomodoroRefreshBtn = document.querySelector('.pomodoro-refresh');

const pomodoroTimer = document.querySelector('.pomodoro-timer');
const timerInputs = document.querySelectorAll('.timer-settings-item');

const pomodoroSettingsBtn = document.querySelector('.pomodoro-settings');
const settingsModal = document.querySelector('.settings-modal');
const settingsBtn = document.querySelectorAll('.settings-btn');
const settingsContent = document.querySelectorAll('.settings-content > div');
const saveBtn = document.querySelector('.save-btn');
const closeBtn = document.querySelector('.close-btn');

const pomodoroInput = document.getElementById('pomodoro-time');
const shortBreakInput = document.getElementById('short-break-time');
const longBreakInput = document.getElementById('long-break-time');

const loginForm = document.querySelector('.login-form');
const userInfo = document.querySelector('.user-info');
const userInputLogin = document.getElementById('login');
const userInputPassword = document.getElementById('pass');
const userName = document.querySelector('.greeting-text');

const logInBtn = document.querySelector('.login-btn');
const logOutBtn = document.querySelector('.logout-btn');

// ==== State ====
let timerInterval;
let timeRemaining = 0;

// ==== Utility Functions ====
const getSettings = () =>
	JSON.parse(LS.getItem('timerSettings')) || defaultSettings;

const getActiveMode = () => LS.getItem('activeMode') || 'pomodoro';

const setActiveMode = (mode) => LS.setItem('activeMode', mode);

const updateTimerDisplay = () => {
	const minutes = Math.floor(timeRemaining / 60)
		.toString()
		.padStart(2, '0');
	const seconds = (timeRemaining % 60).toString().padStart(2, '0');
	pomodoroTimer.textContent = `${minutes}:${seconds}`;
};

const setTime = (minutes) => {
	clearInterval(timerInterval);
	timerInterval = null;
	timeRemaining = minutes * 60;
	updateTimerDisplay();
};

const resetTimeByMode = () => {
	const settings = getSettings();
	const activeMode = getActiveMode();
	setTime(settings[activeMode] || defaultSettings[activeMode]);
};

const saveSettings = () => {
	const newSettings = {
		pomodoro: +pomodoroInput.value,
		shortBreak: +shortBreakInput.value,
		longBreak: +longBreakInput.value,
	};
	LS.setItem('timerSettings', JSON.stringify(newSettings));

	const user = JSON.parse(LS.getItem('userAccount'));
	if (user) {
		user.timerSettings = newSettings;
		LS.setItem('userAccount', JSON.stringify(user));
	}
};

const showSavedMessage = () => {
	const msg = document.createElement('div');
	msg.textContent = '✅ Settings saved!';
	msg.className = 'save-message';
	document.body.appendChild(msg);
	setTimeout(() => msg.remove(), 2000);
};

// ==== Timer Logic ====
const startTimer = () => {
	if (timerInterval) return;

	timerInterval = setInterval(() => {
		timeRemaining--;
		updateTimerDisplay();

		if (timeRemaining <= 0) {
			clearInterval(timerInterval);
			alert('Time Off!');
		}
	}, 1000);
};

// ==== Event Listeners ====
buttons.forEach((btn) =>
	btn.addEventListener('click', () => {
		if (!btn.classList.contains('active')) {
			buttons.forEach((b) => b.classList.remove('active'));
			btn.classList.add('active');
		}
	})
);

actionsBtn.forEach((btn) =>
	btn.addEventListener('click', () => {
		if (!btn.classList.contains('active')) {
			actionsBtn.forEach((b) => b.classList.remove('active'));
			btn.classList.add('active');
		}
	})
);

pomodoroStartBtn.addEventListener('click', startTimer);
pomodoroStopBtn.addEventListener('click', () => {
	clearInterval(timerInterval);
	timerInterval = null;
});
pomodoroRefreshBtn.addEventListener('click', resetTimeByMode);

pomodoroBtn.addEventListener('click', () => {
	setTime(getSettings().pomodoro);
	setActiveMode('pomodoro');
});
shortBreakBtn.addEventListener('click', () => {
	setTime(getSettings().shortBreak);
	setActiveMode('shortBreak');
});
longBreakBtn.addEventListener('click', () => {
	setTime(getSettings().longBreak);
	setActiveMode('longBreak');
});

saveBtn.addEventListener('click', () => {
	saveSettings();
	showSavedMessage();
	resetTimeByMode();
});

pomodoroSettingsBtn.addEventListener('click', () =>
	settingsModal.classList.toggle('modal-active')
);
closeBtn.addEventListener('click', () =>
	settingsModal.classList.toggle('modal-active')
);

settingsBtn.forEach((tab, index) =>
	tab.addEventListener('click', () => {
		settingsBtn.forEach((btn) => btn.classList.remove('tab-active'));
		tab.classList.add('tab-active');

		settingsContent.forEach((content) =>
			content.classList.remove('content-active')
		);
		settingsContent[index].classList.add('content-active');
	})
);

// ==== Account Logic ====
logInBtn.addEventListener('click', (e) => {
	e.preventDefault();

	const login = userInputLogin.value.trim();
	const pass = userInputPassword.value.trim();

	if (!login || !pass) return;

	const user = {
		name: login,
		password: pass,
		timerSettings: getSettings(),
	};
	LS.setItem('userAccount', JSON.stringify(user));

	loginForm.classList.add('d-none');
	userInfo.classList.remove('d-none');
	userName.textContent = `Welcome, ${login}`;
});

logOutBtn.addEventListener('click', () => {
	LS.removeItem('userAccount');
	LS.removeItem('timerSettings');

	loginForm.classList.remove('d-none');
	userInfo.classList.add('d-none');

	userInputLogin.value = '';
	userInputPassword.value = '';

	pomodoroInput.value = defaultSettings.pomodoro;
	shortBreakInput.value = defaultSettings.shortBreak;
	longBreakInput.value = defaultSettings.longBreak;

	setActiveMode('pomodoro');
	setTime(defaultSettings.pomodoro);

	buttons.forEach((btn) => btn.classList.remove('active'));
	pomodoroBtn.classList.add('active');
});

// ==== Init ====
const loadInitialSettings = () => {
	const settings = getSettings();
	const activeMode = getActiveMode();

	pomodoroInput.value = settings.pomodoro;
	shortBreakInput.value = settings.shortBreak;
	longBreakInput.value = settings.longBreak;

	buttons.forEach((btn) => btn.classList.remove('active'));
	if (activeMode === 'shortBreak') shortBreakBtn.classList.add('active');
	else if (activeMode === 'longBreak') longBreakBtn.classList.add('active');
	else pomodoroBtn.classList.add('active');

	resetTimeByMode();
};

const loadUser = () => {
	const user = JSON.parse(LS.getItem('userAccount'));
	if (!user) return;

	loginForm.classList.add('d-none');
	userInfo.classList.remove('d-none');
	userName.textContent = `Welcome, ${user.name}!`;
};

const init = () => {
	loadInitialSettings();
	loadUser();
	updateTimerDisplay();
};

window.addEventListener('DOMContentLoaded', init);
