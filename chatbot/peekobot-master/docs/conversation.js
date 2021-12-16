/* The chat const defines the Peekobot conversation.
 * 
 * It should be an object with numerical property names, and each property is an entry
 * in the conversation.
 * 
 * A conversation entry should have:
 *  - A "text" property that is what the chatbot says at this point in the conversation
 *  - Either:
 *     - A "next" property, which defines the next chat entry by stating a numerical key
 *       of the chat object and is used when the chatbot needs to say several things
 *       without input from the user
 *    OR
 *     - An "options" property that defines the choices a user can take this is an
 *       array of option objects
 * 
 * An options object should have:
 *  - a "text" property that is the label for the user's choice
 *  AND EITHER
 *  - a "next" property that defines the next chat entry by stating a numerical key of
 *    the chat object and is used when the user selects this option
 *  OR
 *  - a "url" property that defines a link for the user to be taken to
 * 
 * A simple example chat object is:
 * const chat = {
 *     1: {
 *         text: 'Good morning sir',
 *         next: 2
 *     },
 *     2: {
 *         text: 'Would you like tea or coffee with your breakfast?',
 *         options: [
 *             {
 *                 text: 'Tea',
 *                 next: 3
 *             },
 *             {
 *                 text: 'Coffee',
 *                 next: 4
 *             }
 *         ]
 *     },
 *     3: {
 *         text: 'Splendid - a fine drink if I do say so myself.'
 *     },
 *     4: {
 *         text: 'As you wish, sir'
 *     }
 * }
 */
const chat = {
    1: {
        text: 'Welcome to Infinity Business !',
        options: [
            {
                text: '👋',
                next: 2
            }
        ]
    },
    2: {
        text: 'Our aim is to Simplify your life, impress your clients, win more deals, and skyrocket your productivity with our collection of free, designer-approved professional templates.',
        next: 3
    },
    3: {
        text: 'Please select the required option-',
        options: [
            {
                text: "About Pricing",
                next: 4
            },
            {
                text: "Tamplate categories",
                next: 5
            }
        ]
    },
    4: {
        text: 'Please select the option',
        options: [
            {
                text: "Pricing",
                url: "../../../pricing.html"
            }
            
        ]
    },
    5: {
        text: 'Please select the option',
        options: [
            {
                text: "Category",
                url: "../../../category_page.html"
            }
        ]
    },
    6: {
        text: 'You should check it out on GitHub',
        options: [
            {
                text: "Go to GitHub",
                url: "https://github.com/peekobot/peekobot"
            }
        ]
    }
};
