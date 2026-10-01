var fullName = 'Muhammad Bilal';
var age = 22;
var isStudent = true;
var gpa = 3.45;
var bioSummary =
    'Passionate Software Engineering student focused on Full Stack Web Development.';

console.log('=== Part 1 & 2: Primitive Variables (using var) ===');
console.log('Full Name: ' + fullName + ' (' + typeof fullName + ')');
console.log('Age: ' + age + ' (' + typeof age + ')');
console.log('Is Student: ' + isStudent + ' (' + typeof isStudent + ')');
console.log('GPA: ' + gpa + ' (' + typeof gpa + ')');
console.log('Bio Summary: ' + bioSummary + ' (' + typeof bioSummary + ')');

var biography = {
  name: fullName,
  age: age,
  email: 'muhammad.bilal@example.com',
  isStudent: isStudent,
  address: {
    street: '123 University Avenue',
    city: 'Islamabad',
    province: 'ICT',
    postalCode: '44000',
    country: 'Pakistan',
  },
  degreeProgram: {
    title: 'Bachelor of Science in Software Engineering',
    department: 'Computer Science & Software Engineering',
    university: 'Capital University of Science & Technology',
    startYear: 2022,
    expectedGraduation: 2026,
    currentSemester: '6th Semester',
    cgpa: 3.45,
  },
  skills: ['JavaScript', 'HTML5', 'CSS3', 'React', 'Node.js', 'Git'],
};

function printBiography(bio) {
  console.log('=== Part 3: Formatted JS Biography Object Output ===');
  console.log('Name: ' + bio.name);
  console.log('Age: ' + bio.age + ' years old');
  console.log('Email: ' + bio.email);
  console.log(
      'Student Status: ' + (bio.isStudent ? 'Currently Enrolled' : 'Graduated'),
  );

  console.log('\n-- Address Details --');
  console.log('Street: ' + bio.address.street);
  console.log('City: ' + bio.address.city + ', ' + bio.address.province);
  console.log('Postal Code: ' + bio.address.postalCode);
  console.log('Country: ' + bio.address.country);

  console.log('\n-- Degree Program Details --');
  console.log('Degree: ' + bio.degreeProgram.title);
  console.log('Department: ' + bio.degreeProgram.department);
  console.log('University: ' + bio.degreeProgram.university);
  console.log(
      'Duration: ' + bio.degreeProgram.startYear + ' - ' +
          bio.degreeProgram.expectedGraduation,
  );
  console.log('Semester: ' + bio.degreeProgram.currentSemester);
  console.log('CGPA: ' + bio.degreeProgram.cgpa);

  console.log('\n-- Key Skills --');
  console.log('Skills: ' + bio.skills.join(', '));
}

printBiography(biography);
