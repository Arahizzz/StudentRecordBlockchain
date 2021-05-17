export interface UserInfo {
    email: string;
    role: UserRole;
}

export interface User extends UserInfo {
    password: string; 
}


export const enum UserRole {
    Admin = "admin",
    Teacher = "teacher",
    Student = "student"
}