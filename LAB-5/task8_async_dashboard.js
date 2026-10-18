'use strict';

const FAKE_DB = {
  '/users': [
    {id: 1, name: 'Ali', department: 'CS', marks: 82},
    {id: 2, name: 'Sara', department: 'CS', marks: 91},
    {id: 3, name: 'Usman', department: 'SE', marks: 47},
    {id: 4, name: 'Hina', department: 'AI', marks: 73},
    {id: 5, name: 'Ahmed', department: 'SE', marks: 64},
    {id: 6, name: 'Zoya', department: 'AI', marks: 91},
  ],
  '/courses': [
    {code: 'CS301', name: 'FSWD', department: 'CS'},
    {code: 'CS302', name: 'OOP', department: 'CS'},
    {code: 'SE401', name: 'SQE', department: 'SE'},
    {code: 'AI501', name: 'ML Basics', department: 'AI'},
  ],
  '/results': [
    {studentId: 1, courseCode: 'CS301', marks: 82},
    {studentId: 2, courseCode: 'CS301', marks: 91},
    {studentId: 3, courseCode: 'SE401', marks: 47},
    {studentId: 4, courseCode: 'AI501', marks: 73},
    {studentId: 5, courseCode: 'SE401', marks: 64},
    {studentId: 6, courseCode: 'AI501', marks: 91},
  ],
  '/slow': '__SLOW__',
  '/invalid-json': '__BAD_JSON__',
};
async function fakeFetch(url) {
  if (url.includes('network-error')) {
    throw new TypeError('Network request failed');
  }
  const delay = url === '/slow' ? 600 : 80;
  await new Promise(res => setTimeout(res, delay));
  if (url.includes('404')) {
    return {ok: false, status: 404, json: async () => ({error: 'Not Found'})};
  }
  if (url.includes('500')) {
    return {
      ok: false,
      status: 500,
      json: async () => ({error: 'Internal Server Error'})
    };
  }
  if (url === '/invalid-json') {
    return {
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token < in JSON');
      },
    };
  }
  const data = FAKE_DB[url];
  if (data === undefined) {
    return {
      ok: false,
      status: 404,
      json: async () => ({error: `${url} not found`})
    };
  }
  return {
    ok: true,
    status: 200,
    json: async () => JSON.parse(JSON.stringify(data)),
  };
}
async function getJSON(url, fetchImplementation) {
  const response = await fetchImplementation(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}
function computeDashboard(users, courses, results) {
  const totalStudents = users.length;
  const totalCourses = courses.length;
  const overallAverageMarks = users.length > 0 ?
      parseFloat(
          (users.reduce((s, u) => s + u.marks, 0) / users.length).toFixed(2)) :
      0;
  const highestPerformer = users.reduce(
      (best, u) => u.marks > (best?.marks ?? -Infinity) ? u : best, null);
  const failedStudents = users.filter(u => u.marks < 50).length;
  const deptStats = {};
  for (const user of users) {
    const dept = user.department;
    if (!deptStats[dept]) {
      deptStats[dept] =
          {students: 0, totalMarks: 0, average: 0, passed: 0, failed: 0};
    }
    deptStats[dept].students += 1;
    deptStats[dept].totalMarks += user.marks;
    if (user.marks >= 50)
      deptStats[dept].passed += 1;
    else
      deptStats[dept].failed += 1;
  }
  for (const dept of Object.keys(deptStats)) {
    const d = deptStats[dept];
    d.average = parseFloat((d.totalMarks / d.students).toFixed(2));
    delete d.totalMarks;
  }
  return {
    totalStudents,
    totalCourses,
    overallAverageMarks,
    highestPerformer,
    failedStudents,
    deptStats
  };
}
async function loadDashboard() {
  console.log('=== CampusFlow: Concurrent Academic Dashboard ===\n');
  const [users, courses, results] = await Promise.all([
    getJSON('/users', fakeFetch),
    getJSON('/courses', fakeFetch),
    getJSON('/results', fakeFetch),
  ]);
  const dashboard = computeDashboard(users, courses, results);
  console.log('--- Dashboard ---');
  console.log('Total Students     :', dashboard.totalStudents);
  console.log('Total Courses      :', dashboard.totalCourses);
  console.log('Overall Avg Marks  :', dashboard.overallAverageMarks);
  console.log(
      'Highest Performer  :', dashboard.highestPerformer?.name,
      `(${dashboard.highestPerformer?.marks})`);
  console.log('Failed Students    :', dashboard.failedStudents);
  console.log('Dept Stats         :');
  for (const [dept, stats] of Object.entries(dashboard.deptStats)) {
    console.log(`  ${dept}:`, stats);
  }
  return dashboard;
}
async function fetchWithTimeout(url, milliseconds) {
  const controller = new AbortController();
  const {signal} = controller;
  let timerId;
  try {
    const timeoutPromise = new Promise((_, reject) => {
      timerId = setTimeout(() => {
        controller.abort();
        reject(new DOMException(
            `Request timed out after ${milliseconds}ms`, 'AbortError'));
      }, milliseconds);
    });
    const result = await Promise.race([
      getJSON(url, fakeFetch),
      timeoutPromise,
    ]);
    return result;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`[Timeout/Abort] ${err.message}`);
    }
    if (err instanceof TypeError) {
      throw new Error(`[Network Failure] ${err.message}`);
    }
    if (err instanceof SyntaxError) {
      throw new Error(`[Invalid JSON] ${err.message}`);
    }
    if (err.message.startsWith('HTTP')) {
      throw new Error(`[HTTP Failure] ${err.message}`);
    }
    throw err;
  } finally {
    clearTimeout(timerId);
  }
}
async function runErrorTests() {
  console.log('\n--- getJSON Error Scenarios ---');
  const errorCases = [
    {label: '404 response', url: '/404-endpoint'},
    {label: '500 response', url: '/500-endpoint'},
    {label: 'Network failure', url: 'network-error'},
    {label: 'Invalid JSON', url: '/invalid-json'},
  ];
  for (const tc of errorCases) {
    try {
      await getJSON(tc.url, fakeFetch);
      console.log(`  [UNEXPECTED OK] ${tc.label}`);
    } catch (err) {
      console.log(`  [${err.constructor.name}] ${tc.label}: ${err.message}`);
    }
  }
}
async function runTimeoutTests() {
  console.log('\n--- fetchWithTimeout Tests ---');
  try {
    const result = await fetchWithTimeout('/users', 200);
    console.log(
        '  [OK]      /users within 200ms — got', result.length, 'users');
  } catch (err) {
    console.error('  [FAIL]', err.message);
  }
  try {
    await fetchWithTimeout('/slow', 100);
    console.log('  [UNEXPECTED OK] /slow with 100ms timeout');
  } catch (err) {
    console.log('  [Expected]', err.message);
  }
  try {
    await fetchWithTimeout('/500-endpoint', 500);
  } catch (err) {
    console.log('  [Expected]', err.message);
  }
}
(async () => {
  await loadDashboard();
  await runErrorTests();
  await runTimeoutTests();
})();
