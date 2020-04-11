import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Player } from '../interfaces/player';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  // Declaro una Lista de Players
  private playersDb: AngularFireList<Player>;

  // Recibo en el constructor una base de datos
  constructor(private db: AngularFireDatabase) {
    // Accedemos a la base de datos de FireBase(db)
    // Dentro de la base de datos accedemos a la lista de jugadores (db.list('/players'))
    // Decicmos que la colección de jugadores (ref) la ordene por nombre(orderByChild)
    // Por último me regresa una colección de jugadores ordenada por nombre
    this.playersDb = this.db.list('/players', ref => ref.orderByChild('name'));
  }

  getPlayers(): Observable<Player[]> {
    // this.platersDB es la base de datos de los jugadores
    // snapshotChanges obtiene un snapshot de la información en el momento en el que la solicitamos
    // Obtenemos los datos con la key representativa de firebase
    // Pipe me permite realizar modificaciones cuando obtengamos la información
    // Devolvemos un objeto que tiene la key junto con la informacióń que viene dentro de playload
    return this.playersDb.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ $key: c.payload.key, ...c.payload.val()}));
      })
    );
  }

  // Agregamos un jugador a la base de datos
  addPlayer(player: Player) {
    return this.playersDb.push(player);
  }

  // Borramos un jugador de al base de datos
  deletePlayer(id: string) {
    this.db.list('/players').remove(id);
  }

  // Actualizamos la información
  editPlayer(newPlayerData) {
    const $key = newPlayerData.$key;
    // Eliminamos la key porque firebase no acepta que el elemento contenga una key
    // Tanto cuando hacemos un update o cuando agregamos un nuevo elemento
    // Es por eso que en el archivo interfaces-player.ts pusimos key como opcional
    delete(newPlayerData.$key);
    // $key: key del elemento que queremos actualizar
    // newPlayerData: nueva información que queremos actualizar
    this.db.list('/players').update($key, newPlayerData);
  }
}
