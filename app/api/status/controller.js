const mongoose = require('mongoose')

const status = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
}

exports.currentStatus = function (req, res) {
  const { readyState } = mongoose.connection

  if (readyState === 1) {
    return res.status(200).send({
      status: 'OK'
    })
  } else {
    res.status(500).send({ error: `Database connection is ${status[readyState]}! It is not connected!` })
  }
}