import bcrypt from 'bcrypt';

const saltRounds = 10;

export function hashPassword(pass:string): Promise<string> {
    return bcrypt.hash(pass, saltRounds);
}

export function comparePass (first: string, second: string): Promise<boolean> {
    return bcrypt.compare(first, second);
}