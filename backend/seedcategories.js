const mongoose = require('mongoose');
const Category = require('./models/Category'); // Ensure this path is correct
require('dotenv').config(); // Load environment variables from .env file

// Define your product categories with subcategories
const productCategory = [
  {
    id: 1,
    label: "மளஂளிகை பொருட்கள்",
    value: "மளஂளிகை பொருட்கள்",
    subCategories: ["பொது மளஂளிகை", "மளஂளிகை எண்ணெய்"]
  },
  {
    id: 2,
    label: "வீட்டு உபயோக பொருட்கள்",
    value: "வீட்டு உபயோக பொருட்கள்",
    subCategories: ["சாதனங்கள்", "சேமிப்புப்பொருட்கள்"]
  },
  {
    id: 3,
    label: "அழகு சாதன பொருட்கள்",
    value: "அழகு சாதன பொருட்கள்",
    subCategories: ["சோப்பு", "மோதிரம்", "கேஸ்கள்"]
  },
  {
    id: 4,
    label: "உணவு பொருட்கள்",
    value: "உணவு பொருட்கள்",
    subCategories: ["காய்கறிகள்", "அரிசி", "மிளகு"]
  },
  {
    id: 5,
    label: "பூஜை பொருட்கள்",
    value: "பூஜை பொருட்கள்",
    subCategories: ["மல்லிகை", "திருச்செந்தூர் பூ"]
  },
  {
    id: 6,
    label: "சிறுதானிய பொருட்கள்",
    value: "சிறுதானிய பொருட்கள்",
    subCategories: ["பருப்பு", "பால்", "முட்டை"]
  },
  {
    id: 7,
    label: "எண்ணெய்",
    value: "எண்ணெய்",
    subCategories: ["நெய்", "எள்ளு எண்ணெய்", "கொல்லு எண்ணெய்"]
  },
  {
    id: 8,
    label: "Offers",
    value: "Offers",
    subCategories: ["தள்ளுபடி", "சிறப்பு குறைவுகள்"]
  }
];

// Database connection function
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

// Seed the categories into the database
async function seedCategories() {
  try {
    await connectDB(); // Connect to the database

    // Clear existing categories if needed
    await Category.deleteMany(); // Ensure that the collection is empty

    // Insert each category into the database sequentially
    for (const category of productCategory) {
      const subCategories = category.subCategories.map(subCategory => ({
        name: subCategory, // Map subCategories to the required schema structure
      }));

      const newCategory = new Category({
        name: category.value,
        subCategories: subCategories // Use the subCategories array
      });

      await newCategory.save(); // Wait for the save to complete
      console.log(`Category "${category.value}" with subcategories ${category.subCategories.join(', ')} seeded successfully!`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding categories', error);
    mongoose.connection.close();
  }
}

// Run the seed function
seedCategories();
