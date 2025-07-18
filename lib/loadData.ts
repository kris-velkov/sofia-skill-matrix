import { supabaseClient } from "./supabase/supabaseClient";
import { normalizeDepartment, normalizeSkillName } from "@/lib/utils/normalize";
import fs from "fs";
import path from "path";

type DefaultCategory = {
  id: string;
  name: string;
  skills: { name: string; level: number }[];
};

type EmployeeData = {
  firstName: string;
  lastName: string;
  bio?: string;
  country?: string;
  city?: string;
  program?: string;
  profileImage?: string;
  slackUrl?: string;
  linkedinUrl?: string;
  careerExperience?: string;
  startDate?: string;
  department: string;
  role?: string;
  floatId: string;
  skills: Array<{
    name: string;
    skills: Array<{ name: string; level: number }>;
  }>;
  certificates?: Array<{
    name: string;
    issuer?: string;
    date?: string;
    url?: string;
  }>;
};

type SkillLevelPayload = {
  employee_id: string;
  skill_id: string;
  level: number;
};

// Category Management Functions
async function fetchCategory(categoryName: string) {
  const normalizedCategoryName = normalizeSkillName(categoryName);
  const { data, error } = await supabaseClient
    .from("categories")
    .select("id, departments")
    .ilike("name", normalizedCategoryName)
    .maybeSingle();

  if (error) {
    console.error(
      `❌ Error fetching category ${normalizedCategoryName}:`,
      error.message
    );
    return null;
  }
  return data;
}

async function updateCategoryDepartments(
  categoryId: string,
  categoryName: string,
  departments: string[]
) {
  const { error } = await supabaseClient
    .from("categories")
    .update({
      name: categoryName,
      departments: departments,
    })
    .eq("id", categoryId);

  if (error) {
    console.error(
      `❌ Failed to update category ${categoryName}:`,
      error.message
    );
    return false;
  }

  console.log(
    `Updated category ${categoryName} with departments:`,
    departments
  );
  return true;
}

