// Importa Firebase desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de Firebase
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
const auth = getAuth(app);
const db = getFirestore(app);

// Función para validar email
function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// Función para validar contraseña (mínimo 6 caracteres)
function validatePassword(password) {
    return password.length >= 6;
}

// Función para registrar usuario con Firestore
async function registerUser(email, password, firstName, lastName) {
    if (!validateEmail(email)) {
        return { success: false, message: "Email no válido." };
    }
    if (!validatePassword(password)) {
        return { success: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            email,
            createdAt: new Date(),
            emailVerified: false
        });

        return { success: true, message: "Usuario registrado. Verifica tu correo." };
    } catch (error) {
        console.error("Error en el registro:", error);
        return { success: false, message: error.message };
    }
}

// Función para iniciar sesión
async function signInUser(email, password) {
    if (!validateEmail(email) || !validatePassword(password)) {
        return { success: false, message: "Credenciales inválidas." };
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
            await updateDoc(doc(db, "users", user.uid), { emailVerified: true });
        }

        return { success: true, user };
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        return { success: false, message: error.message };
    }
}

// Función para agregar un lote a Firestore
async function agregarLote(numero, area, fechaSiembra, estado, cantidadPlantas) {
    try {
        const docRef = await addDoc(collection(db, "lotes"), {
            numero,
            area,
            fechaSiembra,
            estado,
            cantidadPlantas
        });
        console.log("Lote agregado con ID:", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error al agregar el lote:", error);
        return { success: false, message: error.message };
    }
}

// Ejemplo de uso (puedes cambiar cuándo y cómo llamarlas)
agregarLote(1, 500, new Date(), "En desarrollo", 100);

// Exportar funciones
export { auth, db, registerUser, signInUser, agregarLote };
