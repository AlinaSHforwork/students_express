var express = require('express');
var router = express.Router();
const db = require('../db/connector');

router.get('/', async function(req, res, next) {
  const students = await db.query('SELECT * FROM students');

  res.render('index', { students: students.rows || [] });
});

router.get('/create', async function(req, res, next) {
  res.render('forms/student_form');
})

router.post('/create', async function(req, res, next) {
  console.log("Submitted data: ", req.body);

  //validate input
  //add student to DB

  res.redirect(`/`);
})

module.exports = router;
