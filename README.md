# Golfi
 
Vue application for interactive golf course comparisons in the NYC Metro area. Includes:
- Course list of ~12 courses in the New York City area
- Beli-style course comparison - pick between two courses and give one a rating out of five stars
- Leaderboard to post past round scores
- Profile page with rating history

### Authentication

This application employs a simple Google Firebase authentication flow that prompts the user for an email and password. Notably, it does not include Google account sign in, for simplicity. We simulate an authentication page, as users are unable to access the application until they sign in or create an account.

### Architecture

Data persistence is handled via Firebase's Firestore. A 'courses' and 'rounds' collection store data pertaining to the available courses to rate and score, and prior rounds from player entry into the leaderboard. Simple calculations are handled in the leaderboard, such as calculating a user's over/under as compared to par. Additionally, a math.Random funciton is used to shuffle courses on the ranking page.

### Design

The application has a simple and easy-to-use design, incorporating Boostrap for efficient styling. Iowan Old Style is imported as a font for use in the logo; otherwise plain Boostrap styling and a few custom CSS elements are sprinkled throughout.
