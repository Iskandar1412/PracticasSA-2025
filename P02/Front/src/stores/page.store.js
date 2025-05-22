import { writable } from "svelte/store";
import { navigate } from "svelte-routing";

const storedPage = localStorage.getItem('lastVisitedPage') || "/";
export const currentPage = writable(storedPage);

export function setCurrentPage(newPage) {
    localStorage.setItem('lastVisitedPage', newPage);
    currentPage.set(newPage);
}

export function handleAuthAndNavigation() {
    const lastPage = localStorage.getItem("lastVisitedPage") || "/";
    const isUserAuthenticated = JSON.parse(localStorage.getItem("user")) !== null;

    if (isUserAuthenticated && lastPage === "/") {
        navigate("/home");
        setCurrentPage("/home");
    } else {
        navigate(lastPage);
        setCurrentPage(lastPage);
    }
}
