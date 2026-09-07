
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
  card.innerHTML=`
    <div>
      <div class="contact-name">${contato.nome}</div>
      <div class="contact-role">${contato.parentesco}</div>
    </div>
    <div class="contact-actions">
      <a class="round-action round-call" href="tel:${contato.telefone}" aria-label="Ligar para ${contato.nome}">☎</a>
      ${contato.whatsapp?`<a class="round-action round-wa" href="https://wa.me/${tel}" target="_blank" rel="noopener" aria-label="WhatsApp de ${contato.nome}">◉</a>`:""}
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
