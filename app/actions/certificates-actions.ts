"use server";

import { addCertificate, getEmployeeById, updateEmployee } from "@/lib/db";
import { revalidatePath } from "next/cache";

type Certificate = {
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
};

export async function addEmployeeCertificate(
  employeeId: string,
  certificate: Certificate
) {
  const existingEmployee = await getEmployeeById(employeeId);
  if (!existingEmployee) {
    return { success: false, message: "Employee not found." };
  }
  try {
    const updatedEmployee = {
      ...existingEmployee,
      certificates: [
        ...(existingEmployee.certificates || []),
        {
          name: certificate.name,
          url: certificate.url,
        },
      ],
    };
    await addCertificate(employeeId, {
      name: certificate.name,
      issuer: certificate.issuer || "",
      date: certificate.date || "",
      url: certificate.url || "",
    });
    revalidatePath(`/employees/${employeeId}`);
    return { success: true, message: "Certificate added successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to add certificate." };
  }
}

export async function updateEmployeeCertificates(
  employeeId: string,
  certificates: Certificate[]
) {
  const existingEmployee = await getEmployeeById(employeeId);

  if (!existingEmployee) {
    return { success: false, message: "Employee not found." };
  }

  try {
    await updateEmployeeCertificates(employeeId, certificates);
    revalidatePath(`/employees/${employeeId}`);
    return { success: true, message: "Certificates updated successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to update certificates." };
  }
}

export async function deleteEmployeeCertificate(
  employeeId: string,
  certificateName: string
) {
  console.log(employeeId);
  const existingEmployee = await getEmployeeById(employeeId);

  if (!existingEmployee) {
    return { success: false, message: "Employee not found." };
  }

  try {
    const updatedCertificates = existingEmployee?.certificates.filter(
      (cert) => cert.name !== certificateName
    );
    const updatedEmployee = {
      ...existingEmployee,
      certificates: updatedCertificates,
    };
    await updateEmployee(updatedEmployee);
    revalidatePath(`/employees/${employeeId}/edit`);
    revalidatePath(`/employees/${employeeId}`);
    revalidatePath("/employees");
    return { success: true, message: "Certificate deleted successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to delete certificate." };
  }
}
