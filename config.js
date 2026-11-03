/**
 * =============================================================================
 * THE MAGNIFYING GLASS PORTFOLIO — CONFIGURATION
 * =============================================================================
 * Update all personal details, contact channels, and project links here.
 * All information is verified and easy to modify in one central place.
 */

const PORTFOLIO_CONFIG = {
  // Personal Details
  identity: {
    fullName: "Siddharth Singh",
    preferredName: "Sid",
    role: "Python Backend Builder",
    education: "B.Tech in Computer Science and Engineering",
    university: "Manipal University Jaipur",
    yearOfGraduation: "2028",
    email: "siddharthsingh6621e@gmail.com",
    githubUrl: "https://github.com/siddharth-singh-cs",
    linkedinUrl: "https://linkedin.com/in/siddharth-singh-1b9693378/",
    resumeUrl: "https://drive.google.com/file/d/1p0gFTrkM4deLIiLc_hxShkc09-yEtG1t/view?usp=drive_link"
  },

  // Navigation Links
  nav: {
    links: [
      { id: "work", label: "Work", dialogId: "dialog-work" },
      { id: "about", label: "About", dialogId: "dialog-about" },
      { id: "process", label: "Process", dialogId: "dialog-process" },
      { id: "contact", label: "Contact", dialogId: "dialog-contact" }
    ],
    cta: {
      label: "Let's Talk ↗",
      email: "siddharthsingh6621e@gmail.com"
    }
  },

  // 4 Hidden Secrets placed in the hero
  secrets: [
    {
      id: "secret-1",
      number: 1,
      text: "psst… I'm Sid, and I'm always up for building something interesting 👋",
      serif: true
    },
    {
      id: "secret-2",
      number: 2,
      text: "CURRENT FOCUS: Python backend development · Data Structures & Algorithms",
      serif: false
    },
    {
      id: "secret-3",
      number: 3,
      text: "BUILDING THINGS: PRAGATI · FORM-01 · Python and web development projects",
      serif: false
    },
    {
      id: "secret-4",
      number: 4,
      text: "FIND ME: github.com/siddharth-singh-cs",
      serif: false
    }
  ],

  // Verified Projects for the Work Dialog
  projects: [
    {
      id: "pragati",
      name: "PRAGATI",
      subtitle: "Smart India Hackathon 2026 Concept",
      summary: "A web-based integrated project-monitoring platform developed for the Smart India Hackathon 2026 concept. Designed for transparent government activity tracking and multi-factor project risk assessment.",
      stack: ["Python", "Flask", "GovTech", "Risk Assessment", "SQL"],
      demoUrl: "https://pragati-5g2a.onrender.com/landing",
      githubUrl: null
    },
    {
      id: "python-dsa",
      name: "Python-DSA",
      subtitle: "Active Problem Solving & Algorithms",
      summary: "A structured repository documenting consistent daily problem-solving, implementation of fundamental data structures, search/sort algorithms, and algorithmic patterns in Python.",
      stack: ["Python", "Algorithms", "Data Structures", "Problem Solving"],
      demoUrl: null,
      githubUrl: "https://github.com/siddharth-singh-cs/Python-DSA.git"
    },
    {
      id: "form-01",
      name: "FORM-01",
      subtitle: "Interactive UI & Animation Experiment",
      summary: "An experimental portfolio project exploring rich micro-interactions, hardware-accelerated animations, and responsive layouts planned with a React and TypeScript frontend and a FastAPI Python backend.",
      stack: ["React", "TypeScript", "FastAPI", "Python", "UI Motion"],
      demoUrl: null,
      githubUrl: null
    },
    {
      id: "resumeiq",
      name: "ResumeIQ",
      subtitle: "Intelligent Resume Evaluation",
      summary: "A Flask-based application developed for automated resume parsing, keyword matching, and structured candidate evaluation.",
      stack: ["Python", "Flask", "Resume Parsing", "NLP Basics"],
      demoUrl: null,
      githubUrl: null
    },
    {
      id: "library-mgmt",
      name: "Library Management System",
      subtitle: "HTTP Backend & Dashboard",
      summary: "A modular Java application with an HTTP server backend, relational database integration (MySQL / SQLite), and a dashboard for catalog management and patron checkout records.",
      stack: ["Java", "HTTP Backend", "SQL", "Dashboard"],
      demoUrl: null,
      githubUrl: null
    },
    {
      id: "deep-work-timer",
      name: "Deep Work Timer",
      subtitle: "Focused Productivity Tool",
      summary: "A minimalist, distraction-free productivity timer implementing customized Pomodoro and deep work block workflows with audio-visual cues.",
      stack: ["JavaScript", "CSS3", "Productivity", "Audio API"],
      demoUrl: null,
      githubUrl: null
    }
  ]
};

