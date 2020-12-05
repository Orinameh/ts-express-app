import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        DB_NAME: str(),
        PORT: port(),
    })
}

export default validateEnv;