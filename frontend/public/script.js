function validarMetrica(valor) {
  if (valor === null || valor === undefined || valor === '') return 'N/A';
  const num = Number(valor);
  if (isNaN(num) || num < 0) return 'N/A';
  return String(num);
}

function atualizarDados(data) {
  document.getElementById('nome').textContent = data.nome || '';
  document.getElementById('desc').textContent = data.descricao || '';
  document.getElementById('endereco').textContent = data.endereco || '';
  document.getElementById('telefone').textContent = data.telefone || '';
  document.getElementById('email').textContent = data.email || '';
  document.getElementById('colaboradores').textContent = validarMetrica(data.colaboradores);
  document.getElementById('entregas').textContent = validarMetrica(data.entregasMes);
}

async function carregar() {
  try {
    const res = await fetch('http://3.15.28.93:30001/api/empresa');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    atualizarDados(data);
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { atualizarDados, validarMetrica, carregar };
} else {
  carregar();
}
