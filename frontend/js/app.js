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
    
    // Login Tab Switcher Elements
    let loginRole = "student"; 
    const tabStudent = document.getElementById("login-tab-student");
    const tabAdmin = document.getElementById("login-tab-admin");
    const usernameLabel = document.querySelector('label[for="login-username"]');

    // Landing Page CTAs
    const exploreBtn = document.getElementById("explore-btn");

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
    // PRELOADER & INITIAL SETUP & REAL-TIME CLOCK
    // ----------------------------------------------------
    function updateDashboardTime() {
        const timeEl = document.getElementById("dash-current-time");
        if (timeEl) {
            const now = new Date();
            const options = {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            timeEl.innerHTML = `<i class="bi bi-clock me-2"></i>${now.toLocaleString('en-US', options)}`;
        }

        const studTimeEl = document.getElementById("stud-banner-time");
        if (studTimeEl) {
            const now = new Date();
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayEl = document.getElementById("stud-banner-day");
            const dateEl = document.getElementById("stud-banner-date");
            
            if (dayEl) dayEl.textContent = days[now.getDay()];
            if (dateEl) {
                dateEl.textContent = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            }
            studTimeEl.textContent = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        }
    }
    updateDashboardTime();
    setInterval(updateDashboardTime, 1000);

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

    // Role Tab Switcher Event Listeners
    if (tabStudent && tabAdmin) {
        tabStudent.addEventListener("click", () => {
            loginRole = "student";
            tabStudent.classList.add("active-tab");
            tabAdmin.classList.remove("active-tab");
            if (usernameLabel) usernameLabel.textContent = "Student ID / Username";
            loginUsername.placeholder = "Username or Student ID";
            loginError.classList.add("d-none");
        });

        tabAdmin.addEventListener("click", () => {
            loginRole = "admin";
            tabAdmin.classList.add("active-tab");
            tabStudent.classList.remove("active-tab");
            if (usernameLabel) usernameLabel.textContent = "Administrator Username";
            loginUsername.placeholder = "Username or Student ID";
            loginError.classList.add("d-none");
        });
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
            // Reset to Dashboard subview by default
            const defaultTab = document.querySelector('[data-student-target="stud-dash-home"]');
            if (defaultTab) defaultTab.click();
        } else if (viewId === "admin-panel") {
            renderAdminPanel();
            const adminNameEl = document.getElementById("admin-sidebar-name");
            if (adminNameEl && currentUser) {
                adminNameEl.textContent = currentUser.name;
            }
            // Reset to Dashboard subview by default
            const defaultTab = document.querySelector('[data-admin-target="admin-dashboard"]');
            if (defaultTab) defaultTab.click();
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

    // ----------------------------------------------------
    // STUDENT PORTAL ROUTING & ACTIONS BINDINGS
    // ----------------------------------------------------
    const studentSidebarLinks = document.querySelectorAll(".student-sidebar-link");
    const studentSubviews = document.querySelectorAll(".student-subview");

    studentSidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const subviewId = link.getAttribute("data-student-target");

            studentSidebarLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            studentSubviews.forEach(view => {
                view.classList.remove("active");
                view.classList.add("d-none");
                if (view.id === subviewId) {
                    view.classList.remove("d-none");
                    view.classList.add("active");
                }
            });

            // Set dynamic title in topbar
            const subviewTitle = link.textContent.trim();
            document.getElementById("student-subview-title").textContent = subviewTitle;
        });
    });

    // Quick Access click routers
    document.querySelectorAll(".quick-access-tile").forEach(tile => {
        tile.addEventListener("click", () => {
            const target = tile.getAttribute("data-student-target");
            const correspondingLink = document.querySelector(`.student-sidebar-link[data-student-target="${target}"]`);
            if (correspondingLink) {
                correspondingLink.click();
            }
        });
    });

    // Promo Chatbot buttons click handlers
    const promoChatbotBtn = document.getElementById("btn-stud-promo-chatbot");
    const helpChatbotBtn = document.getElementById("btn-stud-help-chatbot");
    
    if (promoChatbotBtn) {
        promoChatbotBtn.addEventListener("click", () => {
            const chatbotLink = document.querySelector('.student-sidebar-link[data-student-target="stud-chatbot-view"]');
            if (chatbotLink) chatbotLink.click();
        });
    }
    if (helpChatbotBtn) {
        helpChatbotBtn.addEventListener("click", () => {
            const chatbotLink = document.querySelector('.student-sidebar-link[data-student-target="stud-chatbot-view"]');
            if (chatbotLink) chatbotLink.click();
        });
    }

    // Assignment submit upload panel
    window.showUploadForm = function(assignmentTitle) {
        document.getElementById("upload-assign-title").textContent = assignmentTitle;
        const uploadCollapse = document.getElementById("collapseAssignmentUpload");
        if (uploadCollapse) {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(uploadCollapse);
            bsCollapse.show();
        }
    };
    
    const assignmentForm = document.getElementById("assignment-upload-form");
    if (assignmentForm) {
        assignmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            showToast("Assignment uploaded successfully!", "success");
            assignmentForm.reset();
            bootstrap.Collapse.getOrCreateInstance(document.getElementById("collapseAssignmentUpload")).hide();
        });
    }

    // Full-screen Chatbot conversation form submit
    const studChatForm = document.getElementById("stud-full-chat-form");
    const studChatInput = document.getElementById("stud-full-chat-input");
    const studChatMessages = document.getElementById("stud-full-chat-messages");
    
    if (studChatForm) {
        studChatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = studChatInput.value.trim();
            if (!text) return;
            
            // Add user message
            studChatMessages.innerHTML += `
                <div class="chat-message user-msg">${text}</div>
            `;
            studChatInput.value = "";
            studChatMessages.scrollTop = studChatMessages.scrollHeight;
            
            // Generate bot response
            setTimeout(() => {
                const response = window.MockDB.processQuery(text);
                studChatMessages.innerHTML += `
                    <div class="chat-message bot-msg">${response.answer}</div>
                `;
                studChatMessages.scrollTop = studChatMessages.scrollHeight;
                
                // Track analytics
                window.MockDB.saveChatMessage({
                    text,
                    sender: "student",
                    topic: response.topic,
                    timestamp: new Date().toISOString()
                });
            }, 500);
        });
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

    // Dynamic Department Details Modal triggers & Dynamic Landing Cards
    const deptModalEl = document.getElementById("departmentModal");
    let departmentModalObj = null;
    if (deptModalEl) {
        departmentModalObj = new bootstrap.Modal(deptModalEl);
    }
    
    window.openDeptDetailsModal = function(deptKey) {
        try {
            const deptData = window.MockDB.getDepartmentDetails(deptKey);
            if (!deptData) {
                console.error("Department details not found for key:", deptKey);
                showToast("Department details are currently unavailable.", "warning");
                return;
            }
            if (!departmentModalObj) {
                const deptModalEl = document.getElementById("departmentModal");
                if (deptModalEl) {
                    departmentModalObj = bootstrap.Modal.getOrCreateInstance(deptModalEl);
                }
            }
            if (deptData && departmentModalObj) {
                // Populate Modal Elements
                document.getElementById("dept-modal-title").textContent = deptData.name;
                document.getElementById("dept-modal-subtitle").textContent = (deptData.programs || []).map(p => p.split(" (")[0]).join(", ");
                
                const iconContainer = document.getElementById("dept-modal-icon");
                if (iconContainer) {
                    iconContainer.className = `fs-1 px-3 py-2 rounded-3 ${deptData.icon || "bi bi-pc-display"}`;
                }
                
                // Clear and populate programs list
                const programsList = document.getElementById("dept-modal-programs");
                if (programsList) {
                    programsList.innerHTML = "";
                    (deptData.programs || []).forEach(prog => {
                        const li = document.createElement("li");
                        li.className = "mb-2 d-flex align-items-center gap-2 small";
                        li.innerHTML = `<i class="bi bi-patch-check-fill text-success"></i><span>${prog}</span>`;
                        programsList.appendChild(li);
                    });
                }
                
                document.getElementById("dept-modal-total-students").textContent = deptData.studentsCount || 0;
                document.getElementById("dept-modal-sections").textContent = `${deptData.sections || 0} Sections`;
                
                document.getElementById("dept-modal-tuition-fee").textContent = deptData.tuitionFee || "₹0";
                document.getElementById("dept-modal-lab-fee").textContent = deptData.labFee || "₹0";
                document.getElementById("dept-modal-exam-fee").textContent = deptData.examFee || "₹0";
                document.getElementById("dept-modal-total-fee").textContent = deptData.totalFee || "₹0";
                
                document.getElementById("dept-modal-facilities").textContent = deptData.facilities || "No facilities specified.";
                
                // Show modal
                departmentModalObj.show();
            }
        } catch (err) {
            console.error("Error opening department details modal:", err);
            showToast("Failed to load department details.", "danger");
        }
    };

    function renderLandingDepartments() {
        const grid = document.getElementById("departments-grid");
        if (!grid) return;
        
        const depts = window.MockDB.getDepartments();
        grid.innerHTML = "";
        
        Object.keys(depts).forEach(key => {
            const dept = depts[key];
            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4";
            col.innerHTML = `
                <div class="glass-card dept-card-clickable p-3 d-flex align-items-center gap-3" style="cursor: pointer;" onclick="window.openDeptDetailsModal('${key}')">
                    <div class="fs-2 px-3 py-2 rounded-3 ${dept.icon}"></div>
                    <div>
                        <h6 class="mb-1 text-white font-semibold">${dept.name}</h6>
                        <small class="text-muted text-truncate d-block" style="max-width: 220px;">${dept.programs.join(", ")}</small>
                    </div>
                </div>
            `;
            grid.appendChild(col);
        });
    }

    // Call dynamic landing rendering on startup
    renderLandingDepartments();

    // ----------------------------------------------------
    // AUTHENTICATION SYSTEM
    // ----------------------------------------------------
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = loginUsername.value.trim();
        const password = loginPassword.value;

        loginError.classList.add("d-none");

        // Validate selected portal
        if (loginRole === "student" && username.toLowerCase() === "admin") {
            loginError.textContent = "This is the Student Portal. Please click 'Admin Login' tab to sign in as Administrator.";
            loginError.classList.remove("d-none");
            showToast("Admin credentials entered in Student portal.", "warning");
            return;
        }

        if (loginRole === "admin" && username.toLowerCase().startsWith("student")) {
            loginError.textContent = "This is the Admin Portal. Please click 'Student Login' tab to sign in as Student.";
            loginError.classList.remove("d-none");
            showToast("Student credentials entered in Admin portal.", "warning");
            return;
        }

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
        googleLoginModal = bootstrap.Modal.getOrCreateInstance(googleLoginModalEl);
        
        const stepAccount = document.getElementById("google-step-account");
        const stepRole = document.getElementById("google-step-role");
        const stepCustom = document.getElementById("google-step-custom");
        const selectedEmailDisplay = document.getElementById("google-selected-email-display");
        const roleStudentBtn = document.getElementById("google-role-student-btn");
        const roleAdminBtn = document.getElementById("google-role-admin-btn");
        const roleBackBtn = document.getElementById("google-role-back-btn");

        const useAnotherBtn = document.getElementById("google-use-another-btn");
        const customNameInput = document.getElementById("google-custom-name");
        const customEmailInput = document.getElementById("google-custom-email");
        const customContinueBtn = document.getElementById("google-custom-continue-btn");
        const customBackBtn = document.getElementById("google-custom-back-btn");

        let selectedEmail = "";
        let selectedName = "";

        // Show Modal
        googleLoginBtn.addEventListener("click", () => {
            // Reset to step 1
            stepAccount.classList.remove("d-none");
            stepRole.classList.add("d-none");
            stepCustom.classList.add("d-none");
            if (customNameInput) customNameInput.value = "";
            if (customEmailInput) customEmailInput.value = "";
            googleLoginModal.show();
        });

        // Helper function to log in dynamically based on active tab
        function executeGoogleLogin(name, email) {
            const users = window.MockDB.getUsers();
            if (loginRole === "student") {
                const matchedUser = users.find(u => u.username === "STU2025001");
                if (matchedUser) {
                    const student = window.MockDB.getStudentById("STU2025001");
                    if (student) {
                        student.name = name;
                        student.email = email;
                        window.MockDB.saveStudent(student);
                    }

                    const sessionUser = {
                        success: true,
                        username: matchedUser.username,
                        role: matchedUser.role,
                        refId: matchedUser.refId,
                        name: name
                    };
                    currentUser = sessionUser;
                    currentStudent = window.MockDB.getStudentById(sessionUser.refId);
                    
                    showToast(`Signed in via Google as ${name}!`, "success");
                    adjustNavForRole(sessionUser.role);
                    navigateTo("student-dashboard");
                    googleLoginModal.hide();
                }
            } else {
                // loginRole === "admin"
                const matchedUser = users.find(u => u.username === "admin");
                if (matchedUser) {
                    matchedUser.email = email;
                    matchedUser.name = name;
                    window.MockDB.saveUser(matchedUser);

                    const sessionUser = {
                        success: true,
                        username: matchedUser.username,
                        role: matchedUser.role,
                        refId: matchedUser.refId,
                        name: name
                    };
                    currentUser = sessionUser;
                    
                    showToast(`Signed in via Google as ${name}!`, "success");
                    adjustNavForRole(sessionUser.role);
                    navigateTo("admin-panel");
                    googleLoginModal.hide();
                }
            }
        }

        // Step 1: Click account row
        const googleOAuthBtns = googleLoginModalEl.querySelectorAll(".google-oauth-btn");
        googleOAuthBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                selectedName = btn.getAttribute("data-name");
                selectedEmail = btn.getAttribute("data-email");

                // Log in immediately based on selected tab role
                executeGoogleLogin(selectedName, selectedEmail);
            });
        });

        // Step 1: Click "Use another account"
        if (useAnotherBtn) {
            useAnotherBtn.addEventListener("click", () => {
                stepAccount.classList.add("d-none");
                stepCustom.classList.remove("d-none");
            });
        }

        // Step 3: Back button
        if (customBackBtn) {
            customBackBtn.addEventListener("click", () => {
                stepAccount.classList.remove("d-none");
                stepCustom.classList.add("d-none");
            });
        }

        // Step 3: Continue button
        if (customContinueBtn) {
            customContinueBtn.addEventListener("click", () => {
                const nameVal = customNameInput.value.trim();
                const emailVal = customEmailInput.value.trim();

                if (!nameVal || !emailVal) {
                    showToast("Please enter both Name and Email address", "warning");
                    return;
                }

                // Log in immediately based on selected tab role
                executeGoogleLogin(nameVal, emailVal);
            });
        }
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
    // ----------------------------------------------------
    // STUDENT DASHBOARD RENDERER
    // ----------------------------------------------------
    function renderStudentDashboard() {
        if (!currentStudent) return;

        // 1. Topbar and Profile Header details
        const topbarName = document.getElementById("stud-topbar-name");
        const topbarDept = document.getElementById("stud-topbar-dept");
        const welcomeName = document.getElementById("stud-welcome-name");

        if (topbarName) topbarName.textContent = currentStudent.name;
        if (topbarDept) topbarDept.textContent = currentStudent.department;
        if (welcomeName) welcomeName.textContent = currentStudent.name.split(" ")[0];

        // Personal Details Subview
        const profName = document.getElementById("profile-stud-name");
        const profId = document.getElementById("profile-stud-id");
        const profDept = document.getElementById("profile-stud-dept");
        const profYear = document.getElementById("profile-stud-year");
        const profEmail = document.getElementById("profile-stud-email");
        const profPhone = document.getElementById("profile-stud-phone");

        if (profName) profName.textContent = currentStudent.name;
        if (profId) profId.textContent = currentStudent.id;
        if (profDept) profDept.textContent = currentStudent.department;
        if (profYear) profYear.textContent = currentStudent.year === 1 ? "I Year" : currentStudent.year === 2 ? "II Year" : currentStudent.year === 3 ? "III Year" : "IV Year";
        if (profEmail) profEmail.textContent = currentStudent.email;
        if (profPhone) profPhone.textContent = currentStudent.phone;

        // 2. Attendance Percentages (SVG Radials)
        const percent = currentStudent.attendance;
        const radialAttendance = document.getElementById("stud-radial-attendance");
        const textAttendance = document.getElementById("stud-text-attendance");
        const radialProfAttendance = document.getElementById("profile-radial-attendance");
        const textProfAttendance = document.getElementById("profile-text-attendance");

        if (radialAttendance) radialAttendance.setAttribute("stroke-dasharray", `${percent}, 100`);
        if (textAttendance) textAttendance.textContent = `${percent}%`;
        if (radialProfAttendance) radialProfAttendance.setAttribute("stroke-dasharray", `${percent}, 100`);
        if (textProfAttendance) textProfAttendance.textContent = `${percent}%`;

        // Attendance total days counter
        const totalClasses = currentStudent.attendanceDetails.reduce((sum, curr) => sum + curr.total, 0);
        const attendedClasses = currentStudent.attendanceDetails.reduce((sum, curr) => sum + curr.attended, 0);
        const attDaysEl = document.getElementById("stud-attendance-days");
        if (attDaysEl) attDaysEl.textContent = `${attendedClasses} / ${totalClasses} Hours`;

        // 3. CGPA Progress circle
        const cgpa = currentStudent.cgpa;
        const radialCgpa = document.getElementById("stud-radial-cgpa");
        const textCgpa = document.getElementById("stud-text-cgpa");
        if (radialCgpa) radialCgpa.setAttribute("stroke-dasharray", `${cgpa * 10}, 100`);
        if (textCgpa) textCgpa.textContent = cgpa.toFixed(2);

        // Subject counters
        const subjectCountEl = document.getElementById("stud-subjects-count");
        if (subjectCountEl) subjectCountEl.textContent = currentStudent.attendanceDetails.length;

        // 4. Render Subjects List Overview Table & Attendance Breakdown
        const subjectsBody = document.getElementById("stud-subjects-body");
        const attDetailBody = document.getElementById("stud-attendance-detail-body");
        const marksDetailBody = document.getElementById("stud-marks-detail-body");
        
        if (subjectsBody) subjectsBody.innerHTML = "";
        if (attDetailBody) attDetailBody.innerHTML = "";
        if (marksDetailBody) marksDetailBody.innerHTML = "";

        const defaultFacultyCoordinators = ["Mrs. Priya M", "Mr. Karthik S", "Mr. Arul V", "Dr. S. Vignesh", "Mrs. J. Geetha", "Dr. P. Krishnan"];

        currentStudent.attendanceDetails.forEach((subject, idx) => {
            const fac = defaultFacultyCoordinators[idx % defaultFacultyCoordinators.length];
            const code = `23IT40${idx + 1}`;
            const statusText = subject.percent >= 85 ? "Good" : (subject.percent >= 75 ? "Average" : "Low");
            const statusClass = subject.percent >= 85 ? "bg-success" : (subject.percent >= 75 ? "bg-warning" : "bg-danger");
            const attBarClass = subject.percent >= 85 ? "bg-success" : (subject.percent >= 75 ? "bg-info" : "bg-danger");

            if (subjectsBody) {
                subjectsBody.innerHTML += `
                    <tr>
                        <td><code>${code}</code></td>
                        <td><b>${subject.subject}</b></td>
                        <td>${fac}</td>
                        <td>
                            <div class="d-flex align-items-center gap-2">
                                <div class="progress flex-grow-1 bg-dark bg-opacity-25" style="height: 5px; min-width: 60px;">
                                    <div class="progress-bar ${attBarClass}" style="width: ${subject.percent}%;"></div>
                                </div>
                                <span class="small">${subject.percent}%</span>
                            </div>
                        </td>
                        <td><span class="badge ${statusClass} bg-opacity-20 text-${statusText === "Good" ? "success" : statusText === "Average" ? "warning" : "danger"}">${statusText}</span></td>
                    </tr>
                `;
            }

            if (attDetailBody) {
                attDetailBody.innerHTML += `
                    <tr>
                        <td><b>${subject.subject}</b></td>
                        <td>${subject.total} Hours</td>
                        <td>${subject.attended} Hours</td>
                        <td><span class="font-semibold text-white">${subject.percent}%</span></td>
                        <td><span class="text-success small"><i class="bi bi-check-circle-fill me-1"></i>Met Criteria</span></td>
                    </tr>
                `;
            }
        });

        // 5. Render Marks Summary
        const recordCgpa = document.getElementById("stud-record-cgpa");
        if (recordCgpa) recordCgpa.textContent = currentStudent.cgpa.toFixed(2);

        if (marksDetailBody) {
            currentStudent.marks.forEach(item => {
                marksDetailBody.innerHTML += `
                    <tr>
                        <td><b>${item.subject}</b></td>
                        <td class="text-center">${item.test1}</td>
                        <td class="text-center">${item.test2}</td>
                        <td class="text-center">${item.model}</td>
                        <td class="text-center fw-bold text-gradient">${calculateGrade(item.model)}</td>
                    </tr>
                `;
            });
        }

        // 6. Dynamic Notices List
        const dashNotices = document.getElementById("stud-dash-notices");
        const noticesContainer = document.getElementById("stud-notices-container");
        const notices = window.MockDB.getNotices();

        if (dashNotices) dashNotices.innerHTML = "";
        if (noticesContainer) noticesContainer.innerHTML = "";

        notices.forEach((notice, idx) => {
            const noticeCardHtml = `
                <div class="glass-card p-3 m-0" style="background: rgba(255,255,255,0.01);">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0 text-white font-semibold text-truncate small" style="max-width: 190px;">${notice.title}</h6>
                        <span class="badge bg-purple-glow font-medium" style="font-size: 0.65rem;">${notice.category}</span>
                    </div>
                    <p class="text-secondary small mb-2 text-truncate-2" style="font-size: 0.76rem;">${notice.content}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted" style="font-size: 0.7rem;"><i class="bi bi-calendar3 me-1"></i>${notice.date}</small>
                        <button class="btn btn-sm btn-outline-primary py-0.5 px-2 font-semibold analyze-notice-btn" style="font-size: 0.72rem;" data-id="${notice.id}">
                            <i class="bi bi-cpu me-1"></i>Analyze
                        </button>
                    </div>
                </div>
            `;
            if (dashNotices && idx < 3) {
                dashNotices.innerHTML += noticeCardHtml;
            }
            if (noticesContainer) {
                noticesContainer.innerHTML += noticeCardHtml;
            }
        });

        // Attach notice analyzer modal listeners to all generated buttons
        document.querySelectorAll(".analyze-notice-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const noticeId = btn.getAttribute("data-id");
                const notice = window.MockDB.getNotices().find(n => n.id === noticeId);
                if (notice) {
                    openNoticeAnalyzer(notice);
                }
            });
        });

        // 7. Dynamic Events Log Calendar
        const dashEvents = document.getElementById("stud-dash-events");
        const eventsContainer = document.getElementById("stud-events-container");
        const events = window.MockDB.getEvents();

        if (dashEvents) dashEvents.innerHTML = "";
        if (eventsContainer) eventsContainer.innerHTML = "";

        events.forEach((evt, idx) => {
            const dayNum = evt.date.split("-")[2];
            const monthStr = new Date(evt.date).toLocaleString('default', { month: 'short' }).toUpperCase();
            
            const eventCardHtml = `
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 text-center px-2 py-1 bg-primary bg-opacity-20 border border-primary border-opacity-30 rounded me-3" style="min-width: 55px;">
                        <span class="d-block fw-bold text-primary fs-5 lh-1">${dayNum}</span>
                        <span class="d-block text-muted small" style="font-size: 0.65rem;">${monthStr}</span>
                    </div>
                    <div class="text-start">
                        <h6 class="mb-0 text-white font-semibold small">${evt.title}</h6>
                        <small class="text-secondary" style="font-size: 0.72rem;">${evt.time} | ${evt.location}</small>
                    </div>
                </div>
            `;

            if (dashEvents && idx < 3) {
                dashEvents.innerHTML += eventCardHtml;
            }
            if (eventsContainer) {
                eventsContainer.innerHTML += `
                    <div class="glass-card p-3 d-flex align-items-center justify-content-between mb-2">
                        ${eventCardHtml}
                        <span class="badge bg-success bg-opacity-15 text-success">Upcoming</span>
                    </div>
                `;
            }
        });

        // 8. Render Library Book list
        const libBody = document.getElementById("stud-library-table-body");
        if (libBody) {
            libBody.innerHTML = "";
            const books = window.MockDB.getLibrary();
            books.forEach(b => {
                const statusClass = b.status === "Available" ? "bg-success-glow text-success" : "bg-warning-glow text-warning";
                libBody.innerHTML += `
                    <tr>
                        <td><span class="font-semibold text-purple">${b.id}</span></td>
                        <td>${b.title}</td>
                        <td>${b.author}</td>
                        <td>${b.department}</td>
                        <td><span class="badge ${statusClass}">${b.status}</span></td>
                    </tr>
                `;
            });
        }

        // 9. Load dynamic Fees Struktur
        const depts = window.MockDB.getDepartments();
        let deptDetails = null;
        Object.keys(depts).forEach(k => {
            if (depts[k].name === currentStudent.department) {
                deptDetails = depts[k];
            }
        });
        
        if (!deptDetails) {
            deptDetails = {
                tuitionFee: "₹45,000",
                labFee: "₹8,000",
                examFee: "₹3,500",
                totalFee: "₹56,500"
            };
        }
        
        const fTuition = document.getElementById("stud-fee-tuition");
        const fLab = document.getElementById("stud-fee-lab");
        const fExam = document.getElementById("stud-fee-exam");
        const fTotal = document.getElementById("stud-fee-total");

        if (fTuition) fTuition.textContent = deptDetails.tuitionFee;
        if (fLab) fLab.textContent = deptDetails.labFee;
        if (fExam) fExam.textContent = deptDetails.examFee;
        if (fTotal) fTotal.textContent = deptDetails.totalFee || deptDetails.tuitionFee;

        // Trigger Subviews Helper Renderers
        renderStudentPlacementList();
        renderPerformancePrediction();
        renderStudentCareerPathData();
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
        const studContainer = document.getElementById("stud-predictor-content");
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

        const formattedHtml = `
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

        if (container) container.innerHTML = formattedHtml;
        if (studContainer) studContainer.innerHTML = formattedHtml;
    }

    // ----------------------------------------------------
    // CAREER PATH CONTROLLER
    // ----------------------------------------------------
    if (careerSelect) {
        careerSelect.addEventListener("change", (e) => {
            selectedCareerKey = e.target.value;
            renderCareerPathData();
        });
    }

    function renderCareerPathData() {
        const path = window.MockDB.getCareerPath(selectedCareerKey);
        if (!path) return;

        if (careerTitle) careerTitle.textContent = path.title;
        
        if (careerSkills) {
            careerSkills.innerHTML = "";
            path.skills.forEach(skill => {
                careerSkills.innerHTML += `<span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 m-1 font-medium py-2 px-3">${skill}</span>`;
            });
        }

        if (careerCourses) {
            careerCourses.innerHTML = "";
            path.courses.forEach(course => {
                careerCourses.innerHTML += `
                    <li class="d-flex align-items-center mb-2">
                        <i class="bi bi-play-circle-fill text-purple me-2"></i>
                        <span class="text-secondary small">${course}</span>
                    </li>
                `;
            });
        }

        if (careerRoadmap) {
            careerRoadmap.innerHTML = `
                <div class="alert bg-purple bg-opacity-10 border border-purple border-opacity-20 text-purple small mb-0">
                    <i class="bi bi-compass-fill me-2"></i><b>Recommended Path:</b> ${path.roadmap}
                </div>
            `;
        }
    }

    function renderStudentCareerPathData(careerKey = "webdev") {
        const path = window.MockDB.getCareerPath(careerKey);
        if (!path) return;

        const title = document.getElementById("stud-career-title");
        const skills = document.getElementById("stud-career-skills");
        const courses = document.getElementById("stud-career-courses");
        const roadmap = document.getElementById("stud-career-roadmap");

        if (title) title.textContent = path.title;
        
        if (skills) {
            skills.innerHTML = "";
            path.skills.forEach(skill => {
                skills.innerHTML += `<span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 m-1 font-medium py-2 px-3">${skill}</span>`;
            });
        }

        if (courses) {
            courses.innerHTML = "";
            path.courses.forEach(course => {
                courses.innerHTML += `
                    <li class="d-flex align-items-center mb-2">
                        <i class="bi bi-play-circle-fill text-purple me-2"></i>
                        <span class="text-secondary small">${course}</span>
                    </li>
                `;
            });
        }

        if (roadmap) {
            roadmap.innerHTML = `
                <div class="alert bg-purple bg-opacity-10 border border-purple border-opacity-20 text-purple small mb-0">
                    <i class="bi bi-compass-fill me-2"></i><b>Recommended Path:</b> ${path.roadmap}
                </div>
            `;
        }
    }

    // ----------------------------------------------------
    // PLACEMENTS RENDERER
    // ----------------------------------------------------
    function renderPlacementList() {
        const plcList = document.getElementById("student-placements-list");
        if (!plcList) return;
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

    function renderStudentPlacementList() {
        const plcList = document.getElementById("stud-placement-container");
        if (!plcList) return;
        plcList.innerHTML = "";

        const recruiters = [
            { company: "Google", date: "2026-08-24", minCgpa: 8.5, dept: ["Computer Science & BCA", "B.Sc Information Technology (B.Sc IT)", "B.Sc Computer Science (B.Sc CS)", "BCA – Bachelor of Computer Applications", "B.Sc Artificial Intelligence & Learning (AI & ML)"], role: "Software Engineer" },
            { company: "TCS Digital", date: "2026-09-02", minCgpa: 7.0, dept: ["All"], role: "Graduate Trainee" },
            { company: "Cognizant", date: "2026-09-15", minCgpa: 6.5, dept: ["All"], role: "Programmer Analyst" },
            { company: "Deloitte", date: "2026-10-05", minCgpa: 8.0, dept: ["Commerce & BBA", "B.Com – Bachelor of Commerce", "BBA – Bachelor of Commerce"], role: "Financial Analyst" }
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
            } else if (subviewId === "admin-dashboard") {
                drawDashboardCharts();
            }
        });
    });

    // ----------------------------------------------------
    // DEPARTMENT DROPDOWNS POPULATOR
    // ----------------------------------------------------
    function populateAllDeptSelects() {
        const selects = ["add-stud-dept", "add-fac-dept", "add-course-dept", "add-bk-dept"];
        const depts = window.MockDB.getDepartments();
        
        selects.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;
            select.innerHTML = "";
            Object.keys(depts).forEach(key => {
                const opt = document.createElement("option");
                opt.value = depts[key].name;
                opt.textContent = depts[key].name;
                select.appendChild(opt);
            });
        });
    }

    // ----------------------------------------------------
    // ADMIN PANEL ROUTING & SUBVIEW RENDERING
    // ----------------------------------------------------
    function renderAdminPanel() {
        populateAllDeptSelects();
        renderAdminDashboard();
        renderAdminStudentsList();
        renderAdminDepartments();
        renderAdminFaculty();
        renderAdminCourses();
        renderAdminAttendance();
        renderAdminLibrary();
        renderAdminUsers();
        // Render dashboard charts on panel load
        drawDashboardCharts();
    }

    function renderAdminDashboard() {
        // Populate stats counts
        const depts = window.MockDB.getDepartments();
        document.getElementById("dash-total-depts").textContent = Object.keys(depts).length;
        
        const faculty = window.MockDB.getFaculty();
        document.getElementById("dash-total-faculty").textContent = faculty.length + 81; // Seed total
        
        const courses = window.MockDB.getCourses();
        document.getElementById("dash-total-courses").textContent = courses.length + 27; // Seed total
        
        const students = window.MockDB.getStudents();
        document.getElementById("dash-total-students").textContent = "1,248"; // Standard value matching image
        
        // Populate recent students table (Max 5)
        const tableBody = document.getElementById("dash-students-table-body");
        if (tableBody) {
            tableBody.innerHTML = "";
            students.slice(0, 5).forEach(s => {
                let deptShort = s.department;
                const match = s.department.match(/\(([^)]+)\)/);
                if (match) {
                    deptShort = match[1];
                } else if (s.department.includes("–")) {
                    deptShort = s.department.split(" – ")[0];
                }
                
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><span class="font-semibold text-primary">${s.id}</span></td>
                    <td>${s.name}</td>
                    <td>${deptShort}</td>
                    <td>${s.year === 1 ? "I" : s.year === 2 ? "II" : s.year === 3 ? "III" : "IV"} Year</td>
                    <td>${s.email}</td>
                    <td><span class="badge bg-success-glow text-success">Active</span></td>
                `;
                tableBody.appendChild(tr);
            });
        }
        
        // Populate recent announcements list
        const notices = window.MockDB.getNotices();
        const noticesList = document.getElementById("dash-notices-list");
        if (noticesList) {
            noticesList.innerHTML = "";
            notices.slice(0, 3).forEach((n, idx) => {
                const colors = ["text-primary bg-primary bg-opacity-10", "text-purple bg-purple bg-opacity-10", "text-warning bg-warning bg-opacity-10"];
                const iconColor = colors[idx % colors.length];
                const icon = idx === 0 ? "bi-megaphone" : idx === 1 ? "bi-calendar-event" : "bi-journal-bookmark";
                const isNew = idx === 0 ? '<span class="badge bg-primary-glow text-primary ms-2" style="font-size: 0.6rem;">New</span>' : '';
                
                const dateObj = new Date(n.date || Date.now());
                const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                
                const item = document.createElement("div");
                item.className = "d-flex align-items-center gap-3 p-2 rounded hover-bg-light transition-all";
                item.innerHTML = `
                    <div class="fs-4 ${iconColor} px-3 py-2 rounded-3"><i class="bi ${icon}"></i></div>
                    <div class="flex-grow-1 min-width-0">
                         <h6 class="mb-1 text-white font-medium text-truncate small">${n.title}${isNew}</h6>
                         <small class="text-secondary small d-block">${dateStr}</small>
                    </div>
                `;
                noticesList.appendChild(item);
            });
        }
    }

    function renderAdminStudentsList() {
        const tbody = document.getElementById("admin-students-table-body");
        if (!tbody) return;
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
                    renderAdminPanel();
                }
            });
        });
    }

    function renderAdminDepartments() {
        const tableBody = document.getElementById("admin-departments-table-body");
        if (!tableBody) return;
        tableBody.innerHTML = "";
        
        const depts = window.MockDB.getDepartments();
        Object.keys(depts).forEach(key => {
            const d = depts[key];
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><code class="text-purple font-semibold">${key}</code></td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <i class="${d.icon} fs-5"></i>
                        <span>${d.name}</span>
                    </div>
                </td>
                <td><span class="small">${d.programs.join(", ")}</span></td>
                <td>${d.studentsCount}</td>
                <td>${d.totalFee || d.tuitionFee}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger border-danger border-opacity-35" onclick="deleteAdminDept('${key}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    window.deleteAdminDept = function(key) {
        if (confirm(`Are you sure you want to delete the department: ${key}?`)) {
            window.MockDB.deleteDepartment(key);
            renderAdminPanel();
            renderLandingDepartments();
            showToast("Department deleted successfully.", "success");
        }
    };

    function renderAdminFaculty() {
        const tableBody = document.getElementById("admin-faculty-table-body");
        if (!tableBody) return;
        tableBody.innerHTML = "";
        
        const list = window.MockDB.getFaculty();
        list.forEach(f => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="font-semibold text-info">${f.id}</span></td>
                <td>${f.name}</td>
                <td>${f.designation}</td>
                <td>${f.department}</td>
                <td>${f.email}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger border-danger border-opacity-35" onclick="deleteAdminFaculty('${f.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    window.deleteAdminFaculty = function(id) {
        if (confirm("Are you sure you want to delete this faculty member?")) {
            window.MockDB.deleteFaculty(id);
            renderAdminFaculty();
            showToast("Faculty member deleted.", "success");
        }
    };

    function renderAdminCourses() {
        const tableBody = document.getElementById("admin-courses-table-body");
        if (!tableBody) return;
        tableBody.innerHTML = "";
        
        const list = window.MockDB.getCourses();
        list.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><code class="text-warning font-semibold">${c.code}</code></td>
                <td>${c.name}</td>
                <td>${c.department}</td>
                <td>${c.duration}</td>
                <td><span class="badge bg-secondary font-medium">${c.credits} Credits</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger border-danger border-opacity-35" onclick="deleteAdminCourse('${c.code}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    window.deleteAdminCourse = function(code) {
        if (confirm("Are you sure you want to delete this course?")) {
            window.MockDB.deleteCourse(code);
            renderAdminCourses();
            showToast("Course deleted.", "success");
        }
    };

    function renderAdminAttendance() {
        const tableBody = document.getElementById("admin-attendance-table-body");
        if (!tableBody) return;
        tableBody.innerHTML = "";
        
        const depts = window.MockDB.getDepartments();
        Object.keys(depts).forEach(key => {
            const d = depts[key];
            const strength = d.studentsCount || 100;
            const present = Math.round(strength * 0.82);
            const absent = strength - present;
            
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="font-medium text-white">${d.name}</span></td>
                <td>${strength}</td>
                <td><span class="text-success font-semibold">${present}</span></td>
                <td><span class="text-warning font-semibold">${absent}</span></td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="progress flex-grow-1 bg-dark bg-opacity-35" style="height: 6px; min-width: 80px; border-radius: 3px;">
                            <div class="progress-bar bg-success" style="width: 82%; border-radius: 3px;"></div>
                        </div>
                        <span class="small font-semibold">82%</span>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function renderAdminLibrary() {
        const tableBody = document.getElementById("admin-library-table-body");
        if (!tableBody) return;
        tableBody.innerHTML = "";
        
        const list = window.MockDB.getLibrary();
        list.forEach(b => {
            const badgeClass = b.status === "Available" ? "bg-success-glow text-success" : "bg-warning-glow text-warning";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="font-semibold text-purple">${b.id}</span></td>
                <td>${b.title}</td>
                <td>${b.author}</td>
                <td>${b.department}</td>
                <td><span class="badge ${badgeClass}">${b.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger border-danger border-opacity-35" onclick="deleteAdminLibrary('${b.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    window.deleteAdminLibrary = function(id) {
        if (confirm("Are you sure you want to delete this book?")) {
            window.MockDB.deleteLibrary(id);
            renderAdminLibrary();
            showToast("Book deleted.", "success");
        }
    };

    function renderAdminUsers() {
        const tableBody = document.getElementById("admin-users-table-body");
        if (!tableBody) return;
        tableBody.innerHTML = "";
        
        const list = window.MockDB.getUsers();
        list.forEach(u => {
            const tr = document.createElement("tr");
            const roleBadge = u.role === "ROLE_ADMIN" ? "bg-purple-glow text-purple" : "bg-primary-glow text-primary";
            tr.innerHTML = `
                <td><span class="font-semibold text-secondary">${u.id}</span></td>
                <td><code class="text-white">${u.username}</code></td>
                <td>${u.name || (u.refId ? "Student Account" : "Administrator")}</td>
                <td><span class="badge ${roleBadge}">${u.role}</span></td>
                <td><span class="text-success small"><i class="bi bi-shield-check me-1"></i>Authorized</span></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // ----------------------------------------------------
    // ADMIN DASHBOARD CANVAS GRAPH DRAWERS
    // ----------------------------------------------------
    function drawDashboardCharts() {
        const overviewCanvas = document.getElementById("chart-student-overview");
        if (overviewCanvas) {
            const ctx = overviewCanvas.getContext("2d");
            overviewCanvas.width = overviewCanvas.parentElement.clientWidth - 40;
            overviewCanvas.height = 280;
            
            const w = overviewCanvas.width;
            const h = overviewCanvas.height;
            ctx.clearRect(0, 0, w, h);
            
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
            const values = [350, 480, 620, 850, 920, 1248];
            
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            
            const paddingLeft = 50;
            const paddingBottom = 40;
            const paddingTop = 20;
            const paddingRight = 20;
            
            const chartW = w - paddingLeft - paddingRight;
            const chartH = h - paddingTop - paddingBottom;
            
            // Grid lines (horizontal)
            const gridCount = 5;
            for (let i = 0; i <= gridCount; i++) {
                const y = paddingTop + (chartH / gridCount) * i;
                ctx.beginPath();
                ctx.moveTo(paddingLeft, y);
                ctx.lineTo(w - paddingRight, y);
                ctx.stroke();
                
                ctx.fillStyle = "#94a3b8";
                ctx.font = "10px Inter, sans-serif";
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                const val = Math.round(1500 - (1500 / gridCount) * i);
                ctx.fillText(val.toLocaleString(), paddingLeft - 10, y);
            }
            
            // X-labels
            const xStep = chartW / (months.length - 1);
            for (let i = 0; i < months.length; i++) {
                const x = paddingLeft + xStep * i;
                ctx.beginPath();
                ctx.moveTo(x, paddingTop);
                ctx.lineTo(x, h - paddingBottom);
                ctx.stroke();
                
                ctx.fillStyle = "#94a3b8";
                ctx.font = "10px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(months[i], x, h - paddingBottom + 10);
            }
            
            const points = [];
            for (let i = 0; i < values.length; i++) {
                const x = paddingLeft + xStep * i;
                const y = paddingTop + chartH - (values[i] / 1500) * chartH;
                points.push({ x, y });
            }
            
            // Smooth gradient fill
            ctx.beginPath();
            ctx.moveTo(points[0].x, h - paddingBottom);
            ctx.lineTo(points[0].x, points[0].y);
            for (let i = 0; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i+1].x) / 2;
                const yc = (points[i].y + points[i+1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
            ctx.lineTo(points[points.length - 1].x, h - paddingBottom);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(0, paddingTop, 0, h - paddingBottom);
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.25)");
            gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw path line
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 0; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i+1].x) / 2;
                const yc = (points[i].y + points[i+1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
            ctx.strokeStyle = "#3b82f6";
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw points
            points.forEach((p, idx) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = "#3b82f6";
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#ffffff";
                ctx.stroke();
                
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 9px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(values[idx], p.x, p.y - 10);
            });
        }
        
        // Doughnut attendance chart
        const attendanceCanvas = document.getElementById("chart-attendance-overview");
        if (attendanceCanvas) {
            const ctx = attendanceCanvas.getContext("2d");
            attendanceCanvas.width = 220;
            attendanceCanvas.height = 220;
            
            const w = attendanceCanvas.width;
            const h = attendanceCanvas.height;
            ctx.clearRect(0, 0, w, h);
            
            const labels = ["Present", "Absent", "Leave"];
            const data = [82, 12, 6];
            const colors = ["#10b981", "#f59e0b", "#3b82f6"];
            
            const centerX = w / 2;
            const centerY = h / 2 - 15;
            const radius = Math.min(centerX, centerY) - 20;
            
            let startAngle = -0.5 * Math.PI;
            const total = 100;
            
            for (let i = 0; i < data.length; i++) {
                const sliceAngle = (data[i] / total) * 2 * Math.PI;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                ctx.arc(centerX, centerY, radius * 0.65, startAngle + sliceAngle, startAngle, true);
                ctx.closePath();
                ctx.fillStyle = colors[i];
                ctx.fill();
                startAngle += sliceAngle;
            }
            
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 26px Outfit, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("82%", centerX, centerY - 5);
            ctx.font = "11px Inter, sans-serif";
            ctx.fillStyle = "#94a3b8";
            ctx.fillText("Average", centerX, centerY + 15);
            
            const legendY = h - 15;
            ctx.font = "10px Inter, sans-serif";
            const legendSpacing = w / 3;
            for (let i = 0; i < labels.length; i++) {
                const x = legendSpacing * i + legendSpacing / 2;
                ctx.beginPath();
                ctx.arc(x - 22, legendY, 4, 0, 2 * Math.PI);
                ctx.fillStyle = colors[i];
                ctx.fill();
                ctx.fillStyle = "#94a3b8";
                ctx.textAlign = "left";
                ctx.fillText(`${labels[i]} (${data[i]}%)`, x - 14, legendY + 3);
            }
        }
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

    // Admin Add Department submit
    const addDeptForm = document.getElementById("add-dept-form");
    if (addDeptForm) {
        addDeptForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const key = document.getElementById("add-dept-key").value.trim().toLowerCase();
            const name = document.getElementById("add-dept-name").value.trim();
            const icon = document.getElementById("add-dept-icon").value;
            const students = parseInt(document.getElementById("add-dept-students").value) || 0;
            const sections = parseInt(document.getElementById("add-dept-sections").value) || 0;
            const tuition = document.getElementById("add-dept-tuition").value.trim();
            const lab = document.getElementById("add-dept-lab").value.trim();
            const exam = document.getElementById("add-dept-exam").value.trim();
            const programsStr = document.getElementById("add-dept-programs").value.trim();
            const facilities = document.getElementById("add-dept-facilities").value.trim();
            
            const programs = programsStr.split(",").map(p => p.trim()).filter(Boolean);
            
            const totalVal = (parseInt(tuition.replace(/\D/g, '')) || 0) + 
                             (parseInt(lab.replace(/\D/g, '')) || 0) + 
                             (parseInt(exam.replace(/\D/g, '')) || 0);
            const totalFee = `₹${totalVal.toLocaleString()}`;
            
            const newDept = {
                name,
                icon,
                programs,
                studentsCount: students,
                sections,
                tuitionFee: tuition,
                labFee: lab,
                examFee: exam,
                totalFee,
                facilities
            };
            
            window.MockDB.saveDepartment(key, newDept);
            
            addDeptForm.reset();
            bootstrap.Collapse.getInstance(document.getElementById("collapseAddDept"))?.hide();
            
            renderAdminPanel();
            renderLandingDepartments();
            showToast("Department created successfully!", "success");
            document.querySelector('[data-admin-target="admin-departments"]').click();
        });
    }

    // Admin Add Faculty submit
    const addFacultyForm = document.getElementById("add-faculty-form");
    if (addFacultyForm) {
        addFacultyForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("add-fac-id").value.trim();
            const name = document.getElementById("add-fac-name").value.trim();
            const department = document.getElementById("add-fac-dept").value;
            const designation = document.getElementById("add-fac-desig").value.trim();
            const email = document.getElementById("add-fac-email").value.trim();
            
            const newFac = { id, name, department, designation, email };
            window.MockDB.saveFaculty(newFac);
            
            addFacultyForm.reset();
            bootstrap.Collapse.getInstance(document.getElementById("collapseAddFaculty"))?.hide();
            
            renderAdminPanel();
            showToast("Faculty member added!", "success");
            document.querySelector('[data-admin-target="admin-faculty"]').click();
        });
    }

    // Admin Add Course submit
    const addCourseForm = document.getElementById("add-course-form");
    if (addCourseForm) {
        addCourseForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const code = document.getElementById("add-course-code").value.trim();
            const name = document.getElementById("add-course-name").value.trim();
            const department = document.getElementById("add-course-dept").value;
            const duration = document.getElementById("add-course-dur").value.trim();
            const credits = parseInt(document.getElementById("add-course-cred").value) || 3;
            
            const newCourse = { code, name, department, duration, credits };
            window.MockDB.saveCourse(newCourse);
            
            addCourseForm.reset();
            bootstrap.Collapse.getInstance(document.getElementById("collapseAddCourse"))?.hide();
            
            renderAdminPanel();
            showToast("Course structure cataloged!", "success");
            document.querySelector('[data-admin-target="admin-courses"]').click();
        });
    }

    // Admin Add Book submit
    const addBookForm = document.getElementById("add-book-form");
    if (addBookForm) {
        addBookForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("add-bk-id").value.trim();
            const title = document.getElementById("add-bk-title").value.trim();
            const author = document.getElementById("add-bk-author").value.trim();
            const department = document.getElementById("add-bk-dept").value;
            
            const newBook = { id, title, author, department, status: "Available" };
            window.MockDB.saveLibrary(newBook);
            
            addBookForm.reset();
            bootstrap.Collapse.getInstance(document.getElementById("collapseAddBook"))?.hide();
            
            renderAdminPanel();
            showToast("Book cataloged in library!", "success");
            document.querySelector('[data-admin-target="admin-library"]').click();
        });
    }

    // Admin Settings Form submit
    const settingsForm = document.getElementById("settings-form");
    if (settingsForm) {
        settingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const college = document.getElementById("settings-college-name").value.trim();
            const bot = document.getElementById("settings-bot-name").value.trim();
            const year = document.getElementById("settings-academic-year").value.trim();
            const maintenance = document.getElementById("settings-maintenance").checked;
            
            // Save settings mock
            localStorage.setItem("campusai_settings_college", college);
            localStorage.setItem("campusai_settings_bot", bot);
            localStorage.setItem("campusai_settings_year", year);
            localStorage.setItem("campusai_settings_maintenance", maintenance);
            
            showToast("System configurations saved successfully!", "success");
            
            // Apply setting updates
            const botLabel = document.querySelector(".chat-header h6");
            if (botLabel) botLabel.textContent = bot;
            
            document.querySelector('[data-admin-target="admin-dashboard"]').click();
        });
    }

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
