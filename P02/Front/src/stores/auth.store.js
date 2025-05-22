import { writable } from "svelte/store";

const storedUser = JSON.parse(localStorage.getItem('user')) || null;
export const user = writable(storedUser);
export const isAuthenticated = writable(storedUser !== null);

// Función para iniciar sesión
export function loginUser(usuario) {
    if (!usuario) return;
    const userInfo = usuario;
    localStorage.setItem('user', JSON.stringify(userInfo));
    isAuthenticated.set(true);
}

// Función para cerrar sesión
export function logoutUser() {
    localStorage.removeItem('user');
    user.set(null);
    isAuthenticated.set(false);
}
