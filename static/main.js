$(document).ready(function(){
console.log('here we go');
$('.existingUsers').one('click',function(){
	$('.getUserInfo').show();
	$('.newUsers').hide();
})
var tweetId = "";
var username = "";
var baseURL = "http://127.0.0.1:3000/";
var logInEP = "log-in?"; //username=&password=
var feedEP = "feed";
var repostEP = "retweet?";//username=&tweetID=
var usersOwnEP = "my-tweets?username=";

$('.getUserInfo').submit(function(event){
	event.preventDefault();
	username = document.querySelector('.username form input[type="text"]').value;
	password = document.querySelector('.password form input[type="text"]').value;
	logInAjax(baseURL+logInEP+'username='+username+'&password='+password);

	});

var logInAjax = function(url){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onload = function(){
		if (xhr.status >= 200 && xhr.status < 400){
			getFeed();	
		}else{
			console.log('wack connection');
		}
	};
	xhr.onerror = function(){
		console.log('eeerrrrrr')
	}
	xhr.send();
}; 

var getFeed = function(){
	$('.logIn').hide();
	feedAjax(baseURL+feedEP);
};

var feedAjax = function(url){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onload = function(){
		if (xhr.status >= 200 && xhr.status < 400){
			var response = xhr.responseText;
			var jsonResponse = JSON.parse(response);
			showFeed(jsonResponse);	
		}else{
			console.log('wack connection');
		}
	};
	xhr.onerror = function(){
		console.log('eeerrrrrr')
	}
	xhr.send();
};  

var prependTofeed = function(jsonResponse){
	var current = jsonResponse.response;
	console.log(current)
	var tweetContent = document.createElement('p'); 
	tweetContent.innerHTML='"'+current.content+'"';
	tweetContent.setAttribute('class','content');
	console.log(tweetContent)
	var tweetWhen = document.createElement('p');
	tweetWhen.innerHTML=current.when;
	var tweetAuthor = document.createElement('p');
	tweetAuthor.innerHTML= current.author;
	var tweetWho = document.createElement('p');
	tweetWho.innerHTML=current.who;
	tweetWho.setAttribute('class','content');
	var repostButton = document.createElement('button');
	repostButton.setAttribute('class','repostButton');
	repostButton.innerHTML = 'say it again';
	var yasButton = document.createElement('button');
	yasButton.setAttribute('class','yasButton');
	yasButton.innerHTML='yas';
	var each = document.createElement('div');
	each.setAttribute('class',tweetId);
	each.appendChild(tweetContent);
	each.appendChild(tweetWhen);
	each.appendChild(tweetAuthor);
	each.appendChild(tweetWho);
	each.appendChild(yasButton);
	each.appendChild(repostButton);
	$('.tweets').prepend(each);	
}


var showFeed = function(jsonResponse){
		$('.createPost').show();
		$('.viewTweets').show();
		console.log(jsonResponse.feed);
		var feed = jsonResponse.feed;
		for (var i = 0; i<feed.length; i++){
			console.log(feed[i]);
			current = feed[i];
			tweetId = current.id;
			// var tweet = document.createElement('p');
			// tweet.innerHTML =feed[i];
			var tweetContent = document.createElement('p'); 
			tweetContent.innerHTML='"'+current.content+'"';
			tweetContent.setAttribute('class','content');
			console.log(tweetContent)
			var tweetWhen = document.createElement('p');
			tweetWhen.innerHTML=current.when;
			var tweetWho = document.createElement('p');
			tweetWho.innerHTML=current.who;
			tweetWho.setAttribute('class','content');
			var repostButton = document.createElement('button');
			repostButton.setAttribute('class','repostButton');
			repostButton.innerHTML = 'say it again';
			var yasButton = document.createElement('button');
			yasButton.setAttribute('class','yasButton');
			yasButton.innerHTML='yas';
			var each = document.createElement('div');
			each.setAttribute('class',tweetId);
			each.appendChild(tweetContent);
			each.appendChild(tweetWhen);
			each.appendChild(tweetWho);
			each.appendChild(yasButton);
			each.appendChild(repostButton);
			$('.tweets').append(each);
		}
	}
var tweets = document.querySelector('.tweets');

tweets.addEventListener('click',function(event){
	console.log(event.target);
	var clicked = event.target;
	var tweetClicked = clicked.parentNode;
	var tweetClass = tweetClicked.getAttribute('class');
	tweetId = parseInt(tweetClass);
	var button = clicked.getAttribute('class');
	if (button === 'yasButton'){
		console.log('YASSSSS');
	}else if (button === 'repostButton'){
		repostAjax(baseURL+repostEP+'username='+username+'&tweetID='+tweetId)
	}else{
		console.log('bigggg whoop');
	};
});

var repostAjax = function(url){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.onload = function(){
		if (xhr.status >= 200 && xhr.status < 400){
			var response = xhr.responseText;
			var jsonResponse = JSON.parse(response);
			prependTofeed(jsonResponse);	
		}else{
			console.log('wack connection');
		}
	};
	xhr.onerror = function(){
		console.log('eeerrrrrr')
	}
	xhr.send();
};

var usersOwn = document.querySelector('.usersOwn');
usersOwn.addEventListener("click",function(event){
	event.preventDefault();
	usersOwnAjax(baseURL+usersOwnEP+username);
});

var usersOwnAjax = function(url){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onload = function(){
		if (xhr.status >= 200 && xhr.status < 400){
			var response = xhr.responseText;
			var jsonResponse = JSON.parse(response);
			showUserTweets(jsonResponse);	
		}else{
			console.log('wack connection');
		}
	};
	xhr.onerror = function(){
		console.log('eeerrrrrr')
	}
	xhr.send();
}; 

var showUserTweets = function(jsonResponse){
	$('.tweets').hide();
	response = jsonResponse.tweets;
	var show = response.map(function(response){
		var myTweet = document.createElement('div');
		myTweet.setAttribute('class','usersOwnTweets');
		var tweetContent = document.createElement('p');
		tweetContent.innerHTML = response.content;
		var tweetWhen = document.createElement('p');
		tweetWhen.innerHTML = response.when;
		myTweet.appendChild(tweetContent);
		myTweet.appendChild(tweetWhen);
		$('.myTweets').append(myTweet)
	})	
}
});
