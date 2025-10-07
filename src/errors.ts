export class BadRequest extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequest";
    }
}

export class NotFound extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFound";
    }
}

export class Internal extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Internal";
    }
}

