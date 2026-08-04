/**
 * CampusAI - Core Application Logic
 * Implements routing, views, authentication, AI chatbot, analytics, and admin forms.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Current state
    let currentUser = null;
    let currentStudent = null;
    let selectedCareerKey = "webdev";
    let isDarkMode = true;

    // DOM Elements
    const preloader = document.getElementById("preloader");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const toastContainer = document.getElementById("toast-container");

    // Navigation and Views
    const navLinks = document.querySelectorAll(".nav-link-custom");
    const viewSections = document.querySelectorAll(".view-section");
    const studentNavs = document.querySelectorAll(".student-only");
    const adminNavs = document.querySelectorAll(".admin-only");
    const authNavs = document.querySelectorAll(".auth-only");
    const anonNavs = document.querySelectorAll(".anon-only");

    // Login Form Elements
    const loginForm = document.getElementById("login-form");
    const loginUsername = document.getElementById("login-username");
    const loginPassword = document.getElementById("login-password");
    const loginError = document.getElementById("login-error");

    // Landing Page CTAs
    const exploreBtn = document.getElementById("explore-btn");
    const studentLoginBtn = document.getElementById("student-login-btn");

    // Chatbot Elements
    const chatWidget = document.getElementById("chat-widget");
    const chatToggle = document.getElementById("chat-toggle");
    const chatClose = document.getElementById("chat-close");
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");
    const chatBody = document.getElementById("chat-body");
    const chatMic = document.getElementById("chat-mic");
    const chatVolume = document.getElementById("chat-volume");
    const quickReplies = document.querySelectorAll(".quick-reply");

    // Career Guide Elements
    const careerSelect = document.getElementById("career-select");
    const careerTitle = document.getElementById("career-title");
    const careerSkills = document.getElementById("career-skills");
    const careerCourses = document.getElementById("career-courses");
    const careerRoadmap = document.getElementById("career-roadmap");

    // Notice Analyzer Modal
    const noticeModal = new bootstrap.Modal(document.getElementById("noticeModal"));
    const noticeModalTitle = document.getElementById("noticeModalLabel");
    const noticeOriginalText = document.getElementById("notice-original-text");
    const noticeSummaryText = document.getElementById("notice-summary-text");

    // Admin Panels Views
    const adminSidebarLinks = document.querySelectorAll(".admin-sidebar-link");
    const adminSubviews = document.querySelectorAll(".admin-subview");

    // Admin Action Forms
    const addStudentForm = document.getElementById("add-student-form");
    const addNoticeForm = document.getElementById("add-notice-form");
    const addEventForm = document.getElementById("add-event-form");

    // ----------------------------------------------------
    // PRELOADER & INITIAL SETUP
    // ----------------------------------------------------
    setTimeout(() => {
        preloader.classList.add("fade-out");
        setTimeout(() => preloader.style.display = "none", 500);
    }, 1200);

    // Pre-fill credentials if Remember Me is saved in local storage
    if (localStorage.getItem("campusai_remember_me") === "true") {
        loginUsername.value = localStorage.getItem("campusai_saved_username") || "";
        loginPassword.value = localStorage.getItem("campusai_saved_password") || "";
        document.getElementById("remember-me").checked = true;
    }

    // Dark/Light Theme Handler
    themeToggle.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
        document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
        themeIcon.className = isDarkMode ? "bi bi-sun-fill" : "bi bi-moon-fill";
        showToast(isDarkMode ? "Futuristic Dark Mode enabled." : "Professional Light Mode enabled.", "info");
        
        // Re-draw charts in admin panel to update text colors
        if (currentUser && currentUser.role === "ROLE_ADMIN") {
            drawAnalyticsCharts();
        }
    });

    // ----------------------------------------------------
    // ROUTING SYSTEM
    // ----------------------------------------------------
    function navigateTo(viewId, preventScroll = false) {
        // Handle Admin panel validation
        if (viewId === "admin-panel" && (!currentUser || currentUser.role !== "ROLE_ADMIN")) {
            navigateTo("login-page");
            showToast("Access Denied: Admin privileges required.", "danger");
            return;
        }

        // Handle Student dashboard validation
        if (viewId === "student-dashboard" && (!currentUser || currentUser.role !== "ROLE_STUDENT")) {
            navigateTo("login-page");
            showToast("Please login as a student first.", "warning");
            return;
        }

        viewSections.forEach(section => {
            section.classList.remove("active");
            if (section.id === viewId) {
                section.classList.add("active");
            }
        });

        // Update Nav Active States
        if (!preventScroll) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("data-target") === viewId) {
                    link.classList.add("active");
                }
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // Trigger Subviews updates
        if (viewId === "student-dashboard") {
            renderStudentDashboard();
        } else if (viewId === "admin-panel") {
            renderAdminPanel();
            const adminNameEl = document.getElementById("admin-sidebar-name");
            if (adminNameEl && currentUser) {
                adminNameEl.textContent = currentUser.name;
            }
        }

        // Close navbar toggle in mobile view
        const navbarCollapse = document.getElementById("navbarNav");
        if (navbarCollapse.classList.contains("show")) {
            bootstrap.Collapse.getInstance(navbarCollapse).hide();
        }

        // Update URL path to support deep links / direct access at any time
        const currentPath = window.location.pathname;
        const targetPath = viewId === "landing-page" ? "/" : "/" + viewId;
        if (currentPath !== targetPath) {
            history.pushState(null, "", targetPath);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.getAttribute("data-target");
            const scrollTarget = link.getAttribute("data-scroll");
            
            if (target) {
                navigateTo(target);
            } else if (scrollTarget) {
                // Highlight the clicked nav link
                navLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");

                // If not on landing page, switch first
                const landingSection = document.getElementById("landing-page");
                if (!landingSection.classList.contains("active")) {
                    navigateTo("landing-page", true);
                }
                // Wait for layout display to scroll smoothly
                setTimeout(() => {
                    document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
                }, 150);

                // Close navbar toggle in mobile view
                const navbarCollapse = document.getElementById("navbarNav");
                if (navbarCollapse.classList.contains("show")) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });

    exploreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Highlight Departments in nav
        navLinks.forEach(l => l.classList.remove("active"));
        const deptLink = Array.from(navLinks).find(l => l.getAttribute("data-scroll") === "departments-section");
        if (deptLink) deptLink.classList.add("active");
        
        document.getElementById("departments-section")?.scrollIntoView({ behavior: "smooth" });
    });

    studentLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("login-page");
        setTimeout(() => {
            loginUsername.focus();
        }, 150);
    });

    // Department Details Modal trigger
    const deptCards = document.querySelectorAll(".dept-card-clickable");
    const deptModalEl = document.getElementById("departmentModal");
    if (deptCards.length > 0 && deptModalEl) {
        const departmentModal = new bootstrap.Modal(deptModalEl);
        deptCards.forEach(card => {
            card.addEventListener("click", () => {
                const deptKey = card.getAttribute("data-dept");
                const deptData = window.MockDB.getDepartmentDetails(deptKey);
                if (deptData) {
                    // Populate Modal Elements
                    document.getElementById("dept-modal-title").textContent = deptData.name;
                    document.getElementById("dept-modal-subtitle").textContent = deptData.programs.map(p => p.split(" (")[0]).join(", ");
                    
                    const iconContainer = document.getElementById("dept-modal-icon");
                    iconContainer.className = `fs-1 px-3 py-2 rounded-3 ${deptData.icon}`;
                    
                    // Clear and populate programs list
                    const programsList = document.getElementById("dept-modal-programs");
                    programsList.innerHTML = "";
                    deptData.programs.forEach(prog => {
                        const li = document.createElement("li");
                        li.className = "mb-2 d-flex align-items-center gap-2 text-secondary-emphasis small";
                        li.innerHTML = `<i class="bi bi-patch-check-fill text-success"></i><span>${prog}</span>`;
                        programsList.appendChild(li);
                    });
                    
                    document.getElementById("dept-modal-total-students").textContent = deptData.studentsCount;
                    document.getElementById("dept-modal-sections").textContent = `${deptData.sections} Sections`;
                    
                    document.getElementById("dept-modal-tuition-fee").textContent = deptData.tuitionFee;
                    document.getElementById("dept-modal-lab-fee").textContent = deptData.labFee;
                    document.getElementById("dept-modal-exam-fee").textContent = deptData.examFee;
                    document.getElementById("dept-modal-total-fee").textContent = deptData.totalFee;
                    
                    document.getElementById("dept-modal-facilities").textContent = deptData.facilities;
                    
                    // Show modal
                    departmentModal.show();
                }
            });
        });
    }

    // ----------------------------------------------------
    // AUTHENTICATION SYSTEM
    // ----------------------------------------------------
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = loginUsername.value.trim();
        const password = loginPassword.value;

        loginError.classList.add("d-none");
        const res = window.MockDB.authenticate(username, password);

        if (res.success) {
            currentUser = res;
            showToast(`Welcome back, ${res.name}!`, "success");
            
            // Adjust Nav UI
            adjustNavForRole(res.role);

            // Remember Me handler
            const rememberMe = document.getElementById("remember-me").checked;
            if (rememberMe) {
                localStorage.setItem("campusai_saved_username", username);
                localStorage.setItem("campusai_saved_password", password);
                localStorage.setItem("campusai_remember_me", "true");
            } else {
                localStorage.removeItem("campusai_saved_username");
                localStorage.removeItem("campusai_saved_password");
                localStorage.removeItem("campusai_remember_me");
            }

            // Redirection
            if (res.role === "ROLE_STUDENT") {
                currentStudent = window.MockDB.getStudentById(res.refId);
                navigateTo("student-dashboard");
            } else if (res.role === "ROLE_ADMIN") {
                navigateTo("admin-panel");
            }
            
            loginForm.reset();
            
            // Restore visual fields if credentials are saved
            if (rememberMe) {
                loginUsername.value = username;
                loginPassword.value = password;
                document.getElementById("remember-me").checked = true;
            }
        } else {
            loginError.textContent = res.message;
            loginError.classList.remove("d-none");
            showToast(res.message, "danger");
        }
    });

    // Google Sign-In Handler
    const googleLoginBtn = document.getElementById("google-login-btn");
    const googleLoginModalEl = document.getElementById("googleLoginModal");
    let googleLoginModal = null;
    if (googleLoginModalEl && googleLoginBtn) {
        googleLoginModal = new bootstrap.Modal(googleLoginModalEl);
        googleLoginBtn.addEventListener("click", () => {
            googleLoginModal.show();
        });

        const googleAccountOptions = googleLoginModalEl.querySelectorAll(".google-account-option");
        googleAccountOptions.forEach(btn => {
            btn.addEventListener("click", () => {
                const username = btn.getAttribute("data-username");
                const users = window.MockDB.getUsers();
                const matchedUser = users.find(u => u.username === username);
                
                if (matchedUser) {
                    const email = btn.getAttribute("data-email") || "rishikeshrs022@gmail.com";
                    // Personalize Student Profile if logging in as STUDENT001 via Google
                    if (username === "STUDENT001") {
                        const student = window.MockDB.getStudentById("STUDENT001");
                        if (student) {
                            student.name = "Rishi";
                            student.email = email;
                            window.MockDB.saveStudent(student);
                        }
                    } else if (matchedUser.role === "ROLE_ADMIN") {
                        matchedUser.email = email;
                        window.MockDB.saveUser(matchedUser);
                    }

                    const sessionUser = {
                        success: true,
                        username: matchedUser.username,
                        role: matchedUser.role,
                        refId: matchedUser.refId,
                        name: "Rishi"
                    };
                    currentUser = sessionUser;
                    showToast(`Signed in via Google as ${sessionUser.name}!`, "success");
                    
                    // Adjust Nav UI
                    adjustNavForRole(sessionUser.role);

                    // Redirection
                    if (sessionUser.role === "ROLE_STUDENT") {
                        currentStudent = window.MockDB.getStudentById(sessionUser.refId);
                        navigateTo("student-dashboard");
                    } else if (sessionUser.role === "ROLE_ADMIN") {
                        navigateTo("admin-panel");
                    }
                    
                    googleLoginModal.hide();
                } else {
                    showToast("Google Authentication failed. Mock User not found.", "danger");
                }
            });
        });
    }

    function logout() {
        showToast("Logged out successfully.", "info");
        currentUser = null;
        currentStudent = null;
        adjustNavForRole(null);
        navigateTo("landing-page");
    }

    // Attach logouts dynamically
    document.querySelectorAll(".logout-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    });

    function adjustNavForRole(role) {
        if (!role) {
            studentNavs.forEach(el => el.classList.add("d-none"));
            adminNavs.forEach(el => el.classList.add("d-none"));
            authNavs.forEach(el => el.classList.add("d-none"));
            anonNavs.forEach(el => el.classList.remove("d-none"));
        } else if (role === "ROLE_STUDENT") {
            studentNavs.forEach(el => el.classList.remove("d-none"));
            adminNavs.forEach(el => el.classList.add("d-none"));
            authNavs.forEach(el => el.classList.remove("d-none"));
            anonNavs.forEach(el => el.classList.add("d-none"));
        } else if (role === "ROLE_ADMIN") {
            studentNavs.forEach(el => el.classList.add("d-none"));
            adminNavs.forEach(el => el.classList.remove("d-none"));
            authNavs.forEach(el => el.classList.remove("d-none"));
            anonNavs.forEach(el => el.classList.add("d-none"));
        }
    }

    // Initialize nav state
    adjustNavForRole(null);

    // ----------------------------------------------------
    // CHATBOT WIDGET CONTROLLER
    // ----------------------------------------------------
    chatToggle.addEventListener("click", () => {
        chatWidget.classList.toggle("active");
        if (chatWidget.classList.contains("active")) {
            chatInput.focus();
            if (chatBody.children.length <= 1) {
                // Seed initial bot greeting
                addChatMessage("bot", "Hello! I am your CampusAI Virtual Assistant. How can I help you today? Feel free to ask about timings, fee structures, courses, placements, or exam schedules.");
            }
        }
    });

    chatClose.addEventListener("click", () => {
        chatWidget.classList.remove("active");
    });

    function addChatMessage(sender, text) {
        const msgWrapper = document.createElement("div");
        msgWrapper.className = `chat-message-wrapper ${sender === "user" ? "user" : "bot"}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        msgWrapper.innerHTML = `
            <div class="chat-message">
                <div class="message-content">${text}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;
        chatBody.appendChild(msgWrapper);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.className = "chat-message-wrapper bot typing-indicator-wrapper";
        indicator.id = "chat-typing-indicator";
        indicator.innerHTML = `
            <div class="chat-message typing-bubble">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const ind = document.getElementById("chat-typing-indicator");
        if (ind) ind.remove();
    }

    function submitChatQuery(queryText) {
        if (!queryText.trim()) return;
        
        addChatMessage("user", queryText);
        chatInput.value = "";
        
        addTypingIndicator();

        // Simulate network latency (800ms)
        setTimeout(() => {
            removeTypingIndicator();
            const result = window.MockDB.processQuery(queryText);
            addChatMessage("bot", result.answer);

            // Log chat history for analytics
            window.MockDB.saveChatMsg({
                studentId: currentUser ? currentUser.refId : "GUEST",
                question: queryText,
                answer: result.answer,
                topic: result.topic
            });

            // Speak response if unmuted
            window.VoiceAssistant.speak(result.answer);
        }, 800);
    }

    chatSend.addEventListener("click", () => {
        submitChatQuery(chatInput.value);
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            submitChatQuery(chatInput.value);
        }
    });

    quickReplies.forEach(btn => {
        btn.addEventListener("click", () => {
            submitChatQuery(btn.textContent.trim());
        });
    });

    // Voice Synthesis Volume toggle
    chatVolume.addEventListener("click", () => {
        const isMuted = window.VoiceAssistant.toggleMute();
        chatVolume.className = isMuted ? "bi bi-volume-mute-fill" : "bi bi-volume-up-fill text-primary";
        showToast(isMuted ? "Text-to-speech voice output muted." : "Voice assistant output unmuted.", "info");
    });

    // Voice recognition (Speech to Text) mic toggle
    chatMic.addEventListener("click", () => {
        window.VoiceAssistant.toggleListening();
    });

    // Hook Voice Assistant Callbacks
    window.VoiceAssistant.onResultCallback = (transcript) => {
        submitChatQuery(transcript);
    };

    window.VoiceAssistant.onStatusChangeCallback = ({ status }) => {
        if (status === "listening") {
            chatMic.className = "bi bi-mic-fill text-danger pulse-effect";
            chatInput.placeholder = "Listening...";
        } else {
            chatMic.className = "bi bi-mic-fill text-primary";
            chatInput.placeholder = "Ask anything about your college...";
        }
    };

    // ----------------------------------------------------
    // STUDENT DASHBOARD RENDERER
    // ----------------------------------------------------
    function renderStudentDashboard() {
        if (!currentStudent) return;

        // Profile Card details
        document.getElementById("stud-name").textContent = currentStudent.name;
        document.getElementById("stud-id").textContent = currentStudent.id;
        document.getElementById("stud-dept").textContent = currentStudent.department;
        document.getElementById("stud-year").textContent = `${currentStudent.year}rd Year`;
        document.getElementById("stud-email").textContent = currentStudent.email;
        document.getElementById("stud-phone").textContent = currentStudent.phone;

        // Attendance Percentage (Radial)
        const percent = currentStudent.attendance;
        const offset = 251.2 - (251.2 * percent) / 100;
        document.getElementById("attendance-circle").style.strokeDashoffset = offset;
        document.getElementById("attendance-percentage").textContent = `${percent}%`;

        // Attendance list rendering
        const attendList = document.getElementById("attendance-subject-list");
        attendList.innerHTML = "";
        currentStudent.attendanceDetails.forEach(subject => {
            const barClass = subject.percent >= 85 ? "bg-success" : (subject.percent >= 75 ? "bg-info" : "bg-danger");
            attendList.innerHTML += `
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span>${subject.subject}</span>
                        <small class="text-secondary">${subject.attended}/${subject.total} hrs (${subject.percent}%)</small>
                    </div>
                    <div class="progress progress-custom" style="height: 6px;">
                        <div class="progress-bar ${barClass}" role="progressbar" style="width: ${subject.percent}%"></div>
                    </div>
                </div>
            `;
        });

        // Academic details
        document.getElementById("student-cgpa").textContent = currentStudent.cgpa.toFixed(2);
        
        // Render marks sheet table
        const marksBody = document.getElementById("student-marks-body");
        marksBody.innerHTML = "";
        currentStudent.marks.forEach(item => {
            marksBody.innerHTML += `
                <tr>
                    <td><b>${item.subject}</b></td>
                    <td class="text-center">${item.test1}</td>
                    <td class="text-center">${item.test2}</td>
                    <td class="text-center">${item.model}</td>
                    <td class="text-center fw-bold text-gradient">${calculateGrade(item.model)}</td>
                </tr>
            `;
        });

        // Notices Board rendering
        const noticeList = document.getElementById("dashboard-notice-list");
        noticeList.innerHTML = "";
        const notices = window.MockDB.getNotices();
        notices.forEach(notice => {
            noticeList.innerHTML += `
                <div class="glass-card mb-3 p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0 text-white font-semibold">${notice.title}</h6>
                        <span class="badge bg-purple-glow font-medium">${notice.category}</span>
                    </div>
                    <p class="text-secondary small mb-2 text-truncate-3">${notice.content}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>${notice.date}</small>
                        <button class="btn btn-sm btn-outline-primary analyze-notice-btn" data-id="${notice.id}">
                            <i class="bi bi-cpu me-1"></i>Analyze Notice
                        </button>
                    </div>
                </div>
            `;
        });

        // Attach notice analyzer modal listeners
        document.querySelectorAll(".analyze-notice-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const noticeId = btn.getAttribute("data-id");
                const notice = window.MockDB.getNotices().find(n => n.id === noticeId);
                if (notice) {
                    openNoticeAnalyzer(notice);
                }
            });
        });

        // Events list rendering
        const eventList = document.getElementById("dashboard-events-list");
        eventList.innerHTML = "";
        const events = window.MockDB.getEvents();
        events.forEach(evt => {
            eventList.innerHTML += `
                <div class="d-flex align-items-center mb-3">
                    <div class="flex-shrink-0 text-center px-2 py-1 bg-primary bg-opacity-20 border border-primary border-opacity-30 rounded me-3" style="min-width: 60px;">
                        <span class="d-block fw-bold text-primary small">${evt.date.split("-")[2]}</span>
                        <span class="d-block text-muted small">${new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                        <h6 class="mb-0 text-white font-semibold">${evt.title}</h6>
                        <small class="text-secondary">${evt.time} | ${evt.location}</small>
                    </div>
                </div>
            `;
        });

        // Placement statistics
        renderPlacementList();

        // Performance Predictor Card details
        renderPerformancePrediction();

        // Career Assistant details
        renderCareerPathData();
    }

    function calculateGrade(marks) {
        if (marks >= 90) return "S";
        if (marks >= 80) return "A";
        if (marks >= 70) return "B";
        if (marks >= 60) return "C";
        if (marks >= 50) return "D";
        return "F";
    }

    // ----------------------------------------------------
    // NOTICE ANALYZER MODAL CONTROLLER
    // ----------------------------------------------------
    function openNoticeAnalyzer(notice) {
        noticeModalTitle.textContent = "AI Smart Notice Analyzer";
        noticeOriginalText.innerHTML = `<h5 class="text-white mb-2">${notice.title}</h5><p>${notice.content}</p>`;
        
        noticeSummaryText.innerHTML = `
            <div class="text-center py-4 text-primary">
                <div class="spinner-border text-primary mb-2" role="status"></div>
                <div class="small">AI analyzing and summarizing announcement contents...</div>
            </div>
        `;
        noticeModal.show();

        // Simulate AI Summary Latency (1.5 seconds)
        setTimeout(() => {
            noticeSummaryText.innerHTML = `
                <h6 class="text-success mb-2"><i class="bi bi-check-circle-fill me-2"></i>Summary Analytics (Key Takeaways)</h6>
                <ul class="mb-0">
                    ${notice.summary.split(". ").map(sentence => sentence.trim() ? `<li>${sentence}</li>` : '').join('')}
                </ul>
            `;
        }, 1500);
    }

    // ----------------------------------------------------
    // PERFORMANCE PREDICTION CONTROLLER
    // ----------------------------------------------------
    function renderPerformancePrediction() {
        if (!currentStudent) return;

        const container = document.getElementById("performance-predictor-content");
        const currentCgpa = currentStudent.cgpa;
        const attendance = currentStudent.attendance;

        let predictedGpa = 0;
        let predictionHtml = "";
        let adviceList = [];

        // Simple Grade predictor heuristic
        if (attendance >= 90) {
            predictedGpa = currentCgpa + 0.25;
            adviceList.push("Your excellent attendance (90%+) is a key driver for higher grades. Keep it up!");
        } else if (attendance >= 75) {
            predictedGpa = currentCgpa;
            adviceList.push("Attendance is stable (75%-90%). Increasing it above 85% could boost your GPA by up to 0.3 grade points.");
        } else {
            predictedGpa = currentCgpa - 0.5;
            adviceList.push("<b>CRITICAL ALERT:</b> Attendance is below 75% threshold. You are in danger of exam debarment. Attend all upcoming lectures!");
        }

        // Cap GPA at 10.0
        predictedGpa = Math.min(10.0, Math.max(0.0, predictedGpa));

        if (currentCgpa >= 8.5) {
            predictionHtml = `<h3 class="text-success font-bold mb-1">${predictedGpa.toFixed(2)}</h3><span class="badge bg-success bg-opacity-20 text-success mb-3">Excellent Standings</span>`;
            adviceList.push("Join advanced project groups and look for R&D internship placements.");
            adviceList.push("Study Core Networks and Database topics to clear technical coding rounds.");
        } else if (currentCgpa >= 7.0) {
            predictionHtml = `<h3 class="text-info font-bold mb-1">${predictedGpa.toFixed(2)}</h3><span class="badge bg-info bg-opacity-20 text-info mb-3">Good Standings</span>`;
            adviceList.push("Focus on subject internal assessments to raise CGPA above 8.0.");
            adviceList.push("Increase time on Web Technology mock coding sheets.");
        } else {
            predictionHtml = `<h3 class="text-warning font-bold mb-1">${predictedGpa.toFixed(2)}</h3><span class="badge bg-warning bg-opacity-20 text-warning mb-3">Needs Improvement</span>`;
            adviceList.push("Meet course faculty coordinators for targeted tutorial sheets.");
            adviceList.push("Set daily coding targets for at least 1 hour on key DSA topics.");
        }

        container.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-5 text-center border-end border-secondary border-opacity-30">
                    <small class="text-secondary d-block mb-1">Predicted Next Semester GPA</small>
                    ${predictionHtml}
                    <div class="small text-muted">Estimated based on current CGPA (${currentCgpa}) and Attendance (${attendance}%)</div>
                </div>
                <div class="col-md-7 ps-md-4 mt-3 mt-md-0">
                    <h6 class="text-white font-semibold mb-2"><i class="bi bi-lightbulb-fill text-warning me-1"></i>AI Suggested Action Steps:</h6>
                    <ul class="small text-secondary mb-0 ps-3">
                        ${adviceList.map(adv => `<li class="mb-1">${adv}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // ----------------------------------------------------
    // CAREER PATH CONTROLLER
    // ----------------------------------------------------
    careerSelect.addEventListener("change", (e) => {
        selectedCareerKey = e.target.value;
        renderCareerPathData();
    });

    function renderCareerPathData() {
        const path = window.MockDB.getCareerPath(selectedCareerKey);
        if (!path) return;

        careerTitle.textContent = path.title;
        
        careerSkills.innerHTML = "";
        path.skills.forEach(skill => {
            careerSkills.innerHTML += `<span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 m-1 font-medium py-2 px-3">${skill}</span>`;
        });

        careerCourses.innerHTML = "";
        path.courses.forEach(course => {
            careerCourses.innerHTML += `
                <li class="d-flex align-items-center mb-2">
                    <i class="bi bi-play-circle-fill text-purple me-2"></i>
                    <span class="text-secondary small">${course}</span>
                </li>
            `;
        });

        careerRoadmap.innerHTML = `
            <div class="alert bg-purple bg-opacity-10 border border-purple border-opacity-20 text-purple small mb-0">
                <i class="bi bi-compass-fill me-2"></i><b>Recommended Path:</b> ${path.roadmap}
            </div>
        `;
    }

    // ----------------------------------------------------
    // PLACEMENTS RENDERER
    // ----------------------------------------------------
    function renderPlacementList() {
        const plcList = document.getElementById("student-placements-list");
        plcList.innerHTML = "";

        const recruiters = [
            { company: "Google", date: "2026-08-24", minCgpa: 8.5, dept: ["Computer Science & BCA", "Mathematics"], role: "Software Engineer" },
            { company: "TCS Digital", date: "2026-09-02", minCgpa: 7.0, dept: ["All"], role: "Graduate Trainee" },
            { company: "Cognizant", date: "2026-09-15", minCgpa: 6.5, dept: ["All"], role: "Programmer Analyst" },
            { company: "Deloitte", date: "2026-10-05", minCgpa: 8.0, dept: ["Commerce & BBA", "Mathematics"], role: "Financial Analyst" }
        ];

        recruiters.forEach(rec => {
            const isEligibleCgpa = currentStudent.cgpa >= rec.minCgpa;
            const isEligibleDept = rec.dept.includes("All") || rec.dept.includes(currentStudent.department);
            const isEligible = isEligibleCgpa && isEligibleDept;

            const eligibilityBadge = isEligible 
                ? '<span class="badge bg-success bg-opacity-20 text-success">Eligible</span>' 
                : '<span class="badge bg-danger bg-opacity-20 text-danger">Not Eligible</span>';

            plcList.innerHTML += `
                <div class="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-20 py-2">
                    <div>
                        <h6 class="mb-0 text-white font-semibold">${rec.company}</h6>
                        <small class="text-secondary">${rec.role} | Drive: ${rec.date}</small>
                    </div>
                    <div class="text-end">
                        ${eligibilityBadge}
                        <div class="small text-muted mt-1">Min: ${rec.minCgpa} CGPA</div>
                    </div>
                </div>
            `;
        });
    }

    // ----------------------------------------------------
    // ADMIN PANEL SUBVIEWS ROUTING
    // ----------------------------------------------------
    adminSidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const subviewId = link.getAttribute("data-admin-target");

            adminSidebarLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            adminSubviews.forEach(view => {
                view.classList.remove("active");
                if (view.id === subviewId) {
                    view.classList.add("active");
                }
            });

            if (subviewId === "admin-analytics") {
                drawAnalyticsCharts();
            }
        });
    });

    function renderAdminPanel() {
        renderAdminStudentsList();
    }

    function renderAdminStudentsList() {
        const tbody = document.getElementById("admin-students-table-body");
        tbody.innerHTML = "";
        const students = window.MockDB.getStudents();

        students.forEach(stud => {
            tbody.innerHTML += `
                <tr>
                    <td><b>${stud.id}</b></td>
                    <td>${stud.name}</td>
                    <td>${stud.department}</td>
                    <td class="text-center">${stud.year}</td>
                    <td class="text-center">${stud.attendance}%</td>
                    <td class="text-center">${stud.cgpa.toFixed(2)}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-danger delete-student-btn" data-id="${stud.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        // Delete Student Click events
        document.querySelectorAll(".delete-student-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const studId = btn.getAttribute("data-id");
                if (confirm(`Are you sure you want to delete student ${studId}?`)) {
                    window.MockDB.deleteStudent(studId);
                    showToast(`Student ${studId} deleted successfully.`, "success");
                    renderAdminStudentsList();
                }
            });
        });
    }

    // Admin Add Student Form submit
    addStudentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = document.getElementById("add-stud-id").value.trim();
        const name = document.getElementById("add-stud-name").value.trim();
        const email = document.getElementById("add-stud-email").value.trim();
        const dept = document.getElementById("add-stud-dept").value;
        const year = parseInt(document.getElementById("add-stud-year").value);
        const cgpa = parseFloat(document.getElementById("add-stud-cgpa").value);
        const attendance = parseFloat(document.getElementById("add-stud-attendance").value);
        const phone = document.getElementById("add-stud-phone").value.trim();

        // Check if student id or username already exists
        if (window.MockDB.getStudentById(id)) {
            showToast("A student with this Register Number already exists.", "danger");
            return;
        }

        const newStudent = {
            id, name, email, department: dept, year, phone, attendance, cgpa,
            password: "password123", // default password
            attendanceDetails: [
                { subject: "Core Subject A", attended: 35, total: 40, percent: 87.5 },
                { subject: "Core Subject B", attended: 32, total: 40, percent: 80.0 }
            ],
            semesterDetails: [
                { sem: 1, gpa: cgpa }
            ],
            marks: [
                { subject: "Core Subject A", test1: 85, test2: 80, model: 82 },
                { subject: "Core Subject B", test1: 78, test2: 84, model: 81 }
            ]
        };

        const newUser = {
            id: "U" + Date.now(),
            username: id,
            password: "password123",
            role: "ROLE_STUDENT",
            refId: id
        };

        window.MockDB.saveStudent(newStudent);
        window.MockDB.saveUser(newUser);

        showToast(`Student ${name} successfully enrolled!`, "success");
        addStudentForm.reset();
        renderAdminStudentsList();

        // Navigate back to student table view
        document.querySelector('[data-admin-target="admin-students"]').click();
    });

    // Admin Add Notice submit
    addNoticeForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("add-notice-title").value.trim();
        const category = document.getElementById("add-notice-category").value;
        const content = document.getElementById("add-notice-content").value.trim();

        const words = content.split(" ");
        const summary = words.slice(0, 15).join(" ") + "..."; // crude extractive notice analyzer generator

        const newNotice = {
            id: "NOTICE" + Date.now(),
            title, date: new Date().toISOString().substring(0, 10),
            category, content, summary
        };

        window.MockDB.saveNotice(newNotice);
        showToast("Notice announcement published successfully!", "success");
        addNoticeForm.reset();

        document.querySelector('[data-admin-target="admin-notices"]').click();
    });

    // Admin Add Event submit
    addEventForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("add-event-title").value.trim();
        const date = document.getElementById("add-event-date").value;
        const time = document.getElementById("add-event-time").value;
        const location = document.getElementById("add-event-location").value.trim();
        const desc = document.getElementById("add-event-desc").value.trim();

        const newEvent = {
            id: "EVENT" + Date.now(),
            title, date, time, location, desc
        };

        window.MockDB.saveEvent(newEvent);
        showToast("College event added to calendar!", "success");
        addEventForm.reset();

        document.querySelector('[data-admin-target="admin-events"]').click();
    });

    // ----------------------------------------------------
    // CHATBOT ANALYTICS (CANVAS-BASED RENDERER)
    // ----------------------------------------------------
    function drawAnalyticsCharts() {
        const stats = window.MockDB.getChatbotAnalytics();

        // 1. Draw Topic Donut Chart
        const topicCanvas = document.getElementById("chart-topic-analytics");
        if (topicCanvas) {
            const ctx = topicCanvas.getContext("2d");
            ctx.clearRect(0, 0, topicCanvas.width, topicCanvas.height);

            // Filter out 0 count topics
            const data = [];
            const labels = [];
            const colors = ["#3b82f6", "#a855f7", "#ec4899", "#10b981", "#f59e0b", "#6366f1", "#ef4444", "#14b8a6", "#8b5cf6", "#f43f5e", "#6b7280"];
            
            let colorIdx = 0;
            const sliceColors = [];
            
            for (const key in stats.topics) {
                if (stats.topics[key] > 0) {
                    data.push(stats.topics[key]);
                    labels.push(key.toUpperCase());
                    sliceColors.push(colors[colorIdx % colors.length]);
                    colorIdx++;
                }
            }

            // Fallback if no logs
            if (data.length === 0) {
                data.push(1);
                labels.push("NO DATA");
                sliceColors.push("#4b5563");
            }

            const total = data.reduce((sum, val) => sum + val, 0);
            const centerX = topicCanvas.width / 2;
            const centerY = topicCanvas.height / 2 - 20;
            const radius = Math.min(centerX, centerY) - 20;
            
            let startAngle = 0;

            // Draw donut slices
            for (let i = 0; i < data.length; i++) {
                const sliceAngle = (data[i] / total) * 2 * Math.PI;

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                ctx.arc(centerX, centerY, radius * 0.6, startAngle + sliceAngle, startAngle, true);
                ctx.closePath();

                ctx.fillStyle = sliceColors[i];
                ctx.fill();

                startAngle += sliceAngle;
            }

            // Central total count text
            ctx.fillStyle = isDarkMode ? "#ffffff" : "#0f172a";
            ctx.font = "bold 20px Outfit, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(total, centerX, centerY);
            ctx.font = "11px Inter, sans-serif";
            ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b";
            ctx.fillText("CHATS", centerX, centerY + 16);

            // Draw Legend
            const legendY = topicCanvas.height - 40;
            ctx.font = "10px Inter, sans-serif";
            ctx.textAlign = "left";
            
            let legendX = 10;
            for (let i = 0; i < data.length; i++) {
                if (legendX > topicCanvas.width - 80) break; // prevent wrapping overflow

                ctx.fillStyle = sliceColors[i];
                ctx.fillRect(legendX, legendY, 8, 8);
                
                ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b";
                ctx.fillText(`${labels[i]} (${data[i]})`, legendX + 12, legendY + 5);

                legendX += 85;
            }
        }

        // 2. Draw Activity Bar Chart
        const activityCanvas = document.getElementById("chart-activity-analytics");
        if (activityCanvas) {
            const ctx = activityCanvas.getContext("2d");
            ctx.clearRect(0, 0, activityCanvas.width, activityCanvas.height);

            // Timeline calculations
            const dates = Object.keys(stats.timeline).sort();
            const counts = dates.map(d => stats.timeline[d]);

            // Default fallback if no dates
            if (dates.length === 0) {
                const today = new Date().toISOString().substring(0, 10);
                dates.push(today);
                counts.push(0);
            }

            const paddingLeft = 40;
            const paddingBottom = 40;
            const paddingTop = 20;
            const paddingRight = 20;

            const chartWidth = activityCanvas.width - paddingLeft - paddingRight;
            const chartHeight = activityCanvas.height - paddingBottom - paddingTop;

            const maxCount = Math.max(...counts, 5); // ensure scale handles smaller values

            // Draw axes
            ctx.strokeStyle = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(paddingLeft, paddingTop);
            ctx.lineTo(paddingLeft, activityCanvas.height - paddingBottom);
            ctx.lineTo(activityCanvas.width - paddingRight, activityCanvas.height - paddingBottom);
            ctx.stroke();

            // Y Axis Labels & Grid
            ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b";
            ctx.font = "10px Inter, sans-serif";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            const yLines = 4;
            for (let i = 0; i <= yLines; i++) {
                const val = Math.round((maxCount / yLines) * i);
                const y = activityCanvas.height - paddingBottom - (chartHeight / yLines) * i;
                
                ctx.fillText(val, paddingLeft - 8, y);
                
                // Grid lines
                ctx.beginPath();
                ctx.moveTo(paddingLeft, y);
                ctx.lineTo(activityCanvas.width - paddingRight, y);
                ctx.strokeStyle = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
                ctx.stroke();
            }

            // Draw Bars
            const barWidth = Math.min(30, (chartWidth / dates.length) * 0.6);
            const colWidth = chartWidth / dates.length;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";

            for (let i = 0; i < dates.length; i++) {
                const count = counts[i];
                const barHeight = (count / maxCount) * chartHeight;
                const x = paddingLeft + (colWidth * i) + (colWidth / 2);
                const y = activityCanvas.height - paddingBottom - barHeight;

                // Gradient fill
                const gradient = ctx.createLinearGradient(0, y, 0, activityCanvas.height - paddingBottom);
                gradient.addColorStop(0, "#a855f7"); // purple
                gradient.addColorStop(1, "#3b82f6"); // blue

                ctx.fillStyle = gradient;
                
                // Draw rounded top bar
                ctx.beginPath();
                ctx.roundRect(x - barWidth / 2, y, barWidth, barHeight, [4, 4, 0, 0]);
                ctx.fill();

                // Draw values on top of bar
                if (count > 0) {
                    ctx.fillStyle = isDarkMode ? "#ffffff" : "#0f172a";
                    ctx.fillText(count, x, y - 12);
                }

                // X Axis labels (Dates)
                ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b";
                const dateParts = dates[i].split("-");
                const label = `${dateParts[2]}/${dateParts[1]}`;
                ctx.fillText(label, x, activityCanvas.height - paddingBottom + 8);
            }
        }
    }

    // ----------------------------------------------------
    // TOAST NOTIFICATIONS UTILITY
    // ----------------------------------------------------
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast-custom ${type} d-flex align-items-center justify-content-between p-3 mb-2 animate-fade-in`;
        
        let icon = "bi-info-circle-fill";
        if (type === "success") icon = "bi-check-circle-fill";
        if (type === "warning") icon = "bi-exclamation-triangle-fill";
        if (type === "danger") icon = "bi-exclamation-octagon-fill";

        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi ${icon} me-2 fs-5"></i>
                <span class="small">${message}</span>
            </div>
            <button type="button" class="btn-close btn-close-white ms-2" style="font-size: 0.75rem;"></button>
        `;
        
        toastContainer.appendChild(toast);

        // Bind Close button
        toast.querySelector(".btn-close").addEventListener("click", () => {
            toast.remove();
        });

        // Auto remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.add("fade-out");
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // SPA Routing Handler for Back/Forward navigation
    window.addEventListener("popstate", () => {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        if (path === "/login-page" || hash === "#login" || hash === "#login-page") {
            navigateTo("login-page");
        } else if (path === "/student-dashboard" || hash === "#student-dashboard") {
            navigateTo("student-dashboard");
        } else if (path === "/admin-panel" || hash === "#admin-panel") {
            navigateTo("admin-panel");
        } else {
            navigateTo("landing-page");
        }
    });

    // Handle initial route on page load
    function handleInitialRoute() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        if (path === "/login-page" || hash === "#login" || hash === "#login-page") {
            navigateTo("login-page");
        } else if (path === "/student-dashboard" || hash === "#student-dashboard") {
            navigateTo("student-dashboard");
        } else if (path === "/admin-panel" || hash === "#admin-panel") {
            navigateTo("admin-panel");
        } else {
            navigateTo("landing-page");
        }
    }

    // Run initial routing logic
    handleInitialRoute();
});
