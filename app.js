const STORAGE_KEY='clientflow-demo-v1';
const demoData={
  settings:{business:'Studio Aurora',whatsapp:'5521999999999',start:'09:00',end:'19:00'},
  services:[
    {id:'srv1',name:'Corte premium',duration:50,price:65,description:'Atendimento completo com finalização.'},
    {id:'srv2',name:'Barba + acabamento',duration:35,price:45,description:'Modelagem, acabamento e cuidado final.'},
    {id:'srv3',name:'Pacote completo',duration:80,price:105,description:'Corte, barba e finalização no mesmo horário.'},
    {id:'srv4',name:'Consultoria de imagem',duration:60,price:120,description:'Orientação personalizada de estilo e manutenção.'}
  ],
  clients:[
    {id:'cli1',name:'Lucas Almeida',phone:'5521987654321',email:'lucas@example.com',notes:'Prefere horários no fim da tarde.',visits:8,lastVisit:'2026-08-13'},
    {id:'cli2',name:'Rafael Costa',phone:'5521976543210',email:'rafael@example.com',notes:'Cliente recorrente.',visits:5,lastVisit:'2026-08-10'},
    {id:'cli3',name:'Bruno Martins',phone:'5521965432109',email:'bruno@example.com',notes:'Conheceu pelo Instagram.',visits:3,lastVisit:'2026-08-06'},
    {id:'cli4',name:'Diego Rocha',phone:'5521954321098',email:'diego@example.com',notes:'Interesse em pacote mensal.',visits:2,lastVisit:'2026-07-29'},
    {id:'cli5',name:'Caio Nunes',phone:'5521943210987',email:'caio@example.com',notes:'Primeiro atendimento recente.',visits:1,lastVisit:'2026-08-18'}
  ],
  appointments:[
    {id:'apt1',clientId:'cli1',serviceId:'srv3',date:'2026-08-20',time:'09:30',status:'confirmed'},
    {id:'apt2',clientId:'cli2',serviceId:'srv1',date:'2026-08-20',time:'11:00',status:'confirmed'},
    {id:'apt3',clientId:'cli3',serviceId:'srv2',date:'2026-08-20',time:'14:30',status:'pending'},
    {id:'apt4',clientId:'cli4',serviceId:'srv4',date:'2026-08-20',time:'17:00',status:'confirmed'},
    {id:'apt5',clientId:'cli5',serviceId:'srv1',date:'2026-08-21',time:'10:00',status:'pending'},
    {id:'apt6',clientId:'cli1',serviceId:'srv2',date:'2026-08-18',time:'16:00',status:'done'}
  ],
  quotes:[
    {id:'quo1',clientId:'cli4',title:'Pacote mensal',amount:320,status:'sent',created:'2026-08-19',description:'4 atendimentos no mês.'},
    {id:'quo2',clientId:'cli3',title:'Pacote completo',amount:105,status:'draft',created:'2026-08-20',description:'Corte + barba.'},
    {id:'quo3',clientId:'cli2',title:'Plano trimestral',amount:780,status:'approved',created:'2026-08-12',description:'Atendimento recorrente por três meses.'}
  ],
  revenue:[5800,6400,6100,7200,7900,8900]
};
let state=loadState();
let activeView='dashboard';
let scheduleFilter='all';
let quoteFilter='all';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clone=o=>JSON.parse(JSON.stringify(o));
const uid=p=>`${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`;
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const dateBR=v=>{if(!v)return '—';const [y,m,d]=v.split('-');return `${d}/${m}/${y}`};
const initials=name=>String(name||'?').split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
const statusLabel={confirmed:'Confirmado',pending:'Pendente',done:'Concluído',cancelled:'Cancelado',draft:'Rascunho',sent:'Enviado',approved:'Aprovado'};
function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||clone(demoData)}catch{return clone(demoData)}}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600)}
function getClient(id){return state.clients.find(x=>x.id===id)}
function getService(id){return state.services.find(x=>x.id===id)}
function normalizePhone(v){return String(v||'').replace(/\D/g,'')}
function openWhatsApp(phone,text){const p=normalizePhone(phone||state.settings.whatsapp);if(!p){toast('Cadastre um número de WhatsApp.');return}window.open(`https://wa.me/${p}?text=${encodeURIComponent(text)}`,'_blank','noopener')}

