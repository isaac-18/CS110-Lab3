function ping() {
    const url =
        "http://ec2-54-219-224-129.us-west-1.compute.amazonaws.com:2000/feed/random?q=weather";

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            // do something with data
            // console.log(data);
            refreshTweets(data);
        })
        .catch((err) => {
            // error catching
            console.log(err);
        });
}

// Stores string representation of id since int representation (64) is greater than JS limits (53)
// See links for more: 
// https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/tweet
// https://developer.twitter.com/en/docs/twitter-ids
var tweetIDs = [];
var tweetObjects = [];
// const tweetContainer = document.getElementById('tweet-container');

function refreshTweets(data) {
    statuses = data.statuses;
    console.log(statuses.length);
    statuses.forEach((tweet) => {
        if (!tweetIDs.includes(tweet.id_str)) {
            tweetIDs.push(tweet.id_str);
            tweetObjects.push(tweet);


            // Populating stuff. Consider making this a function.
            tweetDiv = document.createElement('div');
            tweetDiv.className = 'tweet';

            profilePic = document.createElement('img');
            profilePic.src = tweet.user['profile_image_url'];
            tweetDiv.appendChild(profilePic);

            tweetDetails = document.createElement('div');
            tweetDetails.className = 'tweet-details';

            userInfo = document.createElement('p');
            userInfo.className = 'username';
            userInfo.appendChild(document.createTextNode(tweet.user['name']));
            tweetDetails.appendChild(userInfo);


            tweetText = document.createElement('p');
            tweetText.className = 'tweet-text';
            tweetText.appendChild(document.createTextNode(tweet.text));
            tweetDetails.appendChild(tweetText);

            tweetDiv.appendChild(tweetDetails);

            document.getElementById('tweet-container').appendChild(tweetDiv);

            // If adding on top might need to do this. Error occurs since only one element exists initially.
            // document.getElementById('tweet-container').insertBefore(tweetDiv);
        }
    });
    // console.log(tweetObjects);
}


// const tweetContainer = document.getElementById('tweet-container');

// /**
//  * Removes all existing tweets from tweetList and then append all tweets back in
//  *
//  * @param {Array<Object>} tweets - A list of tweets
//  * @returns None, the tweets will be renewed
//  */
// function sampleRefreshTweets(tweets) {
//     // feel free to use a more complicated heuristics like in-place-patch, for simplicity, we will clear all tweets and append all tweets back
//     // {@link https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript}
//     while (tweetContainer.firstChild) {
//         tweetContainer.removeChild(tweetContainer.firstChild);
//     }

//     // create an unordered list to hold the tweets
//     // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement}
//     const tweetList = document.createElement("ul");
//     // append the tweetList to the tweetContainer
//     // {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild}
//     tweetContainer.appendChild(tweetList);

//     // all tweet objects (no duplicates) stored in tweets variable

//     // filter on search text
//     // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}
//     const filteredResult = tweets.filter(...);
//     // sort by date
//     // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort}
//     const sortedResult = filteredResult.sort(...);

//     // execute the arrow function for each tweet
//     // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
//     sortedResult.forEach(tweetObject => {
//         // create a container for individual tweet
//         const tweet = document.createElement("li");

//         // e.g. create a div holding tweet content
//         const tweetContent = document.createElement("div");
//         // create a text node "safely" with HTML characters escaped
//         // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode}
//         const tweetText = document.createTextNode(tweetObject.text);
//         // append the text node to the div
//         tweetContent.appendChild(tweetText);

//         // you may want to put more stuff here like time, username...
//         tweet.appendChild(tweetContent);

//         // finally append your tweet into the tweet list
//         tweetList.appendChild(tweet);
//     });
// }