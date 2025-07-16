export const EMPLOYEE_FULL_SELECT_QUERY = `
  id,
  first_name,
  last_name,
  bio,
  country,
  city,
  program,
  profile_image,
  slack_url,
  linkedin_url,
  career_experience,
  start_date,
  department,
  role,
  float_id,
  certificates (
    id,
    name,
    issuer,
    date,
    url
  ),
  employee_skill_levels (
    level,
    skills (
      name,
      categories!inner (
        name
      )
    )
  )
`;

export const EMPLOYEE_CERTIFICATE_QUERY = `
    id,
        name,
        issuer,
        date,
        url,
        employee:employees (
          id,
          first_name,
          last_name,
          profile_image,
          department,
          role
        )
`;
