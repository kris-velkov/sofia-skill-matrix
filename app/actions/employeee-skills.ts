type Skill = {
  id: string;
  name: string;
  level: number;
};

let skills: Skill[] = [];

export function addSkill(newSkill: Omit<Skill, "id">): Skill {
  const skill: Skill = { ...newSkill, id: crypto.randomUUID() };
  skills.push(skill);
  return skill;
}

export function editSkill(
  id: string,
  updatedFields: Partial<Omit<Skill, "id">>
): Skill | null {
  const index = skills.findIndex((skill) => skill.id === id);
  if (index === -1) return null;
  skills[index] = { ...skills[index], ...updatedFields };
  return skills[index];
}
export function deleteSkill(id: string): boolean {
  const index = skills.findIndex((skill) => skill.id === id);
  if (index === -1) return false;
  skills.splice(index, 1);
  return true;
}

export function getSkills(): Skill[] {
  return [...skills];
}
