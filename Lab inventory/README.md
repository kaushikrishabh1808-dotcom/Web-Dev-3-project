# Inventory Management System - Lab 3 (Alternative)

This version implements the same Assignment 3 requirements with a different folder structure, API naming, field names, validation style, and report responses.

## Run
1. Install Node.js and MongoDB.
2. Open this folder in VS Code.
3. `npm install`
4. Copy `.env.example` to `.env`
5. `npm start`

## Postman
Base URL: http://localhost:3000

POST /api/inventory
GET /api/inventory
GET /api/inventory/:id
PUT /api/inventory/:id
PATCH /api/inventory/:id/stock
DELETE /api/inventory/:id
GET /api/reports/low-stock
GET /api/reports/category-summary

Example POST body:
{
  "productName":"Modern Sofa",
  "code":"SOFA-101",
  "category":"Sofas",
  "price":19999,
  "stock":8,
  "reorderLevel":3,
  "description":"Three-seater fabric sofa"
}
