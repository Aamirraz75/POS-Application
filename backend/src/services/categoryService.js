const categoryRepository = require("../repositories/categoryRepository");

async function getCategories() {
    return await categoryRepository.getAllCategories();
}

module.exports = {
    getCategories
};