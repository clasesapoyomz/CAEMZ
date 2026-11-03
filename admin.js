const KEY="caemz_novedades";
if(sessionStorage.getItem("ecmz_admin_demo")!=="si")location.replace("login.html");
function datos(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return []}}
function fechaBonita(f){if(!f)return "";let p=f.split("-");return p.length===3?p[2]+"/"+p[1]+"/"+p[0]:f}
function slugify(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"novedad"}
function tarjeta(n){let a=document.createElement("article");a.className="novedad";let t=document.createElement("div");t.className="texto";let h=document.createElement("h3");h.textContent=n.titulo;let p=document.createElement("p");p.textContent=n.descripcion;let f=document.createElement("div");f.className="fecha";f.textContent=fechaBonita(n.fecha);t.append(h,p,f);a.append(t);let b=document.createElement("button");b.textContent="Eliminar del listado local";b.onclick=()=>{if(confirm("¿Eliminar esta novedad del listado local?")){localStorage.setItem(KEY,JSON.stringify(datos().filter(x=>x.id!==n.id)));dibujarAdmin()}};a.append(b);return a}
function dibujarAdmin(){let c=document.getElementById("lista");c.replaceChildren();let ns=datos();if(!ns.length){c.textContent="Todavía no creaste novedades en este navegador.";return}ns.sort((a,b)=>b.fecha.localeCompare(a.fecha)).forEach(n=>c.append(tarjeta(n)))}
function makeHtml(title,desc,date,imageData=""){const esc=s=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | CAEMZ</title><link rel="stylesheet" href="../estilos.css"></head>
<body><header class="encabezado"><a href="../index.html"><img src="../img/logo-uncuyo-ecmz.png" alt="CAEMZ"></a><nav><a href="../index.html">Inicio</a><a href="../materias.html">Materias</a><a href="../profesores.html">Profesores</a></nav></header>
<main class="contenido"><article class="detalle"><p class="fecha">${esc(fechaBonita(date))}</p><h1>${esc(title)}</h1>${imageData?`<img class="imagen-novedad-detalle" src="${imageData}" alt="">`:""}<p>${esc(desc).replace(/\\n/g,"<br>")}</p><a class="boton-novedad" href="../index.html">← Volver a novedades</a></article></main>
<footer class="pie"><span>© Escuela de Comercio Martín Zapata · CAEMZ</span><nav class="pie-enlaces"><a href="../login.html">🔐 Login</a></nav></footer></body></html>`}
document.getElementById("form-novedad").addEventListener("submit",async e=>{
 e.preventDefault();let estado=document.getElementById("estado"),titulo=document.getElementById("titulo").value.trim(),fecha=document.getElementById("fecha").value,descripcion=document.getElementById("descripcion").value.trim(),file=document.getElementById("imagen").files[0];
 if(file){estado.textContent="Las páginas HTML no pueden incluir la imagen automáticamente en este flujo. Por ahora creá la novedad sin imagen.";return}
 let slug=slugify(titulo),filename=slug+".html",id=String(Date.now()),n={id,titulo,fecha,descripcion,url:"novedades/"+filename,archivo:filename};
 try{let ns=datos();ns.push(n);localStorage.setItem(KEY,JSON.stringify(ns));let blob=new Blob([makeHtml(titulo,descripcion,fecha,imageData)],{type:"text/html;charset=utf-8"});let url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);e.target.reset();document.getElementById("fecha").value=new Date().toISOString().slice(0,10);dibujarAdmin();estado.textContent="Archivo HTML descargado. Subilo a la carpeta novedades/ del sitio y agregá su enlace en novedades.js para publicarlo."; }catch(err){estado.textContent="No se pudo crear el archivo. Intentá nuevamente."}
});
document.getElementById("fecha").value=new Date().toISOString().slice(0,10);
document.getElementById("salir").onclick=()=>{sessionStorage.removeItem("ecmz_admin_demo");location.href="index.html"};
dibujarAdmin();
