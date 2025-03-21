/**
 * app.js
 * 
 * Main application logic for the Study Path Tracker
 * Uses Alpine.js for reactive data binding and UI interactions
 */
// verify the app.js file is loading correctly
console.log("Loading app.js");

// Main application function for Alpine.js
window.app = function() {
    return {
        // Authentication
        user: null,
        showAuthModal: false,
        authMode: 'signin', // 'signin' or 'signup'
        authEmail: '',
        authPassword: '',
        authError: null,
        showUserMenu: false,
        
        // UI state
        activeTab: 'dashboard',
        darkMode: localStorage.getItem('darkMode') === 'true',
        fontSize: localStorage.getItem('fontSize') || 'medium',
        syncStatus: 'offline',
        showSettingsModal: false,
        
        // Data
        tasks: [],
        calendar: [],
        selectedDay: null,
        todaysTasks: [],
        nextStudyDay: null,
        upcomingDays: [],
        calendarByMonth: {},
        overallProgress: 0,
        weekProgress: {},
        expandedWeeks: [1],  // Default to showing week 1
        
        preferences: {
            studyMinutesPerWeekday: 60,
            studyMinutesPerWeekendDay: 120,
            excludedDates: [],
            startDate: new Date().toISOString().split('T')[0],
            pacing: 'balanced',
        },
        newExcludedDate: '',
        completedTasks: {}, // Initialize as empty object
        
        // Stats
        estimatedCompletionDate: null,
        timeSaved: { days: 0, hours: 0 },
        totalTaskCount: 0,
        completedTaskCount: 0,
        completedStudyHours: 0,
        allCategories: ['comptia', 'linux', 'git', 'python', 'review', 'adhd'],
        
        // Tasks filter
        tasksFilter: 'all', // 'all', 'incomplete', 'completed'

        // Action menu
        showActionMenu: false,

        // Toast notifications
        toasts: [],
        
        // Mobile layout management
        isMobile: window.innerWidth < 768,
        
        // Initialize the application
        async initialize() {
            // Set up event listeners
            this.setupEventListeners();
            console.log("Initializing app...");
    
            // Set initial layout class
            this.updateLayoutClasses();

            // Wait for Firebase Auth to initialize
            await new Promise(resolve => {
                const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                    console.log("Auth state initialized:", user ? `User ${user.email} logged in` : "No user logged in");
                    this.user = user;
                    unsubscribe();
                    resolve();
                });
            });
            
            // Now we know the auth state, load data accordingly
            if (this.user) {
                console.log("Loading user data from Firebase...");
                await this.loadUserData();
            } else {
                console.log("No user authenticated, loading from localStorage...");
                this.loadFromLocalStorage();
            }
            
            // Create study scheduler if not already available
            if (!window.studyScheduler) {
                console.log("Creating new StudyScheduler");
                window.studyScheduler = new StudyScheduler();
            }
            
            // Check for dark mode preference
            if (this.darkMode) {
                document.documentElement.classList.add('dark-mode');
            }
            
            // Set default active tab if none set
            const savedTab = localStorage.getItem('activeTab');
            if (savedTab) {
                this.activeTab = savedTab;
            }
            
            // Load from localStorage first for faster initial render
            this.loadFromLocalStorage();
            
            // Apply dark mode if enabled
            if (this.darkMode) {
                document.documentElement.classList.add('dark-mode');
            }
        
            // Then try to authenticate and load from Firebase
            await this.checkAuthState();
            console.log("Loading progress data...");
                
            // Load from localStorage first for immediate display
            const savedProgress = localStorage.getItem('taskProgress');
            if (savedProgress) {
                try {
                    const progress = JSON.parse(savedProgress);
                    console.log("Found progress in localStorage:", progress);
                    
                    // Apply progress to tasks
                    this.tasks.forEach(task => {
                        if (progress[task.id]) {
                            task.completed = true;
                            task.completedDate = progress[task.id];
                        }
                    });
                    
                    // Regenerate schedule with loaded progress
                    this.generateSchedule();
                    this.calculateProgress();

                } catch (error) {
                    console.error("Error parsing localStorage progress:", error);
                }
            } else {
                console.log("No progress found in localStorage");
            } 


            // Set up event listener for task checkboxes
            document.addEventListener('change', (event) => {
                if (event.target.classList.contains('task-checkbox')) {
                    const taskId = event.target.id.replace('task-', '');
                    const checked = event.target.checked;
                    this.handleTaskCheck(taskId, checked);
                }
            });

            // Check if running on iOS and apply fixes
            if (this.isIOS()) {
                document.body.classList.add('ios-device');
                this.setupIOSTouchHandling();
                
                // Re-run layout fixes on orientation change
                window.addEventListener('orientationchange', () => {
                    setTimeout(() => {
                        this.setupIOSTouchHandling();
                    }, 300);
                });
            }
        },

        // Check if browser is Safari
        isSafari() {
            return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        },

        // Check if device is iOS
        isIOS() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        },

        // Fix touch handling for iOS
        setupIOSTouchHandling() {
            if (this.isIOS()) {
                // Fix for task item touch handling
                document.querySelectorAll('.task-item').forEach(item => {
                    item.addEventListener('touchstart', () => {
                        item.classList.add('ios-touch');
                    }, { passive: true });
                    
                    item.addEventListener('touchend', () => {
                        item.classList.remove('ios-touch');
                    }, { passive: true });
                });
                
                // Fix for bottom tab bar
                const tabsHeight = document.querySelector('.mobile-tabs')?.offsetHeight || 64;
                document.documentElement.style.setProperty('--bottom-nav-height', `${tabsHeight}px`);
            }
        },
        
        // Update layout classes based on screen size
        updateLayoutClasses() {
            if (window.innerWidth < 768) {
                document.body.classList.add('mobile-layout');
                document.body.classList.remove('desktop-layout');
                this.isMobile = true;
            } else {
                document.body.classList.add('desktop-layout');
                document.body.classList.remove('mobile-layout');
                this.isMobile = false;
            }
        },
        
        // Set up event listeners
        setupEventListeners() {
            // Listen for auth state changes
            document.addEventListener('authStateChanged', async (e) => {
                this.user = e.detail.user;
                if (this.user) {
                    await this.loadUserData();
                } else {
                    // Fall back to localStorage if not logged in
                    this.loadFromLocalStorage();
                }
            });
            
            // Listen for online/offline status
            window.addEventListener('online', () => {
                this.syncStatus = this.user ? 'synced' : 'offline';
                if (this.user) {
                    this.loadUserData(); // Try to sync when coming back online
                }
            });
            
            window.addEventListener('offline', () => {
                this.syncStatus = 'offline';
            });
            
            // Listen for resize events to update layout
            window.addEventListener('resize', () => {
                this.updateLayoutClasses();
            });
            
            // Close floating action menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.showActionMenu) {
                    const menu = document.querySelector('.fab-menu');
                    const button = document.querySelector('.fab-button');
                    
                    if (menu && button && !menu.contains(e.target) && !button.contains(e.target)) {
                        this.showActionMenu = false;
                    }
                }
            });
        },
        
        // Toggle dark mode
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);
            
            if (this.darkMode) {
                document.documentElement.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
            }
        },
        
        // Set font size
        setFontSize(size) {
            this.fontSize = size;
            localStorage.setItem('fontSize', size);
        },
        
        // Set active tab
        setActiveTab(tab) {
            console.log(`Setting active tab to: ${tab}`);
            this.activeTab = tab;
            localStorage.setItem('activeTab', tab);
        },


        // Toggle action menu
        toggleActionMenu() {
            this.showActionMenu = !this.showActionMenu;
            console.log("Toggle action menu called");
        },

        // Show import dialog
        showImportDialog() {
            this.toggleActionMenu();
            // Logic to trigger file input
            document.getElementById('import-progress').click();
        },

        // Toast notification system
        showToast(message, type = 'success', duration = 3000) {
            const id = Date.now();
            this.toasts.push({ id, message, type });
            
            // Auto remove after duration
            setTimeout(() => {
                this.toasts = this.toasts.filter(toast => toast.id !== id);
            }, duration);
        },
        
        // Toggle visibility of week content
        toggleWeek(weekNum) {
            const index = this.expandedWeeks.indexOf(weekNum);
            if (index > -1) {
                this.expandedWeeks.splice(index, 1);
            } else {
                this.expandedWeeks.push(weekNum);
            }
        },
        
        // Load from localStorage if available
        loadFromLocalStorage() {
            try {
                console.log("Loading data from localStorage");
                
                // Load preferences
                const savedPreferences = localStorage.getItem('preferences');
                if (savedPreferences) {
                    this.preferences = JSON.parse(savedPreferences);
                } else {
                    this.preferences = {
                        studyMinutesPerWeekday: 60,
                        studyMinutesPerWeekendDay: 120,
                        excludedDates: [],
                        startDate: new Date().toISOString().split('T')[0],
                        pacing: 'balanced',
                        theme: 'dark',
                        fontSize: 'medium'
                    };
                }
                
                // Load task progress
                const savedProgress = localStorage.getItem('taskProgress');
                if (savedProgress) {
                    try {
                        this.completedTasks = JSON.parse(savedProgress);
                        console.log("Found saved progress in localStorage:", this.completedTasks);
                    } catch (e) {
                        console.error("Error parsing saved progress:", e);
                        this.completedTasks = {};
                    }
                }
                
                // Load active tab
                const savedTab = localStorage.getItem('activeTab');
                if (savedTab) {
                    this.activeTab = savedTab;
                }
                
                // If we have sample data in the app, use it
                this.loadSampleData(this.completedTasks);
                
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        },
        
        // Load sample data for offline usage
        loadSampleData(completedTasks = {}) {
            try {
                // First try to load tasks from a hardcoded array if fetch fails
                const fallbackTasks = [
                    // A minimal set of tasks to use if fetching fails
                    {
                        id: "comptia-mb-formfactors",
                        title: "Motherboard Form Factors",
                        description: "Learn about standard motherboard sizes (ATX, Micro-ATX, Mini-ITX) and their use cases",
                        category: "comptia",
                        estimatedMinutes: 30,
                        dependencies: [],
                        priority: 1,
                        completed: false,
                        completedDate: null,
                        subtasks: []
                    },
                    {
                        id: "linux-vm-setup",
                        title: "VirtualBox and Ubuntu Linux Setup",
                        description: "Download and install VirtualBox and set up Ubuntu Linux VM",
                        category: "linux",
                        estimatedMinutes: 30,
                        dependencies: [],
                        priority: 1,
                        completed: false,
                        completedDate: null,
                        subtasks: []
                    }
                    // Add a few more basic tasks here
                ];
                // First try to process the fallback tasks directly
                console.log("Using fallback task data");
                this.processTasks(fallbackTasks, this.completedTasks);

                // Then try to load from JSON as a backup
                fetch('week1-tasks.json')
                .then(response => response.text())
                .then(text => {
                    console.log("JSON response first 50 chars:", text.substring(0, 50));
                    try {
                        const data = JSON.parse(text);
                        this.processTasks(data, this.completedTasks);
                        console.log("Successfully loaded and processed JSON data");
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                        // Already using fallback tasks, so no additional action needed
                    }
                })
                .catch(error => {
                    console.error('Error loading sample data:', error);
                    // Already using fallback tasks, so no additional action needed
                });

                // Then try to fetch from file
                fetch('week1-tasks.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text(); // Get as text first to debug
                })
                .then(text => {
                    try {
                        console.log("JSON text received:", text.substring(0, 100) + "..."); // Log the first 100 chars
                        const data = JSON.parse(text);
                        this.processTasks(data, this.completedTasks);
                    } catch (parseError) {
                        console.error("JSON parse error:", parseError);
                        // Fall back to the hardcoded tasks
                        console.log("Using fallback task data due to parse error");
                        this.processTasks(fallbackTasks, this.completedTasks);
                    }
                })
                .catch(error => {
                    console.error('Error loading sample data:', error);
                    // Fall back to the hardcoded tasks
                    console.log("Using fallback task data due to fetch error");
                    this.processTasks(fallbackTasks, this.completedTasks);
                });
            } catch (error) {
                console.error('Unexpected error in loadSampleData:', error);
                // Still try to use the fallback tasks
                this.processTasks(fallbackTasks, this.completedTasks);
            }
        },
        
        // Process tasks data
        processTasks(tasks, completedTasks = {}) {
            this.tasks = tasks;
            
            // Apply previously saved completion status if available
            if (completedTasks) {
                // Mark completed tasks
                this.tasks.forEach(task => {
                    if (completedTasks[task.id]) {
                        task.completed = true;
                        task.completedDate = completedTasks[task.id];
                    }
                    
                    // Also check subtasks
                    if (task.subtasks && task.subtasks.length > 0) {
                        task.subtasks.forEach(subtask => {
                            if (completedTasks[subtask.id]) {
                                subtask.completed = true;
                            }
                        });
                    }
                });
            }
            
            // Generate schedule
            this.generateSchedule();
            
            // Calculate progress
            this.calculateProgress();
        },
        
        // Check authentication state
        async checkAuthState() {
            try {
                const auth = firebase.auth();
                const user = auth.currentUser;
                
                if (user) {
                    this.user = user;
                    await this.loadUserData();
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
            }
        },
        
        // Load user data from Firebase
        async loadUserData() {
            try {
                this.syncStatus = 'syncing';
                
                // Get user preferences from Firestore
                if (this.user) {
                    const db = firebase.firestore();
                    const userPrefDoc = await db.collection('userPreferences').doc(this.user.uid).get();
                    
                    if (userPrefDoc.exists) {
                        this.preferences = userPrefDoc.data();
                        
                        // Save to localStorage as backup
                        localStorage.setItem('preferences', JSON.stringify(this.preferences));
                        
                        // Apply theme setting if present
                        if (this.preferences.theme === 'dark') {
                            this.darkMode = true;
                            document.documentElement.classList.add('dark-mode');
                        } else {
                            this.darkMode = false;
                            document.documentElement.classList.remove('dark-mode');
                        }
                        
                        // Apply font size if present
                        if (this.preferences.fontSize) {
                            this.fontSize = this.preferences.fontSize;
                        }
                    }
                    
                    // Get user progress
                    const userProgressDoc = await db.collection('userProgress').doc(this.user.uid).get();
                    let firebaseCompletedTasks = {};
                    
                    if (userProgressDoc.exists) {
                        const progressData = userProgressDoc.data();
                        if (progressData.completedTasks) {
                            firebaseCompletedTasks = progressData.completedTasks;
                            this.completedTasks = firebaseCompletedTasks;
                        }
                    }
                    
                    // Save to localStorage as backup
                    localStorage.setItem('taskProgress', JSON.stringify(this.completedTasks || {}));
                    
                    // Get all tasks
                    const tasksSnapshot = await db.collection('tasks').get();
                    const tasks = tasksSnapshot.docs.map(doc => ({ 
                        id: doc.id, 
                        ...doc.data() 
                    }));
                    
                    if (tasks.length > 0) {
                        this.processTasks(tasks, this.completedTasks || {});
                    } else {
                        // Fall back to sample data if no tasks in Firebase
                        this.loadSampleData(this.completedTasks || {});
                    }
                    
                    this.syncStatus = 'synced';
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                this.syncStatus = 'error';
                
                // Fall back to localStorage
                this.loadFromLocalStorage();
            }
        },
        
        // Handle authentication
        async handleAuth() {
            this.authError = null;
            
            try {
                const auth = firebase.auth();
                
                if (this.authMode === 'signin') {
                    await auth.signInWithEmailAndPassword(this.authEmail, this.authPassword);
                    this.showToast('Signed in successfully!', 'success');
                } else {
                    await auth.createUserWithEmailAndPassword(this.authEmail, this.authPassword);
                    this.showToast('Account created successfully!', 'success');
                }
                
                // Close the modal on success
                this.showAuthModal = false;
                this.authEmail = '';
                this.authPassword = '';
                
            } catch (error) {
                console.error('Authentication error:', error);
                this.authError = error.message;
            }
        },
        
        // Toggle auth mode between signin and signup
        toggleAuthMode() {
            this.authMode = this.authMode === 'signin' ? 'signup' : 'signin';
            this.authError = null;
        },
        
        // Reset password
        async resetPassword() {
            if (!this.authEmail) {
                this.authError = 'Please enter your email address';
                return;
            }
            
            this.authError = null;
            
            try {
                await firebase.auth().sendPasswordResetEmail(this.authEmail);
                this.showToast('Password reset email sent! Check your inbox.', 'success');
            } catch (error) {
                console.error('Password reset error:', error);
                this.authError = error.message;
            }
        },
        
        // Sign out
        async signOut() {
            try {
                await firebase.auth().signOut();
                this.showUserMenu = false;
                this.showToast('Signed out successfully', 'success');
                
                // Clear user-specific data
                this.tasks.forEach(task => {
                    task.completed = false;
                    task.completedDate = null;
                    
                    if (task.subtasks) {
                        task.subtasks.forEach(subtask => {
                            subtask.completed = false;
                        });
                    }
                });
                
                // Regenerate schedule and recalculate progress
                this.generateSchedule();
                this.calculateProgress();
                
            } catch (error) {
                console.error('Sign out error:', error);
                this.showToast('Failed to sign out', 'error');
            }
        },
        
        // Get user's initial for avatar
        getUserInitial() {
            if (!this.user) return '';
            
            return this.user.email.charAt(0).toUpperCase();
        },
        
        // Toggle user menu
        toggleUserMenu() {
            this.showUserMenu = !this.showUserMenu;
        },
        
        // Save user preferences
        async saveSettings() {
            // Save to localStorage
            localStorage.setItem('preferences', JSON.stringify(this.preferences));
            localStorage.setItem('darkMode', this.darkMode);
            localStorage.setItem('fontSize', this.fontSize);
            
            // Update theme/font in preferences
            this.preferences.theme = this.darkMode ? 'dark' : 'light';
            this.preferences.fontSize = this.fontSize;
            
            // Apply dark mode setting
            if (this.darkMode) {
                document.documentElement.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
            }
            
            // Save to Firebase if logged in
            if (this.user) {
                try {
                    this.syncStatus = 'syncing';
                    
                    // Get Firestore reference
                    const db = firebase.firestore();
                    
                    // Save preferences
                    await db.collection('userPreferences').doc(this.user.uid).set({
                        ...this.preferences,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    this.syncStatus = 'synced';
                    this.showToast('Preferences saved successfully!', 'success');
                } catch (error) {
                    console.error('Error saving preferences:', error);
                    this.syncStatus = 'error';
                    this.showToast('Failed to save preferences', 'error');
                }
            } else {
                this.showToast('Preferences saved to local storage', 'info');
            }
            
            // Close modal
            this.showSettingsModal = false;
            
            // Regenerate schedule with new preferences
            this.generateSchedule();
        },
        
        // Add excluded date
        addExcludedDate() {
            if (!this.newExcludedDate) return;
            
            if (!this.preferences.excludedDates) {
                this.preferences.excludedDates = [];
            }
            
            // Check if date already exists
            if (!this.preferences.excludedDates.includes(this.newExcludedDate)) {
                this.preferences.excludedDates.push(this.newExcludedDate);
                this.newExcludedDate = '';
                
                // Regenerate schedule if dates changed
                this.generateSchedule();
            }
        },
        
        // Remove excluded date
        removeExcludedDate(index) {
            if (this.preferences.excludedDates && this.preferences.excludedDates.length > index) {
                this.preferences.excludedDates.splice(index, 1);
                
                // Regenerate schedule if dates changed
                this.generateSchedule();
            }
        },
        
        // Generate schedule based on tasks and preferences
        generateSchedule() {
            // Make sure we have both required components
            if (!window.studyScheduler) {
                console.error("StudyScheduler not found, creating new instance");
                window.studyScheduler = new StudyScheduler(this.tasks, this.preferences);
            } else {
                // Update scheduler with current data
                window.studyScheduler.setTasks(this.tasks);
                window.studyScheduler.setPreferences(this.preferences);
            }
            
            // Initialize scheduler
            window.studyScheduler.setTasks(this.tasks);
            window.studyScheduler.setPreferences(this.preferences);
                
            // Get completed tasks
            const taskCompletionMap = {};
            this.tasks.forEach(task => {
                if (task.completed) {
                    taskCompletionMap[task.id] = task.completedDate || new Date();
                }
            });
                
            // Mark completed tasks in scheduler
            window.studyScheduler.markCompletedTasks(taskCompletionMap);
                
            try {
                // Generate schedule
                this.calendar = window.studyScheduler.generateSchedule();
                console.log(`Generated calendar with ${this.calendar.length} days`);
                
                // Update additional data
                this.estimatedCompletionDate = window.studyScheduler.getEstimatedCompletionDate();
                this.timeSaved = window.studyScheduler.getTimeSaved();
                this.todaysTasks = window.studyScheduler.getTodaysTasks();
                this.nextStudyDay = window.studyScheduler.getNextStudyDay();
                this.upcomingDays = window.studyScheduler.getUpcomingDays(5);
                
                // Group days by month
                this.groupDaysByMonth();
                
            } catch (error) {
                console.error("Error generating schedule:", error);
                // Provide fallback empty values
                this.calendar = [];
                this.estimatedCompletionDate = null;
                this.timeSaved = { days: 0, hours: 0 };
                this.todaysTasks = [];
                this.nextStudyDay = null;
                this.upcomingDays = [];
                this.calendarByMonth = {};
            }
        },

        // Debug schedule generation
        debugSchedule() {
            console.log("===== DEBUGGING SCHEDULE =====");
            console.log(`Calendar contains ${this.calendar.length} days`);
            
            // Check if the first few days have tasks
            for (let i = 0; i < Math.min(5, this.calendar.length); i++) {
                const day = this.calendar[i];
                console.log(`Day ${i}: Date ${day.date}, Tasks: ${day.tasks ? day.tasks.length : 'undefined'}`);
                
                // Check if tasks array exists but is empty
                if (day.tasks && day.tasks.length === 0) {
                    console.log(`  (Day ${i} has an empty tasks array)`);
                }
                
                // Verify the first task in each day if it exists
                if (day.tasks && day.tasks.length > 0) {
                    console.log(`  First task: ${day.tasks[0].title} (${day.tasks[0].id})`);
                }
            }
            
            // Check how the schedule is structured
            console.log("Calendar by month structure:", Object.keys(this.calendarByMonth));
            console.log("===== END DEBUGGING =====");
        },
        
        // Group days by month for the schedule view
        groupDaysByMonth() {
            const monthGroups = {};
            
            this.calendar.forEach(day => {
                if (!day.date) {
                    console.warn("Day without date found:", day);
                    return;
                }
                
                const date = new Date(day.date);
                const monthKey = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
                
                if (!monthGroups[monthKey]) {
                    monthGroups[monthKey] = [];
                }
                
                monthGroups[monthKey].push(day);
            });
            
            this.calendarByMonth = monthGroups;
        },
        
        // Calculate progress percentages
        calculateProgress() {
            // Calculate overall progress
            this.totalTaskCount = this.tasks.length;
            this.completedTaskCount = this.tasks.filter(task => task.completed).length;
            
            this.overallProgress = this.totalTaskCount > 0 
                ? Math.round((this.completedTaskCount / this.totalTaskCount) * 100) 
                : 0;
            
            // Calculate week progress
            const weekProgress = {};
            const uniqueWeeks = [...new Set(this.tasks.map(task => task.priority))];
            
            uniqueWeeks.forEach(weekNum => {
                const weekTasks = this.tasks.filter(task => task.priority === weekNum);
                const completedWeekTasks = weekTasks.filter(task => task.completed);
                
                weekProgress[weekNum] = weekTasks.length > 0 
                    ? Math.round((completedWeekTasks.length / weekTasks.length) * 100) 
                    : 0;
            });
            
            this.weekProgress = weekProgress;
            
            // Calculate completed study hours
            const completedMinutes = this.tasks
                .filter(task => task.completed)
                .reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0);
            
            this.completedStudyHours = Math.round(completedMinutes / 60);
        },
        
        // Get all weeks that have tasks
        get weeksWithTasks() {
            const weeks = [...new Set(this.tasks.map(task => task.priority))];
            return weeks.sort((a, b) => a - b);
        },
        
        // Get categories for a specific week
        getWeekCategories(weekNum) {
            const weekTasks = this.tasks.filter(task => task.priority === weekNum);
            const categories = [...new Set(weekTasks.map(task => task.category))];
            return categories;
        },
        
        // Get tasks for a specific week and category
        getTasksByWeekAndCategory(weekNum, category) {
            let filtered = this.tasks.filter(task => 
                task.priority === weekNum && 
                task.category === category
            );
            
            // Apply tasks filter
            if (this.tasksFilter === 'completed') {
                filtered = filtered.filter(task => task.completed);
            } else if (this.tasksFilter === 'incomplete') {
                filtered = filtered.filter(task => !task.completed);
            }
            
            return filtered;
        },
        
        // Get progress for a specific category
        getCategoryProgress(category) {
            const categoryTasks = this.tasks.filter(task => task.category === category);
            if (!categoryTasks.length) return 0;
            
            const completed = categoryTasks.filter(task => task.completed).length;
            return Math.round((completed / categoryTasks.length) * 100);
        },
        
        // Get category label (first letter)
        getCategoryLabel(category) {
            const labels = {
                comptia: 'C',
                linux: 'L',
                git: 'G',
                python: 'P',
                review: 'R',
                adhd: 'A'
            };
            
            return labels[category] || '';
        },
        
        // Get full category name
        getCategoryName(category) {
            const names = {
                comptia: 'CompTIA A+',
                linux: 'Linux Skills',
                git: 'Git & GitHub',
                python: 'Python Programming',
                review: 'Review & Practice',
                adhd: 'ADHD Management Tips'
            };
            
            return names[category] || category;
        },
        
        // Handle task checkbox change
        async handleTaskCheck(taskId, checked) {
            console.log(`Task ${taskId} ${checked ? 'completed' : 'uncompleted'}`);
    
            // Find the task and update its status
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = checked;
                task.completedDate = checked ? new Date().toISOString() : null;
                task.lastUpdated = new Date().toISOString();
                
                // Save to localStorage
                this.saveTaskProgress();
                
                // Update UI
                this.calculateProgress();
            }

            // IMPORTANT: If we have a selected day popup open, update task status there too
            if (this.selectedDay) {
                // Find the same task in the selected day's tasks array
                const popupTask = this.selectedDay.tasks.find(t => t.id === taskId);
                if (popupTask) {
                    popupTask.completed = checked;
                    popupTask.completedDate = task.completedDate;
                    popupTask.lastUpdated = task.lastUpdated;
                    
                    // Auto-close popup if all tasks are completed
                    const allCompleted = this.selectedDay.tasks.every(t => t.completed);
                    if (allCompleted && checked) {
                        // Set a small delay so the user sees the checkbox change before closing
                        setTimeout(() => {
                            this.selectedDay = null;
                        }, 500); // 500ms delay gives visual feedback before closing
                    }
                }
            }
            
            // Update localStorage and Firebase with proper error handling
            try {
                // Update the completedTasks object
                if (checked) {
                    this.completedTasks[taskId] = new Date().toISOString();
                } else {
                    delete this.completedTasks[taskId];
                }
                
                // Save back to localStorage
                localStorage.setItem('taskProgress', JSON.stringify(this.completedTasks));
                console.log('Updated localStorage with task progress:', Object.keys(this.completedTasks).length, "completed tasks");
                
                // Check authentication status directly from Firebase
                const currentUser = firebase.auth().currentUser;
                
                // Update Firebase if logged in
                if (currentUser) {
                    try {
                        this.syncStatus = 'syncing';
                        console.log(`Saving to Firebase as ${currentUser.email}`);
                        
                        await firebase.firestore().collection('userProgress').doc(currentUser.uid).set({
                            completedTasks: this.completedTasks,
                            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                        }, { merge: true });
                        
                        this.syncStatus = 'synced';
                        console.log('Successfully synced progress to Firebase');
                    } catch (error) {
                        console.error('Firebase sync error:', error);
                        this.syncStatus = 'error';
                        this.showToast('Error syncing to cloud', 'error');
                    }
                } else {
                    console.log('User not authenticated, saving to localStorage only');
                }
            } catch (error) {
                console.error('Error updating task progress:', error);
                this.showToast('Error saving progress', 'error');
            }   
    
            // Regenerate schedule and recalculate progress
            this.generateSchedule();
            this.calculateProgress();
            
            // Show success toast
            if (checked) {
                this.showToast('Task completed!', 'success');
            }
        },
        
        // Save task progress to localStorage
        saveTaskProgress() {
            this.tasks.forEach(task => {
                if (task.completed) {
                    this.completedTasks[task.id] = task.completedDate || new Date().toISOString();
                } else {
                    delete this.completedTasks[task.id];
                }
            });
            
            localStorage.setItem('taskProgress', JSON.stringify(this.completedTasks));
            console.log("Progress saved to localStorage");
        },
        
        // Update this function in your app.js file
        viewDayDetails(day) {
            if (!day) {
                console.error("Attempted to view details of a null day");
                return;
            }
            
            // Make a deep copy of the day object to avoid reference issues
            this.selectedDay = JSON.parse(JSON.stringify(day));
            
            // Ensure tasks array exists and is not undefined
            if (!this.selectedDay.tasks) {
                this.selectedDay.tasks = [];
            }
            
            console.log(`Selected day has ${this.selectedDay.tasks.length} tasks`);
        },

        // Format date for display
        formatDate(date) {
            if (!date) return 'N/A';
            
            const options = { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            };
            
            try {
                return new Date(date).toLocaleDateString(undefined, options);
            } catch (e) {
                console.error("Error formatting date:", e, date);
                return 'Invalid date';
            }
        },
        
        // Get day name (Mon, Tue, etc.)
        getDayName(date) {
            if (!date) return '';
            
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            try {
                return days[new Date(date).getDay()];
            } catch (e) {
                console.error("Error getting day name:", e, date);
                return '';
            }
        },
        
        // Format study time for display
        formatStudyTime(day) {
            if (!day || !day.tasks) return '';
            
            const totalMinutes = day.tasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            
            if (hours > 0 && minutes > 0) {
                return `${hours}h ${minutes}m`;
            } else if (hours > 0) {
                return `${hours}h`;
            } else {
                return `${minutes}m`;
            }
        },
        
        // Check if a date is today
        isToday(date) {
            if (!date) return false;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);
            
            return today.getTime() === checkDate.getTime();
        },
        
        // Check if a date is in the past
        isPastDay(date) {
            if (!date) return false;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);
            
            return checkDate < today;
        },
        
        // Regenerate the schedule
        regenerateSchedule() {
            this.generateSchedule();
            this.showToast('Schedule regenerated successfully!', 'success');
        },
        
        // Export progress to a file
        exportProgress() {
            // Create an export object with tasks progress            
            const exportData = {
                preferences: this.preferences,
                progress: this.completedTasks,
                exportDate: new Date().toISOString()
            };
            
            // Convert to JSON and create download link
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const exportName = 'study_progress_' + new Date().toISOString().split('T')[0] + '.json';
            
            // Create download link and trigger download
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportName);
            linkElement.click();
            
            // Show success toast
            this.showToast('Progress exported successfully!', 'success');
            
            // Close action menu if open
            this.showActionMenu = false;
        },
        
        // Import progress from a file
        importProgress(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    // Import preferences
                    if (importData.preferences) {
                        this.preferences = importData.preferences;
                        localStorage.setItem('preferences', JSON.stringify(importData.preferences));
                    }
                    
                    // Import progress
                    if (importData.progress) {
                        // Update task completion status
                        this.tasks.forEach(task => {
                            if (importData.progress[task.id]) {
                                task.completed = true;
                                task.completedDate = new Date(importData.progress[task.id]);
                            } else {
                                task.completed = false;
                                task.completedDate = null;
                            }
                            
                            // Also update subtasks
                            if (task.subtasks) {
                                task.subtasks.forEach(subtask => {
                                    subtask.completed = !!importData.progress[subtask.id];
                                });
                            }
                        });
                        
                        this.completedTasks = importData.progress;
                        localStorage.setItem('taskProgress', JSON.stringify(importData.progress));
                        
                        // Save to Firebase if logged in
                        if (this.user) {
                            this.syncStatus = 'syncing';
                            
                            // Create a progress object for Firebase
                            const progress = {
                                completedTasks: importData.progress,
                                lastUpdated: new Date()
                            };
                            
                            firebase.firestore().collection('userProgress').doc(this.user.uid).set(progress, { merge: true })
                                .then(() => {
                                    this.syncStatus = 'synced';
                                    this.showToast('Progress imported and synced to cloud', 'success');
                                })
                                .catch(error => {
                                    console.error('Error saving progress to Firebase:', error);
                                    this.syncStatus = 'error';
                                    this.showToast('Error syncing to cloud', 'error');
                                });
                        } else {
                            this.showToast('Progress imported to local storage', 'success');
                        }
                        
                        // Regenerate schedule and recalculate progress
                        this.generateSchedule();
                        this.calculateProgress();
                    }
                } catch (error) {
                    console.error('Error importing progress:', error);
                    this.showToast('Error importing progress. Please check file format.', 'error');
                }
            };
            
            reader.readAsText(file);
            
            // Reset the file input
            event.target.value = '';
        },
        
        // Confirm before resetting progress
        confirmResetProgress() {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                this.resetProgress();
            }
        },
        
        // Reset all progress
        resetProgress() {
            // Reset task completion status
            this.tasks.forEach(task => {
                task.completed = false;
                task.completedDate = null;
                
                // Also reset subtasks
                if (task.subtasks) {
                    task.subtasks.forEach(subtask => {
                        subtask.completed = false;
                    });
                }
            });
            
            // Clear completedTasks object
            this.completedTasks = {};
            
            // Clear localStorage progress
            localStorage.setItem('taskProgress', JSON.stringify({}));
            
            // Clear Firebase progress if logged in
            if (this.user) {
                this.syncStatus = 'syncing';
                
                const emptyProgress = {
                    completedTasks: {},
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                firebase.firestore().collection('userProgress').doc(this.user.uid).set(emptyProgress, { merge: true })
                    .then(() => {
                        this.syncStatus = 'synced';
                        this.showToast('Progress reset successfully', 'success');
                    })
                    .catch(error => {
                        console.error('Error resetting progress in Firebase:', error);
                        this.syncStatus = 'error';
                        this.showToast('Error syncing reset to cloud', 'error');
                    });
            } else {
                this.showToast('Progress reset successfully', 'success');
            }
            
            // Close action menu
            this.showActionMenu = false;
            
            // Regenerate schedule and recalculate progress
            this.generateSchedule();
            this.calculateProgress();
        },

        // Render task list HTML
        renderTaskList(tasks, compact = false, showCategory = false) {
            if (!tasks || tasks.length === 0) {
                return '<div class="empty-state"><p>No tasks to display.</p></div>';
            }
            
            let html = '<ul class="task-list">';
            
            tasks.forEach(task => {
                // Skip invalid tasks
                if (!task || !task.id) {
                    console.warn("Found invalid task:", task);
                    return; // Skip this iteration
                }
                
                // Get category tag if needed
                const categoryTag = showCategory && task.category ? 
            `<span class="category-tag tag-${task.category}">${this.getCategoryLabel(task.category)}</span>` : '';
                
                // Check if task was recently updated
                const recentlyUpdated = task.lastUpdated && 
                    (new Date().getTime() - new Date(task.lastUpdated).getTime() < 2000);
                
                // Build the task item HTML
                html += `
                    <li class="task-item ${task.completed ? 'completed' : ''} ${recentlyUpdated ? 'highlighted' : ''}">
                        <input type="checkbox" class="task-checkbox" id="task-${task.id}" 
                               ${task.completed ? 'checked' : ''} 
                               onchange="app().handleTaskCheck('${task.id}', this.checked)">
                        <div class="task-content">
                            <label for="task-${task.id}" class="task-label">
                                ${categoryTag} ${task.title || 'Unnamed Task'}
                            </label>
                            <div class="task-meta">
                                <span class="task-time">${task.estimatedMinutes || 0} min</span>
                            </div>
                        </div>
                    </li>
                `;
                
                // Add subtasks if any and if not in compact mode
                if (!compact && task.subtasks && task.subtasks.length > 0) {
                    html += '<ul class="subtask-list">';
                    task.subtasks.forEach((subtask, subtaskIndex) => {
                        // Skip invalid subtasks
                        if (!subtask || !subtask.id) {
                            return;
                        }
                        
                        if (subtask.category !== 'adhd') { // Skip ADHD tips here
                            const subCategoryTag = showCategory && subtask.category ? 
                                `<span class="category-tag tag-${subtask.category}">${this.getCategoryLabel(subtask.category)}</span>` : '';
                            
                            html += `
                                <li class="task-item ${subtask.completed ? 'completed' : ''}">
                                    <input type="checkbox" class="task-checkbox" id="task-${subtask.id}" 
                                          ${subtask.completed ? 'checked' : ''} 
                                          onchange="app().handleTaskCheck('${subtask.id}', this.checked)">
                                    <div class="task-content">
                                        <label for="task-${subtask.id}" class="task-label">
                                            ${subCategoryTag} ${subtask.title || 'Unnamed Subtask'}
                                        </label>
                                        <div class="task-meta">
                                            <span class="task-time">${subtask.estimatedMinutes || 0} min</span>
                                        </div>
                                    </div>
                                </li>
                            `;
                        }
                    });
                    html += '</ul>';
                }
                
                // Add ADHD tips if any and if not in compact mode
                if (!compact && task.adhd_tips && task.adhd_tips.length > 0) {
                    task.adhd_tips.forEach(tip => {
                        // Skip invalid tips
                        if (!tip || !tip.content) {
                            return;
                        }
                        
                        html += `
                            <div class="adhd-tip">
                                <div class="adhd-tip-header">
                                    <i class="fas fa-lightbulb"></i> ADHD Tip
                                </div>
                                <div class="adhd-tip-content">${tip.content}</div>
                            </div>
                        `;
                    });
                }
            });
            
            html += '</ul>';
            return html;
        },

        // Data refresh function
        async refreshData() {
            this.showToast('Refreshing data...', 'info');
            
            try {
                // Show loading state
                this.isLoading = true;
                
                // Load fresh data from Firebase
                await this.loadUserData();
                
                this.showToast('Data refreshed successfully!', 'success');
            } catch (error) {
                console.error('Error refreshing data:', error);
                this.showToast('Failed to refresh data', 'error');
            } finally {
                this.isLoading = false;
            }
            
            return new Promise(resolve => setTimeout(resolve, 800));
        }
    };
}