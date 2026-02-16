const db = require("../Database/queries/projectsQueries"); // Fixed path

// Validation helper
const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

async function getAllProjects(req, res, next) {
  try {
    const projects = await db.getAllProjects();
    res.render("projects/index", { projects });
  } catch (error) {
    next(error);
  }
}

async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    
    if (!isValidUUID(id)) {
      return res.status(400).render("error", { message: "Invalid project ID" });
    }
    
    const project = await db.getProjectById(id);
    
    if (!project) {
      return res.status(404).render("404", { message: "Project not found" });
    }
    
    // TODO: Fix this - getItemsByProjectId doesn't exist
    // const items = await db.getItemsByProjectId(id);
    
    res.render("projects/show", { project, items: [] });
  } catch (error) {
    next(error);
  }
}

async function createNewProjectGet(req, res) {
  // Remove unnecessary DB call
  res.render("projects/new");
}

async function createNewProjectPost(req, res, next) {
  try {
    const projectData = req.body.project || req.body; // Handle both structures
    
    // Validation
    if (!projectData?.title || !projectData?.slug) {
      return res.status(400).render("projects/new", { 
        error: "Title and slug are required",
        project: projectData 
      });
    }
    
    await db.createNewProject(projectData);
    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
}

async function updateProjectGet(req, res, next) {
  try {
    const { id } = req.params;
    
    if (!isValidUUID(id)) {
      return res.status(400).render("error", { message: "Invalid ID" });
    }
    
    const project = await db.getProjectById(id);
    
    if (!project) {
      return res.status(404).render("404", { message: "Project not found" });
    }
    
    res.render("projects/edit", { project });
  } catch (error) {
    next(error);
  }
}

async function updateProjectPost(req, res, next) {
  try {
    const { id } = req.params;
    const projectData = req.body.project || req.body;
    
    if (!isValidUUID(id)) {
      return res.status(400).render("error", { message: "Invalid ID" });
    }
    
    await db.updateProject(id, projectData);
    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
}

async function deleteProjectPost(req, res, next) {
  try {
    const { id } = req.params;
    
    if (!isValidUUID(id)) {
      return res.status(400).render("error", { message: "Invalid ID" });
    }
    
    await db.deleteProject(id);
    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createNewProjectGet,
  createNewProjectPost,
  updateProjectGet,
  updateProjectPost,
  deleteProjectPost
};