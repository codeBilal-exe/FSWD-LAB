import {calculateAverage, calculateGPA, calculateGrade} from './gradeUtils.js';
function validateCourse(course, studentId) {
  if (!course.code || typeof course.code !== 'string' ||
      course.code.trim() === '') {
    throw new TypeError(`Student ${studentId}: course is missing a code`);
  }
  if (typeof course.marks !== 'number' || Number.isNaN(course.marks)) {
    throw new TypeError(
        `Student ${studentId}, course ${course.code}: marks must be a number`);
  }
  if (course.marks < 0 || course.marks > 100) {
    throw new RangeError(`Student ${studentId}, course ${course.code}: marks ${
        course.marks} out of range (0-100)`);
  }
}
function validateStudentRecord(record, seenIds) {
  if (record.id === null || record.id === undefined) {
    throw new Error(
        `A student record is missing an id: ${JSON.stringify(record)}`);
  }
  if (seenIds.has(record.id)) {
    throw new Error(`Duplicate student id: ${record.id}`);
  }
  if (!Array.isArray(record.courses) || record.courses.length === 0) {
    throw new TypeError(
        `Student ${record.id}: courses must be a non-empty array`);
  }
  record.courses.forEach(c => validateCourse(c, record.id));
}
function processRecord(record) {
  const gradeResults = record.courses.map(course => {
    const {grade, gpa} = calculateGrade(course.marks);
    return {code: course.code, marks: course.marks, grade, gpa};
  });
  const allMarks = gradeResults.map(c => c.marks);
  const allGpa = gradeResults.map(c => c.gpa);
  const average = calculateAverage(allMarks);
  const gpa = calculateGPA(allGpa);
  return {
    id: record.id,
    name: record.name,
    courses: gradeResults,
    average,
    gpa,
  };
}
export function processTranscript(rawJson) {
  let records;
  try {
    records = JSON.parse(rawJson);
  } catch {
    throw new SyntaxError('Malformed JSON: unable to parse transcript data');
  }
  if (!Array.isArray(records)) {
    throw new TypeError('Transcript JSON must be an array of student records');
  }
  const seenIds = new Set();
  const processedStudents = [];
  for (const record of records) {
    validateStudentRecord(record, seenIds);
    seenIds.add(record.id);
    processedStudents.push(processRecord(record));
  }
  return {
    students: processedStudents,
    generatedAt: new Date().toISOString(),
  };
}
export function reportToJSON(report) {
  return JSON.stringify(report, null, 2);
}
