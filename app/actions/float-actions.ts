"use server";

export async function fetchFloatUserInfo(email: string) {
  if (!email) return { found: false };
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || ""
      }/api/float-user?email=${encodeURIComponent(email)}`,
      { next: { revalidate: 60 } }
    );

    console.log(res);
    if (!res.ok) return { found: false };
    const data = await res.json();
    if (!data.found) return { found: false };
    return {
      found: true,
      isFree: !!data.isFree,
      projects: Array.isArray(data.projects) ? data.projects : [],
    };
  } catch (e) {
    return { found: false };
  }
}
