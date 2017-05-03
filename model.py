from config import db
import datetime

retweets = db.Table('retweets',
	db.Column('user_id',db.Integer, db.ForeignKey('users.id')),
		db.Column('tweet_id', db.Integer, db.ForeignKey('tweets.id'))
)

favorites = db.Table('favorites',
	db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
	db.Column('tweet_id',db.Integer, db.ForeignKey('tweets.id'))
)	 


class Users(db.Model):
	__tablename__ = 'users'
	id = db.Column(db.Integer, primary_key = True)
	username = db.Column(db.String(15), unique = True)
	password = db.Column(db.String)
	tweets = db.relationship('Tweets', backref='author', lazy ='dynamic')
	favorites = db.relationship('Tweets', secondary=favorites, backref = db.backref('favorited', lazy = 'dynamic'))
	retweets = db.relationship('Tweets', secondary=retweets, backref=db.backref('retweeted', lazy='dynamic'))


	def __init__(self, username,password):
		self.username = username
		self.password = password

class Tweets(db.Model):
	__tablename__= 'tweets'
	id = db.Column(db.Integer, primary_key = True)
	content = db.Column(db.String(40))
	when = db.Column(db.TIMESTAMP)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	# favorites = db.relationship('Favorites', backref ='tweets', lazy = 'dynamic') 

	def __init__(self, content, when, author):
		self.content = content
		self.when = when
		self.author = author

def verify_user(username,password):
	user = Users.query.filter_by(username = username).first()
	user_pass = user.password
	if user == None or user_pass != password:
		return False
	else:
		return True

def enter_user(username, password):
	user = Users.query.filter_by(username=username).first()
	if user != None:
		return False
	else:
		new_user = Users(username,password)
		db.session.add(new_user)
		db.session.commit()
		return True

def get_feed():
	feed = []
	results = Tweets.query.all()
	for result in results:
		user = Users.query.filter_by(id = result.user_id).first()
		username = user.username
		tweet = {
		"content":"{}".format(result.content),
		"when":"{}".format(result.when),
		"who":"{}".format(username),
		"id":"{}".format(result.id)
		}
		feed.append(tweet)	
	return feed

def get_favorites(username):
	favorites = []
	user = Users.query.filter_by(username=username).first()
	for fave in user.favorites:
		author_id = fave.user_id
		author_obj = Users.query.filter_by(id = author_id).first()
		author = author_obj.username
		tweet = {
		"content":"{}".format(fave.content),
		"when":"{}".format(fave.when),
		"who":"{}".format(author)
		}
		favorites.append(tweet)
	return favorites

def users_own(username):
	my_tweets = []
	user = Users.query.filter_by(username=username).first()
	tweets= Tweets.query.filter_by(user_id = user.id).all()
	for tweet in tweets:
		tweet={
		'content':"{}".format(tweet.content),
		'when':"{}".format(tweet.when)
		}
		my_tweets.append(tweet)
	return my_tweets

def retweeted(username, tweet_id):
	retweet = []
	current_time = datetime.datetime.now()
	user = Users.query.filter_by(username=username).first()
	tweet = Tweets.query.filter_by(id=tweet_id).first()
	tweet.retweeted.append(user)
	add_to_feed = Tweets(tweet.content, current_time, author=tweet.author)
	tweet={
	"content" : "{}".format(add_to_feed.content),
	"who":"retweeted by {}".format(username),
	"author":"{}".format(tweet.author.username),
	"when":"{}".format(tweet.when)
	}
	# retweet.append(tweet)
	db.session.add(add_to_feed)
	db.session.commit()
	return tweet