# Account Map • Hackathon Version Polished

> [!NOTE]
> **Award-winning hackathon project, now being rebuilt as a local-first, zero-knowledge app.**
> Try the live demo at [demo.accountmap.org](https://demo.accountmap.org). Your map stays in your browser and is never uploaded.

![3D Map View](./public/screen.png)

## Description

This web application helps users manage their different login methods to each account they have made.

## Team Members

- [Andrii Malakhovtsev](https://github.com/malakhovtsev) - <malakhovtsev.2@wright.edu>
- [Brianna Persinger](https://github.com/BBBree) - <persinger.9@wright.edu>
- [Owen Kemp](https://github.com/Striker2783) - <kemp.56@wright.edu>
- [Sulav Pradhan](https://github.com/sulav-pradhan) - <pradhan.49@wright.edu>
- [Wens Kedar Barambona](https://github.com/b-wens-kedar) - <barambona.3@wright.edu>

[About page with more members information](https://demo.accountmap.org/about)

## Awards
🏆 [Awarded](https://www.linkedin.com/posts/logankrause2_github-henrikd1215hackathon26-2-activity-7426641579467182080-mo65/) "[Riverside Research](https://github.com/riversideresearch)'s CyberSecurity Stalwarts" </br>
🏆 [Recommended](https://andrii-malakhovtsev.com/assets/accountmap-recommendation.pdf) by "Wright State University CEG/CS Alumni Society"

## History

### Planning phase
<img width="2587" height="1898" alt="image" src="https://github.com/user-attachments/assets/72a201ac-b8a4-4806-99f4-c4b0a437e915" />

### Trello Collaboration
<img width="1282" height="636" alt="image" src="https://github.com/user-attachments/assets/90e8a0f1-c675-4123-be5e-97f2b4c1997d" />


###



## How to Run

The hosted demo is now **frontend-only**: each browser keeps its own map in `localStorage`, the map is never uploaded, and the recovery analysis runs in the browser. Service logos are fetched from Google's favicon service and Simple Icons by service name, and the data is not encrypted, so don't enter real accounts.

```sh
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in frontend/dist
```

### Original full-stack version

The version judged at the hackathon used an Express + Prisma + PostgreSQL backend with a Gemini analysis endpoint. That code is still in [`backend/`](./backend) for reference, but the frontend no longer calls it. To run the full-stack version as it was, check out a tag:

- [`v0.1.0-hackathon`](../../tree/v0.1.0-hackathon): the submission as judged (Feb 6–7, 2026, ~23 hours)
- [`v0.2.0-polished`](../../tree/v0.2.0-polished): post-hackathon polish, last full-stack version

```sh
git checkout v0.2.0-polished
docker compose up -d   # frontend :8080, backend :8081, postgres :5432
```

## Original Architecture (full-stack version)

```
_______________________________________
Frontend (React)
Port: 8080
- User Interface with JSX components
- Graphs (react-force-graph)
- State Management (zustand)
_______________________________________
|
| Http Requests
v
_______________________________________
Backend API (Express.js)
- Port: 8081
- RESTful endpoints
- Prisma Setup (Database)
_______________________________________
|
| Prisma Interaction
v
_______________________________________
PostgresSQL DB
Port: 5432
- User Tables
- Relational Data
_______________________________________
```

## Project Structure

### Backend

```sh
prisma
   prisma.schema # The database schemas
   migrations # Database migrations
src
   lib
      prisma.ts # Exposes Prisma Connection
      utils.ts # Exposes Express.js
   index.ts # Setup for Express.js
   routes # Contains the endpoints
Dockerfile # Docker
package.json # Dependencies
```

### Frontend

```sh
components # Contains the components used in the UI
src
   assets # Images and such
   pages # Map or List Views
   store # State Management
   utils
      iconService.js # Icons
   App.jsx # Main UI
Dockerfile # Docker
package.json # Dependencies
```

## Images

### 3D View

![3D View](./public/screen.png)

<img width="1394" height="827" alt="image" src="https://github.com/user-attachments/assets/17b2a361-8ef5-4d73-8771-2132351d60cd" />


### 2D View

![2D View](./public/2d.png)

<img width="1397" height="828" alt="image" src="https://github.com/user-attachments/assets/0a141de9-ca48-42a5-a311-0a21c10be8f3" />


### List Connections View

![List Connections View](<./public/list connections.png>)

<img width="1395" height="828" alt="image" src="https://github.com/user-attachments/assets/97ca62ba-4a11-4d0a-82fe-97076f783fe0" />


### List Accounts View

![List Accounts View](<./public/list accounts.png>)

<img width="1397" height="825" alt="image" src="https://github.com/user-attachments/assets/4bd0d943-f0e6-4791-948c-cc24fb71c12f" />

