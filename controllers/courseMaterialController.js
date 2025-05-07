const CourseMaterial = require("../models/CourseMaterial");

// Add course material (admin only)
exports.addCourseMaterial = async (req, res) => {
  try {
    const { courseCode, youtubePlaylists, driveFolderLinks } = req.body;

    const material = new CourseMaterial({
      courseCode,
      youtubePlaylists,
      driveFolderLinks,
    });

    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get all course materials
exports.getAllCourseMaterials = async (req, res) => {
  try {
    const materials = await CourseMaterial.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseMaterialByCode = async (req, res) => {
  try {
    const courseMaterial = await CourseMaterial.findOne({ courseCode: req.params.courseCode.toUpperCase(), });
    if (!courseMaterial) {
      return res.status(404).json({ message: "Course material not found" });
    }
    res.status(200).json(courseMaterial);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course material", error: error.message });
  }
};

// Update course material by ID (admin only)
exports.updateCourseMaterial = async (req, res) => {
  try {
    const updated = await CourseMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete course material by ID (admin only)
exports.deleteCourseMaterial = async (req, res) => {
  try {
    await CourseMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
