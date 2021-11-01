const mysql = require('mysql')

const login_info = {
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'test',
  multipleStatements: true,
}

const MYSQL_POOL = mysql.createPool(login_info)

function handleDisconnect(pool, conn) {
  conn.destroy()
  let intervalId = setInterval(
    () =>
      pool.getConnection((err, connection) => {
        if (err) {
          console.log(new Date(), 'Error when connecting to db :', err.code)
        } else {
          conn = connection
          conn.release()
          clearInterval(intervalId)
        }
      }),
    2000
  )
}

MYSQL_POOL.on('connection', (connection) => {
  console.log(new Date(), "MySQL Connection created")
  connection.on('error', (err) => {
    handleDisconnect(MYSQL_POOL, connection)
    console.error(new Date(), 'MySQL Connection error', err.code)
  })
  connection.on('close', (err) =>
    console.error(new Date(), 'MySQL Connection close', err)
  )
})


cleanUpServer = (e) => MYSQL_POOL.end(() => process.exit(0))


[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, cleanUpServer.bind(eventType))
})

module.exports = {
  MYSQL_POOL
}