document.addEventListener("DOMContentLoaded", () => {
  // Daily Affirmation
  const affirmations = [
    "You are stronger than you think.",
    "One day at a time.",
    "Your story matters.",
    "You’ve already survived your worst day.",
    "Recovery is a journey, not a race.",
  ];
  const today = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem("affirmationDate") !== today) {
    const quote = affirmations[Math.floor(Math.random() * affirmations.length)];
    localStorage.setItem("affirmationQuote", quote);
    localStorage.setItem("affirmationDate", today);
  }
  document.getElementById("dailyAffirmation").textContent = localStorage.getItem("affirmationQuote");

  // Mood Logger
  const moodList = document.getElementById("moodList");
  const moodCounts = JSON.parse(localStorage.getItem("moodCounts") || "{}");
  updateMoodList();

  window.logMood = function(emoji) {
    moodCounts[emoji] = (moodCounts[emoji] || 0) + 1;
    localStorage.setItem("moodCounts", JSON.stringify(moodCounts));
    updateMoodList();
  };

  function updateMoodList() {
    moodList.innerHTML = "";
    for (let [mood, count] of Object.entries(moodCounts)) {
      const li = document.createElement("li");
      li.textContent = `${mood} ${count}x`;
      moodList.appendChild(li);
    }
  }

  // Sobriety Streak
  function updateStreakDisplay() {
    const start = localStorage.getItem("sobrietyStart");
    if (start) {
      const days = Math.floor((Date.now() - new Date(start)) / (1000 * 60 * 60 * 24));
      document.querySelector("#sobrietyDays span").textContent = days;
    }
  }

  window.resetStreak = function() {
    if (confirm("Reset your sobriety streak?")) {
      localStorage.setItem("sobrietyStart", new Date().toISOString());
      updateStreakDisplay();
      updateChart();
    }
  };

  if (!localStorage.getItem("sobrietyStart")) {
    localStorage.setItem("sobrietyStart", new Date().toISOString());
  }
  updateStreakDisplay();

  // Chart
  const ctx = document.getElementById('sobrietyChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Today"],
      datasets: [{
        label: 'Sobriety Days',
        data: [0, 1, 2, 3, 4, 5],
        borderColor: '#2d6cdf',
        backgroundColor: '#cbe3ff',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  function updateChart() {
    const streak = parseInt(document.querySelector("#sobrietyDays span").textContent);
    chart.data.datasets[0].data = [0, 1, 2, 3, 4, streak];
    chart.update();
  }

  updateChart();
});