const viewMeta={dashboard:['PAINEL','Visão geral'],schedule:['ATENDIMENTOS','Agenda'],clients:['RELACIONAMENTO','Clientes'],services:['CATÁLOGO','Serviços'],quotes:['COMERCIAL','Orçamentos'],messages:['ATENDIMENTO','Mensagens'],settings:['SISTEMA','Configurações']};
function navigate(view){activeView=view;$$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));const meta=viewMeta[view]||viewMeta.dashboard;$('#page-kicker').textContent=meta[0];$('#page-title').textContent=meta[1];$('#sidebar').classList.remove('open');renderAll();window.scrollTo({top:0,behavior:'smooth'})}

function renderDashboard(){
  const today='2026-08-20';
  const todays=state.appointments.filter(a=>a.date===today&&a.status!=='cancelled').sort((a,b)=>a.time.localeCompare(b.time));
  const todayRevenue=todays.reduce((sum,a)=>sum+(getService(a.serviceId)?.price||0),0);
  const pendingQuotes=state.quotes.filter(q=>q.status==='sent'||q.status==='draft');
  $('#hero-appointments').textContent=`${todays.length} atendimentos`;
  $('#hero-pending').textContent=`${pendingQuotes.length} orçamentos`;
  const stats=[['Atendimentos hoje',todays.length,'agenda atual'],['Receita prevista',money(todayRevenue),'considerando a agenda'],['Clientes ativos',state.clients.length,'cadastros na demo'],['Orçamentos abertos',pendingQuotes.length,'aguardando decisão']];
  $('#dashboard-stats').innerHTML=stats.map(([l,v,s])=>`<article class="stat-card"><span>${esc(l)}</span><strong>${esc(v)}</strong><small>${esc(s)}</small></article>`).join('');
  $('#today-list').innerHTML=todays.length?todays.map(a=>{const c=getClient(a.clientId),s=getService(a.serviceId);return `<div class="timeline-row"><span class="timeline-time">${esc(a.time)}</span><div><strong>${esc(c?.name||'Cliente')}</strong><small>${esc(s?.name||'Serviço')} · ${s?.duration||0} min</small></div><span class="status-chip status-${a.status}">${statusLabel[a.status]}</span></div>`}).join(''):'<p class="helper">Nenhum atendimento para hoje.</p>';
  const groups={draft:0,sent:0,approved:0};state.quotes.forEach(q=>{if(groups[q.status]!==undefined)groups[q.status]++});
  $('#quote-summary').innerHTML=[['Rascunhos',groups.draft,'draft'],['Aguardando cliente',groups.sent,'sent'],['Aprovados',groups.approved,'approved']].map(([label,count,key])=>`<div class="quote-summary-row"><div><span>${label}</span><strong>${count} orçamento${count===1?'':'s'}</strong></div><strong>${key==='approved'?money(state.quotes.filter(q=>q.status==='approved').reduce((s,q)=>s+q.amount,0)):'—'}</strong></div>`).join('');
  const max=Math.max(...state.revenue,1);$('#revenue-chart').innerHTML=state.revenue.map(v=>`<i style="height:${Math.max(14,v/max*100)}%" title="${money(v)}"></i>`).join('');
  $('#recent-clients').innerHTML=[...state.clients].sort((a,b)=>(b.lastVisit||'').localeCompare(a.lastVisit||'')).slice(0,4).map(c=>`<div class="mini-row"><span class="avatar">${initials(c.name)}</span><div><strong>${esc(c.name)}</strong><small>${c.visits} atendimento${c.visits===1?'':'s'} · último em ${dateBR(c.lastVisit)}</small></div><button class="text-btn" data-message-client="${c.id}">Mensagem</button></div>`).join('');
}

