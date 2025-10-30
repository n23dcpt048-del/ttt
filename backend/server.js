import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Xác định đường dẫn tuyệt đối đến file db.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json"); // ⚠️ Không cần "backend/" nữa

// Middleware
app.use(cors());
app.use(express.json());

// Hàm đọc dữ liệu từ db.json
function getEvents() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data).events;
}

// API: Lấy toàn bộ sự kiện
app.get("/events", (req, res) => {
  const events = getEvents();
  res.json(events);
});

// API: Lọc theo loại & tổ chức
app.get("/events/filter", (req, res) => {
  const { type, org } = req.query;
  let events = getEvents();

  if (type && type !== "Loại sự kiện" && type !== "– Không chọn –") {
    events = events.filter(e => e.type === type);
  }

  if (org && org !== "Tổ chức" && org !== "– Không chọn –") {
    events = events.filter(e => e.org === org);
  }

  res.json(events);
});

// API: Thêm sự kiện mới
app.post("/events", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  const newEvent = req.body;
  newEvent.id = Date.now();
  data.events.push(newEvent);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  res.status(201).json(newEvent);
});

// Kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("🎉 Backend PTIT Event đang hoạt động!");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend chạy tại http://localhost:${PORT}`);
});
