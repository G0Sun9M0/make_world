var 현재단어목록 = 단어목록.english;
var 사용된단어 = [];
var 단계 = 1;
var 최대단계 = 6;
var 답;
var 시도횟수 = 0;
var 최대시도 = Infinity;
var 제한시간 = 180;
var 타이머작동중 = false;
var 시작시간;
var 제한시간타이머;
var 챌린지모드 = false;

document.getElementById('englishButton').addEventListener('click', function () {
    현재단어목록 = 단어목록.english;
});

document.getElementById('koreanButton').addEventListener('click', function () {
    현재단어목록 = 단어목록.korean;
});

// 각 단계별 제한 시간과 시도 횟수 설정
var 단계정보 = [
    { 시간: 180, 시도횟수: Infinity }, // 1단계
    { 시간: 150, 시도횟수: 15 },      // 2단계
    { 시간: 120, 시도횟수: 13 },      // 3단계
    { 시간: 90, 시도횟수: 11 },       // 4단계
    { 시간: 60, 시도횟수: 8 },        // 5단계
    { 시간: 30, 시도횟수: 6 }         // 6단계
];

// 시작 함수 (일반 모드)
function startNormalMode(i) {
    최대시도 = Infinity;  // 일반 모드에서 최대 시도 횟수는 무제한으로 설정
    //일반모드 = true;
    챌린지모드 = false; // 모드 설정
    //alert('일반 모드를 선택했습니다.');
}

// 시작 함수 (챌린지 모드)
function startChallengeMode() {
    //일반모드 = false;
    챌린지모드 = true; // 모드 설정
    제한시간 = 30;
    최대시도 = 6;  // 최대 시도 횟수를 6으로 고정
    document.getElementById('timeLimit').classList.remove('hidden');
    document.getElementById('progressBar').max = 제한시간;
    document.getElementById('progressBar').value = 제한시간;
    document.getElementById('maxAttempts').textContent = 최대시도; // UI에 반영
    //alert('챌린지 모드를 선택했습니다.');
}

// 모드 선택 버튼
document.getElementById('normalModeButton').addEventListener('click', startNormalMode);
document.getElementById('challengeButton').addEventListener('click', startChallengeMode);

// 게임 시작 버튼
document.getElementById('startButton').addEventListener('click', function () {
    // 시작 화면을 숨기고 게임 화면을 표시
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameInfo').classList.remove('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    새단어();
});

function 새단어() {
    var 후보단어목록 = 현재단어목록.filter(word => !사용된단어.includes(word));
    답 = 후보단어목록[Math.floor(Math.random() * 후보단어목록.length)];
    사용된단어.push(답);
    console.log(답);
}

function updateTimer() {
    var 현재시간 = new Date();
    var 경과시간 = Math.floor((현재시간 - 시작시간) / 1000);
    var 분 = String(Math.floor(경과시간 / 60)).padStart(2, '0');
    var 초 = String(경과시간 % 60).padStart(2, '0');
    document.getElementById('time').textContent = `${분}:${초}`;
}

function startTimeLimitTimer() {
    var 남은시간 = 제한시간;
    var progressBar = document.getElementById('progressBar');
    progressBar.max = 제한시간;
    progressBar.value = 제한시간;

    제한시간타이머 = setInterval(function () {
        남은시간--;
        progressBar.value = 남은시간;

        if (남은시간 <= 0) {
            clearInterval(제한시간타이머);
            alert("시간 초과! 게임이 종료됩니다.");
            resetGame();
        }
    }, 1000);
}