function renderSchedule(){
  let items=[...state.appointments].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));if(scheduleFilter!=='all')items=items.filter(a=>a.status===scheduleFilter);
  $('#schedule-table').innerHTML=items.map(a=>{const c=getClient(a.clientId),s=getService(a.serviceId);return `<tr><td><strong>${dateBR(a.date)}</strong>${esc(a.time)}</td><td>${esc(c?.name||'Cliente')}</td><td>${esc(s?.name||'Serviço')}</td><td>${money(s?.price||0)}</td><td><span class="status-chip status-${a.status}">${statusLabel[a.status]}</span></td><td><button class="table-action" data-edit-appointment="${a.id}">Editar</button></td></tr>`}).join('');
  $('#schedule-mobile').innerHTML=items.map(a=>{const c=getClient(a.clientId),s=getService(a.serviceId);return `<div class="mobile-row"><div><strong>${esc(a.time)}</strong><small>${dateBR(a.date)}</small></div><div><strong>${esc(c?.name||'Cliente')}</strong><small>${esc(s?.name||'Serviço')}</small></div><button class="table-action" data-edit-appointment="${a.id}">Editar</button></div>`}).join('');
}

function renderClients(query=''){
  const q=query.trim().toLowerCase();const clients=state.clients.filter(c=>!q||[c.name,c.phone,c.email].some(v=>String(v).toLowerCase().includes(q)));
  $('#client-grid').innerHTML=clients.length?clients.map(c=>`<article class="client-card"><div class="client-card-head"><span class="avatar">${initials(c.name)}</span><div><h3>${esc(c.name)}</h3><span class="sub">${c.visits} atendimento${c.visits===1?'':'s'}</span></div></div><div class="client-meta"><span>WhatsApp <b>${esc(formatPhone(c.phone))}</b></span><span>E-mail <b>${esc(c.email||'—')}</b></span><span>Última visita <b>${dateBR(c.lastVisit)}</b></span></div><div class="client-card-actions"><button class="btn btn-soft" data-edit-client="${c.id}">Editar</button><button class="btn btn-primary" data-message-client="${c.id}">Mensagem</button></div></article>`).join(''):'<p class="helper">Nenhum cliente encontrado.</p>';
}
function formatPhone(v){const p=normalizePhone(v).replace(/^55/,'');return p.length===11?`(${p.slice(0,2)}) ${p.slice(2,7)}-${p.slice(7)}`:v||'—'}

function renderServices(){
  $('#service-grid').innerHTML=state.services.map((s,i)=>`<article class="service-card"><span class="service-icon">${String(i+1).padStart(2,'0')}</span><h3>${esc(s.name)}</h3><p>${esc(s.description||'')}</p><div class="service-info"><span>Duração<br><strong>${s.duration} min</strong></span><span>Valor<br><strong>${money(s.price)}</strong></span></div><div class="client-card-actions" style="margin-top:14px"><button class="btn btn-soft" data-edit-service="${s.id}">Editar</button></div></article>`).join('');
}

function renderQuotes(){
  let items=[...state.quotes].sort((a,b)=>b.created.localeCompare(a.created));if(quoteFilter!=='all')items=items.filter(q=>q.status===quoteFilter);
  $('#quote-board').innerHTML=items.length?items.map(q=>{const c=getClient(q.clientId);return `<article class="quote-card"><div class="quote-card-top"><div><small>${dateBR(q.created)}</small><h3>${esc(q.title)}</h3></div><span class="status-chip status-${q.status==='approved'?'confirmed':q.status==='sent'?'pending':'done'}">${statusLabel[q.status]}</span></div><p>${esc(c?.name||'Cliente')} · ${esc(q.description||'')}</p><div class="quote-value">${money(q.amount)}</div><div class="quote-actions"><button class="btn btn-soft" data-edit-quote="${q.id}">Editar</button><button class="btn btn-primary" data-send-quote="${q.id}">Enviar</button></div></article>`}).join(''):'<p class="helper">Nenhum orçamento nesta categoria.</p>';
}

const templates=[
  {title:'Confirmação de agendamento',text:'Olá, {nome}! Seu atendimento está agendado para {data} às {hora}. Se precisar alterar, me avise por aqui.'},
  {title:'Lembrete de atendimento',text:'Oi, {nome}! Passando para lembrar do seu atendimento amanhã. Te espero no horário combinado.'},
  {title:'Follow-up de orçamento',text:'Olá, {nome}! Conseguiu analisar o orçamento que enviei? Se quiser, posso tirar qualquer dúvida por aqui.'},
  {title:'Pós-atendimento',text:'Obrigado pela visita, {nome}! Se puder, me conte como foi sua experiência. Seu retorno ajuda muito.'}
];
function renderMessages(){
  $('#message-templates').innerHTML=templates.map((t,i)=>`<button class="template-card" data-template="${i}"><strong>${esc(t.title)}</strong><p>${esc(t.text)}</p></button>`).join('');
  $('#message-client').innerHTML='<option value="">Selecione um cliente</option>'+state.clients.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
}

