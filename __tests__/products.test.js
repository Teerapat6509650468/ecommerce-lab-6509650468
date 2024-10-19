const request = require('supertest');
const app = require('../app');

describe('Product API Tests', () => {
    // Write your test cases here
    describe('GET /products', () => {
        it('should return all products', async () => {
            const response = await request(app).get('/products');
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ id: 1, name: 'Laptop', price: 1000, stock: 5 }),
                expect.objectContaining({ id: 2, name: 'Smartphone', price: 600, stock: 10 })
            ]));
        });
    });
    
    describe('GET /products/:id', () => {
        it('should return a product by ID', async () => {
            const response = await request(app).get('/products/1');
    
            expect(response.statusCode).toBe(200); 
            expect(response.body).toEqual(expect.objectContaining({ id: 1, name: 'Laptop', price: 1000, stock: 5 }));
        });
    
        it('should return 404 if product not found', async () => {
            const response = await request(app).get('/products/999');
    
            expect(response.statusCode).toBe(404); 
            expect(response.body).toEqual({ message: 'Product not found' }); 
        });
    });

    describe('POST /products', () => {
        it('should add a new product', async () => {
            const newProduct = {
                name: 'Tablet',
                price: 300,
                stock: 15
            };
    
            const response = await request(app).post('/products').send(newProduct);
    
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newProduct));
    
            const productsResponse = await request(app).get('/products');
            expect(productsResponse.body).toHaveLength(3);
            expect(productsResponse.body).toEqual(expect.arrayContaining([
                expect.objectContaining(newProduct)
            ]));
        });
    }); 
    
    describe('PUT /products/:id', () => {
        it('should update the name of an existing product', async () => {
            const updatedProduct = { name: 'Updated Laptop' };
    
            const response = await request(app).put('/products/1').send(updatedProduct);
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                id: 1,
                name: 'Updated Laptop',
                price: 1000, // Original price should remain unchanged
                stock: 5
            }));
            
            const productResponse = await request(app).get('/products/1');
            expect(productResponse.body).toEqual(expect.objectContaining({
                id: 1,
                name: 'Updated Laptop',
                price: 1000,
                stock: 5
            }));
        });
    
        it('should update the price of an existing product', async () => {
            const updatedProduct = { price: 1200 };
    
            const response = await request(app).put('/products/1').send(updatedProduct);
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                id: 1,
                name: 'Updated Laptop', // Name should remain unchanged
                price: 1200,
                stock: 5
            }));
    
            const productResponse = await request(app).get('/products/1');
            expect(productResponse.body).toEqual(expect.objectContaining({
                id: 1,
                name: 'Updated Laptop',
                price: 1200,
                stock: 5
            }));
        });
    
        it('should update both name and price of an existing product', async () => {
            const updatedProduct = {
                name: 'New Laptop',
                price: 1300
            };
    
            const response = await request(app).put('/products/1').send(updatedProduct);
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                id: 1,
                name: 'New Laptop',
                price: 1300,
                stock: 5
            }));
    
            const productResponse = await request(app).get('/products/1');
            expect(productResponse.body).toEqual(expect.objectContaining({
                id: 1,
                name: 'New Laptop',
                price: 1300,
                stock: 5
            }));
        });
    
        it('should return 404 if product not found', async () => {
            const updatedProduct = { name: 'Non-existent Product' };
            const response = await request(app).put('/products/999').send(updatedProduct);
    
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ message: 'Product not found' });
        });
    });    
    
    describe('DELETE /products/:id', () => {
        it('should delete a product', async () => {
            const initialResponse = await request(app).get('/products');
            const productIdToDelete = initialResponse.body[0].id;
    
            const response = await request(app).delete(`/products/${productIdToDelete}`);
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'Product deleted' });
    
            const productsResponse = await request(app).get('/products');
            expect(productsResponse.body).toHaveLength(2);
            expect(productsResponse.body).not.toEqual(expect.arrayContaining([
                expect.objectContaining({ id: productIdToDelete })
            ]));
        });
    
        it('should return 404 if product not found', async () => {
            const response = await request(app).delete('/products/999');
    
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ message: 'Product not found' });
        });
    });
    
});