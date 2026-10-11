import { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'Work Style & Problem Solving',
    title: 'How do you naturally approach solving a complex problem?',
    subtitle: 'Choose the option that feels most like your default mindset.',
    options: [
      {
        id: 'q1_a',
        text: 'Break it into data points, analyze root causes, and run structured experiments.',
        subtitle: 'Analytical & Methodical',
        traits: { analytical: 30, technical: 15, operational: 10 },
      },
      {
        id: 'q1_b',
        text: 'Brainstorm fresh visual concepts, experiment with novel frameworks, and think outside the box.',
        subtitle: 'Creative & Visual',
        traits: { creative: 35, interpersonal: 10 },
      },
      {
        id: 'q1_c',
        text: 'Talk to people, listen to user pain points, and build agreement through conversation.',
        subtitle: 'Human-Centered & Empathic',
        traits: { interpersonal: 35, leadership: 15 },
      },
      {
        id: 'q1_d',
        text: 'Write reusable code, configure technical tools, or dive into mechanics.',
        subtitle: 'Technical & Engineering',
        traits: { technical: 35, analytical: 15 },
      },
    ],
  },
  {
    id: 'q2',
    category: 'Ideal Daily Tasks',
    title: 'Which activity would you enjoy doing for 4+ hours without getting bored?',
    subtitle: 'Think about what energizes you during study or project time.',
    options: [
      {
        id: 'q2_a',
        text: 'Designing visual interfaces, writing creative copy, or producing multimedia assets.',
        subtitle: 'Design & Content Creation',
        traits: { creative: 35, interpersonal: 10 },
      },
      {
        id: 'q2_b',
        text: 'Investigating trends in datasets, building dashboards, and finding actionable insights.',
        subtitle: 'Data & Quantitative Analysis',
        traits: { analytical: 35, technical: 15 },
      },
      {
        id: 'q2_c',
        text: 'Debugging complex algorithms, configuring cloud infrastructure, or writing clean software code.',
        subtitle: 'Software & Infrastructure',
        traits: { technical: 35, analytical: 15 },
      },
      {
        id: 'q2_d',
        text: 'Mentoring teammates, pitching ideas, organizing schedules, and removing blockers.',
        subtitle: 'Management & Facilitation',
        traits: { leadership: 30, interpersonal: 25, operational: 15 },
      },
    ],
  },
  {
    id: 'q3',
    category: 'Preferred Work Environment',
    title: 'Where do you feel you would produce your best work?',
    subtitle: 'Consider company size, team dynamics, and day-to-day rhythm.',
    options: [
      {
        id: 'q3_a',
        text: 'A fast-paced startup where I wear multiple hats, experiment rapidly, and pitch ideas.',
        subtitle: 'Agile & High Impact',
        traits: { creative: 20, leadership: 20, operational: 15 },
      },
      {
        id: 'q3_b',
        text: 'A collaborative cross-functional team with clear user goals, daily standups, and shared vision.',
        subtitle: 'Team-Centric & Collaborative',
        traits: { interpersonal: 25, leadership: 15, operational: 20 },
      },
      {
        id: 'q3_c',
        text: 'A focused deep-work setup (remote or quiet office) with clear specifications and code repositories.',
        subtitle: 'Focused Deep Work',
        traits: { technical: 25, analytical: 25 },
      },
      {
        id: 'q3_d',
        text: 'A client-facing setting, guiding stakeholders, advising businesses, or leading workshops.',
        subtitle: 'Consulting & Stakeholder Leadership',
        traits: { interpersonal: 30, leadership: 25, analytical: 10 },
      },
    ],
  },
  {
    id: 'q4',
    category: 'Tools & Technologies',
    title: 'Which suite of tools or platforms sounds most exciting to master?',
    subtitle: 'Focus on what you look forward to opening on your computer every morning.',
    options: [
      {
        id: 'q4_a',
        text: 'Figma, Adobe Creative Suite, Framer, and 3D / UI prototyping tools.',
        subtitle: 'Design & Prototyping Tools',
        traits: { creative: 35, technical: 10 },
      },
      {
        id: 'q4_b',
        text: 'VS Code, GitHub, TypeScript, React, Python, Docker, and API testing platforms.',
        subtitle: 'Coding & Developer Tools',
        traits: { technical: 35, analytical: 15 },
      },
      {
        id: 'q4_c',
        text: 'SQL, Python Data Analytics, Tableau, PowerBI, BigQuery, and Jupyter Notebooks.',
        subtitle: 'Data & BI Platforms',
        traits: { analytical: 35, technical: 15 },
      },
      {
        id: 'q4_d',
        text: 'Jira, Notion, HubSpot, Google Analytics, CRM dashboards, and strategic roadmaps.',
        subtitle: 'Productivity & Growth Suite',
        traits: { leadership: 20, operational: 25, interpersonal: 15 },
      },
    ],
  },
  {
    id: 'q5',
    category: 'Definition of Success',
    title: 'At the end of a long workday, what accomplishment makes you feel proudest?',
    subtitle: 'What gives you a sense of meaningful fulfillment?',
    options: [
      {
        id: 'q5_a',
        text: 'Fixing a stubborn technical bug or deploying a seamless, high-performance feature.',
        subtitle: 'Technical Mastery',
        traits: { technical: 30, analytical: 20 },
      },
      {
        id: 'q5_b',
        text: 'Helping someone overcome a hurdle, providing clarity, or building a strong relationship.',
        subtitle: 'Human Connection & Help',
        traits: { interpersonal: 35, leadership: 15 },
      },
      {
        id: 'q5_c',
        text: 'Crafting an aesthetically beautiful experience or compelling story that delights users.',
        subtitle: 'Visual & Conceptual Craft',
        traits: { creative: 35, interpersonal: 10 },
      },
      {
        id: 'q5_d',
        text: 'Optimizing an inefficient process, hitting growth targets, or keeping a team on track.',
        subtitle: 'Operational Efficiency & Growth',
        traits: { operational: 30, leadership: 20, analytical: 10 },
      },
    ],
  },
  {
    id: 'q6',
    category: 'Risk & Innovation vs Security',
    title: 'How do you feel about security, compliance, and systems protection?',
    subtitle: 'Understanding your preference for safety vs innovation.',
    options: [
      {
        id: 'q6_a',
        text: 'I love hunting for vulnerabilities, protecting data, and maintaining strict cyber defenses.',
        subtitle: 'Cybersecurity & Defense',
        traits: { technical: 30, analytical: 25, operational: 15 },
      },
      {
        id: 'q6_b',
        text: 'I prefer building brand new features and experimenting rapidly with AI tools and visual prototypes.',
        subtitle: 'Rapid Prototyping & AI',
        traits: { creative: 30, technical: 20 },
      },
      {
        id: 'q6_c',
        text: 'I enjoy translating complex business goals into clear project roadmaps and team milestones.',
        subtitle: 'Strategic Planning',
        traits: { leadership: 25, operational: 25, interpersonal: 15 },
      },
      {
        id: 'q6_d',
        text: 'I prefer conducting user interviews, running usability tests, and understanding human psychology.',
        subtitle: 'User Research & Psychology',
        traits: { interpersonal: 30, analytical: 20, creative: 10 },
      },
    ],
  },
  {
    id: 'q7',
    category: 'Future Impact',
    title: 'Which tech revolution or field inspires you the most right now?',
    subtitle: 'Where would you love to leave your signature imprint?',
    options: [
      {
        id: 'q7_a',
        text: 'Artificial Intelligence, Machine Learning, and Automated Intelligence Engines.',
        subtitle: 'AI & Machine Learning',
        traits: { analytical: 30, technical: 30 },
      },
      {
        id: 'q7_b',
        text: 'User Experience Design, Interactive Web Apps, and Mobile Human Interfaces.',
        subtitle: 'UI/UX & Interactive Design',
        traits: { creative: 30, interpersonal: 20, technical: 10 },
      },
      {
        id: 'q7_c',
        text: 'Cloud Architecture, Distributed Systems, and DevOps Automation.',
        subtitle: 'Cloud Infrastructure',
        traits: { technical: 35, operational: 20 },
      },
      {
        id: 'q7_d',
        text: 'Health Tech, EdTech, or Social Impact platforms improving everyday lives.',
        subtitle: 'Social & Health Impact',
        traits: { interpersonal: 30, leadership: 20, operational: 15 },
      },
    ],
  },
];
