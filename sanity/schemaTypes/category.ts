export default {
    name: 'category',
    type: 'document',
    title: 'Categories',
    fields: [
      {
        name: 'name',
        title: 'Name of Category',
        type: 'string',
      },
      {
        name: 'images',
        type: 'array',
        title: 'Product Images',
        of: [{type: 'image'}],
      },
    ],
  }