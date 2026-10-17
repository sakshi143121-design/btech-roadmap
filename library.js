/* =====================================================
   PART 1: NOTES PAGE (subjects, topic checklist, search)
   ===================================================== */

// All the information for the notes page lives in this list.
// To add a subject later, copy one block and change the words.
var subjects = [
  {
    name: "Programming Basics", color: "#2563eb",
    simple: "Telling the computer what to do, step by step. Every other subject builds on this.",
    topics: ["Variables and data types", "Input and output", "If-else conditions", "Loops (for and while)", "Functions", "Arrays and strings", "Pointers (C and C++) and references (C++)", "File handling"],
    practice: "Solve 2 small problems every day, like finding the biggest number or reversing a word.",
    links: [["Python course", "https://www.youtube.com/watch?v=eWRfhZUzrAc"], ["C++ course", "https://www.youtube.com/watch?v=8jLOx1hD3_o"], ["C videos", "https://www.youtube.com/results?search_query=c+programming+full+course+for+beginners"]]
  },
  {
    name: "Data Structures and Algorithms (DSA)", color: "#ca8a04",
    simple: "Smart ways to store data and solve problems fast. Companies use it to test how you think.",
    topics: ["Time and space complexity (Big O)", "Arrays and strings", "Recursion", "Linked lists", "Stacks and queues", "Hashing (maps and sets)", "Trees and binary search trees", "Sorting and searching", "Graphs (BFS and DFS)", "Dynamic programming basics"],
    practice: "Solve 3 to 4 problems every week on LeetCode. Start with easy ones, and always try before looking at the answer.",
    links: [["DSA overview (3 hours)", "https://www.youtube.com/watch?v=zg9ih6SVACc"], ["DSA patterns (1 hour)", "https://www.youtube.com/watch?v=Z_c4byLrNBU"]]
  },
  {
    name: "Object-Oriented Programming (OOP)", color: "#16a34a",
    simple: "Organizing a big program into small parts that you can reuse, like building with blocks.",
    topics: ["Classes and objects", "Constructors", "Encapsulation", "Inheritance", "Polymorphism", "Abstraction", "Exception handling"],
    practice: "Model something from real life in code, like a Bank or a Library, with classes for each part.",
    links: [["OOP videos", "https://www.youtube.com/results?search_query=oop+concepts+for+beginners"]]
  },
  {
    name: "DBMS and SQL", color: "#db2777",
    simple: "Storing and managing data in databases, like the records of all students in a college.",
    topics: ["Tables, rows and keys", "SELECT and WHERE", "JOINs", "GROUP BY and counting", "Normalization", "Transactions (ACID)", "Indexes"],
    practice: "Make a small student database and write 20 different queries on it.",
    links: [["DBMS and SQL videos", "https://www.youtube.com/results?search_query=dbms+and+sql+full+course"]]
  },
  {
    name: "Operating Systems", color: "#7c3aed",
    simple: "How a computer manages its memory, files and running programs.",
    topics: ["Processes and threads", "CPU scheduling", "Deadlock", "Memory management", "Virtual memory", "File systems"],
    practice: "Draw each concept as a diagram, and explain it out loud in your own words.",
    links: [["Operating system videos", "https://www.youtube.com/results?search_query=operating+system+full+course"]]
  },
  {
    name: "Computer Networks", color: "#ea580c",
    simple: "How computers talk to each other. This is how the internet works.",
    topics: ["OSI and TCP/IP layers", "IP addresses and DNS", "HTTP and HTTPS", "TCP and UDP", "Routing basics", "Network security basics"],
    practice: "Open your browser's network tab and watch what happens when you open a website.",
    links: [["Computer network videos", "https://www.youtube.com/results?search_query=computer+networks+full+course"]]
  },
  {
    name: "Web Development", color: "#0d9488",
    simple: "Building websites and web apps that people can open in a browser.",
    topics: ["HTML structure", "CSS layout (flexbox and grid)", "JavaScript basics", "DOM and events", "APIs and fetch", "Git and GitHub", "Publishing a site"],
    practice: "Build one small page every week, then put it on GitHub.",
    links: [["HTML and CSS videos", "https://www.youtube.com/results?search_query=html+css+full+course+for+beginners"], ["JavaScript videos", "https://www.youtube.com/results?search_query=javascript+full+course+for+beginners"]]
  },
  {
    name: "Maths for Computer Science", color: "#dc2626",
    simple: "The logic behind many algorithms. Discrete maths, probability and graph theory are the main parts.",
    topics: ["Sets and logic", "Counting and permutations", "Probability basics", "Graph theory basics", "Matrices", "Modular arithmetic"],
    practice: "After each topic, solve 5 questions by hand, then try to write a small program for one of them.",
    links: [["Discrete maths videos", "https://www.youtube.com/results?search_query=discrete+mathematics+for+computer+science"]]
  }
];

