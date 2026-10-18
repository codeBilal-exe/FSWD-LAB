'use strict';

const STUDENTS = {
  101: {id: 101, name: 'Ali', completedCourses: ['CS201', 'CS202']},
  102: {id: 102, name: 'Sara', completedCourses: ['CS201']},
};
const COURSES = {
  CS401: {
    code: 'CS401',
    name: 'Advanced Web Dev',
    prerequisite: 'CS201',
    seats: 2,
    enrolled: []
  },
  CS402: {
    code: 'CS402',
    name: 'AI Fundamentals',
    prerequisite: 'CS301',
    seats: 0,
    enrolled: []
  },
  CS403: {
    code: 'CS403',
    name: 'Data Engineering',
    prerequisite: 'CS202',
    seats: 5,
    enrolled: []
  },
};
function getStudent(studentId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = STUDENTS[studentId];
      if (!student) {
        reject(new Error(`Student ${studentId} not found`));
      } else {
        resolve(student);
      }
    }, 80);
  });
}
function getCourse(courseCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = COURSES[courseCode];
      if (!course) {
        reject(new Error(`Course ${courseCode} not found`));
      } else {
        resolve(course);
      }
    }, 80);
  });
}
function checkPrerequisites(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!student.completedCourses.includes(course.prerequisite)) {
        reject(new Error(`Prerequisite ${
            course.prerequisite} not met for student ${student.id}`));
      } else {
        resolve({student, course});
      }
    }, 80);
  });
}
function checkSeats(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (course.enrolled.length >= course.seats) {
        reject(new Error(`Course ${course.code} is full`));
      } else {
        resolve({student, course});
      }
    }, 80);
  });
}
function registerStudent(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (course.enrolled.includes(student.id)) {
        reject(new Error(
            `Student ${student.id} already registered for ${course.code}`));
      } else {
        course.enrolled.push(student.id);
        resolve(
            {studentId: student.id, course: course.code, status: 'REGISTERED'});
      }
    }, 80);
  });
}
function sendEmail(registration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error('Email service temporarily unavailable'));
      } else {
        resolve({
          service: 'Email',
          message: `Confirmation sent to student ${registration.studentId}`
        });
      }
    }, 120);
  });
}
function sendSMS(registration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.4) {
        reject(new Error('SMS gateway timeout'));
      } else {
        resolve({
          service: 'SMS',
          message: `SMS sent to student ${registration.studentId}`
        });
      }
    }, 150);
  });
}
function writeAuditLog(registration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        service: 'Audit',
        message: `Log written: ${JSON.stringify(registration)}`
      });
    }, 60);
  });
}
function runRegistrationChain(studentId, courseCode) {
  console.log(
      `\n[Part A] Registering student ${studentId} for ${courseCode}...`);
  let capturedStudent = null;
  return getStudent(studentId)
      .then(student => {
        capturedStudent = student;
        return getCourse(courseCode);
      })
      .then(course => {
        return checkPrerequisites(capturedStudent, course);
      })
      .then(({student, course}) => {
        return checkSeats(student, course);
      })
      .then(({student, course}) => {
        return registerStudent(student, course);
      })
      .then(confirmation => {
        console.log('[Part A] Registration confirmed:', confirmation);
        return confirmation;
      })
      .catch(err => {
        console.error('[Part A] Registration failed:', err.message);
        throw err;
      })
      .finally(() => {
        console.log('[Part A] Chain completed (finally).');
      });
}
function runPostRegistrationServices(registration) {
  console.log('\n[Part B] Running post-registration services...');
  const services = [
    sendEmail(registration)
        .then(r => ({service: 'Email', status: 'fulfilled', result: r}))
        .catch(
            e => ({service: 'Email', status: 'rejected', reason: e.message})),
    sendSMS(registration)
        .then(r => ({service: 'SMS', status: 'fulfilled', result: r}))
        .catch(e => ({service: 'SMS', status: 'rejected', reason: e.message})),
    writeAuditLog(registration)
        .then(r => ({service: 'Audit', status: 'fulfilled', result: r}))
        .catch(
            e => ({service: 'Audit', status: 'rejected', reason: e.message})),
  ];
  return Promise.allSettled(services).then(results => {
    const report = results.map(r => r.value ?? r.reason);
    console.log('[Part B] Post-registration report:');
    report.forEach(item => console.log(' ', JSON.stringify(item)));
    return report;
  });
}
function getCourseFromFastestServer(courseCode) {
  console.log('\n[Part C] Fetching course info from two servers...');
  const serverA = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        reject(new Error('Server A offline'));
      } else {
        resolve({source: 'Server A', courseCode, name: 'Retrieved from A'});
      }
    }, Math.random() * 200 + 50);
  });
  const serverB = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(new Error('Server B offline'));
      } else {
        resolve({source: 'Server B', courseCode, name: 'Retrieved from B'});
      }
    }, Math.random() * 200 + 50);
  });
  return Promise.any([serverA, serverB])
      .then(result => {
        console.log(
            '[Part C] Course info from fastest available server:', result);
        return result;
      })
      .catch(err => {
        console.error('[Part C] Both servers failed:', err.message);
      });
}
console.log('=== CampusFlow: Promise-Based Registration Engine ===');
runRegistrationChain(101, 'CS401')
    .then(registration => {
      if (registration) return runPostRegistrationServices(registration);
    })
    .then(() => getCourseFromFastestServer('CS403'))
    .catch(() => {});
setTimeout(() => {
  console.log('\n--- Failure Test: Sara for CS402 (prereq CS301 not met) ---');
  runRegistrationChain(102, 'CS402').catch(() => {});
}, 800);
setTimeout(() => {
  console.log('\n--- Failure Test: Unknown student 999 ---');
  runRegistrationChain(999, 'CS401').catch(() => {});
}, 1200);
