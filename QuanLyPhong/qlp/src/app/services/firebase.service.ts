import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../models/user.model';

import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  query,updateDoc
} from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collectionData } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
} from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  fireStore = inject(AngularFirestore);
  utilSer = inject(UtilsService);
  storage = inject(AngularFireStorage);

  getAuth() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilSer.routerLink('/auth');
  }

  sendRecovery(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }
}
