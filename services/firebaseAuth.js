import { auth, database } from "../firebaseConfig";

export const signUp = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await database.collection("users").doc(user.uid).set({
      favorites: [],
      participations: [],
      email: user.email,
      createdAt: new Date(),
    });

    console.log("User document created in Firestore:", user.uid);
    return user;
  } catch (error) {
    console.log("Error during signUp:", error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    return await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.log("Error during signIn:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    return await auth.signOut();
  } catch (error) {
    console.log("Error during signOut:", error);
    throw error;
  }
};

export const sendPasswordReset = async (email) => {
  try {
    return await auth.sendPasswordResetEmail(email);
  } catch (error) {
    console.log("Error during password reset:", error);
    throw error;
  }
};
