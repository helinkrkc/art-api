Art API

REST API for an interactive art platform. Each artwork is broken down into stops: ordered steps that describe a specific detail of the painting (a face, a symbol, a gesture) together with the zoom level and focus point used to present it.

This is the backend of the project. The React client lives in art-frontend.

Tech Stack
Node.js + Express
PostgreSQL with the pg driver (connection pool)
dotenv for configuration, cors for cross-origin requests
Features
GET /artworks returns all artworks (id, name, artist, image URL)
GET /artworks/:id returns one artwork together with its stops, sorted by stop_order
Parameterized queries ($1) to prevent SQL injection
Input validation with proper status codes: 400 invalid id, 404 not found, 500 server error
Credentials kept in .env, never committed
Database Schema

One-to-many relationship: one artwork has many stops.

sql
CREATE TABLE artworks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    artist VARCHAR(100),
    image_url VARCHAR(500),
    license VARCHAR(100),
    source_url VARCHAR(500)
);

CREATE TABLE artwork_stops (
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER REFERENCES artworks(id),
    stop_order INTEGER NOT NULL,
    description TEXT NOT NULL,
    zoom_scale NUMERIC,        -- CSS transform: scale(X)
    zoom_position VARCHAR(20)  -- CSS transform-origin, e.g. '50% 40%'
);
API Reference
GET /artworks
json
[
  { "id": 1, "name": "The Kiss", "artist": "Gustav Klimt", "image_url": "https://..." }
]
GET /artworks/:id
json
{
  "id": 1,
  "name": "The Kiss",
  "artist": "Gustav Klimt",
  "image_url": "https://...",
  "stops": [
    { "id": 1, "stop_order": 1, "description": "...", "zoom_scale": "2.5", "zoom_position": "50% 40%" }
  ]
}
Status	Meaning
200	Success
400	id is not a positive integer
404	No artwork with that id
500	Server or database error

PostgreSQL NUMERIC values are returned as strings by pg, so the client converts zoom_scale with Number().

Getting Started

Requirements: Node.js and a running PostgreSQL instance.

bash
git clone https://github.com/helinkrkc/art-api.git
cd art-api
npm install

Create a .env file in the project root:

DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=art_db
DB_PASSWORD=your_password
DB_PORT=5432

Create the database and tables using the schema above, then start the server:

bash
node index.js

The API runs on http://localhost:4001.

Project Structure
art-api/
├── db.js        # PostgreSQL connection pool
├── index.js     # Express app and routes
├── .env         # Local credentials (not committed)
└── package.json
Roadmap
 POST / PUT / DELETE endpoints (admin panel)
 Authentication
 Verify and record the license of every image (license, source_url)
Author

helinkrkc · Computer Engineering student · GitHub
