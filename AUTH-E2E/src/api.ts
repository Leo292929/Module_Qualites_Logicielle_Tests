export type User = { username: string; email: string; password: string };

function loadUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem('users', JSON.stringify(users));
}

export async function signup(user: User): Promise<void> {
  await new Promise(r => setTimeout(r, 150)); // petite latence simulée

  const users = loadUsers();
  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error("Un compte existe déjà avec cet e-mail.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new Error("E-mail invalide.");
  }
  if (user.password.length < 6) {
    throw new Error("Mot de passe trop court (min. 6 caractères).");
  }
  if (!user.username.trim()) {
    throw new Error("Le nom d’utilisateur est requis.");
  }
  users.push(user);
  saveUsers(users);
}
