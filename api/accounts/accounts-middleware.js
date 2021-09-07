const Accounts = require('./accounts-model')
const db = require('./../../data/db-config')

exports.checkAccountPayload = (req, res, next) => {
  const {name, budget} = req.body
  const error = { status: 400 }

  if (name === undefined || budget === undefined) {
    error.message = "name and budget are required"
  } else if (typeof name !== 'string') {
    error.message = 'name of account must be a string'
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    error.message = 'name of account must be between 3 and 100'
  } else if (typeof budget !== 'number' || isNaN(budget)) {
    error.message = 'budget of account must be a number'
  } else if (budget < 0 || budget > 1000000) {
    error.message = 'budget of account is too large or too small'
  }
  
  if (error.message) {
    next(error)
  } else {
    next()
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  const { name } = req.body

  try {
    const taken = await db('accounts').where('name', name.trim()).first()
    
    taken ? res.status(400).json({message:'that name is taken'})
    : next()
  } catch(err) {
    next(err)
  }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Accounts.getById(req.params.id)
    if (!account) {
      res.status(404).json({message: 'account not found'})
        next()
    } else {
      req.account = account
      next()
    }
  } catch(err) {
    next(err)
  }
}
