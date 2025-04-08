# Using Nuxt CRUD CLI

This document provides examples of how to use the Nuxt CRUD CLI tool.

## Installation

First, install the CLI tool globally:

```bash
npm install -g nuxt-crud-cli
```

Or use it directly with npx:

```bash
npx nuxt-crud-cli generate
```

## Basic Usage

1. Navigate to your Nuxt project:

```bash
cd my-nuxt-project
```

2. Run the generate command:

```bash
nuxt-crud generate
```

3. Follow the interactive prompts:

```
? What is the name of the resource? (singular, e.g. "post") product
? What do you want to generate? All (Controller, Requests, Resources)
? Which requests do you want to generate? Store, GetAll, GetOne, Update, Delete
? API version (e.g. "v1")? v1
? Do you want to create route files (index.ts and [id].ts)? Yes
```

## Generated Structure

The above example will generate the following structure in your project:

```
server/
  api/
    v1/
      products/
        ProductController.ts
        [id].ts
        index.ts
        handlers/
          create.ts
          delete.ts
          getAll.ts
          getOne.ts
          update.ts
        requests/
          DeleteProductRequest.ts
          GetAllProductsRequest.ts
          GetOneProductRequest.ts
          StoreProductRequest.ts
          UpdateProductRequest.ts
        resources/
          productCollection.ts
          productResource.ts
          types.ts
```

## Generating Individual Components

You can also generate individual components:

```bash
nuxt-crud generate
```

Then choose the specific resource type:

```
? What is the name of the resource? (singular, e.g. "post") category
? What do you want to generate? Controller
? API version (e.g. "v1")? v1
```

This will generate only a controller:

```
server/
  api/
    v1/
      categories/
        CategoryController.ts
```

## Development

To contribute to this project:

1. Clone the repository
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run: `npm start`

## License

MIT