async function createCategory(categoryName: string, departments: string[]) {
  const normalizedDepartments = departments.map((d) => normalizeDepartment(d));

  const { data, error } = await supabaseClient
    .from("categories")
    .insert({
      name: categoryName,
      departments: normalizedDepartments,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error(
      `❌ Failed to insert category ${categoryName}:`,
      error?.message
    );
    return null;
  }

  console.log(`✅ Created new category: ${categoryName} with ID: ${data.id}`);
  return data.id;
}

async function fetchSkillsForCategory(
  categoryId: string,
  categoryName: string
) {
  const { data, error } = await supabaseClient
    .from("skills")
    .select("name")
    .eq("category_id", categoryId);

  if (error) {
    console.error(
      `❌ Failed to fetch skills for category ${categoryName}:`,
      error.message
    );
    return null;
  }

  return data;
}

async function insertSkillsForCategory(
  categoryId: string,
  skills: { name: string }[],
  categoryName: string
) {
  if (skills.length === 0) return true;

  const { error } = await supabaseClient.from("skills").insert(skills);

  if (error) {
    console.error(
      `❌ Failed to insert skills for ${categoryName}:`,
      error.message
    );
    return false;
  }

  console.log(
    `✅ Added ${skills.length} missing skills for category: ${categoryName}`
  );
  return true;
}

// Employee Management Functions
async function insertEmployee(emp: EmployeeData) {
  const { data, error } = await supabaseClient
    .from("employees")
    .insert({
      first_name: emp.firstName,
      last_name: emp.lastName,
      bio: emp.bio,
      country: emp.country,
      city: emp.city,
      program: emp.program,
      profile_image: emp.profileImage,
      slack_url: emp.slackUrl,
      linkedin_url: emp.linkedinUrl,
      career_experience: emp.careerExperience,
      start_date: emp.startDate,
      department: normalizeDepartment(emp.department),
      role: emp.role,
      float_id: emp.floatId,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error(
      `❌ Failed to insert employee ${emp.firstName} ${emp.lastName}:`,
      error?.message
    );
    return null;
  }
  console.log(`✅ Inserted employee: ${emp.firstName} ${emp.lastName}`);
  return data.id;
}

async function findEmployeeByFloatId(floatId: string) {
  const { data } = await supabaseClient
    .from("employees")
    .select("id")
    .eq("float_id", floatId)
    .maybeSingle();

  return data;
}

async function insertEmployeeCertificates(
  employeeId: string,
  certificates: EmployeeData["certificates"]
) {
  if (!certificates || certificates.length === 0) return;

  const certPayload = certificates.map((cert) => ({
    employee_id: employeeId,
    name: normalizeSkillName(cert.name),
    issuer: cert.issuer,
    date: cert.date,
    url: cert.url,
  }));

  const { error } = await supabaseClient
    .from("certificates")
    .insert(certPayload);

  if (error) {
    console.error(
      `❌ Failed to insert certificates for employee ${employeeId}:`,
      error.message
    );
    return false;
  }

  console.log(`✅ Inserted ${certificates.length} certificates`);
  return true;
}
async function fetchAllSkillsWithCategories() {
  const { data, error } = await supabaseClient
    .from("skills")
    .select("id, name, category_id, categories(id, name, departments)");

  if (error || !data) {
    console.error(
      "❌ Failed to fetch skills:",
      error?.message || "Unknown error"
    );
    return null;
  }

  return data;
}

async function clearEmployeeSkills(employeeId: string) {
  const { error } = await supabaseClient
    .from("employees_skill_levels")
    .delete()
    .eq("employee_id", employeeId);

  if (error) {
    console.error(
      `❌ Failed to clear existing skill levels for ${employeeId}:`,
      error.message
    );
    return false;
  }

  return true;
}

async function insertEmployeeSkillLevels(
  skillPayload: SkillLevelPayload[],
  employeeId: string,
  department: string
) {
  if (skillPayload.length === 0) {
    console.log(
      `ℹ️ No skills to insert for ${employeeId} in department ${department}`
    );
    return true;
  }

  // Deduplicate skill payload to avoid primary key violations
  const uniqueSkillPayload = skillPayload.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.employee_id === item.employee_id && t.skill_id === item.skill_id
      )
  );

  const { error } = await supabaseClient
    .from("employees_skill_levels")
    .insert(uniqueSkillPayload);

  if (error) {
    console.error(
      `❌ Failed to insert skill levels for ${employeeId}:`,
      error.message
    );
    return false;
  }

  console.log(
    `✅ Inserted ${uniqueSkillPayload.length} skill levels for ${employeeId} in department ${department}`
  );
  return true;
}

function loadEmployeesFromJson(filePath: string) {
  const fullPath = path.resolve(filePath);
  const rawData = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(rawData);
}

