import dotenv from 'dotenv';

dotenv.config();

function getEnvVariable(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
        throw new Error(`The environment variable ${key} is not defined.`);
    }
    return value || defaultValue!;
}

const databaseConfig = {
    config: {
        host: getEnvVariable('MYSQL_URL', 'mysql_challenge'),
        user: getEnvVariable('MYSQL_USERNAME', 'root'),
        password: getEnvVariable('MYSQL_ROOT_PASSWORD', 'root'),
        database: getEnvVariable('MYSQL_DATABASE', 'challengedb'),
    }
};

export default databaseConfig;