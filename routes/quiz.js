var express = require('express');
var router = express.Router();

let questions = require('../data/questions.js');

const db = require('quick.db');

/* GET home page. */
router.get('/', function (req, res, next)
{
	res.render('quiz');
});

router.get('/questions', function (req, res, next)
{
	res.send(questions);
});

router.post('/score', function (req, res, next)
{
	if (!req.body.name)
	{
		return res.status(400).send('Name is required');
	}

	db.set(`scores.${req.body.name}`, req.body);
	res.status(200).send("OK");
});

router.get('/scores', function (req, res, next)
{
	res.send(db.get('scores'));
});

module.exports = router;
