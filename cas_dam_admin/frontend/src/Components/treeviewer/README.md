#Test Data

The code below was used as example data to test the treebeard compoenent. Left here for future testing/
diagnosis/development. If it's 2021 and you're reading this, you can probably delete it.

```javascript 1.8
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
```