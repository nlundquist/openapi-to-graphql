'use strict'

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const Users = {
  erik: {
    name: 'Erik Wittern',
    address: {
      street: '270 East 10th Street',
      city: 'New York City'
    },
    employerId: 'ibm',
    hobbies: ['lion dancing', 'doing CEO stuff'],
    status: 'staff',
    nomenclature: {
      suborder: 'Haplorhini',
      family: 'Hominidae',
      genus: 'Homo',
      species: 'sapiens'
    }
  },
  jim: {
    name: 'Jim Laredo',
    address: {
      street: '6 Dogwood',
      city: 'Katonah'
    },
    employerId: 'ibm',
    hobbies: ['lion dancing', 'baseball'],
    status: 'staff',
    nomenclature: {
      suborder: 'Haplorhini',
      family: 'Hominidae',
      genus: 'Homo',
      species: 'sapiens'
    }
  },
  ginni: {
    name: 'Ginni Rometti',
    address: {
      street: '345 Business Street',
      city: 'Armonk'
    },
    employerId: 'ibm',
    hobbies: ['chess', 'tennis'],
    status: 'staff',
    nomenclature: {
      suborder: 'Haplorhini',
      family: 'Hominidae',
      genus: 'Homo',
      species: 'sapiens'
    }
  },
  bill: {
    name: 'Bill Gates',
    address: {
      street: '123 Some Street',
      city: 'Redmond'
    },
    employerId: 'microsoft',
    hobbies: ['making money', 'making more money'],
    status: 'alumni',
    nomenclature: {
      suborder: 'Haplorhini',
      family: 'Hominidae',
      genus: 'Homo',
      species: 'ihavelotsofmoneyus'
    }
  }
}

const Companies = {
  ibm: {
    id: 'ibm',
    name: 'International Business Machines Corporation',
    legalForm: 'public',
    ceoUsername: 'ginni',
    offices: [{
      street: '122 Some Street',
      city: 'Redmond'
    }, {
      street: '124 Some Street',
      city: 'Redmond'
    }]
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    legalForm: 'public',
    ceoUsername: 'bill',
    offices: [{
      street: '300 Some Street',
      city: 'Redmond'
    }, {
      street: '301 Some Street',
      city: 'Redmond'
    }]
  }
}

const Products = {
  'product-name': 'Super Product'
}

const Patents = {
  'Windows': {
    patentId: '100',
    inventorId: 'bill'
  }
}

const Projects = {
  'OASGraph': {
    projectId: 1,
    active: true,
    leadId: 'erik'
  },
  'API Harmony': {
    projectId: 2,
    active: false,
    leadId: 'jim'
  }
}

const Auth = {
  erik: {
    username: 'erik123',
    password: 'password123',
    accessToken: 'abcdef'
  },
  jim: {
    username: 'catloverxoxo',
    password: 'IActuallyPreferDogs',
    accessToken: '123456'
  },
  ginni: {
    username: 'ginni',
    password: 'password',
    accessToken: 'xyz'
  },
  bill: {
    username: 'windowsrulez',
    password: 'stevejobsisabully',
    accessToken: 'ijk'
  }
}

const authMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    let encoded = req.headers.authorization.split(' ')[1]
    let decoded = new Buffer(encoded, 'base64').toString('utf8').split(':')

    if (decoded.length === 2) {
      let credentials = {
        username: decoded[0],
        password: decoded[1]
      }
      for (let user in Auth) {
        if (Auth[user].username === credentials.username && Auth[user].password === credentials.password) {
          return next()
        }
      }
      res.status(401).send({
        message: 'Incorrect credentials'
      })
    } else {
      res.status(401).send({
        message: 'Basic Auth expects a single username and a single password'
      })
    }
  } else if ('access_token' in req.headers) {
    for (let user in Auth) {
      if (Auth[user].accessToken === req.headers.access_token) {
        return next()
      }
    }
    res.status(401).send({
      message: 'Incorrect credentials'
    })
    return false
  } else if ('access_token' in req.query) {
    for (let user in Auth) {
      if (Auth[user].accessToken === req.query.access_token) {
        return next()
      }
    }
    res.status(401).send({
      message: 'Incorrect credentials'
    })
  } else {
    res.status(401).send({
      message: 'Unknown/missing credentials'
    })
  }
}

