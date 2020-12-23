interface User {
    name: string;
    email: string;
    password: string;
    _id?: string;
    address?: {
        street: string,
        city: string,
    };
};

export default User;