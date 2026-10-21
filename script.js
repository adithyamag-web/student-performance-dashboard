/**
 * ==========================================================================
 * Smart Student Performance Analytics Dashboard - Controller
 * B.Tech IT Mini Project - Complete Interactive Application
 * ==========================================================================
 */

// Global App State
const AppState = {
    students: [],
    goals: {},
    settings: {
        collegeName: "Department of Information Technology",
        minAttendance: 75,
        passMarks: 50
    },
    activeView: "dashboard",
    charts: {},
    pendingDeleteRoll: null,
    pendingImportData: null,
    editingStudentRoll: null
};

// LocalStorage Keys
const STORAGE_KEYS = {
    STUDENTS: "smart_student_records_v3",
    GOALS: "smart_student_goals_v3",
    SETTINGS: "smart_student_settings_v3",
    THEME: "smart_student_theme_v3"
};

// 25 Realistic Sample Students (B.Tech Information Technology)
const DEFAULT_STUDENTS = [
    { roll: "21IT001", name: "Aarav Patel", dept: "Information Technology", sem: "Sem 5", ds: 95, dbms: 92, wt: 96, os: 91, cn: 94, attendance: 96 },
    { roll: "21IT002", name: "Ananya Sharma", dept: "Information Technology", sem: "Sem 5", ds: 92, dbms: 89, wt: 94, os: 90, cn: 91, attendance: 94 },
    { roll: "21IT003", name: "Rohan Iyer", dept: "Information Technology", sem: "Sem 5", ds: 88, dbms: 91, wt: 86, os: 89, cn: 92, attendance: 91 },
    { roll: "21IT004", name: "Priya Nair", dept: "Information Technology", sem: "Sem 5", ds: 84, dbms: 86, wt: 88, os: 82, cn: 85, attendance: 88 },
    { roll: "21IT005", name: "Aditya Verma", dept: "Information Technology", sem: "Sem 5", ds: 78, dbms: 82, wt: 80, os: 76, cn: 84, attendance: 85 },
    { roll: "21IT006", name: "Sneha Kulkarni", dept: "Information Technology", sem: "Sem 5", ds: 89, dbms: 87, wt: 91, os: 85, cn: 88, attendance: 93 },
    { roll: "21IT007", name: "Vikram Singh", dept: "Information Technology", sem: "Sem 5", ds: 62, dbms: 68, wt: 70, os: 58, cn: 64, attendance: 72 }, // Shortage
    { roll: "21IT008", name: "Divya Ramesh", dept: "Information Technology", sem: "Sem 5", ds: 91, dbms: 94, wt: 93, os: 88, cn: 90, attendance: 95 },
    { roll: "21IT009", name: "Karthik Sundaram", dept: "Information Technology", sem: "Sem 5", ds: 72, dbms: 75, wt: 68, os: 70, cn: 74, attendance: 82 },
    { roll: "21IT010", name: "Meera Joshi", dept: "Information Technology", sem: "Sem 5", ds: 80, dbms: 84, wt: 82, os: 79, cn: 81, attendance: 89 },
    { roll: "21IT011", name: "Arjun Gupta", dept: "Information Technology", sem: "Sem 5", ds: 45, dbms: 52, wt: 48, os: 42, cn: 46, attendance: 68 }, // Fail & Shortage
    { roll: "21IT012", name: "Pooja Hegde", dept: "Information Technology", sem: "Sem 5", ds: 76, dbms: 79, wt: 81, os: 74, cn: 77, attendance: 86 },
    { roll: "21IT013", name: "Siddharth Rao", dept: "Information Technology", sem: "Sem 5", ds: 85, dbms: 88, wt: 87, os: 83, cn: 86, attendance: 90 },
    { roll: "21IT014", name: "Neha Deshmukh", dept: "Information Technology", sem: "Sem 5", ds: 67, dbms: 70, wt: 72, os: 65, cn: 69, attendance: 80 },
    { roll: "21IT015", name: "Rahul Pillai", dept: "Information Technology", sem: "Sem 5", ds: 54, dbms: 58, wt: 60, os: 52, cn: 56, attendance: 71 }, // Shortage
    { roll: "21IT016", name: "Swati Mukherjee", dept: "Information Technology", sem: "Sem 5", ds: 93, dbms: 95, wt: 92, os: 91, cn: 94, attendance: 97 },
    { roll: "21IT017", name: "Varun Chawla", dept: "Information Technology", sem: "Sem 5", ds: 70, dbms: 74, wt: 71, os: 68, cn: 73, attendance: 84 },
    { roll: "21IT018", name: "Tanvi Bhatt", dept: "Information Technology", sem: "Sem 5", ds: 83, dbms: 85, wt: 86, os: 80, cn: 82, attendance: 87 },
    { roll: "21IT019", name: "Nikhil Menon", dept: "Information Technology", sem: "Sem 5", ds: 42, dbms: 45, wt: 40, os: 38, cn: 44, attendance: 65 }, // Fail & Shortage
    { roll: "21IT020", name: "Riya Kapoor", dept: "Information Technology", sem: "Sem 5", ds: 79, dbms: 81, wt: 83, os: 77, cn: 80, attendance: 88 },
    { roll: "21IT021", name: "Harsh Vardhan", dept: "Information Technology", sem: "Sem 5", ds: 87, dbms: 90, wt: 89, os: 84, cn: 88, attendance: 92 },
    { roll: "21IT022", name: "Kavya Nambiar", dept: "Information Technology", sem: "Sem 5", ds: 94, dbms: 93, wt: 95, os: 89, cn: 92, attendance: 96 },
    { roll: "21IT023", name: "Sai Teja", dept: "Information Technology", sem: "Sem 5", ds: 64, dbms: 66, wt: 69, os: 61, cn: 65, attendance: 78 },
    { roll: "21IT024", name: "Shalini Reddy", dept: "Information Technology", sem: "Sem 5", ds: 81, dbms: 83, wt: 85, os: 78, cn: 82, attendance: 90 },
    { roll: "21IT025", name: "Manoj Kumar", dept: "Information Technology", sem: "Sem 5", ds: 48, dbms: 50, wt: 46, os: 44, cn: 49, attendance: 74 } // Critical
];

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

/**
 * Main Initialization
 */
function initApp() {
    loadSettings();
    loadStudents();
    loadGoals();
    setupTheme();
    setupNavigation();
    setupGlobalSearch();
    setupStudentManagementEvents();
    setupCSVImportExportEvents();
    setupGoalTrackerEvents();
    setupSettingsEvents();
    setupCertificateEvents();

    // Render Initial View
    renderDashboard();
    renderStudentsTable();
    renderInsights();
    renderGoals();
    renderTopPerformers();
    renderAttendanceRegister();
    renderSettings();
}

/**
 * -------------------------------------------------------------------------
 * Data Calculations & Formatting Helpers
 * -------------------------------------------------------------------------
 */
function enrichStudentData(student) {
    const ds = Number(student.ds) || 0;
    const dbms = Number(student.dbms) || 0;
    const wt = Number(student.wt) || 0;
    const os = Number(student.os) || 0;
    const cn = Number(student.cn) || 0;
    const attendance = Number(student.attendance) || 0;

    const total = ds + dbms + wt + os + cn;
    const percentage = Number(((total / 500) * 100).toFixed(1));

    let grade = "F";
    let status = "Critical";

    if (percentage >= 90) {
        grade = "A+";
        status = "Outstanding";
    } else if (percentage >= 80) {
        grade = "A";
        status = "Outstanding";
    } else if (percentage >= 70) {
        grade = "B";
        status = "Good";
    } else if (percentage >= 50) {
        grade = "C";
        status = "Needs Improvement";
    } else {
        grade = "F";
        status = "Critical";
    }

    return {
        ...student,
        ds, dbms, wt, os, cn,
        total,
        percentage,
        grade,
        attendance,
        status
    };
}

function saveStudents() {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(AppState.students));
    updateAllViews();
}

function loadStudents() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                AppState.students = parsed.map(enrichStudentData);
                return;
            }
        }
    } catch (e) {
        console.error("Failed to load students from LocalStorage:", e);
    }
    // Default seed
    AppState.students = DEFAULT_STUDENTS.map(enrichStudentData);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(AppState.students));
}

function loadGoals() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
        if (raw) {
            AppState.goals = JSON.parse(raw);
        } else {
            // Seed a few demo goals
            AppState.goals = {
                "21IT005": 88,
                "21IT007": 75,
                "21IT011": 60
            };
        }
    } catch (e) {
        AppState.goals = {};
    }
}

function saveGoals() {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(AppState.goals));
}

function loadSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (raw) {
            AppState.settings = { ...AppState.settings, ...JSON.parse(raw) };
        }
    } catch (e) {}
}

function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(AppState.settings));
}

/**
 * -------------------------------------------------------------------------
 * Theme Management (Light / Dark)
 * -------------------------------------------------------------------------
 */
function setupTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "light";
    const body = document.body;
    const themeBtn = document.getElementById("themeToggleBtn");
    const themeIcon = document.getElementById("themeIcon");

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        themeIcon.className = "fa-solid fa-sun";
    } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        themeIcon.className = "fa-solid fa-moon";
    }

    themeBtn.addEventListener("click", () => {
        const isDark = body.classList.toggle("dark-mode");
        body.classList.toggle("light-mode", !isDark);
        themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        localStorage.setItem(STORAGE_KEYS.THEME, isDark ? "dark" : "light");
        
        // Re-render charts with correct color contrast
        renderDashboardCharts();
        renderAnalyticsCharts();
    });
}

