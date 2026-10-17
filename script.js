/* Tell the style file that JavaScript is working */
document.documentElement.classList.add("js");

/* =====================================================
   PART 1: Dark mode button (works on every page)
   ===================================================== */
var button = document.createElement("button");
button.className = "theme-button";
document.body.appendChild(button);

function showButtonText() {
  var isDark = document.body.classList.contains("dark");
  button.textContent = isDark ? "Light mode" : "Dark mode";
  button.setAttribute("aria-pressed", isDark);
}

try {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
} catch (error) {}
showButtonText();

button.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  var isDark = document.body.classList.contains("dark");
  try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (error) {}
  showButtonText();
});

/* =====================================================
   PART 2: Top menu (highlight this page, phone menu button)
   ===================================================== */
var menuLinks = document.querySelectorAll("nav .menu a");
var thisPage = location.pathname.split("/").pop() || "index.html";
for (var m = 0; m < menuLinks.length; m++) {
  var linkPage = menuLinks[m].getAttribute("href").split("#")[0];
  if (linkPage === thisPage && !menuLinks[m].classList.contains("nav-cta")) {
    menuLinks[m].classList.add("active");
  }
}

var menuButton = document.querySelector(".menu-toggle");
var menuBox = document.querySelector("nav .menu");
if (menuButton && menuBox) {
  menuButton.addEventListener("click", function () {
    var open = menuBox.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", open);
  });
}

/* The "More" drop-down in the menu */
var dropdown = document.querySelector(".dropdown");
if (dropdown) {
  var dropButton = dropdown.querySelector(".drop-btn");
  if (dropdown.querySelector("a.active")) { dropdown.classList.add("active"); }

  function closeDropdown() {
    dropdown.classList.remove("open");
    dropButton.setAttribute("aria-expanded", false);
  }
  dropButton.addEventListener("click", function (event) {
    event.stopPropagation();
    var isOpen = dropdown.classList.toggle("open");
    dropButton.setAttribute("aria-expanded", isOpen);
  });
  document.addEventListener("click", closeDropdown);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") { closeDropdown(); }
  });
}

/* =====================================================
   PART 3: Intro animation (home page only)
   ===================================================== */
var intro = document.getElementById("intro");
var noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var introSeen = document.documentElement.classList.contains("no-intro");

function startPage() {
  document.body.classList.add("ready");
}

function closeIntro() {
  intro.classList.add("done");                 // slides up
  document.body.classList.remove("intro-open");
  try { sessionStorage.setItem("introSeen", "yes"); } catch (error) {}
  startPage();
  setTimeout(function () { intro.style.display = "none"; }, 1000);
}

if (intro && !introSeen && !noMotion) {
  document.body.classList.add("intro-open");
  var timer = setTimeout(closeIntro, 3800);    // closes by itself after the animation
  intro.addEventListener("click", function () {
    clearTimeout(timer);
    closeIntro();
  });
} else {
  startPage();
}

/* =====================================================
   PART 4: Typing effect on the home page
   ===================================================== */
var words = ["C++", "Python", "DSA", "Web Development", "Projects", "Internships"];
var typed = document.getElementById("typed");
var wordIndex = 0;
var letter = 0;
var deleting = false;

function type() {
  var word = words[wordIndex];
  letter = deleting ? letter - 1 : letter + 1;
  typed.textContent = word.substring(0, letter);

  var delay = deleting ? 50 : 110;
  if (!deleting && letter === word.length) {
    deleting = true;
    delay = 1200;
  } else if (deleting && letter === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 300;
  }
  setTimeout(type, delay);
}

if (typed && !noMotion) {
  type();
}

/* =====================================================
   PART 5: Slide-in animation when you scroll
   ===================================================== */
var items = document.querySelectorAll(".reveal");

function showItem(item) { item.classList.add("show"); }

if ("IntersectionObserver" in window && !noMotion) {
  var watcher = new IntersectionObserver(function (entries) {
    for (var e = 0; e < entries.length; e++) {
      if (entries[e].isIntersecting) {
        showItem(entries[e].target);
        watcher.unobserve(entries[e].target);
      }
    }
  }, { threshold: 0.15 });
  for (var r = 0; r < items.length; r++) { watcher.observe(items[r]); }
} else {
  for (var s = 0; s < items.length; s++) { showItem(items[s]); }
}

/* =====================================================
   PART 6: Number counters and share button (About page)
   ===================================================== */
var counters = document.querySelectorAll(".count-up");

