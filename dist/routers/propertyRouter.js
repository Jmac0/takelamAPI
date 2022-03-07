"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertyController_1 = require("../controllers/propertyController");
const router = (0, express_1.Router)();
router.route('/').get(propertyController_1.getAllProperties).post(propertyController_1.createProperty);
router.route('/:id').get(propertyController_1.getProperty).patch(propertyController_1.updateProperty).delete(propertyController_1.deleteProperty);
exports.default = router;
