
const MainRoute = app => {
    app.get('/',(req, res, next) => {
        const { protocol } = req;
        const url = `${protocol}://${req.get('host')}/`;
        const allRoutes = {
            stands:     `${url}stands`,
            characters: `${url}characters`,
            episodes:   `${url}episodes`,
        }
        res.json(allRoutes);
    });
}

module.exports = { MainRoute };