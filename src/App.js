import './App.css';
import React, { useState,useRef } from 'react';

import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyDWDbgKxb4vjkhe_F9EiswJjYjsgIlfoZQ",
  authDomain: "superchat-e1a58.firebaseapp.com",
  projectId: "superchat-e1a58",
  storageBucket: "superchat-e1a58.appspot.com",
  messagingSenderId: "13543110801",
  appId: "1:13543110801:web:657088ce9eac4283aba730",
  measurementId: "G-097D4TZSQD"

})

const auth = firebase.auth();
const firestore = firebase.firestore()

const App = () => {

  const [user] = useAuthState(auth)


  return (
    <div className="App">
      {/* <header className="App-header">
        GG
      </header> */}
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

const SignIn = () =>{
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

const SignOut = () =>{
  return auth.currentUser && (

    <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}

const ChatRoom = () =>{

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) =>{
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' })

  }

  return(
    <>
      <SignOut/>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      
      <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} />
          <button type="submit">Send</button>

      </form>
    </>
  )

}

const ChatMessage = (props) =>{
  const { text, uid, photoURL } = props.message;
  
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="profile"/>
      <p>{text}</p>
    </div>
  )
}

export default App;