function 제출하기() {
    var input = document.querySelectorAll('.input');
    var 빈칸 = false;
    var 빈칸인덱스 = -1;

    // 입력칸이 비어있는지 확인
    input.forEach(function (inputField, index) {
        if (inputField.value === '') {
            빈칸 = true;
            빈칸인덱스 = index;
        }
    });

    // 입력 필드 값을 하나의 단어로 결합
    var userInputWord = Array.from(document.querySelectorAll('.input')).map(input => input.value).join('');

    // 만약 비어있는 칸이 있으면 알림 출력 및 해당 칸으로 이동
    if (빈칸 || !현재단어목록.includes(userInputWord)) {
        if (빈칸) alert("입력이 안되었습니다");
        else if (!현재단어목록.includes(userInputWord)) alert(`단어 목록에 없습니다.`);
        var inputs = document.querySelectorAll('.input');
        if (inputs.length > 0) {
            currentIndex = (currentIndex + 1) % inputs.length; // 인덱스를 하나씩 증가시키며, 마지막 인덱스까지 오면 첫 번째로 이동
            inputs[currentIndex].focus(); // 저장된 인덱스에 포커스
        }
        return;  // 제출 중단
    }

    // 제출하기 함수 내 시도 횟수 체크 부분 수정
    if (시도횟수 >= (최대시도-1)) {
        alert(`시도 횟수를 초과했습니다!`);
        resetGame();
        return;
    }

    // 시도 횟수를 1씩 증가시키도록 수정
    시도횟수++; // 이 부분이 중요합니다. 이 한 줄로 시도 횟수가 1로 카운트됩니다.
    document.getElementById('attemptCount').textContent = 시도횟수;

    var input = document.querySelectorAll('.input');
    var 맞춘갯수 = 0;


    for (let i = 0; i < 6; i++) {
        if (input[i].value === 답[i]) {
            input[i].style.background = '#22c55e';
            맞춘갯수++;
        } else if (답.includes(input[i].value)) {
            input[i].style.background = '#eab308';
        } else {
            input[i].style.background = '#6b7280';
            input[i].style.color = '#ffffff';
        }
        input[i].classList.remove('input');
    }

    if (맞춘갯수 === 6) {
        //alert(`성공! ${시도횟수}번 만에 맞췄습니다.`);
        if (챌린지모드) {
            단계++;
            다음단계();  // 챌린지 모드에서는 무한으로 계속 다음 단계로 진행
        } else if (단계 < 최대단계) {
            // 일반 모드에서는 다음 단계로 진행
            단계++;
            다음단계();
        } else {
            // 모든 단계를 완료했을 때 게임 종료
            완료();
        }
        return;
    }

    var template = `
    <div style="margin-top: 5px;">
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">
    </div>`;
    document.querySelector('#gameSection').insertAdjacentHTML('beforeend', template);
    setInputFilter();
    setAutoTab();
}