// Main Functions
export async function seedCategories(
  defaultCategories: DefaultCategory[],
  newDepartments: string[]
) {
  for (const cat of defaultCategories) {
    try {
      const normalizedCategoryName = normalizeSkillName(cat.name);
      console.log(`Processing category: ${normalizedCategoryName}`);

      const existingCategory = await fetchCategory(cat.name);
      let categoryId: string;

      if (existingCategory) {
        console.log(
          `Found existing category: ${normalizedCategoryName}`,
          existingCategory
        );

        const existingDepts = Array.isArray(existingCategory.departments)
          ? existingCategory.departments
          : [];

        const normalizedNewDepts = newDepartments.map((d) =>
          normalizeDepartment(d)
        );

        const mergedDepartments = Array.from(
          new Set([...existingDepts, ...normalizedNewDepts])
        );

        const updated = await updateCategoryDepartments(
          existingCategory.id,
          normalizedCategoryName,
          mergedDepartments
        );

        if (!updated) continue;
        categoryId = existingCategory.id;
      } else {
        console.log(`Creating new category: ${normalizedCategoryName}`);
        categoryId = await createCategory(
          normalizedCategoryName,
          newDepartments
        );
        if (!categoryId) continue;
      }

      const existingSkills = await fetchSkillsForCategory(
        categoryId,
        normalizedCategoryName
      );
      if (!existingSkills) continue;

      const existingSkillMap = new Map(
        existingSkills?.map((s) => [
          normalizeSkillName(s.name).toLowerCase(),
          s,
        ]) || []
      );

      const newSkills = cat.skills.filter(
        (s) => !existingSkillMap.has(normalizeSkillName(s.name).toLowerCase())
      );

      if (newSkills.length > 0) {
        const skillPayload = newSkills.map((s) => ({
          category_id: categoryId,
          name: normalizeSkillName(s.name),
        }));

        await insertSkillsForCategory(
          categoryId,
          skillPayload,
          normalizedCategoryName
        );
      } else {
        console.log(
          `ℹ️ All skills already exist for ${normalizedCategoryName}, skipping.`
        );
      }
    } catch (err) {
      console.error(
        `❌ Error while processing category ${cat.name}:`,
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
}

export async function insertEmployeeSkillsBulk(
  employeeId: string,
  empSkills: EmployeeData["skills"],
  department: string
) {
  const normalizedDepartment = normalizeDepartment(department);
  console.log(
    `Processing skills for ${employeeId} in department: ${normalizedDepartment}`
  );

  const skillData = await fetchAllSkillsWithCategories();
  if (!skillData) return;

  const skillMap = new Map(
    skillData.map((skill) => [
      normalizeSkillName(skill.name).toLowerCase(),
      skill,
    ])
  );

  const missingSkills = new Map<
    string,
    { categoryId: string; skillName: string; level: number }
  >();
  const skillPayload: SkillLevelPayload[] = [];

  await processEmployeeSkills(
    empSkills,
    normalizedDepartment,
    skillMap,
    missingSkills,
    skillPayload,
    employeeId
  );

  await createMissingSkills(
    missingSkills,
    skillPayload,
    employeeId,
    normalizedDepartment
  );

  const cleared = await clearEmployeeSkills(employeeId);
  if (!cleared) return;

  await insertEmployeeSkillLevels(
    skillPayload,
    employeeId,
    normalizedDepartment
  );
}

async function processEmployeeSkills(
  empSkills: EmployeeData["skills"],
  normalizedDepartment: string,
  skillMap: Map<string, any>,
  missingSkills: Map<
    string,
    { categoryId: string; skillName: string; level: number }
  >,
  skillPayload: SkillLevelPayload[],
  employeeId: string
) {
  for (const category of empSkills) {
    const normalizedCategoryName = normalizeSkillName(category.name);

    const existingCategory = await fetchCategory(category.name);
    let categoryId: string;

    if (!existingCategory) {
      const newCategoryId = await createCategory(normalizedCategoryName, [
        normalizedDepartment,
      ]);
      if (!newCategoryId) continue;
      categoryId = newCategoryId;
    } else {
      categoryId = existingCategory.id;

      const departments = existingCategory.departments || [];
      if (!departments.includes(normalizedDepartment)) {
        const updatedDepartments = [...departments, normalizedDepartment];
        await updateCategoryDepartments(
          categoryId,
          normalizedCategoryName,
          updatedDepartments
        );
      }
    }

    await processSkillsInCategory(
      category.skills,
      categoryId,
      normalizedDepartment,
      skillMap,
      missingSkills,
      skillPayload,
      employeeId
    );
  }
}

async function processSkillsInCategory(
  skills: Array<{ name: string; level: number }>,
  categoryId: string,
  normalizedDepartment: string,
  skillMap: Map<string, any>,
  missingSkills: Map<
    string,
    { categoryId: string; skillName: string; level: number }
  >,
  skillPayload: SkillLevelPayload[],
  employeeId: string
) {
  for (const skill of skills) {
    const normalizedSkillName = normalizeSkillName(skill.name);
    const existingSkill = skillMap.get(normalizedSkillName.toLowerCase());

    if (existingSkill) {
      // Check if the skill's category is appropriate for this department
      const skillCategory = existingSkill.categories;

      // Add the skill regardless of department association
      // We'll update the category's departments if needed
      if (skillCategory) {
        const departments = Array.isArray(skillCategory.departments)
          ? skillCategory.departments
          : [];
        if (!departments.includes(normalizedDepartment)) {
          // Update the category to include this department
          const updatedDepartments = [...departments, normalizedDepartment];
          await updateCategoryDepartments(
            skillCategory.id,
            skillCategory.name,
            updatedDepartments
          );
        }

        // Add the skill to the payload
        skillPayload.push({
          employee_id: employeeId,
          skill_id: existingSkill.id,
          level: skill.level,
        });
      }
    } else {
      // Track missing skill for creation
      missingSkills.set(normalizedSkillName.toLowerCase(), {
        categoryId,
        skillName: normalizedSkillName,
        level: skill.level,
      });
    }
  }
}

async function createMissingSkills(
  missingSkills: Map<
    string,
    { categoryId: string; skillName: string; level: number }
  >,
  skillPayload: SkillLevelPayload[],
  employeeId: string,
  normalizedDepartment: string
) {
  if (missingSkills.size > 0) {
    const skillsToCreate = Array.from(missingSkills.values()).map(
      ({ categoryId, skillName }) => ({
        category_id: categoryId,
        name: skillName,
      })
    );

    const { data: createdSkills, error: createSkillError } =
      await supabaseClient
        .from("skills")
        .insert(skillsToCreate)
        .select("id, name");

    if (createSkillError || !createdSkills) {
      console.error(
        "❌ Failed to create missing skills:",
        createSkillError?.message
      );
    } else {
      console.log(
        `✅ Created ${createdSkills.length} new skills for department ${normalizedDepartment}`
      );

      // Add newly created skills to the payload
      for (const newSkill of createdSkills) {
        const normalizedName = normalizeSkillName(newSkill.name).toLowerCase();
        const skillInfo = missingSkills.get(normalizedName);

        if (skillInfo) {
          skillPayload.push({
            employee_id: employeeId,
            skill_id: newSkill.id,
            level: skillInfo.level,
          });
        }
      }
    }
  }
}

export async function extractAndSeedSkillsFromJson() {
  const employees = loadEmployeesFromJson("./data/employees-original.json");
  const departmentCategoriesMap = buildDepartmentCategoriesMap(
    employees.employees
  );

  for (const [department, categoriesMap] of departmentCategoriesMap.entries()) {
    console.log(`\n🔍 Processing department: ${department}`);

    const categoriesForDepartment = Array.from(categoriesMap.entries()).map(
      ([categoryName, skillsSet]) => ({
        id: "",
        name: categoryName,
        skills: Array.from(skillsSet).map((skillName) => ({
          name: skillName,
          level: 0,
        })),
      })
    );

    console.log(
      `🔍 Found ${categoriesForDepartment.length} categories with skills for ${department}`
    );

    await seedCategories(categoriesForDepartment, [department]);
  }
  console.log("✅ Skills from JSON seeded successfully");
}

function buildDepartmentCategoriesMap(employees: EmployeeData[]) {
  const departmentCategoriesMap = new Map<string, Map<string, Set<string>>>();

  for (const emp of employees) {
    const department = normalizeDepartment(emp.department);

    if (!departmentCategoriesMap.has(department)) {
      departmentCategoriesMap.set(department, new Map<string, Set<string>>());
    }

    const categoriesMap = departmentCategoriesMap.get(department)!;

    for (const skillCategory of emp.skills) {
      const categoryName = skillCategory.name;

      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, new Set());
      }

      const skillsSet = categoriesMap.get(categoryName)!;
      for (const skill of skillCategory.skills) {
        skillsSet.add(skill.name);
      }
    }
  }

  return departmentCategoriesMap;
}

export async function seedEmployeesFromJson() {
  const employees = loadEmployeesFromJson("./data/employees-original.json");

  for (const emp of employees.employees) {
    console.log(`\n🚀 Seeding employee: ${emp.firstName} ${emp.lastName}`);

    await seedEmployeeWithSkills(emp);
    console.log(`✅ Finished seeding ${emp.firstName} ${emp.lastName}`);
  }

  console.log("\n🎉 All employees seeded successfully!");
}

export async function seedEmployeeWithSkills(emp: EmployeeData) {
  const existingEmp = await findEmployeeByFloatId(emp.floatId);
  let employeeId: string;

  if (!existingEmp) {
    const newEmployeeId = await insertEmployee(emp);
    if (!newEmployeeId) return;
    employeeId = newEmployeeId;
  } else {
    employeeId = existingEmp.id;
    console.log(
      `ℹ️ Employee ${emp.firstName} already exists, updating skills only`
    );
  }

  if (emp.certificates && emp.certificates.length > 0) {
    await insertEmployeeCertificates(employeeId, emp.certificates);
  }

  await insertEmployeeSkillsBulk(employeeId, emp.skills, emp.department);
}