/**
 * -------------------------------------------------------------------------
 * Navigation Controller
 * -------------------------------------------------------------------------
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link, [data-view]");
    const sidebar = document.getElementById("sidebar");
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const mobileSidebarClose = document.getElementById("mobileSidebarClose");
    const pageTitle = document.getElementById("currentSectionTitle");

    const titles = {
        "dashboard": "Dashboard Overview",
        "students": "Student Management Directory",
        "analytics": "Academic Performance Analytics",
        "insights": "Smart Rule-Based Student Insights",
        "goals": "Academic Target Goal Tracker",
        "top-performers": "Top Performers & Academic Honors",
        "attendance": "Attendance Register & Compliance",
        "settings": "System Settings & Data Storage"
    };

    function switchView(viewName) {
        if (!viewName) return;
        AppState.activeView = viewName;

        // Toggle sections
        document.querySelectorAll(".dashboard-view").forEach(view => {
            view.classList.remove("active-view");
        });
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) targetView.classList.add("active-view");

        // Toggle sidebar links
        document.querySelectorAll(".sidebar-nav .nav-link").forEach(link => {
            link.classList.toggle("active", link.dataset.view === viewName);
        });

        // Update header title
        if (pageTitle && titles[viewName]) {
            pageTitle.textContent = titles[viewName];
        }

        // Close mobile sidebar if open
        if (sidebar) sidebar.classList.remove("sidebar-open");

        // View specific refresh
        if (viewName === "dashboard") renderDashboard();
        if (viewName === "students") renderStudentsTable();
        if (viewName === "analytics") renderAnalytics();
        if (viewName === "insights") renderInsights();
        if (viewName === "goals") renderGoals();
        if (viewName === "top-performers") renderTopPerformers();
        if (viewName === "attendance") renderAttendanceRegister();
        if (viewName === "settings") renderSettings();
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const view = link.dataset.view;
            if (view) switchView(view);
        });
    });

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", () => {
            sidebar.classList.add("sidebar-open");
        });
    }

    if (mobileSidebarClose) {
        mobileSidebarClose.addEventListener("click", () => {
            sidebar.classList.remove("sidebar-open");
        });
    }

    // Hero buttons
    const heroAddStudentBtn = document.getElementById("heroAddStudentBtn");
    const heroViewInsightsBtn = document.getElementById("heroViewInsightsBtn");
    if (heroAddStudentBtn) {
        heroAddStudentBtn.addEventListener("click", () => {
            switchView("students");
            toggleAddStudentForm(true);
        });
    }
    if (heroViewInsightsBtn) {
        heroViewInsightsBtn.addEventListener("click", () => switchView("insights"));
    }

    // Header buttons
    const quickAddBtn = document.getElementById("quickAddStudentBtn");
    if (quickAddBtn) {
        quickAddBtn.addEventListener("click", () => {
            switchView("students");
            toggleAddStudentForm(true);
        });
    }
}

/**
 * -------------------------------------------------------------------------
 * Update All Views Trigger
 * -------------------------------------------------------------------------
 */
function updateAllViews() {
    renderDashboard();
    renderStudentsTable();
    renderAnalytics();
    renderInsights();
    renderGoals();
    renderTopPerformers();
    renderAttendanceRegister();
    renderSettings();
}

/**
 * -------------------------------------------------------------------------
 * VIEW 1: Dashboard Renderer
 * -------------------------------------------------------------------------
 */
function renderDashboard() {
    const students = AppState.students;
    const totalCount = students.length;

    // Elements
    const kpiTotal = document.getElementById("kpiTotalStudents");
    const kpiAvg = document.getElementById("kpiAverageMarks");
    const kpiAtt = document.getElementById("kpiAttendanceRate");
    const kpiTop = document.getElementById("kpiTopPerformer");
    const kpiTopScore = document.getElementById("kpiTopScore");

    if (totalCount === 0) {
        if (kpiTotal) kpiTotal.textContent = "0";
        if (kpiAvg) kpiAvg.textContent = "0.0%";
        if (kpiAtt) kpiAtt.textContent = "0.0%";
        if (kpiTop) kpiTop.textContent = "None";
        if (kpiTopScore) kpiTopScore.innerHTML = `<i class="fa-solid fa-medal text-warning"></i> Highest Scorer: 0%`;
        renderQuickTopList([]);
        renderQuickAttentionList([]);
        renderAttendanceHealth(0, 0);
        renderDashboardCharts();
        return;
    }

    // Calculations
    const avgPercentage = (students.reduce((sum, s) => sum + s.percentage, 0) / totalCount).toFixed(1);
    const avgAttendance = (students.reduce((sum, s) => sum + s.attendance, 0) / totalCount).toFixed(1);

    // Top Student
    const sortedByScore = [...students].sort((a, b) => b.percentage - a.percentage);
    const topStudent = sortedByScore[0];

    if (kpiTotal) kpiTotal.textContent = totalCount;
    if (kpiAvg) kpiAvg.textContent = `${avgPercentage}%`;
    if (kpiAtt) kpiAtt.textContent = `${avgAttendance}%`;
    if (kpiTop) kpiTop.textContent = topStudent.name;
    if (kpiTopScore) {
        kpiTopScore.innerHTML = `<i class="fa-solid fa-medal text-warning"></i> Score: <strong>${topStudent.percentage}%</strong> (${topStudent.roll})`;
    }

    // Top 3 Mini Leaderboard
    renderQuickTopList(sortedByScore.slice(0, 3));

    // Intervention Attention list
    const criticalList = students.filter(s => s.percentage < 50 || s.attendance < AppState.settings.minAttendance);
    renderQuickAttentionList(criticalList.slice(0, 4));

    // Attendance Health Circle
    const eligibleCount = students.filter(s => s.attendance >= AppState.settings.minAttendance).length;
    renderAttendanceHealth(eligibleCount, totalCount);

    // Render Charts
    renderDashboardCharts();
}

function renderQuickTopList(top3) {
    const container = document.getElementById("quickTopList");
    if (!container) return;
    if (top3.length === 0) {
        container.innerHTML = `<div class="p-3 text-center text-muted" style="padding: 1.5rem;">No student records found</div>`;
        return;
    }

    const rankClasses = ["rank-1", "rank-2", "rank-3"];
    container.innerHTML = top3.map((student, idx) => `
        <div class="quick-top-item" onclick="openStudentDetails('${student.roll}')" style="cursor: pointer;">
            <div class="user-snippet">
                <span class="rank-badge ${rankClasses[idx] || 'rank-3'}">#${idx + 1}</span>
                <div class="snippet-meta">
                    <strong>${escapeHtml(student.name)}</strong>
                    <span>${student.roll} • ${student.dept}</span>
                </div>
            </div>
            <div class="score-badge">${student.percentage}%</div>
        </div>
    `).join("");
}

