const categories = [
  {
    _id: '6296001fa3fc2b38ee5f23d6',
    name: 'Clothings',
    slug: 'Clothings',
  },

  {
    _id: '62960055a3fc2b38ee5f23dc',
    name: 'Men',
    slug: 'Men',
    parentId: '6296001fa3fc2b38ee5f23d6',
  },
  {
    _id: '6296074a50f5a7789c69dbfe',
    name: 'Electronics',
    slug: 'Electronics',
  },

  {
    _id: '6296076a50f5a7789c69dc01',
    name: 'Accessories',
    slug: 'Accessories',
    parentId: '6296074a50f5a7789c69dbfe',
  },
  {
    name: 'Mobile',
    slug: 'Mobile',
    parentId: '6296076a50f5a7789c69dc01',
    _id: '62976512bb6d0f3ae54f1bca',
  },
  {
    name: 'Samsung',
    slug: 'Samsung',
    parentId: '62976512bb6d0f3ae54f1bca',
    _id: '6297652dcc0825b2bfba31cf',
  },
  {
    name: 'IPhone',
    slug: 'IPhone',
    parentId: '62976512bb6d0f3ae54f1bca',
    _id: '6297654e77a145a54b0f5dad',
  },
  {
    name: 'Walton',
    slug: 'Walton',
    parentId: '62976512bb6d0f3ae54f1bca',
    _id: '62976562d27979f141f4c799',
  },

  {
    name: 'Laptop',
    slug: 'Laptop',
    parentId: '6296076a50f5a7789c69dc01',
    _id: '629764a083c3282077e21d18',
  },

  {
    name: 'HP',
    slug: 'HP',
    parentId: '629764a083c3282077e21d18',
    _id: '629764ce7cdba96de4422cfd',
  },

  {
    name: 'Elitebook 840 G3',
    slug: 'Elitebook-840-G3',
    parentId: '629764ce7cdba96de4422cfd',
    _id: '629764f21dc833fdb5ef9454',
  },

  {
    _id: '62976366b5efb4c9890989b2',
    name: 'Wearable Accessories',
    slug: 'Wearable-Accessories',
    parentId: '6296076a50f5a7789c69dc01',
  },

  {
    _id: '6297635fb5efb4c9890989ae',
    name: 'Smart Watch',
    slug: 'Smart-Watch',
    parentId: '62976366b5efb4c9890989b2',
  },

  {
    _id: '6296ac71b18d742c889a0e18',
    name: 'Appliances',
    slug: 'Appliances',
    parentId: '6296074a50f5a7789c69dbfe',
  },

  {
    _id: '6296acd5366ec14ecd6c5152',
    name: 'Home Appliances',
    slug: 'Home-Appliances',
    parentId: '6296ac71b18d742c889a0e18',
  },
  {
    _id: '6296a5bb47a56375002f7c87',
    name: 'Television',
    slug: 'Television',
    parentId: '6296acd5366ec14ecd6c5152',
  },

  {
    name: 'Women',
    slug: 'Women',
    parentId: '6296001fa3fc2b38ee5f23d6',
    _id: '6297661091f7cc4d529cc972',
  },
  {
    name: 'Saari',
    slug: 'Saari',
    parentId: '6297661091f7cc4d529cc972',
    _id: '62976675297a9a02e74dea11',
  },

  {
    name: '3 Pieces',
    slug: '3-Pieces',
    parentId: '6297661091f7cc4d529cc972',
    _id: '629766977566f7c54eadbd94',
  },
];

export default categories;
