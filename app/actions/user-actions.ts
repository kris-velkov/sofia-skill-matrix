import { deleteEmployee } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteEmployeeAction(userId: string) {
  try {
    await deleteEmployee(userId);
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return { success: false, message: "Failed to delete employee." };
  }

  revalidatePath("/employees");
  return { success: true, message: "Employee deleted successfully!" };
}
