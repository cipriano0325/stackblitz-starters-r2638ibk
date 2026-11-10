let turmas = [];
let alunoEmEdicao = null;

// ---------- Utilitários ----------
function criar(tag, texto, classe) {
  const e = document.createElement(tag);
  if (texto !== undefined) e.textContent = texto;
  if (classe) e.className = classe;
  return e;
}

function formatar(numero, casas) {
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

function classeDaSituacao(estado) {
  if (estado === 'Aprovado') return 'situacao-aprovado';
  if (estado === 'Recuperação') return 'situacao-recuperacao';
  return 'situacao-reprovado';
}

// ---------- Abas ----------
function mostrarAba(nome) {
  for (const aba of ['turmas', 'cadastrar', 'listar']) {
    const ativa = aba === nome;
    document.getElementById('btn-' + aba).classList.toggle('active', ativa);
    document.getElementById('tab-' + aba).classList.toggle('active', ativa);
  }

  if (nome === 'listar') {
    alunoEmEdicao = null;
    listar();
  }
}

// ---------- Turmas ----------
function salvarTurma() {
  const professor = document.getElementById('professor').value.trim();
  const curso = document.getElementById('curso').value.trim();

  if (professor === '' || curso === '') {
    alert('Preencha o professor e o nome do curso.');
    return;
  }

  turmas.push(new Turma(professor, curso));

  document.getElementById('professor').value = '';
  document.getElementById('curso').value = '';

  listarTurmas();
  atualizarSelectDeTurmas();
  alert('Turma cadastrada');
}

function listarTurmas() {
  const ul = document.getElementById('lista-turmas');
  ul.replaceChildren();

  if (turmas.length === 0) {
    ul.appendChild(criar('li', 'Nenhuma turma cadastrada ainda.'));
    return;
  }

  for (const t of turmas) {
    const qtd = t.alunos.length;
    const texto = `${t.nomeCurso} - Prof. ${t.professor} (${qtd} ${qtd === 1 ? 'aluno' : 'alunos'})`;
    ul.appendChild(criar('li', texto));
  }
}

function atualizarSelectDeTurmas() {
  const select = document.getElementById('turma');
  const semTurma = turmas.length === 0;
  const anterior = select.value;

  select.replaceChildren();

  turmas.forEach((t, i) => {
    const op = criar('option', `${t.nomeCurso} - Prof. ${t.professor}`);
    op.value = String(i);
    select.appendChild(op);
  });

  if (!semTurma && anterior !== '' && Number(anterior) < turmas.length) {
    select.value = anterior;
  }

  document.getElementById('aviso-sem-turma').hidden = !semTurma;

  for (const id of ['turma', 'nome', 'n1', 'n2', 'n3', 'btn-salvar-aluno']) {
    document.getElementById(id).disabled = semTurma;
  }
}

// ---------- Alunos ----------
function salvarAluno() {
  if (turmas.length === 0) {
    alert('Cadastre uma turma antes de cadastrar alunos.');
    return;
  }

  const nome = document.getElementById('nome').value.trim();

  if (nome === '') {
    alert('Informe o nome do aluno.');
    return;
  }

  let aluno;

  try {
    aluno = new Aluno(
      nome,
      document.getElementById('n1').value,
      document.getElementById('n2').value,
      document.getElementById('n3').value
    );
  } catch (erro) {
    alert(erro.message);
    return;
  }

  const turma = turmas[Number(document.getElementById('turma').value)];
  turma.adicionarAluno(aluno);

  for (const id of ['nome', 'n1', 'n2', 'n3']) {
    document.getElementById(id).value = '';
  }

  listarTurmas();
  alert('Aluno cadastrado');
}

function listar() {
  const tbody = document.getElementById('alunos');
  tbody.replaceChildren();

  let total = 0;

  for (const turma of turmas) {
    for (const aluno of turma.alunos) {
      total++;

      tbody.appendChild(
        aluno === alunoEmEdicao
          ? montarLinhaEdicao(aluno, turma)
          : montarLinha(aluno, turma)
      );
    }
  }

  if (total === 0) {
    const tr = criar('tr');
    const td = criar('td', 'Nenhum aluno cadastrado ainda.');
    td.colSpan = 8;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

function montarLinha(aluno, turma) {
  const tr = criar('tr');

  tr.appendChild(criar('td', aluno.nome));
  tr.appendChild(criar('td', turma.nomeCurso));
  tr.appendChild(criar('td', formatar(aluno.nota1, 2)));
  tr.appendChild(criar('td', formatar(aluno.nota2, 2)));
  tr.appendChild(criar('td', formatar(aluno.nota3, 2)));
  tr.appendChild(criar('td', formatar(aluno.media, 1)));
  tr.appendChild(criar('td', aluno.estado, classeDaSituacao(aluno.estado)));

  const acoes = criar('td');
  const btn = criar('button', 'Editar', 'btn-tabela');

  btn.onclick = () => {
    alunoEmEdicao = aluno;
    listar();
  };

  acoes.appendChild(btn);
  tr.appendChild(acoes);

  return tr;
}

function montarLinhaEdicao(aluno, turma) {
  const tr = criar('tr', undefined, 'linha-edicao');

  tr.appendChild(criar('td', aluno.nome));
  tr.appendChild(criar('td', turma.nomeCurso));

  const campos = [aluno.nota1, aluno.nota2, aluno.nota3].map((nota, i) => {
    const input = criar('input', undefined, 'input-nota');

    input.type = 'text';
    input.inputMode = 'decimal';
    input.value = String(nota).replace('.', ',');
    input.setAttribute('aria-label', `Nota ${i + 1} de ${aluno.nome}`);

    const td = criar('td');
    td.appendChild(input);
    tr.appendChild(td);

    return input;
  });

  tr.appendChild(criar('td', formatar(aluno.media, 1)));
  tr.appendChild(criar('td', aluno.estado, classeDaSituacao(aluno.estado)));

  const acoes = criar('td');

  const salvar = criar('button', 'Salvar', 'btn-tabela btn-tabela-salvar');
  salvar.onclick = () => salvarEdicao(aluno, campos);

  const cancelar = criar('button', 'Cancelar', 'btn-tabela');

  cancelar.onclick = () => {
    alunoEmEdicao = null;
    listar();
  };

  acoes.appendChild(salvar);
  acoes.appendChild(cancelar);
  tr.appendChild(acoes);

  return tr;
}

function salvarEdicao(aluno, campos) {
  try {
    campos.forEach((c) => Aluno.validarNota(c.value));
  } catch (erro) {
    alert(erro.message);
    return;
  }

  aluno.nota1 = campos[0].value;
  aluno.nota2 = campos[1].value;
  aluno.nota3 = campos[2].value;

  alunoEmEdicao = null;
  listar();
}

// Estado inicial das telas
atualizarSelectDeTurmas();