const express = require('express');
const router = express.Router();

router.get('/qualifications', (req, res) => {
    res.json(req.app.locals.qualifications);
});

router.get('/institutions', (req, res) => {
    const inst = req.app.locals.institutions;
    const groups = [
        { label: 'Universities', options: inst.universities },
        { label: 'Universities of Technology', options: inst.universitiesOfTechnology },
        { label: 'TVET Colleges', options: inst.tvetColleges },
    ];
    res.json(groups);
});

module.exports = router;