function setInputFilter() {
    var inputs = document.querySelectorAll('.input');
    inputs.forEach(function (input) {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/[^a-zA-Z]/g, '');
        });
    });
}
function setAutoTab() {
    var inputs = document.querySelectorAll('.input');
    inputs.forEach(function (input, index) {
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace') {
            if (index > 0) {
                inputs[index-1].focus();  // 이전 입력 필드로 이동
                inputs[index-1].value = '';  // 이전 입력 필드의 값 삭제
            }
        }
    });

    input.addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zA-Z]/g, '');
        if (챌린지모드){
            // 첫 번째 입력 시 타이머 시작
            if (index === 0 && !타이머작동중) {
                시작타이머();  // 일반 타이머 시작
                // 챌린지 모드일 때는 별도로 제한시간 타이머도 시작
                clearInterval(제한시간타이머);  // 이전 타이머 초기화
                startTimeLimitTimer();  // 제한시간 타이머 시작
            }
        }
        if (현재단어목록 === 단어목록.korean) {
                if (input.value === 'q'){
                    inputs[index].value = 'ㅂ';
                } else if (input.value === 'Q') {
                    inputs[index].value = 'ㅂ';
                    inputs[index+1].value = 'ㅂ';
                    setTimeout(() => {
                        inputs[index + 2].focus();
                    }, 0);
                } else if (input.value === 'w'){
                    inputs[index].value = 'ㅈ';
                } else if (input.value === 'W') {
                    inputs[index].value = 'ㅈ';
                    inputs[index+1].value = 'ㅈ';
                    setTimeout(() => {
                        inputs[index + 2].focus();
                    }, 0);
                } else if (input.value === 'e') {
                    inputs[index].value = 'ㄷ';;
                } else if (input.value === 'E') {
                    inputs[index].value = 'ㄷ';
                    inputs[index+1].value = 'ㄷ';
                    setTimeout(() => {
                        inputs[index + 2].focus();
                    }, 0);
                } else if (input.value === 'r') {
                    inputs[index].value = 'ㄱ';
                } else if (input.value === 'R') {
                    inputs[index].value = 'ㄱ';
                    inputs[index+1].value = 'ㄱ';
                    setTimeout(() => {
                        inputs[index + 2].focus();
                    }, 0);
                } else if (input.value === 't') {
                    inputs[index].value = 'ㅅ';
                } else if (input.value === 'T') {
                    inputs[index].value = 'ㅅ';
                    inputs[index+1].value = 'ㅅ';
                    setTimeout(() => {
                        inputs[index + 2].focus();
                    }, 0); 
                } else if (input.value === 'y'|| input.value === 'Y') {
                    inputs[index].value = 'ㅛ';
                } else if (input.value === 'u'|| input.value === 'U') {
                    inputs[index].value = 'ㅕ';
                } else if (input.value === 'i' || input.value === 'I') {
                    inputs[index].value = 'ㅑ';
                } else if (input.value === 'o') {
                    inputs[index].value = 'ㅏ';
                    inputs[index + 1].value = 'ㅣ';
                    setTimeout(() => {
                        inputs[index + 2].focus();
                    }, 0);
                } else if (input.value === 'O') {
                    inputs[index].value = 'ㅑ';
                    inputs[index+1].value = 'ㅣ';
                    setTimeout(() => {
                        inputs[index + 2].focus();
                    }, 0);
                } else if (input.value === 'p') {
                    inputs[index].value = 'ㅓ';
                    inputs[index + 1].value = 'ㅣ';
                    setTimeout(() => {
                        inputs[index + 2].focus();
                    }, 0);
                } else if (input.value === 'P') {
                    inputs[index].value = 'ㅕ';
                    inputs[index+1].value = 'ㅣ';
                    setTimeout(() => {
                        inputs[index + 2].focus();
                    }, 0);
                } else if (input.value === 'a'|| input.value === 'A') {
                    inputs[index].value = 'ㅁ';
                } else if (input.value === 's'|| input.value === 'S') {
                    inputs[index].value = 'ㄴ';
                } else if (input.value === 'd'|| input.value === 'D') {
                    inputs[index].value = 'ㅇ';
                } else if (input.value === 'f'|| input.value === 'F') {
                    inputs[index].value = 'ㄹ';
                } else if (input.value === 'g'|| input.value === 'G') {
                    inputs[index].value = 'ㅎ';
                } else if (input.value === 'h'|| input.value === 'H') {
                    inputs[index].value = 'ㅗ';
                } else if (input.value === 'j'|| input.value === 'J') {
                    inputs[index].value = 'ㅓ';
                } else if (input.value === 'k'|| input.value === 'K') {
                    inputs[index].value = 'ㅏ';
                } else if (input.value === 'l'|| input.value === 'L') {
                    inputs[index].value = 'ㅣ';
                } else if (input.value === 'z'|| input.value === 'Z') {
                    inputs[index].value = 'ㅋ';
                } else if (input.value === 'x'|| input.value === 'X') {
                    inputs[index].value = 'ㅌ';
                } else if (input.value === 'c'|| input.value === 'C') {
                    inputs[index].value = 'ㅊ';
                } else if (input.value === 'v'|| input.value === 'V') {
                    inputs[index].value = 'ㅍ';
                } else if (input.value === 'b'|| input.value === 'B') {
                    inputs[index].value = 'ㅠ';
                } else if (input.value === 'n'|| input.value === 'N') {
                    inputs[index].value = 'ㅜ';
                } else if (input.value === 'm'|| input.value === 'M') {
                    inputs[index].value = 'ㅡ';
                }
            }
        // 자동으로 다음 입력 필드로 이동
        if (this.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
});
}

