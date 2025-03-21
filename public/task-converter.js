/**
 * Task Converter Script
 * 
 * This script converts the tasks from the PDF for weeks 8-12 into the JSON format
 * used by the application. This would typically be run as a one-time process
 * when setting up the application with new content.
 */

// Week 8: Mobile OS, Cloud Computing & Python Projects
const week8Tasks = [
  {
    "id": "comptia-android-os",
    "title": "Android Operating System",
    "description": "Learn about the Android operating system architecture and features",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-windows-tools"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "python-modules",
    "title": "Python Modules and Imports",
    "description": "Learn how to organize code into modules and import functionality",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["python-functions", "git-github-pages"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "python-modules-tutorial",
        "title": "Python Modules Tutorial",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "python-organize-modules",
        "title": "Practice Organizing Code into Modules",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-module-map",
        "content": "Map out module relationships visually to better understand how they interact"
      }
    ]
  },
  {
    "id": "comptia-ios",
    "title": "Apple iOS",
    "description": "Learn about Apple iOS architecture, features, and security",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-android-os"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "python-libraries",
    "title": "Python Libraries",
    "description": "Learn about using external libraries in Python",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["python-modules"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "python-libraries-tutorial",
        "title": "Python Libraries Tutorial",
        "category": "python", 
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "python-requests-lib",
        "title": "Practice Using the Requests Library",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "comptia-mdm",
    "title": "Mobile Device Management",
    "description": "Learn about enterprise mobile device management solutions",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-ios"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "python-project-planning",
    "title": "Python Project Planning",
    "description": "Plan a complete Python project with proper structure",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["python-libraries"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "python-quiz-app-plan",
        "title": "Plan a Study Quiz Application",
        "category": "python", 
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "python-project-structure",
        "title": "Create a Project Structure",
        "category": "python", 
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-kanban",
        "content": "Use a kanban board to track project tasks and visualize your progress"
      }
    ]
  },
  {
    "id": "comptia-mobile-security",
    "title": "Mobile Device Security",
    "description": "Learn about mobile security threats and protective measures",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-mdm"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "python-quiz-project-start",
    "title": "Start Python Quiz Project",
    "description": "Begin implementing the study quiz application",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["python-project-planning"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "python-question-loading",
        "title": "Implement Question Loading from a File",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "python-quiz-functionality",
        "title": "Add Basic Quiz Functionality",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "comptia-cloud-computing",
    "title": "Cloud Computing",
    "description": "Learn about cloud computing service types and deployment models",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-mobile-security"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "comptia-cloud-models",
    "title": "Cloud Models",
    "description": "Learn about SaaS, PaaS, IaaS, and public/private/hybrid clouds",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-cloud-computing"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "comptia-quiz-mobile-cloud",
        "title": "Mobile OS and Cloud Quiz (10 questions)",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-cloud-table",
        "content": "Create a comparison table of cloud service models to visualize the differences between them"
      }
    ]
  },
  {
    "id": "comptia-virtualization",
    "title": "Virtualization and Remote Access Technologies",
    "description": "Learn about hypervisors, VM management, and remote access solutions",
    "category": "comptia",
    "estimatedMinutes": 45,
    "dependencies": ["comptia-cloud-models"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "comptia-virtualize-guide",
        "title": "Create a Virtualization Technologies Reference Guide",
        "category": "comptia",
        "estimatedMinutes": 20,
        "completed": false
      }
    ]
  },
  {
    "id": "python-quiz-project-continue",
    "title": "Continue Python Quiz Project",
    "description": "Continue developing the study quiz application with more features",
    "category": "python",
    "estimatedMinutes": 45,
    "dependencies": ["python-quiz-project-start"],
    "priority": 8,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "python-quiz-scoring",
        "title": "Add Scoring and Feedback",
        "category": "python",
        "estimatedMinutes": 20,
        "completed": false
      },
      {
        "id": "python-quiz-ui",
        "title": "Implement User Interface Improvements",
        "category": "python",
        "estimatedMinutes": 25,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-feature-focus",
        "content": "Test and refine one feature at a time to maintain focus and avoid feeling overwhelmed"
      }
    ]
  }
];

