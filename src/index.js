import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pets } from "./dados.js";
import { randomUUID } from "crypto";
import {
  validateBodyMiddleware,
  validateQueryMiddleware,
} from "./middlewares.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// ----- Routes -----

// GET | retorna a lista de pets
app.get("/pets", [validateQueryMiddleware], (req, res) => {
  try {
    const { nome, raca, idadeMax, idadeMin, nome_tutor } = req.query;

    let data = pets;

    if (nome) {
      data = pets.filter((pet) => pet.nome.includes(nome));
    }

    if (raca) {
      data = pets.filter((pet) => pet.raca.includes(raca));
    }

    if (idadeMax) {
      data = pets.filter((pet) => pet.idade <= idadeMax);
    }

    if (idadeMin) {
      data = pets.filter((pet) => pet.idade >= idadeMin);
    }

    if (nome_tutor) {
      data = pets.filter((pet) => pet.nome_tutor.includes(nome_tutor));
    }

    res
      .status(200)
      .send({ ok: true, mensagem: "Lista de pets obtida com sucesso", data });
  } catch (error) {
    res
      .status(500)
      .send({ ok: false, message: "Erro ao obter a lista de pets" });
  }
});

// GET | retorna um pet específico
app.get("/pets/:id", (req, res) => {
  try {
    const { id } = req.params;

    const pet = pets.find((pet) => pet.id === id);

    if (!pet) {
      return res.status(404).send({ ok: false, message: "Pet não encontrado" });
    }

    res.status(200).send({ ok: true, mensagem: "Pet obtido com sucesso", pet });
  } catch (error) {
    res.status(500).send({ ok: false, message: error.toString() });
  }
});

// POST | cria um novo pet
app.post("/pets", [validateBodyMiddleware], (req, res) => {
  try {
    const { nome, raca, idade, nome_tutor } = req.body;

    const pet = {
      id: randomUUID(),
      nome,
      raca,
      idade,
      nome_tutor,
    };

    pets.push(pet);

    res.status(201).send({ ok: true, message: "Pet criado com sucesso", pet });
  } catch (error) {
    res.status(500).send({ ok: false, message: error.toString() });
  }
});

// PUT | atualiza um pet
app.put("/pets/:id", [validateBodyMiddleware], (req, res) => {
  try {
    const { id } = req.params;
    const { nome, raca, idade, nome_tutor } = req.body;

    const pet = pets.find((pet) => pet.id === id);

    if (!pet) {
      return res.status(404).send({ ok: false, message: "Pet não encontrado" });
    }

    pet.nome = nome;
    pet.raca = raca;
    pet.idade = idade;
    pet.nome_tutor = nome_tutor;

    res
      .status(200)
      .send({ ok: true, message: "Pet atualizado com sucesso", pet });
  } catch (error) {
    res.status(500).send({ ok: false, message: error.toString() });
  }
});

// DELETE | deleta um pet
app.delete("/pets/:id", (req, res) => {
  try {
    const { id } = req.params;

    const pet = pets.findIndex((pet) => pet.id === id);

    if (pet === -1) {
      return res.status(404).send({ ok: false, message: "Pet não encontrado" });
    }

    pets.splice(pet, 1);

    res.status(200).send({ ok: true, message: "Pet deletado com sucesso" });
  } catch (error) {
    res.status(500).send({ ok: false, message: error.toString() });
  }
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on port ${port}`));
