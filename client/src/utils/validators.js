export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => password && password.length >= 6;

export const validateRequired = (value) => value && value.toString().trim().length > 0;
