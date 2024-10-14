export class User {
    id: number;
    tipo: string;
    doc: string;
    nome: string;
    nomeF?: string;
    cep: string;
    endereco: string;
    bairro: string;
    cidade: string;
    telefone: string;
    email: string;

    constructor() {
        this.id = 0;
        this.tipo = '';
        this.doc = '';
        this.nome = '';
        this.nomeF = '';
        this.cep = '';
        this.endereco = '';
        this.bairro = '';
        this.cidade = '';
        this.telefone = '';
        this.email = '';
    }
}