const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['https://notely-app-indol.vercel.app', 'http://localhost:5173'], // Allow both deployed and local frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());

// Health check endpoint for server status
app.get("/", (_, res) => res.json({ 
  status: "online", 
  message: "Notes API is live!",
  timestamp: new Date().toISOString()
}));

// Wake up endpoint
app.get("/wake-up", (_, res) => res.json({ 
  status: "awake", 
  message: "Server is awake now!",
  timestamp: new Date().toISOString() 
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use("/api/notes", noteRoutes);

mongoose
  .connect("mongodb://atlas-sql-684cff99e60b984fafb11c65-eox7oj.a.query.mongodb.net/Jdatabase?ssl=true&", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((e) => console.error("❌ MongoDB error:", e));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