// Week 9: Security, Operational Procedures & Linux System Admin
const week9Tasks = [
  {
    "id": "comptia-security-basics",
    "title": "Security Fundamentals",
    "description": "Learn about core security concepts and best practices",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-virtualization"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "linux-user-management",
    "title": "Linux User Management",
    "description": "Learn how to manage users and groups in Linux",
    "category": "linux",
    "estimatedMinutes": 30,
    "dependencies": ["linux-network-troubleshoot", "python-quiz-project-continue"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "linux-user-tutorial",
        "title": "Linux User Management Tutorial",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "linux-user-practice",
        "title": "Practice: useradd, userdel, passwd, groups",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-user-cheatsheet",
        "content": "Create a user management cheat sheet with common commands and their options"
      }
    ]
  },
  {
    "id": "comptia-authentication",
    "title": "Authentication Methods",
    "description": "Learn about different authentication technologies and implementations",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-security-basics"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "linux-security-basics",
    "title": "Linux Security Basics",
    "description": "Learn fundamental Linux security configuration",
    "category": "linux",
    "estimatedMinutes": 30,
    "dependencies": ["linux-user-management"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "linux-security-tutorial",
        "title": "Linux Security Tutorial",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "linux-security-practice",
        "title": "Practice Configuring Permissions and Firewall",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "comptia-malware",
    "title": "Malware Types",
    "description": "Learn about different malware categories and protection strategies",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-authentication"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "linux-advanced-bash",
    "title": "Advanced Bash Scripting",
    "description": "Learn more complex Bash scripting techniques",
    "category": "linux",
    "estimatedMinutes": 30,
    "dependencies": ["linux-security-basics"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "linux-bash-advanced",
        "title": "Bash Scripting Advanced Tutorial",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "linux-monitoring-script",
        "title": "Create a Script to Monitor System Resources",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-code-comments",
        "content": "Comment your code extensively to help maintain focus and remember your intention for each section"
      }
    ]
  },
  {
    "id": "comptia-security-policies",
    "title": "Security Policies",
    "description": "Learn about organizational security policy development and implementation",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-malware"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "linux-system-monitoring",
    "title": "Linux System Monitoring",
    "description": "Learn how to monitor system performance and resources in Linux",
    "category": "linux",
    "estimatedMinutes": 30,
    "dependencies": ["linux-advanced-bash"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "linux-monitoring-tutorial",
        "title": "Linux Monitoring Tutorial",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "linux-monitoring-practice",
        "title": "Practice: top, htop, ps, free",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "comptia-documentation",
    "title": "Documentation",
    "description": "Learn about IT documentation best practices and standards",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-security-policies"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "comptia-change-management",
    "title": "Change Management",
    "description": "Learn about change management processes in IT environments",
    "category": "comptia",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-documentation"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "comptia-quiz-security",
        "title": "Security Quiz (10 questions)",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-doc-templates",
        "content": "Create templates for IT documentation to make the documentation process more structured and easier to follow"
      }
    ]
  },
  {
    "id": "comptia-safety-incident",
    "title": "Safety Procedures and Incident Response",
    "description": "Learn about workplace safety and security incident handling",
    "category": "comptia",
    "estimatedMinutes": 45,
    "dependencies": ["comptia-change-management"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "comptia-incident-guide",
        "title": "Create a Safety and Incident Response Guide",
        "category": "comptia",
        "estimatedMinutes": 20,
        "completed": false
      }
    ]
  },
  {
    "id": "integration-project-planning",
    "title": "Integration Project Planning",
    "description": "Plan a project that combines Linux, Git, and Python skills",
    "category": "python",
    "estimatedMinutes": 45,
    "dependencies": ["linux-system-monitoring", "python-quiz-project-continue"],
    "priority": 9,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "integration-project-plan",
        "title": "Plan a Project that Combines Linux, Git, and Python",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "integration-project-start",
        "title": "Start Implementation of a System Monitoring Tool",
        "category": "python",
        "estimatedMinutes": 30,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-project-milestones",
        "content": "Break the project into small, achievable milestones to avoid feeling overwhelmed by the overall scope"
      }
    ]
  }
];

