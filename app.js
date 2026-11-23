const demoProfiles = [
  {id:1,name:"Valentina",age:24,city:"Manizales",bio:"Me encantan los planes tranquilos, el café y conocer lugares nuevos.",interests:["Viajes","Lectura"],emoji:"🌷",bg:"#f9dbe5"},
  {id:2,name:"Santiago",age:27,city:"Pereira",bio:"La música siempre está presente en mis días. También disfruto la naturaleza.",interests:["Música","Naturaleza"],emoji:"🎧",bg:"#dcefff"},
  {id:3,name:"Camila",age:25,city:"Armenia",bio:"Creatividad, arte y conversaciones que dejan algo bonito.",interests:["Arte","Lectura"],emoji:"🎨",bg:"#f9e9d9"},
  {id:4,name:"Mateo",age:29,city:"Manizales",bio:"Disfruto salir a caminar, hacer deporte y descubrir nuevos paisajes.",interests:["Deporte","Naturaleza"],emoji:"🌿",bg:"#e0f1e6"},
  {id:5,name:"Isabella",age:23,city:"Medellín",bio:"Fan de los libros, los atardeceres y aprender cosas diferentes.",interests:["Lectura","Viajes"],emoji:"📚",bg:"#eee4fa"},
  {id:6,name:"Nicolás",age:28,city:"Cali",bio:"Conciertos, buena comida y charlas sin afán. Siempre con buena energía.",interests:["Música","Arte"],emoji:"🎸",bg:"#ffeadb"}
];
const grid = document.getElementById("profileGrid");
const searchInput = document.getElementById("searchInput");
const interestFilter = document.getElementById("interestFilter");
const emptyState = document.getElementById("emptyState");

function renderProfiles(){
  const term = searchInput.value.trim().toLocaleLowerCase("es");
  const interest = interestFilter.value;
  const filtered = demoProfiles.filter(p =>
    (p.name.toLocaleLowerCase("es").includes(term) || p.interests.join(" ").toLocaleLowerCase("es").includes(term) || p.city.toLocaleLowerCase("es").includes(term)) &&
    (!interest || p.interests.includes(interest))
  );
  grid.innerHTML = filtered.map(p => `
    <article class="profile-card">
      <div class="profile-art" style="background:${p.bg}"><span aria-hidden="true">${p.emoji}</span></div>
      <div class="profile-info"><h3>${p.name}, ${p.age}</h3><span class="age">♡ ${p.city} · Perfil ficticio</span>
      <p>${p.bio}</p><div class="tags">${p.interests.map(i=>`<span class="tag">${i}</span>`).join("")}</div>
      <div class="profile-actions"><button data-profile="${p.id}">Ver perfil</button><button data-request="${p.id}">Saludar ♡</button></div></div>
    </article>`).join("");
  emptyState.hidden = filtered.length !== 0;
}
renderProfiles();
searchInput.addEventListener("input",renderProfiles);
interestFilter.addEventListener("change",renderProfiles);

const joinDialog = document.getElementById("joinDialog");
const profileDialog = document.getElementById("profileDialog");
function openJoin(){document.getElementById("joinFeedback").textContent="";document.getElementById("ageConfirm").checked=false;joinDialog.showModal();}
document.getElementById("openJoin").addEventListener("click",openJoin);
document.getElementById("heroJoin").addEventListener("click",openJoin);
document.getElementById("closeJoin").addEventListener("click",()=>joinDialog.close());
document.getElementById("confirmJoin").addEventListener("click",()=>{
  const feedback=document.getElementById("joinFeedback");
  if(!document.getElementById("ageConfirm").checked){feedback.textContent="Marca la casilla para continuar con la demostración.";feedback.style.color="#bd3156";return;}
  feedback.style.color="#27845e";
  feedback.textContent="¡Gracias! Esta demostración no crea cuentas ni almacena tu edad.";
  localStorage.setItem("feeling_demo_age_confirmed","true");
});
document.getElementById("closeProfile").addEventListener("click",()=>profileDialog.close());

grid.addEventListener("click",e=>{
  const view=e.target.closest("[data-profile]");
  const request=e.target.closest("[data-request]");
  if(view){
    const p=demoProfiles.find(x=>x.id===Number(view.dataset.profile));
    document.getElementById("profileDetail").innerHTML=`<div class="profile-art" style="background:${p.bg}"><span>${p.emoji}</span></div><span class="eyebrow">PERFIL DE DEMOSTRACIÓN</span><h2>${p.name}, ${p.age}</h2><span class="age">${p.city}</span><p>${p.bio}</p><div class="tags">${p.interests.map(i=>`<span class="tag">${i}</span>`).join("")}</div><p>Este perfil es inventado y solo sirve para mostrar el diseño de la plataforma.</p><button class="button primary" id="modalHello">Enviar saludo de prueba ♡</button>`;
    profileDialog.showModal();
    document.getElementById("modalHello").addEventListener("click",()=>{profileDialog.close();showToast("¡Saludo de prueba registrado en pantalla!");});
  }
  if(request){showToast("¡Saludo simulado! No se envió a ninguna persona.");}
});
function showToast(message){
  let toast=document.getElementById("toast");
  if(!toast){toast=document.createElement("div");toast.id="toast";toast.setAttribute("role","status");document.body.appendChild(toast);Object.assign(toast.style,{position:"fixed",bottom:"22px",left:"50%",transform:"translateX(-50%)",background:"#302735",color:"#fff",padding:"14px 20px",borderRadius:"12px",fontSize:"13px",zIndex:"30",boxShadow:"0 8px 25px #0002",maxWidth:"90%",textAlign:"center"});}
  toast.textContent=message;toast.style.display="block";clearTimeout(window.toastTimeout);window.toastTimeout=setTimeout(()=>toast.style.display="none",3000);
}
document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.currentTarget).entries());
  const messages=JSON.parse(localStorage.getItem("feeling_demo_messages")||"[]");
  messages.push({...data,createdAt:new Date().toISOString()});
  localStorage.setItem("feeling_demo_messages",JSON.stringify(messages));
  document.getElementById("contactFeedback").textContent="¡Mensaje guardado en este navegador! (Solo demostración)";
  e.currentTarget.reset();
});
const menuToggle=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{const opened=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(opened));});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}));
if("serviceWorker" in navigator && location.protocol.startsWith("http")){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
