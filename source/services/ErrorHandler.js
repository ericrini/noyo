module.exports = (error, request, response, next) => {
    console.log(error.stack);

    if (error.name === "SyntaxError") {
        return response.status(400).json({
            message: error.message
        });
    }

    if (error.name === "BadRequestError") {
        return response.status(400).json({
            message: error.message
        });
    }

    if (error.name === "NotFoundError") {
        return response.status(404).json({
            message: error.message
        });
    }

    response.status(500).json({
        message: "An unexpected error occurred."
    });
}
