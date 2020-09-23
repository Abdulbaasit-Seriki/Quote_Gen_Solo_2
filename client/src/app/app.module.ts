import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { ReviewComponent } from './review/review.component';
import { SignupComponent } from './signup/signup.component';
@NgModule({
  declarations: [AppComponent, UsersComponent, LoginComponent, ReviewComponent, SignupComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
    }), // ToastrModule added
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