function renderQuickAttentionList(list) {
    const container = document.getElementById("quickAttentionList");
    if (!container) return;
    if (list.length === 0) {
        container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--success); font-weight: 600;">
            <i class="fa-solid fa-circle-check"></i> All students meeting standard academic &amp; attendance criteria!
        </div>`;
        return;
    }

    container.innerHTML = list.map(student => {
        const isAttShortage = student.attendance < AppState.settings.minAttendance;
        const isScoreRisk = student.percentage < 50;
        let badgeType = isScoreRisk ? "score-fail" : "att-shortage";
        let icon = isScoreRisk ? "fa-solid fa-triangle-exclamation" : "fa-solid fa-user-xmark";
        let reason = isScoreRisk ? `Scoring ${student.percentage}%` : `Attendance ${student.attendance}%`;

        return `
            <div class="attention-item" onclick="openStudentDetails('${student.roll}')" style="cursor: pointer;">
                <div class="user-snippet">
                    <div class="attention-icon ${badgeType}"><i class="${icon}"></i></div>
                    <div class="snippet-meta">
                        <strong>${escapeHtml(student.name)}</strong>
                        <span class="text-danger">${student.roll} • ${reason}</span>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline"><i class="fa-solid fa-eye"></i></button>
            </div>
        `;
    }).join("");
}

function renderAttendanceHealth(eligible, total) {
    const circlePct = document.getElementById("healthEligiblePct");
    const eligibleCount = document.getElementById("healthEligibleCount");
    const shortageCount = document.getElementById("healthShortageCount");
    if (!circlePct) return;

    if (total === 0) {
        circlePct.textContent = "0%";
        eligibleCount.textContent = "0";
        shortageCount.textContent = "0";
        return;
    }

    const pct = Math.round((eligible / total) * 100);
    circlePct.textContent = `${pct}%`;
    eligibleCount.textContent = `${eligible} (${pct}%)`;
    shortageCount.textContent = `${total - eligible} (${100 - pct}%)`;
}

/**
 * -------------------------------------------------------------------------
 * Chart.js Lifecycle Manager & Renderers
 * -------------------------------------------------------------------------
 */
function destroyChart(chartId) {
    if (AppState.charts[chartId]) {
        AppState.charts[chartId].destroy();
        delete AppState.charts[chartId];
    }
}

function getThemeFontColor() {
    return document.body.classList.contains("dark-mode") ? "#cbd5e1" : "#475569";
}

function getThemeGridColor() {
    return document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
}

function renderDashboardCharts() {
    const students = AppState.students;
    const fontColor = getThemeFontColor();
    const gridColor = getThemeGridColor();

    // 1. Subject-wise Bar Chart
    const subjectCanvas = document.getElementById("subjectBarChart");
    if (subjectCanvas) {
        destroyChart("subjectBar");
        
        let dsAvg = 0, dbmsAvg = 0, wtAvg = 0, osAvg = 0, cnAvg = 0;
        if (students.length > 0) {
            dsAvg = (students.reduce((sum, s) => sum + s.ds, 0) / students.length).toFixed(1);
            dbmsAvg = (students.reduce((sum, s) => sum + s.dbms, 0) / students.length).toFixed(1);
            wtAvg = (students.reduce((sum, s) => sum + s.wt, 0) / students.length).toFixed(1);
            osAvg = (students.reduce((sum, s) => sum + s.os, 0) / students.length).toFixed(1);
            cnAvg = (students.reduce((sum, s) => sum + s.cn, 0) / students.length).toFixed(1);
        }

        const ctx = subjectCanvas.getContext("2d");
        AppState.charts["subjectBar"] = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Data Structures", "DBMS", "Web Tech", "Operating Sys", "Comp Networks"],
                datasets: [{
                    label: "Class Average Marks (out of 100)",
                    data: [dsAvg, dbmsAvg, wtAvg, osAvg, cnAvg],
                    backgroundColor: [
                        "rgba(37, 99, 235, 0.8)",
                        "rgba(79, 70, 229, 0.8)",
                        "rgba(2, 132, 199, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(245, 158, 11, 0.8)"
                    ],
                    borderColor: [
                        "#2563eb",
                        "#4f46e5",
                        "#0284c7",
                        "#10b981",
                        "#f59e0b"
                    ],
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` Average: ${ctx.parsed.y} / 100`
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: fontColor, font: { weight: 600 } },
                        grid: { display: false }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        ticks: { color: fontColor },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }

    // 2. Grade Distribution Doughnut Chart
    const gradeCanvas = document.getElementById("gradeDoughnutChart");
    if (gradeCanvas) {
        destroyChart("gradeDoughnut");

        let aPlus = 0, a = 0, b = 0, c = 0, f = 0;
        students.forEach(s => {
            if (s.grade === "A+") aPlus++;
            else if (s.grade === "A") a++;
            else if (s.grade === "B") b++;
            else if (s.grade === "C") c++;
            else f++;
        });

        const ctx = gradeCanvas.getContext("2d");
        AppState.charts["gradeDoughnut"] = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Grade A+ (≥90%)", "Grade A (80-89%)", "Grade B (70-79%)", "Grade C (50-69%)", "Grade F (<50%)"],
                datasets: [{
                    data: [aPlus, a, b, c, f],
                    backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"],
                    borderWidth: 2,
                    borderColor: document.body.classList.contains("dark-mode") ? "#111a2e" : "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: { color: fontColor, boxWidth: 14, font: { size: 12 } }
                    }
                },
                cutout: "65%"
            }
        });
    }
}

/**
 * -------------------------------------------------------------------------
 * VIEW 2: Student Management Directory
 * -------------------------------------------------------------------------
 */
function setupStudentManagementEvents() {
    const toggleBtn = document.getElementById("toggleAddStudentFormBtn");
    const closeBtn = document.getElementById("closeAddStudentFormBtn");
    const cancelBtn = document.getElementById("cancelStudentFormBtn");
    const form = document.getElementById("individualStudentForm");
    const searchInput = document.getElementById("tableSearchInput");
    const filterGrade = document.getElementById("filterGradeSelect");
    const filterStatus = document.getElementById("filterStatusSelect");
    const filterAttendance = document.getElementById("filterAttendanceSelect");
    const sortBy = document.getElementById("sortBySelect");
    const resetSampleDataBtn = document.getElementById("resetSampleDataBtn");

    if (toggleBtn) toggleBtn.addEventListener("click", () => toggleAddStudentForm());
    if (closeBtn) closeBtn.addEventListener("click", () => toggleAddStudentForm(false));
    if (cancelBtn) cancelBtn.addEventListener("click", () => toggleAddStudentForm(false));

    // Dynamic Live Calculation of Marks
    const markInputs = document.querySelectorAll(".subject-mark-input");
    markInputs.forEach(input => {
        input.addEventListener("input", updateLiveFormCalculations);
    });

    // Form Submit (Add or Edit)
    if (form) {
        form.addEventListener("submit", handleStudentFormSubmit);
    }

    // Filters and Search
    if (searchInput) searchInput.addEventListener("input", renderStudentsTable);
    if (filterGrade) filterGrade.addEventListener("change", renderStudentsTable);
    if (filterStatus) filterStatus.addEventListener("change", renderStudentsTable);
    if (filterAttendance) filterAttendance.addEventListener("change", renderStudentsTable);
    if (sortBy) sortBy.addEventListener("change", renderStudentsTable);

    // Reset Sample Data
    if (resetSampleDataBtn) {
        resetSampleDataBtn.addEventListener("click", () => {
            showConfirmationModal(
                "Reset to Sample Data?",
                "This will restore the standard 25 B.Tech IT sample student records and overwrite current records. Proceed?",
                () => {
                    AppState.students = DEFAULT_STUDENTS.map(enrichStudentData);
                    saveStudents();
                    showToast("Restored 25 default sample student records!", "success");
                }
            );
        });
    }
}

function toggleAddStudentForm(show = null) {
    const card = document.getElementById("addStudentCard");
    const title = document.getElementById("formModeTitle");
    const rollInput = document.getElementById("studentRollInput");
    if (!card) return;

    const isVisible = card.style.display !== "none";
    const targetState = show !== null ? show : !isVisible;

    if (targetState) {
        card.style.display = "block";
        if (!AppState.editingStudentRoll) {
            title.textContent = "Add Individual Student";
            document.getElementById("individualStudentForm").reset();
            document.getElementById("editStudentOriginalRoll").value = "";
            rollInput.removeAttribute("readonly");
            updateLiveFormCalculations();
        }
        card.scrollIntoView({ behavior: "smooth" });
    } else {
        card.style.display = "none";
        AppState.editingStudentRoll = null;
        document.getElementById("individualStudentForm").reset();
        clearFormErrors();
    }
}

function updateLiveFormCalculations() {
    const ds = Math.min(100, Math.max(0, Number(document.getElementById("markDs").value) || 0));
    const dbms = Math.min(100, Math.max(0, Number(document.getElementById("markDbms").value) || 0));
    const wt = Math.min(100, Math.max(0, Number(document.getElementById("markWt").value) || 0));
    const os = Math.min(100, Math.max(0, Number(document.getElementById("markOs").value) || 0));
    const cn = Math.min(100, Math.max(0, Number(document.getElementById("markCn").value) || 0));

    const total = ds + dbms + wt + os + cn;
    const pct = Number(((total / 500) * 100).toFixed(1));

    let grade = "F";
    if (pct >= 90) grade = "A+";
    else if (pct >= 80) grade = "A";
    else if (pct >= 70) grade = "B";
    else if (pct >= 50) grade = "C";

    document.getElementById("liveTotalDisplay").textContent = `${total} / 500`;
    document.getElementById("livePercentageDisplay").textContent = `${pct}%`;
    const gradeBadge = document.getElementById("liveGradeDisplay");
    gradeBadge.textContent = grade;
    gradeBadge.className = `badge ${grade === 'A+' || grade === 'A' ? 'badge-success' : grade === 'B' || grade === 'C' ? 'badge-primary' : 'badge-danger'}`;
}

function clearFormErrors() {
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
}

function handleStudentFormSubmit(e) {
    e.preventDefault();
    clearFormErrors();

    const nameInput = document.getElementById("studentNameInput");
    const rollInput = document.getElementById("studentRollInput");
    const deptInput = document.getElementById("studentDeptInput");
    const attInput = document.getElementById("studentAttendanceInput");
    const originalRoll = document.getElementById("editStudentOriginalRoll").value.trim();

    const name = nameInput.value.trim();
    const roll = rollInput.value.trim().toUpperCase();
    const dept = deptInput.value;
    const att = Number(attInput.value);

    let hasError = false;

    if (!name) {
        document.getElementById("nameError").textContent = "Student name is required";
        hasError = true;
    }

    if (!roll) {
        document.getElementById("rollError").textContent = "Roll number is required";
        hasError = true;
    } else {
        // Duplicate check if adding new OR changing roll
        const isDuplicate = AppState.students.some(s => s.roll === roll && s.roll !== originalRoll);
        if (isDuplicate) {
            document.getElementById("rollError").textContent = `Roll number '${roll}' already exists!`;
            hasError = true;
        }
    }

    if (isNaN(att) || att < 0 || att > 100) {
        document.getElementById("attendanceError").textContent = "Attendance must be between 0 and 100";
        hasError = true;
    }

    const marks = ["markDs", "markDbms", "markWt", "markOs", "markCn"];
    marks.forEach(m => {
        const val = Number(document.getElementById(m).value);
        if (isNaN(val) || val < 0 || val > 100) {
            document.getElementById(`${m}Error`).textContent = "Enter 0-100";
            hasError = true;
        }
    });

    if (hasError) return;

    const studentRecord = enrichStudentData({
        roll,
        name,
        dept,
        sem: "Sem 5",
        ds: Number(document.getElementById("markDs").value),
        dbms: Number(document.getElementById("markDbms").value),
        wt: Number(document.getElementById("markWt").value),
        os: Number(document.getElementById("markOs").value),
        cn: Number(document.getElementById("markCn").value),
        attendance: att
    });

    if (originalRoll) {
        // Edit existing
        const idx = AppState.students.findIndex(s => s.roll === originalRoll);
        if (idx !== -1) {
            AppState.students[idx] = studentRecord;
            showToast(`Updated student ${name} (${roll})`, "success");
        }
    } else {
        // Add new
        AppState.students.unshift(studentRecord);
        showToast(`Added new student ${name} (${roll})`, "success");
    }

    saveStudents();
    toggleAddStudentForm(false);
}

function openEditStudent(roll) {
    const student = AppState.students.find(s => s.roll === roll);
    if (!student) return;

    AppState.editingStudentRoll = roll;
    toggleAddStudentForm(true);

    document.getElementById("formModeTitle").textContent = `Edit Student: ${student.name} (${student.roll})`;
    document.getElementById("editStudentOriginalRoll").value = student.roll;
    document.getElementById("studentNameInput").value = student.name;
    const rollInput = document.getElementById("studentRollInput");
    rollInput.value = student.roll;

    document.getElementById("studentDeptInput").value = student.dept;
    document.getElementById("markDs").value = student.ds;
    document.getElementById("markDbms").value = student.dbms;
    document.getElementById("markWt").value = student.wt;
    document.getElementById("markOs").value = student.os;
    document.getElementById("markCn").value = student.cn;
    document.getElementById("studentAttendanceInput").value = student.attendance;

    updateLiveFormCalculations();
}

function deleteStudentPrompt(roll) {
    const student = AppState.students.find(s => s.roll === roll);
    if (!student) return;

    showConfirmationModal(
        `Delete Student Record?`,
        `Are you sure you want to permanently delete record for ${student.name} (${student.roll})?`,
        () => {
            AppState.students = AppState.students.filter(s => s.roll !== roll);
            saveStudents();
            showToast(`Deleted student ${student.name}`, "info");
        }
    );
}

function renderStudentsTable() {
    const tbody = document.getElementById("studentTableBody");
    const countDisplay = document.getElementById("tableRecordCountDisplay");
    if (!tbody) return;

    const searchTerm = (document.getElementById("tableSearchInput")?.value || "").toLowerCase().trim();
    const filterGrade = document.getElementById("filterGradeSelect")?.value || "ALL";
    const filterStatus = document.getElementById("filterStatusSelect")?.value || "ALL";
    const filterAttendance = document.getElementById("filterAttendanceSelect")?.value || "ALL";
    const sortBy = document.getElementById("sortBySelect")?.value || "roll_asc";

    let filtered = AppState.students.filter(s => {
        // Search
        const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.roll.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;

        // Grade
        if (filterGrade !== "ALL" && s.grade !== filterGrade) return false;

        // Status
        if (filterStatus !== "ALL" && s.status !== filterStatus) return false;

        // Attendance
        if (filterAttendance === "ELIGIBLE" && s.attendance < AppState.settings.minAttendance) return false;
        if (filterAttendance === "SHORTAGE" && s.attendance >= AppState.settings.minAttendance) return false;

        return true;
    });

    // Sorting
    filtered.sort((a, b) => {
        if (sortBy === "roll_asc") return a.roll.localeCompare(b.roll);
        if (sortBy === "roll_desc") return b.roll.localeCompare(a.roll);
        if (sortBy === "marks_desc") return b.percentage - a.percentage;
        if (sortBy === "marks_asc") return a.percentage - b.percentage;
        if (sortBy === "att_desc") return b.attendance - a.attendance;
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        return 0;
    });

    if (countDisplay) {
        countDisplay.textContent = `Showing ${filtered.length} of ${AppState.students.length} students`;
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="padding: 2.5rem;">No student records match the search or filter criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(s => {
        const gradeBadge = s.grade === "A+" || s.grade === "A" 
            ? "badge-success" 
            : s.grade === "B" || s.grade === "C" ? "badge-primary" : "badge-danger";

        const attBadge = s.attendance >= AppState.settings.minAttendance
            ? `<span class="badge badge-success"><i class="fa-solid fa-check"></i> ${s.attendance}%</span>`
            : `<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> ${s.attendance}%</span>`;

        return `
            <tr>
                <td><strong>${s.roll}</strong></td>
                <td>
                    <div style="font-weight: 600;">${escapeHtml(s.name)}</div>
                    <small class="text-muted">${s.dept}</small>
                </td>
                <td>
                    <div class="marks-chips">
                        <span class="mark-chip" title="Data Structures">DS: ${s.ds}</span>
                        <span class="mark-chip" title="DBMS">DBMS: ${s.dbms}</span>
                        <span class="mark-chip" title="Web Technologies">WT: ${s.wt}</span>
                        <span class="mark-chip" title="Operating Systems">OS: ${s.os}</span>
                        <span class="mark-chip" title="Computer Networks">CN: ${s.cn}</span>
                    </div>
                </td>
                <td><strong>${s.total} / 500</strong></td>
                <td><strong class="text-primary">${s.percentage}%</strong></td>
                <td><span class="badge ${gradeBadge}">${s.grade}</span></td>
                <td>${attBadge}</td>
                <td><span class="badge ${s.status === 'Outstanding' ? 'badge-success' : s.status === 'Good' ? 'badge-primary' : 'badge-danger'}">${s.status}</span></td>
                <td class="text-center">
                    <div class="action-btns">
                        <button class="btn-table-action" onclick="openStudentDetails('${s.roll}')" title="View Full Academic Profile">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-table-action" onclick="openEditStudent('${s.roll}')" title="Edit Student">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-table-action delete-btn" onclick="deleteStudentPrompt('${s.roll}')" title="Delete Student">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

/**
 * -------------------------------------------------------------------------
 * VIEW 3: Academic Performance Analytics
 * -------------------------------------------------------------------------
 */
function renderAnalytics() {
    const students = AppState.students;
    const fontColor = getThemeFontColor();
    const gridColor = getThemeGridColor();

    if (students.length === 0) {
        document.getElementById("analyticHighestSubject").textContent = "-";
        document.getElementById("analyticLowestSubject").textContent = "-";
        document.getElementById("analyticDistinctionRate").textContent = "0%";
        document.getElementById("analyticPassRate").textContent = "0%";
        destroyChart("analyticsSubject");
        destroyChart("monthlyTrend");
        destroyChart("comparisonRadar");
        destroyChart("attendanceScatter");
        return;
    }

    // Calculations
    const subjects = ["Data Structures", "DBMS", "Web Tech", "Operating Sys", "Comp Networks"];
    const avgs = [
        students.reduce((sum, s) => sum + s.ds, 0) / students.length,
        students.reduce((sum, s) => sum + s.dbms, 0) / students.length,
        students.reduce((sum, s) => sum + s.wt, 0) / students.length,
        students.reduce((sum, s) => sum + s.os, 0) / students.length,
        students.reduce((sum, s) => sum + s.cn, 0) / students.length
    ];

    let maxIdx = 0, minIdx = 0;
    avgs.forEach((val, i) => {
        if (val > avgs[maxIdx]) maxIdx = i;
        if (val < avgs[minIdx]) minIdx = i;
    });

    document.getElementById("analyticHighestSubject").textContent = `${subjects[maxIdx]} (${avgs[maxIdx].toFixed(1)}%)`;
    document.getElementById("analyticLowestSubject").textContent = `${subjects[minIdx]} (${avgs[minIdx].toFixed(1)}%)`;

    const distinctionCount = students.filter(s => s.percentage >= 80).length;
    const passCount = students.filter(s => s.percentage >= 50).length;

    document.getElementById("analyticDistinctionRate").textContent = `${Math.round((distinctionCount / students.length) * 100)}%`;
    document.getElementById("analyticPassRate").textContent = `${Math.round((passCount / students.length) * 100)}%`;

    renderAnalyticsCharts();
}

function renderAnalyticsCharts() {
    const students = AppState.students;
    if (students.length === 0) return;
    const fontColor = getThemeFontColor();
    const gridColor = getThemeGridColor();

    // 1. Subject Mastery Comparison (Highest, Avg, Lowest)
    const subCanvas = document.getElementById("analyticsSubjectChart");
    if (subCanvas) {
        destroyChart("analyticsSubject");
        const ctx = subCanvas.getContext("2d");

        const getStats = (key) => ({
            max: Math.max(...students.map(s => s[key])),
            avg: Number((students.reduce((sum, s) => sum + s[key], 0) / students.length).toFixed(1)),
            min: Math.min(...students.map(s => s[key]))
        });

        const dsStats = getStats("ds");
        const dbmsStats = getStats("dbms");
        const wtStats = getStats("wt");
        const osStats = getStats("os");
        const cnStats = getStats("cn");

        AppState.charts["analyticsSubject"] = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["DS", "DBMS", "WT", "OS", "CN"],
                datasets: [
                    {
                        label: "Batch Highest",
                        data: [dsStats.max, dbmsStats.max, wtStats.max, osStats.max, cnStats.max],
                        backgroundColor: "#10b981",
                        borderRadius: 4
                    },
                    {
                        label: "Batch Average",
                        data: [dsStats.avg, dbmsStats.avg, wtStats.avg, osStats.avg, cnStats.avg],
                        backgroundColor: "#2563eb",
                        borderRadius: 4
                    },
                    {
                        label: "Batch Lowest",
                        data: [dsStats.min, dbmsStats.min, wtStats.min, osStats.min, cnStats.min],
                        backgroundColor: "#ef4444",
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: fontColor } }
                },
                scales: {
                    x: { ticks: { color: fontColor }, grid: { display: false } },
                    y: { min: 0, max: 100, ticks: { color: fontColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    // 2. Monthly Trend Chart
    const trendCanvas = document.getElementById("monthlyTrendChart");
    if (trendCanvas) {
        destroyChart("monthlyTrend");
        const ctx = trendCanvas.getContext("2d");

        const batchAvg = Number((students.reduce((sum, s) => sum + s.percentage, 0) / students.length).toFixed(1));

        AppState.charts["monthlyTrend"] = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["CIA Test 1", "Assignment 1", "CIA Test 2", "Model Practical", "Pre-Semester"],
                datasets: [
                    {
                        label: "Batch Progression Average (%)",
                        data: [
                            Math.max(40, batchAvg - 6),
                            Math.max(45, batchAvg - 2),
                            batchAvg,
                            Math.min(100, batchAvg + 2),
                            Math.min(100, batchAvg + 4)
                        ],
                        borderColor: "#4f46e5",
                        backgroundColor: "rgba(79, 70, 229, 0.15)",
                        tension: 0.35,
                        fill: true,
                        pointBackgroundColor: "#4f46e5",
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: fontColor } }
                },
                scales: {
                    x: { ticks: { color: fontColor }, grid: { display: false } },
                    y: { min: 0, max: 100, ticks: { color: fontColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    // 3. Radar Comparison Chart
    const radarCanvas = document.getElementById("comparisonRadarChart");
    if (radarCanvas) {
        destroyChart("comparisonRadar");
        const ctx = radarCanvas.getContext("2d");

        const top = [...students].sort((a, b) => b.percentage - a.percentage)[0];
        const avgDs = (students.reduce((sum, s) => sum + s.ds, 0) / students.length).toFixed(1);
        const avgDbms = (students.reduce((sum, s) => sum + s.dbms, 0) / students.length).toFixed(1);
        const avgWt = (students.reduce((sum, s) => sum + s.wt, 0) / students.length).toFixed(1);
        const avgOs = (students.reduce((sum, s) => sum + s.os, 0) / students.length).toFixed(1);
        const avgCn = (students.reduce((sum, s) => sum + s.cn, 0) / students.length).toFixed(1);

        AppState.charts["comparisonRadar"] = new Chart(ctx, {
            type: "radar",
            data: {
                labels: ["Data Structures", "DBMS", "Web Tech", "Operating Sys", "Computer Networks"],
                datasets: [
                    {
                        label: `Top Ranker: ${top.name}`,
                        data: [top.ds, top.dbms, top.wt, top.os, top.cn],
                        borderColor: "#10b981",
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                        pointBackgroundColor: "#10b981"
                    },
                    {
                        label: "Class Average",
                        data: [avgDs, avgDbms, avgWt, avgOs, avgCn],
                        borderColor: "#2563eb",
                        backgroundColor: "rgba(37, 99, 235, 0.2)",
                        pointBackgroundColor: "#2563eb"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: fontColor } }
                },
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: { color: fontColor, backdropColor: "transparent" },
                        pointLabels: { color: fontColor, font: { weight: 600 } },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }

    // 4. Attendance vs Marks Scatter Plot
    const scatterCanvas = document.getElementById("attendanceScatterChart");
    if (scatterCanvas) {
        destroyChart("attendanceScatter");
        const ctx = scatterCanvas.getContext("2d");

        const scatterData = students.map(s => ({
            x: s.attendance,
            y: s.percentage,
            name: s.name,
            roll: s.roll
        }));

        AppState.charts["attendanceScatter"] = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: [{
                    label: "Student (Attendance % vs Marks %)",
                    data: scatterData,
                    backgroundColor: "#0284c7",
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: fontColor } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const pt = ctx.raw;
                                return ` ${pt.name} (${pt.roll}): Att: ${pt.x}%, Score: ${pt.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: "Attendance Percentage (%)", color: fontColor },
                        min: 50,
                        max: 100,
                        ticks: { color: fontColor },
                        grid: { color: gridColor }
                    },
                    y: {
                        title: { display: true, text: "Aggregate Marks (%)", color: fontColor },
                        min: 30,
                        max: 100,
                        ticks: { color: fontColor },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
}

/**
 * -------------------------------------------------------------------------
 * VIEW 4: Rule-Based Student Performance Insights
 * -------------------------------------------------------------------------
 */
function renderInsights() {
    const students = AppState.students;
    const container = document.getElementById("insightsCardsContainer");
    if (!container) return;

    // Summary counts
    const failList = students.filter(s => s.percentage < 50);
    const shortageList = students.filter(s => s.attendance < AppState.settings.minAttendance);
    const highAchieverList = students.filter(s => s.percentage >= 85);

    document.getElementById("insightFailCount").textContent = failList.length;
    document.getElementById("insightAttShortageCount").textContent = shortageList.length;
    document.getElementById("insightHighAchieverCount").textContent = highAchieverList.length;

    // Find class weakest subject
    let weakestSubject = "None";
    if (students.length > 0) {
        const subNames = { ds: "Data Structures", dbms: "DBMS", wt: "Web Technologies", os: "Operating Systems", cn: "Computer Networks" };
        const subAvgs = {
            ds: students.reduce((sum, s) => sum + s.ds, 0) / students.length,
            dbms: students.reduce((sum, s) => sum + s.dbms, 0) / students.length,
            wt: students.reduce((sum, s) => sum + s.wt, 0) / students.length,
            os: students.reduce((sum, s) => sum + s.os, 0) / students.length,
            cn: students.reduce((sum, s) => sum + s.cn, 0) / students.length
        };
        let minKey = "ds";
        Object.keys(subAvgs).forEach(k => {
            if (subAvgs[k] < subAvgs[minKey]) minKey = k;
        });
        weakestSubject = subNames[minKey];
    }
    document.getElementById("insightWeakSubjectName").textContent = weakestSubject;

    // Generate Rule-Based Cards
    let cards = [];

    // Rule 1: Failing students (<50%)
    failList.forEach(s => {
        const lowestSub = getStudentWeakestSubject(s);
        cards.push({
            type: "CRITICAL",
            cardClass: "card-risk",
            icon: "fa-solid fa-triangle-exclamation text-danger",
            title: `Academic Remedial Notice: ${s.name}`,
            roll: s.roll,
            desc: `Aggregating ${s.percentage}% with lowest score in ${lowestSub.name} (${lowestSub.score}/100). Needs immediate diagnostic counseling.`,
            advice: `Action: Recommend supplementary problem-solving tutorials in ${lowestSub.name} and assign peer-study mentor.`,
            student: s
        });
    });

    // Rule 2: Attendance Shortage (<75%)
    shortageList.forEach(s => {
        cards.push({
            type: "ATTENDANCE",
            cardClass: "card-attendance",
            icon: "fa-solid fa-user-xmark text-warning",
            title: `Attendance Condonation Alert: ${s.name}`,
            roll: s.roll,
            desc: `Current attendance is ${s.attendance}%, which is below the mandatory university threshold of ${AppState.settings.minAttendance}%.`,
            advice: `Action: Issue institutional intimation notice to parents/guardian and verify medical leave certificates.`,
            student: s
        });
    });

    // Rule 3: High Achievers (>=85%)
    highAchieverList.forEach(s => {
        const topSub = getStudentStrongestSubject(s);
        cards.push({
            type: "EXCELLENCE",
            cardClass: "card-excellence",
            icon: "fa-solid fa-award text-success",
            title: `Dean's Honor Distinction: ${s.name}`,
            roll: s.roll,
            desc: `Exemplary performance with ${s.percentage}% overall aggregate and outstanding mastery in ${topSub.name} (${topSub.score}/100).`,
            advice: `Action: Encourage nomination for technical symposiums, research paper tracks, and competitive coding teams.`,
            student: s
        });
    });

    // Insight Filter Buttons
    const filterBtns = document.querySelectorAll("[data-insight-filter]");
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove("active-filter-btn"));
            btn.classList.add("active-filter-btn");
            const filter = btn.dataset.insightFilter;
            renderFilteredInsights(cards, filter);
        };
    });

    renderFilteredInsights(cards, "ALL");
}

function renderFilteredInsights(cards, filter) {
    const container = document.getElementById("insightsCardsContainer");
    if (!container) return;

    let displayList = cards;
    if (filter !== "ALL") {
        displayList = cards.filter(c => c.type === filter);
    }

    if (displayList.length === 0) {
        container.innerHTML = `<div class="card p-4 text-center text-muted" style="grid-column: 1 / -1; padding: 2.5rem;">
            <i class="fa-solid fa-circle-check text-success" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
            <p>No student records triggered rules for category "${filter}".</p>
        </div>`;
        return;
    }

    container.innerHTML = displayList.map(item => `
        <div class="insight-card ${item.cardClass}">
            <div class="insight-card-header">
                <div class="insight-title-group">
                    <h4><i class="${item.icon}"></i> ${escapeHtml(item.title)}</h4>
                    <span>Roll Number: <strong>${item.roll}</strong></span>
                </div>
                <button class="btn btn-sm btn-outline" onclick="openStudentDetails('${item.roll}')">
                    <i class="fa-solid fa-user-pen"></i> Profile
                </button>
            </div>
            <p class="insight-description">${escapeHtml(item.desc)}</p>
            <div class="insight-advice">
                <i class="fa-solid fa-lightbulb text-primary"></i> ${escapeHtml(item.advice)}
            </div>
        </div>
    `).join("");
}

function getStudentWeakestSubject(s) {
    const subs = [
        { name: "Data Structures", score: s.ds },
        { name: "DBMS", score: s.dbms },
        { name: "Web Technologies", score: s.wt },
        { name: "Operating Systems", score: s.os },
        { name: "Computer Networks", score: s.cn }
    ];
    subs.sort((a, b) => a.score - b.score);
    return subs[0];
}

function getStudentStrongestSubject(s) {
    const subs = [
        { name: "Data Structures", score: s.ds },
        { name: "DBMS", score: s.dbms },
        { name: "Web Technologies", score: s.wt },
        { name: "Operating Systems", score: s.os },
        { name: "Computer Networks", score: s.cn }
    ];
    subs.sort((a, b) => b.score - a.score);
    return subs[0];
}

/**
 * -------------------------------------------------------------------------
 * VIEW 5: Academic Goal Tracker
 * -------------------------------------------------------------------------
 */
function setupGoalTrackerEvents() {
    const form = document.getElementById("goalSettingForm");
    const studentSelect = document.getElementById("goalStudentSelect");
    const targetInput = document.getElementById("goalTargetInput");

    if (studentSelect) {
        studentSelect.addEventListener("change", updateGoalPreview);
    }
    if (targetInput) {
        targetInput.addEventListener("input", updateGoalPreview);
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const roll = studentSelect.value;
            const target = Number(targetInput.value);

            if (!roll || isNaN(target) || target <= 0 || target > 100) {
                showToast("Please select a student and enter a valid target (0 - 100)", "error");
                return;
            }

            AppState.goals[roll] = target;
            saveGoals();
            renderGoals();
            showToast(`Target goal of ${target}% saved for roll ${roll}`, "success");
        });
    }
}

function renderGoals() {
    const studentSelect = document.getElementById("goalStudentSelect");
    const tbody = document.getElementById("goalsTableBody");
    if (!studentSelect || !tbody) return;

    // Populate dropdown
    const currentSelected = studentSelect.value;
    studentSelect.innerHTML = `<option value="">-- Choose Student --</option>` + AppState.students.map(s => `
        <option value="${s.roll}" ${s.roll === currentSelected ? 'selected' : ''}>${s.roll} - ${escapeHtml(s.name)} (Current: ${s.percentage}%)</option>
    `).join("");

    updateGoalPreview();

    // Table of active goals
    const goalEntries = Object.entries(AppState.goals);
    if (goalEntries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding: 2rem;">No student academic target goals set yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = goalEntries.map(([roll, target]) => {
        const student = AppState.students.find(s => s.roll === roll);
        if (!student) return "";

        const currentPct = student.percentage;
        const progressRate = Math.min(100, Math.round((currentPct / target) * 100));
        const neededMarks = Math.max(0, Math.round(((target - currentPct) / 100) * 500));
        const isAchieved = currentPct >= target;

        return `
            <tr>
                <td><strong>${student.roll}</strong></td>
                <td>${escapeHtml(student.name)}</td>
                <td><strong>${currentPct}%</strong></td>
                <td><strong class="text-primary">${target}%</strong></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 140px;">
                        <div class="progress-bar-bg" style="height: 8px; flex: 1;">
                            <div class="progress-bar-fill" style="width: ${progressRate}%;"></div>
                        </div>
                        <small style="font-weight: 700;">${progressRate}%</small>
                    </div>
                </td>
                <td>
                    ${isAchieved ? '<span class="badge badge-success">Target Achieved!</span>' : `<strong>+${neededMarks} marks</strong>`}
                </td>
                <td>
                    ${isAchieved ? '<span class="badge badge-success">Milestone Met</span>' : '<span class="badge badge-primary">In Progress</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-ghost text-danger" onclick="deleteGoal('${roll}')" title="Remove Goal">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function deleteGoal(roll) {
    delete AppState.goals[roll];
    saveGoals();
    renderGoals();
    showToast("Target goal removed", "info");
}

function updateGoalPreview() {
    const studentSelect = document.getElementById("goalStudentSelect");
    const targetInput = document.getElementById("goalTargetInput");
    const previewBox = document.getElementById("goalPreviewBox");
    if (!studentSelect || !targetInput || !previewBox) return;

    const roll = studentSelect.value;
    const target = Number(targetInput.value);

    if (!roll || !target) {
        previewBox.style.display = "none";
        return;
    }

    const student = AppState.students.find(s => s.roll === roll);
    if (!student) {
        previewBox.style.display = "none";
        return;
    }

    previewBox.style.display = "block";
    const currentPct = student.percentage;
    const neededMarks = Math.round(((target - currentPct) / 100) * 500);
    const progressRate = Math.min(100, Math.round((currentPct / target) * 100));

    document.getElementById("goalCurrentMarks").textContent = `${student.total} / 500 (${currentPct}%)`;
    document.getElementById("goalTargetMarks").textContent = `${Math.round((target / 100) * 500)} / 500 (${target}%)`;

    const neededDisplay = document.getElementById("goalMarksNeeded");
    if (neededMarks <= 0) {
        neededDisplay.textContent = "Goal Already Exceeded!";
        neededDisplay.className = "text-success";
    } else {
        neededDisplay.textContent = `+${neededMarks} marks needed across 5 subjects`;
        neededDisplay.className = "text-primary";
    }

    document.getElementById("goalProgressPct").textContent = `${progressRate}%`;
    document.getElementById("goalProgressFill").style.width = `${progressRate}%`;

    const adviceBox = document.getElementById("goalAdviceBox");
    if (neededMarks <= 0) {
        adviceBox.innerHTML = `<strong>Great Work:</strong> Student has surpassed this target milestone. Consider setting a higher benchmark for honors distinction!`;
    } else {
        const perSubject = (neededMarks / 5).toFixed(1);
        adviceBox.innerHTML = `<strong>Strategic Roadmap:</strong> To reach ${target}%, student requires an average increase of <strong>+${perSubject} marks</strong> in each of the 5 curriculum subjects during upcoming continuous assessments.`;
    }
}

/**
 * -------------------------------------------------------------------------
 * VIEW 6: Top Performers & Merit Certificates
 * -------------------------------------------------------------------------
 */
function renderTopPerformers() {
    const students = AppState.students;
    const podium = document.getElementById("podiumContainer");
    const tbody = document.getElementById("topPerformersTableBody");
    if (!podium || !tbody) return;

    const sorted = [...students].sort((a, b) => b.percentage - a.percentage);

    if (sorted.length === 0) {
        podium.innerHTML = `<div class="text-center text-muted p-4">No student data available.</div>`;
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">No student records found.</td></tr>`;
        return;
    }

    // Top 3 Podium: Render Rank 2 (left), Rank 1 (center), Rank 3 (right)
    const r1 = sorted[0];
    const r2 = sorted[1] || null;
    const r3 = sorted[2] || null;

    let podiumHtml = "";

    // Step 2
    if (r2) {
        podiumHtml += `
            <div class="podium-step">
                <div class="podium-avatar-box">
                    <div class="podium-avatar"><i class="fa-solid fa-user-graduate"></i></div>
                    <div class="podium-medal medal-silver"><i class="fa-solid fa-medal"></i></div>
                </div>
                <div class="podium-info">
                    <h4>${escapeHtml(r2.name)}</h4>
                    <span>${r2.roll}</span>
                    <div class="podium-score">${r2.percentage}%</div>
                </div>
                <div class="podium-block block-2">2</div>
            </div>
        `;
    }

    // Step 1
    if (r1) {
        podiumHtml += `
            <div class="podium-step">
                <div class="podium-avatar-box">
                    <div class="podium-avatar" style="border-color: #fbbf24;"><i class="fa-solid fa-crown text-warning"></i></div>
                    <div class="podium-medal medal-gold"><i class="fa-solid fa-trophy"></i></div>
                </div>
                <div class="podium-info">
                    <h4>${escapeHtml(r1.name)}</h4>
                    <span>${r1.roll}</span>
                    <div class="podium-score">${r1.percentage}%</div>
                </div>
                <div class="podium-block block-1">1</div>
            </div>
        `;
    }

    // Step 3
    if (r3) {
        podiumHtml += `
            <div class="podium-step">
                <div class="podium-avatar-box">
                    <div class="podium-avatar"><i class="fa-solid fa-user-graduate"></i></div>
                    <div class="podium-medal medal-bronze"><i class="fa-solid fa-award"></i></div>
                </div>
                <div class="podium-info">
                    <h4>${escapeHtml(r3.name)}</h4>
                    <span>${r3.roll}</span>
                    <div class="podium-score">${r3.percentage}%</div>
                </div>
                <div class="podium-block block-3">3</div>
            </div>
        `;
    }

    podium.innerHTML = podiumHtml;

    // Top 10 Table
    const top10 = sorted.slice(0, 10);
    tbody.innerHTML = top10.map((s, idx) => {
        const rank = idx + 1;
        let badge = `<span class="badge badge-primary">Rank #${rank}</span>`;
        if (rank === 1) badge = `<span class="badge badge-warning"><i class="fa-solid fa-trophy"></i> Gold Medal</span>`;
        else if (rank === 2) badge = `<span class="badge badge-secondary"><i class="fa-solid fa-medal"></i> Silver Medal</span>`;
        else if (rank === 3) badge = `<span class="badge badge-secondary"><i class="fa-solid fa-award"></i> Bronze Medal</span>`;

        return `
            <tr>
                <td><strong>#${rank}</strong></td>
                <td><strong>${s.roll}</strong></td>
                <td>
                    <strong>${escapeHtml(s.name)}</strong>
                    <div><small class="text-muted">${s.dept}</small></div>
                </td>
                <td><strong>${s.total} / 500</strong></td>
                <td><strong class="text-primary">${s.percentage}%</strong></td>
                <td><span class="badge badge-success">${s.grade}</span></td>
                <td><span class="badge badge-success">${s.attendance}%</span></td>
                <td>${badge}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="openCertificateModal('${s.roll}', ${rank})" title="Generate Certificate">
                        <i class="fa-solid fa-certificate text-warning"></i> Certificate
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function setupCertificateEvents() {
    const printTopRankersBtn = document.getElementById("printTopRankersBtn");
    const closeCertBtn = document.getElementById("closeCertModalBtn");
    const closeCertFooterBtn = document.getElementById("closeCertModalFooterBtn");
    const printCertBtn = document.getElementById("printCertBtn");
    const certModal = document.getElementById("certificateModal");

    if (printTopRankersBtn) {
        printTopRankersBtn.addEventListener("click", () => {
            const sorted = [...AppState.students].sort((a, b) => b.percentage - a.percentage);
            if (sorted.length > 0) {
                openCertificateModal(sorted[0].roll, 1);
            } else {
                showToast("No student records available to generate certificate", "error");
            }
        });
    }

    const closeCert = () => certModal.classList.remove("active-modal");
    if (closeCertBtn) closeCertBtn.addEventListener("click", closeCert);
    if (closeCertFooterBtn) closeCertFooterBtn.addEventListener("click", closeCert);

    if (printCertBtn) {
        printCertBtn.addEventListener("click", () => {
            window.print();
        });
    }
}

function openCertificateModal(roll, rank = null) {
    const student = AppState.students.find(s => s.roll === roll);
    if (!student) return;

    if (rank === null) {
        const sorted = [...AppState.students].sort((a, b) => b.percentage - a.percentage);
        rank = sorted.findIndex(s => s.roll === roll) + 1;
    }

    document.getElementById("certStudentName").textContent = student.name;
    document.getElementById("certStudentRoll").textContent = student.roll;
    document.getElementById("certRankDisplay").textContent = `Rank #${rank}`;
    document.getElementById("certPercentageDisplay").textContent = `${student.percentage}%`;
    document.getElementById("certGradeDisplay").textContent = student.grade;

    document.getElementById("certificateModal").classList.add("active-modal");
}

/**
 * -------------------------------------------------------------------------
 * VIEW 7: Attendance Management Register
 * -------------------------------------------------------------------------
 */
function renderAttendanceRegister() {
    const students = AppState.students;
    const tbody = document.getElementById("attendanceTableBody");
    if (!tbody) return;

    const avgRateDisplay = document.getElementById("attAvgRateDisplay");
    const eligibleDisplay = document.getElementById("attEligibleCountDisplay");
    const shortageDisplay = document.getElementById("attShortageCountDisplay");
    const perfectDisplay = document.getElementById("attPerfectCountDisplay");

    if (students.length === 0) {
        if (avgRateDisplay) avgRateDisplay.textContent = "0%";
        if (eligibleDisplay) eligibleDisplay.textContent = "0";
        if (shortageDisplay) shortageDisplay.textContent = "0";
        if (perfectDisplay) perfectDisplay.textContent = "0";
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No student records found.</td></tr>`;
        return;
    }

    const avg = (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1);
    const eligibleCount = students.filter(s => s.attendance >= AppState.settings.minAttendance).length;
    const shortageCount = students.length - eligibleCount;
    const perfectCount = students.filter(s => s.attendance === 100).length;

    if (avgRateDisplay) avgRateDisplay.textContent = `${avg}%`;
    if (eligibleDisplay) eligibleDisplay.textContent = eligibleCount;
    if (shortageDisplay) shortageDisplay.textContent = shortageCount;
    if (perfectDisplay) perfectDisplay.textContent = perfectCount;

    tbody.innerHTML = students.map(s => {
        const isEligible = s.attendance >= AppState.settings.minAttendance;
        const statusBadge = isEligible
            ? `<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Eligible</span>`
            : `<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Shortage Alert</span>`;

        return `
            <tr>
                <td><strong>${s.roll}</strong></td>
                <td><strong>${escapeHtml(s.name)}</strong></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <strong>${s.attendance}%</strong>
                        <div class="progress-bar-bg" style="width: 80px; height: 6px;">
                            <div class="progress-bar-fill" style="width: ${s.attendance}%; background: ${isEligible ? 'var(--success)' : 'var(--danger)'};"></div>
                        </div>
                    </div>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline text-success" onclick="quickLogAttendance('${s.roll}', true)" title="Mark Present (+1%)">
                            <i class="fa-solid fa-check"></i> Present
                        </button>
                        <button class="btn btn-sm btn-outline text-danger" onclick="quickLogAttendance('${s.roll}', false)" title="Mark Absent (-1%)">
                            <i class="fa-solid fa-xmark"></i> Absent
                        </button>
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.35rem;">
                        <input type="number" min="0" max="100" value="${s.attendance}" id="attInput_${s.roll}" class="form-control" style="width: 75px; padding: 0.3rem 0.5rem; font-size: 0.8rem;">
                        <button class="btn btn-sm btn-primary" onclick="updateDirectAttendance('${s.roll}')">Update</button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function quickLogAttendance(roll, isPresent) {
    const student = AppState.students.find(s => s.roll === roll);
    if (!student) return;

    if (isPresent) {
        student.attendance = Math.min(100, student.attendance + 1);
        showToast(`Marked ${student.name} Present (Now ${student.attendance}%)`, "success");
    } else {
        student.attendance = Math.max(0, student.attendance - 1);
        showToast(`Marked ${student.name} Absent (Now ${student.attendance}%)`, "info");
    }

    saveStudents();
}

function updateDirectAttendance(roll) {
    const input = document.getElementById(`attInput_${roll}`);
    if (!input) return;

    const val = Number(input.value);
    if (isNaN(val) || val < 0 || val > 100) {
        showToast("Attendance must be between 0 and 100", "error");
        return;
    }

    const student = AppState.students.find(s => s.roll === roll);
    if (!student) return;

    student.attendance = val;
    saveStudents();
    showToast(`Updated attendance for ${student.name} to ${val}%`, "success");
}

/**
 * -------------------------------------------------------------------------
 * CSV Import & Export Controller
 * -------------------------------------------------------------------------
 */
function setupCSVImportExportEvents() {
    const importModal = document.getElementById("csvImportModal");
    const openImportBtns = [document.getElementById("quickImportBtn"), document.getElementById("importCsvBtn")];
    const closeImportBtn = document.getElementById("closeImportModalBtn");
    const cancelImportBtn = document.getElementById("cancelImportBtn");
    const chooseCsvBtn = document.getElementById("chooseCsvFileBtn");
    const csvFileInput = document.getElementById("csvFileInput");
    const csvDropzone = document.getElementById("csvDropzone");
    const confirmImportBtn = document.getElementById("confirmImportBtn");
    const downloadSampleCsvBtn = document.getElementById("downloadSampleCsvBtn");

    // Quick Export Buttons
    const exportBtns = [document.getElementById("quickExportBtn"), document.getElementById("exportCsvBtn")];
    exportBtns.forEach(btn => {
        if (btn) btn.addEventListener("click", exportStudentsCSV);
    });

    // Shortage Export
    const shortageBtn = document.getElementById("exportAttendanceShortageBtn");
    if (shortageBtn) {
        shortageBtn.addEventListener("click", exportAttendanceShortageCSV);
    }

    // Modal toggles
    openImportBtns.forEach(btn => {
        if (btn) btn.addEventListener("click", () => {
            resetCsvImportState();
            importModal.classList.add("active-modal");
        });
    });

    const closeImport = () => importModal.classList.remove("active-modal");
    if (closeImportBtn) closeImportBtn.addEventListener("click", closeImport);
    if (cancelImportBtn) cancelImportBtn.addEventListener("click", closeImport);

    // File selection
    if (chooseCsvBtn && csvFileInput) {
        chooseCsvBtn.addEventListener("click", () => csvFileInput.click());
    }

    if (csvFileInput) {
        csvFileInput.addEventListener("change", (e) => {
            if (e.target.files && e.target.files[0]) {
                handleCsvFileSelected(e.target.files[0]);
            }
        });
    }

    // Drag and Drop
    if (csvDropzone) {
        csvDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            csvDropzone.style.borderColor = "var(--primary-hover)";
            csvDropzone.style.background = "var(--primary-tint)";
        });
        csvDropzone.addEventListener("dragleave", () => {
            csvDropzone.style.borderColor = "var(--primary)";
            csvDropzone.style.background = "var(--primary-light)";
        });
        csvDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            csvDropzone.style.borderColor = "var(--primary)";
            csvDropzone.style.background = "var(--primary-light)";
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleCsvFileSelected(e.dataTransfer.files[0]);
            }
        });
    }

    // Sample CSV Download
    if (downloadSampleCsvBtn) {
        downloadSampleCsvBtn.addEventListener("click", downloadSampleCsv);
    }

    // Confirm Import
    if (confirmImportBtn) {
        confirmImportBtn.addEventListener("click", executeCsvImport);
    }
}

