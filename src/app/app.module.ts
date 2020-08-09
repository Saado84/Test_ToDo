import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AddPageModule } from './add/add.module'; 
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

export const firebaseConfig = {
  apiKey: "AIzaSyApyGUKkrj6ky7EYPS7nTuTk_dEblOslrI",
  authDomain: "todolist-3bf9f.firebaseapp.com",
  databaseURL:"https://todolist-3bf9f.firebaseio.com",
  projectID: "todolist-3bf9f",
  storageBucket: "todolist-3bf9f.appspot.com",
  messagingSenderID: "660644127673",
  appID: "1:660644127673:web:85e71f1ffa5d1a3d8e8c68" 
}; 


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(firebaseConfig), AngularFireDatabaseModule, AddPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

