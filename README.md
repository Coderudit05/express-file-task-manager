# Express File Task Manager

A small learning project built with **Node.js, Express, EJS, and the file system API**. It demonstrates how a server-rendered app can create and manage simple text-based task notes without a database.

## Features

- List saved text files from the local `files/` directory
- Create a task with a title and details
- Open and read a saved task
- Edit a task's title and content
- Render pages with EJS templates

## Tech Stack

- Node.js
- Express 5
- EJS
- Node.js `fs` and `path` modules
- HTML forms and server-side rendering

## Run Locally

**Requirements:** a current LTS version of Node.js and npm.

```bash
git clone https://github.com/Coderudit05/express-file-task-manager.git
cd express-file-task-manager
npm install
npm start
```

Open [http://localhost:3000/page](http://localhost:3000/page).

For development with automatic restarts:

```bash
npm run dev
```

## Main Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/page` | List saved task files |
| POST | `/create` | Create a text task |
| GET | `/file/:filename` | View a task |
| GET | `/file/:filename/edit` | Open the edit form |
| POST | `/file/:filename/edit` | Save task changes |

## How It Works

Task details are stored as `.txt` files in the project's `files/` folder. Express handles requests, EJS renders the views, and Node's file-system APIs read and write the task files.

## Project Status and Limitations

This is an educational, local-use project, not a production-ready task service. It does not include user accounts, authorization, a database, or production-grade request and file-path security controls. Do not expose it to the public internet or store sensitive information in it without a security review.

## Learning Goals

- Build routes with Express
- Process HTML form submissions
- Render dynamic EJS templates
- Work with files using Node.js
- Validate and normalize user-provided filenames

---

Created as a hands-on Node.js and Express learning project by [Udit Namdev](https://github.com/Coderudit05).