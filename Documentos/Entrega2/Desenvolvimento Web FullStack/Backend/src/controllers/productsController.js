import { pool } from '../db.js';

const select = `
  SELECT idProduto, nomeProduto, categoria, descricao, preco, rating, reviews, imagem, emEstoque
  FROM produto
`;

export async function getProdutos(req, res) {
  try {
    const { categoria, preco_max, rating_min, em_estoque } = req.query;
    let query = `${select} WHERE 1=1`;
    const params = [];

    if (categoria) {
      query += ` AND categoria = ?`;
      params.push(categoria);
    }
    if (preco_max) {
      query += ` AND preco <= ?`;
      params.push(parseFloat(preco_max));
    }
    if (rating_min) {
      query += ` AND rating >= ?`;
      params.push(parseFloat(rating_min));
    }
    if (em_estoque === 'true') {
      query += ` AND emEstoque = TRUE`;
    }

    query += ` ORDER BY idProduto DESC`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('getProdutos:', err.message);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
}

export async function getProdutoById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`${select} WHERE idProduto = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto nao encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('getProdutoById:', err.message);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
}

export async function createProduto(req, res) {
  const { nomeProduto, categoria, descricao, preco, rating, reviews, emEstoque } = req.body;

  if (!nomeProduto || !categoria || !preco) {
    return res.status(400).json({ error: 'nomeProduto, categoria e preco sao obrigatorios' });
  }

  try {
    const imagem = req.file ? 'uploads/' + req.file.filename : null;

    const [result] = await pool.query(
      'INSERT INTO produto (nomeProduto, categoria, descricao, preco, rating, reviews, imagem, emEstoque) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nomeProduto, categoria, descricao || null, preco, rating || 0, reviews || 0, imagem, emEstoque !== false]
    );

    res.status(201).json({
      idProduto: result.insertId,
      nomeProduto,
      categoria,
      descricao,
      preco,
      rating: rating || 0,
      reviews: reviews || 0,
      imagem,
      emEstoque: emEstoque !== false,
    });
  } catch (err) {
    console.error('createProduto:', err.message);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
}

export async function updateProduto(req, res) {
  const { id } = req.params;
  const { nomeProduto, categoria, descricao, preco, rating, reviews, emEstoque } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM produto WHERE idProduto = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto nao encontrado' });
    }

    const updates = [];
    const params = [];

    if (nomeProduto) {
      updates.push('nomeProduto = ?');
      params.push(nomeProduto);
    }
    if (categoria) {
      updates.push('categoria = ?');
      params.push(categoria);
    }
    if (descricao !== undefined) {
      updates.push('descricao = ?');
      params.push(descricao || null);
    }
    if (preco !== undefined) {
      updates.push('preco = ?');
      params.push(preco);
    }
    if (rating !== undefined) {
      updates.push('rating = ?');
      params.push(rating);
    }
    if (reviews !== undefined) {
      updates.push('reviews = ?');
      params.push(reviews);
    }
    if (emEstoque !== undefined) {
      updates.push('emEstoque = ?');
      params.push(emEstoque);
    }
    if (req.file) {
      updates.push('imagem = ?');
      params.push('uploads/' + req.file.filename);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    params.push(id);
    await pool.query(
      `UPDATE produto SET ${updates.join(', ')} WHERE idProduto = ?`,
      params
    );

    const [updated] = await pool.query(`${select} WHERE idProduto = ?`, [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('updateProduto:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

export async function deleteProduto(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM produto WHERE idProduto = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto nao encontrado' });
    }

    await pool.query('DELETE FROM produto WHERE idProduto = ?', [id]);
    res.json({ message: 'Produto excluido com sucesso' });
  } catch (err) {
    console.error('deleteProduto:', err.message);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
}
