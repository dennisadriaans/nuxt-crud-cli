# Nuxt CRUD CLI

A command-line tool for generating API resources for Nuxt 3 CRUD applications.

> [!WARNING]  
> This package is not tested and highly experimental.

## Installation

```bash
npm install -g nuxt-crud-cli
```

Or use it directly with npx:

```bash
npx nuxt-crud-cli generate
```

## Usage

The CLI tool provides an interactive interface to generate API resources for your Nuxt 3 application.

```bash
# Generate a resource
nuxt-crud generate

# Show help
nuxt-crud --help
```

## What it Generates

This tool can generate the following components for your API:

1. **Controllers**: Handle business logic for your resources
2. **Handlers**: Process incoming HTTP requests and route them to controllers
3. **Requests**: Validate incoming request data using Zod schemas
4. **Resources**: Transform data for API responses

## Examples

Generate a complete `product` resource:

```bash
nuxt-crud generate
```

Then follow the interactive prompts to:
1. Enter a resource name (e.g., "product")
2. Choose what to generate (e.g., "All")
3. Select which handlers to generate
4. Select which requests to generate
5. Enter the API version (default: "v1")
6. Choose whether to create route files

## Resource Structure

The generated resources follow this structure:

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

## License

MIT