app.get('/api/users', (req, res) => {
  console.log(req.method, req.path)
  const limit = req.query.limit
  if (typeof limit === 'string') {
    res.send(Object.values(Users).slice(0, Number(limit)))
  } else {
    res.send(Object.values(Users))
  }
})

app.get('/api/users/:username', (req, res) => {
  console.log(req.method, req.path)
  res.send(Users[req.params.username])
})

app.get('/api/usersWith2XX/:username', (req, res) => {
  console.log(req.method, req.path)
  res.send(Users[req.params.username])
})

app.get('/api/users/:username/car', (req, res) => {
  console.log(req.method, req.path)
  if (typeof req.params.username !== 'string' ||
    req.params.username === 'undefined') {
    res.status(401).send({
      message: 'Wrong username.'
    })
  } else {
    res.send({
      model: 'BMW 7 series',
      color: 'black',
      tags: {
        impression: 'decadent'
      },
      kind: 'LIMOSINE'
    })
  }
})

app.post('/api/users', (req, res) => {
  console.log(req.method, req.path)
  let user = req.body
  if (!('name' in user) ||
    !('address' in user) ||
    !('employerId' in user) ||
    !('hobbies' in user)) {
    res.status(400).send({
      message: 'wrong data'
    })
  } else {
    Users[user.name] = user
    res.status(201).send(user)
  }
})

app.get('/api/companies/:id', (req, res) => {
  console.log(req.method, req.path)
  res.send(Companies[req.params.id])
})

app.get('/api/products/:id', (req, res) => {
  console.log(req.method, req.path, req.params, req.query)
  Products['product_id'] = req.params['id']
  Products['product-tag'] = req.query['product-tag']
  res.send(Products)
})

app.get('/api/products/:id/reviews', (req, res) => {
  console.log(req.method, req.path, req.params, req.query)
  if (typeof req.params.id === 'undefined' ||
    req.params.id === 'undefined' ||
    typeof req.query['product-tag'] === 'undefined' ||
    req.query['product-tag'] === 'undefined') {
    res.status(400).send({
      message: 'wrong data'
    })
  } else {
    res.status(200).send([
      {text: 'Great product', timestamp: 1502787600000000},
      {text: 'I love it', timestamp: 1502787400000000}
    ])
  }
})

app.post('/api/products', (req, res) => {
  console.log(req.method, req.path)
  let product = req.body
  if (!('product-name' in product) ||
    !('product-id' in product) ||
    !('product-tag' in product)) {
    res.status(400).send({
      message: 'wrong data'
    })
  } else {
    res.status(201).send(product)
  }
})

app.get('/api/status', (req, res) => {
  console.log(req.method, req.path, req.query, req.headers)
  if (typeof req.query.limit === 'undefined' ||
    typeof req.get('exampleHeader') === 'undefined') {
    res.status(400).send({
      message: 'wrong request'
    })
  } else {
    res.send('Ok.')
  }
})

app.get('/api/secure', (req, res) => {
  console.log(req.method, req.path, req.query, req.headers)
  if (req.get('authorization') !== 'Bearer abcdef') {
    res.status(401).send({
      message: 'missing authorization header'
    })
  } else {
    res.send('A secure message.')
  }
})

app.get('/api/patents/:id', authMiddleware, (req, res) => {
  console.log(req.method, req.path)
  for (let patent in Patents) {
    if (Patents[patent].patentId === req.params.id) {
      return res.send(Patents[patent])
    }
    res.status(404).send({message: 'Patent does not exist.'})
  }
})

app.get('/api/projects/:id', authMiddleware, (req, res) => {
  console.log(req.method, req.path)
  let p
  for (let project in Projects) {
    if (Projects[project].projectId === Number(req.params.id)) {
      p = Projects[project]
    }
  }
  if (p) {
    res.send(p)
  } else {
    res.status(404).send({message: 'Project does not exist.'})
  }
})

app.post('/api/projects', authMiddleware, (req, res) => {
  console.log(req.method, req.path)
  let project = req.body
  if (!('project-id' in project) ||
    !('lead-id' in project)) {
    res.status(400).send({
      message: 'wrong data'
    })
  } else {
    res.status(201).send(project)
  }
})

app.listen(3000, () => {
  console.log('Example API accessible on port 3000')
})
