class Turma {
  professor;
  nomeCurso;
  #alunos = [];

  constructor(professor, nomeCurso) {
    this.professor = professor;
    this.nomeCurso = nomeCurso;
  }

  get alunos() {
    return [...this.#alunos];
  }

  adicionarAluno(aluno) {
    this.#alunos.push(aluno);
  }
}