var notesBox = document.getElementById("notes-list");

function loadDone() {
  try { return JSON.parse(localStorage.getItem("doneTopics")) || []; }
  catch (error) { return []; }
}
function saveDone(list) {
  try { localStorage.setItem("doneTopics", JSON.stringify(list)); } catch (error) {}
}

function showNotes() {
  var done = loadDone();
  var html = "";

  for (var i = 0; i < subjects.length; i++) {
    var s = subjects[i];
    html += '<details class="subject" style="--c:' + s.color + '" data-name="' + (s.name + " " + s.topics.join(" ")).toLowerCase() + '">';
    html += '<summary>' + s.name + '<span class="count"></span></summary>';
    html += '<div class="inside">';
    html += '<p><b>In simple words:</b> ' + s.simple + '</p>';
    html += '<p><b>Tick the topics you have finished:</b></p><ul class="topics">';
    for (var j = 0; j < s.topics.length; j++) {
      var id = i + "-" + j;
      var checked = done.indexOf(id) !== -1 ? " checked" : "";
      html += '<li><label><input type="checkbox" value="' + id + '"' + checked + '>' + s.topics[j] + '</label></li>';
    }
    html += '</ul><p><b>How to practice:</b> ' + s.practice + '</p>';
    for (var k = 0; k < s.links.length; k++) {
      html += '<a class="watch" href="' + s.links[k][1] + '" target="_blank" rel="noopener">' + s.links[k][0] + '</a>';
    }
    html += '</div></details>';
  }
  notesBox.innerHTML = html;
  updateProgress();

  // When a box is ticked or unticked, save it and update the progress
  notesBox.addEventListener("change", function () {
    var ticked = [];
    var boxes = notesBox.querySelectorAll("input[type=checkbox]");
    for (var n = 0; n < boxes.length; n++) {
      if (boxes[n].checked) { ticked.push(boxes[n].value); }
    }
    saveDone(ticked);
    updateProgress();
  });
}

function updateProgress() {
  var boxes = notesBox.querySelectorAll("input[type=checkbox]");
  var total = boxes.length;
  var finished = 0;
  for (var a = 0; a < boxes.length; a++) {
    if (boxes[a].checked) { finished++; }
  }
  var percent = total === 0 ? 0 : Math.round((finished / total) * 100);
  document.getElementById("progress-fill").style.width = percent + "%";
  document.getElementById("progress-text").textContent = "You have finished " + finished + " of " + total + " topics (" + percent + "%)";

  // Show 3/8 next to each subject name
  var cards = notesBox.querySelectorAll(".subject");
  for (var b = 0; b < cards.length; b++) {
    var all = cards[b].querySelectorAll("input[type=checkbox]");
    var tickedHere = cards[b].querySelectorAll("input[type=checkbox]:checked");
    cards[b].querySelector(".count").textContent = tickedHere.length + "/" + all.length;
  }
}

if (notesBox) {
  showNotes();
  document.getElementById("search").addEventListener("input", function () {
    var text = this.value.toLowerCase();
    var cards = notesBox.querySelectorAll(".subject");
    for (var c = 0; c < cards.length; c++) {
      var match = cards[c].getAttribute("data-name").indexOf(text) !== -1;
      cards[c].style.display = match ? "" : "none";
    }
  });
}

/* =====================================================
   PART 2: VIDEO LIBRARY (filter buttons and search)
   ===================================================== */

