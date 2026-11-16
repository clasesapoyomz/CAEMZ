
document.getElementById("login").addEventListener("submit", e => {
    e.preventDefault();

    if (
        document.getElementById("usuario").value === "Profe" &&
        document.getElementById("clave").value === "Iriarte"
    ) {
        sessionStorage.setItem("ecmz_admin_demo", "si");
        location.href = "admin.html";
    } else {
        document.getElementById("mensaje").textContent =
            "Usuario o contraseña incorrectos.";
    }
});

document.getElementById("ver-clave").addEventListener("click", () => {
    const clave = document.getElementById("clave");
    const boton = document.getElementById("ver-clave");
    const abierto = document.getElementById("ojo-abierto");
    const cerrado = document.getElementById("ojo-cerrado");

    const mostrar = clave.type === "password";

    clave.type = mostrar ? "text" : "password";

    abierto.style.display = mostrar ? "none" : "block";
    cerrado.style.display = mostrar ? "block" : "none";

    boton.setAttribute(
        "aria-label",
        mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
    );
});