function countUp(box) {
  var target = parseInt(box.getAttribute("data-target"), 10);
  var plus = box.getAttribute("data-plus") ? "+" : "";
  var now = 0;
  var step = Math.max(1, Math.ceil(target / 40));
  var counting = setInterval(function () {
    now = now + step;
    if (now >= target) { now = target; clearInterval(counting); }
    box.textContent = now + plus;
  }, 40);
}

if (counters.length > 0 && "IntersectionObserver" in window && !noMotion) {
  var counterWatcher = new IntersectionObserver(function (entries) {
    for (var q = 0; q < entries.length; q++) {
      if (entries[q].isIntersecting) {
        countUp(entries[q].target);
        counterWatcher.unobserve(entries[q].target);
      }
    }
  }, { threshold: 0.5 });
  for (var u = 0; u < counters.length; u++) {
    counters[u].textContent = "0";
    counterWatcher.observe(counters[u]);
  }
}

var shareButton = document.getElementById("share");
if (shareButton) {
  var shareLabel = shareButton.textContent;

  function resetShareButton() {
    setTimeout(function () { shareButton.textContent = shareLabel; }, 3000);
  }

  shareButton.addEventListener("click", function () {
    var home = location.href.split("about.html")[0];

    // A website opened from your own computer has no real web link yet
    if (location.protocol === "file:") {
      shareButton.textContent = "Works after your site is live";
      resetShareButton();
      return;
    }
    if (navigator.share) {
      navigator.share({ title: "B.Tech Roadmap", text: "A free B.Tech guide made by a student, for students.", url: home });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(home).then(function () {
        shareButton.textContent = "Link copied!";
        resetShareButton();
      }, function () { window.prompt("Copy this link:", home); });
    } else {
      window.prompt("Copy this link:", home);
    }
  });
}

/* =====================================================
   PART 7: Badges you can unlock (About page)
   ===================================================== */
var badgeButtons = document.querySelectorAll(".badge");
var badgeText = document.getElementById("badge-text");

function savedBadges() {
  try { return JSON.parse(localStorage.getItem("badges")) || []; }
  catch (error) { return []; }
}

function updateBadgeText() {
  var count = document.querySelectorAll(".badge.unlocked").length;
  var total = badgeButtons.length;
  if (count === total) {
    badgeText.textContent = "All " + total + " badges unlocked! You are job-ready. Go and shine!";
  } else {
    badgeText.textContent = count + " of " + total + " badges unlocked. Tap a badge when you earn it.";
  }
}

if (badgeButtons.length > 0 && badgeText) {
  var earned = savedBadges();
  for (var badgeNumber = 0; badgeNumber < badgeButtons.length; badgeNumber++) {
    if (earned.indexOf(badgeButtons[badgeNumber].getAttribute("data-id")) !== -1) {
      badgeButtons[badgeNumber].classList.add("unlocked");
      badgeButtons[badgeNumber].setAttribute("aria-pressed", "true");
    }
    badgeButtons[badgeNumber].addEventListener("click", function () {
      this.classList.toggle("unlocked");
      this.setAttribute("aria-pressed", this.classList.contains("unlocked"));
      var ids = [];
      var unlockedBadges = document.querySelectorAll(".badge.unlocked");
      for (var w = 0; w < unlockedBadges.length; w++) { ids.push(unlockedBadges[w].getAttribute("data-id")); }
      try { localStorage.setItem("badges", JSON.stringify(ids)); } catch (error) {}
      updateBadgeText();
    });
  }
  updateBadgeText();
}

/* =====================================================
   PART 8: Friendly cartoon helper on the top of each page
   ===================================================== */
