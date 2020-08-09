import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  segmentValue ='goal';
  goal = {
    text:'',
    color: 'primary'
  };

  task = {
    text:'',
    categorie:'',
    color:'',
  };

  categories = [];
  countGoal: number;

  constructor(
    public modalController: ModalController,
    public afDB: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.getGoals();
  }


  addGoal() {
    console.log(this.goal.color);
    this.afDB.list('Goals/').push({
      text: this.goal.text,
      color: this.goal.color,
      order: this.countGoal
     });
    this.closeModal();
  }
  
  closeModal() {
    this.modalController.dismiss();
}

  getGoals() {
    this.afDB.list('Goals/').snapshotChanges(['child_added']).subscribe(goals => {
      this.countGoal = 0;
      goals.forEach(goal => {
        console.log('goal ' + this.countGoal + ': ' + goal.payload.exportVal().color);
        this.countGoal++;
        this.categories.push({
          text: goal.payload.exportVal().text,
          color: goal.payload.exportVal().color
        });
      });
      this.task.categorie = this.categories[0].text;
      this.task.color = this.categories[0].color;
    });
  }

  changeColor() {
    this.categories.forEach((cat) => {
      if(cat.text == this.task.categorie) {
        console.log('Couleur: ' + cat.color);
        this.task.color = cat.color;
      }
    });
  }

  addTask() {
    this.afDB.list('Tasks/').push({
      text: this.task.text,
      categorie: this.task.categorie,
      checked: false,
      date: new Date().getHours() + ':' + new Date().getMinutes(),
      color: this.task.color
     });
    this.closeModal();
  }

   
}




