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
  employees_skill_levels (
    skill_id,
    level,
    skills (
      id,
      name,
      order_index,
      categories!inner (
        id,
        name,
        default,
        order_index
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
