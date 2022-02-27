var isPalindrome = function(x) {
    if (typeof(x) === "string") {
        input = x;
        output = x.split("").reverse().join("");

        return input == output;
    }
    return false;
};

var runTestCases = () =>
{
    testCases = [];
    testCases.push(["tacocat", true]);
    testCases.push(["blah", false]);
    testCases.push([false, false]);
    testCases.push([42, false]);
    testCases.push(["pasketti", false]);

    let passed = true;
    testCases.forEach(element => {
        if (element[1] != isPalindrome(element[0]))
        {
            passed = false;
        }
    });

    passed ? console.log("All tests passed! :)"): console.log("Not all tests passed! :(");
}

runTestCases();
