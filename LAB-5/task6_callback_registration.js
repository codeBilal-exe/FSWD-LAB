'use strict';

const STUDENTS_DB = {
  101: {id: 101, name: 'Ali', completedCourses: ['CS201', 'CS202']},
  102: {id: 102, name: 'Sara', completedCourses: ['CS201']},
};
const COURSES_DB = {
  CS401: {
    code: 'CS401',
    name: 'Advanced Web Dev',
    prerequisite: 'CS201',
    seats: 2,
    enrolled: [],
  },
  CS402: {
    code: 'CS402',
    name: 'AI Fundamentals',
    prerequisite: 'CS301',
    seats: 0,
    enrolled: [],
  },
};
function loadStudent(studentId, callback) {
  setTimeout(() => {
    const student = STUDENTS_DB[studentId];
    if (!student) {
      callback(new Error(`Student ${studentId} does not exist`), null);
      return;
    }
    callback(null, student);
  }, 100);
}
function checkPrerequisites(student, courseCode, callback) {
  setTimeout(() => {
    const course = COURSES_DB[courseCode];
    if (!course) {
      callback(new Error(`Course ${courseCode} not found`), null);
      return;
    }
    if (!student.completedCourses.includes(course.prerequisite)) {
      callback(
          new Error(`Prerequisite ${
              course.prerequisite} not completed by student ${student.id}`),
          null);
      return;
    }
    callback(null, {student, course});
  }, 100);
}
function checkAvailableSeats(student, course, callback) {
  setTimeout(() => {
    if (course.enrolled.length >= course.seats) {
      callback(new Error(`Course ${course.code} is full`), null);
      return;
    }
    callback(null, {student, course});
  }, 100);
}
function registerCourse(student, course, callback) {
  setTimeout(() => {
    if (course.enrolled.includes(student.id)) {
      callback(
          new Error(
              `Student ${student.id} is already registered for ${course.code}`),
          null);
      return;
    }
    course.enrolled.push(student.id);
    const confirmation = {
      studentId: student.id,
      course: course.code,
      status: 'REGISTERED',
    };
    callback(null, confirmation);
  }, 100);
}
function registerStudentForCourse(studentId, courseCode, onComplete) {
  loadStudent(studentId, (err, student) => {
    if (err) {
      onComplete(err, null);
      return;
    }
    checkPrerequisites(student, courseCode, (err2, result2) => {
      if (err2) {
        onComplete(err2, null);
        return;
      }
      const {student: s, course} = result2;
      checkAvailableSeats(s, course, (err3, result3) => {
        if (err3) {
          onComplete(err3, null);
          return;
        }
        registerCourse(
            result3.student, result3.course, (err4, confirmation) => {
              if (err4) {
                onComplete(err4, null);
                return;
              }
              onComplete(null, confirmation);
            });
      });
    });
  });
}
console.log('=== CampusFlow: Legacy Callback-Based Registration Service ===\n');
function runTest(label, studentId, courseCode) {
  registerStudentForCourse(studentId, courseCode, (err, result) => {
    if (err) {
      console.log(`[FAIL] ${label}: ${err.message}`);
    } else {
      console.log(`[OK]   ${label}:`, result);
    }
  });
}
runTest('Ali registers CS401', 101, 'CS401');
runTest('Unknown student (999)', 999, 'CS401');
runTest('Sara registers CS402 (prereq CS301 not met)', 102, 'CS402');
STUDENTS_DB[103] = {
  id: 103,
  name: 'Omar',
  completedCourses: ['CS201', 'CS301']
};
runTest('Omar registers CS402 (course full)', 103, 'CS402');
setTimeout(() => {
  runTest('Ali registers CS401 again (duplicate)', 101, 'CS401');
}, 500);
