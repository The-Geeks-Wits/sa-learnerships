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

router.get('/skills', (req, res) => {
    res.json(req.app.locals.skills);
});

router.get('/locations', (req, res) => {
    const provinces = req.app.locals.locations.provinces;
    res.json(provinces);   
});

module.exports = router;