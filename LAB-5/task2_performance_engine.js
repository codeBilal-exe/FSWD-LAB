'use strict';

const GRADE_SCALE = [
  {min: 85, grade: 'A', gradePoints: 4.0},
  {min: 80, grade: 'A-', gradePoints: 3.7},
  {min: 75, grade: 'B+', gradePoints: 3.3},
  {min: 70, grade: 'B', gradePoints: 3.0},
  {min: 65, grade: 'B-', gradePoints: 2.7},
  {min: 60, grade: 'C+', gradePoints: 2.3},
  {min: 50, grade: 'C', gradePoints: 2.0},
  {min: 0, grade: 'F', gradePoints: 0.0},
];
function getGradeInfo(marks) {
  const entry = GRADE_SCALE.find(g => marks >= g.min);
  return entry ?? {grade: 'F', gradePoints: 0.0};
}
function processResults(results) {
  return results.map(student => {
    const {grade, gradePoints} = getGradeInfo(student.marks);
    const status = grade === 'F' ? 'FAIL' : 'PASS';
    return {...student, grade, gradePoints, status};
  });
}
function getRankedMeritList(results) {
  return results.slice().sort((a, b) => {
    if (b.marks !== a.marks) return b.marks - a.marks;
    return a.name.localeCompare(b.name);
  });
}
function getDepartmentStats(results) {
  return results.reduce((stats, student) => {
    const dept = student.department;
    if (!stats[dept]) {
      stats[dept] = {students: 0, totalMarks: 0, highest: -Infinity, passed: 0};
    }
    stats[dept].students += 1;
    stats[dept].totalMarks += student.marks;
    if (student.marks > stats[dept].highest)
      stats[dept].highest = student.marks;
    if (student.grade !== 'F') stats[dept].passed += 1;
    return stats;
  }, {});
}
function finalizeDeptStats(rawStats) {
  const finalized = {};
  for (const [dept, data] of Object.entries(rawStats)) {
    finalized[dept] = {
      students: data.students,
      average: parseFloat((data.totalMarks / data.students).toFixed(2)),
      highest: data.highest,
      passed: data.passed,
    };
  }
  return finalized;
}
function runAcademicQueries(processed) {
  const overallAverage =
      processed.reduce((sum, s) => sum + s.marks, 0) / processed.length;
  const firstAbove85 = processed.find(s => s.marks > 85);
  const firstFailedIndex = processed.findIndex(s => s.grade === 'F');
  const hasAnyFailed = processed.some(s => s.grade === 'F');
  const allInValidRange = processed.every(s => s.marks >= 0 && s.marks <= 100);
  const aboveAverage = processed.filter(s => s.marks > overallAverage);
  const top3Names = getRankedMeritList(processed).slice(0, 3).map(s => s.name);
  return {
    overallAverage: parseFloat(overallAverage.toFixed(2)),
    firstAbove85: firstAbove85 ?? null,
    firstFailedIndex,
    hasAnyFailed,
    allInValidRange,
    aboveAverage,
    top3Names,
  };
}
const results = [
  {id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82},
  {id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91},
  {id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47},
  {id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73},
  {id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64},
  {id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91},
];
console.log('=== CampusFlow: Academic Performance Intelligence Engine ===\n');
const processed = processResults(results);
console.log('--- A. Processed Results ---');
processed.forEach(
    s => console.log(`  [${s.id}] ${s.name.padEnd(8)} | Marks: ${
        s.marks} | Grade: ${s.grade.padEnd(2)} | GPA pts: ${
        s.gradePoints} | Status: ${s.status}`));
console.log(
    '\n  [Check] Original results[0].grade:',
    results[0].grade ?? 'undefined (✓ not mutated)');
const ranked = getRankedMeritList(processed);
console.log('\n--- B. Ranked Merit List ---');
ranked.forEach(
    (s, i) => console.log(`  ${i + 1}. ${s.name.padEnd(8)} | ${s.marks}`));
console.log(
    '  [Check] Original first entry unchanged:', results[0].name,
    results[0].marks);
const deptStats = finalizeDeptStats(getDepartmentStats(processed));
console.log('\n--- C. Department Statistics ---');
console.log(deptStats);
const queries = runAcademicQueries(processed);
console.log('\n--- D. Academic Queries ---');
console.log(`  Overall Average       : ${queries.overallAverage}`);
console.log(
    `  First student > 85    : ${queries.firstAbove85?.name ?? 'None'}`);
console.log(`  First failed index    : ${queries.firstFailedIndex}`);
console.log(`  Any student failed?   : ${queries.hasAnyFailed}`);
console.log(`  All marks 0-100?      : ${queries.allInValidRange}`);
console.log(`  Above average         : ${
    queries.aboveAverage.map(s => s.name).join(', ')}`);
console.log(`  Top 3 students        : ${queries.top3Names.join(', ')}`);
