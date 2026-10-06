export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  stack: string[]
  status: string
  liveUrl?: string
  sourceUrl?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'puthurkattu-cims',
    title: 'Puthurkattu CIMS',
    tagline: 'Clinic management system, Puthurkattu Bone & Joint Centre',
    description:
      'A full patient records, billing and scheduling system built and administered for a working orthopedic clinic. Migrated the clinic\u2019s legacy MSSQL Server 2005 database to MySQL 8.0, then layered on Pay4Sms-powered billing receipts and WhatsApp treatment reminders sent through a verified business account \u2014 including auto-sending treatment videos to first-visit patients. Packaged as a Windows desktop build for front-desk use.',
    stack: ['Python', 'Flask', 'MySQL 8.0', 'Pay4Sms API', 'WhatsApp Business API'],
    status: 'Private client project \u00b7 live in daily clinic use',
    featured: true,
  },
  {
    id: 'ayyavaigundar-site',
    title: 'Ayya Alangarapathi Temple Site',
    tagline: 'Static site & content pipeline for ayyavaigundar.in',
    description:
      'A complete static website for the Ayya Alangarapathi Temple, driven by a custom Python site generator and a JSON content config rather than a CMS. A tkinter helper app lets non-technical temple staff publish new weekly photo albums, which run through a three-tier image pipeline (thumbnail / medium / full) built on Pillow, in a saffron-and-maroon theme set in Noto Sans Tamil and Poppins.',
    stack: ['Python', 'Static site generator', 'Pillow', 'Tkinter', 'Tamil typography'],
    status: 'Live \u00b7 built 2023, redesigned 2026',
    liveUrl: 'http://ayyavaigundar.in',
  },
  {
    id: 'temple-devotee-records',
    title: 'Temple Devotee & Donation Records',
    tagline: 'Devotee database and income tracking for the temple',
    description:
      'A Flask and MySQL application for managing devotee records and tracking temple income and donations. Ships as an offline-capable desktop build via PyInstaller, with Bootstrap and Tamil web fonts bundled locally so it runs without an internet connection on-site.',
    stack: ['Python', 'Flask', 'SQLAlchemy', 'MySQL', 'PyInstaller'],
    status: 'Private \u00b7 in active use',
  },
  {
    id: 'hms-krishnagiri',
    title: 'HMS Data Bridge \u2014 MRD Krishnagiri',
    tagline: 'Bridging a modern system to a legacy 2005 hospital server',
    description:
      'A Flask utility that connects modern systems and websites to a hospital\u2019s old MSSQL Server 2005 database using pyodbc and the ODBC Driver 18, plus a pandas-based importer that pulls patient data in from .xls, .xlsx and .csv files instead of manual re-entry.',
    stack: ['Python', 'Flask', 'pyodbc', 'pandas', 'MSSQL Server'],
    status: 'Private client project',
  },
  {
    id: 'client-sites',
    title: 'Client Website Modernization',
    tagline: 'Redesigns delivered through Nanotec Solutions',
    description:
      'A run of client website rebuilds \u2014 taking dated brochure sites to modern, responsive ones and FTP-deploying them via GoDaddy hosting. Includes a nursing college site, a supplier directory, and an associate firm\u2019s site.',
    stack: ['HTML5', 'CSS', 'JavaScript', 'FTP deployment'],
    status: 'Live \u00b7 2024\u2013present',
    liveUrl: 'http://aacon.in',
  },
  {
    id: 'signify',
    title: 'Signify',
    tagline: 'Wearable glove that turns ISL gestures into speech',
    description:
      'Final-year team project: a low-cost wearable smart glove that translates Indian Sign Language hand gestures into real-time speech using flex and motion sensors, a microcontroller and wireless communication \u2014 aimed at a practical, portable alternative to existing sign-language recognition setups. Built with Saravanan S N and Muthukumar Vignesh S.',
    stack: ['Arduino', 'ESP32', 'Embedded C', 'Flex & motion sensors'],
    status: 'Team project \u00b7 in development',
  },
]
