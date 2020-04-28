const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeRepositoryId(request,response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({error:  "Invalid repository"})
  }

  return next();
}

app.use('/repositories/:id', validadeRepositoryId)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title , url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {  url, title, techs } = request.body;

  const index = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (index < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  if (request.body.likes) {
    return response.status(403).json(repositories[index]);
  }

  const repository = {
    id,
    url,
    title,
    techs,
  };

  repositories[index] = repository;

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);

  if(index < 0) {
    return response.status(400).json({error: 'Repositore not Found'});
  }

  repositories.splice(index,1);
  return response.status(204).json({message: "Repository deleted"});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (index < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories[index].likes += 1;

  return response.json(repositories[index]);
});

module.exports = app;