function renderSettings(){const s=state.settings;$('#setting-business').value=s.business||'';$('#setting-whatsapp').value=s.whatsapp||'';$('#setting-start').value=s.start||'09:00';$('#setting-end').value=s.end||'19:00';$('#booking-business').textContent=s.business||'Seu negócio'}
function renderBooking(){
  $('#booking-service').innerHTML='<option value="">Escolha um serviço</option>'+state.services.map(s=>`<option value="${s.id}">${esc(s.name)} — ${money(s.price)}</option>`).join('');
  const date=$('#booking-date');if(!date.value)date.value='2026-08-21';
  renderBookingTimes();
}
function renderBookingTimes(){const slots=[];const [sh,sm]=(state.settings.start||'09:00').split(':').map(Number),[eh,em]=(state.settings.end||'19:00').split(':').map(Number);for(let m=sh*60+sm;m<=eh*60+em-30;m+=30){const h=String(Math.floor(m/60)).padStart(2,'0'),min=String(m%60).padStart(2,'0');slots.push(`${h}:${min}`)}const busy=new Set(state.appointments.filter(a=>a.date===$('#booking-date').value&&a.status!=='cancelled').map(a=>a.time));$('#booking-time').innerHTML=slots.filter(t=>!busy.has(t)).map(t=>`<option>${t}</option>`).join('')||'<option value="">Sem horários disponíveis</option>'}
function renderAll(){renderDashboard();renderSchedule();renderClients($('#client-search')?.value||'');renderServices();renderQuotes();renderMessages();renderSettings();renderBooking();}

