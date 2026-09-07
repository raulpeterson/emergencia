
function calcularIdade(dataBR){
  const [d,m,y]=dataBR.split("/").map(Number);
  const hoje=new Date();
  let idade=hoje.getFullYear()-y;
  const mes=hoje.getMonth()+1;
  if(mes<m||(mes===m&&hoje.getDate()<d)) idade--;
  return idade;
}
function somenteNumeros(v){return String(v||"").replace(/\D/g,"")}
function iniciais(nome){return nome.trim().split(/\s+/).slice(0,2).map(p=>p[0]?.toUpperCase()||"").join("")}
function preencherCard(id, value){
  const card=document.getElementById(id);
  if(!card)return;
  if(value && String(value).trim()!==""){
    card.querySelector("[data-value]").textContent=value;
    card.classList.remove("hidden");
  }else{
    card.classList.add("hidden");
  }
}

document.getElementById("nome").textContent=ficha.nome;
document.getElementById("idade").textContent=`${calcularIdade(ficha.nascimento)} anos • Nasc. ${ficha.nascimento}`;
document.getElementById("sangue").textContent=ficha.sangue;
document.getElementById("initials").textContent=iniciais(ficha.nome);

if(ficha.foto){
  const img=document.getElementById("foto");
  img.src=ficha.foto;
  img.style.display="block";
  document.getElementById("initials").style.display="none";
  img.onerror=()=>{img.style.display="none";document.getElementById("initials").style.display="grid";}
}

if(!ficha.doador) document.getElementById("doadorBadge").classList.add("hidden");

preencherCard("alergiasCard",ficha.alergias);
preencherCard("medicamentosCard",ficha.medicamentos);
preencherCard("condicoesCard",ficha.condicoes);
preencherCard("convenioCard",ficha.convenio);
preencherCard("orientacoesCard",ficha.orientacoes);

const contatosEl=document.getElementById("contatos");
document.getElementById("contactCount").textContent=ficha.contatos.length;

ficha.contatos.forEach(contato=>{
  const tel=somenteNumeros(contato.telefone);
  const card=document.createElement("article");
  card.className="contact-card";
  const phoneIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg>`;
  const waIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.38 8.38 0 0 1 12.5 3h.5a8.48 8.48 0 0 1 8 8z"/></svg>`;
  card.innerHTML=`
    <div class="contact-main">
      <div class="contact-name">${contato.nome}</div>
      <div class="contact-role">
        <span>${contato.parentesco}</span>
        ${ficha.contatos[0] === contato ? `<span class="dot"></span><span class="primary-label">Contato principal</span>` : ""}
      </div>
    </div>
    <div class="contact-actions">
      <a class="round-action round-call" href="tel:${contato.telefone}" aria-label="Ligar para ${contato.nome}">
        ${phoneIcon}<span class="round-label">Ligar</span>
      </a>
      ${contato.whatsapp?`<a class="round-action round-wa" href="https://wa.me/${tel}" target="_blank" rel="noopener" aria-label="WhatsApp de ${contato.nome}">
        ${waIcon}<span class="round-label">WhatsApp</span>
      </a>`:""}
    </div>`;
  contatosEl.appendChild(card);
});

const principal=ficha.contatos[0];
if(principal){
  document.getElementById("callPrimary").href=`tel:${principal.telefone}`;
  document.getElementById("whatsPrimary").href=`https://wa.me/${somenteNumeros(principal.telefone)}`;
}else{
  document.querySelector(".quick-actions").classList.add("hidden");
}

document.getElementById("shareBtn").addEventListener("click",async()=>{
  const data={title:"Ficha de Emergência",text:`Ficha de emergência de ${ficha.nome}`,url:window.location.href};
  try{
    if(navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(window.location.href);
  }catch(_){}
});

const locationBtn=document.getElementById("locationBtn");
const locationStatus=document.getElementById("locationStatus");
locationBtn.addEventListener("click",()=>{
  if(!navigator.geolocation){
    locationStatus.textContent="Este navegador não oferece suporte à localização.";
    return;
  }
  locationStatus.textContent="Obtendo localização...";
  navigator.geolocation.getCurrentPosition(
    ({coords})=>{
      const maps=`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
      const contato=ficha.contatos.find(c=>c.whatsapp);
      if(!contato){
        locationStatus.innerHTML=`Localização: <a href="${maps}" target="_blank" rel="noopener">abrir mapa</a>`;
        return;
      }
      const msg=encodeURIComponent(`Olá. Estou acessando a ficha de emergência de ${ficha.nome}. Minha localização atual é: ${maps}`);
      window.open(`https://wa.me/${somenteNumeros(contato.telefone)}?text=${msg}`,"_blank","noopener");
      locationStatus.textContent="WhatsApp aberto com a localização.";
    },
    ()=>locationStatus.textContent="Não foi possível obter a localização. Verifique a permissão do navegador.",
    {enableHighAccuracy:true,timeout:10000,maximumAge:30000}
  );
});
