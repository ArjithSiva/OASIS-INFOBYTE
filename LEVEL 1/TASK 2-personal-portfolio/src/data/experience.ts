export interface Experience {
  period: string
  role: string
  org: string
  points: string[]
}

export const experience: Experience[] = [
  {
    period: '2023 \u2014 Present',
    role: 'Developer & Systems Administrator',
    org: 'Nanotec Solutions',
    points: [
      'Built and maintain Puthurkattu CIMS, a Flask clinic management system handling patient records, billing and WhatsApp/SMS communication for a working orthopedic clinic',
      'Migrated legacy MSSQL Server 2005 databases to MySQL across two healthcare projects',
      'Delivered and FTP-deployed 5+ client and community websites, including a temple site serving Tamil-language content',
    ],
  },
]

export const education = {
  degree: 'B.E. Computer Science and Engineering (IoT)',
  school: 'Sri Sairam Engineering College',
  detail: 'CGPA 8.08 \u00b7 Expected graduation May 2028',
}

export const certifications: string[] = [
  'Coursera',
  'NPTEL',
  'Spoken Tutorial \u2014 IIT Bombay',
  'IEEE BLP',
  'MY Bharat',
]

export const achievements: string[] = [
  'Consistently top of department SkillRack points, with multiple SkillRack certificates',
  'Spoke on "Deep Dive into Windows Tools and Utilities" for a department Skill Enrichment Program',
  'Student coordinator for multiple department Skill Enrichment Programs',
  'Participated in SDG-themed hackathons',
]
