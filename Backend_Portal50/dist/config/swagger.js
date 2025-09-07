"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Portal 50+ API',
            version: '1.0.0',
            description: 'Documentación de la API de Portal 50+ con Express y TypeScript',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // rutas donde están las anotaciones JSDoc
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
