document.getElementById("login").addEventListener("submit",e=>{e.preventDefault();if(document.getElementById("usuario").value==="Profe"&&document.getElementById("clave").value==="Iriarte"){sessionStorage.setItem("ecmz_admin_demo","si");location.href="admin.html"}else document.getElementById("mensaje").textContent="Usuario o contraseña incorrectos."});
document.getElementById("ver-clave").addEventListener("click", () => {
    const clave = document.getElementById("clave");
    const boton = document.getElementById("ver-clave");

    if (clave.type === "password") {
        clave.type = "text";
        boton.textContent = "🙈";
        boton.setAttribute("aria-label", "Ocultar contraseña");
    } else {
        clave.type = "password";
        boton.textContent = "👁️";
        boton.setAttribute("aria-label", "Mostrar contraseña");
    }
});
