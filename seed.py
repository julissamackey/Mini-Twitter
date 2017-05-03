import config
from model import *
import datetime

config.db.drop_all()
config.db.create_all()

current_time = datetime.datetime.now()

first_user = Users('thejohnsmith','password')
second_user = Users('janemakesdoe','password')
third_user = Users('somelinuxfan', 'password')

first_tweet = Tweets('sometimes I wish my name was Will...',current_time, author = first_user)
second_tweet = Tweets('beyonce beyonce beyonce' , current_time, author=second_user)
third_tweet = Tweets('Lorem Ipsum Bing Bang Boom', current_time, author=third_user)
fourth_tweet = Tweets('father john misty rules vs chicano batman, im a hipster, gluten free', current_time, author = first_user)

config.db.session.add(first_user)
config.db.session.add(second_user)
config.db.session.add(third_user)

config.db.session.add(first_tweet)
config.db.session.add(second_tweet)
config.db.session.add(third_tweet)
config.db.session.add(fourth_tweet)

fourth_tweet.favorited.append(first_user)
second_tweet.favorited.append(first_user)

third_tweet.retweeted.append(first_user)
first_tweet.retweeted.append(third_user)

config.db.session.commit()

print('db created & seeded')