function resetCsvImportState() {
    AppState.pendingImportData = null;
    const previewSection = document.getElementById("csvPreviewSection");
    const confirmBtn = document.getElementById("confirmImportBtn");
    const fileInput = document.getElementById("csvFileInput");
    if (previewSection) previewSection.style.display = "none";
    if (confirmBtn) confirmBtn.disabled = true;
    if (fileInput) fileInput.value = "";
}

function handleCsvFileSelected(file) {
    if (!file.name.toLowerCase().endsWith(".csv")) {
        showToast("Please select a valid .csv file format", "error");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        parseAndPreviewCsv(text);
    };
    reader.onerror = () => {
        showToast("Failed to read the selected file", "error");
    };
    reader.readAsText(file);
}

function parseAndPreviewCsv(csvContent) {
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
        showToast("The CSV file is empty or does not contain data rows.", "error");
        return;
    }

    // Header validation
    const headerRow = lines[0].split(",").map(h => h.trim().toLowerCase());
    const findCol = (name) => headerRow.findIndex(h => h.includes(name));

    const nameIdx = findCol("name");
    const rollIdx = findCol("roll");
    const dsIdx = findCol("ds");
    const dbmsIdx = findCol("dbms");
    const wtIdx = findCol("wt");
    const osIdx = findCol("os");
    const cnIdx = findCol("cn");
    const attIdx = findCol("att");

    if (nameIdx === -1 || rollIdx === -1 || dsIdx === -1 || dbmsIdx === -1 || wtIdx === -1 || osIdx === -1 || cnIdx === -1) {
        showToast("CSV header must include: Name, Roll, DS, DBMS, WT, OS, CN, Attendance", "error");
        return;
    }

    const parsedRecords = [];
    const errors = [];
    const seenRolls = new Set();

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.trim());
        if (cols.length < 7) continue;

        const name = cols[nameIdx];
        const roll = cols[rollIdx] ? cols[rollIdx].toUpperCase() : "";
        const ds = Number(cols[dsIdx]);
        const dbms = Number(cols[dbmsIdx]);
        const wt = Number(cols[wtIdx]);
        const os = Number(cols[osIdx]);
        const cn = Number(cols[cnIdx]);
        const att = attIdx !== -1 && cols[attIdx] !== undefined ? Number(cols[attIdx]) : 85;

        if (!name || !roll) {
            errors.push(`Row ${i}: Missing Student Name or Roll Number`);
            continue;
        }

        if (seenRolls.has(roll)) {
            errors.push(`Row ${i}: Duplicate roll number '${roll}' inside CSV file`);
            continue;
        }
        seenRolls.add(roll);

        if (isNaN(ds) || isNaN(dbms) || isNaN(wt) || isNaN(os) || isNaN(cn)) {
            errors.push(`Row ${i}: Marks must be numeric`);
            continue;
        }

        parsedRecords.push(enrichStudentData({
            roll,
            name,
            dept: "Information Technology",
            sem: "Sem 5",
            ds, dbms, wt, os, cn,
            attendance: isNaN(att) ? 80 : att
        }));
    }

    if (parsedRecords.length === 0) {
        showToast("No valid student records could be parsed from this file.", "error");
        return;
    }

    AppState.pendingImportData = parsedRecords;

    // Show Preview
    const previewSection = document.getElementById("csvPreviewSection");
    const validationSummary = document.getElementById("csvValidationSummary");
    const tbody = document.getElementById("csvPreviewTableBody");
    const confirmBtn = document.getElementById("confirmImportBtn");

    previewSection.style.display = "block";
    confirmBtn.disabled = false;

    validationSummary.innerHTML = `
        <span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> ${parsedRecords.length} Valid Records Ready</span>
        ${errors.length > 0 ? `<span class="badge badge-warning"><i class="fa-solid fa-triangle-exclamation"></i> ${errors.length} Rows Skipped</span>` : ''}
    `;

    // Preview up to 5 rows
    const previewRows = parsedRecords.slice(0, 5);
    tbody.innerHTML = previewRows.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${r.roll}</strong></td>
            <td>${escapeHtml(r.name)}</td>
            <td>${r.ds}</td>
            <td>${r.dbms}</td>
            <td>${r.wt}</td>
            <td>${r.os}</td>
            <td>${r.cn}</td>
            <td>${r.attendance}%</td>
            <td><span class="badge badge-success">Valid</span></td>
        </tr>
    `).join("");
}

function executeCsvImport() {
    if (!AppState.pendingImportData || AppState.pendingImportData.length === 0) return;

    const importMode = document.querySelector('input[name="importMode"]:checked')?.value || "append";
    const newRecords = AppState.pendingImportData;

    if (importMode === "replace") {
        AppState.students = newRecords;
        showToast(`Successfully replaced dataset with ${newRecords.length} imported students!`, "success");
    } else {
        // Append mode: avoid duplicates with existing
        let addedCount = 0;
        let skippedCount = 0;

        newRecords.forEach(rec => {
            const exists = AppState.students.some(s => s.roll === rec.roll);
            if (!exists) {
                AppState.students.push(rec);
                addedCount++;
            } else {
                skippedCount++;
            }
        });

        if (skippedCount > 0) {
            showToast(`Imported ${addedCount} new students (${skippedCount} duplicates skipped)`, "info");
        } else {
            showToast(`Imported all ${addedCount} student records successfully!`, "success");
        }
    }

    saveStudents();
    document.getElementById("csvImportModal").classList.remove("active-modal");
}

function downloadSampleCsv() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Roll,Name,Department,DS,DBMS,WT,OS,CN,Attendance\n" +
        "21IT050,Kunal Kapoor,Information Technology,88,90,85,82,86,92\n" +
        "21IT051,Ishita Sen,Information Technology,76,79,81,74,78,85\n" +
        "21IT052,Ravi Teja,Information Technology,45,52,48,46,44,70";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Sample_Student_Import_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportStudentsCSV() {
    if (AppState.students.length === 0) {
        showToast("No student records available to export.", "error");
        return;
    }

    const headers = ["Roll", "Name", "Department", "Semester", "DS", "DBMS", "WT", "OS", "CN", "Total", "Percentage", "Grade", "Attendance", "Status"];
    const rows = AppState.students.map(s => [
        `"${s.roll}"`,
        `"${s.name}"`,
        `"${s.dept}"`,
        `"${s.sem}"`,
        s.ds,
        s.dbms,
        s.wt,
        s.os,
        s.cn,
        s.total,
        s.percentage,
        `"${s.grade}"`,
        s.attendance,
        `"${s.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Student_Performance_Records_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Exported student dataset to CSV file", "success");
}

