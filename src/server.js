import "dotenv/config";
import app from "./app.js";
import connectCloudinary from "./config/cloudinary.js";

const PORT = process.env.PORT;

connectCloudinary();

app.listen(PORT, () => {
      console.log(`Server running: http://localhost:${PORT}`);
    });