function 시작타이머() {
    if (!타이머작동중) {
        타이머작동중 = true;
        시작시간 = new Date();
        setInterval(updateTimer, 1000);
    }
}

function resetGame() {
    // 시작 화면을 다시 표시하고 게임 화면을 숨김
    document.getElementById('startScreen').classList.remove('hidden');
    document.getElementById('gameInfo').classList.add('hidden');
    document.getElementById('gameSection').classList.add('hidden');
    단계 = 1;
    사용된단어 = [];
    시도횟수 = 0;
    // 페이지 새로고침
    location.reload();
}

function 다음단계() {
    clearInterval(제한시간타이머);  // 기존 제한시간 타이머 정지
    새단어();  // 새로운 단어 설정

    // 단계에 따른 시간만 설정하고 최대 시도 횟수는 고정
    var currentInfo = 단계정보[Math.min(단계 - 1, 단계정보.length - 1)];  // 최대 단계정보를 넘어서면 마지막 단계정보를 계속 사용
    제한시간 = currentInfo.시간;  // 제한시간 설정

    // 시도 횟수 초기화
    시도횟수 = 0;  // 시도 횟수를 0으로 초기화
    document.getElementById('attemptCount').textContent = 시도횟수;  // UI에 반영

    if (!챌린지모드){
        var currentInfo = 단계정보[단계 - 1];
        최대시도 = currentInfo.시도횟수;  // 단계에 맞는 시도 횟수 설정
    }

    // 현재 단계 업데이트
    document.getElementById('currentStage').textContent = 단계;
    document.getElementById('maxAttempts').textContent = 최대시도 === Infinity ? '무제한' : 최대시도; // 챌린지 모드에서 최대 시도 횟수 고정된 값 표시

    // 챌린지 모드일 경우 타이머 UI 업데이트
    if (챌린지모드) {
        document.getElementById('timeLimit').classList.remove('hidden');
        document.getElementById('progressBar').max = 제한시간;
        document.getElementById('progressBar').value = 제한시간;
    }

    // 입력 필드 재설정
    document.getElementById('gameSection').innerHTML = `
        <br>
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">
        <input class="input" maxlength="1">`;

    setInputFilter();  // 입력 필드 필터 설정
    setAutoTab();  // 자동 탭 설정

    // 챌린지 모드일 경우 타이머 재시작
    if (챌린지모드) {
        clearInterval(제한시간타이머);  // 이전 타이머 정지
        startTimeLimitTimer();  // 새로운 타이머 시작
    }

    if (시도횟수 >= 최대시도) {
        alert("시도 횟수를 초과했습니다!");  // 게임 종료 알림
        resetGame();
        return;
    }
}

function 완료() {
    // 챌린지 모드에서 모든 단계를 성공했을 때의 행동 정의
    alert("게임 완료! 모든 단계를 성공했습니다!");
    resetGame();  // 게임 리셋
}

// 모드 선택 버튼
document.getElementById('normalModeButton').addEventListener('click', function () {
    챌린지모드 = false;
    최대시도 = 단계수;  // 일반 모드에서 최대 시도 횟수는 무제한으로 설정
    //alert('일반 모드를 선택했습니다.');
});

document.getElementById('challengeButton').addEventListener('click', function () {
    챌린지모드 = true;
    제한시간 = 30;
    최대시도 = 6;  // 최대 시도 횟수를 6으로 고정
    document.getElementById('timeLimit').classList.remove('hidden');
    document.getElementById('progressBar').max = 제한시간;
    document.getElementById('progressBar').value = 제한시간;
    document.getElementById('maxAttempts').textContent = 최대시도; // UI에 반영
});

// 게임 시작 버튼
document.getElementById('startButton').addEventListener('click', function () {
    // 시작 화면을 숨기고 게임 화면을 표시
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameInfo').classList.remove('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    새단어();
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        제출하기();
        var inputs = document.querySelectorAll('.input');
        if (inputs.length > 0) {
            inputs[0].focus();
        }
    }
});

새단어();
setInputFilter();
setAutoTab();