function exportAttendanceShortageCSV() {
    const shortageStudents = AppState.students.filter(s => s.attendance < AppState.settings.minAttendance);
    if (shortageStudents.length === 0) {
        showToast("Great news! There are zero students currently facing attendance shortages.", "success");
        return;
    }

    const headers = ["Roll", "Name", "Department", "Current Attendance %", "Criteria %", "Shortage %", "Action Required"];
    const rows = shortageStudents.map(s => [
        `"${s.roll}"`,
        `"${s.name}"`,
        `"${s.dept}"`,
        s.attendance,
        AppState.settings.minAttendance,
        (AppState.settings.minAttendance - s.attendance).toFixed(1),
        `"Issue Parent Intimation & Medical Verification"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_Shortage_List_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported list of ${shortageStudents.length} students with attendance shortage`, "info");
}

/**
 * -------------------------------------------------------------------------
 * VIEW 8: Settings & Storage Management
 * -------------------------------------------------------------------------
 */
function setupSettingsEvents() {
    const form = document.getElementById("settingsForm");
    const backupJsonBtn = document.getElementById("backupJsonBtn");
    const restoreJsonInput = document.getElementById("restoreJsonInput");
    const resetToDefaultBtn = document.getElementById("resetToDefaultBtn");
    const clearAllDataBtn = document.getElementById("clearAllDataBtn");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const college = document.getElementById("settingCollegeName").value.trim();
            const att = Number(document.getElementById("settingAttendanceThreshold").value);
            const pass = Number(document.getElementById("settingPassMarks").value);

            AppState.settings.collegeName = college || AppState.settings.collegeName;
            AppState.settings.minAttendance = isNaN(att) ? 75 : att;
            AppState.settings.passMarks = isNaN(pass) ? 50 : pass;

            saveSettings();
            updateAllViews();
            showToast("Settings updated successfully!", "success");
        });
    }

    if (backupJsonBtn) {
        backupJsonBtn.addEventListener("click", () => {
            const data = {
                students: AppState.students,
                goals: AppState.goals,
                settings: AppState.settings,
                exportDate: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Smart_Student_Dashboard_Backup_${new Date().toISOString().split("T")[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast("Downloaded full JSON system backup", "success");
        });
    }

    if (restoreJsonInput) {
        restoreJsonInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const parsed = JSON.parse(evt.target.result);
                    if (parsed.students && Array.isArray(parsed.students)) {
                        AppState.students = parsed.students.map(enrichStudentData);
                        if (parsed.goals) AppState.goals = parsed.goals;
                        if (parsed.settings) AppState.settings = parsed.settings;

                        saveStudents();
                        saveGoals();
                        saveSettings();
                        showToast(`Restored backup with ${AppState.students.length} student records!`, "success");
                    } else {
                        showToast("Invalid backup JSON format", "error");
                    }
                } catch (err) {
                    showToast("Failed to parse JSON file", "error");
                }
            };
            reader.readAsText(file);
        });
    }

    if (resetToDefaultBtn) {
        resetToDefaultBtn.addEventListener("click", () => {
            showConfirmationModal(
                "Restore 25 Sample Students?",
                "This will replace existing records with the 25 standard B.Tech IT sample student records.",
                () => {
                    AppState.students = DEFAULT_STUDENTS.map(enrichStudentData);
                    saveStudents();
                    showToast("Restored 25 default sample student records!", "success");
                }
            );
        });
    }

    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener("click", () => {
            showConfirmationModal(
                "Wipe All Student Data?",
                "Are you sure? This will delete all student records and goals from LocalStorage.",
                () => {
                    AppState.students = [];
                    AppState.goals = {};
                    saveStudents();
                    saveGoals();
                    showToast("All student records have been cleared.", "info");
                }
            );
        });
    }
}

