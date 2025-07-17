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

export async function seedCategories(
  defaultCategories: DefaultCategory[],
  newDepartments: string[]
) {
  for (const cat of defaultCategories) {
    try {
      const normalizedCategoryName = normalizeSkillName(cat.name);
      console.log(`Processing category: ${normalizedCategoryName}`);
      const { data: existingCategory, error: fetchError } = await supabaseClient
        .from("categories")
        .select("id, departments")
        .ilike("name", normalizedCategoryName)
        .maybeSingle();

      if (fetchError) {
        console.error(
          `❌ Error fetching category ${normalizedCategoryName}:`,
          fetchError.message
        );
        continue;
      }
      let categoryId: string;

      if (existingCategory) {
        console.log(
          `Found existing category: ${normalizedCategoryName}`,
          existingCategory
        );
        // Ensure we're working with arrays and normalize each department
        const existingDepts = Array.isArray(existingCategory.departments)
          ? existingCategory.departments
          : [];

        const normalizedNewDepts = newDepartments.map((d) =>
          normalizeDepartment(d)
        );

        // Remove duplicates with Set
        const mergedDepartments = Array.from(
          new Set([...existingDepts, ...normalizedNewDepts])
        );

        const { error: updateError } = await supabaseClient
          .from("categories")
          .update({
            name: normalizedCategoryName,
            departments: mergedDepartments,
          })
          .eq("id", existingCategory.id);

        if (updateError) {
          console.error(
            `❌ Failed to update category ${normalizedCategoryName}:`,
            updateError.message
          );
          continue;
        }

        categoryId = existingCategory.id;
        console.log(
          `✅ Updated category ${normalizedCategoryName} with departments:`,
          mergedDepartments
        );
      } else {
        console.log(`Creating new category: ${normalizedCategoryName}`);
        const { data: newCat, error: catError } = await supabaseClient
          .from("categories")
          .insert({
            name: normalizedCategoryName,
            departments: newDepartments.map((d) => normalizeDepartment(d)),
          })
          .select("id")
          .single();

        if (catError || !newCat) {
          console.error(
            `❌ Failed to insert category ${normalizedCategoryName}:`,
            catError?.message
          );
          continue;
        }
        categoryId = newCat.id;
        console.log(
          `✅ Created new category: ${normalizedCategoryName} with ID: ${categoryId}`
        );
      }

      const { data: existingSkills, error: skillsError } = await supabaseClient
        .from("skills")
        .select("name")
        .eq("category_id", categoryId);

      if (skillsError) {
        console.error(
          `❌ Failed to fetch skills for category ${normalizedCategoryName}:`,
          skillsError.message
        );
        continue;
      }

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

        const { error: skillsInsertError } = await supabaseClient
          .from("skills")
          .insert(skillPayload);

        if (skillsInsertError) {
          console.error(
            `❌ Failed to insert skills for ${normalizedCategoryName}:`,
            skillsInsertError.message
          );
        } else {
          console.log(
            `✅ Added ${newSkills.length} missing skills for category: ${normalizedCategoryName}`
          );
        }
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

export async function insertEmployee(emp: EmployeeData) {
  const { data: insertedEmp, error: empError } = await supabaseClient
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

  if (empError || !insertedEmp) {
    console.error(
      `❌ Failed to insert employee ${emp.firstName} ${emp.lastName}:`,
      empError?.message
    );
    return null;
  }

  console.log(`✅ Inserted employee: ${emp.firstName} ${emp.lastName}`);
  return insertedEmp.id;
}

export async function insertEmployeeCertificates(
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

  const { error: certError } = await supabaseClient
    .from("certificates")
    .insert(certPayload);

  if (certError) {
    console.error(
      `❌ Failed to insert certificates for employee ${employeeId}:`,
      certError.message
    );
  } else {
    console.log(`✅ Inserted ${certificates.length} certificates`);
  }
}

function loadEmployeesFromJson(filePath: string) {
  const fullPath = path.resolve(filePath);
  const rawData = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(rawData);
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

  // Fetch all skills with their categories to have complete data
  const { data: skillData, error: skillFetchError } = await supabaseClient
    .from("skills")
    .select("id, name, category_id, categories(id, name, departments)");

  if (skillFetchError || !skillData) {
    console.error(
      "❌ Failed to fetch skills:",
      skillFetchError?.message || "Unknown error"
    );
    return;
  }

  // Create a map for quick skill lookup by normalized name
  const skillMap = new Map(
    skillData.map((skill) => [
      normalizeSkillName(skill.name).toLowerCase(),
      skill,
    ])
  );

  // Track skills that need to be created
  const missingSkills = new Map<
    string,
    { categoryId: string; skillName: string; level: number }
  >();
  const skillPayload: SkillLevelPayload[] = [];

  // First, process all categories and skills to identify missing ones
  for (const category of empSkills) {
    const normalizedCategoryName = normalizeSkillName(category.name);

    // Find if the category exists
    const { data: existingCategory } = await supabaseClient
      .from("categories")
      .select("id, departments")
      .ilike("name", normalizedCategoryName)
      .maybeSingle();

    let categoryId: string;

    // Create category if it doesn't exist
    if (!existingCategory) {
      const { data: newCategory, error: categoryError } = await supabaseClient
        .from("categories")
        .insert({
          name: normalizedCategoryName,
          departments: [normalizedDepartment],
        })
        .select("id")
        .single();

      if (categoryError || !newCategory) {
        console.error(
          `❌ Failed to create category ${normalizedCategoryName}:`,
          categoryError?.message
        );
        continue;
      }
      categoryId = newCategory.id;
      console.log(
        `✅ Created new category: ${normalizedCategoryName} for department ${normalizedDepartment}`
      );
    } else {
      categoryId = existingCategory.id;

      // Check if this category is relevant for the employee's department
      const departments = existingCategory.departments || [];
      if (!departments.includes(normalizedDepartment)) {
        // Add this department to the category
        const updatedDepartments = [...departments, normalizedDepartment];
        await supabaseClient
          .from("categories")
          .update({ departments: updatedDepartments })
          .eq("id", categoryId);

        console.log(
          `✅ Updated category ${normalizedCategoryName} with department ${normalizedDepartment}`
        );
      }
    }

    // Process skills in this category
    for (const skill of category.skills) {
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
            await supabaseClient
              .from("categories")
              .update({ departments: updatedDepartments })
              .eq("id", skillCategory.id);
            console.log(
              `✅ Updated skill category for ${normalizedSkillName} to include department ${normalizedDepartment}`
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

  // Create any missing skills
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

  // First delete any existing skill levels for this employee to avoid duplicates
  const { error: deleteError } = await supabaseClient
    .from("employees_skill_levels")
    .delete()
    .eq("employee_id", employeeId);

  if (deleteError) {
    console.error(
      `❌ Failed to clear existing skill levels for ${employeeId}:`,
      deleteError.message
    );
    return; // Exit early if we can't clear existing skills
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

  // Insert all skill levels
  if (uniqueSkillPayload.length > 0) {
    const { error: insertError } = await supabaseClient
      .from("employees_skill_levels")
      .insert(uniqueSkillPayload);

    if (insertError) {
      console.error(
        `❌ Failed to insert skill levels for ${employeeId}:`,
        insertError.message
      );
    } else {
      console.log(
        `✅ Inserted ${skillPayload.length} skill levels for ${employeeId} in department ${normalizedDepartment}`
      );
    }
  } else {
    console.log(
      `ℹ️ No skills to insert for ${employeeId} in department ${normalizedDepartment}`
    );
  }
}

export async function extractAndSeedSkillsFromJson() {
  const employees = loadEmployeesFromJson("./data/employees-original.json");

  const departmentCategoriesMap = new Map<string, Map<string, Set<string>>>();

  for (const emp of employees.employees) {
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

  // Process each department separately
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

    // Seed categories and skills for this department only
    await seedCategories(categoriesForDepartment, [department]);
  }
  console.log("✅ Skills from JSON seeded successfully");
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
  const { data: existingEmp } = await supabaseClient
    .from("employees")
    .select("id")
    .eq("float_id", emp.floatId)
    .maybeSingle();

  let employeeId: string;

  if (!existingEmp) {
    const { data: insertedEmp, error: empError } = await supabaseClient
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

    if (empError || !insertedEmp) {
      console.error(
        `❌ Failed to insert employee ${emp.firstName} ${emp.lastName}:`,
        empError?.message
      );
      return;
    }
    employeeId = insertedEmp.id;
    console.log(`✅ Inserted employee: ${emp.firstName} ${emp.lastName}`);
  } else {
    employeeId = existingEmp.id;
    console.log(
      `ℹ️ Employee ${emp.firstName} already exists, updating skills only`
    );
  }

  if (emp.certificates && emp.certificates.length > 0) {
    const certPayload = emp.certificates.map((cert) => ({
      employee_id: employeeId,
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      url: cert.url,
    }));

    const { error: certError } = await supabaseClient
      .from("certificates")
      .insert(certPayload);
    if (certError) console.error(`❌ Failed certs: ${certError.message}`);
    else console.log(`✅ Inserted ${emp.certificates.length} certificates`);
  }

  await insertEmployeeSkillsBulk(employeeId, emp.skills, emp.department);
}
