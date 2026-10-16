// ===== Corações flutuando =====
const box = document.querySelector('.coracoes');
const emojis = ['❤️', '💖', '💕', '💗', '🌸'];
const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;

function criarCoracao(x) {
    const c = document.createElement('span');
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.left = (x ?? Math.random() * 100) + 'vw';
    c.style.fontSize = (14 + Math.random() * 22) + 'px';
    c.style.animationDuration = (7 + Math.random() * 8) + 's';
    box.appendChild(c);
    setTimeout(() => c.remove(), 16000);
}
if (!reduzir) setInterval(criarCoracao, 900);

// ===== Revelar elementos ao rolar =====
const alvos = document.querySelectorAll('article, section > div, section > h1, section > h2, section > ul, section > p, section > h4, form > h1, form > ul, form > div, form > p, blockquote');
alvos.forEach(el => el.classList.add('revelar'));
const obs = new IntersectionObserver((itens) => {
    itens.forEach(i => {
        if (i.isIntersecting) { i.target.classList.add('visivel'); obs.unobserve(i.target); }
    });
}, { threshold: 0.12 });
alvos.forEach(el => obs.observe(el));

// ===== Contador de tempo desde 29/05/2026 =====
const titulo = document.querySelector('main > h1');
const contador = document.createElement('p');
contador.className = 'contador';
contador.setAttribute('aria-live', 'off');
titulo.after(contador);
const inicio = new Date(2026, 4, 29, 18, 0, 0); // mês 4 = maio

function atualizarContador() {
    let diff = Date.now() - inicio.getTime();
    if (diff < 0) { contador.textContent = '💘 Nossa data especial ainda vai chegar...'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    contador.innerHTML = `💞 Desde aquele dia (29/05/2026): <b>${d}</b> dias, <b>${h}</b>h <b>${m}</b>min <b>${s}</b>s`;
}
atualizarContador();
setInterval(atualizarContador, 1000);

// ===== Barra de progresso de leitura + botão voltar ao topo =====
const barra = document.createElement('div');
barra.className = 'barra-progresso';
document.body.appendChild(barra);

const topo = document.createElement('button');
topo.className = 'btn-topo';
topo.type = 'button';
topo.textContent = '↑';
topo.setAttribute('aria-label', 'Voltar ao topo');
topo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(topo);

function aoRolar() {
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    topo.classList.toggle('mostrar', scrollY > 400);
}
addEventListener('scroll', aoRolar, { passive: true });
aoRolar();

// ===== Salvar respostas automaticamente (localStorage) =====
const campos = document.querySelectorAll('main input, main textarea');
const chave = (el, i) => 'resp_' + (el.type === 'radio' ? el.name : (el.id || el.className + i));

campos.forEach((el, i) => {
    const k = chave(el, i);
    const salvo = localStorage.getItem(k);
    if (salvo !== null) {
        if (el.type === 'radio') el.checked = (el.value === salvo);
        else el.value = salvo;
    }
    el.addEventListener('input', () => {
        if (el.type === 'radio') { if (el.checked) localStorage.setItem(k, el.value); }
        else localStorage.setItem(k, el.value);
    });
});

// ===== Botão de enviar com mensagem e chuva de corações =====
const secao = document.querySelectorAll('main > section');
const ultima = secao[secao.length - 1];
const enviar = document.createElement('button');
enviar.type = 'button';
enviar.textContent = 'Enviar minhas respostas 💌';
enviar.style.display = 'block';
enviar.style.margin = '1.5rem auto 0';
const retorno = document.createElement('p');
retorno.className = 'retorno';
retorno.setAttribute('role', 'status');
ultima.append(enviar, retorno);

// Cole aqui o endereço do seu formulário do Formspree (https://formspree.io/f/XXXXXXXX)
const FORM_ENDPOINT = 'https://formspree.io/f/xaeqapbe';

enviar.addEventListener('click', async () => {
    const form = document.querySelector('main form');
    if (!form.reportValidity()) return; // mostra os campos obrigatórios faltando

    if (FORM_ENDPOINT.includes('COLE_SEU')) {
        retorno.textContent = '⚠️ O envio por e-mail ainda não foi configurado (falta o endereço do Formspree).';
        retorno.classList.add('mostrar');
        return;
    }

    enviar.disabled = true;
    enviar.textContent = 'Enviando... 💌';
    try {
        const dados = new FormData(form);
        dados.append('_subject', 'Respostas da Princesa 💖');
        const resp = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            body: dados,
            headers: { Accept: 'application/json' }
        });
        if (!resp.ok) throw new Error('falha');

        const nome = (document.getElementById('nome')?.value || '').trim();
        retorno.textContent = nome ? `Respostas enviadas! Obrigado, ${nome}! 💖` : 'Respostas enviadas! Obrigado! 💖';
        if (!reduzir) for (let i = 0; i < 30; i++) setTimeout(() => criarCoracao(), i * 60);
        enviar.textContent = 'Enviado ✔';
    } catch (e) {
        retorno.textContent = 'Ops, não consegui enviar. Tente novamente em instantes. 💔';
        enviar.disabled = false;
        enviar.textContent = 'Enviar minhas respostas 💌';
    }
    retorno.classList.add('mostrar');
});


// ===== Efeito: clicar no título solta corações =====
titulo.style.cursor = 'pointer';
titulo.addEventListener('click', (e) => {
    if (reduzir) return;
    const x = (e.clientX / innerWidth) * 100;
    for (let i = 0; i < 8; i++) setTimeout(() => criarCoracao(x + (Math.random() * 10 - 5)), i * 80);
});

