var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next)
{
	res.render('admin', { title: 'Admin' });
});

router.get('/panel', function (req, res, next)
{
	console.log(req.cookies.password);
	if (req.cookies.password == 'IchLiebeDeutsch')
	{
		res.render('panel');
	} else
	{
		res.redirect('/admin?error=true');
	}
});

module.exports = router;
