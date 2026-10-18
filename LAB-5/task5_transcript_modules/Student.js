
export default class Student {
  constructor(id, name, courses = []) {
    if (id === null || id === undefined) {
      throw new TypeError('Student must have an id');
    }
    if (!name || typeof name !== 'string') {
      throw new TypeError('Student must have a valid name');
    }
    this.id = id;
    this.name = name;
    this.courses = courses;
  }
  getCourseCount() {
    return this.courses.length;
  }
  toString() {
    return `Student(${this.id}, ${this.name}, courses: ${
        this.getCourseCount()})`;
  }
}
