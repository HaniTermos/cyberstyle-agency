const db = require("../Database//queries/caseQueries");

async function getAllProjects(req, res) {
  const projects = await db.getAllProjects();
  console.log("projects: ", projects);
  res.render("projects/index", { projects: projects });
}

async function getProjectById(req, res) {
  const { id } = req.params;
  const project = await db.getProjectById(id);
  const items = await db.getItemsByProjectId(id);
  res.render("projects/show", { project, items });
}
async function createNewProjectGet(req, res) {
  const projects = await db.getAllProjects(); 
  res.render("projects/new", { projects: projects });
}

async function createNewProjectPost(req, res) {
  const { project } = req.body;
  await db.createNewProject(project);
  res.redirect("/projects");
}

async function updateProjectGet(req, res) {
  const { id } = req.params;
  const project = await db.getProjectById(id);
  res.render("projects/edit", { project });
}

async function updateProjectPost(req, res) {
  const { id } = req.params;
  const { project } = req.body;
  await db.updateProject(id, project);
  res.redirect("/projects");
}

async function deleteProjectPost(req, res) {
  const { id } = req.params;
  await db.deleteProject(id);
  res.redirect("/projects");
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
