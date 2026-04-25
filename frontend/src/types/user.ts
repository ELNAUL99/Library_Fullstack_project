export type UserRegister = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    password: string
};

export type UserLogin = {
    username: string,
    password: string
};

export interface User{
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    token: string,
    expiration: Date,
    roles: string[]
};

export interface FormType{
    type: "Login" | "Register"
};

export interface UpdateUser extends UserRegister{
    newPassword: string | null
};
