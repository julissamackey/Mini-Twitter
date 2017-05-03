from flask import render_template, request, jsonify
from config import db, app
from model import *
import json

@app.route('/')
def landing_page():
	return render_template('index.html')

@app.route('/log-in', methods = ['GET'])
def check_user_info():
	if request.method == 'GET':
		username = request.args.get('username')
		password = request.args.get('password')		
		response = verify_user(username,password)
		if response == True:
			return jsonify(
				response = response)
			
@app.route('/create-user', methods = ['POST'])
def create_user():
	if request.method == 'POST':
		username = request.args.get('username')
		password = request.args.get('password')
		response = enter_user(username,password)
		return jsonify(
			response = response)

@app.route('/feed', methods = ['GET'])
def show_feed():
	if request.method == 'GET':
		feed = get_feed()
		return jsonify (
			feed = feed) 

@app.route('/favorites', methods = ['GET'])
def show_favorites():
	if request.method == 'GET':
		username = request.args.get('username')
		favorites = get_favorites(username)
		return jsonify(
			favorites = favorites)	

@app.route('/my-tweets', methods = ['GET'])
def my_tweets():
	if request.method == 'GET':
		username = request.args.get('username')
		tweets = users_own(username)
		return jsonify(
			tweets = tweets)

@app.route('/retweet',methods=['POST'])
def retweet():
	if request.method == 'POST':
		user = request.args.get('username')
		tweet = request.args.get('tweetID')
		retweet = retweeted(user,tweet)
		return jsonify(
			response = retweet)		

@app.route('/yas',methods=['POST'])
def yas():
	if request.method == 'POST':
		user = request.args.get('username')
		tweet = request.args.get('tweetID')
		favorite = add_favorite(user, tweet)
		return jsonify(
			response = favorite)

if __name__  ==	"__main__":
	app.run(debug=True, threaded=True, port= 3000)