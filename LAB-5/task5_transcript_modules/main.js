import {calculateAverage, calculateGPA, calculateGrade as gradeFor} from './gradeUtils.js';
import Student from './Student.js';
import {processTranscript, reportToJSON} from './transcriptService.js';

console.log('=== CampusFlow: Modular Transcript Processing System ===\n');
const demoStudent = new Student(999, 'Demo User', [
  {code: 'CS301', marks: 81},
  {code: 'CS302', marks: 74},
]);
console.log('Student instance:', demoStudent.toString());
console.log('Course count    :', demoStudent.getCourseCount());
console.log('\n--- gradeUtils Demo ---');
console.log('Grade for 85 :', gradeFor(85));
console.log('Average [80,90,70]:', calculateAverage([80, 90, 70]));
console.log('GPA [4.0, 3.3, 3.7]:', calculateGPA([4.0, 3.3, 3.7]));
const rawData = `
[
  {
    "id": 101,
    "name": "Ali",
    "courses": [
      { "code": "CS301", "marks": 81 },
      { "code": "CS302", "marks": 74 }
    ]
  },
  {
    "id": 102,
    "name": "Sara",
    "courses": [
      { "code": "CS301", "marks": 91 },
      { "code": "CS302", "marks": 88 }
    ]
  }
]
`;
console.log('\n--- Valid Transcript ---');
try {
  const report = processTranscript(rawData);
  console.log('Report:', reportToJSON(report));
} catch (err) {
  console.error('Unexpected error:', err.message);
} finally {
  console.log('[finally] Valid transcript processing complete.');
}
const testCases = [
  {
    label: 'Malformed JSON',
    data: '{ bad json >>>',
  },
  {
    label: 'Missing student ID',
    data: JSON.stringify(
        [{name: 'Ghost', courses: [{code: 'CS301', marks: 75}]}]),
  },
  {
    label: 'Duplicate ID',
    data: JSON.stringify([
      {id: 1, name: 'A', courses: [{code: 'CS301', marks: 70}]},
      {id: 1, name: 'B', courses: [{code: 'CS302', marks: 80}]},
    ]),
  },
  {
    label: 'Marks out of range (> 100)',
    data: JSON.stringify(
        [{id: 2, name: 'X', courses: [{code: 'CS301', marks: 150}]}]),
  },
  {
    label: 'Missing course code',
    data: JSON.stringify([{id: 3, name: 'Y', courses: [{marks: 75}]}]),
  },
];
console.log('\n--- Error Case Tests ---');
for (const tc of testCases) {
  try {
    processTranscript(tc.data);
    console.log(`  [FAIL - should have thrown] ${tc.label}`);
  } catch (err) {
    console.log(`  [${err.constructor.name}] ${tc.label}: ${err.message}`);
  } finally {
    console.log(`  [finally] Attempted: ${tc.label}`);
  }
}
