import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/siege/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await fetch(
            `https://siege.hackclub.com/api/public-beta/user/${userId}`,
            {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
                },
                credentials: 'include',
                redirect: 'follow'
            }
        );

        const data = await response.json();

        data.projects.forEach(async (project, index) => {
            const response2 = await fetch(
                `https://siege.hackclub.com/api/public-beta/project/${project.id}`,
                {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
                    },
                    credentials: 'include',
                    redirect: 'follow'
                }
            );

            const projectData = await response2.json();
            console.log('Fetched project data:', projectData);
            //project.details = projectData;
            //data.projects[index].details = projectData;
            data.projects[index] = projectData;
        });

        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3031;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
