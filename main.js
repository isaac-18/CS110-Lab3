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
            nameStrong = document.createElement('strong');
            nameStrong.appendChild(document.createTextNode(tweet.user['name']));
            userInfo.appendChild(nameStrong);

            // Need to include date in this
            handleAndDate = document.createElement('span');
            date = moment(tweet.created_at, 'YYYY-MM-DDTHH:mm:s').format('MMM D YY');
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

            document.getElementById('tweet-container').appendChild(tweetDiv);

            // If adding on top might need to do this. Error occurs since only one element exists initially.
            // document.getElementById('tweet-container').insertBefore(tweetDiv);
        }
    });
    // console.log(tweetObjects);
}