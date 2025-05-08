// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9ARHMsFo_Jf96upuclmj5KOranR_zG8Q",
    authDomain: "mstu5013-94432.firebaseapp.com",
    databaseURL: "https://mstu5013-94432.firebaseio.com",
    projectId: "mstu5013-94432"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const roundsRef = db.collection("rounds");
const coursesRef = db.collection("courses");
const ratingsRef = db.collection("ratings");

const App = Vue.createApp({
    components: {
        'courses-component': CoursesComponent
    },
    data() {
        return {
            // Authentication related states
            authState: "login", // Values: "login", "register", "authenticated"
            email: "",
            password: "",
            confirmPassword: "",
            authError: "",
            currentUser: null,

            // App data
            courses: [],
            currentPage: "courses",
            currentPair: [0, 1],
            showForm: false,
            selectedRounds: [],
            rounds: [],
            courseRatings: [],
            newRound: {
                courseName: "",
                golferName: "",
                parInput: "",
                scoresInput: "",
                par: [],
                scores: []
            },
            // Add new data properties for editing
            editingRound: null,
            editForm: {
                courseName: "",
                golferName: "",
                parInput: "",
                scoresInput: ""
            }
        };
    },
    methods: {
        // Authentication methods
        register() {
            this.authError = "";
            if (this.password !== this.confirmPassword) {
                this.authError = "Passwords do not match";
                return;
            }

            auth.createUserWithEmailAndPassword(this.email, this.password)
                .then((userCredential) => {
                    this.email = "";
                    this.password = "";
                    this.confirmPassword = "";
                    this.currentUser = userCredential.user;
                    this.authState = "authenticated";
                })
                .catch((error) => {
                    this.authError = "Registration failed: " + error.message;
                });
        },

        login() {
            this.authError = "";
            auth.signInWithEmailAndPassword(this.email, this.password)
                .then((userCredential) => {
                    this.email = "";
                    this.password = "";
                    this.currentUser = userCredential.user;
                    this.authState = "authenticated";
                })
                .catch((error) => {
                    this.authError = "Login failed: " + error.message;
                });
        },

        logout() {
            auth.signOut().then(() => {
                this.currentUser = null;
                this.authState = "login";
                this.rounds = [];
                this.courseRatings = [];
            });
        },

        toggleAuthState() {
            this.authError = "";
            this.authState = this.authState === "login" ? "register" : "login";
        },

        // Course comparison methods
        getNewPair() {
            const first = Math.floor(Math.random() * this.courses.length);
            let second;
            do {
                second = Math.floor(Math.random() * this.courses.length);
            } while (second === first);

            this.currentPair = [first, second];
        },

        // Rating methods
        submitRating(rating) {
            if (this.currentUser) {
                ratingsRef.add({
                    courseName: rating.courseName,
                    stars: rating.stars,
                    comment: rating.comment,
                    userId: this.currentUser.uid,
                    date: new Date().toISOString().split("T")[0]
                });
            }
        },

        // Tour methods
        async addRound() {
            try {
                this.newRound.par = this.newRound.parInput.split(",").map(Number);
                this.newRound.scores = this.newRound.scoresInput.split(",").map(Number);

                if (!this.newRound.courseName || !this.newRound.golferName || 
                    !this.newRound.par.length || !this.newRound.scores.length) {
                    alert("Please fill in all fields");
                    return;
                }

                await roundsRef.add({
                    courseName: this.newRound.courseName,
                    golferName: this.newRound.golferName,
                    par: this.newRound.par,
                    scores: this.newRound.scores,
                    timestamp: new Date(),
                    userId: this.currentUser.uid
                });

                this.newRound.courseName = "";
                this.newRound.golferName = "";
                this.newRound.parInput = "";
                this.newRound.scoresInput = "";
                this.showForm = false;

                alert("Round added successfully!");
            } catch (error) {
                console.error("Error adding round:", error);
                alert("Error adding round. Please try again.");
            }
        },

        // Add new methods for editing rounds
        startEditing(round) {
            this.editingRound = round;
            this.editForm = {
                courseName: round.courseName,
                golferName: round.golferName,
                parInput: round.par.join(','),
                scoresInput: round.scores.join(',')
            };
        },
        
        async saveEdit() {
            try {
                if (!this.editingRound) return;

                const par = this.editForm.parInput.split(",").map(Number);
                const scores = this.editForm.scoresInput.split(",").map(Number);

                if (!this.editForm.courseName || !this.editForm.golferName || 
                    !par.length || !scores.length) {
                    alert("Please fill in all fields");
                    return;
                }

                await roundsRef.doc(this.editingRound.id).update({
                    courseName: this.editForm.courseName,
                    golferName: this.editForm.golferName,
                    par: par,
                    scores: scores,
                    timestamp: new Date()
                });

                this.editingRound = null;
                this.editForm = {
                    courseName: "",
                    golferName: "",
                    parInput: "",
                    scoresInput: ""
                };

                alert("Round updated successfully!");
            } catch (error) {
                console.error("Error updating round:", error);
                alert("Error updating round. Please try again.");
            }
        },

        cancelEdit() {
            this.editingRound = null;
            this.editForm = {
                courseName: "",
                golferName: "",
                parInput: "",
                scoresInput: ""
            };
        }
    },
    computed: {
        overUnder() {
            return this.rounds.map((round) => {
                const parSum = round.par.reduce((acc, val) => acc + val, 0);
                const scoreSum = round.scores.reduce((acc, val) => acc + val, 0);
                return scoreSum - parSum;
            });
        },
        totalRounds() {
            return this.rounds.length;
        },
        // AI assistance employed to set up average over under calculation
        averageOverUnder() {
            if (this.rounds.length === 0) return { score: 0, golfer: '', course: '' };
            
            let recordRound = this.rounds[0];
            let lowestOverUnder = Infinity;

            this.rounds.forEach(round => {
                const parSum = round.par.reduce((a, b) => a + b, 0);
                const scoreSum = round.scores.reduce((a, b) => a + b, 0);
                const overUnder = scoreSum - parSum;

                if (overUnder < lowestOverUnder) {
                    lowestOverUnder = overUnder;
                    recordRound = round;
                }
            });

            return {
                score: lowestOverUnder,
                golfer: recordRound.golferName,
                course: recordRound.courseName
            };
        },
        leaderboard() {
            const golferStats = {};

            this.rounds.forEach((round) => {
                if (!golferStats[round.golferName]) {
                    golferStats[round.golferName] = {
                        name: round.golferName,
                        totalPar: 0,
                        totalScore: 0,
                        overUnder: 0
                    };
                }

                const parSum = round.par.reduce((a, b) => a + b, 0);
                const scoreSum = round.scores.reduce((a, b) => a + b, 0);

                golferStats[round.golferName].totalPar += parSum;
                golferStats[round.golferName].totalScore += scoreSum;
                golferStats[round.golferName].overUnder += (scoreSum - parSum);
            });

            const leaderboard = Object.values(golferStats).map((golfer) => ({
                name: golfer.name,
                par: golfer.totalPar,
                score: golfer.totalScore,
                overUnder: golfer.overUnder
            }));

            return leaderboard.sort((a, b) => a.overUnder - b.overUnder);
        }
    },
    mounted() {
        // Set up Firestore listener for courses
        coursesRef.onSnapshot((snapshot) => {
            let coursesArr = [];
            snapshot.forEach((doc) => {
                coursesArr.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            this.courses = coursesArr;
            if (this.courses.length >= 2) {
                this.getNewPair();
            }
        });

        // Set up Firestore listener for rounds
        roundsRef.onSnapshot((snapshot) => {
            if (this.currentUser) {
                let roundsArr = [];
                snapshot.forEach((doc) => {
                    const roundData = doc.data();
                    if (roundData.userId === this.currentUser.uid) {
                        roundsArr.push({
                            id: doc.id,
                            ...roundData
                        });
                    }
                });
                this.rounds = roundsArr;
            }
        });

        // Set up Firestore listener for ratings
        ratingsRef.onSnapshot((snapshot) => {
            if (this.currentUser) {
                let ratingsArr = [];
                snapshot.forEach((doc) => {
                    const ratingData = doc.data();
                    if (ratingData.userId === this.currentUser.uid) {
                        ratingsArr.push({
                            id: doc.id,
                            ...ratingData
                        });
                    }
                });
                this.courseRatings = ratingsArr;
            }
        });

        // Set up auth state listener
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.authState = "authenticated";
            } else {
                this.currentUser = null;
                this.authState = "login";
            }
        });
    }
});

App.mount("#app"); 