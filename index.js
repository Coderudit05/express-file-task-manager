const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// set view engine
app.set("view engine", "ejs");

// middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// routes

app.get("/page", (req, res) => {
  const folderPath = path.join(__dirname, "files"); // ✅ Correct folder path

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      // even if error, pass empty array so EJS doesn’t crash
      return res.render("index", { files: [] });
    }

    console.log("Files found:", files);
    res.render("index", { files }); // ✅ pass files to EJS
  });
});
app.post("/create", (req, res) => {
  const { title, details } = req.body;

  // 1️⃣ Sanitize title for safe filename
  let safeTitle = title.trim().toLowerCase(); // remove extra spaces, lowercase
  safeTitle = safeTitle.replace(/\s+/g, "_"); // replace spaces with underscores
  safeTitle = safeTitle.replace(/[^a-z0-9_-]/g, ""); // remove invalid characters

  // 2️⃣ Check if title became empty after sanitization
  if (!safeTitle) {
    return res
      .status(400)
      .send("Invalid file name. Please use letters and numbers only.");
  }

  // 3️⃣ Create full file path
  const filePath = path.join(__dirname, "files", `${safeTitle}.txt`);

  // 4️⃣ Optional: Prevent overwriting existing file
  if (fs.existsSync(filePath)) {
    return res.status(400).send("A task with this title already exists!");
  }

  // 5️⃣ Write the file
  fs.writeFile(filePath, details, (err) => {
    if (err) {
      console.error("❌ Error writing file:", err);
      return res.status(500).send("Error creating file.");
    }

    console.log(`✅ Task saved: ${filePath}`);
    res.redirect("/page");
  });
});

// Another Router to show file content

app.get("/file/:filename", (req, res) => {

  const fileName = req.params.filename; // e.g., 'task1'
  const filePath = path.join(__dirname, "files", `${fileName}.txt`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(404).send("File not found or cannot be read.");
    }

    // Render a new EJS template to show file details
    res.render("file", { fileName, data });
  });
});


// GET: Edit file page
app.get('/file/:filename/edit', (req, res) => {

  const fileName = req.params.filename; // e.g. "myfirstdayin_college"
  const filePath = path.join(__dirname, 'files', `${fileName}.txt`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(404).send('File not found.');
    }

    // Render edit.ejs page with file name and file content
    
    // Firstly printing content on console to verify
    console.log('File content:', data);
    res.render('edit', { fileName, content: data }); // here content means file content
  });
});

// Now add the POST route to handle form submission for editing file

app.post('/file/:filename/edit', (req, res) => {
  const originalName = req.params.filename;  // current file name (without .txt)
  const { title, content } = req.body;       // new data from form

  // ✅ Step 1: sanitize the new title (so it’s a safe file name)
  const safeTitle = title.trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');

  if (!safeTitle) {
    return res.status(400).send('Invalid title. Please use letters/numbers only.');
  }

  // ✅ Step 2: set paths
  const oldPath = path.join(__dirname, 'files', `${originalName}.txt`);
  const newPath = path.join(__dirname, 'files', `${safeTitle}.txt`);

  // ✅ Step 3: write new content to file
  fs.writeFile(newPath, content, 'utf8', (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Failed to save changes.');
    }

    // ✅ Step 4: if user changed file name, delete old file
    if (safeTitle !== originalName) {
      fs.unlink(oldPath, (unlinkErr) => {
        if (unlinkErr) console.warn('Old file not deleted:', unlinkErr);
      });
    }

    console.log(`✅ File "${safeTitle}.txt" updated successfully.`);
    // ✅ Step 5: redirect back to file detail page
    res.redirect(`/file/${safeTitle}`);
  });
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
