const express = require("express");
var cors = require("cors");
const fs = require("fs");
var mysql = require('mysql2');

// connecting to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'movies_db'
});


connection.connect((err) => {
  if (err) { console.log("DB Connection Failed."); return }

  // Initializing Express Server
  const app = express();
  app.use(cors({
    origin: "*",
  }));


  //Routes/Apis
  app.use("/readFile", async (req, res) => {
    res.end(await fs.readFileSync("./movie.json"))
  });


  // display
  app.get("/movie", (req, res) => {
    connection.query("SELECT * FROM movie;", (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

//   // search
  app.get("/movie/:m_id", (req, res) => {
    if (!req.params.m_id) {
      res.json({ error: "Id required" })
      return
    }
    var fno = req.params.m_id
    connection.query("SELECT * FROM movie WHERE m_id = " + fno, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

//   // // add
  app.get("/newMovie", (req, res) => {
    if (!req.query.m_id) {
      res.json({ error: "Movie_id required" })
      return
    }

    if (!req.query.mname) {
      res.json({ error: "Movie name required" })
      return
    }
    if (!req.query.release_date) {
      res.json({ error: "Release date required" })
      return
    }
    if (!req.query.collection) {
      res.json({ error: "Collection required" })
      return
    }
    if (!req.query.audi) {
      res.json({ error: "Auditorium is required" })
      return
    }
    if (!req.query.end_date) {
      res.json({ error: "End date is required" })
      return
    }
    if (!req.query.m_lang) {
        res.json({ error: "Language is required" })
        return
      }
      


    connection.query(`INSERT INTO movie(m_id,mname,release_date,collection,audi,times,end_date,m_lang) ` +
      `VALUES(${req.query.m_id},'${req.query.mname}','${req.query.release_date}','${req.query.collection}','${req.query.audi}','${req.query.times}','${req.query.end_date}','${req.query.m_lang}')`,
      (err, results, fields) => {
        if (err) return res.json({ error: err.message })
        res.json(results)
      })
  })

  // // update
  app.get("/updatemovie", (req, res) => {
    if (!req.query.m_id) {
      res.json({ error: "m_id" })
      return
    }
    if (!req.query.collection) {
      res.json({ error: "Collection required" })
      return
    }
    var m_id = req.query.m_id
    var collection = req.query.collection
    connection.query(`UPDATE movie SET collection = '${collection}' WHERE m_id = ${m_id}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

//   // delete
  app.get("/deletemovie", (req, res) => {
    if (!req.query.m_id) {
      res.json({ error: "movie_id required" })
      return
    }

    var fno = req.query.m_id
    connection.query(`DELETE FROM movie WHERE m_id = ${fno}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })


  //Port
  const port = 8000;

  //Starting a server
  app.listen(port, () => {
    console.log(`* SERVER STARTED AT PORT ${port} *`);
  });

})



// http://localhost:8000/newMovie?m_id=6&mname=ludo&release_date=2022-03-20&collection=20000&audi=4&end_date=2022-03-25&m_lang=french