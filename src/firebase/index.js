const { Timestamp } = require("firebase-admin/firestore");
const serviceAccount = require("../../beacon-b8c17-firebase-adminsdk-fbsvc-67bf515432.json");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com",
});

const db = admin.firestore();

// this function add a new birthday
async function addBirthday(userId, birthdayDate) {
  const month = birthdayDate.getMonth() + 1;
  const day = birthdayDate.getDate();
  await db.collection("birthdays").doc(userId).set({ month, day, userId });
}

// this function gets the user birthday based on userId
async function getBirthday(userId) {
  const birthdayRef = db.collection("birthdays").doc(userId);
  const birthday = await birthdayRef.get();

  return birthday;
}

// this functiom checks if the user's birthday already exists
async function isUserBirthdayExists(userId) {
  const birthday = await getBirthday(userId);
  return birthday.exists;
}

async function getUsersBirthday() {
  const birthdayRef = db.collection("birthdays");

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const snapshot = await birthdayRef
    .where("month", "==", month)
    .where("day", "==", day)
    .get();
  return snapshot;
}

module.exports = { addBirthday, isUserBirthdayExists, getUsersBirthday };
