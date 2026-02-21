import mongoose from "mongoose";
import Department from "./models/Department.js";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
};

const checkDepartments = async () => {
    await connectToDatabase();
    try {
        const departments = await Department.find();
        console.log("Departments found:", departments.length);
        if (departments.length > 0) {
            console.log(departments);
        } else {
            console.log("No departments found in the database.");
        }
    } catch (error) {
        console.error("Error fetching departments:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

checkDepartments();
