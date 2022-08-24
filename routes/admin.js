var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next)
{
	res.render('admin', { title: 'Admin' });
});

router.get('/panel', function (req, res, next)
{
	if (
		req.cookies.password ==
		"79ff096ec5a934f2bf6962db6aca7779a03e616adad3439520b597293fab06fae20b9d50c3f745b27b7bb941c1549343e602378ef2169ac4d99d95a799cb3be1"
	) {
		res.render("panel");
	} else {
		res.redirect("/admin?error=true");
	}
});

module.exports = router;
