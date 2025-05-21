## Controller Optimization via `select` in Prisma

### Purpose

To **optimize the API performance** by reducing the size of the payload and database response time, this application makes use of Prisma's [`select`](https://www.prisma.io/docs/orm/prisma-client/queries/select-fields) feature. This ensures that **only required fields are retrieved** from the database in read and write operations.

---

### Why `select`?

* **Faster query execution** (fewer columns retrieved).
* **Reduced payload size** over the network.
* **Avoid leaking sensitive data** (e.g., passwords, tokens).
* Better caching efficiency (only essential data is cached).
* Easier frontend integration (fewer unnecessary fields).

---

### Usage Pattern

In each controller, queries using `prisma.model.findMany`, `findUnique`, `create`, or `update` include a `select` object specifying the exact fields to retrieve.

**Example:**

```ts
const product = await prisma.product.findUnique({
  where: { productId: req.params.id },
  select: {
    productId: true,
    productName: true,
    categoryId: true,
    subCategoryId: true,
    brandId: true
  }
});
```

---

### Affected Controllers

The following controllers have been optimized using `select`:

| Model      | Controller Function                                                     | Selected Fields                                                      |
| ---------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `product`  | `handleGetAllProducts` / `handleGetProduct` / `handleSearchProducts`    | `productId`, `productName`, `categoryId`, `subCategoryId`, `brandId` |
| `warranty` | `handleCreateWarranty` / `handleGetAllWarranties` / `handleGetWarranty` | Only ID in creation; includes relations in reads                     |
| `vendor`   | `handleGetAllVendors` / `handleGetVendor` / `handleSearchVendors`       | `vendorId`, `vendorName`, `vendorContact`, etc.                      |
| `user`     | `handleUpdateUser`                                                      | `userId`, `email`, `username`, `firstname`, `lastname`, etc.         |

---

### Notes

* If you omit `select`, Prisma returns **all fields**, which increases load and response size unnecessarily.
* Prisma doesn’t support `select: { field: false }`, so you must **explicitly include** desired fields.
* When you need related models, prefer `include` only if absolutely necessary (e.g., joining related models like `product` and `vendor` in `warranty` fetches).

---

### When to Avoid `select`

* If you're dynamically generating responses where all fields are required.
* If you're using the object internally and need the full shape for further processing (then use filtering later in code).