// Each video: [title, subject, language, type, link]
// "video" = a direct YouTube video link. "page" = a course page. "search" = a YouTube search.
var videos = [
  ["Python full course (5 hours)", "Programming", "English", "video", "https://www.youtube.com/watch?v=eWRfhZUzrAc"],
  ["C++ full course (31 hours)", "Programming", "English", "video", "https://www.youtube.com/watch?v=8jLOx1hD3_o"],
  ["C++ full course by Bro Code (6 hours)", "Programming", "English", "page", "https://www.classcentral.com/course/youtube-c-full-course-for-beginners-107923"],
  ["Python for beginners in Hindi", "Programming", "Hindi", "search", "https://www.youtube.com/results?search_query=python+full+course+for+beginners+hindi"],
  ["C for beginners", "Programming", "English", "search", "https://www.youtube.com/results?search_query=c+programming+full+course+for+beginners"],
  ["C for beginners in Hindi", "Programming", "Hindi", "search", "https://www.youtube.com/results?search_query=c+programming+full+course+hindi"],
  ["C++ for beginners in Hindi", "Programming", "Hindi", "search", "https://www.youtube.com/results?search_query=c%2B%2B+full+course+hindi"],
  ["Java for beginners", "Programming", "English", "search", "https://www.youtube.com/results?search_query=java+full+course+for+beginners"],
  ["Java for beginners in Hindi", "Programming", "Hindi", "search", "https://www.youtube.com/results?search_query=java+full+course+hindi"],

  ["Data structures overview (3 hours)", "DSA", "English", "video", "https://www.youtube.com/watch?v=zg9ih6SVACc"],
  ["DSA in Python (13 hours)", "DSA", "English", "video", "https://www.youtube.com/watch?v=pkYVOmU3MgA"],
  ["Data structures with animations (8 hours, code in Java)", "DSA", "English", "video", "https://www.youtube.com/watch?v=RBSGKlAvoiM"],
  ["DSA patterns for interviews (1 hour)", "DSA", "English", "video", "https://www.youtube.com/watch?v=Z_c4byLrNBU"],
  ["DSA in Hindi", "DSA", "Hindi", "search", "https://www.youtube.com/results?search_query=data+structures+and+algorithms+hindi+playlist"],

  ["HTML and CSS for beginners", "Web", "English", "search", "https://www.youtube.com/results?search_query=html+css+full+course+for+beginners"],
  ["JavaScript for beginners", "Web", "English", "search", "https://www.youtube.com/results?search_query=javascript+full+course+for+beginners"],
  ["JavaScript in Hindi", "Web", "Hindi", "search", "https://www.youtube.com/results?search_query=javascript+full+course+hindi"],
  ["Git and GitHub for beginners", "Web", "English", "search", "https://www.youtube.com/results?search_query=git+and+github+for+beginners"],

  ["OOP concepts", "Core subjects", "English", "search", "https://www.youtube.com/results?search_query=oop+concepts+for+beginners"],
  ["DBMS and SQL", "Core subjects", "English", "search", "https://www.youtube.com/results?search_query=dbms+and+sql+full+course"],
  ["Operating systems", "Core subjects", "English", "search", "https://www.youtube.com/results?search_query=operating+system+full+course"],
  ["Computer networks", "Core subjects", "English", "search", "https://www.youtube.com/results?search_query=computer+networks+full+course"],
  ["Discrete maths for computer science", "Core subjects", "English", "search", "https://www.youtube.com/results?search_query=discrete+mathematics+for+computer+science"],

  ["Resume for freshers", "Career", "English", "search", "https://www.youtube.com/results?search_query=how+to+make+a+resume+for+freshers+software"],
  ["Mock interviews", "Career", "English", "search", "https://www.youtube.com/results?search_query=mock+interview+software+engineer+fresher"],
  ["How to get your first internship", "Career", "English", "search", "https://www.youtube.com/results?search_query=how+to+get+first+internship+college+student"],
  ["LinkedIn profile for students", "Career", "English", "search", "https://www.youtube.com/results?search_query=linkedin+profile+tips+for+students"]
];

var colors = { "Programming": "#2563eb", "DSA": "#ca8a04", "Web": "#0d9488", "Core subjects": "#7c3aed", "Career": "#db2777" };
var videoBox = document.getElementById("video-list");
var chosenSubject = "All";

function showVideos() {
  var text = document.getElementById("search").value.toLowerCase();
  var html = "";
  for (var i = 0; i < videos.length; i++) {
    var v = videos[i];
    var rightSubject = chosenSubject === "All" || v[1] === chosenSubject;
    var rightText = (v[0] + " " + v[1] + " " + v[2]).toLowerCase().indexOf(text) !== -1;
    if (rightSubject && rightText) {
      var label = v[3] === "video" ? "YouTube video" : (v[3] === "page" ? "Course page" : "YouTube search");
      html += '<a class="video" style="--c:' + colors[v[1]] + '" href="' + v[4] + '" target="_blank" rel="noopener">';
      html += '<strong>' + v[0] + '</strong><span>' + v[1] + ' | ' + v[2] + ' | ' + label + '</span></a>';
    }
  }
  videoBox.innerHTML = html || "<p>No videos found. Try another word.</p>";
}

if (videoBox) {
  showVideos();
  document.getElementById("search").addEventListener("input", showVideos);

  var chips = document.querySelectorAll(".chip");
  for (var c = 0; c < chips.length; c++) {
    chips[c].addEventListener("click", function () {
      for (var d = 0; d < chips.length; d++) { chips[d].classList.remove("active"); }
      this.classList.add("active");
      chosenSubject = this.getAttribute("data-subject");
      showVideos();
    });
  }
}