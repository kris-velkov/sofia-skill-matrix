import type { CompetencyLevel, SkillLevel } from "./types";

export const COMPETENCY_LEVELS: CompetencyLevel[] = [
  {
    grade: 0,
    name: "No competency",
    description: "I know nothing about this or the skill is not applicable.",
    color: "bg-skill-0",
  },
  {
    grade: 1,
    name: "Some knowledge",
    description:
      "I know something, and after further reading I am able to perform simple tasks.",
    color: "bg-skill-1",
  },
  {
    grade: 2,
    name: "Working knowledge",
    description:
      "I can perform simple tasks. After further reading I can challenge average tasks.",
    color: "bg-skill-2",
  },
  {
    grade: 3,
    name: "Good competency",
    description:
      "I can perform average tasks and with further research I can challenge complex tasks.",
    color: "bg-skill-3",
  },
  {
    grade: 4,
    name: "Expert",
    description:
      "I can perform complex tasks and with further research I can challenge very complex tasks.",
    color: "bg-skill-4",
  },
];

/* -------------------------------------------------
 * Helper
 * ------------------------------------------------- */
export const calculateAverageLevel = (
  skills: { level: SkillLevel }[]
): number => {
  if (skills.length === 0) return 0;
  const sum = skills.reduce((s, k) => s + k.level, 0);
  return Number((sum / skills.length).toFixed(1));
};

