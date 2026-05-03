export const validatePassword = (password) => {
  if (!password || password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una letra mayúscula';
  if (!/[a-z]/.test(password)) return 'La contraseña debe contener al menos una letra minúscula';
  if (!/[0-9]/.test(password)) return 'La contraseña debe contener al menos un número';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'La contraseña debe contener al menos un carácter especial (!@#$%...)';
  return null;
};
