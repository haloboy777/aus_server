const POOL = require('./mysqlConfig').MYSQL_POOL

const search = (req, res) => {
  let { q } = req.query
  if (!q) return res.status(400).json({ err: 'query is not present' })
  console.log("search came : ", q)

  POOL.getConnection((err, con) => {
    if (err) res.json({ err: err.message })
    else {
      let sql = 'SELECT * FROM film_locations WHERE MATCH(title,location,director,writer,actor1,actor2,actor3) AGAINST(? IN BOOLEAN MODE) limit 5;'
      con.query(sql, q, (e1, results) => {
        con.release()
        if (e1) res.status(500).json({ err: e1 })
        else res.json(results)
      })
    }
  })
}

const getActor = (req, res) => {
  let { actor } = req.query
  if (!actor) return res.status(400).json({ err: 'no actor requested' })
  POOL.getConnection((err, con) => {
    if (err) res.json({ err: err.message })
    else {
      let sql = 'SELECT * FROM film_locations WHERE actor1 = ? or actor2 = ? or actor3 = ?;'
      con.query(sql, [actor, actor, actor], (e1, results) => {
        con.release()
        if (e1) res.status(500).json({ err: "Server Error" })
        else res.json(results)
      })
    }
  })
}

const getFilmLocations = (req, res) => {
  let { film } = req.query
  if (!film) return res.status(400).json({ err: 'no film requested' })
  POOL.getConnection((err, con) => {
    if (err) res.json({ err: err.message })
    else {
      let sql = 'SELECT title, location FROM film_locations WHERE title = ?;'
      con.query(sql, film, (e1, results) => {
        con.release()
        if (e1) res.status(500).json({ err: "Server Error" })
        else res.json(results)
      })
    }
  })
}

module.exports = {
  search,
  getActor,
  getFilmLocations
}