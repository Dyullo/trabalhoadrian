async function carregar() {
  const res = await fetch('http://18.116.164.51:3001/api/empresa');
  const data = await res.json();

  document.getElementById('nome').innerText = data.nome;
  document.getElementById('desc').innerText = data.descricao;
  document.getElementById('endereco').innerText = data.endereco;
  document.getElementById('telefone').innerText = data.telefone;
  document.getElementById('email').innerText = data.email;
  document.getElementById('colaboradores').innerText = data.colaboradores;
  document.getElementById('entregas').innerText = data.entregasMes;
}

carregar();