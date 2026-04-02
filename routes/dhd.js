import express from "express"
const router = express.Router();
import db from "../db/connector.js";
import { registerHousewife, deleteHousewife, updateHousewife, checkPassword, checkReason, checkUsername, checkSeason} from "../controllers/dhdController.js";


router.get('/', async function(req, res, next) {
  const dhd = await db.query('SELECT * FROM desperate_housewives_1');

  const modDhd = dhd.rows.map(w => {
    return {
      ...w,
      created_at: w.created_at.toLocaleDateString()
    }
  })
  res.render('dhd', { dhd: modDhd || [] });
});


router.get('/addHousewife', function(req, res) {
  res.render('forms/dhd/dhd_form', { 
    username: '', season: '', reason: '', character_notes: '' 
  });
});

router.post('/addHousewife', async function(req, res) {
  console.log("Submitted data: ", req.body);

  // Оскільки у формі name="password_hash", дістаємо його ПРЯМО
  const { username, password_hash, season, reason, character_notes } = req.body;

  try {
    // Викликаємо функцію з контролера
    await registerHousewife(username, password_hash, season, reason, character_notes);
    res.redirect('/dhd');
  } catch (err) {
    console.error("Помилка реєстрації:", err.message);
    res.status(500).render('forms/dhd/dhd_form', {
      ErrorPassword: "Проблема з паролем або даними",
      username, season, reason, character_notes 
    });
  }
});


router.get('/delete', async function(req, res, next) {
  res.render('forms/dhd/dhd_delete');
})

router.post('/delete', async function(req, res, next) {
  const { username, password } = req.body; 

  try {
    await deleteHousewife(username, password);
    res.redirect('/dhd');
  } catch (err) {
    if (err.message === 'Invalid password') {
      res.status(403).send('Invalid password');
    } else {
      res.status(500).send(`!! Error deleting housewife: ${username}`);
    }
  }
});

export default router;