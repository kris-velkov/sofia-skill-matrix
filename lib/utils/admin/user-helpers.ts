export interface AppUser extends Record<string, unknown> {
  id: string;
  email: string;
  role: string;
  program: string;
  createdAt: string;
  lastSignIn: string | null;
}

export const getUserInitials = (user: AppUser): string => {
  return user.email[0].toUpperCase();
};

export const getActivityStatus = (lastSignIn: string | null) => {
  if (!lastSignIn) return { label: "Never" };

  const lastSignInDate = new Date(lastSignIn);
  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - lastSignInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 0) return { label: "Today" };
  if (daysDiff === 1) return { label: "Yesterday" };
  if (daysDiff <= 7) return { label: `${daysDiff} days ago` };
  if (daysDiff <= 30) return { label: `${daysDiff} days ago` };
  return { label: `${daysDiff} days ago` };
};

export const formatUserForDisplay = (user: AppUser) => ({
  ...user,
  initials: getUserInitials(user),
  activityStatus: getActivityStatus(user.lastSignIn),
  programDisplay: user.program === "all" ? "All Programs" : user.program,
});

export const searchUsers = (
  users: AppUser[],
  searchTerm: string
): AppUser[] => {
  if (!searchTerm) return users;

  const term = searchTerm.toLowerCase();
  return users.filter(
    (user) =>
      user.email.toLowerCase().includes(term) ||
      user.program.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
  );
};
