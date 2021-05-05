const url = "http://ec2-54-219-224-129.us-west-1.compute.amazonaws.com:2000/feed/random?q=weather";

// Stores string representation of id since int representation (64) is greater than JS limits (53)
// See links for more: 
// https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/tweet
// https://developer.twitter.com/en/docs/twitter-ids
var tweetIDs = [];
var tweetObjects = [];
var intervalID;
let searchString = "";

// function ping() {
//     fetch(url)
//         .then((res) => res.json())
//         .then((data) => {
//             // do something with data
//             // console.log(data);
//             refreshTweets(data);
//         })
//         .catch((err) => {
//             // error catching
//             console.log(err);
//         });
// }

function ping() {
    intervalID = setInterval(refreshTweets, 5000);
}

function pauseFeed() {
    clearInterval(intervalID);
}


function refreshTweets(data) {
    // Only fetch is box is not checked
    if (!document.getElementById("pauseFeed").checked) {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                // do something with data
                statuses = data.statuses;
                console.log(statuses.length);
                statuses.forEach((tweet) => {
                    if (!tweetIDs.includes(tweet.id_str)) {
                        tweetIDs.push(tweet.id_str);
                        tweetObjects.push(tweet);
                    }
                });
                displayTweets();
            })
            .catch((err) => {
                // error catching
                console.log(err);
            });
    }
    else {
        console.log('Feed is paused')
    }
}

function displayTweets() {
    const tweetContainer = document.getElementById('tweet-container');

    // Sort tweets based on id. See link for how Twitter ids work and why we can use them to sort.
    // https://developer.twitter.com/en/docs/twitter-ids
    sortedTweets = tweetObjects.sort(function (a, b) { return a.id - b.id })

    // Clears all tweets to redisplay 
    while (tweetContainer.firstChild) {
        tweetContainer.removeChild(tweetContainer.firstChild);
    }

    // Display sorted tweets
    sortedTweets.forEach((tweet) => {
        // Populating stuff. Consider making this a function.
        tweetDiv = document.createElement('div');
        tweetDiv.className = 'tweet';

        profilePic = document.createElement('img');
        profilePic.src = tweet.user['profile_image_url_https'];
        // profilePic.onerror = function () {
        //     profilePic.onerror = ''
        //     profilePic.src = './images/ratatouille.jpg';
        //     console.log('Error with pfp: ' + tweet.user['profile_image_url_https']);
        // }
        tweetDiv.appendChild(profilePic);

        tweetDetails = document.createElement('div');
        tweetDetails.className = 'tweet-details';

        userInfo = document.createElement('p');
        userInfo.className = 'username';
        nameStrong = document.createElement('strong');
        nameStrong.appendChild(document.createTextNode(tweet.user['name']));
        userInfo.appendChild(nameStrong);

        // Need to include date in this
        handleAndDate = document.createElement('span');
        date = moment(tweet.created_at, 'YYYY-MM-DDTHH:mm:s').format('MMM D YY h:m A');
        console.log(date);
        handleAndDate.appendChild(document.createTextNode('@' + tweet.user['screen_name'] + '  ' + date))
        handleAndDate.style.color = 'gray';
        userInfo.appendChild(handleAndDate);

        tweetDetails.appendChild(userInfo);


        tweetText = document.createElement('p');
        tweetText.className = 'tweet-text';
        tweetText.appendChild(document.createTextNode(tweet.text));
        tweetDetails.appendChild(tweetText);

        tweetDiv.appendChild(tweetDetails);

        // tweetContainer.appendChild(tweetDiv);
        tweetContainer.insertAdjacentElement('afterbegin', tweetDiv);
        // document.getElementById('searchBar').insertAdjacentElement('afterend', tweetDiv);
    });
}