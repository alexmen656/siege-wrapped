import express from 'express';
//import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

//app.use(cors());
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

        if (!response.ok) {
            return res.status(response.status).json({ error: `API returned ${response.status}` });
        }

        const data = await response.json();

        if (!data.projects || !Array.isArray(data.projects)) {
            return res.json(data);
        }

        const projectFetches = data.projects.map(async (project) => {
            const r = await fetch(`https://siege.hackclub.com/api/public-beta/project/${project.id}`, {
                method: 'GET',
                headers: { 'accept': 'application/json' },
                redirect: 'follow'
            });

            if (!r.ok) {
                console.warn(`Project ${project.id} fetch failed: ${r.status}`);
                return { ...project, detailsError: `HTTP ${r.status}` };
            }

            const projectData = await r.json();
            return { ...projectData };
        });

        const projectsWithDetails = await Promise.all(projectFetches);
        data.projects = projectsWithDetails;

        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/siege/leaderboard/', async (req, res) => {
    try {
        const response = await fetch(
            `https://siege.hackclub.com/api/public-beta/leaderboard/`,
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
