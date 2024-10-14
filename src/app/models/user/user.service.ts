import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  default: User[] = [{
    id: 1,
    tipo: 'f',
    doc: '12313131231',
    nome: 'César Brancalhão',
    nomeF: '-',
    cep: '00000000',
    endereco: 'Rua Fantasia, 44',
    bairro: 'Jardim Carla',
    cidade: 'Foz do Iguaçu',
    telefone: '+5545000000000',
    email: 'cesarbrancalhao@gmail.com'
  }];

  users: User[] = (localStorage.getItem('users') !== null && String(localStorage.getItem('users')).length !== 2) ? JSON.parse(localStorage.getItem('users')!) : this.default;

  create(user: User) {
    const index = this.users.length;
    user.id = this.getnextId();
    this.users[index] = user;
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  delete(user: User) {
    this.users.splice(this.users.indexOf(user), 1);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  update(user: User) {
    const index = this.users.findIndex(item => item.id === user.id);
    this.users[index] = user;
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getall(): User[] {
    localStorage.setItem('users', JSON.stringify(this.users));
    return this.users;
  }

  reorderUsers(user: User) {
    this.users = this.users
      .map(uc => uc.id === user.id ? user : uc)
      .sort((a, uc) => uc.id - uc.id);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getUserById(id: number) {
    const index = this.users.findIndex(item => item.id === id);
    return this.users[index];
  }

  getnextId(): number {
    let highest = 0;
    this.users.forEach(function (item) {
      if (highest === 0) {
        highest = item.id;
      }
      if (highest < item.id) {
        highest = item.id;
      }
    });
    return highest + 1;
  }
}