var props = {
  book: '<rect x="148" y="134" width="42" height="30" rx="3" fill="#2563eb" stroke="#14213d" stroke-width="3"/><line x1="169" y1="134" x2="169" y2="164" stroke="#fff" stroke-width="3"/>',
  signpost: '<line x1="172" y1="118" x2="172" y2="176" stroke="#14213d" stroke-width="4"/><g class="swing"><polygon points="172,122 200,128 172,136" fill="#ffc933" stroke="#14213d" stroke-width="2"/></g><polygon points="172,142 146,148 172,156" fill="#2563eb" stroke="#14213d" stroke-width="2"/>',
  notebook: '<rect x="150" y="128" width="36" height="44" rx="4" fill="#fff" stroke="#14213d" stroke-width="3"/><path class="tick" d="M157 141 l4 4 l8 -8 M157 158 l4 4 l8 -8" stroke="#16a34a" stroke-width="3" fill="none" stroke-linecap="round"/>',
  play: '<rect x="146" y="130" width="48" height="36" rx="6" fill="#14213d"/><polygon class="pulse2" points="163,139 163,157 178,148" fill="#ffc933"/>',
  blocks: '<rect x="150" y="148" width="22" height="22" fill="#2563eb" stroke="#14213d" stroke-width="3"/><rect x="172" y="148" width="22" height="22" fill="#db2777" stroke="#14213d" stroke-width="3"/><rect class="dropin" x="161" y="126" width="22" height="22" fill="#16a34a" stroke="#14213d" stroke-width="3"/>',
  briefcase: '<path d="M160 142 v-9 h22 v9" stroke="#14213d" stroke-width="3" fill="none"/><rect x="148" y="142" width="46" height="30" rx="5" fill="#7c3aed" stroke="#14213d" stroke-width="3"/><rect x="167" y="151" width="8" height="8" fill="#ffc933" stroke="#14213d" stroke-width="2"/>',
  toolbox: '<g class="spin"><circle cx="171" cy="122" r="8" fill="#ffc933" stroke="#14213d" stroke-width="3"/><circle cx="171" cy="122" r="3" fill="#14213d"/><path d="M171 107v6M171 131v6M156 122h6M180 122h6" stroke="#14213d" stroke-width="4" stroke-linecap="round"/></g><path d="M160 150 v-8 h22 v8" stroke="#14213d" stroke-width="3" fill="none"/><rect x="148" y="150" width="46" height="26" rx="4" fill="#ea580c" stroke="#14213d" stroke-width="3"/><rect x="167" y="158" width="8" height="8" fill="#ffc933" stroke="#14213d" stroke-width="2"/>',
  question: '<polygon points="158,160 154,176 172,162" fill="#fff" stroke="#14213d" stroke-width="3" stroke-linejoin="round"/><rect x="146" y="126" width="50" height="38" rx="9" fill="#fff" stroke="#14213d" stroke-width="3"/><text class="pulse2" x="171" y="156" text-anchor="middle" font-size="26" font-weight="700" fill="#2563eb" font-family="Space Grotesk, sans-serif">?</text>'
};

function buildMascot(prop, message) {
  var svg = '<svg viewBox="0 0 210 200" aria-hidden="true"><g class="bob">' +
    '<ellipse cx="100" cy="186" rx="48" ry="7" fill="#14213d" opacity=".15"/>' +
    '<ellipse cx="82" cy="178" rx="13" ry="7" fill="#14213d"/><ellipse cx="118" cy="178" rx="13" ry="7" fill="#14213d"/>' +
    '<ellipse cx="100" cy="122" rx="50" ry="55" fill="#ffc933" stroke="#14213d" stroke-width="4"/>' +
    '<g class="arm"><path d="M52 128 Q28 122 26 98" stroke="#14213d" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="26" cy="95" r="8" fill="#ffc933" stroke="#14213d" stroke-width="3"/></g>' +
    '<path d="M148 128 Q160 138 162 150" stroke="#14213d" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<circle class="eye" cx="82" cy="110" r="7" fill="#14213d"/><circle class="eye" cx="118" cy="110" r="7" fill="#14213d"/>' +
    '<circle cx="68" cy="126" r="6" fill="#ff8fa3" opacity=".7"/><circle cx="132" cy="126" r="6" fill="#ff8fa3" opacity=".7"/>' +
    '<path d="M85 130 Q100 148 115 130" stroke="#14213d" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<path d="M48 76 L100 54 L152 76 L100 96 Z" fill="#14213d"/><path d="M76 86 L76 100 Q100 110 124 100 L124 86" fill="#2a3a63"/>' +
    '<line x1="152" y1="76" x2="152" y2="98" stroke="#ffc933" stroke-width="3"/><circle cx="152" cy="100" r="5" fill="#ffc933"/>' +
    (props[prop] || "") + '</g></svg>';

  var box = document.createElement("div");
  box.className = "mascot";
  box.innerHTML = '<p class="bubble">' + message + '</p>' + svg;
  return box;
}

var heroes = document.querySelectorAll(".hero[data-prop]");
for (var h = 0; h < heroes.length; h++) {
  var hero = heroes[h];
  var textBox = document.createElement("div");
  textBox.className = "hero-text";
  while (hero.firstChild) { textBox.appendChild(hero.firstChild); }
  hero.appendChild(textBox);
  hero.appendChild(buildMascot(hero.getAttribute("data-prop"), hero.getAttribute("data-message")));
  hero.classList.add("has-mascot");
}