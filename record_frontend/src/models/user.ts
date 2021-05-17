export interface UserInfo {
    email: string;
    role: UserRole;
}

export const enum UserRole {
    Admin = "admin",
    Teacher = "teacher",
    Student = "student"
}