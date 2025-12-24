const canvas = document.getElementById("progressCanvas");
const ctx = canvas.getContext("2d");
const pauseBtn = document.getElementById("pauseBtn");
const STUDY_TIME = 50 * 60; // 50분
const BREAK_TIME = 10 * 60; // 10분
const studyLogs = [];

let totalSeconds = STUDY_TIME;
let remainingSeconds = totalSeconds;
let interval = null;
let mode = "study";
let isPaused = false;

drawProgress();

/* 공부 시작 */
function startStudy() {
  if (interval) return; // 이미 실행 중이면 무시

  isPaused = false;
  pauseBtn.innerText = "일시정지";
  startInterval(); // ✅ 타이머 시작
}

/* 일시정지 / 다시시작 토글 */
function togglePause() {
  if (!interval && !isPaused) return; // 아직 시작 안 했을 때

  if (isPaused) {
    // ▶️ 다시 시작
    startInterval();
    pauseBtn.innerText = "일시정지";
    isPaused = false;
  } else {
    // ⏸ 일시정지
    clearInterval(interval);
    interval = null;
    pauseBtn.innerText = "다시 시작";
    isPaused = true;
  }
}

/* 실제 타이머 동작 */
function startInterval() {
  interval = setInterval(() => {
    remainingSeconds--;
    drawProgress();

    if (remainingSeconds <= 0) {
      clearInterval(interval);
      interval = null;
      isPaused = false;
      pauseBtn.innerText = "일시정지";

      alert("45분 공부 완료!");
    }
  }, 1000);
}

/* 원형 타이머 그리기 */
function drawProgress() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const progress = remainingSeconds / totalSeconds;
  const angle = progress * 2 * Math.PI;

  // 배경 원
  ctx.beginPath();
  ctx.arc(110, 110, 100, 0, 2 * Math.PI);
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 10;
  ctx.stroke();

  // 진행 바
  ctx.beginPath();
  ctx.arc(
    110,
    110,
    100,
    -Math.PI / 2,
    -Math.PI / 2 + angle
  );
  ctx.strokeStyle = "#1f3c88";
  ctx.lineWidth = 10;
  ctx.stroke();

  // 시간 표시
  const min = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const sec = String(remainingSeconds % 60).padStart(2, "0");
  document.getElementById("timeText").innerText = `${min}:${sec}`;
}

function finishStudySession() {
  const now = new Date();

  studyLogs.push({
    time: now.toLocaleTimeString(),
    duration: 50
  });

  renderLogs();
}

function renderLogs() {
  const list = document.getElementById("logList");
  list.innerHTML = "";

  studyLogs.forEach((log, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}회차 · ${log.duration}분 공부 (${log.time})`;
    list.appendChild(li);
  });
}

function generateShareText() {
  let text = "📚 오늘의 공부 기록\n\n";

  studyLogs.forEach((log, i) => {
    text += `${i + 1}. ${log.duration}분 공부 (${log.time})\n`;
  });

  const total = studyLogs.length * 50;
  text += `\n총 공부 시간: ${total}분`;

  return text;
}

function shareToday() {
  const text = generateShareText();

  if (navigator.share) {
    navigator.share({
      title: "오늘의 공부 기록",
      text: text
    });
  } else {
    alert("이 브라우저에서는 공유 기능이 지원되지 않습니다.");
  }
}

function startInterval() {
  interval = setInterval(() => {
    remainingSeconds--;
    drawProgress();

    if (remainingSeconds <= 0) {
      clearInterval(interval);
      interval = null;
      isPaused = false;
      pauseBtn.innerText = "일시정지";

      if (mode === "study") {
        finishStudySession();
        mode = "break";
        totalSeconds = BREAK_TIME;
        remainingSeconds = totalSeconds;
        alert("50분 공부 완료! 휴식 시작");
      } else {
        mode = "study";
        totalSeconds = STUDY_TIME;
        remainingSeconds = totalSeconds;
        alert("휴식 종료! 다시 공부하세요");
      }

      drawProgress();
    }
  }, 1000);
}
