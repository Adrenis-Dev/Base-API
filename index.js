/**
 * Base APIs feita para iniciantes.
 * Código simples, organizado e fácil de editar.
 * By: @dylanModz #equipetokitoapis
 * Peço que mantenha os créditos, por gentileza.
 * link do canal: https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u 
 * site oficial: https://tokito-apis.com.br
 */

const express = require('express')
const path = require('path')
const cors = require('cors')
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docs.html'))
})

app.get('/documentacao', (req, res) => {
  res.redirect('/docs')
})

app.get('/api/youtube-play', async (req, res) => {
  try {
    const q =
      req.query.q ||
      req.query.query ||
      req.query.texto ||
      req.query.text

    if (!q) {
      return res.status(400).json({
        status: false,
        criador: 'Dylan Modz',
        resultado: 'Parâmetro q obrigatório.'
      })
    }

    const resposta = await axios.get(
      'https://tokito-apis.site/api/youtube-play',
      {
        params: {
          query: q,
          q,
          apikey: 'SUA-KEY' // SÓ PRA VOCÊ TESTAR COMO FUNCIONA KKK
        },
        timeout: 120000,
        validateStatus: status => status >= 200 && status < 500
      }
    )

    const data = resposta.data

    if (!data?.status || !data?.resultado) {
      return res.status(500).json({
        status: false,
        criador: 'Dylan Modz',
        resultado:
          data?.resultado ||
          data?.message ||
          'Não foi possível encontrar a música.'
      })
    }

    const r = data.resultado

    return res.json({
      status: true,
      criador: 'Dylan Modz',
      resultado: {
        type: r.type || 'audio',
        title: r.title || 'Sem título',
        canal: r.canal || 'Não informado',
        duration: r.duration || 'Não informado',
        views: Number(r.views || 0),
        views_formatado: r.views_formatado || '0',
        image: r.image || r.thumbnail || '',
        thumbnail: r.thumbnail || r.image || '',
        url: r.url || '',
        filename: r.filename || '',
        download: r.download || ''
      }
    })

  } catch (e) {
    return res.status(500).json({
      status: false,
      criador: 'Dylan Modz',
      resultado: 'Erro ao consultar YouTube Play.',
      detalhe:
        e?.response?.data?.resultado ||
        e?.response?.data?.message ||
        e.message
    })
  }
})

app.use('/api', (req, res) => {
  res.status(404).json({
    status: false,
    criador: 'Dylan Modz',
    resultado: 'Rota da API não encontrada.'
  })
})

app.use((req, res) => {
  res.status(404).sendFile(
    path.join(__dirname, 'public', 'docs.html')
  )
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})