function field(label,name,type='text',value='',extra=''){return `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`}
function selectField(label,name,options,value=''){return `<label>${label}<select name="${name}">${options.map(o=>`<option value="${esc(o.value)}" ${o.value===value?'selected':''}>${esc(o.label)}</option>`).join('')}</select></label>`}
function textareaField(label,name,value=''){return `<label style="grid-column:1/-1">${label}<textarea name="${name}" rows="3">${esc(value)}</textarea></label>`}
function openEntityModal(type,id=null){
  const dialog=$('#entity-modal'),fields=$('#modal-fields'),title=$('#modal-title'),kicker=$('#modal-kicker'),form=$('#entity-form');form.dataset.type=type;form.dataset.id=id||'';
  if(type==='appointment'){
    const item=state.appointments.find(x=>x.id===id)||{clientId:state.clients[0]?.id||'',serviceId:state.services[0]?.id||'',date:'2026-08-20',time:'09:00',status:'confirmed'};kicker.textContent=id?'EDITAR':'AGENDA';title.textContent=id?'Editar agendamento':'Novo agendamento';fields.innerHTML=selectField('Cliente','clientId',state.clients.map(c=>({value:c.id,label:c.name})),item.clientId)+selectField('Serviço','serviceId',state.services.map(s=>({value:s.id,label:`${s.name} · ${money(s.price)}`})),item.serviceId)+field('Data','date','date',item.date,'required')+field('Horário','time','time',item.time,'required')+selectField('Status','status',[{value:'confirmed',label:'Confirmado'},{value:'pending',label:'Pendente'},{value:'done',label:'Concluído'},{value:'cancelled',label:'Cancelado'}],item.status);
  }
  if(type==='client'){
    const item=state.clients.find(x=>x.id===id)||{name:'',phone:'',email:'',notes:'',visits:0,lastVisit:'2026-08-20'};kicker.textContent=id?'EDITAR':'CRM';title.textContent=id?'Editar cliente':'Novo cliente';fields.innerHTML=field('Nome','name','text',item.name,'required maxlength="80"')+field('WhatsApp','phone','tel',item.phone,'required')+field('E-mail','email','email',item.email)+field('Última visita','lastVisit','date',item.lastVisit)+textareaField('Observações','notes',item.notes);
  }
  if(type==='service'){
    const item=state.services.find(x=>x.id===id)||{name:'',duration:45,price:0,description:''};kicker.textContent=id?'EDITAR':'CATÁLOGO';title.textContent=id?'Editar serviço':'Novo serviço';fields.innerHTML=field('Nome','name','text',item.name,'required maxlength="80"')+field('Duração (min)','duration','number',item.duration,'min="10" step="5" required')+field('Preço','price','number',item.price,'min="0" step="0.01" required')+textareaField('Descrição','description',item.description);
  }
  if(type==='quote'){
    const item=state.quotes.find(x=>x.id===id)||{clientId:state.clients[0]?.id||'',title:'',amount:0,status:'draft',created:'2026-08-20',description:''};kicker.textContent=id?'EDITAR':'COMERCIAL';title.textContent=id?'Editar orçamento':'Novo orçamento';fields.innerHTML=selectField('Cliente','clientId',state.clients.map(c=>({value:c.id,label:c.name})),item.clientId)+field('Título','title','text',item.title,'required maxlength="100"')+field('Valor','amount','number',item.amount,'min="0" step="0.01" required')+selectField('Status','status',[{value:'draft',label:'Rascunho'},{value:'sent',label:'Enviado'},{value:'approved',label:'Aprovado'}],item.status)+field('Data','created','date',item.created,'required')+textareaField('Descrição','description',item.description);
  }
  dialog.showModal();
}
function saveEntity(){
  const form=$('#entity-form'),type=form.dataset.type,id=form.dataset.id,data=Object.fromEntries(new FormData(form));
  if(type==='appointment'){const item={id:id||uid('apt'),clientId:data.clientId,serviceId:data.serviceId,date:data.date,time:data.time,status:data.status};upsert('appointments',item)}
  if(type==='client'){const existing=state.clients.find(x=>x.id===id);const item={id:id||uid('cli'),name:data.name.trim(),phone:normalizePhone(data.phone),email:data.email.trim(),notes:data.notes.trim(),visits:existing?.visits||0,lastVisit:data.lastVisit};upsert('clients',item)}
  if(type==='service'){const item={id:id||uid('srv'),name:data.name.trim(),duration:Number(data.duration),price:Number(data.price),description:data.description.trim()};upsert('services',item)}
  if(type==='quote'){const item={id:id||uid('quo'),clientId:data.clientId,title:data.title.trim(),amount:Number(data.amount),status:data.status,created:data.created,description:data.description.trim()};upsert('quotes',item)}
  saveState();renderAll();toast('Alterações salvas.');
}
function upsert(key,item){const i=state[key].findIndex(x=>x.id===item.id);if(i>=0)state[key][i]=item;else state[key].push(item)}

function handleBookingSubmit(e){e.preventDefault();const name=$('#booking-name').value.trim(),phone=normalizePhone($('#booking-phone').value),serviceId=$('#booking-service').value,date=$('#booking-date').value,time=$('#booking-time').value;if(!name||!phone||!serviceId||!date||!time)return;let client=state.clients.find(c=>normalizePhone(c.phone)===phone);if(!client){client={id:uid('cli'),name,phone,email:'',notes:'Agendamento pela página pública.',visits:0,lastVisit:''};state.clients.push(client)}state.appointments.push({id:uid('apt'),clientId:client.id,serviceId,date,time,status:'pending'});saveState();renderAll();$('#booking-form').hidden=true;$('#booking-success').hidden=false}
function openBooking(){renderBooking();$('#booking-form').hidden=false;$('#booking-success').hidden=true;$('#booking-dialog').showModal()}
function closeBooking(){$('#booking-dialog').close()}

function sendQuote(id){const q=state.quotes.find(x=>x.id===id),c=getClient(q?.clientId);if(!q||!c)return;const text=`Olá, ${c.name}! Segue o orçamento “${q.title}” no valor de ${money(q.amount)}. ${q.description||''} Se quiser, posso tirar suas dúvidas por aqui.`;q.status='sent';saveState();renderQuotes();openWhatsApp(c.phone,text)}
function prefillMessage(clientId){navigate('messages');$('#message-client').value=clientId;const c=getClient(clientId);$('#message-text').value=`Olá, ${c?.name||''}! `;$('#message-text').focus()}
function applyTemplate(index){const client=getClient($('#message-client').value);const todayAppointment=state.appointments.find(a=>a.clientId===client?.id&&a.status!=='cancelled');const text=templates[index].text.replace('{nome}',client?.name?.split(' ')[0]||'cliente').replace('{data}',todayAppointment?dateBR(todayAppointment.date):'data combinada').replace('{hora}',todayAppointment?.time||'horário combinado');$('#message-text').value=text}

