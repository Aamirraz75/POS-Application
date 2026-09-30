const categoryService = require("../services/categoryService");

async function getCategories(req, res) {
    try {
        const categories = await categoryService.getCategories();

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getCategories
};