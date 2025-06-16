// pomodoro timer buttons

const buttons = document.querySelectorAll('.btn');
const pomodoroBtn = document.querySelector('.pomodoro');
const shortBreakBtn = document.querySelector('.short-break');
const longBreakBtn = document.querySelector('.long-break');

// pomodoto actions buttons

const actionsBtn = document.querySelectorAll('.btn-actions');
const pomodoroStartBtn = document.querySelector('.pomodoro-start');
const pomodoroStopBtn = document.querySelector('.pomodoro-stop');
const pomodoroRefreshBtn = document.querySelector('.pomodoro-refresh');

// pomodoro timer

const pomodoroTimer = document.querySelector('.pomodoro-timer');
const timerInputs = document.querySelectorAll('.timer-settings-item');

// modal settings

const pomodoroSettingsBtn = document.querySelector('.pomodoro-settings');
const settingsModal = document.querySelector('.settings-modal');
const settingsBtn = document.querySelectorAll('.settings-btn');
const settingsContent = document.querySelectorAll('.settings-content > div');
const saveBtn = document.querySelector('.save-btn');
const closeBtn = document.querySelector('.close-btn');

let timerInterval;
let timeRemainning = 0;

const defaultSettings = {
	pomodoro: 25,
	shortBreak: 5,
	longBreak: 15,
};

// ========== 3. Init ==========
const init = () => {
	loadTimerSettings();
	loadUser();

	updateTimer();
};

window.addEventListener('DOMContentLoaded', init);

// pomodoro  buttons settings

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

// pomodoro timer settings

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

//pomodoro active buttons settings

pomodoroStartBtn.addEventListener('click', () => {
	startTimer();
});

pomodoroBtn.addEventListener('click', () => {
	// setTime(25);
	const saved = JSON.parse(LS.getItem('timerSettings'));
	setTime(saved?.pomodoro || 25);
	LS.setItem('activeMode', 'pomodoro');
});
shortBreakBtn.addEventListener('click', () => {
	// setTime(5);
	const saved = JSON.parse(LS.getItem('timerSettings'));
	setTime(saved?.shortBreak || 5);
	LS.setItem('activeMode', 'shortBreak');
});
longBreakBtn.addEventListener('click', () => {
	// setTime(15);
	const saved = JSON.parse(LS.getItem('timerSettings'));
	setTime(saved?.longBreak || 15);
	LS.setItem('activeMode', 'longBreak');
});

pomodoroStopBtn.addEventListener('click', () => {
	clearInterval(timerInterval);
	timerInterval = null;
});

pomodoroRefreshBtn.addEventListener('click', () => {
	clearInterval(timerInterval);
	timerInterval = null;
	// timeRemainning = 25 * 60;

	const activeMode = LS.getItem('activeMode');
	const saved = JSON.parse(LS.getItem('timerSettings'));

	let minutes;

	if (saved) {
		minutes = saved[activeMode];
	} else {
		if (activeMode === 'pomodoro') minutes = 25;
		else if (activeMode === 'shortBreak') minutes = 5;
		else if (activeMode === 'longBreak') minutes = 15;
	}
	timeRemainning = minutes * 60;
	updateTimer();
});

// modal pomodoro settings

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

// save pomodoro Settings

const saveTimerSettings = () => {
	const timerObj = {
		pomodoro: +pomodoroInput.value,
		shortBreak: +shortBreakInput.value,
		longBreak: +longBreakInput.value,
	};

	LS.setItem('timerSettings', JSON.stringify(timerObj));

	const savedUser = JSON.parse(LS.getItem('userAccount'));
	if (savedUser) {
		savedUser.timerSettings = timerObj;
		LS.setItem('userAccount', JSON.stringify(savedUser));
	}
};

const showSavedMessage = () => {
	const msg = document.createElement('div');
	msg.textContent = '✅ Settings saved!';
	msg.className = 'save-message';
	document.body.appendChild(msg);
	setTimeout(() => msg.remove(), 2000);
};

