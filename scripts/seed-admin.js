import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB via MONGODB_URI found in .env");

        const email = process.env.ADMIN_EMAIL || "admin@example.com";
        const password = process.env.ADMIN_PASSWORD || "adminpassword";
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Admin user already exists");
        } else {
            await User.create({
                name: "Admin User",
                email,
                password: hashedPassword,
                role: "admin",
            });
            console.log(`Admin user created: ${email} / ${password}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin user:", error);
        process.exit(1);
    }
}

seed();
