## 1. Live URLs

### Back End

- URL: https://task-czhh.onrender.com
- Health check: `https://task-czhh.onrender.com/health`
- Agenda APIs: `GET /get-all-sessions`, `GET /get-all-keywords`, `GET /sessions?query=...`
- Invite API: `POST /generate-invite`

### Front End

- URL: https://cogent-solutions-task.netlify.app/


## 2. Local Setup Guide:

See `README.md`.


## 3. Content Creation Check:

Conference engagement shouldn't begin and end with a registration form. Our AI-powered event personalization platform analyzes attendee interests, matches them with the most relevant sessions, and automatically generates tailored invitations grounded in verified agenda content. For conference planners, this means higher attendee relevance, stronger engagement, and a more personalized event experience at scale.



## 4. Prompt Strategy:

The LLM is strictly grounded in data from `agenda.txt`. Only the matched session's title, time, speaker, keywords, and description are provided to the model, while prompt rules prevent it from inventing topics, speakers, timings, venue details, or other agenda information. To further reduce hallucinations, responses are generated with a low temperature setting and fall back to a deterministic template whenever invalid content is detected or an API key is unavailable.
