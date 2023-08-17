import { initializeApp } from 'firebase/app';
import { getAuth,updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import base64 from 'react-native-base64';
import config from '../../firebase.json';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore();
const storage = getStorage(app);


export const signInGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Google 로그인 에러: ", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL } = auth.currentUser;
  return { uid, name : displayName, email, photoUrl : photoURL};
};

export const updateUserPhoto = async photoUrl => {
  const user = auth.currentUser;
  const storageUrl = photoUrl.startsWith('https')
  ? photoUrl : await uploadImage(photoUrl);
  return { name : user.displayName, email : user.email, photoUrl: user.photoURL};
}


export const login = async ({email, password}) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const logout = async () => {
  return await auth.signOut();
};


export const uploadImage = async uri => {
 
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError('Network request failed'));
      console.log(e);
    };
    
     xhr.responseType = 'blob';
     xhr.open('GET', uri, true);
     xhr.send(); //여기 막아봄
    
  });
 
  //console.log(blob);
  const user = auth.currentUser;

  const storageRef = ref(storage, `/profile/${user.uid}/photo.png`);
  //console.log(blob);
  const snapshot = await uploadBytes(storageRef, blob); 
  const imageURL = await getDownloadURL(snapshot.ref);
 
  blob.close();
  //console.log(imageURL);
  return imageURL;

  // const imageRef = ref(storage, `profileImages/${imageName}`);
  // const cleanedBase64 = base64String.replace('data:image/jpeg;base64,', '');
  // await uploadString(imageRef, cleanedBase64, 'base64');
  // const imageUrl = await getDownloadURL(imageRef);
  // return imageUrl;
};

export const signup = async ({name, email, password, imageUri}) => {
  
  console.log('signup 함수 호출됨', name, email, password, imageUri);
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const storageUrl = imageUri.startsWith('https')
  ? imageUri
  :await uploadImage(imageUri);
  
  await updateProfile(user, {
    displayName: name,
    photoURL : storageUrl,
  });

  return user;
  //const imageUrl = await uploadImage(imageUri, `${user.uid}_profile_pic.jpg`);
  //await setDoc(doc(db, 'users', user.uid), { name, email, imageUrl });
  //return { user, imageUrl };
};
