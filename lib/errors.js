const setUpErrorHandling = (app) => {
    app.error(error => {
        console.error(error);
    });
}

module.exports = {
    setUpErrorHandling
}