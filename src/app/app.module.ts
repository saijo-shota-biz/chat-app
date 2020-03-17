import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';

import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { AccountComponent } from './account/account.component';

import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    BottomNavComponent,
    HomeComponent,
    ChatComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
