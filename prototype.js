function Person(name) {
  this.name = name
}

Person.prototype.greet = function greet() {
  return `Hi, ${this.name}!`
}

function Student(name) {
  this.__proto__.constructor(name)
}

Student.prototype.study = function study() {
  return `${this.name} is studying.`
}
Object.setPrototypeOf(Student.prototype, Person.prototype)

const me = new Student('Jeongho')
console.log(me.greet())
console.log(me.study())

// prototype을 한 번이라도 거쳤기 때문에 True
console.log(me instanceof Student)
console.log(me instanceof Person)

// anotherPerson의 프로토타입에는 Student가 없음
const anotherPerson = new Person('Foo')
console.log(anotherPerson instanceof Student)
console.log(anotherPerson instanceof Person)

console.log([] instanceof Array, [] instanceof Object)
