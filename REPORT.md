## Live URLs

### Back End

- URL: 
- Health check: `http://127.0.0.1:8000/health`
- Agenda APIs: `GET /get-all-sessions`, `GET /get-all-keywords`, `GET /sessions?query=...`
- Invite API: `POST /generate-invite`

### Front End

- URL: 


## Local Setup Guide:

See `README.md`.


## Prompt Strategy:

- The LLM is strictly grounded in data from `agenda.txt`. Only the matched session's title, time, speaker, keywords, and description are provided to the model, while prompt rules prevent it from inventing topics, speakers, timings, venue details, or other agenda information. To further reduce hallucinations, responses are generated with a low temperature setting and fall back to a deterministic template whenever invalid content is detected or an API key is unavailable.
