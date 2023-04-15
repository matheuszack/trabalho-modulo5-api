// Importa modulos necessarios
const conn = require('../model/mysql');

// Função de validação de dados
const usuariosValidador = require('../model/usuariosValidador');

// Objeto "controllerer" para a entidade "usuarios" do banco de dados.
const usuariosControl = {

  // Lista todos os registros válidos.
  getAll: async (req, res) => {
    try {
      const [rows] = await conn.query("SELECT * FROM usuarios WHERE usuario_status = 'on'");
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Lista um registro único pelo Id.
  getOne: async (req, res) => {
    try {
      var id = req.params.id;
      if ((id.match(/email=/))) {
        var [rows] = await conn.query("SELECT * FROM usuarios WHERE usuario_email = ? AND usuario_status = 'on'", [id.replace("email=", "")]);
      } else {
        var [rows] = await conn.query("SELECT * FROM usuarios WHERE usuario_id = ? AND usuario_status = 'on'", [id]);
      };
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Insere um novo registro.
  post: async (req, res) => {
    try {
      const { usuario_nome, usuario_genero, usuario_nascimento, usuario_peso, usuario_altura, usuario_tipo_sanguineo, usuario_imc, usuario_email, usuario_senha, usuario_reset_pergunta, usuario_reset_resposta, usuario_extra } = req.body;
      // VALIDAR DADOS
      const erro_validadar = usuariosValidador(usuario_nome, usuario_genero, usuario_nascimento, usuario_peso, usuario_altura, usuario_tipo_sanguineo, usuario_imc, usuario_email, usuario_senha, usuario_reset_pergunta, usuario_reset_resposta);
      if (!(erro_validadar == "VALIDACAO_OK")) {
        return res.json({ "status": "error", "message": erro_validadar });
      }

      const sql = "INSERT INTO usuarios (usuario_nome, usuario_genero, usuario_nascimento, usuario_peso, usuario_altura, usuario_tipo_sanguineo, usuario_imc, usuario_email, usuario_senha, usuario_reset_pergunta, usuario_reset_resposta, usuario_extra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, SHA1(?), ?, ?, ?)";
      const [rows] = await conn.query(sql, [usuario_nome, usuario_genero, usuario_nascimento, usuario_peso, usuario_altura, usuario_tipo_sanguineo, usuario_imc, usuario_email.toLowerCase(), usuario_senha, usuario_reset_pergunta, usuario_reset_resposta, usuario_extra]);
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Edita o registro pelo Id.
  put: async (req, res) => {
    try {
      const { usuario_nome, usuario_genero, usuario_nascimento, usuario_peso, usuario_altura, usuario_tipo_sanguineo, usuario_imc, usuario_email, usuario_senha, usuario_reset_pergunta, usuario_reset_resposta, usuario_extra, usuario_status } = req.body;
      const { id } = req.params;
      // VALIDAR DADOS
      const erro_validadar = usuariosValidador(usuario_nome, usuario_genero, usuario_nascimento, usuario_peso, usuario_altura, usuario_tipo_sanguineo, usuario_imc, usuario_email, usuario_senha, usuario_reset_pergunta, usuario_reset_resposta);
      if (!(erro_validadar == "VALIDACAO_OK")) {
        return res.json({ "status": "error", "message": erro_validadar });
      }

      const sql = "UPDATE usuarios SET usuario_nome = ?, usuario_genero = ?, usuario_nascimento = ?, usuario_peso = ?, usuario_altura = ?, usuario_tipo_sanguineo = ?, usuario_imc = ?, usuario_email = ?, usuario_senha = SHA1(?), usuario_reset_pergunta = ?, usuario_reset_resposta = ?, usuario_extra = ?, usuario_status = ? WHERE usuario_id = ?"
      const [rows] = await conn.query(sql, [usuario_nome, usuario_genero, usuario_nascimento, usuario_peso, usuario_altura, usuario_tipo_sanguineo, usuario_imc, usuario_email.toLowerCase(), usuario_senha, usuario_reset_pergunta, usuario_reset_resposta, usuario_extra, usuario_status, id]);
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Altera para 'del' um registro único pelo Id.
  delete: async (req, res) => {
    try {
      const { id } = req.params
      const sql = "UPDATE usuarios SET usuario_status = 'del' WHERE usuario_id = ?"
      const [rows] = await conn.query(sql, [id]);
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
};

// Exporta o módulo.
module.exports = usuariosControl;
