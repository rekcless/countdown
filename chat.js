import { db } from "./firebase.js";
import {
  collection, doc, getDoc, setDoc, updateDoc, arrayUnion,
  query, orderBy, onSnapshot, addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===== ELEMENT =====
const usernameAuth = document.getElementById("usernameAuth");
const passwordAuth = document.getElementById("passwordAuth");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const friendSection = document.getElementById("friendSection");
const searchUser = document.getElementById("searchUser");
const addFriendBtn = document.getElementById("addFriendBtn");
const friendList = document.getElementById("friendList");

const chatSection = document.getElementById("chatSection");
const chatWithName = document.getElementById("chatWithName");
const chatBox = document.getElementById("chatBox");
const chatMessage = document.getElementById("chatMessage");
const sendChatBtn = document.getElementById("sendChatBtn");

let currentUser = null;
let currentChatFriend = null;

// ===== CEK SESSION LOCALSTORAGE =====
const savedUser = localStorage.getItem("currentUser");
if (savedUser) {
  currentUser = savedUser;
  document.getElementById("authSection").style.display = "none";
  friendSection.style.display = "block";
  loadFriends();
}

// ===== REGISTER =====
registerBtn.onclick = async () => {
  const username = usernameAuth.value.trim();
  const password = passwordAuth.value.trim();
  if (!username || !password){ alert("Isi semua!"); return; }

  const userDoc = doc(db, "users", username);
  const snap = await getDoc(userDoc);
  if (snap.exists()){ alert("Username sudah dipakai!"); return; }

  await setDoc(userDoc, {username, password, friends: []});
  alert("Register sukses! Silahkan login.");
};

// ===== LOGIN =====
loginBtn.onclick = async () => {
  const username = usernameAuth.value.trim();
  const password = passwordAuth.value.trim();
  if (!username || !password){ alert("Isi semua!"); return; }

  const snap = await getDoc(doc(db, "users", username));
  if (!snap.exists() || snap.data().password !== password){ alert("Username/password salah"); return; }

  currentUser = username;
  localStorage.setItem("currentUser", username); // simpan session
  document.getElementById("authSection").style.display = "none";
  friendSection.style.display = "block";
  loadFriends();
};

// ===== LOAD FRIENDS =====
async function loadFriends() {
  friendList.innerHTML = "";
  const snap = await getDoc(doc(db, "users", currentUser));
  const friends = snap.data().friends || [];
  friends.forEach(f=>{
    const li = document.createElement("li");
    li.textContent = f;
    li.onclick = ()=>{ openChat(f); }
    friendList.appendChild(li);
  });
}

// ===== ADD FRIEND =====
addFriendBtn.onclick = async ()=>{
  const friendName = searchUser.value.trim();
  if(!friendName || friendName===currentUser){ alert("Username tidak valid"); return; }

  const friendSnap = await getDoc(doc(db,"users",friendName));
  if(!friendSnap.exists()){ alert("User tidak ditemukan"); return; }

  await updateDoc(doc(db,"users",currentUser),{friends: arrayUnion(friendName)});
  alert(friendName+" ditambahkan!");
  searchUser.value="";
  loadFriends();
};

// ===== OPEN CHAT =====
function openChat(friend){
  currentChatFriend = friend;
  chatWithName.textContent = friend;
  chatSection.style.display="block";
  loadChat();
}

// ===== LOAD CHAT REALTIME =====
function loadChat(){
  chatBox.innerHTML="";
  const convoId = [currentUser,currentChatFriend].sort().join("_");
  const messagesCol = collection(db, "conversations", convoId, "messages");
  const q = query(messagesCol, orderBy("createdAt"));

  onSnapshot(q,snap=>{
    chatBox.innerHTML="";
    snap.docs.forEach(d=>{
      const data = d.data();
      const div = document.createElement("div");
      div.className = "message "+(data.sender===currentUser?"self":"other");
      div.textContent = data.text; // ✅ Hanya isi pesan
      chatBox.appendChild(div);
    });

    // scroll otomatis smooth
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: "smooth"
    });
  });
}

// ===== SEND MESSAGE =====
sendChatBtn.onclick=async ()=>{
  const text = chatMessage.value.trim();
  if(!text || !currentChatFriend) return;

  const convoId = [currentUser,currentChatFriend].sort().join("_");
  await addDoc(collection(db,"conversations",convoId,"messages"),{
    sender: currentUser,
    text,
    createdAt: new Date()
  });
  chatMessage.value="";
};
