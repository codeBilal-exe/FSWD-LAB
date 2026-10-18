const GRADE_SCALE = [
  {min: 85, grade: 'A', gpa: 4.0},
  {min: 80, grade: 'A-', gpa: 3.7},
  {min: 75, grade: 'B+', gpa: 3.3},
  {min: 70, grade: 'B', gpa: 3.0},
  {min: 65, grade: 'B-', gpa: 2.7},
  {min: 60, grade: 'C+', gpa: 2.3},
  {min: 50, grade: 'C', gpa: 2.0},
  {min: 0, grade: 'F', gpa: 0.0},
];
export function calculateGrade(marks) {
  if (typeof marks !== 'number' || Number.isNaN(marks)) {
    throw new TypeError(`calculateGrade expects a number, got: ${marks}`);
  }
  if (marks < 0 || marks > 100) {
    throw new RangeError(`Marks must be between 0 and 100, got: ${marks}`);
  }
  const entry = GRADE_SCALE.find(g => marks >= g.min);
  return {grade: entry.grade, gpa: entry.gpa};
}
export function calculateAverage(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError('calculateAverage requires a non-empty array');
  }
  const total = values.reduce((sum, v) => sum + v, 0);
  return parseFloat((total / values.length).toFixed(2));
}
export function calculateGPA(gpaPoints) {
  if (!Array.isArray(gpaPoints) || gpaPoints.length === 0) {
    throw new TypeError(
        'calculateGPA requires a non-empty array of GPA points');
  }
  const total = gpaPoints.reduce((sum, g) => sum + g, 0);
  return parseFloat((total / gpaPoints.length).toFixed(2));
}
