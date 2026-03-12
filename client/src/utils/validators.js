export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => {
  if (!password || password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
};

export const PASSWORD_RULES = 'Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (!@#$%...)';

export const validateRequired = (value) => value && value.toString().trim().length > 0;
