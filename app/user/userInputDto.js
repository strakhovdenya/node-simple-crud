
export default class UserIntutDto {
    constructor(name, age) {
        this.id = null
        this.name = name;
        if (age) {
            this.age = age;
        } else {
            this.age = Math.floor(Math.random() * (35 - 25)) + 25;
        }
    }
}