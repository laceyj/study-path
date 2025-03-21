/**
 * study-scheduler.js
 * 
 * Dynamic scheduling algorithm that generates personalized study plans
 * based on task dependencies and user preferences.
 */

class StudyScheduler {
  /**
   * Initialize the study scheduler
   * @param {Array} tasks Array of task objects
   * @param {Object} userPreferences User preferences for scheduling
   */
  constructor(tasks = [], userPreferences = {}) {
    this.tasks = tasks;
    this.preferences = userPreferences;
    this.calendar = []; // Daily schedule with assigned tasks
  }
  
  /**
   * Set tasks to be scheduled
   * @param {Array} tasks Array of task objects
   */
  setTasks(tasks) {
    this.tasks = tasks;
  }
  
  /**
   * Set user preferences
   * @param {Object} preferences User preferences object
   */
  setPreferences(preferences) {
    this.preferences = preferences;
  }
  
  /**
   * Mark tasks as completed based on user progress
   * @param {Object} completedTasks Map of taskId -> timestamp
   */
  markCompletedTasks(completedTasks) {
    if (!completedTasks) return;
    
    // Update the completed status of tasks based on user progress
    this.tasks.forEach(task => {
      if (completedTasks[task.id]) {
        task.completed = true;
        // If there's a timestamp, use it, otherwise use current date
        task.completedDate = completedTasks[task.id] instanceof Date 
          ? completedTasks[task.id] 
          : new Date();
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

  /**
   * Generate a complete study schedule based on task dependencies and user preferences
   * @returns {Array} Calendar of scheduled tasks
   */
  generateSchedule() {
    // Step 1: Resolve dependencies using topological sort
    const sortedTasks = this.topologicalSort();
    
    // Step 2: Calculate available study time per day
    const availableTime = this.calculateAvailableTime();
    
    // Step 3: Distribute tasks across available days
    this.calendar = this.allocateTasks(sortedTasks, availableTime);
    
    // Step 4: Assign calendar dates to each day
    this.assignDates();
    
    return this.calendar;
  }
  
  /**
   * Sort tasks based on dependencies (topological sort)
   * @returns {Array} Tasks in dependency order
   */
  topologicalSort() {
    // Create a copy of tasks to work with
    const tasks = [...this.tasks];
    
    // Create dependency graph
    const graph = {};
    const inDegree = {};
    
    // Initialize graph and in-degree count
    tasks.forEach(task => {
      graph[task.id] = [];
      inDegree[task.id] = 0;
    });
    
    // Build the graph
    tasks.forEach(task => {
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach(depId => {
          if (graph[depId]) { // Ensure the dependency exists in the graph
            graph[depId].push(task.id);
            inDegree[task.id]++;
          }
        });
      }
    });
    
    // Queue for tasks with no dependencies
    const queue = tasks.filter(task => inDegree[task.id] === 0).map(task => task.id);
    
    // Result array
    const sorted = [];
    
    // Process queue (Kahn's algorithm)
    while (queue.length > 0) {
      const taskId = queue.shift();
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        sorted.push(task);
        
        // Update dependencies
        graph[taskId].forEach(dependent => {
          inDegree[dependent]--;
          if (inDegree[dependent] === 0) {
            queue.push(dependent);
          }
        });
      }
    }
    
    // Check for circular dependencies
    if (sorted.length !== tasks.length) {
      console.error("Circular dependencies detected in tasks");
      // Return tasks in priority order as fallback
      return tasks.sort((a, b) => a.priority - b.priority);
    }
    
    return sorted;
  }
  
  /**
   * Calculate available study time for each day based on user preferences
   * @returns {Object} Map of available minutes by day type
   */
  calculateAvailableTime() {
    // Default values if preferences are not set
    const weekday = this.preferences.studyMinutesPerWeekday || 60;
    const weekend = this.preferences.studyMinutesPerWeekendDay || 120;
    
    // Adjust based on pacing preference
    let multiplier = 1;
    if (this.preferences.pacing === 'relaxed') {
      multiplier = 0.8; // 20% less study time per day (slower pace)
    } else if (this.preferences.pacing === 'intense') {
      multiplier = 1.2; // 20% more study time per day (faster pace)
    }
    
    return {
      weekday: Math.round(weekday * multiplier),
      weekend: Math.round(weekend * multiplier)
    };
  }
  
  /**
   * Allocate tasks to days based on available time
   * @param {Array} sortedTasks Tasks in dependency order
   * @param {Object} availableTime Available minutes by day type
   * @returns {Array} Daily schedule with allocated tasks
   */
  allocateTasks(sortedTasks, availableTime) {
    const calendar = [];
    let currentDay = {
      dayIndex: 0,
      tasks: [],
      remainingMinutes: 0,
      isWeekend: false
    };
    
    // Filter out completed tasks unless they are part of the current day
    const incompleteTasks = sortedTasks.filter(task => !task.completed);
    
    // Process each task
    for (const task of incompleteTasks) {
      // If current day doesn't exist or doesn't have enough time, move to next day
      if (currentDay.remainingMinutes < task.estimatedMinutes) {
        if (currentDay.tasks.length > 0) {
          calendar.push({...currentDay});
        }
        
        // Create new day
        const nextDayIndex = calendar.length;
        const isWeekend = this.isDayWeekend(nextDayIndex);
        currentDay = {
          dayIndex: nextDayIndex,
          tasks: [],
          remainingMinutes: isWeekend ? availableTime.weekend : availableTime.weekday,
          isWeekend
        };
      }
      
      // Add task to current day
      currentDay.tasks.push(task);
      currentDay.remainingMinutes -= task.estimatedMinutes;
    }
    
    // Add the last day if it has tasks
    if (currentDay.tasks.length > 0) {
      calendar.push({...currentDay});
    }
    
    return calendar;
  }
  
  /**
   * Determine if a day index is a weekend
   * @param {Number} dayIndex Zero-based index of the day
   * @returns {Boolean} Whether the day is a weekend
   */
  isDayWeekend(dayIndex) {
    // Convert from zero-based to one-based for modulo calculation
    const adjustedDay = dayIndex + 1;
    // Day 6 and 7 in a week are weekend (Saturday and Sunday)
    return adjustedDay % 7 === 6 || adjustedDay % 7 === 0;
  }
  
  /**
   * Assign actual calendar dates to the schedule
   * Accounts for excluded dates in user preferences
   */
  assignDates() {
    if (!this.preferences.startDate) {
      this.preferences.startDate = new Date().toISOString().split('T')[0];
    }
    
    const startDate = new Date(this.preferences.startDate);
    const excludedDates = (this.preferences.excludedDates || [])
      .map(date => new Date(date).toDateString());
    
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < this.calendar.length; i++) {
      // Skip excluded dates
      while (excludedDates.includes(currentDate.toDateString())) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Assign date to day
      this.calendar[i].date = new Date(currentDate);
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  /**
   * Update schedule when tasks are completed
   * @param {Array} completedTaskIds IDs of newly completed tasks
   * @returns {Array} Updated calendar
   */
  updateSchedule(completedTaskIds) {
    // Mark tasks as completed
    completedTaskIds.forEach(taskId => {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = true;
        task.completedDate = new Date();
      }
    });
    
    // Regenerate schedule
    return this.generateSchedule();
  }
  
  /**
   * Get estimated completion date
   * @returns {Date} Estimated completion date
   */
  getEstimatedCompletionDate() {
    if (this.calendar.length === 0) return null;
    return this.calendar[this.calendar.length - 1].date;
  }
  
  /**
   * Get time saved by completing tasks early
   * @returns {Object} Days and hours saved
   */
  getTimeSaved() {
    const completedTasks = this.tasks.filter(task => task.completed);
    const totalMinutesSaved = completedTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
    
    // Calculate average daily study time
    const avgDailyMinutes = 
      (this.preferences.studyMinutesPerWeekday * 5/7 + 
       this.preferences.studyMinutesPerWeekendDay * 2/7) || 60;
    
    // Convert minutes to days and hours
    const daysSaved = Math.floor(totalMinutesSaved / avgDailyMinutes);
    const hoursSaved = Math.floor((totalMinutesSaved % (24 * 60)) / 60);
    
    return { days: daysSaved, hours: hoursSaved };
  }
  
  /**
   * Calculate overall progress percentage
   * @returns {Number} Percentage of tasks completed (0-100)
   */
  calculateOverallProgress() {
    if (!this.tasks.length) return 0;
    
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(task => task.completed).length;
    
    return Math.round((completedTasks / totalTasks) * 100);
  }
  
  /**
   * Calculate progress for a specific week
   * @param {Number} weekNumber Week number to calculate progress for
   * @returns {Number} Percentage of tasks completed for the week (0-100)
   */
  calculateWeekProgress(weekNumber) {
    const weekTasks = this.tasks.filter(task => task.priority === weekNumber);
    
    if (!weekTasks.length) return 0;
    
    const totalTasks = weekTasks.length;
    const completedTasks = weekTasks.filter(task => task.completed).length;
    
    return Math.round((completedTasks / totalTasks) * 100);
  }
  
  /**
   * Get tasks for today
   * @returns {Array} Tasks scheduled for today
   */
  getTodaysTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find the day in the calendar that matches today's date
    const todaySchedule = this.calendar.find(day => {
      const dayDate = new Date(day.date);
      return dayDate.toDateString() === today.toDateString();
    });
    
    return todaySchedule ? todaySchedule.tasks : [];
  }
  
  /**
   * Get tasks for the next study session (today or future)
   * @returns {Object} Day object with tasks
   */
  getNextStudyDay() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find today or next day with tasks
    return this.calendar.find(day => {
      const dayDate = new Date(day.date);
      return dayDate >= today;
    });
  }
  
  /**
   * Get upcoming study days
   * @param {Number} limit Maximum number of days to return
   * @returns {Array} Upcoming study days
   */
  getUpcomingDays(limit = 7) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get next N days (that have tasks)
    return this.calendar
      .filter(day => new Date(day.date) >= today)
      .slice(0, limit);
  }
}

// Export the scheduler
window.studyScheduler = new StudyScheduler();