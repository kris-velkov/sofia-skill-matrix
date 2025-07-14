"use server";

export async function fetchFloatUserInfo(floatId: string) {
  if (!floatId) return { found: false };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const url = `${baseUrl}/api/float-user?floatId=${encodeURIComponent(
    floatId
  )}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error(`Float API request failed: ${res.status}`);
      return { isBooked: null };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Float API error:", error);
    return { found: false };
  }
}
