// Importa Firebase desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Tu configuración de Firebase (obténla desde la consola de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyDasaNhd0OqhoVeXTM-dWt4Ea0FS8dWq30",
    authDomain: "pitahaya-protector-70a81.firebaseapp.com",
    projectId: "pitahaya-protector-70a81",
    storageBucket: "pitahaya-protector-70a81.firebasestorage.app",
    messagingSenderId: "84067855855",
    appId: "1:84067855855:web:06903ca2d9eee989079a1a",
    measurementId: "G-KN14BHCBJ7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para agregar un lote a Firestore
async function agregarLote() {
  try {
    const docRef = await addDoc(collection(db, "lotes"), {
      numero: 1,
      area: 500,
      fechaSiembra: new Date(),
      estado: "En desarrollo",
      cantidadPlantas: 100
    });
    console.log("Lote agregado con ID:", docRef.id);
  } catch (e) {
    console.error("Error al agregar el lote: ", e);
  }
}

// Llama a la función para agregar un lote (puedes cambiar cuándo y cómo llamarla)
agregarLote();