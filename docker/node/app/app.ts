import express from 'express';
import { Repository } from './repository';
import databaseConfig from './configuration';
import { Person } from './person';
 
export async function createApp() {
    try {
        const peopleRepository = new Repository<Person>(databaseConfig.config);

        const people = ['Valdinilson Cunha', 'Wesley Willians', 'Luiz Carlos'];

        // Retrieve existing names from the database
        const existingNames = new Set(
            (await peopleRepository.query('SELECT name FROM people WHERE name IN (?)', [people]))
                .map(({ name }) => name)
        );

        const newPeople = people.filter(person => !existingNames.has(person));

        // Filter only the names that have not been inserted yet
        if (newPeople.length > 0) {
            const placeholders = newPeople.map(() => '(?)').join(', ');
            await peopleRepository.execute(`INSERT INTO people (name) VALUES ${placeholders}`, newPeople); // Batch insertion
        }

        const app = express();

        app.get('/', async (req, res) => {
            try {
                const allPeople = await peopleRepository.query('SELECT * FROM `people`');

                const html = `
                    <h1>Full Cycle Rocks!</h1>
                    <ul>
                        ${allPeople.map(({ name }) => `<li>${name}</li>`).join('')}
                    </ul>`;

                res.send(html);
            } catch (error) {
                console.error("Error fetching people: ", error);
                res.status(500).send("Internal error retrieving data.");
            }
        });

        return app;
    } catch (error) {
        console.error("Error starting the application: ", error);
        throw new Error("Failed to create the application.");
    }
}