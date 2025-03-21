// Add this to a new file named debug-helpers.js
// Then include it in your index.html with: <script src="debug-helpers.js"></script>

// Global test function that can be called from the console
function testPersistence() {
    console.log("==== PERSISTENCE TEST ====");
    
    // Check if we can access localStorage
    try {
        const savedProgress = localStorage.getItem('taskProgress');
        console.log("localStorage 'taskProgress':", savedProgress ? JSON.parse(savedProgress) : "Not found");
        
        // Test writing to localStorage
        const testObj = { test: "data", timestamp: new Date().toISOString() };
        localStorage.setItem('testStorage', JSON.stringify(testObj));
        const testRead = localStorage.getItem('testStorage');
        console.log("Test localStorage write/read:", testRead ? JSON.parse(testRead) : "Failed");
    } catch (e) {
        console.error("localStorage access error:", e);
    }
    
    // Check Firebase authentication
    try {
        const auth = firebase.auth();
        const user = auth.currentUser;
        console.log("Firebase authentication:", user ? `Logged in as ${user.email}` : "Not authenticated");
        
        if (user) {
            // Test Firebase Firestore access
            firebase.firestore().collection('userProgress').doc(user.uid).get()
                .then(doc => {
                    console.log("Firestore userProgress:", doc.exists ? doc.data() : "Document does not exist");
                })
                .catch(err => {
                    console.error("Firestore read error:", err);
                });
        }
    } catch (e) {
        console.error("Firebase access error:", e);
    }
    
    // Check global app state (if Alpine.js exposes it)
    if (window.Alpine) {
        try {
            // This only works if Alpine exposes the app state
            const alpineApp = Alpine.evaluate(document.querySelector('[x-data]'), '$data');
            console.log("Alpine app state:", alpineApp);
        } catch (e) {
            console.error("Cannot access Alpine state:", e);
        }
    }
    
    return "Test running, check console for results";
}

// Helper to manually save task progress
function saveTaskProgress(taskId, completed) {
    console.log(`Manually saving task ${taskId} as ${completed ? 'completed' : 'not completed'}`);
    
    try {
        // Update localStorage
        const savedProgress = localStorage.getItem('taskProgress');
        let completedTasks = savedProgress ? JSON.parse(savedProgress) : {};
        
        if (completed) {
            completedTasks[taskId] = new Date().toISOString();
        } else {
            delete completedTasks[taskId];
        }
        
        localStorage.setItem('taskProgress', JSON.stringify(completedTasks));
        console.log("Updated localStorage:", completedTasks);
        
        // Update Firebase if logged in
        const user = firebase.auth().currentUser;
        if (user) {
            firebase.firestore().collection('userProgress').doc(user.uid).set({
                completedTasks: completedTasks,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true })
            .then(() => console.log("Firebase update successful"))
            .catch(err => console.error("Firebase update failed:", err));
        }
        
        return "Progress saved, check console for details";
    } catch (e) {
        console.error("Error saving progress:", e);
        return "Error: " + e.message;
    }
}

// Make these functions available globally
window.appDebug = {
    testPersistence,
    saveTaskProgress,
    clearAllProgress: function() {
        if (confirm("This will clear ALL your progress. Are you sure?")) {
            localStorage.removeItem('taskProgress');
            const user = firebase.auth().currentUser;
            if (user) {
                firebase.firestore().collection('userProgress').doc(user.uid).set({
                    completedTasks: {},
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            alert("Progress cleared. Refresh the page to see changes.");
            return "All progress cleared";
        }
        return "Operation cancelled";
    }
};

// check authentication state at any time
function checkAuthState() {
    // Check Alpine.js state
    let alpineState = null;
    try {
        const appEl = document.querySelector('[x-data]');
        if (appEl && window.Alpine) {
            alpineState = Alpine.$data(appEl);
        }
    } catch (e) {
        console.error("Couldn't access Alpine state:", e);
    }
    
    // Check Firebase directly
    const firebaseUser = firebase.auth().currentUser;
    
    console.log("=== Auth State Check ===");
    console.log("Firebase auth.currentUser:", firebaseUser ? 
        `Logged in as ${firebaseUser.email} (${firebaseUser.uid})` : 
        "Not logged in");
    console.log("Alpine app.user:", alpineState?.user ? 
        `Logged in as ${alpineState.user.email}` : 
        "Not logged in");
    
    return {
        firebaseUser,
        alpineUser: alpineState?.user
    };
}

// Make available globally
window.checkAuthState = checkAuthState;

console.log("Debug helpers loaded! Use appDebug.testPersistence() to test persistence");