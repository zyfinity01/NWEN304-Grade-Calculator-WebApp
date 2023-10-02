

// basic calculator logic - once DB is set up, this will change to use the DB. 
function calculateGrade(score) {
    if (score >= 90) {
        return 'A';
    } else if (score >= 80) {
        return 'B';
    } else if (score >= 70) {
        return 'C';
    } else if (score >= 60) {
        return 'D';
    } else if (score >= 0) { // Added this to ensure negative values aren't considered
        return 'F';
    } else {
        return 'Invalid input';
    }
}