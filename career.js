// Firebase Configuration (Replace with your Firebase config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// DOM Elements
const userInfoForm = document.getElementById("user-info-form");
const careerFieldsForm = document.getElementById("career-fields-form");
const resultsSection = document.getElementById("results");
const resultName = document.getElementById("result-name");
const resultAge = document.getElementById("result-age");
const resultGender = document.getElementById("result-gender");
const resultCity = document.getElementById("result-city");
const resultHobbies = document.getElementById("result-hobbies");
const resultInterests = document.getElementById("result-interests");
const suggestionsGrid = document.getElementById("suggestions-grid");
const roadmapSteps = document.getElementById("roadmap-steps");

// Event Listeners
if (userInfoForm) {
  userInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = "user@example.com"; // Replace with actual email input if needed
    const password = "password123"; // Replace with actual password input if needed
    signupUser(email, password);
  });
}

if (careerFieldsForm) {
  careerFieldsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedFields = Array.from(
      document.querySelectorAll("#career-fields-form input[type='checkbox']:checked")
    ).map((checkbox) => checkbox.value);
    saveCareerFields(selectedFields);
    showResults(selectedFields);
  });
}

// Sign Up User
function signupUser(email, password) {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        fullName: userInfoForm.fullname.value,
        age: userInfoForm.age.value,
        gender: userInfoForm.gender.value,
        city: userInfoForm.city.value,
        dob: userInfoForm.dob.value,
        hobbies: userInfoForm.hobbies.value,
        interests: userInfoForm.interests.value,
      };
      // Save user data to Firestore
      db.collection("users")
        .doc(user.uid)
        .set(userData)
        .then(() => {
          alert("Signup successful!");
          showSection("career-fields");
        })
        .catch((error) => {
          alert("Error saving user data: " + error.message);
        });
    })
    .catch((error) => {
      alert("Error during signup: " + error.message);
    });
}

// Save Selected Career Fields to Firestore
function saveCareerFields(selectedFields) {
  const user = auth.currentUser;
  if (user) {
    db.collection("users")
      .doc(user.uid)
      .update({
        careerFields: selectedFields,
      })
      .then(() => {
        console.log("Career fields saved successfully!");
      })
      .catch((error) => {
        alert("Error saving career fields: " + error.message);
      });
  }
}

// Show Results
function showResults(selectedFields) {
  const user = auth.currentUser;
  if (user) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          // Display Background Summary
          resultName.textContent = userData.fullName;
          resultAge.textContent = userData.age;
          resultGender.textContent = userData.gender;
          resultCity.textContent = userData.city;
          resultHobbies.textContent = userData.hobbies;
          resultInterests.textContent = userData.interests;

          // Display Career Suggestions
          const suggestions = getCareerSuggestions(selectedFields);
          suggestionsGrid.innerHTML = suggestions
            .map(
              (suggestion) => `
              <div class="suggestion-card">
                <h3>${suggestion.title}</h3>
                <p>${suggestion.description}</p>
              </div>
            `
            )
            .join("");

          // Display Career Roadmap
          const roadmap = getCareerRoadmap(selectedFields);
          roadmapSteps.innerHTML = roadmap
            .map(
              (step) => `
              <div>
                <h4>${step.title}</h4>
                <p>${step.description}</p>
              </div>
            `
            )
            .join("");

          // Show Results Section
          showSection("results");
        } else {
          alert("User data not found!");
        }
      })
      .catch((error) => {
        alert("Error fetching user data: " + error.message);
      });
  }
}

// Get Career Suggestions
function getCareerSuggestions(fields) {
  const suggestions = [];
  if (fields.includes("arts")) {
    suggestions.push(
      { title: "Artist", description: "Create visual art, paintings, or sculptures." },
      { title: "Graphic Designer", description: "Design visual content for digital and print media." }
    );
  }
  if (fields.includes("commerce")) {
    suggestions.push(
      { title: "Accountant", description: "Manage financial records and transactions." },
      { title: "Financial Analyst", description: "Analyze financial data to guide business decisions." }
    );
  }
  if (fields.includes("science")) {
    suggestions.push(
      { title: "Scientist", description: "Conduct research in various scientific fields." },
      { title: "Doctor", description: "Diagnose and treat medical conditions." }
    );
  }
  if (fields.includes("finance")) {
    suggestions.push(
      { title: "Banker", description: "Work in banks or financial institutions." },
      { title: "Investment Banker", description: "Help companies raise capital and provide financial advice." }
    );
  }
  if (fields.includes("technology")) {
    suggestions.push(
      { title: "Software Developer", description: "Build and maintain software applications." },
      { title: "Data Scientist", description: "Analyze and interpret complex data." }
    );
  }
  return suggestions;
}

// Get Career Roadmap
function getCareerRoadmap(fields) {
  const roadmap = [];
  if (fields.includes("arts")) {
    roadmap.push(
      { title: "Step 1: Education", description: "Pursue a degree in Fine Arts or Design." },
      { title: "Step 2: Build Portfolio", description: "Create a portfolio showcasing your work." },
      { title: "Step 3: Internship", description: "Gain experience through internships or freelance projects." }
    );
  }
  if (fields.includes("finance")) {
    roadmap.push(
      { title: "Step 1: Education", description: "Pursue a degree in Finance, Economics, or Business." },
      { title: "Step 2: Certification", description: "Obtain certifications like CFA or CPA." },
      { title: "Step 3: Internship", description: "Gain experience through internships in banks or financial firms." }
    );
  }
  if (fields.includes("technology")) {
    roadmap.push(
      { title: "Step 1: Education", description: "Pursue a degree in Computer Science or IT." },
      { title: "Step 2: Build Projects", description: "Create a portfolio of software projects." },
      { title: "Step 3: Internship", description: "Gain experience through internships or open-source contributions." }
    );
  }
  return roadmap;
}

// Show/Hide Sections
function showSection(sectionId) {
  document.querySelectorAll("section").forEach((section) => {
    section.style.display = section.id === sectionId ? "block" : "none";
  });
}

// Show User Info Section by Default
showSection("user-info");