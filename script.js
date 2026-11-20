(() => {
  const PHOTO_JUMP = 'assets/foto_embutida_1.jpg';
  // Hash SHA-256 da senha especial de Natal: currybox123
  const XMAS_PASS_HASH = '6b248677bc5360e616077ef96b44a8028f744eb45e6a8d8a3105eb1117187354';

  const content = document.getElementById('content');
  const progress = document.getElementById('progress');
  const counter = document.getElementById('counter');
  const snow = document.getElementById('snow');
  const maxStep = 4;
  let step = 0;
  let collected = [false,false,false];
  let extraPhotos = {penedo:'assets/penedo.jpeg',park:'assets/park.jpeg'};
  let countdownTimer = null;

  async function sha256(t){
    const d=new TextEncoder().encode(t);
    const h=await crypto.subtle.digest('SHA-256',d);
    return[...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  for(let i=0;i<22;i++){
    const flake=document.createElement('i');
    flake.style.left=(Math.random()*100)+'%';
    flake.style.animationDuration=(9+Math.random()*12)+'s';
    flake.style.animationDelay=(-Math.random()*18)+'s';
    flake.style.opacity=(.35+Math.random()*.55).toFixed(2);
    flake.style.width=flake.style.height=(3+Math.random()*5)+'px';
    snow.appendChild(flake);
  }

  const art = {
    intro: `<svg viewBox="0 0 800 330" role="img" aria-label="Dois personagens fofos em uma paisagem de Natal"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#f7dfe7"/><stop offset="1" stop-color="#fff4dd"/></linearGradient></defs><rect width="800" height="330" fill="url(#sky)"/><circle cx="675" cy="65" r="36" fill="#ffe6a0"/><path d="M0 250 Q150 205 300 252 T600 245 T800 250 V330 H0Z" fill="#d9e9dc"/><g transform="translate(90 35)"><path d="M75 0 L15 90 H135Z" fill="#4e876b"/><path d="M75 48 L0 150 H150Z" fill="#3d755b"/><rect x="64" y="145" width="23" height="38" rx="4" fill="#9b6b52"/><circle cx="75" cy="33" r="10" fill="#f6cf70"/><circle cx="42" cy="105" r="7" fill="#e76c79"/><circle cx="104" cy="123" r="7" fill="#f6cf70"/><circle cx="76" cy="82" r="7" fill="#e76c79"/></g><g transform="translate(330 100)"><g><ellipse cx="75" cy="195" rx="45" ry="9" fill="#9b7d7d" opacity=".2"/><rect x="39" y="103" width="70" height="80" rx="25" fill="#e7a0a2"/><circle cx="74" cy="75" r="42" fill="#ffd8c8"/><path d="M34 72 Q28 23 76 29 Q116 25 116 71 Q93 45 58 49Z" fill="#76525a"/><circle cx="59" cy="79" r="4" fill="#59434b"/><circle cx="89" cy="79" r="4" fill="#59434b"/><path d="M66 95 Q75 103 84 95" fill="none" stroke="#bd7278" stroke-width="3" stroke-linecap="round"/><path d="M37 46 Q66 0 108 41 L37 46Z" fill="#d95f70"/><rect x="35" y="42" width="76" height="11" rx="5" fill="#fff"/><circle cx="109" cy="37" r="8" fill="#fff"/><path d="M51 178 L45 204 M95 178 L101 204" stroke="#76525a" stroke-width="12" stroke-linecap="round"/><path d="M42 204 h-17 M103 204 h18" stroke="#d95f70" stroke-width="10" stroke-linecap="round"/></g><g transform="translate(110 15)"><ellipse cx="75" cy="180" rx="43" ry="8" fill="#9b7d7d" opacity=".2"/><rect x="42" y="97" width="66" height="78" rx="23" fill="#83ad91"/><circle cx="75" cy="68" r="39" fill="#f2c9ac"/><path d="M38 65 Q39 20 78 27 Q111 26 114 65 Q89 43 52 47Z" fill="#68464d"/><circle cx="61" cy="72" r="4" fill="#59434b"/><circle cx="88" cy="72" r="4" fill="#59434b"/><path d="M66 88 Q75 96 84 88" fill="none" stroke="#bd7278" stroke-width="3" stroke-linecap="round"/><path d="M40 41 Q74 -2 112 40 L40 41Z" fill="#d95f70"/><rect x="38" y="37" width="78" height="11" rx="5" fill="#fff"/><circle cx="113" cy="33" r="8" fill="#fff"/><path d="M53 172 L49 199 M96 172 L100 199" stroke="#68464d" stroke-width="12" stroke-linecap="round"/><path d="M47 199 h-15 M101 199 h15" stroke="#54866c" stroke-width="10" stroke-linecap="round"/></g><path d="M130 84 C130 60 160 57 166 79 C172 57 202 60 202 84 C202 108 166 128 166 128Z" fill="#e87583"/></g><g fill="#fff" opacity=".85"><circle cx="250" cy="65" r="5"/><circle cx="590" cy="130" r="7"/><circle cx="720" cy="210" r="4"/></g></svg>`,
    penedo: `<svg viewBox="0 0 800 330" role="img" aria-label="Paisagem de Penedo, cachoeira e buggy vermelho"><defs><linearGradient id="pSky" x2="0" y2="1"><stop stop-color="#b9dce6"/><stop offset="1" stop-color="#f5eadb"/></linearGradient></defs><rect width="800" height="330" fill="url(#pSky)"/><circle cx="675" cy="58" r="34" fill="#ffe6a0"/><path d="M0 190 Q120 70 270 178 Q430 40 590 174 Q710 90 800 165 V330 H0Z" fill="#92bca7"/><path d="M0 220 Q170 140 315 225 Q500 135 800 215 V330 H0Z" fill="#5e9477"/><path d="M490 115 Q530 180 505 250 Q535 270 562 250 Q540 190 560 120Z" fill="#d9f4f2"/><path d="M510 250 Q545 270 572 250" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M0 280 Q180 255 360 282 T800 275 V330 H0Z" fill="#e6f0df"/><g transform="translate(110 190)"><path d="M15 45 L45 12 H170 L205 45Z" fill="#d84f5e"/><rect x="18" y="43" width="188" height="45" rx="16" fill="#d84f5e"/><path d="M64 18 H112 V44 H45Z" fill="#d9f1ef"/><path d="M120 18 H159 L183 44 H120Z" fill="#d9f1ef"/><circle cx="58" cy="91" r="19" fill="#51464a"/><circle cx="58" cy="91" r="8" fill="#e6d8c9"/><circle cx="168" cy="91" r="19" fill="#51464a"/><circle cx="168" cy="91" r="8" fill="#e6d8c9"/><rect x="25" y="54" width="174" height="9" rx="4" fill="#f6b1a8"/></g><g fill="#fff" opacity=".9"><circle cx="80" cy="42" r="5"/><circle cx="350" cy="62" r="6"/><circle cx="720" cy="120" r="5"/></g><text x="590" y="300" fill="#fff" font-size="18" font-weight="900" font-family="sans-serif">PENEDO ♥</text></svg>`,
    park: `<svg viewBox="0 0 800 330" role="img" aria-label="Passeio no Park Sul com lojas e lanche"><rect width="800" height="330" fill="#f6e2e2"/><path d="M0 265 Q180 235 400 265 T800 255 V330 H0Z" fill="#d5c3bd"/><rect x="72" y="55" width="656" height="220" rx="20" fill="#fff8ee" stroke="#e9c9bc" stroke-width="5"/><rect x="95" y="85" width="610" height="30" rx="10" fill="#e9b7b7"/><text x="400" y="107" text-anchor="middle" fill="#9d5361" font-size="21" font-weight="900" font-family="sans-serif">PARK SUL · VOLTA REDONDA</text><g><rect x="115" y="135" width="155" height="112" rx="12" fill="#b6d7d2"/><rect x="323" y="135" width="155" height="112" rx="12" fill="#f1cda6"/><rect x="530" y="135" width="155" height="112" rx="12" fill="#c7c1e2"/><path d="M135 155 H250 V226 H135Z" fill="#f8f2e9"/><path d="M343 155 H458 V226 H343Z" fill="#fff4df"/><path d="M550 155 H665 V226 H550Z" fill="#f7f0fa"/><g fill="#d98a86"><circle cx="185" cy="180" r="13"/><circle cx="394" cy="180" r="13"/><circle cx="600" cy="180" r="13"/></g><g fill="#fff"><rect x="165" y="205" width="42" height="9" rx="4"/><rect x="374" y="205" width="42" height="9" rx="4"/><rect x="580" y="205" width="42" height="9" rx="4"/></g></g><g transform="translate(325 245)"><path d="M0 0 h150 l-12 35 H12Z" fill="#b47b60"/><rect x="8" y="-16" width="134" height="18" rx="8" fill="#fff"/><path d="M50 -16 Q65 -48 90 -16" fill="#d78a4e"/><circle cx="71" cy="-29" r="5" fill="#f3c96d"/></g><g fill="#fff" opacity=".8"><circle cx="48" cy="45" r="6"/><circle cx="750" cy="42" r="5"/></g></svg>`,
    jump: `<svg viewBox="0 0 800 330" role="img" aria-label="Parque de trampolins colorido"><defs><linearGradient id="jbg" x2="0" y2="1"><stop stop-color="#d9d7f5"/><stop offset="1" stop-color="#f8d9e4"/></linearGradient></defs><rect width="800" height="330" fill="url(#jbg)"/><g transform="translate(45 110)"><rect x="0" y="70" width="210" height="105" rx="18" fill="#ed628b"/><rect x="18" y="84" width="174" height="74" rx="14" fill="#342d55"/><rect x="235" y="25" width="220" height="150" rx="18" fill="#79c8bd"/><rect x="253" y="41" width="184" height="116" rx="14" fill="#342d55"/><rect x="480" y="70" width="220" height="105" rx="18" fill="#f4c75f"/><rect x="498" y="84" width="184" height="74" rx="14" fill="#342d55"/><path d="M0 70 L18 84 M210 70 L192 84 M235 25 L253 41 M455 25 L437 41 M480 70 L498 84 M700 70 L682 84" stroke="#fff" stroke-width="8"/></g><g fill="#fff"><path d="M170 45 l8 18 19 2 -14 13 4 19 -17 -10 -17 10 4 -19 -14 -13 19 -2Z"/><path d="M610 32 l6 14 15 2 -11 10 3 15 -13 -8 -13 8 3 -15 -11 -10 15 -2Z"/></g><g transform="translate(350 35)"><circle cx="50" cy="25" r="17" fill="#ffd8c8"/><path d="M35 22 Q50 -3 66 21" fill="#76525a"/><path d="M37 43 Q50 34 63 43 L74 85 H25Z" fill="#d95f70"/><path d="M35 80 L24 100 M64 80 L76 100" stroke="#76525a" stroke-width="9" stroke-linecap="round"/></g><text x="400" y="300" text-anchor="middle" fill="#705c8d" font-size="18" font-weight="900" font-family="sans-serif">PULA, PULA, PULA! ✨</text></svg>`,
    final: `<svg viewBox="0 0 800 340" role="img" aria-label="Árvore de Natal em pixel art e um pote do amor"><rect width="800" height="340" rx="18" fill="#e8f1e7"/><g transform="translate(115 25)" shape-rendering="crispEdges"><rect x="115" y="0" width="30" height="30" fill="#f3c96d"/><rect x="100" y="30" width="60" height="30" fill="#3e7a5a"/><rect x="70" y="60" width="120" height="30" fill="#4e916a"/><rect x="40" y="90" width="180" height="30" fill="#3f805d"/><rect x="20" y="120" width="220" height="30" fill="#347451"/><rect x="0" y="150" width="260" height="30" fill="#2f684a"/><rect x="100" y="180" width="60" height="45" fill="#9a6a4f"/><rect x="52" y="98" width="22" height="22" fill="#e66a75"/><rect x="160" y="128" width="22" height="22" fill="#f3c96d"/><rect x="110" y="68" width="22" height="22" fill="#e66a75"/><rect x="198" y="158" width="22" height="22" fill="#f3c96d"/><rect x="28" y="158" width="22" height="22" fill="#f3c96d"/></g><g transform="translate(465 66)"><path d="M42 0 Q25 0 25 22 V35 H20 V205 Q20 228 43 228 H150 Q173 228 173 205 V35 H168 V22 Q168 0 151 0Z" fill="#ffffff" fill-opacity=".78" stroke="#7eaa91" stroke-width="7"/><rect x="42" y="-9" width="109" height="22" rx="8" fill="#b9d6c2" stroke="#7eaa91" stroke-width="5"/><path d="M34 125 Q95 100 160 125 V196 Q160 211 144 211 H50 Q34 211 34 196Z" fill="#f4c96c" opacity=".8"/><path d="M95 70 C95 52 119 50 124 68 C130 50 154 52 154 70 C154 91 124 108 124 108Z" fill="#df7180"/><text x="96" y="164" text-anchor="middle" fill="#855b5d" font-size="22" font-weight="900" font-family="sans-serif">365</text><text x="96" y="184" text-anchor="middle" fill="#855b5d" font-size="12" font-weight="900" font-family="sans-serif">MOTIVOS</text></g><g fill="#fff"><circle cx="370" cy="55" r="7"/><circle cx="720" cy="50" r="5"/><circle cx="420" cy="260" r="6"/></g></svg>`
  };

  function setProgress(label, value){counter.textContent=label;progress.style.width=value+'%';}

  function renderCountdown(){
    setProgress('Presente Misterioso 🎁', 0);
    
    // Alvo: 25 de Dezembro às 00:00:00
    const now = new Date();
    const targetYear = (now.getMonth() === 11 && now.getDate() >= 25) ? now.getFullYear() + 1 : now.getFullYear();
    const targetDate = new Date(targetYear, 11, 25, 0, 0, 0);

    content.innerHTML = `
      <div style="text-align:center">
        <span class="eyebrow">🎄 Encomenda Especial</span>
        <h1>Chegou mais cedo...</h1>
        <div class="scene" style="max-width:420px;margin:16px auto;padding:22px 16px;background:#fff4ee;border:2px dashed #e6bcb3;border-radius:24px;">
          <span style="font-size:52px;display:block;margin-bottom:8px">🎁</span>
          <p style="margin:0 0 12px;font-size:15px;color:#785d61;font-weight:700;line-height:1.5">
            Um presente feito com todo amor do mundo está esperando por você!
          </p>
          <div class="countdown-grid">
            <div class="countdown-box">
              <div class="countdown-num" id="cdDays">00</div>
              <div class="countdown-label">Dias</div>
            </div>
            <div class="countdown-box">
              <div class="countdown-num" id="cdHours">00</div>
              <div class="countdown-label">Horas</div>
            </div>
            <div class="countdown-box">
              <div class="countdown-num" id="cdMins">00</div>
              <div class="countdown-label">Min</div>
            </div>
            <div class="countdown-box">
              <div class="countdown-num" id="cdSecs">00</div>
              <div class="countdown-label">Seg</div>
            </div>
          </div>
          <p id="cdNote" style="margin:12px 0 0;font-size:12px;color:#8f7579;font-weight:700">
            A entrega oficial acontece no dia 25 de Dezembro! 🎅
          </p>
        </div>
        <div class="quote" style="font-style:normal;font-size:clamp(16px,4vw,19px);font-weight:800;color:#b94e60;margin:14px auto">
          Quer abrir antes? Digite a senha mágica: ✨
        </div>
        <div class="password-wrap">
          <input id="passInput" type="text" autocomplete="off" autocapitalize="none" placeholder="Digite a senha mágica..." aria-label="Senha de Natal">
          <p class="feedback" id="passFeedback" aria-live="polite"></p>
        </div>
        <div class="actions">
          <button class="btn" id="openBtn">Abrir meu presente 🔓❤️</button>
        </div>
      </div>
    `;

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    function updateTimer() {
      const diff = targetDate - new Date();
      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        const note = document.getElementById('cdNote');
        if (note) note.textContent = 'É Natal! 🎅 Digite a senha que seu amor te deu para abrir:';
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
    }
    updateTimer();
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(updateTimer, 1000);

    const input = document.getElementById('passInput');
    const checkPass = async () => {
      const val = input.value.trim().toLowerCase();
      const h = await sha256(val);
      // Exige SEMPRE a senha correta (currybox123) para garantir total privacidade
      if (h === XMAS_PASS_HASH) {
        if (countdownTimer) clearInterval(countdownTimer);
        sessionStorage.setItem('natal_auth', 'true');
        window.scrollTo({top:0,behavior:'smooth'});
        renderIntro();
      } else {
        document.getElementById('passFeedback').textContent = 'Ainda não é essa senha... Pergunte para o seu amor no dia 25! ❤️';
        input.focus();
      }
    };

    document.getElementById('openBtn').addEventListener('click', checkPass);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkPass();
    });
    input.focus();
  }

  function renderIntro(){
    setProgress('O começo de tudo',0);
    content.innerHTML=`<div style="text-align:center"><span class="eyebrow">💌 capítulo especial</span><h1>Antes das aventuras…<br>teve a gente.</h1><img class="memory-photo" src="assets/inicio.jpeg" alt="Nós dois"><p class="lead">Tudo começou com uma mensagem no Instagram. <strong>Você tomou a iniciativa e me chamou para te encontrar.</strong> A gente sempre foi unido, mas aquele começo teve um jeitinho muito especial.</p><div class="quote">E foi assim que começaram algumas das lembranças que eu mais gosto de guardar. ❤️</div><div class="actions"><button class="btn" id="begin">Viajar pelas nossas memórias ✨</button></div></div>`;
    document.getElementById('begin').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});step=1;renderMemory()});
  }

  const memories=[
    {key:'penedo',label:'Penedo',title:'Um dia entre montanhas e cachoeiras',emoji:'🏞️',text:'Acordamos cedinho para o passeio, e o buggy ainda demorou um pouquinho (kkkk). Mas valeu cada minuto: foi divertido, visitamos várias cachoeiras e vivemos um dia daqueles que emocionam. Ali eu senti ainda mais a nossa conexão.',quote:'Entre caminhos, cachoeiras e a espera pelo buggy (kkk), descobri que o lugar mais especial é aquele onde estou ao seu lado.',art:art.penedo,token:['🍃','💧','❤️']},
    {key:'park',label:'Park Sul',title:'Até uma voltinha vira lembrança',emoji:'🛍️',text:'No Park Sul, em Volta Redonda, a gente gosta de passear pelas lojas, conversar sem pressa e decidir o que fazer na hora. Às vezes rola um lanchinho, às vezes Outback… e sempre tem uma boa companhia.',quote:'Não importa onde a gente vá ou o que vamos fazer. Até uma simples volta pelo shopping se torna uma lembrança especial quando estou com você.',art:art.park,token:['🛍️','🍟','💗']},
    {key:'jump',label:'Jump Land',title:'Um monte de pulos e risadas',emoji:'⭐',text:'Foi muuuito legal! Pulamos bastante, tiramos várias fotos, usamos meias combinando e brincamos até cansar. Uma daquelas aventuras em que a gente volta para casa com ainda mais histórias para contar.',quote:'Se a vida é feita de momentos, quero continuar pulando, brincando e colecionando cada um deles ao seu lado.',art:art.jump,token:['⭐','🧦','📸']}
  ];

  function renderMemory(){
    const m=memories[step-1];
    collected=[false,false,false];
    setProgress(`Memória ${step} de 3 · ${m.label}`,step*20);
    const photo = m.key==='jump' && PHOTO_JUMP ? `<img class="memory-photo" loading="lazy" decoding="async" src="${PHOTO_JUMP}" alt="Fotos do nosso dia no Jump Land">` : (extraPhotos[m.key] ? `<img class="memory-photo" loading="lazy" decoding="async" src="${extraPhotos[m.key]}" alt="Foto de ${m.label}">` : '');
    content.innerHTML=`<div style="text-align:center"><span class="eyebrow">${m.emoji} ${m.label}</span><h2>${m.title}</h2>${photo ? '' : '<div class="scene">'+m.art+'</div>'}${photo}<p class="story">${m.text}</p><div class="quote">“${m.quote}”</div><div class="token-area"><div class="token-title">Toque nos 3 símbolos para desbloquear a próxima lembrança</div><div class="tokens">${m.token.map((t,i)=>`<button class="token" data-token="${i}" aria-label="Encontrar lembrança ${i+1}">${t}</button>`).join('')}</div><p class="token-status" id="tokenStatus">0 de 3 lembranças encontradas</p></div><div class="actions"><button class="btn green hidden" id="nextMemory">Continuar nossa aventura ❤️</button></div></div>`;
    content.querySelectorAll('[data-token]').forEach(btn=>btn.addEventListener('click',()=>{
      const i=Number(btn.dataset.token); if(collected[i]) return; collected[i]=true; btn.classList.add('done'); btn.innerHTML='<span>✓</span>'; btn.disabled=true;
      const count=collected.filter(Boolean).length; document.getElementById('tokenStatus').textContent=`${count} de 3 lembranças encontradas`;
      if(count===3){document.getElementById('tokenStatus').textContent='Memória desbloqueada! ✨';document.getElementById('nextMemory').classList.remove('hidden');}
    }));
    document.getElementById('nextMemory').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});if(step<3){step++;renderMemory()}else{step=4;renderFinal()}});
  }

  function renderFinal(){
    setProgress('O presente de verdade',85);
    content.innerHTML=`<div style="text-align:center"><span class="eyebrow">🎁 capítulo final</span><h1>As melhores memórias nós já criamos…</h1><div class="final-art">${art.final}</div><p class="lead">Mas o seu presente de verdade está aqui. <strong>Diga a senha mágica para abrir:</strong></p><div class="quote" style="font-style:normal;font-size:clamp(19px,4.6vw,25px);font-weight:1000;color:#b94e60">Feliz Natal, meu amor!</div><div class="password-wrap"><input id="password" type="text" inputmode="text" autocomplete="off" autocapitalize="sentences" placeholder="Digite a senha mágica" aria-label="Senha mágica"><p class="feedback" id="feedback" aria-live="polite"></p></div><div class="actions"><button class="btn" id="unlock">Abrir meu presente 🎄</button></div></div>`;
    const input=document.getElementById('password');
    const unlock=async()=>{
      const value=input.value.trim().toLocaleLowerCase('pt-BR').replace(/\s+/g,' ');
      const h=await sha256(value);
      if(h==='335187b0ac6be7a856eca2f9ff261e89d1f19a994fb044322d94329e06aa85d4'||h==='694ea712c97998d0d1a814d40b7c08429e873b8dfc95c1da283d38949d64064e'){
        step=5;
        renderUnlocked();
      }else{
        document.getElementById('feedback').textContent='Quase! Tente a frase que apareceu ali em cima. 💁';
        input.focus();
      }
    };
    document.getElementById('unlock').addEventListener('click',unlock);
    input.addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});
  }

  function renderUnlocked(){
    setProgress('Presente desbloqueado!',100);
    content.innerHTML=`<div style="text-align:center"><span class="eyebrow">💗 feliz Natal!</span><h1>O nosso Pote do Amor</h1><div class="final-art">${art.final}</div><p class="lead">Este pote guarda <strong>365 motivos</strong>, um para cada dia do ano.</p><div class="quote">As melhores memórias nós já criamos. E ainda tem tanta coisa boa esperando pela gente…</div><p class="story"><strong>Agora é hora de entregar o Pote do Amor de verdade! ❤️</strong></p><div class="actions"><button class="btn green" id="again">Rever nossa história ↺</button></div></div>`;
    document.getElementById('again').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});step=0;renderIntro()});
  }

  if (sessionStorage.getItem('natal_auth') === 'true') {
    renderIntro();
  } else {
    renderCountdown();
  }
})();
