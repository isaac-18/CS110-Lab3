const url = "http://ec2-54-219-224-129.us-west-1.compute.amazonaws.com:2000/feed/random?q=weather";

// Stores string representation of id since int representation (64) is greater than JS limits (53):
// https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/tweet
// https://developer.twitter.com/en/docs/twitter-ids
var tweetIDs = [];
var tweetObjects = [];
var intervalID;
let searchString = "";

const handleSearch = event => {
    searchString = event.target.value.trim().toLowerCase();
    displayTweets();
}

function ping() {
    document.getElementById("searchBar").addEventListener("input", handleSearch);
    intervalID = setInterval(refreshTweets, 5000);
}

function pauseFeed() {
    clearInterval(intervalID);
}


function refreshTweets(data) {
    // Only fetch if box is not checked
    if (!document.getElementById("pauseFeed").checked) {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                // do something with data
                statuses = data.statuses;
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

/**
 * Checks if tweet contains search string
 * @param {*} item 
 * @returns {boolean} Returns true if the tweet object's text contains the search string
 */
function filterBySearch(item) {
    if (item.text.toLowerCase().includes(searchString)) {
        return true;
    }
    return false;
}

function displayTweets() {
    const tweetContainer = document.getElementById('tweet-container');

    // Adds all tweet objects containing search to new array 
    filteredTweets = tweetObjects.filter(filterBySearch);

    // Sort tweets based on id. See link for how Twitter ids work and why we can use them to sort.
    // https://developer.twitter.com/en/docs/twitter-ids
    sortedTweets = filteredTweets.sort(function (a, b) { return a.id - b.id })

    // Clears all tweets to redisplay 
    while (tweetContainer.firstChild) {
        tweetContainer.removeChild(tweetContainer.firstChild);
    }

    // Display sorted tweets
    sortedTweets.forEach((tweet) => {
        tweetDiv = document.createElement('div');
        tweetDiv.className = 'tweet';

        // Creates profile pic image element
        profilePic = document.createElement('img');
        profilePic.src = tweet.user['profile_image_url_https'];
        tweetDiv.appendChild(profilePic);

        // If pfp url is invalid, replaces it with default Remy pic
        profilePic.onerror = function () {
            this.src = './images/ratatouille.jpg';
            console.log('Error with pfp using default.');
        }.bind(profilePic);

        tweetDetails = document.createElement('div');
        tweetDetails.className = 'tweet-details';

        // Creates div for username
        userInfo = document.createElement('p');
        userInfo.className = 'username';
        nameStrong = document.createElement('strong');
        nameStrong.appendChild(document.createTextNode(tweet.user['name']));
        userInfo.appendChild(nameStrong);

        // Creates user handle and formats date
        handleAndDate = document.createElement('span');
        date = moment(tweet.created_at, 'YYYY-MM-DDTHH:mm:s').format('MMM D YY h:m A');
        handleAndDate.appendChild(document.createTextNode('@' + tweet.user['screen_name'] + '  ' + date))
        handleAndDate.style.color = 'gray';
        userInfo.appendChild(handleAndDate);

        tweetDetails.appendChild(userInfo);

        // Add tweet text to tweet div
        tweetText = document.createElement('p');
        tweetText.className = 'tweet-text';
        tweetText.appendChild(document.createTextNode(tweet.text));
        tweetDetails.appendChild(tweetText);

        tweetDiv.appendChild(tweetDetails);

        // Adds new tweet to page like a stack
        tweetContainer.insertAdjacentElement('afterbegin', tweetDiv);
    });
}