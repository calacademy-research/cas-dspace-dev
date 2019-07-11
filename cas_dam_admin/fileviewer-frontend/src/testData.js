/*
Test Data used for tree proof of concept,
not important nor critical to the current performance
 of the tree, but useful in creating new tree structures.
 */


const datum = {
  name: "root",
  toggled: false,
  filepath: '',
  children: [
    {
      name: "parent",
      children: [
        {
          name: "child1",
          filepath: ''
        },
        {
          name: "child2",
          filepath: '',
        }
      ],
      filepath: '',
    },
    {
      name: "loading parent",
      loading: true,
      children: [],
      filepath: '',
    },
    {
      name: "parent",
      filepath: '',
      children: [
        {
          name: "nested parent",
          filepath: '',
          children: [
            {
              name: "nested child 1",
              filepath: ''
             },
            {
              name: "nested child 2",
              filepath: ''
            }
          ],
        }
      ]

    }
  ]
};

export { datum };
