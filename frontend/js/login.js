import { post } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
const loginForm = document.getElementById("loginForm");
if (!loginForm) return;


loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
        alert("Por favor, ingrese usuario y contraseña.");
        return;
    }

    const res = await post("/admin/login", { usuario, password });

    if (res.success && res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "dashboard.html";
    } else {
        alert(res.error || "Error al iniciar sesión");
    }
});


});
