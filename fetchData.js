import mongoose from "mongoose";

const MONGO_URI =
    "mongodb+srv://rameshbhaipatel3747:rameshbhai3747@cluster0.zkjrokj.mongodb.net/test";

await mongoose.connect(MONGO_URI);

console.log("✅ Connected to MongoDB");

const collections = [
    "abouts",
    "admins",
    "attendances",
    "blogs",
    "contacts",
    "coursehighlights",
    "courses",
    "ctadatas",
    "features",
    "footers",
    "heros",
    "herosections",
    "hires",
    "inquiries",
    "internshipapplications",
    "internships",
    "projects",
    "servicebookings",
    "services",
    "servicesheros",
    "students",
    "testimonials",
    "users"
];

// model cache (important fix)
const models = {};

function getModel(name) {
    if (!models[name]) {
        models[name] = mongoose.model(
            name,
            new mongoose.Schema({}, { strict: false }),
            name
        );
    }
    return models[name];
}

async function transferAll() {
    for (let col of collections) {
        try {
            const Source = getModel(col);
            const Target = mongoose.connection.useDb("yugantar_db").model(
                col,
                new mongoose.Schema({}, { strict: false }),
                col
            );

            const data = await Source.find();

            if (data.length === 0) {
                console.log(`⚠️ ${col} is empty`);
                continue;
            }

            // 🔥 IMPORTANT FIX: remove duplicates first
            await Target.deleteMany({});

            await Target.insertMany(data);

            console.log(`✅ ${col} transferred (${data.length} docs)`);
        } catch (err) {
            console.log(`❌ Error in ${col}:`, err.message);
        }
    }

    console.log("🚀 ALL DATA TRANSFER COMPLETE");
    process.exit();
}

transferAll();