import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth, User } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserClass } from '../_model/user';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { USERS } from '../constants/collections';
import { Trainer } from '../_model/user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }
  async login(email: string, password: string) {
    var result = await this.afAuth.signInWithEmailAndPassword(email, password);
    return result;
    // this.router.navigate(['admin/list']);
  }
  async sendEmailVerification() {
    await (await this.afAuth.currentUser).sendEmailVerification();
    // this.router.navigate(['admin/verify-email']);
  }
  async register(email: string, password: string, data: UserClass | Trainer) {
    const result = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    return this.updateDocData(data, result.user.uid);
    // this.sendEmailVerification();
  }
  private updateDocData(data: UserClass | Trainer, uid: string) {
    console.log('data', data);
    return this.afs.doc(`${USERS}/${uid}`).set({});
  }
  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }
  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    // this.router.navigate(['admin/login']);
  }
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
  async loginWithGoogle() {
    await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
    // this.router.navigate(['admin/list']);
  }
  async remove() {
    console.log('this.user', this.user);
    await this.afs.doc(`${USERS}/${this.user.uid}`).delete();
    const u = await this.afAuth.currentUser;
    return u.delete();
  }
}
