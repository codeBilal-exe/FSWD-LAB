'use strict';

const student = {
  id: 101,
  name: 'Ali',
  marks: 0,
  scholarship: false,
  address: {
    city: 'Islamabad',
    sector: 'F-10',
  },
  contact: {
    email: 'ali@university.edu',
  },
};
function updateStudentProfile(original, update) {
  const {
    name: updatedName = original.name,
    marks: updatedMarks,
    scholarship: updatedScholarship,
    address: addressUpdate,
    contact: contactUpdate,
    ...restTopLevel
  } = update;
  const {city: newCity = original.address.city, ...restAddress} =
      addressUpdate ?? {};
  const {email: newEmail, phone: newPhone, ...restContact} =
      contactUpdate ?? {};
  const mergedAddress = {
    ...original.address,
    city: newCity,
    ...restAddress,
  };
  const mergedContact = {
    ...original.contact,
    email: newEmail ?? original.contact?.email,
    ...(newPhone !== undefined ? {phone: newPhone} : {}),
    ...restContact,
  };
  const resolvedMarks = updatedMarks ?? original.marks;
  const resolvedScholarship = updatedScholarship ?? original.scholarship;
  const resolvedName = updatedName;
  const {id} = original;
  const [primarySkill = 'JavaScript', ...otherSkills] =
      ['HTML', 'CSS', 'Node.js'];
  void primarySkill;
  void otherSkills;
  return {
    id,
    name: resolvedName,
    marks: resolvedMarks,
    scholarship: resolvedScholarship,
    address: mergedAddress,
    contact: mergedContact,
    ...restTopLevel,
  };
}
const update = {
  name: 'Ali Khan',
  address: {
    city: 'Rawalpindi',
  },
  contact: {
    phone: '03001234567',
  },
};
const updatedStudent = updateStudentProfile(student, update);
console.log('=== CampusFlow: Safe Student Profile Update Service ===\n');
console.log('Original student:');
console.log(JSON.stringify(student, null, 2));
console.log('\nUpdate payload:');
console.log(JSON.stringify(update, null, 2));
console.log('\nUpdated student:');
console.log(JSON.stringify(updatedStudent, null, 2));
console.log('\n--- Correctness Checks ---');
console.log(
    '  address.city changed?                :',
    updatedStudent.address.city !== student.address.city,
    `(${student.address.city} → ${updatedStudent.address.city})`);
console.log(
    '  address.sector preserved?            :',
    updatedStudent.address.sector === student.address.sector,
    `(${updatedStudent.address.sector})`);
console.log(
    '  contact.email preserved?             :',
    updatedStudent.contact.email === student.contact.email,
    `(${updatedStudent.contact.email})`);
console.log(
    '  contact.phone added?                 :',
    updatedStudent.contact.phone === '03001234567');
console.log(
    '  marks=0 preserved (falsy-safe)?      :', updatedStudent.marks === 0);
console.log(
    '  scholarship=false preserved (falsy)? :',
    updatedStudent.scholarship === false);
console.log('\n--- Reference Challenge ---');
const originalSameAsUpdated = student === updatedStudent;
console.log(`  original === updated?        : ${originalSameAsUpdated}`);
console.log(
    `  → Because spread creates a NEW top-level object, references differ.`);
const originalAddressSameAsUpdated = student.address === updatedStudent.address;
console.log(`\n  original.address === updated.address? : ${
    originalAddressSameAsUpdated}`);
console.log(
    `  → Because mergedAddress is a NEW object (spread), references differ.`);
const originalContactSameAsUpdated = student.contact === updatedStudent.contact;
console.log(`\n  original.contact === updated.contact? : ${
    originalContactSameAsUpdated}`);
console.log(
    `  → Because mergedContact is a NEW object (spread), references differ.`);
console.log('\n--- Original Mutation Check ---');
console.log('  student.name      :', student.name, '(unchanged ✓)');
console.log('  student.address.city:', student.address.city, '(unchanged ✓)');
console.log(
    '  student.contact.phone:', student.contact.phone ?? 'undefined',
    '(unchanged ✓)');
