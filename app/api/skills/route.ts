import { NextResponse } from "next/server"
import { EMPLOYEES_DATA, COMPETENCY_LEVELS } from "@/lib/data" // Import your hardcoded data

// In a real application, you would fetch this from your published Google Sheet CSV.
// Example:
// async function fetchSkillsDataFromGoogleSheet() {
//   const csvUrl = "YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE";
//   const response = await fetch(csvUrl);
//   const csvText = await response.text();
//   // Parse CSV text into your Employee data structure
//   // This would involve more complex parsing logic based on your CSV format
//   // For now, we'll return the dummy data.
//   return EMPLOYEES_DATA;
// }

export async function GET() {
  try {
    // For now, return the hardcoded data.
    // In production, replace this with actual fetching and parsing from your published Google Sheet CSV.
    const data = EMPLOYEES_DATA

    return NextResponse.json({ employees: data, competencyLevels: COMPETENCY_LEVELS })
  } catch (error) {
    console.error("Error fetching skills data:", error)
    return NextResponse.json({ error: "Failed to fetch skills data" }, { status: 500 })
  }
}
