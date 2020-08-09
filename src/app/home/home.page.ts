import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';
import { AddPage } from '../add/add.page'; 
import { AngularFireDatabase } from '@angular/fire/database';
import { OrderPipe } from 'ngx-order-pipe';
 


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  public goals = [];
  public tasks = []; 
  public taskPercentage: number; 
 
  constructor(
    public afDB: AngularFireDatabase,
    public alertController: AlertController,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private orderPipe: OrderPipe, 
  ) {
    this.getGoals();
    this.getTasks();
  }



  getGoals() {
    this.afDB.list('Goals/').snapshotChanges(['child_added', 'child_removed']).subscribe(goals => {
      this.goals = [];
      goals.forEach(goal => {
        this.goals.push({
          key: goal.key,
          order: goal.payload.exportVal().order,
          text: goal.payload.exportVal().text,
          color: goal.payload.exportVal().color
        });
        this.goals = this.orderPipe.transform(this.goals, 'order');
      });
    });

  }

  async editGoal(goal: any) {
    const alert = await this.alertController.create({
      header: 'Modifier un objectif',
      inputs: [
        {
          name: 'goal',
          type: 'text',
          value: goal.text,
          placeholder: 'Votre objectif'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            this.getGoals();
          }
        }, {
          text: 'Modifier',
          handler: data => {
            console.log('Objectifs: ' + data.goal);
            this.afDB.object('Goals/' + goal.key + '/text').set(data.goal);
            this.getGoals();
          }  
        }
      ]
    });
    await alert.present();
  }

  async openAddPage() {
    const modal = await this.modalController.create({
      component: AddPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  doReorder(ev: any) {
    ev.detail.complete();
    const draggedItem = this.goals.splice(ev.detail.from, 1) [0];
    this.goals.splice(ev.detail.to, 0, draggedItem);
    let count = 0;
    this.goals.forEach((element) => {
      this.afDB.object('Goals/' + element.key + '/order').set(count);
      console.log(element.text + ' -> ' + count);
      count++;
    });
  }

  getTasks() {
    this.afDB.list('Tasks/').snapshotChanges(['child_added', 'child_removed', 'child_changed']).subscribe(tasks => {
      this.tasks = [];
      tasks.forEach(task => {
        this.tasks.push({
          key: task.key,
          text: task.payload.exportVal().text,
          date: task.payload.exportVal().date,
          checked: task.payload.exportVal().checked,
          categorie: task.payload.exportVal().categorie,
          color: task.payload.exportVal().color
        });
      });
      this.calculPercentage();
    });
  }

  taskClicked(task: any) {
    this.afDB.list('Tasks/' + task.key).set('checked', task.checked);
    this.calculPercentage();
  }


  calculPercentage() {
    let count= 0;
    let checkedTask= 0;
    this.tasks.forEach(task => {
      if(task.checked == true){checkedTask++}
      count++; 
    });
    console.log('count: ', count, ', checkedTask: ', checkedTask);
    this.taskPercentage = (checkedTask / count) * 100;
  }

  deleteGoal(goal: any) {
    this.afDB.list('Goals/' + goal.key).remove();
  }

}







