export function validateBodyMiddleware(req, res, next) {
  const { nome, raca, idade, nome_tutor } = req.body;

  if (!nome) {
    return res
      .status(400)
      .send({ ok: false, message: "O campo nome é obrigatório" });
  }

  if (!raca) {
    return res
      .status(400)
      .send({ ok: false, message: "O campo raca é obrigatório" });
  }

  if (!idade) {
    return res
      .status(400)
      .send({ ok: false, message: "O campo idade é obrigatório" });
  }

  if (!nome_tutor) {
    return res
      .status(400)
      .send({ ok: false, message: "O campo nome_tutor é obrigatório" });
  }

  next();
}

export function validateQueryMiddleware(req, res, next) {
  if (
    Object.keys(req.query).length !== 0 &&
    !Object.keys(req.query).includes("nome") &&
    !Object.keys(req.query).includes("raca") &&
    !Object.keys(req.query).includes("idadeMax") &&
    !Object.keys(req.query).includes("idadeMin") &&
    !Object.keys(req.query).includes("nome_tutor")
  ) {
    return res.status(400).json({
      ok: false,
      message: "Parâmetros inválidos",
    });
  }

  next();
}
