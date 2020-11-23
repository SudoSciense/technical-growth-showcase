// Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.

// Clarification:
// What should we return when needle is an empty string? This is a great question to ask during an interview.
// For the purpose of this problem, we will return 0 when needle is an empty string. This is consistent to C's strstr() and Java's indexOf().

// Example 1:

// Input: haystack = "hello", needle = "ll"
// Output: 2

// Example 2:

// Input: haystack = "aaaaa", needle = "bba"
// Output: -1

// Example 3:

// Input: haystack = "", needle = ""
// Output: 0

var substrExistsWhere = (stringToSearchIn, subStr) => 
{
    // Lets immediately check if we can even perform operations. A return value for
    // this situation wasn't specified so let's just return -1 even if inputs aren't
    // strings.
    if((typeof stringToSearchIn == "string") &&
       (typeof subStr == "string"))
    {
        // Trivial case.
        if (subStr.length == 0)
        {
            console.log("Returning: 0");
            return 0;
        }

        // Another trivial case.
        else if (!stringToSearchIn.includes(subStr)) 
        {
            console.log("Returning: -1");
            return -1;
        }

        // Now we know it's in there somewhere. Find the index.
        else 
        {
            for (i = 0; i < stringToSearchIn.length; i++)
            {
                if (stringToSearchIn.substr(i,subStr.length) == subStr)
                {
                    console.log("Returning: " + i);
                    return i;
                }
            }
        }
    }

    else 
    {
        console.log("Sorry but I need strings to search. Returning -1.");
        return -1;
    }
}

var runTestCases = () => 
{
    testCases = [];
    testCases.push(["", "", 0]);
    testCases.push(["hello", "ll", 2]);
    testCases.push(["aaaaa", "bba", -1]);
    testCases.push(["Job", "Hfnskfhnjakfh", -1]);
    testCases.push(["", "The Wonder Years", -1]);
    testCases.push(["Jason Statham", "", 0]);
    testCases.push([false, 15, -1]);

    let passed = true;
    testCases.forEach(element => {
        if (element[2] != substrExistsWhere(element[0], element[1]))
        {
            passed = false;
        }
    });

    passed ? console.log("All tests passed! :)"): console.log("Not all tests passed! :(");
}

runTestCases();