function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='clientflow-backup.json';a.click();URL.revokeObjectURL(url);toast('Backup exportado.')}
function importData(file){const r=new FileReader();r.onload=()=>{try{const parsed=JSON.parse(r.result);if(!parsed.clients||!parsed.services||!parsed.appointments)throw new Error();state=parsed;saveState();renderAll();toast('Backup importado.')}catch{toast('Arquivo de backup inválido.')}};r.readAsText(file)}

function bindEvents(){
  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a');if(!b)return;
    if(b.dataset.view){navigate(b.dataset.view);return}
    if(b.dataset.go){navigate(b.dataset.go);return}
    if(b.dataset.openBooking!==undefined){openBooking();return}
    if(b.dataset.closeBooking!==undefined){closeBooking();return}
    if(b.dataset.action==='quick-appointment'){openEntityModal('appointment');return}
    if(b.dataset.action==='new-client'){openEntityModal('client');return}
    if(b.dataset.action==='new-service'){openEntityModal('service');return}
    if(b.dataset.action==='new-quote'){openEntityModal('quote');return}
    if(b.dataset.editAppointment){openEntityModal('appointment',b.dataset.editAppointment);return}
    if(b.dataset.editClient){openEntityModal('client',b.dataset.editClient);return}
    if(b.dataset.editService){openEntityModal('service',b.dataset.editService);return}
    if(b.dataset.editQuote){openEntityModal('quote',b.dataset.editQuote);return}
    if(b.dataset.sendQuote){sendQuote(b.dataset.sendQuote);return}
    if(b.dataset.messageClient){prefillMessage(b.dataset.messageClient);return}
    if(b.dataset.template!==undefined){applyTemplate(Number(b.dataset.template));return}
  });
  $('#mobile-menu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#client-search').addEventListener('input',e=>renderClients(e.target.value));
  $('#schedule-filter').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;scheduleFilter=b.dataset.filter;$$('#schedule-filter button').forEach(x=>x.classList.toggle('active',x===b));renderSchedule()});
  $('#quote-filter').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;quoteFilter=b.dataset.filter;$$('#quote-filter button').forEach(x=>x.classList.toggle('active',x===b));renderQuotes()});
  $('#entity-form').addEventListener('submit',e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();saveEntity();$('#entity-modal').close()});
  $('#booking-form').addEventListener('submit',handleBookingSubmit);$('#booking-date').addEventListener('change',renderBookingTimes);
  $('#message-client').addEventListener('change',()=>{$('#message-text').value=''});
  $('#copy-message').addEventListener('click',async()=>{const text=$('#message-text').value;if(!text)return toast('Escreva uma mensagem primeiro.');try{await navigator.clipboard.writeText(text);toast('Mensagem copiada.')}catch{toast('Não foi possível copiar automaticamente.')}});
  $('#send-whatsapp').addEventListener('click',()=>{const c=getClient($('#message-client').value),text=$('#message-text').value;if(!c)return toast('Selecione um cliente.');if(!text)return toast('Escreva uma mensagem.');openWhatsApp(c.phone,text)});
  $('#save-settings').addEventListener('click',()=>{state.settings={business:$('#setting-business').value.trim()||'Seu negócio',whatsapp:normalizePhone($('#setting-whatsapp').value),start:$('#setting-start').value||'09:00',end:$('#setting-end').value||'19:00'};saveState();renderSettings();toast('Preferências salvas.')});
  $('#export-data').addEventListener('click',exportData);$('#import-data').addEventListener('change',e=>{if(e.target.files[0])importData(e.target.files[0])});
  $('#reset-data').addEventListener('click',()=>{if(confirm('Restaurar todos os dados fictícios da demonstração?')){state=clone(demoData);saveState();renderAll();toast('Demonstração restaurada.')}});
}

renderAll();bindEvents();
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