saveBtn.addEventListener('click', () => {
	saveTimerSettings();
	showSavedMessage();

	// const activeMode = LS.getItem('activeMode');
	// const newSettings = {
	// 	pomodoro: +pomodoroInput.value,
	// 	shortBreak: +shortBreakInput.value,
	// 	longBreak: +longBreakInput.value,
	// };

	// let newMinutes = 25;

	// if (activeMode === 'pomodoro') {
	// 	newMinutes = newSettings.pomodoro;
	// } else if (activeMode === 'shortBreak') {
	// 	newMinutes = newSettings.shortBreak;
	// } else if (activeMode === 'longBreak') {
	// 	newMinutes = newSettings.longBreak;
	// }

	// clearInterval(timerInterval);
	// timerInterval = null;
	// setTime(newMinutes);
});

// load pomodoro settings

const loadTimerSettings = () => {
	const savedSettings = LS.getItem('timerSettings');

	if (savedSettings) {
		const timerParse = JSON.parse(savedSettings);
		pomodoroInput.value = timerParse.pomodoro;
		shortBreakInput.value = timerParse.shortBreak;
		longBreakInput.value = timerParse.longBreak;

		const activeMode = LS.getItem('activeMode');
		if (activeMode === 'pomodoro') {
			pomodoroBtn.classList.add('active');

			setTime(timerParse.pomodoro);
		} else if (activeMode === 'shortBreak') {
			shortBreakBtn.classList.add('active');

			setTime(timerParse.shortBreak);
		} else if (activeMode === 'longBreak') {
			longBreakBtn.classList.add('active');

			setTime(timerParse.longBreak);
		}
		updateTimer();
	} else {
		LS.setItem('timerSettings', JSON.stringify(defaultSettings));
		LS.setItem('activeMode', 'pomodoro');

		pomodoroInput.value = defaultSettings.pomodoro;
		shortBreakInput.value = defaultSettings.shortBreak;
		longBreakInput.value = defaultSettings.longBreak;

		pomodoroBtn.classList.add('active');
		setTime(defaultSettings.pomodoro);
	}
};

// pomodoro account

//  accout settings

const loginForm = document.querySelector('.login-form');
const userInfo = document.querySelector('.user-info');
const userInputLogin = document.getElementById('login');
const userInputPassword = document.getElementById('pass');

const userName = document.querySelector('.greeting-text');

// account btn

const logInBtn = document.querySelector('.login-btn');
const logOutBtn = document.querySelector('.logout-btn');

logInBtn.addEventListener('click', (event) => {
	event.preventDefault();

	const login = userInputLogin.value.trim();
	const pass = userInputPassword.value.trim();

	const savedTimerSettings = JSON.parse(LS.getItem('timerSettings')) || {
		pomodoro: 25,
		shortBreak: 5,
		longBreak: 15,
	};

	const userData = {
		name: login,
		password: pass,
		timerSettings: savedTimerSettings,
	};
	LS.setItem('userAccount', JSON.stringify(userData));

	if (login === '' || pass === '') {
		console.log('Empty fields');
		return;
	}

	loginForm.classList.add('d-none');
	userInfo.classList.remove('d-none');

	userName.textContent = `Welcome, ${login}`;
});

const loadUser = () => {
	const savedUser = LS.getItem('userAccount');

	if (savedUser) {
		const userData = JSON.parse(savedUser);

		loginForm.classList.add('d-none');
		userInfo.classList.remove('d-none');

		userName.textContent = `Welcome, ${userData.name}!`;

		if (userData.timerSettings) {
			const savedSettings = userData.timerSettings;
			pomodoroInput.value = savedSettings.pomodoro;
			shortBreakInput.value = savedSettings.shortBreak;
			longBreakInput.value = savedSettings.longBreak;

			// Встановлюємо активний режим таймера
			const activeMode = LS.getItem('activeMode');
			if (activeMode === 'pomodoro') {
				pomodoroBtn.classList.add('active');
				setTime(savedSettings.pomodoro);
			} else if (activeMode === 'shortBreak') {
				shortBreakBtn.classList.add('active');
				setTime(savedSettings.shortBreak);
			} else if (activeMode === 'longBreak') {
				longBreakBtn.classList.add('active');
				setTime(savedSettings.longBreak);
			}
		}
	}
};

logOutBtn.addEventListener('click', () => {
	LS.removeItem('userAccount');
	LS.removeItem('timerSettings');

	userInfo.classList.add('d-none');

	loginForm.classList.remove('d-none');

	userInputLogin.value = '';
	userInputPassword.value = '';

	pomodoroInput.value = defaultSettings.pomodoro;
	shortBreakInput.value = defaultSettings.shortBreak;
	longBreakInput.value = defaultSettings.longBreak;
});