function renderSettings() {
    const settingCount = document.getElementById("settingStudentCount");
    if (settingCount) {
        settingCount.textContent = `${AppState.students.length} records`;
    }
    const college = document.getElementById("settingCollegeName");
    const att = document.getElementById("settingAttendanceThreshold");
    const pass = document.getElementById("settingPassMarks");

    if (college) college.value = AppState.settings.collegeName;
    if (att) att.value = AppState.settings.minAttendance;
    if (pass) pass.value = AppState.settings.passMarks;
}

/**
 * -------------------------------------------------------------------------
 * Student Details Modal
 * -------------------------------------------------------------------------
 */
function openStudentDetails(roll) {
    const student = AppState.students.find(s => s.roll === roll);
    if (!student) return;

    const modal = document.getElementById("studentDetailsModal");
    const nameEl = document.getElementById("modalStudentName");
    const rollEl = document.getElementById("modalStudentRoll");
    const content = document.getElementById("modalStudentContent");
    const editBtn = document.getElementById("editFromDetailsBtn");

    nameEl.textContent = student.name;
    rollEl.textContent = `Roll: ${student.roll} • ${student.dept} (${student.sem})`;

    const weakest = getStudentWeakestSubject(student);
    const strongest = getStudentStrongestSubject(student);
    const isAttRisk = student.attendance < AppState.settings.minAttendance;

    content.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="card p-3" style="padding: 1rem; text-align: center;">
                <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Aggregate Score</span>
                <h3 style="font-size: 1.5rem; color: var(--primary); font-weight: 800;">${student.percentage}%</h3>
                <small>${student.total} / 500 Total</small>
            </div>
            <div class="card p-3" style="padding: 1rem; text-align: center;">
                <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Grade Awarded</span>
                <h3 style="font-size: 1.5rem; font-weight: 800; color: ${student.grade === 'A+' || student.grade === 'A' ? 'var(--success)' : 'var(--primary)'};">${student.grade}</h3>
                <small>${student.status}</small>
            </div>
            <div class="card p-3" style="padding: 1rem; text-align: center;">
                <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Attendance Compliance</span>
                <h3 style="font-size: 1.5rem; font-weight: 800; color: ${isAttRisk ? 'var(--danger)' : 'var(--success)'};">${student.attendance}%</h3>
                <small>${isAttRisk ? 'Shortage Alert' : 'Eligible for Exams'}</small>
            </div>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">Subject Performance Breakdown</h4>
        <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.5rem;">
            ${renderSubjectBarItem("Data Structures", student.ds)}
            ${renderSubjectBarItem("Database Management Systems", student.dbms)}
            ${renderSubjectBarItem("Web Technologies", student.wt)}
            ${renderSubjectBarItem("Operating Systems", student.os)}
            ${renderSubjectBarItem("Computer Networks", student.cn)}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="card p-3" style="padding: 1rem; border-left: 4px solid var(--success);">
                <strong style="font-size: 0.85rem; color: var(--success);"><i class="fa-solid fa-star"></i> Academic Strength</strong>
                <p style="font-size: 0.85rem; margin-top: 0.35rem;">Highest score achieved in <strong>${strongest.name}</strong> (${strongest.score}/100).</p>
            </div>
            <div class="card p-3" style="padding: 1rem; border-left: 4px solid var(--danger);">
                <strong style="font-size: 0.85rem; color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Subject Needing Focus</strong>
                <p style="font-size: 0.85rem; margin-top: 0.35rem;">Lowest mastery in <strong>${weakest.name}</strong> (${weakest.score}/100).</p>
            </div>
        </div>
    `;

    editBtn.onclick = () => {
        modal.classList.remove("active-modal");
        switchViewDirect("students");
        openEditStudent(roll);
    };

    modal.classList.add("active-modal");

    const closeBtn = document.getElementById("closeDetailsModalBtn");
    const closeFooter = document.getElementById("closeDetailsModalFooterBtn");
    const closeModal = () => modal.classList.remove("active-modal");
    if (closeBtn) closeBtn.onclick = closeModal;
    if (closeFooter) closeFooter.onclick = closeModal;
}

function renderSubjectBarItem(name, marks) {
    let color = "var(--primary)";
    if (marks >= 85) color = "var(--success)";
    else if (marks < 50) color = "var(--danger)";

    return `
        <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.2rem;">
                <span>${name}</span>
                <span style="color: ${color};">${marks} / 100</span>
            </div>
            <div class="progress-bar-bg" style="height: 8px;">
                <div class="progress-bar-fill" style="width: ${marks}%; background: ${color};"></div>
            </div>
        </div>
    `;
}

function switchViewDirect(viewName) {
    const navLink = document.querySelector(`.sidebar-nav .nav-link[data-view="${viewName}"]`);
    if (navLink) navLink.click();
}

/**
 * -------------------------------------------------------------------------
 * Confirmation Modal Helper
 * -------------------------------------------------------------------------
 */
function showConfirmationModal(title, message, onConfirm) {
    const modal = document.getElementById("confirmationModal");
    const titleEl = document.getElementById("confirmModalTitle");
    const msgEl = document.getElementById("confirmModalMessage");
    const okBtn = document.getElementById("confirmOkBtn");
    const cancelBtn = document.getElementById("confirmCancelBtn");
    const closeBtn = document.getElementById("closeConfirmModalBtn");

    titleEl.textContent = title;
    msgEl.textContent = message;

    const closeModal = () => modal.classList.remove("active-modal");

    okBtn.onclick = () => {
        closeModal();
        if (typeof onConfirm === "function") onConfirm();
    };

    cancelBtn.onclick = closeModal;
    closeBtn.onclick = closeModal;

    modal.classList.add("active-modal");
}

/**
 * -------------------------------------------------------------------------
 * Global Search in Topbar
 * -------------------------------------------------------------------------
 */
function setupGlobalSearch() {
    const input = document.getElementById("globalSearchInput");
    if (!input) return;

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const query = input.value.trim();
            if (query) {
                switchViewDirect("students");
                const tableSearch = document.getElementById("tableSearchInput");
                if (tableSearch) {
                    tableSearch.value = query;
                    renderStudentsTable();
                }
            }
        }
    });
}

/**
 * -------------------------------------------------------------------------
 * Toast Notification Dispatcher
 * -------------------------------------------------------------------------
 */
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "fa-circle-info text-primary";
    if (type === "success") icon = "fa-circle-check text-success";
    if (type === "error") icon = "fa-circle-xmark text-danger";

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <div style="flex: 1;">${escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(12px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * -------------------------------------------------------------------------
 * Utility String Escaper
 * -------------------------------------------------------------------------
 */
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
