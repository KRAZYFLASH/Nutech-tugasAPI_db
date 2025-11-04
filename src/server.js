import "dotenv/config";
import app from "./app.js";
import connectCloudinary from "./config/cloudinary.js";

const PORT = process.env.PORT || 3000;

connectCloudinary();

app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });