import { supabaseClient } from "./supabase/supabaseClient";
import { normalizeDepartment } from "./utils";
import fs from "fs";
import path from "path";

type DefaultCategory = {
  id: string;
  name: string;
  skills: { name: string; level: number }[];
};

export async function seedCategories(
  defaultCategories: DefaultCategory[],
  newDepartments: string[]
) {
  for (const cat of defaultCategories) {
    try {
      const { data: existingCategory } = await supabaseClient
        .from("categories")
        .select("id, departments")
        .eq("name", cat.name)
        .single();

      let categoryId: string;

      if (existingCategory) {
        // ✅ Merge departments with normalization
        const mergedDepartments = Array.from(
          new Set([
            ...(existingCategory.departments || []),
            ...newDepartments.map((d) => normalizeDepartment(d)),
          ])
        );

        await supabaseClient
          .from("categories")
          .update({ departments: mergedDepartments })
          .eq("id", existingCategory.id);

        categoryId = existingCategory.id;
      } else {
        // ✅ Insert new category
        const { data: newCat, error: catError } = await supabaseClient
          .from("categories")
          .insert({
            name: cat.name,
            departments: newDepartments.map((d) => normalizeDepartment(d)),
          })
          .select("id")
          .single();

        if (catError || !newCat) {
          console.error(
            `❌ Failed to insert category ${cat.name}:`,
            catError?.message
          );
          continue;
        }
        categoryId = newCat.id;
      }

      // ✅ Fetch existing skills with their order_index
      const { data: existingSkills } = await supabaseClient
        .from("skills")
        .select("name, order_index")
        .eq("category_id", categoryId);

      const existingSkillNames = new Set(
        existingSkills?.map((s) => s.name) || []
      );
      const maxOrderIndex =
        existingSkills?.length > 0
          ? Math.max(...existingSkills.map((s) => s.order_index ?? 0))
          : -1;

      // ✅ Find only missing skills
      const newSkills = cat.skills.filter(
        (s) => !existingSkillNames.has(s.name)
      );

      if (newSkills.length > 0) {
        // ✅ Start order_index after the last one
        let startIndex = maxOrderIndex + 1;

        const skillPayload = newSkills.map((s) => ({
          category_id: categoryId,
          name: s.name,
          order_index: startIndex++, // increment for each new skill
        }));

        const { error: skillsError } = await supabaseClient
          .from("skills")
          .insert(skillPayload);

        if (skillsError) {
          console.error(
            `❌ Failed to insert skills for ${cat.name}:`,
            skillsError.message
          );
        } else {
          console.log(
            `✅ Added ${newSkills.length} missing skills for category: ${cat.name}`
          );
        }
      } else {
        console.log(`ℹ️ All skills already exist for ${cat.name}, skipping.`);
      }
    } catch (err: any) {
      console.error(
        `❌ Error while processing category ${cat.name}:`,
        err.message
      );
    }
  }
}

export async function insertEmployee(emp: any) {
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
      department: emp.department,
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

export async function insertEmployeeSkills(
  employeeId: string,
  empSkills: any[]
) {
  for (const category of empSkills) {
    for (const skill of category.skills) {
      // 1️⃣ Find the skill in DB
      const { data: skillData } = await supabaseClient
        .from("skills")
        .select("id")
        .ilike("name", skill.name)
        .single();

      console.log(skillData);
      if (!skillData) {
        console.warn(`⚠️ Skill '${skill.name}' not found in DB, skipping.`);
        continue;
      }

      const skillId = skillData.id;

      // 2️⃣ Insert employee_skill_levels
      const { error: skillLevelError } = await supabaseClient
        .from("employee_skill_levels")
        .upsert({
          employee_id: employeeId,
          skill_id: skillId,
          level: skill.level,
        });

      if (skillLevelError) {
        console.error(
          `❌ Failed to assign skill '${skill.name}' for ${employeeId}:`,
          skillLevelError.message
        );
      } else {
        console.log(`✅ Assigned skill '${skill.name}' (level ${skill.level})`);
      }
    }
  }
}

export async function insertEmployeeCertificates(
  employeeId: string,
  certificates: any[]
) {
  if (!certificates || certificates.length === 0) return;

  const certPayload = certificates.map((cert) => ({
    employee_id: employeeId,
    name: cert.name,
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
  empSkills: any[]
) {
  let skillPayload: any[] = [];

  for (const category of empSkills) {
    for (const skill of category.skills) {
      const normalizedName = skill.name.trim();

      const { data: skillData } = await supabaseClient
        .from("skills")
        .select("id")
        .ilike("name", normalizedName)
        .single();

      if (!skillData) {
        console.warn(`⚠️ Skill '${skill.name}' not found in DB, skipping.`);
        continue;
      }

      skillPayload.push({
        employee_id: employeeId,
        skill_id: skillData.id,
        level: skill.level,
      });
    }
  }

  if (skillPayload.length > 0) {
    const { error } = await supabaseClient
      .from("employee_skill_levels")
      .upsert(skillPayload);

    if (error) {
      console.error(
        `❌ Failed to insert skill levels for ${employeeId}:`,
        error.message
      );
    } else {
      console.log(
        `✅ Inserted/Updated ${skillPayload.length} skill levels for ${employeeId}`
      );
    }
  }
}

export async function seedEmployeesFromJson() {
  const employees = loadEmployeesFromJson("./data/employees.json");

  for (const emp of employees.employees) {
    console.log(`\n🚀 Seeding employee: ${emp.firstName} ${emp.lastName}`);

    await seedEmployeeWithSkills(emp);
    console.log(`✅ Finished seeding ${emp.firstName} ${emp.lastName}`);
  }

  console.log("\n🎉 All employees seeded successfully!");
}

export async function seedEmployeeWithSkills(emp: any) {
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
        department: emp.department,
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

  // 2️⃣ Bulk insert/update skill levels
  await insertEmployeeSkillsBulk(employeeId, emp.skills);

  // 3️⃣ Certificates
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
}