export const EMPLOYEES_DATA = [
  {
    id: "alexandar-baruh",
    name: "Alexandar Baruh",
    firstName: "Alexandar",
    lastName: "Baruh",
    email: "alexandar.b@example.com",
    phone: "+1 234 567 8900",
    bio: "Experienced Drupal Themer with a strong background in front-end development and design.",
    country: "Bulgaria",
    cityState: "Sofia",
    postalCode: "1000",
    taxId: "BG123456789",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/alexandar.b",
    linkedinUrl: "https://linkedin.com/in/alexandar-baruh", // Added
    careerExperience: "10y 10m",
    department: "Drupal",
    badge: "Senior",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 3 },
          { name: "Potential", level: 3 },
          { name: "Communication", level: 3 },
          { name: "Confidence", level: 3 },
          { name: "English", level: 2 },
          { name: "Lecturing", level: 2 },
          { name: "Presentations", level: 2 },
          { name: "Leadership", level: 3 },
        ],
        averageLevel: 2.6,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 3,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 2, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 2 },
          { name: "parallel", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 2, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 2, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 2 },
          { name: "MSSQL", level: 2 },
          { name: "NeDB", level: 2 },
          { name: "S3", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 2 },
          { name: "docksal", level: 2 },
          { name: "Lando", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 3, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 2 },
          { name: "Multisite", level: 3 },
          { name: "Domain", level: 2 },
          { name: "Headless", level: 2 },
          { name: "Static", level: 2 },
          { name: "Commerce", level: 2 },
          { name: "Twig", level: 3 },
          { name: "Tests", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 2 },
          { name: "Jenkins", level: 2 },
          { name: "Ansible", level: 2 },
          { name: "Others", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 3 },
          { name: "find, grep", level: 2 },
          { name: "awk, sed", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 2, url: "https://git-scm.com/" }],
        averageLevel: 2.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 1 },
          { name: "Python", level: 1, url: "https://www.python.org/" },
          { name: "Expect", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 1 },
          { name: "AWS", level: 2, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 2 },
          { name: "Azure", level: 3 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 1, url: "https://react.dev/" },
          { name: "Vue", level: 1 },
          { name: "Angular", level: 2 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 2 },
          { name: "Hybrid", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 1 },
          { name: "GTM", level: 1 },
          { name: "Matomo", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 1 },
          { name: "Elasticsearch", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 1 },
          { name: "Redis", level: 1 },
          { name: "Memcache", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 2 },
          { name: "Acquia", level: 2 },
          { name: "Pantheon", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 2, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 2 },
          { name: "Kubernetes", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 2 },
          { name: "Networking", level: 2 },
          { name: "Security", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 2 },
          { name: "Xpath/XSL", level: 2 },
          { name: "CSS/SASS", level: 2 },
        ],
        averageLevel: 2.0,
      },
    ],
  },
  {
    id: "andrii-prokh",
    name: "Andrii Prokh",
    firstName: "Andrii",
    lastName: "Prokh",
    email: "andrii.p@example.com",
    phone: "+1 234 567 8901",
    bio: "Senior PHP developer with expertise in backend frameworks and database management.",
    country: "Ukraine",
    cityState: "Kyiv",
    postalCode: "01001",
    taxId: "UA987654321",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/andrii.p",
    linkedinUrl: "https://linkedin.com/in/andrii-prokh", // Added
    careerExperience: "1y 8m",
    department: "Backend",
    badge: "Senior",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 4 },
          { name: "Potential", level: 4 },
          { name: "Communication", level: 3 },
          { name: "Confidence", level: 3 },
          { name: "English", level: 2 },
          { name: "Lecturing", level: 2 },
          { name: "Presentations", level: 2 },
          { name: "Leadership", level: 3 },
        ],
        averageLevel: 2.9,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 3,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 3, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 3 },
          { name: "parallel", level: 0 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 4, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 2, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 2 },
          { name: "MSSQL", level: 1 },
          { name: "NeDB", level: 1 },
          { name: "S3", level: 3 },
        ],
        averageLevel: 2.2,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 2 },
          { name: "docksal", level: 3 },
          { name: "Lando", level: 4 },
        ],
        averageLevel: 3.0,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 4, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 4 },
          { name: "Multisite", level: 4 },
          { name: "Domain", level: 4 },
          { name: "Headless", level: 4 },
          { name: "Static", level: 3 },
          { name: "Commerce", level: 4 },
          { name: "Twig", level: 4 },
          { name: "Tests", level: 3 },
        ],
        averageLevel: 3.8,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 3 },
          { name: "Jenkins", level: 3 },
          { name: "Ansible", level: 2 },
          { name: "Others", level: 3 },
        ],
        averageLevel: 2.8,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 4 },
          { name: "find, grep", level: 3 },
          { name: "awk, sed", level: 2 },
        ],
        averageLevel: 3.0,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 4, url: "https://git-scm.com/" }],
        averageLevel: 4.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 3 },
          { name: "Python", level: 2, url: "https://www.python.org/" },
          { name: "Expect", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 2 },
          { name: "AWS", level: 2, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 1 },
          { name: "Azure", level: 1 },
        ],
        averageLevel: 1.5,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 3, url: "https://react.dev/" },
          { name: "Vue", level: 2 },
          { name: "Angular", level: 1 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 0 },
          { name: "Hybrid", level: 0 },
        ],
        averageLevel: 0.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 3 },
          { name: "GTM", level: 3 },
          { name: "Matomo", level: 0 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 4 },
          { name: "Elasticsearch", level: 4 },
        ],
        averageLevel: 4.0,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 3 },
          { name: "Redis", level: 3 },
          { name: "Memcache", level: 3 },
        ],
        averageLevel: 3.0,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 2 },
          { name: "Acquia", level: 3 },
          { name: "Pantheon", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 3, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 3 },
          { name: "Kubernetes", level: 1 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 3 },
          { name: "Networking", level: 3 },
          { name: "Security", level: 2 },
        ],
        averageLevel: 2.7,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 3 },
          { name: "Xpath/XSL", level: 3 },
          { name: "CSS/SASS", level: 2 },
        ],
        averageLevel: 2.7,
      },
    ],
  },
  {
    id: "dimitar-dalev",
    name: "Dimitar Dalev",
    firstName: "Dimitar",
    lastName: "Dalev",
    email: "dimitar.d@example.com",
    phone: "+1 234 567 8902",
    bio: "Dedicated PHP developer with a focus on robust and scalable backend solutions.",
    country: "Bulgaria",
    cityState: "Plovdiv",
    postalCode: "4000",
    taxId: "BG123456790",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/dimitar.d",
    linkedinUrl: "https://linkedin.com/in/dimitar-dalev", // Added
    careerExperience: "3y 5m",
    department: "Backend",
    badge: "Senior",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 3 },
          { name: "Potential", level: 3 },
          { name: "Communication", level: 3 },
          { name: "Confidence", level: 2 },
          { name: "English", level: 3 },
          { name: "Lecturing", level: 3 },
          { name: "Presentations", level: 2 },
          { name: "Leadership", level: 3 },
        ],
        averageLevel: 2.8,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 2,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 2, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 2 },
          { name: "parallel", level: 0 },
        ],
        averageLevel: 1.5,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 2, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 1, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 2 },
          { name: "MSSQL", level: 2 },
          { name: "NeDB", level: 0 },
          { name: "S3", level: 2 },
        ],
        averageLevel: 1.5,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 2 },
          { name: "docksal", level: 2 },
          { name: "Lando", level: 3 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 3, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 2 },
          { name: "Multisite", level: 2 },
          { name: "Domain", level: 1 },
          { name: "Headless", level: 1 },
          { name: "Static", level: 3 },
          { name: "Commerce", level: 1 },
          { name: "Twig", level: 1 },
          { name: "Tests", level: 1 },
        ],
        averageLevel: 1.8,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 3 },
          { name: "Jenkins", level: 0 },
          { name: "Ansible", level: 0 },
          { name: "Others", level: 0 },
        ],
        averageLevel: 0.8,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 2 },
          { name: "find, grep", level: 2 },
          { name: "awk, sed", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 3, url: "https://git-scm.com/" }],
        averageLevel: 3.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 2 },
          { name: "Python", level: 1, url: "https://www.python.org/" },
          { name: "Expect", level: 0 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 2 },
          { name: "AWS", level: 2, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 0 },
          { name: "Azure", level: 0 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 3, url: "https://react.dev/" },
          { name: "Vue", level: 0 },
          { name: "Angular", level: 0 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 1 },
          { name: "Hybrid", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 2 },
          { name: "GTM", level: 2 },
          { name: "Matomo", level: 0 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 3 },
          { name: "Elasticsearch", level: 2 },
        ],
        averageLevel: 2.5,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 2 },
          { name: "Redis", level: 2 },
          { name: "Memcache", level: 0 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 3 },
          { name: "Acquia", level: 2 },
          { name: "Pantheon", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 2, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 2 },
          { name: "Kubernetes", level: 0 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 2 },
          { name: "Networking", level: 2 },
          { name: "Security", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 2 },
          { name: "Xpath/XSL", level: 0 },
          { name: "CSS/SASS", level: 1 },
        ],
        averageLevel: 1.0,
      },
    ],
  },
  {
    id: "ivan-ivanov",
    name: "Ivan Ivanov",
    firstName: "Ivan",
    lastName: "Ivanov",
    email: "ivan.i@example.com",
    phone: "+1 234 567 8903",
    bio: "Backend developer with a passion for clean code and efficient database interactions.",
    country: "Bulgaria",
    cityState: "Varna",
    postalCode: "9000",
    taxId: "BG123456791",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/ivan.i",
    linkedinUrl: "https://linkedin.com/in/ivan-ivanov", // Added
    careerExperience: "3y 7m",
    department: "Backend",
    badge: "Senior",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 3 },
          { name: "Potential", level: 3 },
          { name: "Communication", level: 3 },
          { name: "Confidence", level: 2 },
          { name: "English", level: 3 },
          { name: "Lecturing", level: 2 },
          { name: "Presentations", level: 2 },
          { name: "Leadership", level: 2 },
        ],
        averageLevel: 2.5,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 3,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 3, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 2 },
          { name: "parallel", level: 0 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 3, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 1, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 2 },
          { name: "MSSQL", level: 2 },
          { name: "NeDB", level: 0 },
          { name: "S3", level: 3 },
        ],
        averageLevel: 1.8,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 2 },
          { name: "docksal", level: 2 },
          { name: "Lando", level: 3 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 4, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 2 },
          { name: "Multisite", level: 3 },
          { name: "Domain", level: 2 },
          { name: "Headless", level: 1 },
          { name: "Static", level: 3 },
          { name: "Commerce", level: 1 },
          { name: "Twig", level: 1 },
          { name: "Tests", level: 1 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 3 },
          { name: "Jenkins", level: 0 },
          { name: "Ansible", level: 0 },
          { name: "Others", level: 0 },
        ],
        averageLevel: 0.8,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 2 },
          { name: "find, grep", level: 2 },
          { name: "awk, sed", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 4, url: "https://git-scm.com/" }],
        averageLevel: 4.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 2 },
          { name: "Python", level: 1, url: "https://www.python.org/" },
          { name: "Expect", level: 0 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 2 },
          { name: "AWS", level: 2, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 0 },
          { name: "Azure", level: 0 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 2, url: "https://react.dev/" },
          { name: "Vue", level: 0 },
          { name: "Angular", level: 0 },
        ],
        averageLevel: 0.7,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 1 },
          { name: "Hybrid", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 2 },
          { name: "GTM", level: 2 },
          { name: "Matomo", level: 0 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 2 },
          { name: "Elasticsearch", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 2 },
          { name: "Redis", level: 2 },
          { name: "Memcache", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 2 },
          { name: "Acquia", level: 2 },
          { name: "Pantheon", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 2, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 2 },
          { name: "Kubernetes", level: 0 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 2 },
          { name: "Networking", level: 2 },
          { name: "Security", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 2 },
          { name: "Xpath/XSL", level: 2 },
          { name: "CSS/SASS", level: 2 },
        ],
        averageLevel: 2.0,
      },
    ],
  },
  {
    id: "hristo-meshinski",
    name: "Hristo Meshinski",
    firstName: "Hristo",
    lastName: "Meshinski",
    email: "hristo.m@example.com",
    phone: "+1 234 567 8904",
    bio: "Frontend developer specializing in JavaScript frameworks and modern web interfaces.",
    country: "Bulgaria",
    cityState: "Sofia",
    postalCode: "1000",
    taxId: "BG123456792",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/hristo.m",
    linkedinUrl: "https://linkedin.com/in/hristo-meshinski", // Added
    careerExperience: "2y 9m",
    department: "Frontend",
    badge: "Mid-Level",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 4 },
          { name: "Potential", level: 4 },
          { name: "Communication", level: 3 },
          { name: "Confidence", level: 2 },
          { name: "English", level: 4 },
          { name: "Lecturing", level: 1 },
          { name: "Presentations", level: 1 },
          { name: "Leadership", level: 0 },
        ],
        averageLevel: 2.4,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 3,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 3, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 3 },
          { name: "parallel", level: 0 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 3, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 2, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 0 },
          { name: "MSSQL", level: 1 },
          { name: "NeDB", level: 0 },
          { name: "S3", level: 2 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 0 },
          { name: "docksal", level: 3 },
          { name: "Lando", level: 1 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 3, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 2 },
          { name: "Multisite", level: 2 },
          { name: "Domain", level: 1 },
          { name: "Headless", level: 3 },
          { name: "Static", level: 3 },
          { name: "Commerce", level: 2 },
          { name: "Twig", level: 3 },
          { name: "Tests", level: 1 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 2 },
          { name: "Jenkins", level: 1 },
          { name: "Ansible", level: 0 },
          { name: "Others", level: 3 },
        ],
        averageLevel: 1.5,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 3 },
          { name: "find, grep", level: 2 },
          { name: "awk, sed", level: 1 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 3, url: "https://git-scm.com/" }],
        averageLevel: 3.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 2 },
          { name: "Python", level: 3, url: "https://www.python.org/" },
          { name: "Expect", level: 0 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 1 },
          { name: "AWS", level: 2, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 1 },
          { name: "Azure", level: 0 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 3, url: "https://react.dev/" },
          { name: "Vue", level: 2 },
          { name: "Angular", level: 0 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 0 },
          { name: "Hybrid", level: 0 },
        ],
        averageLevel: 0.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 0 },
          { name: "GTM", level: 0 },
          { name: "Matomo", level: 0 },
        ],
        averageLevel: 0.0,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 2 },
          { name: "Elasticsearch", level: 3 },
        ],
        averageLevel: 2.5,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 0 },
          { name: "Redis", level: 2 },
          { name: "Memcache", level: 0 },
        ],
        averageLevel: 0.7,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 1 },
          { name: "Acquia", level: 3 },
          { name: "Pantheon", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 2, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 2 },
          { name: "Kubernetes", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 3 },
          { name: "Networking", level: 3 },
          { name: "Security", level: 2 },
        ],
        averageLevel: 2.7,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 0 },
          { name: "Xpath/XSL", level: 0 },
          { name: "CSS/SASS", level: 2 },
        ],
        averageLevel: 0.7,
      },
    ],
  },
  {
    id: "kristian-raychev",
    name: "Kristian Raychev",
    firstName: "Kristian",
    lastName: "Raychev",
    email: "kristian.r@example.com",
    phone: "+1 234 567 8905",
    bio: "Senior Team Lead with extensive experience in project management and technical leadership.",
    country: "Bulgaria",
    cityState: "Sofia",
    postalCode: "1000",
    taxId: "BG123456793",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/kristian.r",
    linkedinUrl: "https://linkedin.com/in/kristian-raychev", // Added
    careerExperience: "5y 10m",
    department: "Management",
    badge: "Team Lead",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 4 },
          { name: "Potential", level: 4 },
          { name: "Communication", level: 4 },
          { name: "Confidence", level: 3 },
          { name: "English", level: 3 },
          { name: "Lecturing", level: 3 },
          { name: "Presentations", level: 3 },
          { name: "Leadership", level: 3 },
        ],
        averageLevel: 3.4,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 2,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 0, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 2 },
          { name: "parallel", level: 1 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 3, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 0, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 0 },
          { name: "MSSQL", level: 0 },
          { name: "NeDB", level: 0 },
          { name: "S3", level: 1 },
        ],
        averageLevel: 0.7,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 2 },
          { name: "docksal", level: 0 },
          { name: "Lando", level: 2 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 3, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 2 },
          { name: "Multisite", level: 3 },
          { name: "Domain", level: 2 },
          { name: "Headless", level: 0 },
          { name: "Static", level: 0 },
          { name: "Commerce", level: 2 },
          { name: "Twig", level: 2 },
          { name: "Tests", level: 2 },
        ],
        averageLevel: 1.8,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 3 },
          { name: "Jenkins", level: 0 },
          { name: "Ansible", level: 0 },
          { name: "Others", level: 2 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 2 },
          { name: "find, grep", level: 2 },
          { name: "awk, sed", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 3, url: "https://git-scm.com/" }],
        averageLevel: 3.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 2 },
          { name: "Python", level: 0, url: "https://www.python.org/" },
          { name: "Expect", level: 0 },
        ],
        averageLevel: 0.7,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 2 },
          { name: "AWS", level: 0, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 0 },
          { name: "Azure", level: 0 },
        ],
        averageLevel: 0.5,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 0, url: "https://react.dev/" },
          { name: "Vue", level: 0 },
          { name: "Angular", level: 0 },
        ],
        averageLevel: 0.0,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 0 },
          { name: "Hybrid", level: 0 },
        ],
        averageLevel: 0.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 0 },
          { name: "GTM", level: 0 },
          { name: "Matomo", level: 1 },
        ],
        averageLevel: 0.3,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 1 },
          { name: "Elasticsearch", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 2 },
          { name: "Redis", level: 1 },
          { name: "Memcache", level: 0 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 2 },
          { name: "Acquia", level: 0 },
          { name: "Pantheon", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 0, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 1 },
          { name: "Kubernetes", level: 1 },
        ],
        averageLevel: 0.7,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 0 },
          { name: "Networking", level: 0 },
          { name: "Security", level: 0 },
        ],
        averageLevel: 0.0,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 1 },
          { name: "Xpath/XSL", level: 1 },
          { name: "CSS/SASS", level: 1 },
        ],
        averageLevel: 1.0,
      },
    ],
  },
  {
    id: "mariya-valcheva-tosheva",
    name: "Mariya Valcheva-Tosheva",
    firstName: "Mariya",
    lastName: "Valcheva-Tosheva",
    email: "mariya.v@example.com",
    phone: "+1 234 567 8906",
    bio: "Highly experienced Advanced PHP developer with a broad range of technical skills.",
    country: "Bulgaria",
    cityState: "Sofia",
    postalCode: "1000",
    taxId: "BG123456794",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/mariya.v",
    linkedinUrl: "https://linkedin.com/in/mariya-valcheva-tosheva", // Added
    careerExperience: "14y 3m",
    department: "Backend",
    badge: "Mid-Level",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 4 },
          { name: "Potential", level: 3 },
          { name: "Communication", level: 3 },
          { name: "Confidence", level: 3 },
          { name: "English", level: 3 },
          { name: "Lecturing", level: 2 },
          { name: "Presentations", level: 3 },
          { name: "Leadership", level: 3 },
        ],
        averageLevel: 3.0,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 3,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 2, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 2 },
          { name: "parallel", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 3, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 3, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 2 },
          { name: "MSSQL", level: 2 },
          { name: "NeDB", level: 2 },
          { name: "S3", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 2 },
          { name: "docksal", level: 1 },
          { name: "Lando", level: 2 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 3, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 3 },
          { name: "Multisite", level: 3 },
          { name: "Domain", level: 3 },
          { name: "Headless", level: 3 },
          { name: "Static", level: 3 },
          { name: "Commerce", level: 3 },
          { name: "Twig", level: 3 },
          { name: "Tests", level: 2 },
        ],
        averageLevel: 2.9,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 2 },
          { name: "Jenkins", level: 2 },
          { name: "Ansible", level: 1 },
          { name: "Others", level: 1 },
        ],
        averageLevel: 1.5,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 3 },
          { name: "find, grep", level: 3 },
          { name: "awk, sed", level: 2 },
        ],
        averageLevel: 2.7,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 3, url: "https://git-scm.com/" }],
        averageLevel: 3.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 1 },
          { name: "Python", level: 1, url: "https://www.python.org/" },
          { name: "Expect", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 1 },
          { name: "AWS", level: 1, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 1 },
          { name: "Azure", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 2, url: "https://react.dev/" },
          { name: "Vue", level: 1 },
          { name: "Angular", level: 1 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 2 },
          { name: "Hybrid", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 1 },
          { name: "GTM", level: 1 },
          { name: "Matomo", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 2 },
          { name: "Elasticsearch", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 2 },
          { name: "Redis", level: 2 },
          { name: "Memcache", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 2 },
          { name: "Acquia", level: 2 },
          { name: "Pantheon", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 2, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 1 },
          { name: "Kubernetes", level: 1 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 2 },
          { name: "Networking", level: 1 },
          { name: "Security", level: 1 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 2 },
          { name: "Xpath/XSL", level: 2 },
          { name: "CSS/SASS", level: 2 },
        ],
        averageLevel: 2.0,
      },
    ],
  },
  {
    id: "nevena-kostova",
    name: "Nevena Kostova",
    firstName: "Nevena",
    lastName: "Kostova",
    email: "nevena.k@example.com",
    phone: "+1 234 567 8907",
    bio: "General Administrator with strong organizational and communication skills.",
    country: "Bulgaria",
    cityState: "Sofia",
    postalCode: "1000",
    taxId: "BG123456795",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/nevena.k",
    linkedinUrl: "https://linkedin.com/in/nevena-kostova", // Added
    careerExperience: "7y 5m",
    department: "General Admin",
    badge: "General Admin",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 4 },
          { name: "Potential", level: 4 },
          { name: "Communication", level: 4 },
          { name: "Confidence", level: 3 },
          { name: "English", level: 4 },
          { name: "Lecturing", level: 3 },
          { name: "Presentations", level: 3 },
          { name: "Leadership", level: 4 },
        ],
        averageLevel: 3.6,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 3,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 2, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 1 },
          { name: "parallel", level: 0 },
        ],
        averageLevel: 1.5,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 3, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 0, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 0 },
          { name: "MSSQL", level: 0 },
          { name: "NeDB", level: 0 },
          { name: "S3", level: 1 },
        ],
        averageLevel: 0.7,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 3 },
          { name: "docksal", level: 1 },
          { name: "Lando", level: 3 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 4, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 2 },
          { name: "Multisite", level: 3 },
          { name: "Domain", level: 4 },
          { name: "Headless", level: 2 },
          { name: "Static", level: 2 },
          { name: "Commerce", level: 2 },
          { name: "Twig", level: 3 },
          { name: "Tests", level: 2 },
        ],
        averageLevel: 2.9,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 3 },
          { name: "Jenkins", level: 1 },
          { name: "Ansible", level: 0 },
          { name: "Others", level: 1 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 2 },
          { name: "find, grep", level: 2 },
          { name: "awk, sed", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 4, url: "https://git-scm.com/" }],
        averageLevel: 4.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 2 },
          { name: "Python", level: 0, url: "https://www.python.org/" },
          { name: "Expect", level: 0 },
        ],
        averageLevel: 0.7,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 2 },
          { name: "AWS", level: 2, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 1 },
          { name: "Azure", level: 0 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 2, url: "https://react.dev/" },
          { name: "Vue", level: 2 },
          { name: "Angular", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 0 },
          { name: "Hybrid", level: 0 },
        ],
        averageLevel: 0.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 2 },
          { name: "GTM", level: 0 },
          { name: "Matomo", level: 0 },
        ],
        averageLevel: 0.7,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 1 },
          { name: "Elasticsearch", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 3 },
          { name: "Redis", level: 2 },
          { name: "Memcache", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 2 },
          { name: "Acquia", level: 2 },
          { name: "Pantheon", level: 3 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 0, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 0 },
          { name: "Kubernetes", level: 2 },
        ],
        averageLevel: 0.7,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 1 },
          { name: "Networking", level: 1 },
          { name: "Security", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 1 },
          { name: "Xpath/XSL", level: 3 },
          { name: "CSS/SASS", level: 2 },
        ],
        averageLevel: 2.0,
      },
    ],
  },
  {
    id: "radostina-mangarudova",
    name: "Radostina Mangarudova",
    firstName: "Radostina",
    lastName: "Mangarudova",
    email: "radostina.m@example.com",
    phone: "+1 234 567 8908",
    bio: "Frontend developer with a strong focus on user experience and modern JavaScript frameworks.",
    country: "Bulgaria",
    cityState: "Sofia",
    postalCode: "1000",
    taxId: "BG123456796",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/radostina.m",
    linkedinUrl: "https://linkedin.com/in/radostina-mangarudova", // Added
    careerExperience: "3y 7m",
    department: "Frontend",
    badge: "Mid-Level",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 4 },
          { name: "Potential", level: 3 },
          { name: "Communication", level: 4 },
          { name: "Confidence", level: 3 },
          { name: "English", level: 3 },
          { name: "Lecturing", level: 2 },
          { name: "Presentations", level: 3 },
          { name: "Leadership", level: 3 },
        ],
        averageLevel: 3.1,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 3,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 3, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 3 },
          { name: "parallel", level: 3 },
        ],
        averageLevel: 3.0,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 3, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 2, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 2 },
          { name: "MSSQL", level: 2 },
          { name: "NeDB", level: 1 },
          { name: "S3", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 2 },
          { name: "docksal", level: 2 },
          { name: "Lando", level: 3 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 2, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 2 },
          { name: "Multisite", level: 2 },
          { name: "Domain", level: 2 },
          { name: "Headless", level: 2 },
          { name: "Static", level: 2 },
          { name: "Commerce", level: 2 },
          { name: "Twig", level: 3 },
          { name: "Tests", level: 3 },
        ],
        averageLevel: 2.2,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 3 },
          { name: "Jenkins", level: 3 },
          { name: "Ansible", level: 3 },
          { name: "Others", level: 2 },
        ],
        averageLevel: 2.8,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 2 },
          { name: "find, grep", level: 2 },
          { name: "awk, sed", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 3, url: "https://git-scm.com/" }],
        averageLevel: 3.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 3 },
          { name: "Python", level: 3, url: "https://www.python.org/" },
          { name: "Expect", level: 2 },
        ],
        averageLevel: 2.7,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 2 },
          { name: "AWS", level: 2, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 3 },
          { name: "Azure", level: 3 },
        ],
        averageLevel: 2.5,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 3, url: "https://react.dev/" },
          { name: "Vue", level: 3 },
          { name: "Angular", level: 3 },
        ],
        averageLevel: 3.0,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 3 },
          { name: "Hybrid", level: 3 },
        ],
        averageLevel: 3.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 2 },
          { name: "GTM", level: 2 },
          { name: "Matomo", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 2 },
          { name: "Elasticsearch", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 2 },
          { name: "Redis", level: 2 },
          { name: "Memcache", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 3 },
          { name: "Acquia", level: 3 },
          { name: "Pantheon", level: 2 },
        ],
        averageLevel: 2.7,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 3, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 2 },
          { name: "Kubernetes", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 1 },
          { name: "Networking", level: 3 },
          { name: "Security", level: 3 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 2 },
          { name: "Xpath/XSL", level: 2 },
          { name: "CSS/SASS", level: 3 },
        ],
        averageLevel: 2.3,
      },
    ],
  },
  {
    id: "yavor-stoimenov",
    name: "Yavor Stoimenov",
    firstName: "Yavor",
    lastName: "Stoimenov",
    email: "yavor.s@example.com",
    phone: "+1 234 567 8909",
    bio: "Backend developer with a strong foundation in various data stores and build tools.",
    country: "Bulgaria",
    cityState: "Plovdiv",
    postalCode: "4000",
    taxId: "BG123456797",
    slackProfileImage: "/placeholder.svg?height=64&width=64",
    slackUrl: "https://slack.com/yavor.s",
    linkedinUrl: "https://linkedin.com/in/yavor-stoimenov", // Added
    careerExperience: "3y 6m",
    department: "Backend",
    badge: "Mid-Level",
    skills: [
      {
        name: "Generic",
        skills: [
          { name: "Motivation", level: 4 },
          { name: "Potential", level: 4 },
          { name: "Communication", level: 3 },
          { name: "Confidence", level: 3 },
          { name: "English", level: 3 },
          { name: "Lecturing", level: 1 },
          { name: "Presentations", level: 2 },
          { name: "Leadership", level: 3 },
        ],
        averageLevel: 2.9,
      },
      {
        name: "Javascript",
        skills: [
          {
            name: "Javascript",
            level: 3,
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          },
          { name: "Nodejs", level: 2, url: "https://nodejs.org/" },
          { name: "async/Promises", level: 2 },
          { name: "parallel", level: 2 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "Data stores",
        skills: [
          { name: "mysql", level: 3, url: "https://www.mysql.com/" },
          { name: "mongodb", level: 2, url: "https://www.mongodb.com/" },
          { name: "dynamo", level: 1 },
          { name: "MSSQL", level: 3 },
          { name: "NeDB", level: 0 },
          { name: "S3", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Build tools",
        skills: [
          { name: "BLT", level: 3 },
          { name: "docksal", level: 1 },
          { name: "Lando", level: 4 },
        ],
        averageLevel: 2.7,
      },
      {
        name: "Drupal",
        skills: [
          { name: "Drupal", level: 3, url: "https://www.drupal.org/" },
          { name: "Migrate", level: 2 },
          { name: "Multisite", level: 3 },
          { name: "Domain", level: 2 },
          { name: "Headless", level: 1 },
          { name: "Static", level: 4 },
          { name: "Commerce", level: 3 },
          { name: "Twig", level: 2 },
          { name: "Tests", level: 1 },
        ],
        averageLevel: 2.3,
      },
      {
        name: "CI/CD",
        skills: [
          { name: "Gitlab pipelines", level: 2 },
          { name: "Jenkins", level: 0 },
          { name: "Ansible", level: 0 },
          { name: "Others", level: 2 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "CMD",
        skills: [
          { name: "Vim, nano", level: 2 },
          { name: "find, grep", level: 2 },
          { name: "awk, sed", level: 2 },
        ],
        averageLevel: 2.0,
      },
      {
        name: "VCS",
        skills: [{ name: "GIT", level: 3, url: "https://git-scm.com/" }],
        averageLevel: 3.0,
      },
      {
        name: "Scripting",
        skills: [
          { name: "Bash", level: 2 },
          { name: "Python", level: 2, url: "https://www.python.org/" },
          { name: "Expect", level: 0 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Devops",
        skills: [
          { name: "Devops", level: 1 },
          { name: "AWS", level: 1, url: "https://aws.amazon.com/" },
          { name: "GCP", level: 0 },
          { name: "Azure", level: 0 },
        ],
        averageLevel: 0.5,
      },
      {
        name: "FE frameworks",
        skills: [
          { name: "React", level: 2, url: "https://react.dev/" },
          { name: "Vue", level: 2 },
          { name: "Angular", level: 0 },
        ],
        averageLevel: 1.3,
      },
      {
        name: "Mobile",
        skills: [
          { name: "Mobile", level: 1 },
          { name: "Hybrid", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "SEO",
        skills: [
          { name: "SEO", level: 1 },
          { name: "GTM", level: 1 },
          { name: "Matomo", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Search",
        skills: [
          { name: "Solr", level: 1 },
          { name: "Elasticsearch", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Cache",
        skills: [
          { name: "Varnish", level: 1 },
          { name: "Redis", level: 1 },
          { name: "Memcache", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Hosting",
        skills: [
          { name: "Platform.sh", level: 1 },
          { name: "Acquia", level: 1 },
          { name: "Pantheon", level: 1 },
        ],
        averageLevel: 1.0,
      },
      {
        name: "Virtualization",
        skills: [
          { name: "Docker", level: 2, url: "https://www.docker.com/" },
          { name: "docker-compose", level: 2 },
          { name: "Kubernetes", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Sysadmin",
        skills: [
          { name: "Linux admin", level: 2 },
          { name: "Networking", level: 2 },
          { name: "Security", level: 1 },
        ],
        averageLevel: 1.7,
      },
      {
        name: "Misc languages",
        skills: [
          { name: "Regex", level: 2 },
          { name: "Xpath/XSL", level: 0 },
          { name: "CSS/SASS", level: 3 },
        ],
        averageLevel: 1.7,
      },
    ],
  },
];
