class Aluno {
  // Notas privadas: só podem ser lidas/alteradas via get e set
  #nota1;
  #nota2;
  #nota3;
  nome;

  constructor(nome, nota1, nota2, nota3) {
    this.nome = nome;
    this.nota1 = nota1;
    this.nota2 = nota2;
    this.nota3 = nota3;
  }

  static validarNota(valor) {
    const texto = String(valor).trim().replace(',', '.');
    const n = Number(texto);

    if (texto === '' || Number.isNaN(n) || n < 0 || n > 10) {
      throw new RangeError('A nota deve ser um número entre 0 e 10.');
    }

    return n;
  }

  get nota1() {
    return this.#nota1;
  }

  set nota1(valor) {
    this.#nota1 = Aluno.validarNota(valor);
  }

  get nota2() {
    return this.#nota2;
  }

  set nota2(valor) {
    this.#nota2 = Aluno.validarNota(valor);
  }

  get nota3() {
    return this.#nota3;
  }

  set nota3(valor) {
    this.#nota3 = Aluno.validarNota(valor);
  }

  gerarMedia() {
    return (this.#nota1 + this.#nota2 + this.#nota3) / 3;
  }

  gerarEstado() {
    const media = this.gerarMedia();

    if (media >= 6) {
      return 'Aprovado';
    } else if (media >= 3) {
      return 'Recuperação';
    }

    return 'Reprovado';
  }

  get media() {
    return this.gerarMedia();
  }

  get estado() {
    return this.gerarEstado();
  }
}