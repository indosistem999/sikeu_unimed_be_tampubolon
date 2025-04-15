export class NotFoundException extends Error {
    statusCode: number = 404;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundException';
    }
} 