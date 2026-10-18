'use strict';

class Person {
  constructor(name, email) {
    if (!name || typeof name !== 'string')
      throw new TypeError('Person requires a valid name');
    if (!email || typeof email !== 'string')
      throw new TypeError('Person requires a valid email');
    this.name = name;
    this.email = email;
  }
  introduce() {
    return `Hi, I am ${this.name} and my email is ${this.email}.`;
  }
}
class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks = marks;
  }
  introduce() {
    return `${super.introduce()} I am a student with roll number ${
        this.rollNo}.`;
  }
  getResult() {
    if (this.marks >= 50) {
      return `${this.name} (${this.rollNo}): PASS — Marks: ${this.marks}`;
    }
    return `${this.name} (${this.rollNo}): FAIL — Marks: ${this.marks}`;
  }
}
class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }
  introduce() {
    return `${super.introduce()} I am a faculty member in ${
        this.department} (ID: ${this.employeeId}).`;
  }
}
const s1 = new Student('Ali Shah', 'ali@university.edu', 'F21-001', 82);
const s2 = new Student('Sara Baig', 'sara@university.edu', 'F21-002', 45);
const f1 = new FacultyMember(
    'Dr. Tariq', 'tariq@university.edu', 'EMP-301', 'Computer Science');
const f2 = new FacultyMember(
    'Prof. Nida', 'nida@university.edu', 'EMP-302', 'Software Engineering');
const users = [s1, s2, f1, f2];
console.log('=== CampusFlow: University User Hierarchy ===\n');
console.log('--- Polymorphic introduce() ---');
users.forEach(user => console.log(' ', user.introduce()));
console.log('\n--- Student getResult() ---');
[s1, s2].forEach(s => console.log(' ', s.getResult()));
console.log('\n--- instanceof Checks ---');
console.log('  s1 instanceof Student     :', s1 instanceof Student);
console.log('  s1 instanceof Person      :', s1 instanceof Person);
console.log('  f1 instanceof FacultyMember:', f1 instanceof FacultyMember);
console.log('  f1 instanceof Student     :', f1 instanceof Student);
console.log('\n--- this / call() / bind() Challenge ---');
const guest = {
  name: 'Dr. Ahmed',
  email: 'ahmed@example.com',
};
const callResult = Person.prototype.introduce.call(guest);
console.log('\n  Person.introduce via call() with guest as this:');
console.log(' ', callResult);
const fn = s1.introduce;
console.log('\n  Detached s1.introduce (fn):');
try {
  const detachedResult = fn();
  console.log('  Result:', detachedResult);
} catch (err) {
  console.log(
      '  Error (expected in strict mode — this is undefined):', err.message);
}
const boundIntroduce = s1.introduce.bind(s1);
console.log('\n  Bound version (s1.introduce.bind(s1)):');
console.log(' ', boundIntroduce());
console.log('\n--- Explanation ---');
console.log(
    'constructor      : Defines the class blueprint; called with new to create instances.');
console.log(
    'new              : Allocates a new object, sets [[Prototype]], and runs the constructor.');
console.log(
    'this             : Refers to the calling object. In user.introduce(), this === user.');
console.log(
    'extends          : Establishes the prototype chain (Student -> Person).');
console.log(
    'super()          : Calls the parent constructor; must be called before using this in a subclass.');
console.log(
    'Method Override  : Student.introduce() replaces Person.introduce() for Student instances.');
console.log(
    'Runtime polymorphism: users.forEach(u => u.introduce()) picks the correct method at runtime.');
console.log(
    'instanceof       : Traverses the prototype chain to check type relationship.');
console.log(
    'call()           : Invokes a function with an explicitly supplied this (guest in our demo).');
console.log(
    'bind()           : Returns a NEW function permanently bound to a specific this.');
console.log(
    'Detached method  : const fn = s1.introduce loses binding; fn() in strict mode has this === undefined.');
