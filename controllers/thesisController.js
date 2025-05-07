const ThesisGroup = require("../models/ThesisGroup");
const User = require("../models/User");

// Fetch thesis post by gsuite
exports.getThesisByGsuite = async (req, res) => {
  try {
    console.log("getThesisByGsuite: Route reached");
    const { gsuite } = req.query; // Get gsuite from query params
    if (!gsuite) {
      console.log("getThesisByGsuite: Gsuite not provided");
      return res.status(400).json({ error: "Gsuite is required" });
    }

    console.log("getThesisByGsuite: Searching for gsuite =", gsuite);
    const results = await ThesisGroup.find({ email: gsuite });
    console.log("getThesisByGsuite: Results =", results);
    res.status(200).json(results);
  } catch (err) {
    console.error("getThesisByGsuite error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Add a new thesis group (with check for existing post)
exports.addThesisGroup = async (req, res) => {
  try {
    const { email } = req.body; // email should be the user's gsuite
    if (!email) {
      return res.status(400).json({ error: "Gsuite email is required" });
    }

    // Check if a post already exists for this gsuite
    const existingPost = await ThesisGroup.findOne({ email });
    if (existingPost) {
      console.log("addThesisGroup: Post already exists for gsuite =", email);
      return res.status(400).json({ error: "A post already exists for this gsuite. Please edit or delete your existing post." });
    }

    const newGroup = new ThesisGroup(req.body);
    await newGroup.save();
    console.log("addThesisGroup: New post created =", newGroup);
    res.status(201).json(newGroup);
  } catch (err) {
    console.error("addThesisGroup error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Update a thesis group
exports.updateThesisGroup = async (req, res) => {
  try {
    const thesisId = req.params.id;
    const { email } = req.body; // email should be the user's gsuite
    if (!email) {
      return res.status(400).json({ error: "Gsuite email is required" });
    }

    // Find the post by gsuite
    const thesisGroup = await ThesisGroup.findOne({ email });
    if (!thesisGroup) {
      return res.status(404).json({ error: "Thesis group not found for this gsuite" });
    }

    // Verify the post matches the ID
    if (thesisGroup._id.toString() !== thesisId) {
      return res.status(403).json({ error: "Post ID does not match the gsuite's post" });
    }

    // Update the post
    const updatedGroup = await ThesisGroup.findByIdAndUpdate(thesisId, req.body, { new: true });
    if (!updatedGroup) {
      return res.status(404).json({ error: "Thesis group not found" });
    }

    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error("updateThesisGroup error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete a thesis group
exports.deleteThesisGroup = async (req, res) => {
  try {
    const thesisId = req.params.id;
    const { email } = req.body; // email should be the user's gsuite
    if (!email) {
      return res.status(400).json({ error: "Gsuite email is required" });
    }

    // Find the post by gsuite
    const thesisGroup = await ThesisGroup.findOne({ email });
    if (!thesisGroup) {
      return res.status(404).json({ error: "Thesis group not found for this gsuite" });
    }

    // Verify the post matches the ID
    if (thesisGroup._id.toString() !== thesisId) {
      return res.status(403).json({ error: "Post ID does not match the gsuite's post" });
    }

    await ThesisGroup.findByIdAndDelete(thesisId);
    res.status(200).json({ message: "Thesis group deleted successfully" });
  } catch (err) {
    console.error("deleteThesisGroup error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Existing methods (getAllThesisGroups, searchByDomain) remain unchanged
exports.getAllThesisGroups = async (req, res) => {
  try {
    const thesisGroups = await ThesisGroup.find();
    res.status(200).json(thesisGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchByDomain = async (req, res) => {
  try {
    let domains = req.query.domain;
    if (!domains) {
      return res.status(400).json({ error: "Domain query parameter is required" });
    }
    if (!Array.isArray(domains)) {
      domains = [domains];
    }
    domains = domains.map(d => d.trim()).filter(d => d);
    if (domains.length === 0) {
      return res.status(400).json({ error: "At least one valid domain is required" });
    }
    const results = await ThesisGroup.find({
      possibleDomains: { $in: domains.map(d => new RegExp(d, 'i')) },
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};