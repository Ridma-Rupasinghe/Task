
## Run locally

### Backend

```powershell
cd backend
pip install -r requirements.txt
python run_server.py
```

- Health check: `http://127.0.0.1:8000/health`
- Agenda APIs: `GET /get-all-sessions`, `GET /get-all-keywords`, `GET /sessions?query=...`
- Invite API: `POST /generate-invite`
- Generated files (auto-created): `backend/data/sessions.py`, `backend/data/keywords.py`
- Optional LLM: set `OPENAI_API_KEY` (see `backend/.env.example`)

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

