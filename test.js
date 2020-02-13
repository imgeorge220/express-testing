process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let pickles = { name: "pickles", price: 100 };

beforeEach(function () {
  items.push(pickles);
});

afterEach(function () {
  // mske sure this *mutates*, not redefines, `cats`
  items.length = 0;
});


describe("GET /items", function () {
  it("Gets a list of items", async function () {
    const resp = await request(app).get(`/items`);
    
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual([{ name: "pickles", price: 100 }]);
  });
});


describe("GET /items/:name", function () {
  it("Gets a list of items", async function () {
    console.log(pickles.name);
    const resp = await request(app).get(`/items/${pickles.name}`);
    
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ name: "pickles", price: 100 });
  });

  it("Responds with 404 if not founds", async function () {
    const resp = await request(app).get(`/items/0`);

    expect(resp.statusCode).toBe(404);
  });
});


describe("POST /items", function () {
  it("Adds to list of items", async function () {
    const resp = await request(app).post(`/items`).send({ 
      name: "fancypickles", price: 200 
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ added: { name: "fancypickles", price: 200 }});

    const respTest = await request(app).get(`/items/fancypickles`);
    expect(respTest.statusCode).toBe(200);
  });
});


describe("PATCH /items", function () {
  it("Adds to list of items", async function () {
    const resp = await request(app).patch(`/items/${pickles.name}`).send({ 
      name: "fancypickles", price: 200 
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ updated: { name: "fancypickles", price: 200 }});

    const respTest = await request(app).get(`/items/fancypickles`);
    expect(respTest.statusCode).toBe(200);
  });

  it("Responds with 404 if not founds", async function () {
    const resp = await request(app).patch(`/items/0`);

    expect(resp.statusCode).toBe(404);
  });
});


describe("DELETE /items", function () {
  it("Deletes to list of items", async function () {
    const resp = await request(app).delete(`/items/${pickles.name}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ message: "Deleted"});

    const respTest = await request(app).get(`/items/fancypickles`);
    expect(respTest.statusCode).toEqual(404);
  });

  it("Responds with 404 if not founds", async function () {
    const resp = await request(app).delete(`/items/0`);

    expect(resp.statusCode).toBe(404);
  });
});
