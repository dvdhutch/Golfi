// AI assistance employed to set up child component structure

const CoursesComponent = {
    props: {
        courses: {
            type: Array,
            required: true
        },
        currentPair: {
            type: Array,
            required: true
        },
        onNewPair: {
            type: Function,
            required: true
        },
        onSubmitRating: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            selectedCourseForRating: null,
            rating: 0,
            comment: ""
        };
    },
    // AI assistance employed to set up rating system
    methods: {
        handleImageError(event) {
            event.target.src = "https://via.placeholder.com/400x250?text=Golf+Course+Image";
        },
        selectCourseForRating(course) {
            this.selectedCourseForRating = course;
        },
        submitRating() {
            if (this.rating > 0 && this.comment.trim()) {
                this.onSubmitRating({
                    courseName: this.selectedCourseForRating.name,
                    stars: this.rating,
                    comment: this.comment,
                    date: new Date().toISOString().split("T")[0]
                });

                this.rating = 0;
                this.comment = "";
                this.selectedCourseForRating = null;

                this.onNewPair();
            }
        },
        shuffleCourses() {
            this.onNewPair();
        }
    },
    template: `
        <div v-if="courses && courses.length >= 2">
            <div class="text-center mb-4">
                <button class="btn btn-primary" @click="shuffleCourses">
                    <i class="bi bi-shuffle me-2"></i>Shuffle Courses
                </button>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card h-100" :class="{'border-primary border-3': selectedCourseForRating === courses[currentPair[0]]}">
                        <img :src="courses[currentPair[0]].image" class="card-img-top" @error="handleImageError" :alt="courses[currentPair[0]].name">
                        <div class="card-body">
                            <h5 class="card-title">{{ courses[currentPair[0]].name }}</h5>
                            <p class="card-text">
                                <strong>Location:</strong> {{ courses[currentPair[0]].location }}<br>
                                <strong>Address:</strong> {{ courses[currentPair[0]].address }}<br>
                                <strong>Par:</strong> {{ courses[currentPair[0]].par }}<br>
                                <strong>USGA Rating:</strong> {{ courses[currentPair[0]].usgaRating }}<br>
                                <strong>Slope Rating:</strong> {{ courses[currentPair[0]].slopeRating }}<br>
                                <strong>Length:</strong> {{ courses[currentPair[0]].length }} yards<br>
                                <strong>Cost Rating:</strong> {{ courses[currentPair[0]].costRating }}/5
                            </p>
                            <button class="btn btn-primary" @click="selectCourseForRating(courses[currentPair[0]])">Rate This Course</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h-100" :class="{'border-primary border-3': selectedCourseForRating === courses[currentPair[1]]}">
                        <img :src="courses[currentPair[1]].image" class="card-img-top" @error="handleImageError" :alt="courses[currentPair[1]].name">
                        <div class="card-body">
                            <h5 class="card-title">{{ courses[currentPair[1]].name }}</h5>
                            <p class="card-text">
                                <strong>Location:</strong> {{ courses[currentPair[1]].location }}<br>
                                <strong>Address:</strong> {{ courses[currentPair[1]].address }}<br>
                                <strong>Par:</strong> {{ courses[currentPair[1]].par }}<br>
                                <strong>USGA Rating:</strong> {{ courses[currentPair[1]].usgaRating }}<br>
                                <strong>Slope Rating:</strong> {{ courses[currentPair[1]].slopeRating }}<br>
                                <strong>Length:</strong> {{ courses[currentPair[1]].length }} yards<br>
                                <strong>Cost Rating:</strong> {{ courses[currentPair[1]].costRating }}/5
                            </p>
                            <button class="btn btn-primary" @click="selectCourseForRating(courses[currentPair[1]])">Rate This Course</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rating Section -->
            <div v-if="selectedCourseForRating" class="card shadow-sm mt-4">
                <div class="card-body">
                    <h2 class="h4">Rate Your Choice</h2>
                    <p class="text-muted">Rating for: {{ selectedCourseForRating.name }}</p>

                    <div class="star-rating mb-3">
                        <div class="stars">
                            <span
                                v-for="star in 5"
                                :key="star"
                                @click="rating = star"
                                :class="{'active': star <= rating}"
                                class="fs-2 me-2"
                            >★</span>
                        </div>
                    </div>

                    <div class="rating-form">
                        <textarea
                            v-model="comment"
                            class="form-control mb-3"
                            placeholder="Why did you choose this course? Share your thoughts..."
                            rows="3"
                        ></textarea>
                        <button class="btn btn-success w-100" @click="submitRating">Submit Rating</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center">
            <p>Loading courses...</p>
        </div>
    `
}; 