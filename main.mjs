import { produce } from 'immer';

let getFields = (obj) => {
    let depth = 0;
    let stack = [];
    let fields = [];
    let eachRecursive_ = (obj) => {
        depth++;
        for (let k in obj) {
            if (typeof obj[k] == "object" && obj[k] !== null) {
                fields.push([...stack, k])
                stack.push(k)
                eachRecursive_(obj[k]);
                stack.pop()
            }
        }
        depth--;
    }
    eachRecursive_(obj);
    return fields;
}

let compare = (obj1, obj2) => {
    // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
    let isNumeric = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    let fields1 = getFields(obj1);
    for (let f of [[], ...fields1]) {
        let fStr = '';
        for (let x of f) {
            if (isNumeric(x)) {
                fStr += `[${x}]`;
            } else {
                fStr += `['${x}']`;
            }
        }
        let eq = eval(`obj1${fStr} === obj2${fStr}`);
        let colorCode = '\u001b[1;31m ';
        if (eq) {
            colorCode = '\u001b[1;32m ';
        }
        console.log(`${colorCode}obj1${fStr} ${eq ? '=' : '!'}== obj2${fStr}`)
    }
}

const dataSet1 = {
    field1: 'value 1',
    field2: 331,
    field3: [
        { field1: 1, field2: 'value 2', field3: 'value 3' },
        { field1: 2, field2: 'value 4', field3: 'value 5' },
        { field1: 3, field2: 'value 6', field3: 'value 7' },
    ],
    field4: {
        field1: 'value 8',
        field2: 'value 9',
        field3: {
            field1: 'value 10',
            field2: 'value 11',
        },
    }
}
let logFieldValue = () => {
    console.log(`\u001b[0m dataSet1.field3[1].field2: ${dataSet1.field3[1].field2}`)
}
logFieldValue()

const dataSet2 = produce(dataSet1, obj => {
    obj.field3[1].field2 = 'value 4 new'
})
compare(dataSet1, dataSet2);
logFieldValue()

const dataSet3 = JSON.parse(JSON.stringify(dataSet1))
dataSet3.field3[1].field2 = 'value 4 new'
compare(dataSet1, dataSet3);
logFieldValue()

const dataSet4 = {
    ...dataSet1
}
dataSet4.field3 = [...dataSet4.field3]
dataSet4.field3[1] = { ...dataSet4.field3[1] }
dataSet4.field3[1].field2 = 'value 4 new'
compare(dataSet1, dataSet4);
logFieldValue()

