import { Certificate, Employee } from "./types";
import { db, ensureDbLoaded, getEmployeeIndexById } from "./db";

export async function updateEmployeeCertificatesInDb(
  employeeId: string,
  certificates: Certificate[]
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const idx = getEmployeeIndexById(employeeId);
  if (idx === -1) return undefined;

  const employee = db.data.employees[idx];
  employee.certificates = certificates;
  await db.write();

  return employee;
}

export async function deleteEmployeeCertificateInDb(
  employeeId: string,
  certificateId: string
): Promise<Employee | undefined> {
  await ensureDbLoaded();

  if (!db.data || !Array.isArray(db.data.employees)) {
    throw new Error("Database not loaded or employees data is missing.");
  }

  const idx = getEmployeeIndexById(employeeId);
  if (idx === -1) return undefined;

  const employee = db.data.employees[idx];
  if (
    !employee ||
    !Array.isArray(employee.certificates) ||
    employee.certificates.length === 0
  ) {
    return employee;
  }

  const certIndex = employee.certificates.findIndex(
    (cert) => cert.id === certificateId
  );
  if (certIndex === -1) return employee;

  employee.certificates.splice(certIndex, 1);
  await db.write();

  return employee;
}

export async function addEmployeeCertificateInDb(
  employeeId: string,
  certificate: Omit<Certificate, "id">
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const idx = getEmployeeIndexById(employeeId);
  if (idx === -1) return undefined;

  const employee = db.data.employees[idx];
  if (!Array.isArray(employee.certificates)) {
    employee.certificates = [];
  }

  const newCertificate = { ...certificate, id: crypto.randomUUID() };
  employee.certificates.push(newCertificate);
  await db.write();

  return employee;
}