// Week 10: Project Development & Review
const week10Tasks = [
  {
    "id": "review-hardware",
    "title": "Review Hardware Components",
    "description": "Review content from weeks 1-4 focusing on hardware",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["comptia-safety-incident"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "integration-project-data",
    "title": "Integration Project Development",
    "description": "Continue developing the cross-discipline integration project",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["integration-project-planning"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "integration-project-collection",
        "title": "Implement Data Collection Features",
        "category": "python",
        "estimatedMinutes": 30,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-feature-timer",
        "content": "Use a timer to focus on one feature at a time, working in concentrated bursts"
      }
    ]
  },
  {
    "id": "review-networking",
    "title": "Review Networking Concepts",
    "description": "Review content from weeks 5-6 focusing on networking",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["review-hardware"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "integration-project-storage",
    "title": "Integration Project Continued",
    "description": "Add data storage and version control to the project",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["integration-project-data"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "integration-project-db",
        "title": "Add Data Storage and Visualization",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "integration-project-git",
        "title": "Push Updates to GitHub",
        "category": "git",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "review-os",
    "title": "Review Windows and Mobile OS",
    "description": "Review content from weeks 7-8 focusing on operating systems",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["review-networking"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "integration-project-testing",
    "title": "Integration Project Testing",
    "description": "Test all features and fix any bugs in the project",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["integration-project-storage"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "integration-project-test-all",
        "title": "Test All Features",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "integration-project-bugfix",
        "title": "Fix Bugs",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-testing-checklist",
        "content": "Create a testing checklist to methodically verify each component of your project"
      }
    ]
  },
  {
    "id": "review-security",
    "title": "Review Security and Procedures",
    "description": "Review content from week 9 focusing on security and operational procedures",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["review-os"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "integration-project-docs",
    "title": "Project Documentation",
    "description": "Create comprehensive documentation for the project",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["integration-project-testing"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "integration-project-readme",
        "title": "Create Comprehensive README",
        "category": "git",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "integration-project-code-comments",
        "title": "Add Comments to Code",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "practice-quiz-30",
    "title": "Take a 30-question Pocket Prep Quiz",
    "description": "Test your knowledge with a comprehensive practice quiz",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["review-security"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "integration-project-final",
    "title": "Project Finalization",
    "description": "Make final improvements and prepare for presentation",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["integration-project-docs"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "integration-project-improvements",
        "title": "Make Final Improvements",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "integration-project-presentation",
        "title": "Prepare for Presentation",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-demo-script",
        "content": "Create a demo script to help you stay on track when presenting your project"
      }
    ]
  },
  {
    "id": "practice-exam-first",
    "title": "Complete Practice Exam (First Half)",
    "description": "Take the first part of a comprehensive practice exam",
    "category": "review",
    "estimatedMinutes": 45,
    "dependencies": ["practice-quiz-30"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "practice-exam-second",
    "title": "Complete Practice Exam (Second Half)",
    "description": "Take the second part of a comprehensive practice exam and review results",
    "category": "review",
    "estimatedMinutes": 45,
    "dependencies": ["practice-exam-first"],
    "priority": 10,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "practice-exam-review",
        "title": "Review Incorrect Answers",
        "category": "review",
        "estimatedMinutes": 20,
        "completed": false
      },
      {
        "id": "practice-exam-weak-areas",
        "title": "Identify Areas Needing Further Study",
        "category": "review",
        "estimatedMinutes": 25,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-exam-breaks",
        "content": "Take breaks between exam sections to maintain focus and mental energy"
      }
    ]
  }
];

// Week 11: Focused Review & Advanced Topics
const week11Tasks = [
  {
    "id": "review-weak-area-1",
    "title": "Review Weak Area #1 from Practice Exam",
    "description": "Focused study on first identified weak area from practice test",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["practice-exam-second"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "linux-cron",
    "title": "Linux Advanced Topic: Cron Jobs",
    "description": "Learn about scheduling automated tasks in Linux",
    "category": "linux",
    "estimatedMinutes": 30,
    "dependencies": ["integration-project-final"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "linux-cron-tutorial",
        "title": "Linux Cron Jobs Tutorial",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "linux-cron-practice",
        "title": "Practice Scheduling Tasks",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-cron-scheduler",
        "content": "Create a visual cron job scheduler to help understand the timing syntax"
      }
    ]
  },
  {
    "id": "review-weak-area-2",
    "title": "Review Weak Area #2 from Practice Exam",
    "description": "Focused study on second identified weak area from practice test",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["review-weak-area-1"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "git-hooks",
    "title": "Git Advanced Topic: Git Hooks",
    "description": "Learn about automating actions in Git with hooks",
    "category": "git",
    "estimatedMinutes": 30,
    "dependencies": ["linux-cron"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "git-hooks-tutorial",
        "title": "Git Hooks Tutorial",
        "category": "git",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "git-hooks-implement",
        "title": "Implement Pre-commit Hooks",
        "category": "git",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "review-weak-area-3",
    "title": "Review Weak Area #3 from Practice Exam",
    "description": "Focused study on third identified weak area from practice test",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["review-weak-area-2"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "python-decorators",
    "title": "Python Advanced Topic: Decorators",
    "description": "Learn about Python decorator pattern for extending functions",
    "category": "python",
    "estimatedMinutes": 30,
    "dependencies": ["git-hooks"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "python-decorators-tutorial",
        "title": "Python Decorators Tutorial",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "python-decorators-practice",
        "title": "Practice Creating and Using Decorators",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-decorators-diagrams",
        "content": "Draw diagrams to understand decorators, visualizing how they wrap and extend function behavior"
      }
    ]
  },
  {
    "id": "performance-questions",
    "title": "Performance-Based Questions Practice",
    "description": "Practice hands-on scenario questions similar to the exam",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["review-weak-area-3"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "linux-vm-backup",
    "title": "Linux VM Backup and Recovery",
    "description": "Learn how to backup and restore virtual machines",
    "category": "linux",
    "estimatedMinutes": 30,
    "dependencies": ["python-decorators"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "linux-vm-backup-tutorial",
        "title": "VM Backup Tutorial",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "linux-vm-backup-create",
        "title": "Create Backup of Your Linux Environment",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "practice-exam-2-first",
    "title": "Second Practice Exam (First Half)",
    "description": "Take the first part of a second comprehensive practice exam",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["performance-questions"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": []
  },
  {
    "id": "practice-exam-2-second",
    "title": "Second Practice Exam (Second Half)",
    "description": "Complete the second practice exam and review results",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["practice-exam-2-first"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "practice-exam-2-review",
        "title": "Review Incorrect Answers",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-flashcards",
        "content": "Create flashcards for persistently difficult concepts to reinforce memory through repetition"
      }
    ]
  },
  {
    "id": "performance-based-practice",
    "title": "Focus on Performance-Based Questions",
    "description": "Practice scenario-based troubleshooting and configurations",
    "category": "review",
    "estimatedMinutes": 45,
    "dependencies": ["practice-exam-2-second"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "performance-troubleshooting",
        "title": "Practice Scenario-Based Troubleshooting",
        "category": "review",
        "estimatedMinutes": 20,
        "completed": false
      },
      {
        "id": "performance-config-practice",
        "title": "Practice Configurations in Your Linux VM",
        "category": "linux",
        "estimatedMinutes": 25,
        "completed": false
      }
    ]
  },
  {
    "id": "github-portfolio",
    "title": "GitHub Portfolio Development",
    "description": "Organize your projects on GitHub as a professional portfolio",
    "category": "git",
    "estimatedMinutes": 45,
    "dependencies": ["linux-vm-backup"],
    "priority": 11,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "github-organize-projects",
        "title": "Organize Your Projects on GitHub",
        "category": "git",
        "estimatedMinutes": 20,
        "completed": false
      },
      {
        "id": "github-portfolio-readme",
        "title": "Create a Portfolio README",
        "category": "git",
        "estimatedMinutes": 25,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-portfolio-template",
        "content": "Use a template to ensure consistency across your portfolio, reducing decision fatigue"
      }
    ]
  }
];

// Week 12: Final Preparations & Exam
const week12Tasks = [
  {
    "id": "exam-logistics",
    "title": "CompTIA A+ Exam Logistics Review",
    "description": "Review exam format, rules, and prepare logistics",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["performance-based-practice", "github-portfolio"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "exam-confirm-time",
        "title": "Confirm Exam Time and Location",
        "category": "review",
        "estimatedMinutes": 10,
        "completed": false
      },
      {
        "id": "exam-structure-review",
        "title": "Review Exam Structure and Scoring",
        "category": "review",
        "estimatedMinutes": 20,
        "completed": false
      }
    ]
  },
  {
    "id": "hardware-final-review",
    "title": "Hardware Final Review",
    "description": "Final review of hardware concepts focusing on weak areas",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["exam-logistics"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "hardware-weak-topics",
        "title": "Focus on Your Weakest Hardware Topics",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "hardware-troubleshooting",
        "title": "Review Hardware Troubleshooting Scenarios",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-hardware-reference",
        "content": "Create a one-page hardware reference sheet with key specifications and troubleshooting steps"
      }
    ]
  },
  {
    "id": "networking-final-review",
    "title": "Networking Final Review",
    "description": "Final review of networking concepts focusing on core topics",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["hardware-final-review"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "networking-subnetting",
        "title": "Focus on Subnetting and IP Addressing",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "networking-troubleshooting",
        "title": "Review Network Troubleshooting",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-procedure-cards",
        "content": "Create step-by-step procedure cards for common tasks to help with recall during pressure situations"
      }
    ]
  },
  {
    "id": "windows-final-review",
    "title": "Windows/OS Final Review",
    "description": "Final review of operating system concepts and tools",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["networking-final-review"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "windows-command-line",
        "title": "Focus on Command Line Tools",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "windows-security-settings",
        "title": "Review Security Settings",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "security-final-review",
    "title": "Security Final Review",
    "description": "Final review of security concepts and best practices",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["windows-final-review"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "security-authentication",
        "title": "Focus on Authentication and Encryption",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "security-best-practices",
        "title": "Review Security Best Practices",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-security-analogies",
        "content": "Use analogies to reinforce complex security concepts, making them more memorable and relatable"
      }
    ]
  },
  {
    "id": "mobile-cloud-final-review",
    "title": "Mobile/Cloud Final Review",
    "description": "Final review of mobile device and cloud computing concepts",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["security-final-review"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "mobile-management-review",
        "title": "Review Mobile Device Management",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "cloud-models-review",
        "title": "Review Cloud Models and Concepts",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  },
  {
    "id": "final-practice-exam",
    "title": "Full Practice Exam",
    "description": "Take a timed comprehensive practice exam",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["mobile-cloud-final-review"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "practice-exam-timing",
        "title": "Time Yourself to Practice Exam Pacing",
        "category": "review",
        "estimatedMinutes": 30,
        "completed": false
      }
    ]
  },
  {
    "id": "final-review",
    "title": "Review Exam Answers and Last-Minute Study",
    "description": "Review practice exam answers and focus on weak areas",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["final-practice-exam"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "focus-weak-areas",
        "title": "Focus Only on Areas Where You Scored Below 80%",
        "category": "review",
        "estimatedMinutes": 30,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-exam-reminder",
        "content": "Create a reminder sheet for exam day with key points to remember about time management and question strategy"
      }
    ]
  },
  {
    "id": "relaxed-review",
    "title": "Relaxed Review of Key Concepts",
    "description": "Light review of most important concepts before exam",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["final-review"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "review-notes",
        "title": "Review Your Notes and Cheat Sheets",
        "category": "review",
        "estimatedMinutes": 30,
        "completed": false
      }
    ]
  },
  {
    "id": "exam-preparation",
    "title": "Exam Preparation",
    "description": "Final preparation steps the night before the exam",
    "category": "review",
    "estimatedMinutes": 30,
    "dependencies": ["relaxed-review"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "prepare-materials",
        "title": "Prepare All Required Items for Exam Day",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "get-sleep",
        "title": "Get a Good Night's Sleep",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      }
    ],
    "adhd_tips": [
      {
        "id": "adhd-exam-checklist",
        "content": "Create a checklist for exam materials to avoid last-minute stress about forgetting something important"
      }
    ]
  },
  {
    "id": "exam-day",
    "title": "EXAM DAY",
    "description": "Take the CompTIA A+ certification exam",
    "category": "review",
    "estimatedMinutes": 120,
    "dependencies": ["exam-preparation"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "arrive-early",
        "title": "Arrive Early",
        "category": "review",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "exam-breathing",
        "title": "Use Deep Breathing Techniques Before the Exam",
        "category": "review",
        "estimatedMinutes": 5,
        "completed": false
      },
      {
        "id": "exam-careful-reading",
        "title": "Read Each Question Carefully",
        "category": "review",
        "estimatedMinutes": 90,
        "completed": false
      },
      {
        "id": "exam-review-answers",
        "title": "Review All Questions Before Submitting",
        "category": "review",
        "estimatedMinutes": 10,
        "completed": false
      }
    ]
  },
  {
    "id": "post-exam",
    "title": "After Exam",
    "description": "Post-exam reflection and celebration",
    "category": "review",
    "estimatedMinutes": 60,
    "dependencies": ["exam-day"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "document-experience",
        "title": "Document Your Experience While Fresh",
        "category": "review",
        "estimatedMinutes": 30,
        "completed": false
      },
      {
        "id": "celebrate",
        "title": "Celebrate Your Accomplishment!",
        "category": "review",
        "estimatedMinutes": 30,
        "completed": false
      }
    ]
  },
  {
    "id": "skills-review",
    "title": "Review Your New Skills Portfolio",
    "description": "Take inventory of all the skills gained during this process",
    "category": "review",
    "estimatedMinutes": 60,
    "dependencies": ["post-exam"],
    "priority": 12,
    "completed": false,
    "completedDate": null,
    "subtasks": [
      {
        "id": "linux-skills-review",
        "title": "Linux Skills",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "git-skills-review",
        "title": "Git Version Control",
        "category": "git",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "python-skills-review",
        "title": "Python Programming",
        "category": "python",
        "estimatedMinutes": 15,
        "completed": false
      },
      {
        "id": "vm-skills-review",
        "title": "Virtual Machine Management",
        "category": "linux",
        "estimatedMinutes": 15,
        "completed": false
      }
    ]
  }
];

// Export the tasks as JSON
console.log(JSON.stringify({
  week8: week8Tasks,
  week9: week9Tasks,
  week10: week10Tasks,
  week11: week11Tasks,
  week12: week12Tasks
}, null, 2));

// This is just a utility function to save to files if needed
function saveTasksToFiles() {
  // In a Node.js environment, we would save each week to a separate file
  // For browser environments, we could use localStorage or provide download links
  
  // Example pseudocode for Node.js:
  // const fs = require('fs');
  // fs.writeFileSync('week8-tasks.json', JSON.stringify(week8Tasks, null, 2));
  // fs.writeFileSync('week9-tasks.json', JSON.stringify(week9Tasks, null, 2));
  // fs.writeFileSync('week10-tasks.json', JSON.stringify(week10Tasks, null, 2));
  // fs.writeFileSync('week11-tasks.json', JSON.stringify(week11Tasks, null, 2));
  // fs.writeFileSync('week12-tasks.json', JSON.stringify(week12Tasks, null, 2));
}
